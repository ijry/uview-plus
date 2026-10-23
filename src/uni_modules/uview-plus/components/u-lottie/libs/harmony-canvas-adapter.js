function parseFontSize(font) {
    const matched = String(font || '').match(/(\d+(?:\.\d+)?)px/)
    return matched ? Number(matched[1]) : 10
}

export function createHarmonyCanvasAdapter(options = {}) {
    const legacy = options.context
    if (!legacy) {
        throw new Error('harmony canvas context is required')
    }

    const width = Number(options.width) > 0 ? Number(options.width) : 1
    const height = Number(options.height) > 0 ? Number(options.height) : 1

    const state = {
        fillStyle: '#000000',
        strokeStyle: '#000000',
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10,
        lineDashOffset: 0,
        lineDash: [],
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        font: '10px sans-serif'
    }
    const stack = []
    const rafIds = new Set()
    let dirty = false
    let flushing = false
    let destroyed = false
    let flushTimer = null

    const flush = () => {
        if (destroyed || !dirty || flushing) return
        dirty = false
        flushing = true
        let released = false
        const release = () => {
            if (released) return
            released = true
            flushing = false
            if (dirty) scheduleFlush()
        }
        try {
            if (typeof legacy.draw === 'function') {
                legacy.draw(false, release)
                setTimeout(release, 80)
            } else {
                release()
            }
        } catch (error) {
            release()
        }
    }

    const scheduleFlush = () => {
        if (destroyed || flushTimer !== null) return
        const timer = setTimeout(() => {
            rafIds.delete(timer)
            if (flushTimer === timer) flushTimer = null
            flush()
        }, 0)
        flushTimer = timer
        rafIds.add(timer)
    }

    const markDirty = () => {
        dirty = true
        scheduleFlush()
    }

    const sync = () => {
        if (typeof legacy.setFillStyle === 'function') {
            legacy.setFillStyle(state.fillStyle)
        }
        if (typeof legacy.setStrokeStyle === 'function') {
            legacy.setStrokeStyle(state.strokeStyle)
        }
        if (typeof legacy.setLineWidth === 'function') {
            legacy.setLineWidth(state.lineWidth)
        }
        if (typeof legacy.setLineCap === 'function') {
            legacy.setLineCap(state.lineCap)
        }
        if (typeof legacy.setLineJoin === 'function') {
            legacy.setLineJoin(state.lineJoin)
        }
        if (typeof legacy.setMiterLimit === 'function') {
            legacy.setMiterLimit(state.miterLimit)
        }
        if (typeof legacy.setGlobalAlpha === 'function') {
            legacy.setGlobalAlpha(state.globalAlpha)
        }
        if (typeof legacy.setGlobalCompositeOperation === 'function') {
            legacy.setGlobalCompositeOperation(state.globalCompositeOperation)
        }
        if (typeof legacy.setLineDash === 'function') {
            legacy.setLineDash(state.lineDash, state.lineDashOffset)
        }
        if (typeof legacy.setFontSize === 'function') {
            legacy.setFontSize(parseFontSize(state.font))
        }
    }

    const canvas = {
        width,
        height,
        getContext() {
            return context
        },
        requestAnimationFrame(callback) {
            const timer = setTimeout(() => {
                rafIds.delete(timer)
                if (destroyed) return
                try {
                    callback(Date.now())
                } finally {
                    flush()
                }
            }, 33)
            rafIds.add(timer)
            return timer
        },
        cancelAnimationFrame(timer) {
            if (rafIds.has(timer)) {
                clearTimeout(timer)
                rafIds.delete(timer)
            }
        },
        createImage() {
            const image = {
                width: 0,
                height: 0,
                _src: '',
                _localPath: '',
                onload: null,
                onerror: null,
                addEventListener(type, callback) {
                    if (type === 'load') image.onload = callback
                    if (type === 'error') image.onerror = callback
                }
            }
            Object.defineProperty(image, 'src', {
                get() {
                    return image._src
                },
                set(value) {
                    image._src = value
                    uni.getImageInfo({
                        src: value,
                        success(result) {
                            image.width = result.width || 0
                            image.height = result.height || 0
                            image._localPath = result.path || value
                            if (typeof image.onload === 'function') image.onload()
                        },
                        fail() {
                            if (typeof image.onerror === 'function') image.onerror()
                        }
                    })
                }
            })
            return image
        }
    }

    const context = {
        canvas,
        get fillStyle() {
            return state.fillStyle
        },
        set fillStyle(value) {
            state.fillStyle = value
        },
        get strokeStyle() {
            return state.strokeStyle
        },
        set strokeStyle(value) {
            state.strokeStyle = value
        },
        get lineWidth() {
            return state.lineWidth
        },
        set lineWidth(value) {
            state.lineWidth = value
        },
        get lineCap() {
            return state.lineCap
        },
        set lineCap(value) {
            state.lineCap = value
        },
        get lineJoin() {
            return state.lineJoin
        },
        set lineJoin(value) {
            state.lineJoin = value
        },
        get miterLimit() {
            return state.miterLimit
        },
        set miterLimit(value) {
            state.miterLimit = value
        },
        get lineDashOffset() {
            return state.lineDashOffset
        },
        set lineDashOffset(value) {
            state.lineDashOffset = value
        },
        get globalAlpha() {
            return state.globalAlpha
        },
        set globalAlpha(value) {
            state.globalAlpha = value
        },
        get globalCompositeOperation() {
            return state.globalCompositeOperation
        },
        set globalCompositeOperation(value) {
            state.globalCompositeOperation = value
        },
        get font() {
            return state.font
        },
        set font(value) {
            state.font = value
        },
        save() {
            stack.push(Object.assign({}, state))
            if (typeof legacy.save === 'function') legacy.save()
        },
        restore() {
            if (stack.length) Object.assign(state, stack.pop())
            if (typeof legacy.restore === 'function') legacy.restore()
            sync()
        },
        translate(x, y) {
            legacy.translate(x, y)
        },
        scale(x, y) {
            legacy.scale(x, y)
        },
        rotate(angle) {
            legacy.rotate(angle)
        },
        transform(a, b, c, d, e, f) {
            if (typeof legacy.transform === 'function') {
                legacy.transform(a, b, c, d, e, f)
            }
        },
        setTransform(a, b, c, d, e, f) {
            if (typeof legacy.setTransform === 'function') {
                legacy.setTransform(a, b, c, d, e, f)
            } else if (typeof legacy.transform === 'function') {
                legacy.transform(a, b, c, d, e, f)
            }
        },
        beginPath() {
            legacy.beginPath()
        },
        closePath() {
            legacy.closePath()
        },
        moveTo(x, y) {
            legacy.moveTo(x, y)
        },
        lineTo(x, y) {
            legacy.lineTo(x, y)
        },
        bezierCurveTo(a, b, c, d, e, f) {
            legacy.bezierCurveTo(a, b, c, d, e, f)
        },
        quadraticCurveTo(a, b, c, d) {
            if (typeof legacy.quadraticCurveTo === 'function') {
                legacy.quadraticCurveTo(a, b, c, d)
            }
        },
        rect(x, y, w, h) {
            legacy.rect(x, y, w, h)
        },
        arc(x, y, radius, start, end, anticlockwise) {
            if (typeof legacy.arc === 'function') {
                legacy.arc(x, y, radius, start, end, anticlockwise)
            }
        },
        fill() {
            sync()
            legacy.fill()
            markDirty()
        },
        stroke() {
            sync()
            legacy.stroke()
            markDirty()
        },
        clip() {
            if (typeof legacy.clip === 'function') {
                legacy.clip()
            }
        },
        clearRect(x, y, w, h) {
            if (typeof legacy.clearRect === 'function') {
                legacy.clearRect(x, y, w, h)
            }
            markDirty()
        },
        fillRect(x, y, w, h) {
            sync()
            if (typeof legacy.fillRect === 'function') {
                legacy.fillRect(x, y, w, h)
            }
            markDirty()
        },
        strokeRect(x, y, w, h) {
            sync()
            if (typeof legacy.strokeRect === 'function') {
                legacy.strokeRect(x, y, w, h)
            }
            markDirty()
        },
        drawImage() {
            const image = arguments[0]
            const source = image && (image._localPath || image._src || image.src)
            if (!source) return
            sync()
            const args = Array.prototype.slice.call(arguments, 1)
            try {
                if (args.length >= 8) {
                    legacy.drawImage(source, args[4], args[5], args[6], args[7])
                } else if (args.length >= 4) {
                    legacy.drawImage(source, args[0], args[1], args[2], args[3])
                } else {
                    legacy.drawImage(
                        source,
                        args[0] || 0,
                        args[1] || 0,
                        image.width || 0,
                        image.height || 0
                    )
                }
                markDirty()
            } catch (error) {
                // 单张图片绘制失败时跳过，避免中断整个动画
            }
        },
        createLinearGradient(x0, y0, x1, y1) {
            return legacy.createLinearGradient(x0, y0, x1, y1)
        },
        createRadialGradient(x0, y0, r0, x1, y1, r1) {
            return legacy.createRadialGradient(x0, y0, r0, x1, y1, r1)
        },
        setLineDash(segments, offset) {
            state.lineDash = Array.isArray(segments) ? segments.slice() : []
            if (typeof offset === 'number') {
                state.lineDashOffset = offset
            }
        },
        fillText(text, x, y) {
            sync()
            if (typeof legacy.fillText === 'function') {
                legacy.fillText(text, x, y)
            }
            markDirty()
        },
        strokeText(text, x, y) {
            sync()
            if (typeof legacy.strokeText === 'function') {
                legacy.strokeText(text, x, y)
            }
            markDirty()
        },
        measureText(text) {
            const fontSize = parseFontSize(state.font)
            return { width: String(text == null ? '' : text).length * fontSize * 0.6 }
        }
    }

    return {
        canvas,
        context,
        flush,
        destroy() {
            destroyed = true
            rafIds.forEach((timer) => clearTimeout(timer))
            rafIds.clear()
            flushTimer = null
            dirty = false
            stack.length = 0
        }
    }
}
