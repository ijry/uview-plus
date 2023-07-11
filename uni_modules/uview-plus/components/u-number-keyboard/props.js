import defprops from '../../libs/config/props';
export default {
    props: {
        // 键盘的类型，number-数字键盘，card-身份证键盘
        mode: {
            type: String,
            default: defprops.numberKeyboard.value
        },
        // 是否显示键盘的"."符号
        dotDisabled: {
            type: Boolean,
            default: defprops.numberKeyboard.dotDisabled
        },
        // 是否打乱键盘按键的顺序
        random: {
            type: Boolean,
            default: defprops.numberKeyboard.random
        }
    }
}
