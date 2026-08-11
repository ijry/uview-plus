export const DEFAULT_READER_SETTINGS = {
    theme: 'day',
    fontSize: 18,
    lineHeight: 1.8,
    paragraphSpacing: 16,
    contentWidth: '92%',
    fontFamily: 'system',
    fontWeight: 400,
    animation: true
}

const SETTING_KEYS = Object.keys(DEFAULT_READER_SETTINGS)
const ALLOWED_MODES = ['scroll', 'page']

function clamp(value, min, max, fallback) {
    const numericValue = Number(value)
    if (!Number.isFinite(numericValue)) return fallback
    return Math.min(max, Math.max(min, numericValue))
}

function normalizeContentWidth(value) {
    if (typeof value === 'number') {
        return clamp(value, 40, 100, 92)
    }
    if (typeof value === 'string' && value.trim()) {
        return value.trim()
    }
    return DEFAULT_READER_SETTINGS.contentWidth
}

export function mergeReaderSettings(...sources) {
    const result = { ...DEFAULT_READER_SETTINGS }
    sources.filter(Boolean).forEach((source) => {
        SETTING_KEYS.forEach((key) => {
            if (source[key] !== undefined) {
                result[key] = source[key]
            }
        })
    })
    result.fontSize = clamp(result.fontSize, 12, 48, DEFAULT_READER_SETTINGS.fontSize)
    result.lineHeight = clamp(result.lineHeight, 1, 3, DEFAULT_READER_SETTINGS.lineHeight)
    result.paragraphSpacing = clamp(result.paragraphSpacing, 0, 80, DEFAULT_READER_SETTINGS.paragraphSpacing)
    result.contentWidth = normalizeContentWidth(result.contentWidth)
    result.fontWeight = result.fontWeight >= 600 ? 600 : 400
    result.animation = result.animation !== false
    return result
}

export function normalizeMode(mode) {
    return ALLOWED_MODES.includes(mode) ? mode : 'scroll'
}

export function toggleControls(state) {
    return {
        ...state,
        controlsVisible: !state.controlsVisible
    }
}

export function setMode(state, mode) {
    const normalizedMode = normalizeMode(mode)
    return {
        ...state,
        mode: normalizedMode
    }
}

export function setSettings(state, settings) {
    return {
        ...state,
        settings: mergeReaderSettings(state.settings, settings)
    }
}

export function setProgress(state, progress) {
    return {
        ...state,
        progress: {
            ...state.progress,
            ...progress,
            pageIndex: Math.max(0, Number(progress && progress.pageIndex) || 0),
            charOffset: Math.max(0, Number(progress && progress.charOffset) || 0),
            scrollTop: Math.max(0, Number(progress && progress.scrollTop) || 0)
        }
    }
}

export function toggleBookmark(bookmarks, bookmark) {
    const list = Array.isArray(bookmarks) ? bookmarks : []
    const bookmarkId = bookmark && bookmark.id
    if (!bookmarkId) return list.slice()
    const existingIndex = list.findIndex((item) => item && item.id === bookmarkId)
    if (existingIndex === -1) return [...list, bookmark]
    return list.filter((_, index) => index !== existingIndex)
}

export function startReading(state, timestamp = Date.now()) {
    return {
        ...state,
        active: true,
        lastActiveAt: timestamp
    }
}

export function pauseReading(state, timestamp = Date.now()) {
    const nextState = consumeReadingTime(state, timestamp)
    return {
        ...nextState,
        active: false
    }
}

export function consumeReadingTime(state, timestamp = Date.now()) {
    if (!state.active || !state.lastActiveAt) return state
    const elapsed = Math.max(0, timestamp - state.lastActiveAt)
    return {
        ...state,
        readingTime: Math.max(0, Number(state.readingTime) || 0) + elapsed,
        lastActiveAt: timestamp
    }
}

export default {
    DEFAULT_READER_SETTINGS,
    mergeReaderSettings,
    normalizeMode,
    toggleControls,
    setMode,
    setSettings,
    setProgress,
    toggleBookmark,
    startReading,
    pauseReading,
    consumeReadingTime
}
