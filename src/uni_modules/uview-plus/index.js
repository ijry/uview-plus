// 看到此报错，是因为没有配置vite.config.js的【transpileDependencies】
// const pleaseSetTranspileDependencies = {}, babelTest = pleaseSetTranspileDependencies?.test

// 引入全局mixin
import { mixin } from './libs/mixin/mixin.js'
// 小程序特有的mixin
import { mpMixin } from './libs/mixin/mpMixin.js'

// 路由封装
import route from './libs/util/route.js'
// 颜色渐变相关,colorGradient-颜色渐变,hexToRgb-十六进制颜色转rgb颜色,rgbToHex-rgb转十六进制
import colorGradient from './libs/function/colorGradient.js'

// 规则检验
import test from './libs/function/test.js'
// 防抖方法
import debounce from './libs/function/debounce.js'
// 节流方法
import throttle from './libs/function/throttle.js'
// 浮点计算
import calc from './libs/function/calc.js'
// 浮点计算
import digit from './libs/function/digit.js'
// 公共文件写入的方法
import index, { rpx2px } from './libs/function/index.js'

// 配置信息
import config from './libs/config/config.js'
// props配置信息
import props from './libs/config/props.js'
// 各个需要fixed的地方的z-index配置文件
import zIndex from './libs/config/zIndex.js'
// 关于颜色的配置，特殊场景使用
import color from './libs/config/color.js'
// 平台
import platform from './libs/function/platform'

// http
import http from './libs/function/http.js'

// fontUtil
import fontUtil from './components/u-icon/util.js';

// i18n
import i18n, { t } from './libs/i18n/index.js'
import {
    themeState,
    setTheme,
    setThemePreference,
    getThemePreference,
    getSystemTheme,
    getThemeVars,
    initThemeSystem,
    refreshThemeFromConfig
} from './libs/theme/theme.js'

const rootToastState = {
    ref: null
}
const rootNotifyState = {
    ref: null
}

function normalizeRootToastOptions(options = {}) {
    const toastOptions = typeof options === 'string'
        ? { message: options }
        : (options && typeof options === 'object' ? { ...options } : {})
    if (!toastOptions.message && toastOptions.title) {
        toastOptions.message = toastOptions.title
    }
    return toastOptions
}

function setRootToastRef(ref = null) {
    rootToastState.ref = ref || null
}

function rootToast(options = {}) {
    const toastOptions = normalizeRootToastOptions(options)
    const toastRef = rootToastState.ref
    if (toastRef && typeof toastRef.show === 'function') {
        toastRef.show(toastOptions)
        return
    }
    if (!toastOptions.message) return
    if (typeof uni !== 'undefined' && typeof uni.showToast === 'function') {
        uni.showToast({
            title: toastOptions.message,
            icon: 'none',
            duration: Number(toastOptions.duration) || 2000,
        })
    }
}

function normalizeRootNotifyOptions(options = {}) {
    const notifyOptions = typeof options === 'string'
        ? { message: options }
        : (options && typeof options === 'object' ? { ...options } : {})
    if (!notifyOptions.message && notifyOptions.title) {
        notifyOptions.message = notifyOptions.title
    }
    return notifyOptions
}

function setRootNotifyRef(ref = null) {
    rootNotifyState.ref = ref || null
}

function rootNotify(options = {}) {
    const notifyOptions = normalizeRootNotifyOptions(options)
    const notifyRef = rootNotifyState.ref
    if (notifyRef && typeof notifyRef.show === 'function') {
        notifyRef.show(notifyOptions)
        return
    }
    if (!notifyOptions.message) return
    if (typeof uni !== 'undefined' && typeof uni.showToast === 'function') {
        uni.showToast({
            title: notifyOptions.message,
            icon: 'none',
            duration: Number(notifyOptions.duration) || 3000,
        })
    }
}

// 导出
let themeType = ['primary', 'success', 'error', 'warning', 'info'];
export { route, http, debounce, throttle, calc, digit, platform, themeType, mixin, mpMixin, props, color, test, zIndex, fontUtil, i18n , rpx2px, t}
export * from './libs/function/index.js'
export * from './libs/function/colorGradient.js'

/**
 * @description 修改uView内置属性值
 * @param {object} props 修改内置props属性
 * @param {object} config 修改内置config属性
 * @param {object} color 修改内置color属性
 * @param {object} zIndex 修改内置zIndex属性
 */
export function setConfig(configs) {
    const settings = configs || {}
	index.shallowMerge(config, settings.config || {})
	index.shallowMerge(props, settings.props || {})
	index.shallowMerge(color, settings.color || {})
	index.shallowMerge(zIndex, settings.zIndex || {})
    const shouldRefreshTheme = !!settings.color
        || !!settings?.config?.color
        || themeState.version > 0
    if (shouldRefreshTheme) {
        refreshThemeFromConfig()
    }
}
index.setConfig = setConfig

const $u = {
    route,
    date: index.timeFormat, // 另名date
    colorGradient: colorGradient.colorGradient,
    hexToRgb: colorGradient.hexToRgb,
    rgbToHex: colorGradient.rgbToHex,
    colorToRgba: colorGradient.colorToRgba,
    test,
    type: themeType,
    http,
    config, // uview-plus配置信息相关，比如版本号
    zIndex,
    debounce,
    throttle,
	calc,
    mixin,
    mpMixin,
    // props,
    ...index,
    color,
    platform,
    theme: themeState,
    setTheme,
    setThemePreference,
    getThemePreference,
    getSystemTheme,
    getThemeVars,
    rootToast,
    setRootToastRef,
    rootNotify,
    setRootNotifyRef
}

export const mount$u = function() {
    uni.$u = $u
    initThemeSystem()
}

function toCamelCase(str) {
    return str.replace(/-([a-z])/g, function(match, group1) {
      return group1.toUpperCase();
    }).replace(/^[a-z]/, function(match) {
      return match.toUpperCase();
    });
}

let components = []

function resolveComponents() {
    if (components.length) return components
    // #ifdef APP || H5
    const canUseGlob = typeof import.meta !== 'undefined' && typeof import.meta.glob === 'function'
    if (!canUseGlob) return components
    const importFn = import.meta.glob('./components/u-*/u-*.vue', { eager: true })
    for (const key in importFn) {
        const component = importFn[key]?.default
        if (component?.name && component.name.indexOf('u--') !== 0) {
            components.push(component)
        }
    }
    // #endif
    return components
}

const install = (Vue, upuiParams = '') => {
    // #ifdef APP || H5
    resolveComponents().forEach(function(component) {
        const name = component.name.replace(/u-([a-zA-Z0-9-_]+)/g, 'up-$1');
		if (name != component.name) {
			Vue.component(component.name, component); 
		}
        Vue.component(name, component); 
    });
    // #endif
	
	// 初始化
	if (upuiParams) {
		uni.upuiParams = upuiParams
		let temp = upuiParams()
		if (temp.httpIns) {
			temp.httpIns(http)
		}
		if (temp.options) {
			setConfig(temp.options)
		}
	}

    // 同时挂载到uni和Vue.prototype中
    // $u挂载到uni对象上
    uni.$u = $u
    initThemeSystem()

    if (Vue && Vue.config && Vue.config.globalProperties) {
        Vue.config.globalProperties.$u = $u
    }
    if (Vue && typeof Vue.mixin === 'function') {
        Vue.mixin(mixin)
    }
}

export default {
    install
}
