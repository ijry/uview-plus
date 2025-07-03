import { defineMixin } from '../../libs/vue'
import defProps from './link'
let crtProp = defProps['link'] as UTSJSONObject

export const propsLink = defineMixin({
    props: {
        // 文字颜色
        color: {
            type: String,
            default: crtProp['color']
        },
        // 字体大小，单位px
        fontSize: {
            type: [String],
            default: crtProp['fontSize']
        },
        // 是否显示下划线
        underLine: {
            type: Boolean,
            default: crtProp['underLine']
        },
        // 要跳转的链接
        href: {
            type: String,
            default: crtProp['href']
        },
        // 小程序中复制到粘贴板的提示语
        mpTips: {
            type: String,
            default: crtProp['mpTips']
        },
        // 下划线颜色
        lineColor: {
            type: String,
            default: crtProp['lineColor']
        },
        // 超链接的问题，不使用slot形式传入，是因为nvue下无法修改颜色
        text: {
            type: String,
            default: crtProp['text']
        }
    }
})
