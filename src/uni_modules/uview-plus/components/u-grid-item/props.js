import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 宫格的name
        name: {
            type: [String, Number, null],
            default: () => defProps.gridItem.name
        },
        // 背景颜色
        bgColor: {
            type: String,
            default: () => defProps.gridItem.bgColor
        }
    }
})
