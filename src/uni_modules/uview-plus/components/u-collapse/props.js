import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 当前展开面板的name，非手风琴模式：[<string | number>]，手风琴模式：string | number
        value: {
            type: [String, Number, Array, null],
            default: () => defProps.collapse.value
        },
        // 是否手风琴模式
        accordion: {
            type: Boolean,
            default: () => defProps.collapse.accordion
        },
        // 是否显示外边框
        border: {
            type: Boolean,
            default: () => defProps.collapse.border
        }
    }
})
