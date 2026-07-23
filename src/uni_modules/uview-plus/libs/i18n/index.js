import zhHans from './locales/zh-Hans.js'

const settings = {
    lang: typeof uni !== 'undefined' && typeof uni.getLocale === 'function'
        ? uni.getLocale()
        : 'zh-Hans',
    locales: {
        'zh-Hans': zhHans
    }
}

if (typeof uni !== 'undefined' && typeof uni.onLocaleChange === 'function') {
    uni.onLocaleChange((locale) => {
        // uni-app 部分平台回调可能是字符串，也可能是 { locale }
        settings.lang = typeof locale === 'string'
            ? locale
            : (locale && locale.locale) || settings.lang
    })
}

function isPlainObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]'
}

export function hasLocale(locale) {
    return !!(locale && settings.locales[locale])
}

export function getLocale() {
    return settings.lang
}

export function setLocale(locale) {
    if (!locale || typeof locale !== 'string') return settings.lang
    settings.lang = locale
    if (typeof uni !== 'undefined' && typeof uni.setLocale === 'function') {
        try {
            uni.setLocale(locale)
        } catch (e) {
            // 部分平台 setLocale 可能受限，忽略以保持 set 内部状态成功
        }
    }
    return settings.lang
}

/**
 * 注册语言包
 * registerLocale('en', messages)
 * registerLocale({ en: messages, ja: messages2 })
 */
export function registerLocale(localeOrMap, messages) {
    if (typeof localeOrMap === 'string') {
        if (!localeOrMap || !isPlainObject(messages)) return
        settings.locales[localeOrMap] = messages
        return
    }
    if (!isPlainObject(localeOrMap)) return
    Object.keys(localeOrMap).forEach((key) => {
        const value = localeOrMap[key]
        if (isPlainObject(value)) {
            settings.locales[key] = value
        }
    })
}

/**
 * 多语言方法
 */
export function t(value, params = {}) {
    if (value) {
        let lang = settings.lang
        if (!settings.locales[settings.lang]) {
            lang = 'zh-Hans'
        }
        let result = settings.locales[lang][value] || value
        if (params && typeof params === 'object') {
            Object.keys(params).forEach((key) => {
                const reg = new RegExp(`{${key}}`, 'g')
                result = String(result).replace(reg, params[key])
            })
        }
        return result
    }
    return value
}

export default {
    settings
}
