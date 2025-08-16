/*
 * @Author       : LQ
 * @Description  :
 * @version      : 3.0
 * @LastAuthor   : jry
 * @lastTime     : 2025-08-16 10:52:35
 * @FilePath     : /uview-plus/libs/config/props/props.js
 */
import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'

export const props = defineMixin({
    props: {
        // 操作菜单是否展示 （默认false）
        show: {
            type: Boolean,
            default: () => defProps.actionSheet.show
        },
        // 标题
        title: {
            type: String,
            default: () => defProps.actionSheet.title
        },
        // 选项上方的描述信息
        description: {
            type: String,
            default: () => defProps.actionSheet.description
        },
        // 数据
        actions: {
            type: Array,
            default: () => defProps.actionSheet.actions
        },
        // 取消按钮的文字，不为空时显示按钮
        cancelText: {
            type: String,
            default: () => defProps.actionSheet.cancelText
        },
        // 点击某个菜单项时是否关闭弹窗
        closeOnClickAction: {
            type: Boolean,
            default: () => defProps.actionSheet.closeOnClickAction
        },
        // 处理底部安全区（默认true）
        safeAreaInsetBottom: {
            type: Boolean,
            default: () => defProps.actionSheet.safeAreaInsetBottom
        },
        // 小程序的打开方式
        openType: {
            type: String,
            default: () => defProps.actionSheet.openType
        },
        // 点击遮罩是否允许关闭 (默认true)
        closeOnClickOverlay: {
            type: Boolean,
            default: () => defProps.actionSheet.closeOnClickOverlay
        },
        // 圆角值
        round: {
            type: [Boolean, String, Number],
            default: () => defProps.actionSheet.round
        },
        // 选项区域最大高度
        wrapMaxHeight: {
            type: [String],
            default: () => defProps.actionSheet.wrapMaxHeight
        },
    }
})
