import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 需要显示的提示文字
        text: {
            type: [String, Number],
            default: () => defProps.tooltip.text
        },
        // 点击复制按钮时，复制的文本，为空则使用text值
        copyText: {
            type: [String, Number],
            default: () => defProps.tooltip.copyText
        },
        // 文本大小
        size: {
            type: [String, Number],
            default: () => defProps.tooltip.size
        },
        // 字体颜色
        color: {
            type: String,
            default: () => defProps.tooltip.color
        },
        // 弹出提示框时，文本的背景色
        bgColor: {
            type: String,
            default: () => defProps.tooltip.bgColor
        },
        // 弹出提示框的背景色
        popupBgColor: {
            type: String,
            default: () => defProps.tooltip.popupBgColor
        },
        // 弹出提示的方向，top-上方，bottom-下方，left-左方，right-右方
        direction: {
            type: String,
            default: () => defProps.tooltip.direction
        },
        // 弹出提示的z-index，nvue无效
        zIndex: {
            type: [String, Number],
            default: () => defProps.tooltip.zIndex
        },
        // 是否显示复制按钮
        showCopy: {
            type: Boolean,
            default: () => defProps.tooltip.showCopy
        },
        // 扩展的按钮组
        buttons: {
            type: Array,
            default: () => defProps.tooltip.buttons
        },
        // 是否显示透明遮罩以防止触摸穿透
        overlay: {
            type: Boolean,
            default: () => defProps.tooltip.overlay
        },
        // 是否显示复制成功或者失败的toast
        showToast: {
            type: Boolean,
            default: () => defProps.tooltip.showToast
        },
        // 触发方式，可选值：longpress/click
        triggerMode: {
            type: String,
            default: () => defProps.tooltip.triggerMode
        },
    }
})