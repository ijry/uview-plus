import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 是否展示组件
        show: {
            type: Boolean,
            default: () => defProps.transition.show
        },
        // 使用的动画模式
        mode: {
            type: String,
            default: () => defProps.transition.mode
        },
        // 动画的执行时间，单位ms
        duration: {
            type: [String, Number],
            default: () => defProps.transition.duration
        },
        // 使用的动画过渡函数
        timingFunction: {
            type: String,
            default: () => defProps.transition.timingFunction
        }
    }
})
