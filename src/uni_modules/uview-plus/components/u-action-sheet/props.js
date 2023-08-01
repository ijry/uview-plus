import defprops from '../../libs/config/props';
export default {
    props: {
        // 操作菜单是否展示 （默认false）
        show: {
            type: Boolean,
            default: defprops.actionSheet.show
        },
        // 标题
        title: {
            type: String,
            default: defprops.actionSheet.title
        },
        // 选项上方的描述信息
        description: {
            type: String,
            default: defprops.actionSheet.description
        },
        // 数据
        actions: {
            type: Array,
            default: defprops.actionSheet.actions
        },
        // 取消按钮的文字，不为空时显示按钮
        cancelText: {
            type: String,
            default: defprops.actionSheet.cancelText
        },
        // 点击某个菜单项时是否关闭弹窗
        closeOnClickAction: {
            type: Boolean,
            default: defprops.actionSheet.closeOnClickAction
        },
        // 处理底部安全区（默认true）
        safeAreaInsetBottom: {
            type: Boolean,
            default: defprops.actionSheet.safeAreaInsetBottom
        },
        // 小程序的打开方式
        openType: {
            type: String,
            default: defprops.actionSheet.openType
        },
        // 点击遮罩是否允许关闭 (默认true)
        closeOnClickOverlay: {
            type: Boolean,
            default: defprops.actionSheet.closeOnClickOverlay
        },
        // 圆角值
        round: {
            type: [Boolean, String, Number],
            default: defprops.actionSheet.round
        }
    }
}
