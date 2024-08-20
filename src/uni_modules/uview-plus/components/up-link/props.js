import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 文字颜色
        color: {
            type: String,
            default: () => defProps.link.color
        },
        // 字体大小，单位px
        fontSize: {
            type: [String, Number],
            default: () => defProps.link.fontSize
        },
        // 是否显示下划线
        underLine: {
            type: Boolean,
            default: () => defProps.link.underLine
        },
        // 要跳转的链接
        href: {
            type: String,
            default: () => defProps.link.href
        },
        // 小程序中复制到粘贴板的提示语
        mpTips: {
            type: String,
            default: () => defProps.link.mpTips
        },
        // 下划线颜色
        lineColor: {
            type: String,
            default: () => defProps.link.lineColor
        },
        // 超链接的问题，不使用slot形式传入，是因为nvue下无法修改颜色
        text: {
            type: String,
            default: () => defProps.link.text
        }
    }
})
