import config from '../config/config.js'
import color from '../config/color.js'
import index from '../function/index.js'
import { trySetTabBarStyle } from './runtime.js'

const DEFAULT_LIGHT_THEME_COLORS = Object.freeze({
    primary: '#3c9cff',
    info: '#909399',
    warning: '#f9ae3d',
    error: '#f56c6c',
    success: '#5ac725',
    mainColor: '#303133',
    contentColor: '#606266',
    tipsColor: '#909193',
    lightColor: '#c0c4cc',
    borderColor: '#dadbde',
    bgColor: '#f3f4f6',
    disabledColor: '#c8c9cc',
    primaryDark: '#398ade',
    primaryDisabled: '#9acafc',
    primaryLight: '#ecf5ff',
    warningDark: '#f1a532',
    warningDisabled: '#f9d39b',
    warningLight: '#fdf6ec',
    successDark: '#53c21d',
    successDisabled: '#a9e08f',
    successLight: '#f5fff0',
    errorDark: '#e45656',
    errorDisabled: '#f7b2b2',
    errorLight: '#fef0f0',
    infoDark: '#767a82',
    infoDisabled: '#c4c6c9',
    infoLight: '#f4f4f5'
})

const DEFAULT_DARK_THEME_COLORS = Object.freeze({
    primary: '#3c9cff',
    info: '#909399',
    warning: '#f9ae3d',
    error: '#f56c6c',
    success: '#5ac725',
    mainColor: '#f5f5f5',
    contentColor: '#d1d5db',
    tipsColor: '#9ca3af',
    lightColor: '#6b7280',
    borderColor: '#3a3a3c',
    bgColor: '#1f1f1f',
    disabledColor: '#4b5563',
    primaryDark: '#5aa8ff',
    primaryDisabled: '#4c6f92',
    primaryLight: '#10243a',
    warningDark: '#ffbf66',
    warningDisabled: '#8a6a3a',
    warningLight: '#3d2f1b',
    successDark: '#7ad94b',
    successDisabled: '#5f7f4f',
    successLight: '#1f3316',
    errorDark: '#ff8a8a',
    errorDisabled: '#8d5858',
    errorLight: '#3a2222',
    infoDark: '#b0b3b8',
    infoDisabled: '#5f6368',
    infoLight: '#2f3238'
})

const DEFAULT_THEME_EXTRA_VARS = Object.freeze({
    light: Object.freeze({
        '--up-table2-header-bg-color': '#f5f7fa',
        '--up-table2-zebra-bg-color': '#fafafa',
        '--up-table2-highlight-bg-color': '#f5f7fa',
        '--up-gap-bg-color': '#f3f4f6',
        '--up-skeleton-bg-color': '#f1f2f4',
        '--up-skeleton-shimmer-color': '#e6e6e6',
        '--up-swipe-action-button-bg-color': '#c7c6cd',
        '--up-index-list-indicator-bg-color': '#c9c9c9',
        '--up-calendar-month-mark-color': 'rgba(231, 232, 234, 0.83)'
    }),
    dark: Object.freeze({
        '--up-table2-header-bg-color': '#2a2d33',
        '--up-table2-zebra-bg-color': '#23262b',
        '--up-table2-highlight-bg-color': '#2f3440',
        '--up-gap-bg-color': '#111111',
        '--up-skeleton-bg-color': '#2f3135',
        '--up-skeleton-shimmer-color': 'rgba(255, 255, 255, 0.12)',
        '--up-swipe-action-button-bg-color': '#4b5563',
        '--up-index-list-indicator-bg-color': '#4b5563',
        '--up-calendar-month-mark-color': 'rgba(255, 255, 255, 0.04)'
    })
})

export const themeState = {
    preference: 'system',
    mode: 'light',
    version: 0,
    vars: {}
}

const THEME_MODE_STORAGE_KEY = 'u-theme-mode'
const THEME_MODE_SYSTEM = 'system'
const THEME_MODE_MANUAL = ['light', 'dark']
const LIGHT_THEME_TOKEN_FIELD_MAP = Object.freeze({
    'primary': 'primary',
    'primary-dark': 'primaryDark',
    'primary-disabled': 'primaryDisabled',
    'primary-light': 'primaryLight',
    'warning': 'warning',
    'warning-dark': 'warningDark',
    'warning-disabled': 'warningDisabled',
    'warning-light': 'warningLight',
    'success': 'success',
    'success-dark': 'successDark',
    'success-disabled': 'successDisabled',
    'success-light': 'successLight',
    'error': 'error',
    'error-dark': 'errorDark',
    'error-disabled': 'errorDisabled',
    'error-light': 'errorLight',
    'info': 'info',
    'info-dark': 'infoDark',
    'info-disabled': 'infoDisabled',
    'info-light': 'infoLight',
    'main-color': 'mainColor',
    'content-color': 'contentColor',
    'tips-color': 'tipsColor',
    'light-color': 'lightColor',
    'border-color': 'borderColor',
    'bg-color': 'bgColor',
    'disabled-color': 'disabledColor'
})
const LIGHT_THEME_FIELD_TOKEN_MAP = Object.freeze(
    Object.fromEntries(
        Object.entries(LIGHT_THEME_TOKEN_FIELD_MAP).map(([token, field]) => [field, token])
    )
)

const runtimeThemeOverrideState = {
    color: Object.create(null),
    configColor: Object.create(null)
}

let cachedLightThemeColors = null
let hasRegisterThemeListener = false
let currentThemePreference = THEME_MODE_SYSTEM

function normalizeThemeMode(theme = 'light') {
    return theme === 'dark' ? 'dark' : 'light'
}

function normalizeThemePreference(mode = THEME_MODE_SYSTEM) {
    if (THEME_MODE_MANUAL.includes(mode)) return mode
    return THEME_MODE_SYSTEM
}

function getLightBridgeVar(token, fallback) {
    return `var(--up-light-${token}, ${fallback})`
}

function clearOverrideBucket(bucket) {
    Object.keys(bucket).forEach((key) => {
        delete bucket[key]
    })
}

function normalizeLightThemeToken(token = '') {
    if (typeof token !== 'string') return ''
    if (token.indexOf('up-') === 0) return token.slice(3)
    if (token.indexOf('u-') === 0) return token.slice(2)
    return token
}

function isLightThemeConfigColorKey(token = '') {
    return token.indexOf('up-') === 0 || token.indexOf('u-') === 0
}

export function syncThemeColorOverrideState({
    color: colorOverrides,
    configColor: configColorOverrides,
    reset = false
} = {}) {
    if (reset) {
        clearOverrideBucket(runtimeThemeOverrideState.color)
        clearOverrideBucket(runtimeThemeOverrideState.configColor)
    }
    if (colorOverrides && typeof colorOverrides === 'object') {
        Object.keys(LIGHT_THEME_FIELD_TOKEN_MAP).forEach((field) => {
            if (!Object.prototype.hasOwnProperty.call(colorOverrides, field)) return
            const value = colorOverrides[field]
            if (typeof value === 'string' && value) {
                runtimeThemeOverrideState.color[field] = true
                return
            }
            delete runtimeThemeOverrideState.color[field]
        })
    }
    if (configColorOverrides && typeof configColorOverrides === 'object') {
        Object.keys(configColorOverrides).forEach((key) => {
            const token = normalizeLightThemeToken(key)
            if (!Object.prototype.hasOwnProperty.call(LIGHT_THEME_TOKEN_FIELD_MAP, token)) return
            const value = configColorOverrides[key]
            if (typeof value === 'string' && value) {
                const overrideKey = isLightThemeConfigColorKey(key) ? key : `up-${token}`
                runtimeThemeOverrideState.configColor[overrideKey] = true
                return
            }
            delete runtimeThemeOverrideState.configColor[key]
            delete runtimeThemeOverrideState.configColor[`u-${token}`]
            delete runtimeThemeOverrideState.configColor[`up-${token}`]
        })
    }
}

function getExplicitRuntimeColorValue(token, runtimeColorMap = {}) {
    const field = LIGHT_THEME_TOKEN_FIELD_MAP[token]
    if (!field) return ''
    if (runtimeThemeOverrideState.color[field]) {
        const value = color[field]
        if (typeof value === 'string' && value) return value
    }
    const upKey = `up-${token}`
    const uKey = `u-${token}`
    if (!runtimeThemeOverrideState.configColor[upKey] && !runtimeThemeOverrideState.configColor[uKey]) return ''
    const upValue = runtimeColorMap[upKey]
    const uValue = runtimeColorMap[uKey]
    if (runtimeThemeOverrideState.configColor[upKey] && typeof upValue === 'string' && upValue) return upValue
    if (runtimeThemeOverrideState.configColor[uKey] && typeof uValue === 'string' && uValue) return uValue
    return ''
}

function readThemePreferenceFromStorage() {
    try {
        if (typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function') {
            const mode = uni.getStorageSync(THEME_MODE_STORAGE_KEY)
            return normalizeThemePreference(mode)
        }
    } catch (e) {}
    return THEME_MODE_SYSTEM
}

function writeThemePreferenceToStorage(mode) {
    try {
        if (typeof uni !== 'undefined' && typeof uni.setStorageSync === 'function') {
            uni.setStorageSync(THEME_MODE_STORAGE_KEY, mode)
        }
    } catch (e) {}
}

export function getSystemTheme() {
    let theme = 'light'
    try {
        if (typeof uni !== 'undefined' && typeof uni.getAppBaseInfo === 'function') {
            const appBaseInfo = uni.getAppBaseInfo() || {}
            if (appBaseInfo.theme) {
                theme = appBaseInfo.theme
            }
        }
        if (typeof uni !== 'undefined' && typeof uni.getSystemInfoSync === 'function') {
            const systemInfo = uni.getSystemInfoSync() || {}
            if (systemInfo.theme) {
                theme = systemInfo.theme
            }
        }
    } catch (e) {
        theme = 'light'
    }
    return normalizeThemeMode(theme)
}

function getCurrentLightThemeColors() {
    const runtimeColorMap = config.color || {}
    const lightThemeColors = {
        ...DEFAULT_LIGHT_THEME_COLORS
    }
    Object.keys(LIGHT_THEME_TOKEN_FIELD_MAP).forEach((token) => {
        const explicitValue = getExplicitRuntimeColorValue(token, runtimeColorMap)
        if (!explicitValue) return
        lightThemeColors[LIGHT_THEME_TOKEN_FIELD_MAP[token]] = explicitValue
    })
    return lightThemeColors
}

function getThemeColorsByMode(mode) {
    if (!cachedLightThemeColors) {
        cachedLightThemeColors = getCurrentLightThemeColors()
    }
    const themeMode = normalizeThemeMode(mode)
    if (themeMode === 'dark') {
        return {
            ...DEFAULT_DARK_THEME_COLORS,
            primary: cachedLightThemeColors.primary,
            info: cachedLightThemeColors.info,
            warning: cachedLightThemeColors.warning,
            error: cachedLightThemeColors.error,
            success: cachedLightThemeColors.success
        }
    }
    return {
        ...cachedLightThemeColors
    }
}

function buildConfigColorMap(themeColors) {
    return {
        'u-primary': themeColors.primary,
        'u-primary-dark': themeColors.primaryDark,
        'u-primary-disabled': themeColors.primaryDisabled,
        'u-primary-light': themeColors.primaryLight,
        'u-warning': themeColors.warning,
        'u-warning-dark': themeColors.warningDark,
        'u-warning-disabled': themeColors.warningDisabled,
        'u-warning-light': themeColors.warningLight,
        'u-success': themeColors.success,
        'u-success-dark': themeColors.successDark,
        'u-success-disabled': themeColors.successDisabled,
        'u-success-light': themeColors.successLight,
        'u-error': themeColors.error,
        'u-error-dark': themeColors.errorDark,
        'u-error-disabled': themeColors.errorDisabled,
        'u-error-light': themeColors.errorLight,
        'u-info': themeColors.info,
        'u-info-dark': themeColors.infoDark,
        'u-info-disabled': themeColors.infoDisabled,
        'u-info-light': themeColors.infoLight,
        'u-main-color': themeColors.mainColor,
        'u-content-color': themeColors.contentColor,
        'u-tips-color': themeColors.tipsColor,
        'u-light-color': themeColors.lightColor,
        'u-border-color': themeColors.borderColor,
        'u-bg-color': themeColors.bgColor,
        'u-disabled-color': themeColors.disabledColor,
        'up-primary': themeColors.primary,
        'up-primary-dark': themeColors.primaryDark,
        'up-primary-disabled': themeColors.primaryDisabled,
        'up-primary-light': themeColors.primaryLight,
        'up-warning': themeColors.warning,
        'up-warning-dark': themeColors.warningDark,
        'up-warning-disabled': themeColors.warningDisabled,
        'up-warning-light': themeColors.warningLight,
        'up-success': themeColors.success,
        'up-success-dark': themeColors.successDark,
        'up-success-disabled': themeColors.successDisabled,
        'up-success-light': themeColors.successLight,
        'up-error': themeColors.error,
        'up-error-dark': themeColors.errorDark,
        'up-error-disabled': themeColors.errorDisabled,
        'up-error-light': themeColors.errorLight,
        'up-info': themeColors.info,
        'up-info-dark': themeColors.infoDark,
        'up-info-disabled': themeColors.infoDisabled,
        'up-info-light': themeColors.infoLight,
        'up-main-color': themeColors.mainColor,
        'up-content-color': themeColors.contentColor,
        'up-tips-color': themeColors.tipsColor,
        'up-light-color': themeColors.lightColor,
        'up-border-color': themeColors.borderColor,
        'up-bg-color': themeColors.bgColor,
        'up-disabled-color': themeColors.disabledColor
    }
}

function buildAliasCssVars(vars = {}) {
    const aliasVars = {}
    Object.keys(vars).forEach((key) => {
        if (typeof key !== 'string') return
        if (key.indexOf('--up-') === 0) {
            aliasVars[key.replace('--up-', '--u-')] = vars[key]
            return
        }
        if (key.indexOf('--u-') === 0) {
            aliasVars[key.replace('--u-', '--up-')] = vars[key]
        }
    })
    return aliasVars
}

function buildThemeCssVars(themeColors, mode = 'light') {
    const themeMode = normalizeThemeMode(mode)
    const isDark = themeMode === 'dark'
    const useBridge = !isDark
    const runtimeColorMap = config.color || {}
    const defaultExtraVars = DEFAULT_THEME_EXTRA_VARS[themeMode] || DEFAULT_THEME_EXTRA_VARS.light
    const pageBgColor = themeColors.bgColor || (isDark ? '#1f1f1f' : '#f3f4f6')
    const hoverBgColor = runtimeColorMap['up-hover-bg-color']
        || runtimeColorMap['u-hover-bg-color']
        || (isDark ? '#343741' : '#e7ebf0')
    const navbarBgColor = runtimeColorMap['up-navbar-bg-color']
        || runtimeColorMap['u-navbar-bg-color']
        || (isDark ? '#1c1c1e' : '#ffffff')
    const resolveLightTokenValue = (token, fallback) => {
        if (!useBridge) return fallback
        const explicitValue = getExplicitRuntimeColorValue(token, runtimeColorMap)
        return explicitValue || getLightBridgeVar(token, fallback)
    }
    const resolvedMainColor = resolveLightTokenValue('main-color', themeColors.mainColor)
    const resolvedContentColor = resolveLightTokenValue('content-color', themeColors.contentColor)
    const resolvedTipsColor = resolveLightTokenValue('tips-color', themeColors.tipsColor)
    const resolvedLightColor = resolveLightTokenValue('light-color', themeColors.lightColor)
    const resolvedBorderColor = resolveLightTokenValue('border-color', themeColors.borderColor)
    const resolvedBgColor = resolveLightTokenValue('bg-color', themeColors.bgColor)
    const resolvedDisabledColor = resolveLightTokenValue('disabled-color', themeColors.disabledColor)
    const resolvedPrimary = resolveLightTokenValue('primary', themeColors.primary)
    const resolvedPrimaryDark = resolveLightTokenValue('primary-dark', themeColors.primaryDark)
    const resolvedPrimaryDisabled = resolveLightTokenValue('primary-disabled', themeColors.primaryDisabled)
    const resolvedPrimaryLight = resolveLightTokenValue('primary-light', themeColors.primaryLight)
    const resolvedWarning = resolveLightTokenValue('warning', themeColors.warning)
    const resolvedWarningDark = resolveLightTokenValue('warning-dark', themeColors.warningDark)
    const resolvedWarningDisabled = resolveLightTokenValue('warning-disabled', themeColors.warningDisabled)
    const resolvedWarningLight = resolveLightTokenValue('warning-light', themeColors.warningLight)
    const resolvedSuccess = resolveLightTokenValue('success', themeColors.success)
    const resolvedSuccessDark = resolveLightTokenValue('success-dark', themeColors.successDark)
    const resolvedSuccessDisabled = resolveLightTokenValue('success-disabled', themeColors.successDisabled)
    const resolvedSuccessLight = resolveLightTokenValue('success-light', themeColors.successLight)
    const resolvedError = resolveLightTokenValue('error', themeColors.error)
    const resolvedErrorDark = resolveLightTokenValue('error-dark', themeColors.errorDark)
    const resolvedErrorDisabled = resolveLightTokenValue('error-disabled', themeColors.errorDisabled)
    const resolvedErrorLight = resolveLightTokenValue('error-light', themeColors.errorLight)
    const resolvedInfo = resolveLightTokenValue('info', themeColors.info)
    const resolvedInfoDark = resolveLightTokenValue('info-dark', themeColors.infoDark)
    const resolvedInfoDisabled = resolveLightTokenValue('info-disabled', themeColors.infoDisabled)
    const resolvedInfoLight = resolveLightTokenValue('info-light', themeColors.infoLight)
    const coreVars = {
        '--u-main-color': resolvedMainColor,
        '--u-content-color': resolvedContentColor,
        '--u-tips-color': resolvedTipsColor,
        '--u-light-color': resolvedLightColor,
        '--u-border-color': resolvedBorderColor,
        '--u-bg-color': resolvedBgColor,
        '--u-hover-bg-color': hoverBgColor,
        '--u-disabled-color': resolvedDisabledColor,
        '--u-primary': resolvedPrimary,
        '--u-primary-dark': resolvedPrimaryDark,
        '--u-primary-disabled': resolvedPrimaryDisabled,
        '--u-primary-light': resolvedPrimaryLight,
        '--u-warning': resolvedWarning,
        '--u-warning-dark': resolvedWarningDark,
        '--u-warning-disabled': resolvedWarningDisabled,
        '--u-warning-light': resolvedWarningLight,
        '--u-success': resolvedSuccess,
        '--u-success-dark': resolvedSuccessDark,
        '--u-success-disabled': resolvedSuccessDisabled,
        '--u-success-light': resolvedSuccessLight,
        '--u-error': resolvedError,
        '--u-error-dark': resolvedErrorDark,
        '--u-error-disabled': resolvedErrorDisabled,
        '--u-error-light': resolvedErrorLight,
        '--u-info': resolvedInfo,
        '--u-info-dark': resolvedInfoDark,
        '--u-info-disabled': resolvedInfoDisabled,
        '--u-info-light': resolvedInfoLight,
        '--up-main-color': resolvedMainColor,
        '--up-content-color': resolvedContentColor,
        '--up-tips-color': resolvedTipsColor,
        '--up-light-color': resolvedLightColor,
        '--up-border-color': resolvedBorderColor,
        '--up-bg-color': resolvedBgColor,
        '--up-hover-bg-color': hoverBgColor,
        '--up-disabled-color': resolvedDisabledColor,
        '--up-primary': resolvedPrimary,
        '--up-primary-dark': resolvedPrimaryDark,
        '--up-primary-disabled': resolvedPrimaryDisabled,
        '--up-primary-light': resolvedPrimaryLight,
        '--up-warning': resolvedWarning,
        '--up-warning-dark': resolvedWarningDark,
        '--up-warning-disabled': resolvedWarningDisabled,
        '--up-warning-light': resolvedWarningLight,
        '--up-success': resolvedSuccess,
        '--up-success-dark': resolvedSuccessDark,
        '--up-success-disabled': resolvedSuccessDisabled,
        '--up-success-light': resolvedSuccessLight,
        '--up-error': resolvedError,
        '--up-error-dark': resolvedErrorDark,
        '--up-error-disabled': resolvedErrorDisabled,
        '--up-error-light': resolvedErrorLight,
        '--up-info': resolvedInfo,
        '--up-info-dark': resolvedInfoDark,
        '--up-info-disabled': resolvedInfoDisabled,
        '--up-info-light': resolvedInfoLight,
        '--up-page-bg-color': pageBgColor,
        '--up-card-bg-color': isDark ? '#1c1c1e' : '#ffffff',
        '--up-navbar-bg-color': navbarBgColor
    }
    const extraVars = {}
    Object.keys(runtimeColorMap).forEach((key) => {
        if (typeof key !== 'string') return
        const isThemeToken = key.indexOf('up-') === 0 || key.indexOf('u-') === 0
        if (!isThemeToken) return
        const cssVarName = `--${key}`
        if (Object.prototype.hasOwnProperty.call(coreVars, cssVarName)) return
        const value = runtimeColorMap[key]
        if (typeof value === 'string' && value) {
            extraVars[cssVarName] = value
        }
    })
    return {
        ...coreVars,
        ...defaultExtraVars,
        ...buildAliasCssVars(defaultExtraVars),
        ...extraVars,
        ...buildAliasCssVars(extraVars)
    }
}

export function getThemeVars(mode) {
    if (mode) {
        return buildThemeCssVars(getThemeColorsByMode(mode), mode)
    }
    if (themeState.vars && Object.keys(themeState.vars).length > 0) {
        return { ...themeState.vars }
    }
    return buildThemeCssVars(getThemeColorsByMode(themeState.mode), themeState.mode)
}

function syncThemeToH5(mode) {
    // #ifdef H5
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('data-up-theme', mode)
    }
    // #endif
}

function hasActiveRuntimePage() {
    try {
        if (typeof getCurrentPages === 'function') {
            const pages = getCurrentPages()
            return Array.isArray(pages) && pages.length > 0
        }
    } catch (e) {}
    return false
}

function trySetNavigationBarColor(options) {
    if (typeof uni === 'undefined' || typeof uni.setNavigationBarColor !== 'function') return
    if (!hasActiveRuntimePage()) return
    try {
        const result = uni.setNavigationBarColor(options)
        if (result && typeof result.catch === 'function') {
            result.catch(() => {})
        }
    } catch (e) {}
}

function applyNativeThemeUI(mode, themeColors, themeVars = {}) {
    if (typeof uni === 'undefined') return
    if (config.nativeThemeSync !== true) return
    const isDark = normalizeThemeMode(mode) === 'dark'
    const pageBg = themeColors?.bgColor || (isDark ? '#1f1f1f' : '#f3f4f6')
    const navBg = themeVars?.['--up-navbar-bg-color']
        || themeVars?.['--u-navbar-bg-color']
        || config.color?.['up-navbar-bg-color']
        || config.color?.['u-navbar-bg-color']
        || (isDark ? '#1c1c1e' : '#ffffff')
    trySetNavigationBarColor({
        frontColor: isDark ? '#ffffff' : '#000000',
        backgroundColor: navBg,
        animation: {
            duration: 0,
            timingFunc: 'linear'
        }
    })
    if (typeof uni.setBackgroundColor === 'function') {
        uni.setBackgroundColor({
            backgroundColor: pageBg,
            backgroundColorTop: pageBg,
            backgroundColorBottom: pageBg
        })
    }
    trySetTabBarStyle({
        color: isDark ? '#8e8e93' : '#909399',
        selectedColor: isDark ? '#f2f2f7' : '#303133',
        backgroundColor: isDark ? '#111111' : '#ffffff',
        borderStyle: isDark ? 'white' : 'black'
    })
}

function applyTheme(mode = 'light') {
    const themeMode = normalizeThemeMode(mode)
    const themeColors = getThemeColorsByMode(themeMode)
    const themeVars = buildThemeCssVars(themeColors, themeMode)
    index.shallowMerge(color, {
        primary: themeColors.primary,
        primaryDark: themeColors.primaryDark,
        primaryDisabled: themeColors.primaryDisabled,
        primaryLight: themeColors.primaryLight,
        info: themeColors.info,
        infoDark: themeColors.infoDark,
        infoDisabled: themeColors.infoDisabled,
        infoLight: themeColors.infoLight,
        default: themeColors.info,
        warning: themeColors.warning,
        warningDark: themeColors.warningDark,
        warningDisabled: themeColors.warningDisabled,
        warningLight: themeColors.warningLight,
        error: themeColors.error,
        errorDark: themeColors.errorDark,
        errorDisabled: themeColors.errorDisabled,
        errorLight: themeColors.errorLight,
        success: themeColors.success,
        successDark: themeColors.successDark,
        successDisabled: themeColors.successDisabled,
        successLight: themeColors.successLight,
        mainColor: themeColors.mainColor,
        contentColor: themeColors.contentColor,
        tipsColor: themeColors.tipsColor,
        lightColor: themeColors.lightColor,
        borderColor: themeColors.borderColor,
        bgColor: themeColors.bgColor,
        disabledColor: themeColors.disabledColor
    })
    index.shallowMerge(config.color, buildConfigColorMap(themeColors))
    config.themeMode = themeMode
    themeState.preference = currentThemePreference
    themeState.mode = themeMode
    themeState.vars = { ...themeVars }
    themeState.version = Number(themeState.version || 0) + 1
    syncThemeToH5(themeMode)
    applyNativeThemeUI(themeMode, themeColors, themeVars)

    if (typeof uni !== 'undefined' && uni.$u && uni.$u.theme) {
        uni.$u.theme.mode = themeState.mode
        if (Object.prototype.hasOwnProperty.call(uni.$u.theme, 'colors')) {
            delete uni.$u.theme.colors
        }
        uni.$u.theme.vars = { ...themeState.vars }
        uni.$u.theme.version = themeState.version
    }
    if (typeof uni !== 'undefined' && typeof uni.$emit === 'function') {
        uni.$emit('uThemeChange', {
            mode: themeState.mode,
            colors: { ...themeColors },
            version: themeState.version,
            vars: { ...themeState.vars }
        })
    }
    return themeState
}

export function setTheme(mode = 'light') {
    currentThemePreference = normalizeThemeMode(mode)
    writeThemePreferenceToStorage(currentThemePreference)
    return applyTheme(currentThemePreference)
}

export function setThemePreference(mode = THEME_MODE_SYSTEM) {
    currentThemePreference = normalizeThemePreference(mode)
    writeThemePreferenceToStorage(currentThemePreference)
    if (currentThemePreference === THEME_MODE_SYSTEM) {
        return applyTheme(getSystemTheme())
    }
    return applyTheme(currentThemePreference)
}

export function getThemePreference() {
    return currentThemePreference
}

export function refreshThemeFromConfig() {
    cachedLightThemeColors = getCurrentLightThemeColors()
    if (themeState.version > 0) {
        applyTheme(themeState.mode)
    }
}

export function initThemeSystem() {
    if (typeof uni === 'undefined') return
    if (!cachedLightThemeColors) {
        cachedLightThemeColors = getCurrentLightThemeColors()
    }
    currentThemePreference = readThemePreferenceFromStorage()
    if (currentThemePreference === THEME_MODE_SYSTEM) {
        applyTheme(getSystemTheme())
    } else {
        applyTheme(currentThemePreference)
    }
    if (!hasRegisterThemeListener && typeof uni.onThemeChange === 'function') {
        uni.onThemeChange((res = {}) => {
            if (currentThemePreference === THEME_MODE_SYSTEM) {
                applyTheme(res.theme)
            }
        })
        hasRegisterThemeListener = true
    }
}
