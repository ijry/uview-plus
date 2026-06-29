import { defineMixin } from '../../libs/vue'
import CircleProgressDefaultProps from './circleProgress'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps(CircleProgressDefaultProps)
export const props = defineMixin({
    props: {
        percentage: {
            type: [String, Number],
            default: () => defProps.circleProgress.percentage
        }
    }
})
