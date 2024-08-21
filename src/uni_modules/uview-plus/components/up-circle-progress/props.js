import { defineMixin } from '../../libs/vue.js'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        percentage: {
            type: [String, Number],
            default: () => defProps.circleProgress.percentage
        }
    }
})
