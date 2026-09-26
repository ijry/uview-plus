import { defineMixin } from '../../libs/vue'
import FlexDefaultProps from './flex'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps(FlexDefaultProps)
export const props = defineMixin({
    props: {
        // 主轴方向 row/column/row-reverse/column-reverse
        direction: {
            type: String,
            default: () => defProps.flex.direction
        },
        // 主轴对齐 flex-start/flex-end/center/space-between/space-around/space-evenly（兼容 start/end）
        justify: {
            type: String,
            default: () => defProps.flex.justify
        },
        // 交叉轴对齐 flex-start/flex-end/center/stretch/baseline
        align: {
            type: String,
            default: () => defProps.flex.align
        },
        // 是否换行
        wrap: {
            type: Boolean,
            default: () => defProps.flex.wrap
        },
        // 子元素间距，单位任意
        gap: {
            type: [String, Number],
            default: () => defProps.flex.gap
        }
    }
})
