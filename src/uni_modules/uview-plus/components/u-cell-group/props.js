import { defineMixin } from '../../libs/vue'
import CellGroupDefaultProps from './cellGroup'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps(CellGroupDefaultProps)
export const props = defineMixin({
    props: {
        // 分组标题
        title: {
            type: String,
            default: () => defProps.cellGroup.title
        },
        // 是否显示外边框
        border: {
            type: Boolean,
            default: () => defProps.cellGroup.border
        }
    }
})
