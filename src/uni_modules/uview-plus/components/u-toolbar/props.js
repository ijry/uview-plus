import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 是否展示工具条
        show: {
            type: Boolean,
            default: () => defProps.toolbar.show
        },
        // 取消按钮的文字
        cancelText: {
            type: String,
            default: () => defProps.toolbar.cancelText
        },
        // 确认按钮的文字
        confirmText: {
            type: String,
            default: () => defProps.toolbar.confirmText
        },
        // 取消按钮的颜色
        cancelColor: {
            type: String,
            default: () => defProps.toolbar.cancelColor
        },
        // 确认按钮的颜色
        confirmColor: {
            type: String,
            default: () => defProps.toolbar.confirmColor
        },
        // 标题文字
        title: {
            type: String,
            default: () => defProps.toolbar.title
        },
        // 开启右侧插槽
        rightSlot: {
            type: Boolean,
            default: false
        }
    }
})
