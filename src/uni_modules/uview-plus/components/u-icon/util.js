import config from '../../libs/config/config';

const iconFontFamily = 'uicon-iconfont';
const appIconFontUrl = '_www/static/app-plus/uview-plus/upicon.ttf';
const useAppStaticIconFont = false;

let params = {
    loaded: false,
    loading: false
};

// #ifdef APP-VUE
const appVueLoadedPages = new WeakSet();
const appVueLoadingPages = new WeakSet();
// #endif

const getCurrentAppVuePage = () => {
    // #ifdef APP-VUE
    try {
        if (typeof getCurrentPages !== 'function') return null;
        const pages = getCurrentPages();
        if (!Array.isArray(pages) || pages.length === 0) return null;
        const page = pages[pages.length - 1];
        return page && (typeof page === 'object' || typeof page === 'function') ? page : null;
    } catch (e) {
        return null;
    }
    // #endif
    return null;
};

const isLoaded = () => {
    // #ifdef APP-VUE
    const page = getCurrentAppVuePage();
    return !!page && appVueLoadedPages.has(page);
    // #endif
    return params.loaded;
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
    // App Vue的字体注册只对当前页面WebView生效，由页面级状态在成功回调中记录。
    // #ifdef APP-VUE
    return;
    // #endif
    params.loading = false;
    // #ifdef APP-NVUE
    params.loaded = true;
    return;
    // #endif
    // 非App Vue平台由loadFontOnce决定成功后是否复用本次加载结果。
    if (config.loadFontOnce) {
        params.loaded = true;
    }
};

// 加载字体方法
const loadFont = () => {
    // #ifdef APP-VUE
    const appVuePage = getCurrentAppVuePage();
    if (!appVuePage || appVueLoadedPages.has(appVuePage) || appVueLoadingPages.has(appVuePage)) {
        return false;
    }
    appVueLoadingPages.add(appVuePage);
    // #endif
    // #ifndef APP-VUE
    if (params.loaded || params.loading) {
        return false;
    }
    params.loading = true;
    // #endif
    const iconUrl = getIconUrl();
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
    markFontLoaded();
    // #endif
    // #ifdef APP-VUE || H5 || MP-WEIXIN || MP-ALIPAY
    uni.loadFontFace({
        global: true, // 是否全局生效。微信小程序 '2.10.0'起支持全局生效，需在 app.vue 中调用。
        family: iconFontFamily,
        source: 'url("' + iconUrl + '")',
        success() {
            // #ifdef APP-VUE
            appVueLoadingPages.delete(appVuePage);
            appVueLoadedPages.add(appVuePage);
            // #endif
            markFontLoaded();
            // console.log('内置字体图标加载成功');
        },
        fail() {
            // #ifdef APP-VUE
            appVueLoadingPages.delete(appVuePage);
            // #endif
            // #ifndef APP-VUE
            params.loading = false;
            // #endif
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
    isLoaded,
    loadFont
}
