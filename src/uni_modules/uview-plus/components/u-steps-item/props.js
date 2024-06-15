import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 标题
        title: {
            type: [String, Number],
            default: () => defProps.stepsItem.title
        },
        // 描述文本
        desc: {
            type: [String, Number],
            default: () => defProps.stepsItem.desc
        },
        // 图标大小
        iconSize: {
            type: [String, Number],
            default: () => defProps.stepsItem.iconSize
        },
        // 当前步骤是否处于失败状态
        error: {
            type: Boolean,
            default: () => defProps.stepsItem.error
        }
    }
})
