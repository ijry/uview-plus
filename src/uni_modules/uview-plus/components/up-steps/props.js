import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 排列方向
        direction: {
            type: String,
            default: () => defProps.steps.direction
        },
        // 设置第几个步骤
        current: {
            type: [String, Number],
            default: () => defProps.steps.current
        },
        // 激活状态颜色
        activeColor: {
            type: String,
            default: () => defProps.steps.activeColor
        },
        // 未激活状态颜色
        inactiveColor: {
            type: String,
            default: () => defProps.steps.inactiveColor
        },
        // 激活状态的图标
        activeIcon: {
            type: String,
            default: () => defProps.steps.activeIcon
        },
        // 未激活状态图标
        inactiveIcon: {
            type: String,
            default: () => defProps.steps.inactiveIcon
        },
        // 是否显示点类型
        dot: {
            type: Boolean,
            default: () => defProps.steps.dot
        }
    }
})
