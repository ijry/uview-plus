const DEFAULT_TIMEOUT = 15000
const DEFAULT_CHUNK_SIZE = 64 * 1024

function normalizeMessage(input) {
    const data = input && input.detail ? input.detail.data : input
    if (Array.isArray(data)) {
        return data[data.length - 1] || null
    }
    return data || null
}

function toError(error, fallback) {
    if (error instanceof Error) return error
    if (error && error.message) return new Error(error.message)
    return new Error(error ? String(error) : fallback)
}

export function createWebViewCanvasBridge(options = {}) {
    const getWebView = typeof options.getWebView === 'function'
        ? options.getWebView
        : () => options.webView
    const chunkSize = Math.max(1024, Number(options.chunkSize) || DEFAULT_CHUNK_SIZE)
    const pending = Object.create(null)
    const readyWaiters = []
    let sequence = 0
    let destroyed = false
    let readyInfo = null
    let readyPingTimer = null

    const rejectPending = (error) => {
        Object.keys(pending).forEach((requestId) => {
            const request = pending[requestId]
            clearTimeout(request.timer)
            delete pending[requestId]
            request.reject(error)
        })
    }

    const scheduleReadyPing = () => {
        if (destroyed || readyInfo || readyPingTimer) return
        const ping = () => {
            readyPingTimer = null
            if (destroyed || readyInfo) return
            try {
                const webView = getWebView()
                if (webView && typeof webView.evalJs === 'function') {
                    webView.evalJs('window.__upCanvasRuntime && window.__upCanvasRuntime.announceReady()')
                }
            } catch (error) {
                if (typeof options.onError === 'function') options.onError(error)
            }
            readyPingTimer = setTimeout(ping, 100)
        }
        ping()
    }

    const resolveReady = (message) => {
        const previousSessionId = readyInfo && readyInfo.sessionId
        if (previousSessionId && message.sessionId && previousSessionId !== message.sessionId) {
            rejectPending(new Error('Canvas WebView reloaded'))
        }
        readyInfo = message
        if (readyPingTimer) {
            clearTimeout(readyPingTimer)
            readyPingTimer = null
        }
        readyWaiters.splice(0).forEach((waiter) => {
            clearTimeout(waiter.timer)
            waiter.resolve(message)
        })
        if (typeof options.onReady === 'function') options.onReady(message)
    }

    const ready = (timeout = DEFAULT_TIMEOUT) => {
        if (destroyed) return Promise.reject(new Error('Canvas WebView bridge destroyed'))
        if (readyInfo) return Promise.resolve(readyInfo)
        return new Promise((resolve, reject) => {
            const waiter = {
                resolve,
                reject,
                timer: setTimeout(() => {
                    const index = readyWaiters.indexOf(waiter)
                    if (index !== -1) readyWaiters.splice(index, 1)
                    reject(new Error('Canvas WebView ready timeout'))
                }, timeout)
            }
            readyWaiters.push(waiter)
            scheduleReadyPing()
        })
    }

    const settleRequest = (requestId, error, result) => {
        const request = pending[requestId]
        if (!request) return false
        clearTimeout(request.timer)
        delete pending[requestId]
        if (error) request.reject(error)
        else request.resolve(result)
        return true
    }

    const request = async (type, payload, timeout = DEFAULT_TIMEOUT) => {
        await ready(timeout)
        if (destroyed) throw new Error('Canvas WebView bridge destroyed')

        const webView = getWebView()
        if (!webView || typeof webView.evalJs !== 'function') {
            throw new Error('Canvas WebView is unavailable')
        }

        const requestId = ++sequence
        const serialized = JSON.stringify({ requestId, type, payload: payload || {} })
        const total = Math.max(1, Math.ceil(serialized.length / chunkSize))

        return new Promise((resolve, reject) => {
            pending[requestId] = {
                resolve,
                reject,
                timer: setTimeout(() => {
                    settleRequest(requestId, new Error(`Canvas ${type} request timeout`))
                }, timeout)
            }

            try {
                const asyncSends = []
                for (let index = 0; index < total; index += 1) {
                    const chunk = serialized.slice(index * chunkSize, (index + 1) * chunkSize)
                    const result = webView.evalJs(
                        `window.__upCanvasRuntime.receiveChunk(${JSON.stringify(requestId)}, ${index}, ${total}, ${JSON.stringify(chunk)})`
                    )
                    if (result && typeof result.then === 'function') asyncSends.push(result)
                }
                if (asyncSends.length) {
                    Promise.all(asyncSends).catch((error) => {
                        settleRequest(requestId, toError(error, 'Canvas request dispatch failed'))
                    })
                }
            } catch (error) {
                settleRequest(requestId, toError(error, 'Canvas request dispatch failed'))
            }
        })
    }

    const handleMessage = (input) => {
        const message = normalizeMessage(input)
        if (!message || message.channel !== 'u-canvas') return false

        if (message.action === 'canvasReady') {
            resolveReady(message)
            return true
        }
        if (message.action === 'canvasTouch') {
            if (typeof options.onTouch === 'function') options.onTouch(message)
            return true
        }
        if (message.action === 'canvasResponse') {
            return settleRequest(message.requestId, null, message.result)
        }
        if (message.action === 'canvasError') {
            const error = new Error(message.message || 'Canvas WebView request failed')
            if (!settleRequest(message.requestId, error) && typeof options.onError === 'function') {
                options.onError(error)
            }
            return true
        }
        return false
    }

    const destroy = () => {
        if (destroyed) return
        destroyed = true
        if (readyPingTimer) clearTimeout(readyPingTimer)
        readyPingTimer = null
        const error = new Error('Canvas WebView bridge destroyed')
        readyWaiters.splice(0).forEach((waiter) => {
            clearTimeout(waiter.timer)
            waiter.reject(error)
        })
        rejectPending(error)
    }

    return {
        ready,
        request,
        handleMessage,
        destroy
    }
}

function normalizeImageDataArgs(args) {
    if (args.length === 1 && args[0] && typeof args[0] === 'object') return args[0]
    return { x: args[0], y: args[1], width: args[2], height: args[3] }
}

function normalizePutImageDataArgs(args) {
    if (args.length === 1 && args[0] && typeof args[0] === 'object') return args[0]
    return { data: args[0], x: args[1], y: args[2], width: args[3], height: args[4] }
}

function cloneOptions(options) {
    const result = {}
    Object.keys(options || {}).forEach((key) => {
        if (typeof options[key] !== 'function') result[key] = options[key]
    })
    return result
}

function withCallbacks(promise, options) {
    const success = options && options.success
    const fail = options && options.fail
    const complete = options && options.complete
    return promise.then((result) => {
        if (typeof success === 'function') success(result)
        if (typeof complete === 'function') complete(result)
        return result
    }, (error) => {
        if (typeof fail === 'function') fail(error)
        if (typeof complete === 'function') complete(error)
        throw error
    })
}

export function createWebViewCanvasContext(options = {}) {
    const bridge = options.bridge
    if (!bridge || typeof bridge.request !== 'function') {
        throw new Error('Canvas WebView bridge is required')
    }

    const resolveImage = typeof options.resolveImage === 'function'
        ? options.resolveImage
        : source => Promise.resolve(source)
    const measureTextFallback = typeof options.measureText === 'function'
        ? options.measureText
        : (text, state) => {
            const matched = String(state.font || '').match(/(\d+(?:\.\d+)?)px/)
            const fontSize = matched ? Number(matched[1]) : 10
            return { width: String(text).length * fontSize * 0.6 }
        }
    const state = {
        fillStyle: '#000000',
        strokeStyle: '#000000',
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10,
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        font: '10px sans-serif',
        textAlign: 'start',
        textBaseline: 'alphabetic',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0,
        shadowColor: 'rgba(0,0,0,0)',
        lineDashOffset: 0,
        lineDash: []
    }
    const context = {}
    let commands = []
    let resources = Object.create(null)
    let resourceSequence = 0
    let drawTail = Promise.resolve()
    let lastDraw = drawTail

    const nextResourceId = type => `${type}-${++resourceSequence}`
    const rememberResource = (resource) => {
        resources[resource.id] = resource
        return { __upCanvasRef: resource.id }
    }
    const serializeValue = (value) => {
        if (value && value.__upCanvasResource) return rememberResource(value)
        if (Array.isArray(value)) return value.map(serializeValue)
        return value
    }
    const enqueueCall = (method, args) => {
        commands.push({
            type: 'call',
            method,
            args: (args || []).map(serializeValue)
        })
    }
    const enqueueSet = (property, value) => {
        commands.push({
            type: 'set',
            property,
            value: serializeValue(value)
        })
    }
    const property = name => ({
        enumerable: true,
        configurable: false,
        get() {
            return state[name]
        },
        set(value) {
            state[name] = value
            enqueueSet(name, value)
        }
    })

    Object.defineProperties(context, {
        fillStyle: property('fillStyle'),
        strokeStyle: property('strokeStyle'),
        lineWidth: property('lineWidth'),
        lineCap: property('lineCap'),
        lineJoin: property('lineJoin'),
        miterLimit: property('miterLimit'),
        globalAlpha: property('globalAlpha'),
        globalCompositeOperation: property('globalCompositeOperation'),
        font: property('font'),
        textAlign: property('textAlign'),
        textBaseline: property('textBaseline'),
        shadowOffsetX: property('shadowOffsetX'),
        shadowOffsetY: property('shadowOffsetY'),
        shadowBlur: property('shadowBlur'),
        shadowColor: property('shadowColor'),
        lineDashOffset: property('lineDashOffset')
    })

    const methodOperations = [
        'rect', 'clearRect', 'fillRect', 'strokeRect', 'fill', 'stroke',
        'beginPath', 'closePath', 'moveTo', 'lineTo', 'arc', 'arcTo',
        'bezierCurveTo', 'quadraticCurveTo', 'ellipse', 'clip', 'save',
        'restore', 'translate', 'rotate', 'scale', 'setTransform',
        'transform', 'resetTransform', 'fillText', 'strokeText'
    ]
    methodOperations.forEach((method) => {
        context[method] = (...args) => enqueueCall(method, args)
    })

    const createGradient = (kind, args) => {
        const resource = {
            __upCanvasResource: true,
            type: 'gradient',
            id: nextResourceId('gradient'),
            kind,
            args,
            stops: [],
            addColorStop(offset, color) {
                this.stops.push([Number(offset), String(color)])
            }
        }
        return resource
    }

    const imageSource = (source) => {
        if (typeof source === 'string') return source
        if (source && typeof source.src === 'string') return source.src
        throw new Error('Canvas image source must be a string')
    }

    const createImageResource = (source) => ({
        __upCanvasResource: true,
        type: 'image',
        id: nextResourceId('image'),
        source: Promise.resolve().then(() => resolveImage(imageSource(source)))
    })

    const snapshotResources = (resourceMap) => Object.keys(resourceMap).map((id) => {
        const resource = resourceMap[id]
        if (resource.type === 'gradient') {
            return Promise.resolve({
                type: 'gradient',
                id: resource.id,
                kind: resource.kind,
                args: resource.args.slice(),
                stops: resource.stops.map(stop => stop.slice())
            })
        }
        if (resource.type === 'image') {
            return resource.source.then(src => ({ type: 'image', id: resource.id, src }))
        }
        if (resource.type === 'pattern') {
            return resource.source.then(source => ({
                type: 'pattern',
                id: resource.id,
                source,
                repetition: resource.repetition
            }))
        }
        return Promise.reject(new Error(`Unsupported Canvas resource: ${resource.type}`))
    })

    context.createLinearGradient = (...args) => createGradient('linear', args)
    context.createRadialGradient = (...args) => createGradient('radial', args)
    context.createConicGradient = (...args) => createGradient('conic', args)
    context.createPattern = (source, repetition = 'repeat') => ({
        __upCanvasResource: true,
        type: 'pattern',
        id: nextResourceId('pattern'),
        source: Promise.resolve().then(() => resolveImage(imageSource(source))),
        repetition
    })
    context.drawImage = (source, ...args) => {
        const resource = source && source.__upCanvasResource
            ? source
            : createImageResource(source)
        enqueueCall('drawImage', [resource, ...args])
    }

    context.setFillStyle = value => { context.fillStyle = value }
    context.setStrokeStyle = value => { context.strokeStyle = value }
    context.setLineWidth = value => { context.lineWidth = value }
    context.setLineCap = value => { context.lineCap = value }
    context.setLineJoin = value => { context.lineJoin = value }
    context.setTextAlign = value => { context.textAlign = value }
    context.setTextBaseline = value => { context.textBaseline = value }
    context.setGlobalAlpha = value => { context.globalAlpha = value }
    context.setMiterLimit = value => { context.miterLimit = value }
    context.setGlobalCompositeOperation = value => { context.globalCompositeOperation = value }
    context.setFont = value => { context.font = value }
    context.setFontSize = value => {
        const size = Number(value) || 10
        context.font = /\d+(?:\.\d+)?px/.test(state.font)
            ? state.font.replace(/\d+(?:\.\d+)?px/, `${size}px`)
            : `${size}px sans-serif`
    }
    context.setShadow = (offsetX, offsetY, blur, color) => {
        context.shadowOffsetX = offsetX
        context.shadowOffsetY = offsetY
        context.shadowBlur = blur
        context.shadowColor = color
    }
    context.setLineDash = (segments) => {
        state.lineDash = Array.isArray(segments) ? segments.slice() : []
        enqueueCall('setLineDash', [state.lineDash])
    }
    context.getLineDash = () => state.lineDash.slice()

    context.measureText = text => measureTextFallback(String(text), state)
    context.measureTextAsync = text => bridge.request('measureText', {
        text: String(text),
        font: state.font
    })

    context.draw = (reserve = false, callback) => {
        const batchCommands = commands
        const batchResources = resources
        commands = []
        resources = Object.create(null)
        const execute = async () => {
            const definitions = await Promise.all(snapshotResources(batchResources))
            return bridge.request('draw', {
                reserve: !!reserve,
                commands: batchCommands,
                resources: definitions
            })
        }
        const operation = drawTail.then(execute, execute)
        drawTail = operation.catch(() => {})
        lastDraw = operation
        if (typeof callback === 'function') operation.then(result => callback(result))
        return operation
    }

    context.toTempFilePath = (options = {}) => withCallbacks(
        lastDraw.then(() => bridge.request('export', cloneOptions(options))),
        options
    )
    context.getImageData = (...args) => {
        const options = normalizeImageDataArgs(args)
        return withCallbacks(
            lastDraw.then(() => bridge.request('getImageData', cloneOptions(options))),
            options
        )
    }
    context.putImageData = (...args) => {
        const options = normalizePutImageDataArgs(args)
        const payload = cloneOptions(options)
        if (payload.data && payload.data.data) {
            payload.data = {
                width: payload.data.width,
                height: payload.data.height,
                data: Array.from(payload.data.data)
            }
        } else if (payload.data && !Array.isArray(payload.data)) {
            payload.data = Array.from(payload.data)
        }
        return withCallbacks(
            lastDraw.then(() => bridge.request('putImageData', payload)),
            options
        )
    }

    return context
}
