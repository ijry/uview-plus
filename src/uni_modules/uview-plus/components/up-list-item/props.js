import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 用于滚动到指定item
        anchor: {
            type: [String, Number],
            default: () => defProps.listItem.anchor
        }
    }
})
