import config from '../../libs/config/config';

const iconFontFamily = 'uicon-iconfont';
const appIconFontUrl = '_www/static/app-plus/uview-plus/upicon.ttf';
// App 端默认优先加载随包分发的本地字体，图标不再依赖 CDN。
// 项目没有本地字体（未启用本地字体构建插件、或没拷贝 static/app-plus/uview-plus/upicon.ttf）时：
// App-Vue 在 uni.loadFontFace 失败后回退 config.iconUrl，App-nvue 先探测字体文件是否存在再决定字体地址。
const useAppStaticIconFont = true;

let params = {
    loaded: false,
    loading: false
};

// #ifdef APP-VUE
const appVueLoadedPages = new WeakSet();
const appVueLoadingPages = new WeakSet();
// 本地字体加载失败后回退远程字体，每个页面只回退一次，避免反复请求不存在的本地字体
const appVueFallbackPages = new WeakSet();
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
        return iconFontPath && iconFontPath.startsWith('file://') ? iconFontPath : 'file://' + iconFontPath;
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

// #ifdef APP-NVUE
const addNvueFontRule = (family, url) => {
    const domModule = weex.requireModule('dom');
    domModule.addRule('fontFace', {
        'fontFamily': family,
        'src': `url('${url}')`
    });
};

// nvue的dom.addRule没有失败回调，注册前先探测本地字体文件是否存在，不存在时回退远程字体
const registerNvueFontFace = (iconUrl) => {
    const addFontFace = (url) => {
        addNvueFontRule(iconFontFamily, url);
        if (config.customIcon.family) {
            addNvueFontRule(config.customIcon.family, config.customIcon.url);
        }
        markFontLoaded();
    };
    if (!useAppStaticIconFont || iconUrl === config.iconUrl) {
        addFontFace(iconUrl);
        return;
    }
    if (typeof plus === 'undefined' || !plus.io || typeof plus.io.resolveLocalFileSystemURL !== 'function') {
        addFontFace(iconUrl);
        return;
    }
    const localFontPath = typeof plus.io.convertLocalFileSystemURL === 'function'
        ? plus.io.convertLocalFileSystemURL(appIconFontUrl)
        : appIconFontUrl;
    try {
        plus.io.resolveLocalFileSystemURL(localFontPath, () => addFontFace(iconUrl), () => addFontFace(config.iconUrl));
    } catch (e) {
        addFontFace(iconUrl);
    }
};
// #endif

// #ifdef APP-VUE
const registerAppVueFontFace = (iconUrl, appVuePage) => {
    uni.loadFontFace({
        global: true, // 是否全局生效。微信小程序 '2.10.0'起支持全局生效，需在 app.vue 中调用。
        family: iconFontFamily,
        source: 'url("' + iconUrl + '")',
        success() {
            appVueLoadingPages.delete(appVuePage);
            appVueLoadedPages.add(appVuePage);
            markFontLoaded();
            // console.log('内置字体图标加载成功');
        },
        fail() {
            // 本地字体缺失时回退远程字体，保证未启用本地字体的老项目仍可显示图标
            if (iconUrl !== config.iconUrl && !appVueFallbackPages.has(appVuePage)) {
                appVueFallbackPages.add(appVuePage);
                registerAppVueFontFace(config.iconUrl, appVuePage);
                return;
            }
            appVueLoadingPages.delete(appVuePage);
            // console.error('内置字体图标加载出错');
        }
    });
};
// #endif

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
    registerNvueFontFace(iconUrl);
    // #endif
    // #ifdef APP-VUE
    registerAppVueFontFace(iconUrl, appVuePage);
    // #endif
    // #ifdef H5 || MP-WEIXIN || MP-ALIPAY
    uni.loadFontFace({
        global: true, // 是否全局生效。微信小程序 '2.10.0'起支持全局生效，需在 app.vue 中调用。
        family: iconFontFamily,
        source: 'url("' + iconUrl + '")',
        success() {
            markFontLoaded();
            // console.log('内置字体图标加载成功');
        },
        fail() {
            params.loading = false;
            // console.error('内置字体图标加载出错');
        }
    });
    // #endif
    // #ifdef APP-VUE || H5 || MP-WEIXIN || MP-ALIPAY
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
    return true;
};

export default {
    params: params,
    isLoaded,
    loadFont
}
