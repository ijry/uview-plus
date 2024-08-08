import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'

export const propsBox = defineMixin({
    props: {
        // 背景色
        bgColors: {
            type: [Array],
            default: ['#EEFCFF', '#FCF8FF', '#FDF8F2']
        },
        // 高度
        height: {
            type: [String],
            default: "160px"
        },
        // 圆角
        borderRadius: {
            type: [String],
            default: "6px"
        },
        // 间隔
        gap: {
            type: [String],
            default: "15px"
        },
    }
})
