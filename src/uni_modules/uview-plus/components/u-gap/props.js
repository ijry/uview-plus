import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 背景颜色（默认transparent）
        bgColor: {
            type: String,
            default: () => defProps.gap.bgColor
        },
        // 分割槽高度，单位px（默认30）
        height: {
            type: [String, Number],
            default: () => defProps.gap.height
        },
        // 与上一个组件的距离
        marginTop: {
            type: [String, Number],
            default: () => defProps.gap.marginTop
        },
        // 与下一个组件的距离
        marginBottom: {
            type: [String, Number],
            default: () => defProps.gap.marginBottom
        }
    }
})
