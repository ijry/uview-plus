import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 是否虚线
        dashed: {
            type: Boolean,
            default: () => defProps.divider.dashed
        },
        // 是否细线
        hairline: {
            type: Boolean,
            default: () => defProps.divider.hairline
        },
        // 是否以点替代文字，优先于text字段起作用
        dot: {
            type: Boolean,
            default: () => defProps.divider.dot
        },
        // 内容文本的位置，left-左边，center-中间，right-右边
        textPosition: {
            type: String,
            default: () => defProps.divider.textPosition
        },
        // 文本内容
        text: {
            type: [String, Number],
            default: () => defProps.divider.text
        },
        // 文本大小
        textSize: {
            type: [String, Number],
            default: () => defProps.divider.textSize
        },
        // 文本颜色
        textColor: {
            type: String,
            default: () => defProps.divider.textColor
        },
        // 线条颜色
        lineColor: {
            type: String,
            default: () => defProps.divider.lineColor
        }
    }
})
