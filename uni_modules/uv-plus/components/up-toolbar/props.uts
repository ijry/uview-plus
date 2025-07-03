import { defineMixin } from '../../libs/vue'
import defProps from './toolbar'
let crtProp = defProps['toolbar'] as UTSJSONObject

export const propsToolbar = defineMixin({
    props: {
        // 是否展示工具条
        show: {
            type: Boolean,
            default: crtProp['show']
        },
        // 取消按钮的文字
        cancelText: {
            type: String,
            default: crtProp['cancelText']
        },
        // 确认按钮的文字
        confirmText: {
            type: String,
            default: crtProp['confirmText']
        },
        // 取消按钮的颜色
        cancelColor: {
            type: String,
            default: crtProp['cancelColor']
        },
        // 确认按钮的颜色
        confirmColor: {
            type: String,
            default: crtProp['confirmColor']
        },
        // 标题文字
        title: {
            type: String,
            default: crtProp['title']
        },
        // 开启右侧插槽
        rightSlot: {
            type: Boolean,
            default: false
        }
    }
})
