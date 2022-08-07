import defprops from '../../libs/config/props';
export default {
    props: {
        // 需要显示的提示文字
        text: {
            type: [String, Number],
            default: defprops.tooltip.text
        },
        // 点击复制按钮时，复制的文本，为空则使用text值
        copyText: {
            type: [String, Number],
            default: defprops.tooltip.copyText
        },
        // 文本大小
        size: {
            type: [String, Number],
            default: defprops.tooltip.size
        },
        // 字体颜色
        color: {
            type: String,
            default: defprops.tooltip.color
        },
        // 弹出提示框时，文本的背景色
        bgColor: {
            type: String,
            default: defprops.tooltip.bgColor
        },
        // 弹出提示的方向，top-上方，bottom-下方
        direction: {
            type: String,
            default: defprops.tooltip.direction
        },
        // 弹出提示的z-index，nvue无效
        zIndex: {
            type: [String, Number],
            default: defprops.tooltip.zIndex
        },
        // 是否显示复制按钮
        showCopy: {
            type: Boolean,
            default: defprops.tooltip.showCopy
        },
        // 扩展的按钮组
        buttons: {
            type: Array,
            default: defprops.tooltip.buttons
        },
        // 是否显示透明遮罩以防止触摸穿透
        overlay: {
            type: Boolean,
            default: defprops.tooltip.overlay
        },
        // 是否显示复制成功或者失败的toast
        showToast: {
            type: Boolean,
            default: defprops.tooltip.showToast
        }
    }
}
