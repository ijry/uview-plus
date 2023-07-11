import defprops from '../../libs/config/props';
export default {
    props: {
        // 是否虚线
        dashed: {
            type: Boolean,
            default: defprops.divider.dashed
        },
        // 是否细线
        hairline: {
            type: Boolean,
            default: defprops.divider.hairline
        },
        // 是否以点替代文字，优先于text字段起作用
        dot: {
            type: Boolean,
            default: defprops.divider.dot
        },
        // 内容文本的位置，left-左边，center-中间，right-右边
        textPosition: {
            type: String,
            default: defprops.divider.textPosition
        },
        // 文本内容
        text: {
            type: [String, Number],
            default: defprops.divider.text
        },
        // 文本大小
        textSize: {
            type: [String, Number],
            default: defprops.divider.textSize
        },
        // 文本颜色
        textColor: {
            type: String,
            default: defprops.divider.textColor
        },
        // 线条颜色
        lineColor: {
            type: String,
            default: defprops.divider.lineColor
        }
    }
}
