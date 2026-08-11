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

export function createStorageKey({ storageKey = '', bookId = '' } = {}) {
    if (storageKey) return String(storageKey)
    if (bookId === '' || bookId == null) return ''
    return `${DEFAULT_STORAGE_PREFIX}${bookId}`
}

export function normalizePersistedState(value) {
    if (!isObject(value) || value.version !== STORAGE_VERSION) return null
    return {
        version: STORAGE_VERSION,
        progress: isObject(value.progress) ? value.progress : null,
        settings: isObject(value.settings) ? value.settings : {},
        bookmarks: Array.isArray(value.bookmarks) ? value.bookmarks : [],
        readingTime: Math.max(0, Number(value.readingTime) || 0),
        updatedAt: Math.max(0, Number(value.updatedAt) || 0)
    }
}

export function readPersistedState(key) {
    if (!key) return null
    try {
        const value = getStorageValue(key)
        const parsed = typeof value === 'string' ? JSON.parse(value) : value
        return normalizePersistedState(parsed)
    } catch (error) {
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
