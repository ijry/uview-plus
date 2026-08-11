function toNumber(value, fallback) {
    const number = Number.parseFloat(value)
    return Number.isFinite(number) ? number : fallback
}

function getFontSize(style = {}) {
    return toNumber(style.fontSize, 18)
}

function getCharacterWidth(character, fontSize) {
    if (/[\u3400-\u9fff\u3040-\u30ff\uff00-\uffef]/.test(character)) {
        return fontSize
    }
    if (/\s/.test(character)) {
        return fontSize * 0.28
    }
    return fontSize * 0.56
}

export function normalizeMeasureResult(value) {
    if (typeof value === 'number') return value
    if (value && typeof value.width === 'number') return value.width
    return 0
}

export function measureTextWidth(text, style = {}, measureText) {
    if (typeof measureText === 'function') {
        return normalizeMeasureResult(measureText(String(text), style))
    }
    const fontSize = getFontSize(style)
    return Array.from(String(text)).reduce(
        (width, character) => width + getCharacterWidth(character, fontSize),
        0
    )
}

export function createMeasureText({ canvasContext, style = {}, measureText } = {}) {
    if (typeof measureText === 'function') {
        return (text) => measureTextWidth(text, style, measureText)
    }
    if (canvasContext && typeof canvasContext.measureText === 'function') {
        const fontSize = getFontSize(style)
        const fontWeight = style.fontWeight || 400
        const fontFamily = style.fontFamily || 'sans-serif'
        canvasContext.font = `${fontWeight} ${fontSize}px ${fontFamily}`
        return (text) => normalizeMeasureResult(canvasContext.measureText(String(text)))
    }
    return (text) => measureTextWidth(text, style)
}

export function measureContainer(selector, vm) {
    return new Promise((resolve) => {
        if (typeof uni === 'undefined' || typeof uni.createSelectorQuery !== 'function') {
            resolve(null)
            return
        }
        const query = vm
            ? uni.createSelectorQuery().in(vm)
            : uni.createSelectorQuery()
        query.select(selector).boundingClientRect((rect) => resolve(rect || null)).exec()
    })
}

export default {
    normalizeMeasureResult,
    measureTextWidth,
    createMeasureText,
    measureContainer
}
