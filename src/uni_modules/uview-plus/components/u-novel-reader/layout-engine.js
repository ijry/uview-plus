import { measureTextWidth } from './measure-adapter'

const CJK_PATTERN = /[\u3400-\u9fff\u3040-\u30ff\uff00-\uffef]/

function createUnit(text, startOffset, endOffset) {
    return {
        text,
        startOffset,
        endOffset
    }
}

function tokenizeText(text) {
    const units = []
    let token = ''
    let tokenStart = 0
    let offset = 0

    const flushToken = () => {
        if (token) {
            units.push(createUnit(token, tokenStart, offset))
            token = ''
        }
    }

    Array.from(String(text)).forEach((character) => {
        const startOffset = offset
        offset += character.length
        if (CJK_PATTERN.test(character) || /\s/.test(character)) {
            flushToken()
            units.push(createUnit(character, startOffset, offset))
            tokenStart = offset
            return
        }
        if (!token) tokenStart = startOffset
        token += character
    })
    flushToken()
    return units
}

function splitUnit(unit) {
    if (unit.text.length <= 1) return [unit]
    const result = []
    let offset = unit.startOffset
    Array.from(unit.text).forEach((character) => {
        const nextOffset = offset + character.length
        result.push(createUnit(character, offset, nextOffset))
        offset = nextOffset
    })
    return result
}

function lineFromUnits(units) {
    return {
        text: units.map((unit) => unit.text).join(''),
        startOffset: units[0].startOffset,
        endOffset: units[units.length - 1].endOffset
    }
}

export function createLayoutKey({
    chapterId = '',
    settings = {},
    width = 0,
    height = 0
} = {}) {
    return JSON.stringify({
        chapterId,
        width,
        height,
        fontSize: settings.fontSize,
        lineHeight: settings.lineHeight,
        paragraphSpacing: settings.paragraphSpacing,
        contentWidth: settings.contentWidth,
        fontFamily: settings.fontFamily,
        fontWeight: settings.fontWeight
    })
}

export function wrapText(text, width, measureText = measureTextWidth) {
    const source = String(text == null ? '' : text)
    if (!source) {
        return [{
            text: '',
            startOffset: 0,
            endOffset: 0
        }]
    }

    const units = tokenizeText(source).reduce((result, unit) => {
        const unitWidth = measureText(unit.text)
        if (unitWidth > width && unit.text.length > 1) {
            return result.concat(splitUnit(unit))
        }
        result.push(unit)
        return result
    }, [])
    const lines = []
    let currentUnits = []

    units.forEach((unit) => {
        const candidateUnits = currentUnits.concat(unit)
        const candidateText = candidateUnits.map((item) => item.text).join('')
        if (
            currentUnits.length &&
            measureText(candidateText) > width
        ) {
            lines.push(lineFromUnits(currentUnits))
            currentUnits = [unit]
        } else {
            currentUnits = candidateUnits
        }
    })

    if (currentUnits.length) {
        lines.push(lineFromUnits(currentUnits))
    }
    return lines
}

function getLineHeight(layout) {
    const fontSize = Number(layout.fontSize) || 18
    const lineHeight = Number(layout.lineHeight)
    if (!Number.isFinite(lineHeight)) return fontSize * 1.8
    return lineHeight <= 4 ? fontSize * lineHeight : lineHeight
}

function createPage(lines, index) {
    if (!lines.length) return null
    return {
        index,
        text: lines.map((line) => line.text).join('\n'),
        lines,
        startOffset: lines[0].startOffset,
        endOffset: lines[lines.length - 1].endOffset
    }
}

export function paginateParagraphs(paragraphs = [], layout = {}) {
    const width = Math.max(1, Number(layout.width) || 320)
    const height = Math.max(1, Number(layout.height) || 500)
    const lineHeight = Math.max(1, getLineHeight(layout))
    const paragraphSpacing = Math.max(0, Number(layout.paragraphSpacing) || 0)
    const measureText = typeof layout.measureText === 'function'
        ? layout.measureText
        : (text) => measureTextWidth(text, layout)
    const pages = []
    let lines = []
    let usedHeight = 0

    const flushPage = () => {
        const page = createPage(lines, pages.length)
        if (page) pages.push(page)
        lines = []
        usedHeight = 0
    }

    paragraphs.forEach((paragraph, paragraphIndex) => {
        const normalizedParagraph = typeof paragraph === 'string'
            ? {
                text: paragraph,
                startOffset: 0,
                endOffset: paragraph.length
            }
            : paragraph
        const paragraphLines = wrapText(
            normalizedParagraph && normalizedParagraph.text,
            width,
            measureText
        ).map((line) => ({
            ...line,
            startOffset: line.startOffset + (normalizedParagraph.startOffset || 0),
            endOffset: line.endOffset + (normalizedParagraph.startOffset || 0),
            paragraphIndex
        }))

        if (paragraphIndex > 0 && lines.length && usedHeight + paragraphSpacing + lineHeight > height) {
            flushPage()
        } else if (paragraphIndex > 0 && lines.length) {
            usedHeight += paragraphSpacing
        }

        paragraphLines.forEach((line) => {
            if (lines.length && usedHeight + lineHeight > height) {
                flushPage()
            }
            lines.push(line)
            usedHeight += lineHeight
        })
    })
    flushPage()

    return {
        pages,
        pageCount: pages.length,
        charOffsetToPage: pages.map((page) => ({
            pageIndex: page.index,
            startOffset: page.startOffset,
            endOffset: page.endOffset
        }))
    }
}

export function resolveAnchor(pages = [], charOffset = 0) {
    if (!pages.length) {
        return {
            pageIndex: 0,
            localOffset: 0
        }
    }
    const offset = Math.max(0, Number(charOffset) || 0)
    const page = pages.find((item) => offset <= item.endOffset) || pages[pages.length - 1]
    return {
        pageIndex: page.index,
        localOffset: Math.max(0, Math.min(page.text.length, offset - page.startOffset))
    }
}

export default {
    createLayoutKey,
    wrapText,
    paginateParagraphs,
    resolveAnchor
}
