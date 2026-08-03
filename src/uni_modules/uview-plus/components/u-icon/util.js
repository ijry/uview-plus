import config from '../../libs/config/config';

const iconFontFamily = 'uicon-iconfont';
const appIconFontUrl = '_www/static/app-plus/uview-plus/upicon.ttf';
const useAppStaticIconFont = false;

let params = {
    loaded: false
};

const getAppIconUrl = () => {
    // #ifdef APP || APP-NVUE
    if (!useAppStaticIconFont) {
        return config.iconUrl;
    }
    if (typeof plus !== 'undefined' && plus.io && typeof plus.io.convertLocalFileSystemURL === 'function') {
        const iconFontPath = plus.io.convertLocalFileSystemURL(appIconFontUrl);
        if (iconFontPath) return iconFontPath;
    }
    return appIconFontUrl;
    // #endif
    return '';
};

const getIconUrl = () => {
    // #ifdef APP || APP-NVUE
    return getAppIconUrl();
    // #endif
    return config.iconUrl;
};

const markFontLoaded = () => {
    // App端使用包内本地字体，重复注册没有收益且会放大多图标页面开销。
    // #ifdef APP || APP-NVUE
    params.loaded = true;
    return;
    // #endif
    // 全局加载不稳定，默认关闭，需要开启可以配置loadFontOnce。
    if (config.loadFontOnce) {
        params.loaded = true;
    }
};

// 加载字体方法
const loadFont = () => {
    const iconUrl = getIconUrl();
    markFontLoaded();
    // #ifdef APP-NVUE
    // nvue通过weex的dom模块引入字体，相关文档地址如下：
    // https://weex.apache.org/zh/docs/modules/dom.html#addrule
    const domModule = weex.requireModule('dom');
    domModule.addRule('fontFace', {
        'fontFamily': iconFontFamily,
        'src': `url('${iconUrl}')`
    });
    if (config.customIcon.family) {
        domModule.addRule('fontFace', {
            'fontFamily': config.customIcon.family,
            'src': `url('${config.customIcon.url}')`
        });
    }
    // #endif
    // #ifdef APP || H5 || MP-WEIXIN || MP-ALIPAY
    uni.loadFontFace({
        global: true, // 是否全局生效。微信小程序 '2.10.0'起支持全局生效，需在 app.vue 中调用。
        family: iconFontFamily,
        source: 'url("' + iconUrl + '")',
        success() {
            // console.log('内置字体图标加载成功');
        },
        fail() {
            // console.error('内置字体图标加载出错');
        }
    });
    if (config.customIcon.family) {
        uni.loadFontFace({
            global: true, // 是否全局生效。微信小程序 '2.10.0'起支持全局生效，需在 app.vue 中调用。
            family: config.customIcon.family,
            source: 'url("' + config.customIcon.url + '")',
            success() {
                // console.log('扩展字体图标加载成功');
            },
            fail() {
                // console.error('扩展字体图标加载出错');
            }
        });
    }
    // #endif
    // #ifdef APP-NVUE
    // if (this.customFontFamily) {
    //     domModule.addRule('fontFace', {
    //         'fontFamily': `${this.customPrefix}-${this.customFontFamily}`,
    //         'src': `url('${this.customFontUrl}')`
    //     })
    // }
    // #endif
    return true;
};

export default {
    params: params,
    loadFont
}
