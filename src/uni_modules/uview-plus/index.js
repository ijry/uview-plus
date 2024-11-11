// 看到此报错，是因为没有配置vite.config.js的【transpileDependencies】
// const pleaseSetTranspileDependencies = {}, babelTest = pleaseSetTranspileDependencies?.test

// 引入全局mixin
import { mixin } from './libs/mixin/mixin.js'
// 小程序特有的mixin
import { mpMixin } from './libs/mixin/mpMixin.js'
// 全局挂载引入http相关请求拦截插件
import Request from './libs/luch-request'

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
// 公共文件写入的方法
import index from './libs/function/index.js'

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

// 导出
const http = new Request()
let themeType = ['primary', 'success', 'error', 'warning', 'info'];
export { route, http, debounce, throttle, platform, themeType, mixin, mpMixin, props, color, test, zIndex }
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
	index.shallowMerge(config, configs.config || {})
	index.shallowMerge(props, configs.props || {})
	index.shallowMerge(color, configs.color || {})
	index.shallowMerge(zIndex, configs.zIndex || {})
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
    mixin,
    mpMixin,
    props,
    ...index,
    color,
    platform
}

export const mount$u = function() {
    uni.$u = $u
}

// #ifdef H5
const importFn = import.meta.glob('./components/u-*/u-*.vue', { eager: true })
let components = [];

// 批量注册全局组件
for (const key in importFn) {
    let component = importFn[key].default;
    if (component.name && component.name.indexOf('u--') !== 0) {
        component.install = function (Vue) {
            Vue.component(name, component);
        };
        
        // 导入组件
        components.push(component);
    }
}
// #endif

function toCamelCase(str) {
    return str.replace(/-([a-z])/g, function(match, group1) {
      return group1.toUpperCase();
    }).replace(/^[a-z]/, function(match) {
      return match.toUpperCase();
    });
}

const install = (Vue) => {
    // #ifdef H5
    components.forEach(function(component) {
        const name = component.name.replace(/u-([a-zA-Z0-9-_]+)/g, 'up-$1');
        Vue.component(name, component); 
    });
    // #endif

    // 同时挂载到uni和Vue.prototype中
    // $u挂载到uni对象上
    uni.$u = $u

    // #ifndef APP-NVUE
    // 只有vue，挂载到Vue.prototype才有意义，因为nvue中全局Vue.prototype和Vue.mixin是无效的
    Vue.config.globalProperties.$u = $u
    Vue.mixin(mixin)
    // #endif
}

export default {
    install
}
