if (typeof wx === 'undefined') {
    const globalObject = typeof globalThis !== 'undefined'
        ? globalThis
        : (typeof window !== 'undefined' ? window : null)
    if (globalObject) {
        globalObject.wx = {
            getSystemInfoSync() {
                const info = uni.getSystemInfoSync() || {}
                return Object.assign({ pixelRatio: 1, platform: '' }, info)
            }
        }
    }
}

export {}
