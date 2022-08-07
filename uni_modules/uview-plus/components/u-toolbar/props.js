import defprops from '../../libs/config/props';
export default {
    props: {
        // 是否展示工具条
        show: {
            type: Boolean,
            default: defprops.toolbar.show
        },
        // 取消按钮的文字
        cancelText: {
            type: String,
            default: defprops.toolbar.cancelText
        },
        // 确认按钮的文字
        confirmText: {
            type: String,
            default: defprops.toolbar.confirmText
        },
        // 取消按钮的颜色
        cancelColor: {
            type: String,
            default: defprops.toolbar.cancelColor
        },
        // 确认按钮的颜色
        confirmColor: {
            type: String,
            default: defprops.toolbar.confirmColor
        },
        // 标题文字
        title: {
            type: String,
            default: defprops.toolbar.title
        }
    }
}
