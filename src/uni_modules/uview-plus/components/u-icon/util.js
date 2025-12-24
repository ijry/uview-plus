import config from '../../libs/config/config';

let params = {
    loaded: false
};
// 加载字体方法
const loadFont = () => {
    // console.log('加载字体图标');
    // 全局加载不稳定，默认关闭，需要开启可以配置loadFontOnce。
    if (config.loadFontOnce) {
        params.loaded = true;
    }
    // #ifdef APP-NVUE
    // nvue通过weex的dom模块引入字体，相关文档地址如下：
    // https://weex.apache.org/zh/docs/modules/dom.html#addrule
    const domModule = weex.requireModule('dom');
    domModule.addRule('fontFace', {
        'fontFamily': "uicon-iconfont",
        'src': `url('${config.iconUrl}')`
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
        family: 'uicon-iconfont',
        source: 'url("' + config.iconUrl + '")',
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
