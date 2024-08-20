import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 键盘的类型，number-数字键盘，card-身份证键盘
        mode: {
            type: String,
            default: () => defProps.numberKeyboard.value
        },
        // 是否显示键盘的"."符号
        dotDisabled: {
            type: Boolean,
            default: () => defProps.numberKeyboard.dotDisabled
        },
        // 是否打乱键盘按键的顺序
        random: {
            type: Boolean,
            default: () => defProps.numberKeyboard.random
        }
    }
})
