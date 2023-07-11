import defprops from '../../libs/config/props';
export default {
    props: {
        // 是否展示组件
        show: {
            type: Boolean,
            default: defprops.transition.show
        },
        // 使用的动画模式
        mode: {
            type: String,
            default: defprops.transition.mode
        },
        // 动画的执行时间，单位ms
        duration: {
            type: [String, Number],
            default: defprops.transition.duration
        },
        // 使用的动画过渡函数
        timingFunction: {
            type: String,
            default: defprops.transition.timingFunction
        }
    }
}
