const LINE_BREAK_PATTERN = /\r\n|\r|\n/

function normalizeParagraphs(content) {
    const values = Array.isArray(content) ? content : [content == null ? '' : content]
    return values.reduce((paragraphs, value) => {
        String(value == null ? '' : value)
            .split(LINE_BREAK_PATTERN)
            .forEach((text) => paragraphs.push(text))
        return paragraphs
    }, [])
}

export function normalizeContent(content) {
    const sourceParagraphs = normalizeParagraphs(content)
    const hasContent = sourceParagraphs.some((text) => text.length > 0)
    if (!hasContent) {
        return {
            paragraphs: [],
            text: '',
            length: 0
        }
    }

    let offset = 0
    const paragraphs = sourceParagraphs.map((text, index) => {
        const startOffset = offset
        const endOffset = startOffset + text.length
        offset = endOffset + 1
        return {
            index,
            text,
            startOffset,
            endOffset
        }
    })

    const text = paragraphs.map((paragraph) => paragraph.text).join('\n')
    return {
        paragraphs,
        text,
        length: text.length
    }
}

export function normalizeProgress(progress, chapter) {
    const normalizedContent = normalizeContent(chapter && chapter.content)
    const contentLength = normalizedContent.length
    const requestedOffset = Number(progress && progress.charOffset)
    const charOffset = Math.min(
        contentLength,
        Math.max(0, Number.isFinite(requestedOffset) ? requestedOffset : 0)
    )
    const requestedPageIndex = Number(progress && progress.pageIndex)
    const chapterIndex = Number(chapter && chapter.index)

    return {
        chapterId: progress && progress.chapterId != null
            ? progress.chapterId
            : chapter && chapter.id != null
                ? chapter.id
                : '',
        chapterIndex: Number.isFinite(chapterIndex)
            ? chapterIndex
            : Number(progress && progress.chapterIndex) || 0,
        pageIndex: Math.max(0, Number.isFinite(requestedPageIndex) ? requestedPageIndex : 0),
        pageCount: Math.max(0, Number(progress && progress.pageCount) || 0),
        charOffset,
        chapterProgress: contentLength
            ? Math.min(1, Math.max(0, charOffset / contentLength))
            : 0,
        totalProgress: Math.min(1, Math.max(0, Number(progress && progress.totalProgress) || 0)),
        scrollTop: Math.max(0, Number(progress && progress.scrollTop) || 0),
        updatedAt: Number(progress && progress.updatedAt) || 0
    }
}

export default {
    normalizeContent,
    normalizeProgress
}
