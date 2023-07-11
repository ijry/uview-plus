import defprops from '../../libs/config/props';
export default {
    props: {
        // 当前展开面板的name，非手风琴模式：[<string | number>]，手风琴模式：string | number
        value: {
            type: [String, Number, Array, null],
            default: defprops.collapse.value
        },
        // 是否手风琴模式
        accordion: {
            type: Boolean,
            default: defprops.collapse.accordion
        },
        // 是否显示外边框
        border: {
            type: Boolean,
            default: defprops.collapse.border
        }
    }
}
