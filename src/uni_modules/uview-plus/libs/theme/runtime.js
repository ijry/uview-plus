const THEME_MODE_STORAGE_KEY = 'u-theme-mode'

const FALLBACK_THEME_VARS = {
    light: {
        '--up-main-color': 'var(--up-light-main-color, #303133)',
        '--up-content-color': 'var(--up-light-content-color, #606266)',
        '--up-tips-color': 'var(--up-light-tips-color, #909193)',
        '--up-light-color': 'var(--up-light-light-color, #c0c4cc)',
        '--up-border-color': 'var(--up-light-border-color, #dadbde)',
        '--up-bg-color': 'var(--up-light-bg-color, #f3f4f6)',
        '--up-hover-bg-color': '#e7ebf0',
        '--up-page-bg-color': '#f3f4f6',
        '--up-card-bg-color': '#ffffff',
        '--up-navbar-bg-color': '#ffffff',
        '--up-table2-header-bg-color': '#f5f7fa',
        '--up-table2-zebra-bg-color': '#fafafa',
        '--up-table2-highlight-bg-color': '#f5f7fa',
        '--up-gap-bg-color': '#f3f4f6',
        '--up-skeleton-bg-color': '#f1f2f4',
        '--up-skeleton-shimmer-color': '#e6e6e6',
        '--up-swipe-action-button-bg-color': '#c7c6cd',
        '--up-index-list-indicator-bg-color': '#c9c9c9',
        '--up-calendar-month-mark-color': 'rgba(231, 232, 234, 0.83)',
        '--up-disabled-color': 'var(--up-light-disabled-color, #c8c9cc)',
        '--up-primary': 'var(--up-light-primary, #3c9cff)',
        '--up-primary-dark': 'var(--up-light-primary-dark, #398ade)',
        '--up-primary-disabled': 'var(--up-light-primary-disabled, #9acafc)',
        '--up-primary-light': 'var(--up-light-primary-light, #ecf5ff)',
        '--up-warning': 'var(--up-light-warning, #f9ae3d)',
        '--up-warning-dark': 'var(--up-light-warning-dark, #f1a532)',
        '--up-warning-disabled': 'var(--up-light-warning-disabled, #f9d39b)',
        '--up-warning-light': 'var(--up-light-warning-light, #fdf6ec)',
        '--up-success': 'var(--up-light-success, #5ac725)',
        '--up-success-dark': 'var(--up-light-success-dark, #53c21d)',
        '--up-success-disabled': 'var(--up-light-success-disabled, #a9e08f)',
        '--up-success-light': 'var(--up-light-success-light, #f5fff0)',
        '--up-error': 'var(--up-light-error, #f56c6c)',
        '--up-error-dark': 'var(--up-light-error-dark, #e45656)',
        '--up-error-disabled': 'var(--up-light-error-disabled, #f7b2b2)',
        '--up-error-light': 'var(--up-light-error-light, #fef0f0)',
        '--up-info': 'var(--up-light-info, #909399)',
        '--up-info-dark': 'var(--up-light-info-dark, #767a82)',
        '--up-info-disabled': 'var(--up-light-info-disabled, #c4c6c9)',
        '--up-info-light': 'var(--up-light-info-light, #f4f4f5)'
    },
    dark: {
        '--up-main-color': '#f5f5f5',
        '--up-content-color': '#d1d5db',
        '--up-tips-color': '#9ca3af',
        '--up-light-color': '#6b7280',
        '--up-border-color': '#3a3a3c',
        '--up-bg-color': '#1f1f1f',
        '--up-hover-bg-color': '#343741',
        '--up-page-bg-color': '#1f1f1f',
        '--up-card-bg-color': '#1c1c1e',
        '--up-navbar-bg-color': '#1c1c1e',
        '--up-table2-header-bg-color': '#2a2d33',
        '--up-table2-zebra-bg-color': '#23262b',
        '--up-table2-highlight-bg-color': '#2f3440',
        '--up-gap-bg-color': '#111111',
        '--up-skeleton-bg-color': '#2f3135',
        '--up-skeleton-shimmer-color': 'rgba(255, 255, 255, 0.12)',
        '--up-swipe-action-button-bg-color': '#4b5563',
        '--up-index-list-indicator-bg-color': '#4b5563',
        '--up-calendar-month-mark-color': 'rgba(255, 255, 255, 0.04)',
        '--up-disabled-color': '#4b5563',
        '--up-primary': '#3c9cff',
        '--up-primary-dark': '#5aa8ff',
        '--up-primary-disabled': '#4c6f92',
        '--up-primary-light': '#10243a',
        '--up-warning': '#f9ae3d',
        '--up-warning-dark': '#ffbf66',
        '--up-warning-disabled': '#8a6a3a',
        '--up-warning-light': '#3d2f1b',
        '--up-success': '#5ac725',
        '--up-success-dark': '#7ad94b',
        '--up-success-disabled': '#5f7f4f',
        '--up-success-light': '#1f3316',
        '--up-error': '#f56c6c',
        '--up-error-dark': '#ff8a8a',
        '--up-error-disabled': '#8d5858',
        '--up-error-light': '#3a2222',
        '--up-info': '#909399',
        '--up-info-dark': '#b0b3b8',
        '--up-info-disabled': '#5f6368',
        '--up-info-light': '#2f3238'
    }
}

const THEME_COLOR_SYNC_MAP = {
    '--up-main-color': 'mainColor',
    '--up-content-color': 'contentColor',
    '--up-tips-color': 'tipsColor',
    '--up-light-color': 'lightColor',
    '--up-border-color': 'borderColor',
    '--up-bg-color': 'bgColor',
    '--up-disabled-color': 'disabledColor',
    '--up-primary': 'primary',
    '--up-primary-dark': 'primaryDark',
    '--up-primary-disabled': 'primaryDisabled',
    '--up-primary-light': 'primaryLight',
    '--up-warning': 'warning',
    '--up-warning-dark': 'warningDark',
    '--up-warning-disabled': 'warningDisabled',
    '--up-warning-light': 'warningLight',
    '--up-success': 'success',
    '--up-success-dark': 'successDark',
    '--up-success-disabled': 'successDisabled',
    '--up-success-light': 'successLight',
    '--up-error': 'error',
    '--up-error-dark': 'errorDark',
    '--up-error-disabled': 'errorDisabled',
    '--up-error-light': 'errorLight',
    '--up-info': 'info',
    '--up-info-dark': 'infoDark',
    '--up-info-disabled': 'infoDisabled',
    '--up-info-light': 'infoLight'
}

function buildFallbackAliasVars(vars) {
    const aliasVars = {}
    Object.keys(vars).forEach((key) => {
        if (typeof key === 'string' && key.indexOf('--up-') === 0) {
            aliasVars[key.replace('--up-', '--u-')] = vars[key]
        }
    })
    return aliasVars
}

function getRuntimeU(upU) {
    if (upU) return upU
    if (typeof uni !== 'undefined') return uni.$u
    return null
}

function normalizeRuntimeRoute(route) {
    if (typeof route !== 'string') return ''
    return route.replace(/^\//, '').split('?')[0]
}

function getCurrentRuntimeRoute() {
    try {
        if (typeof getCurrentPages !== 'function') return ''
        const pages = getCurrentPages()
        if (!Array.isArray(pages) || pages.length === 0) return ''
        const page = pages[pages.length - 1] || {}
        return normalizeRuntimeRoute(page.route || page.path || '')
    } catch (e) {}
    return ''
}

function getRuntimeTabBarRoutes() {
    const routes = []
    try {
        const runtimeConfig = typeof __uniConfig !== 'undefined' ? __uniConfig : null
        const tabBarList = runtimeConfig?.tabBar?.list
        if (Array.isArray(tabBarList)) {
            tabBarList.forEach((item) => {
                const route = normalizeRuntimeRoute(item?.pagePath || '')
                if (route) routes.push(route)
            })
        }
    } catch (e) {}
    return routes
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

export function isTabBarPage() {
    const route = getCurrentRuntimeRoute()
    if (!route) return false
    const tabBarRoutes = getRuntimeTabBarRoutes()
    if (!tabBarRoutes.length) return false
    return tabBarRoutes.includes(route)
}

export function trySetTabBarStyle(options) {
    if (typeof uni === 'undefined' || typeof uni.setTabBarStyle !== 'function') return
    if (!isTabBarPage()) return
    try {
        const result = uni.setTabBarStyle(options)
        if (result && typeof result.catch === 'function') {
            result.catch(() => {})
        }
    } catch (e) {}
}

function normalizeThemeMode(theme = 'light') {
    return theme === 'dark' ? 'dark' : 'light'
}

function normalizeThemePreference(mode = 'system') {
    return mode === 'dark' || mode === 'light' ? mode : 'system'
}

function getFallbackSystemTheme() {
    let theme = 'light'
    try {
        if (typeof uni !== 'undefined' && typeof uni.getAppBaseInfo === 'function') {
            const appBaseInfo = uni.getAppBaseInfo() || {}
            if (appBaseInfo.theme) theme = appBaseInfo.theme
        }
        if (typeof uni !== 'undefined' && typeof uni.getSystemInfoSync === 'function') {
            const systemInfo = uni.getSystemInfoSync() || {}
            if (systemInfo.theme) theme = systemInfo.theme
        }
    } catch (e) {
        theme = 'light'
    }
    return normalizeThemeMode(theme)
}

function getFallbackThemePreference() {
    try {
        if (typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function') {
            const preference = uni.getStorageSync(THEME_MODE_STORAGE_KEY)
            return normalizeThemePreference(preference)
        }
    } catch (e) {}
    return 'system'
}

function getFallbackThemeMode() {
    const preference = getFallbackThemePreference()
    if (preference === 'dark' || preference === 'light') return preference
    return getFallbackSystemTheme()
}

function getFallbackThemeVarsByMode(mode) {
    const vars = FALLBACK_THEME_VARS[normalizeThemeMode(mode)] || FALLBACK_THEME_VARS.light
    return {
        ...vars,
        ...buildFallbackAliasVars(vars)
    }
}

function getFallbackThemeVars(upU) {
    const mode = getThemeIsDark(upU) ? 'dark' : 'light'
    return getFallbackThemeVarsByMode(mode)
}

function syncRuntimeColor(runtimeU, vars) {
    if (!runtimeU || !runtimeU.color) return
    Object.keys(THEME_COLOR_SYNC_MAP).forEach((token) => {
        const field = THEME_COLOR_SYNC_MAP[token]
        runtimeU.color[field] = vars[token]
    })
}

export function syncThemeRuntimeFromStorage(upU) {
    const runtimeU = getRuntimeU(upU)
    if (!runtimeU || !runtimeU.theme) return runtimeU?.theme
    const preference = getFallbackThemePreference()
    const mode = preference === 'system' ? getFallbackSystemTheme() : preference
    const vars = getFallbackThemeVarsByMode(mode)
    const shouldUpdate = runtimeU.theme.preference !== preference || runtimeU.theme.mode !== mode
    if (shouldUpdate && typeof runtimeU.setThemePreference === 'function') {
        return runtimeU.setThemePreference(preference) || runtimeU.theme
    }
    runtimeU.theme.preference = preference
    runtimeU.theme.mode = mode
    runtimeU.theme.vars = {
        ...vars,
        ...(runtimeU.theme.vars && !shouldUpdate ? runtimeU.theme.vars : {})
    }
    if (shouldUpdate) {
        runtimeU.theme.version = Number(runtimeU.theme.version || 0) + 1
    }
    syncRuntimeColor(runtimeU, runtimeU.theme.vars)
    return runtimeU.theme
}

export function getThemeIsDark(upU) {
    const runtimeMode = getRuntimeU(upU)?.theme?.mode
    if (runtimeMode) return runtimeMode === 'dark'
    return getFallbackThemeMode() === 'dark'
}

export function getThemeVarsForStyle(upU) {
    const runtimeU = getRuntimeU(upU)
    if (runtimeU && typeof runtimeU.getThemeVars === 'function') {
        return runtimeU.getThemeVars()
    }
    return getFallbackThemeVars(runtimeU)
}

export function getThemeVar(varName, fallbackColor, upU) {
    const runtimeU = getRuntimeU(upU)
    const themeVars = runtimeU?.theme?.vars
    if (themeVars && Object.prototype.hasOwnProperty.call(themeVars, varName)) {
        return themeVars[varName]
    }
    if (typeof varName === 'string') {
        const aliasVarName = varName.indexOf('--up-') === 0
            ? varName.replace('--up-', '--u-')
            : (varName.indexOf('--u-') === 0 ? varName.replace('--u-', '--up-') : '')
        if (aliasVarName && themeVars && Object.prototype.hasOwnProperty.call(themeVars, aliasVarName)) {
            return themeVars[aliasVarName]
        }
        const runtimeColorMap = runtimeU?.config?.color || {}
        const colorTokenKey = varName.indexOf('--') === 0 ? varName.slice(2) : varName
        if (Object.prototype.hasOwnProperty.call(runtimeColorMap, colorTokenKey)) {
            return runtimeColorMap[colorTokenKey]
        }
        const aliasColorTokenKey = colorTokenKey.indexOf('up-') === 0
            ? colorTokenKey.replace('up-', 'u-')
            : (colorTokenKey.indexOf('u-') === 0 ? colorTokenKey.replace('u-', 'up-') : '')
        if (aliasColorTokenKey && Object.prototype.hasOwnProperty.call(runtimeColorMap, aliasColorTokenKey)) {
            return runtimeColorMap[aliasColorTokenKey]
        }
    }
    if (runtimeU && typeof runtimeU.getThemeVars === 'function') {
        const vars = runtimeU.getThemeVars()
        if (vars && Object.prototype.hasOwnProperty.call(vars, varName)) {
            return vars[varName]
        }
    }
    const fallbackVars = getFallbackThemeVars(runtimeU)
    if (fallbackVars && Object.prototype.hasOwnProperty.call(fallbackVars, varName)) {
        return fallbackVars[varName]
    }
    return typeof fallbackColor !== 'undefined' ? fallbackColor : ''
}

export function getThemeCssVar(varName, fallbackColor) {
    if (typeof fallbackColor === 'undefined') {
        return `var(${varName})`
    }
    return `var(${varName}, ${fallbackColor})`
}

export function getThemePageStyle(upU, preferCssVars = false) {
    const runtimeU = getRuntimeU(upU)
    const isDark = getThemeIsDark(runtimeU)
    const fallbackBg = isDark ? '#1f1f1f' : (runtimeU?.color?.bgColor || '#f3f4f6')
    if (preferCssVars) {
        return {
            ...getThemeVarsForStyle(runtimeU),
            minHeight: '100vh',
            backgroundColor: `var(--up-page-bg-color, var(--up-bg-color, ${fallbackBg}))`
        }
    }
    return {
        backgroundColor: getThemeVar(
            '--up-page-bg-color',
            getThemeVar('--up-bg-color', fallbackBg, runtimeU),
            runtimeU
        )
    }
}

export function getThemeCardStyle(upU, preferCssVars = false) {
    const runtimeU = getRuntimeU(upU)
    const isDark = getThemeIsDark(runtimeU)
    const fallbackCard = isDark ? '#1c1c1e' : '#ffffff'
    const fallbackBorder = runtimeU?.color?.borderColor || '#dadbde'
    if (preferCssVars) {
        return {
            backgroundColor: `var(--up-card-bg-color, ${fallbackCard})`,
            borderColor: `var(--up-border-color, ${fallbackBorder})`
        }
    }
    return {
        backgroundColor: getThemeVar('--up-card-bg-color', fallbackCard, runtimeU),
        borderColor: getThemeVar('--up-border-color', fallbackBorder, runtimeU)
    }
}

export function getThemeTabBarStyle(upU) {
    const runtimeU = getRuntimeU(upU)
    const isDark = getThemeIsDark(runtimeU)
    return {
        color: isDark ? '#8e8e93' : '#909399',
        selectedColor: isDark ? '#f2f2f7' : '#303133',
        backgroundColor: isDark ? '#111111' : '#ffffff',
        borderStyle: isDark ? 'white' : 'black'
    }
}

export function applyNativeThemeUI(upU) {
    if (typeof uni === 'undefined') return
    const runtimeU = getRuntimeU(upU)
    if (runtimeU?.config?.nativeThemeSync !== true) return
    const isDark = getThemeIsDark(runtimeU)
    const fallbackBg = isDark ? '#1f1f1f' : (runtimeU?.color?.bgColor || '#f3f4f6')
    const pageBg = getThemeVar(
        '--up-page-bg-color',
        getThemeVar('--up-bg-color', fallbackBg, runtimeU),
        runtimeU
    )
    const navBg = getThemeVar(
        '--up-navbar-bg-color',
        isDark ? '#1c1c1e' : '#ffffff',
        runtimeU
    )
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
    trySetTabBarStyle(getThemeTabBarStyle(runtimeU))
}

export function applyNativeThemeUIDeferred(upU, delay = 30) {
    applyNativeThemeUI(upU)
    if (typeof setTimeout === 'function') {
        setTimeout(() => {
            applyNativeThemeUI(upU)
        }, delay)
    }
}
