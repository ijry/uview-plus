(function () {
  'use strict'

  var canvas = document.getElementById('up-canvas')
  var context = canvas.getContext('2d')
  var chunks = Object.create(null)
  var imageCache = Object.create(null)
  var requestQueue = Promise.resolve()
  var sessionId = 'u-canvas-' + Date.now() + '-' + Math.floor(Math.random() * 1000000)
  var state = {
    width: 300,
    height: 150,
    dpr: 1,
    disableScroll: false
  }

  var methodOperations = new Set([
    'rect', 'clearRect', 'fillRect', 'strokeRect', 'fill', 'stroke',
    'beginPath', 'closePath', 'moveTo', 'lineTo', 'arc', 'arcTo',
    'bezierCurveTo', 'quadraticCurveTo', 'ellipse', 'clip', 'save',
    'restore', 'translate', 'rotate', 'scale', 'setTransform',
    'transform', 'resetTransform', 'fillText', 'strokeText', 'drawImage',
    'setLineDash'
  ])

  var writableProperties = new Set([
    'fillStyle', 'strokeStyle', 'lineWidth', 'lineCap', 'lineJoin',
    'miterLimit', 'globalAlpha', 'globalCompositeOperation', 'font',
    'textAlign', 'textBaseline', 'shadowOffsetX', 'shadowOffsetY',
    'shadowBlur', 'shadowColor', 'lineDashOffset'
  ])

  function postMessage(action, data) {
    if (!window.uni || typeof window.uni.postMessage !== 'function') {
      return false
    }
    window.uni.postMessage({
      data: Object.assign({
        channel: 'u-canvas',
        action: action,
        sessionId: sessionId
      }, data || {})
    })
    return true
  }

  function errorMessage(error) {
    return error && error.message ? error.message : String(error)
  }

  function announceReady() {
    postMessage('canvasReady', {
      canvasWidth: state.width,
      canvasHeight: state.height
    })
  }

  function clearBitmap() {
    context.save()
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.restore()
  }

  function initializeCanvas(payload) {
    var width = Math.max(0, Number(payload.width) || 0)
    var height = Math.max(0, Number(payload.height) || 0)
    var dpr = Math.max(1, Number(payload.dpr) || 1)

    state.width = width
    state.height = height
    state.dpr = dpr
    state.disableScroll = !!payload.disableScroll
    canvas.width = Math.max(1, Math.ceil(width * dpr))
    canvas.height = Math.max(1, Math.ceil(height * dpr))
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    canvas.style.touchAction = state.disableScroll ? 'none' : 'auto'
    context = canvas.getContext('2d')
    context.setTransform(dpr, 0, 0, dpr, 0, 0)

    return {
      width: width,
      height: height,
      dpr: dpr,
      sessionId: sessionId
    }
  }

  function loadImage(source) {
    if (imageCache[source]) {
      return imageCache[source]
    }

    imageCache[source] = new Promise(function (resolve, reject) {
      var image = new Image()
      image.onload = function () {
        resolve(image)
      }
      image.onerror = function () {
        delete imageCache[source]
        reject(new Error('Canvas image load failed'))
      }
      image.src = source
    })

    return imageCache[source]
  }

  function resolveValue(value, resources) {
    if (value && typeof value === 'object' && value.__upCanvasRef) {
      if (!resources[value.__upCanvasRef]) {
        throw new Error('Unknown Canvas resource: ' + value.__upCanvasRef)
      }
      return resources[value.__upCanvasRef]
    }
    return value
  }

  async function createResources(definitions) {
    var resources = Object.create(null)
    var items = Array.isArray(definitions) ? definitions : []

    for (var index = 0; index < items.length; index += 1) {
      var definition = items[index]
      if (!definition || !definition.id) {
        throw new Error('Invalid Canvas resource definition')
      }
      if (definition.type === 'gradient') {
        var gradient
        if (definition.kind === 'linear') {
          gradient = context.createLinearGradient.apply(context, definition.args || [])
        } else if (definition.kind === 'radial') {
          gradient = context.createRadialGradient.apply(context, definition.args || [])
        } else if (definition.kind === 'conic' && typeof context.createConicGradient === 'function') {
          gradient = context.createConicGradient.apply(context, definition.args || [])
        } else {
          throw new Error('Unsupported Canvas gradient: ' + definition.kind)
        }
        ;(definition.stops || []).forEach(function (stop) {
          gradient.addColorStop(Number(stop[0]), String(stop[1]))
        })
        resources[definition.id] = gradient
      } else if (definition.type === 'image') {
        resources[definition.id] = await loadImage(definition.src)
      }
    }

    for (var patternIndex = 0; patternIndex < items.length; patternIndex += 1) {
      var patternDefinition = items[patternIndex]
      if (!patternDefinition || patternDefinition.type !== 'pattern') continue
      var patternImage = patternDefinition.source
      if (patternImage && typeof patternImage === 'object' && patternImage.__upCanvasRef) {
        patternImage = resolveValue(patternImage, resources)
      } else if (typeof patternImage === 'string') {
        patternImage = await loadImage(patternImage)
      }
      var pattern = context.createPattern(patternImage, patternDefinition.repetition || 'repeat')
      if (!pattern) {
        throw new Error('Canvas pattern creation failed')
      }
      resources[patternDefinition.id] = pattern
    }

    return resources
  }

  async function executeBatch(payload) {
    var commands = Array.isArray(payload.commands) ? payload.commands : []
    var resources = await createResources(payload.resources)

    if (payload.reserve === false) {
      clearBitmap()
    }

    for (var index = 0; index < commands.length; index += 1) {
      var command = commands[index]
      if (!command || !command.type) {
        throw new Error('Invalid Canvas command')
      }

      if (command.type === 'set') {
        if (!writableProperties.has(command.property)) {
          throw new Error('Unsupported Canvas property: ' + command.property)
        }
        context[command.property] = resolveValue(command.value, resources)
        continue
      }

      if (command.type !== 'call' || !methodOperations.has(command.method)) {
        throw new Error('Unsupported Canvas method: ' + command.method)
      }
      if (command.method === 'resetTransform') {
        context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0)
        continue
      }
      if (typeof context[command.method] !== 'function') {
        throw new Error('Canvas method is unavailable: ' + command.method)
      }
      var args = (command.args || []).map(function (value) {
        return resolveValue(value, resources)
      })
      if (command.method === 'setTransform' && args.length >= 6) {
        args = [
          args[0] * state.dpr,
          args[1] * state.dpr,
          args[2] * state.dpr,
          args[3] * state.dpr,
          args[4] * state.dpr,
          args[5] * state.dpr
        ]
      }
      context[command.method].apply(context, args)
    }

    return {}
  }

  function measureText(payload) {
    context.save()
    if (payload.font) {
      context.font = payload.font
    }
    var metrics = context.measureText(String(payload.text || ''))
    context.restore()
    var result = { width: metrics.width }
    ;[
      'actualBoundingBoxLeft', 'actualBoundingBoxRight',
      'actualBoundingBoxAscent', 'actualBoundingBoxDescent',
      'fontBoundingBoxAscent', 'fontBoundingBoxDescent',
      'emHeightAscent', 'emHeightDescent', 'hangingBaseline',
      'alphabeticBaseline', 'ideographicBaseline'
    ].forEach(function (key) {
      if (typeof metrics[key] === 'number') result[key] = metrics[key]
    })
    return result
  }

  function getImageData(payload) {
    var dpr = state.dpr
    var imageData = context.getImageData(
      Math.round((Number(payload.x) || 0) * dpr),
      Math.round((Number(payload.y) || 0) * dpr),
      Math.max(1, Math.round((Number(payload.width) || state.width) * dpr)),
      Math.max(1, Math.round((Number(payload.height) || state.height) * dpr))
    )
    return {
      width: imageData.width,
      height: imageData.height,
      data: Array.prototype.slice.call(imageData.data)
    }
  }

  function putImageData(payload) {
    var source = payload.data && payload.data.data ? payload.data.data : payload.data
    var width = Number(payload.width || (payload.data && payload.data.width)) || 0
    var height = Number(payload.height || (payload.data && payload.data.height)) || 0
    if (!source || !width || !height) {
      throw new Error('Invalid Canvas image data')
    }
    var imageData = context.createImageData(width, height)
    imageData.data.set(new Uint8ClampedArray(source))
    context.putImageData(
      imageData,
      Math.round((Number(payload.x) || 0) * state.dpr),
      Math.round((Number(payload.y) || 0) * state.dpr)
    )
    return {}
  }

  function bitmapResult(requestId, imageData, extension, quality) {
    return new Promise(function (resolve, reject) {
      if (!window.plus || !plus.nativeObj || !plus.nativeObj.Bitmap) {
        resolve({ tempFilePath: imageData, imageData: imageData })
        return
      }

      var bitmapName = 'u-canvas-' + sessionId + '-' + requestId
      var bitmap = new plus.nativeObj.Bitmap(bitmapName)
      var filePath = '_doc/' + bitmapName + '.' + extension
      var fail = function (error) {
        bitmap.clear()
        reject(error instanceof Error ? error : new Error(errorMessage(error)))
      }

      bitmap.loadBase64Data(imageData, function () {
        bitmap.save(filePath, {
          overwrite: true,
          format: extension,
          quality: Math.round(Math.max(0, Math.min(1, quality)) * 100)
        }, function (event) {
          bitmap.clear()
          resolve({ tempFilePath: event.target || filePath })
        }, fail)
      }, fail)
    })
  }

  async function exportCanvas(requestId, payload) {
    var x = Number(payload.x) || 0
    var y = Number(payload.y) || 0
    var width = Number(payload.width) || state.width
    var height = Number(payload.height) || state.height
    var destWidth = Math.max(1, Math.round(Number(payload.destWidth) || width * state.dpr))
    var destHeight = Math.max(1, Math.round(Number(payload.destHeight) || height * state.dpr))
    var exportTarget = document.createElement('canvas')
    exportTarget.width = destWidth
    exportTarget.height = destHeight
    exportTarget.getContext('2d').drawImage(
      canvas,
      x * state.dpr,
      y * state.dpr,
      width * state.dpr,
      height * state.dpr,
      0,
      0,
      destWidth,
      destHeight
    )

    var fileType = String(payload.fileType || 'png').toLowerCase()
    var isJpeg = fileType === 'jpg' || fileType === 'jpeg'
    var quality = payload.quality === undefined ? 1 : Number(payload.quality)
    var imageData = exportTarget.toDataURL(isJpeg ? 'image/jpeg' : 'image/png', quality)
    return bitmapResult(requestId, imageData, isJpeg ? 'jpg' : 'png', quality)
  }

  async function executeRequest(request) {
    var payload = request.payload || {}
    if (request.type === 'init') return initializeCanvas(payload)
    if (request.type === 'draw') return executeBatch(payload)
    if (request.type === 'export') return exportCanvas(request.requestId, payload)
    if (request.type === 'measureText') return measureText(payload)
    if (request.type === 'getImageData') return getImageData(payload)
    if (request.type === 'putImageData') return putImageData(payload)
    throw new Error('Unsupported Canvas request: ' + request.type)
  }

  function queueRequest(request) {
    var run = async function () {
      try {
        var result = await executeRequest(request)
        postMessage('canvasResponse', {
          requestId: request.requestId,
          result: result
        })
      } catch (error) {
        postMessage('canvasError', {
          requestId: request.requestId,
          message: errorMessage(error)
        })
      }
    }
    requestQueue = requestQueue.then(run, run)
    return requestQueue
  }

  function receiveChunk(requestId, index, total, chunk) {
    var key = String(requestId)
    var chunkIndex = Number(index)
    var chunkTotal = Number(total)
    if (!chunks[key]) {
      chunks[key] = {
        total: chunkTotal,
        count: 0,
        parts: new Array(chunkTotal)
      }
    }
    var buffer = chunks[key]
    if (buffer.total !== chunkTotal || chunkIndex < 0 || chunkIndex >= chunkTotal) {
      delete chunks[key]
      postMessage('canvasError', {
        requestId: requestId,
        message: 'Invalid Canvas request chunks'
      })
      return
    }
    if (buffer.parts[chunkIndex] === undefined) {
      buffer.parts[chunkIndex] = String(chunk)
      buffer.count += 1
    }
    if (buffer.count !== buffer.total) return

    try {
      var request = JSON.parse(buffer.parts.join(''))
      if (String(request.requestId) !== key) {
        throw new Error('Canvas request ID mismatch')
      }
      queueRequest(request).finally(function () {
        delete chunks[key]
      })
    } catch (error) {
      delete chunks[key]
      postMessage('canvasError', {
        requestId: requestId,
        message: errorMessage(error)
      })
    }
  }

  function normalizeTouch(touch) {
    var rect = canvas.getBoundingClientRect()
    var scaleX = rect.width ? state.width / rect.width : 1
    var scaleY = rect.height ? state.height / rect.height : 1
    return {
      identifier: touch.identifier,
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
      clientX: touch.clientX,
      clientY: touch.clientY
    }
  }

  function forwardTouch(event) {
    if (state.disableScroll && event.cancelable) {
      event.preventDefault()
    }
    var touches = Array.prototype.map.call(event.touches || [], normalizeTouch)
    var changedTouches = Array.prototype.map.call(event.changedTouches || [], normalizeTouch)
    var primary = touches[0] || changedTouches[0] || { x: 0, y: 0 }
    postMessage('canvasTouch', {
      eventType: event.type,
      x: primary.x,
      y: primary.y,
      touches: touches,
      changedTouches: changedTouches,
      canvasWidth: state.width,
      canvasHeight: state.height
    })
  }

  canvas.addEventListener('touchstart', forwardTouch, { passive: false })
  canvas.addEventListener('touchmove', forwardTouch, { passive: false })
  canvas.addEventListener('touchend', forwardTouch, { passive: false })
  document.addEventListener('UniAppJSBridgeReady', announceReady)

  window.__upCanvasRuntime = {
    receiveChunk: receiveChunk,
    executeRequest: executeRequest,
    executeBatch: executeBatch,
    exportCanvas: exportCanvas,
    announceReady: announceReady
  }

  setTimeout(announceReady, 0)
})()
