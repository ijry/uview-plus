export const STORAGE_VERSION = 1
export const DEFAULT_STORAGE_PREFIX = 'uview-plus:novel-reader:'

function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function getStorageValue(key) {
    if (!key || typeof uni === 'undefined' || typeof uni.getStorageSync !== 'function') {
        return null
    }
    return uni.getStorageSync(key)
}

function normalizeProgress(value) {
    if (value == null) return null
    if (!isObject(value)) return null
    const numericFields = ['chapterIndex', 'pageIndex', 'pageCount', 'charOffset', 'scrollTop']
    for (const field of numericFields) {
        if (value[field] !== undefined && (
            !Number.isFinite(Number(value[field])) ||
            Number(value[field]) < 0
        )) {
            return null
        }
    }
    for (const field of ['chapterProgress', 'totalProgress']) {
        if (value[field] !== undefined && (
            !Number.isFinite(Number(value[field])) ||
            Number(value[field]) < 0 ||
            Number(value[field]) > 1
        )) {
            return null
        }
    }
    return {
        ...value,
        pageIndex: Math.max(0, Number(value.pageIndex) || 0),
        pageCount: Math.max(0, Number(value.pageCount) || 0),
        charOffset: Math.max(0, Number(value.charOffset) || 0),
        scrollTop: Math.max(0, Number(value.scrollTop) || 0)
    }
}

function normalizeSettings(value) {
    if (!isObject(value)) return {}
    return { ...value }
}

function normalizeBookmarks(value) {
    if (!Array.isArray(value)) return []
    return value.filter((bookmark) => (
        isObject(bookmark) &&
        bookmark.id != null &&
        bookmark.chapterId != null &&
        Number.isFinite(Number(bookmark.charOffset)) &&
        Number(bookmark.charOffset) >= 0
    ))
}

export function createStorageKey({ storageKey = '', bookId = '' } = {}) {
    if (storageKey) return String(storageKey)
    if (bookId === '' || bookId == null) return ''
    return `${DEFAULT_STORAGE_PREFIX}${bookId}`
}

export function normalizePersistedState(value) {
    if (!isObject(value) || value.version !== STORAGE_VERSION) return null
    const progress = normalizeProgress(value.progress)
    const readingTime = Number(value.readingTime)
    const updatedAt = Number(value.updatedAt)
    if (
        !Number.isFinite(readingTime) ||
        readingTime < 0 ||
        !Number.isFinite(updatedAt) ||
        updatedAt < 0
    ) {
        return null
    }
    return {
        version: STORAGE_VERSION,
        progress,
        settings: normalizeSettings(value.settings),
        bookmarks: normalizeBookmarks(value.bookmarks),
        readingTime,
        updatedAt
    }
}

export function readPersistedState(key) {
    if (!key) return null
    try {
        const value = getStorageValue(key)
        const parsed = typeof value === 'string' ? JSON.parse(value) : value
        const normalized = normalizePersistedState(parsed)
        if (
            parsed != null &&
            normalized == null &&
            typeof uni !== 'undefined' &&
            typeof uni.removeStorageSync === 'function'
        ) {
            uni.removeStorageSync(key)
        }
        return normalized
    } catch (error) {
        try {
            if (typeof uni !== 'undefined' && typeof uni.removeStorageSync === 'function') {
                uni.removeStorageSync(key)
            }
        } catch (removeError) {
            return null
        }
        return null
    }
}

export function writePersistedState(key, state) {
    if (!key || typeof uni === 'undefined' || typeof uni.setStorageSync !== 'function') {
        return false
    }
    const payload = {
        version: STORAGE_VERSION,
        progress: isObject(state && state.progress) ? state.progress : null,
        settings: isObject(state && state.settings) ? state.settings : {},
        bookmarks: Array.isArray(state && state.bookmarks) ? state.bookmarks : [],
        readingTime: Math.max(0, Number(state && state.readingTime) || 0),
        updatedAt: Date.now()
    }
    try {
        uni.setStorageSync(key, payload)
        return true
    } catch (error) {
        return false
    }
}

export default {
    STORAGE_VERSION,
    DEFAULT_STORAGE_PREFIX,
    createStorageKey,
    normalizePersistedState,
    readPersistedState,
    writePersistedState
}
