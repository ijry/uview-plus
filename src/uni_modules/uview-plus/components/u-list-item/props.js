import { defineMixin } from '../../libs/vue'
import ListItemDefaultProps from './listItem'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps(ListItemDefaultProps)
export const props = defineMixin({
    props: {
        // 用于滚动到指定item
        anchor: {
            type: [String, Number],
            default: () => defProps.listItem.anchor
        }
    }
})
