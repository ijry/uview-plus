import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 步进器标识符，在change回调返回
        name: {
            type: [String, Number],
            default: () => defProps.numberBox.name
        },
        // #ifdef VUE2
        // 用于双向绑定的值，初始化时设置设为默认min值(最小值)
        value: {
            type: [String, Number],
            default: () => defProps.numberBox.value
        },
        // #endif
        // #ifdef VUE3
        // 用于双向绑定的值，初始化时设置设为默认min值(最小值)
        modelValue: {
            type: [String, Number],
            default: () => defProps.numberBox.value
        },
        // #endif
        // 最小值
        min: {
            type: [String, Number],
            default: () => defProps.numberBox.min
        },
        // 最大值
        max: {
            type: [String, Number],
            default: () => defProps.numberBox.max
        },
        // 加减的步长，可为小数
        step: {
            type: [String, Number],
            default: () => defProps.numberBox.step
        },
        // 是否只允许输入整数
        integer: {
            type: Boolean,
            default: () => defProps.numberBox.integer
        },
        // 是否禁用，包括输入框，加减按钮
        disabled: {
            type: Boolean,
            default: () => defProps.numberBox.disabled
        },
        // 是否禁用输入框
        disabledInput: {
            type: Boolean,
            default: () => defProps.numberBox.disabledInput
        },
        // 是否开启异步变更，开启后需要手动控制输入值
        asyncChange: {
            type: Boolean,
            default: () => defProps.numberBox.asyncChange
        },
        // 输入框宽度，单位为px
        inputWidth: {
            type: [String, Number],
            default: () => defProps.numberBox.inputWidth
        },
        // 是否显示减少按钮
        showMinus: {
            type: Boolean,
            default: () => defProps.numberBox.showMinus
        },
        // 是否显示增加按钮
        showPlus: {
            type: Boolean,
            default: () => defProps.numberBox.showPlus
        },
        // 显示的小数位数
        decimalLength: {
            type: [String, Number, null],
            default: () => defProps.numberBox.decimalLength
        },
        // 是否开启长按加减手势
        longPress: {
            type: Boolean,
            default: () => defProps.numberBox.longPress
        },
        // 输入框文字和加减按钮图标的颜色
        color: {
            type: String,
            default: () => defProps.numberBox.color
        },
        // 按钮宽度
        buttonWidth: {
            type: [String, Number],
            default: () => defProps.numberBox.buttonWidth
        },
        // 按钮大小，宽高等于此值，单位px，输入框高度和此值保持一致
        buttonSize: {
            type: [String, Number],
            default: () => defProps.numberBox.buttonSize
        },
        // 按钮圆角
        buttonRadius: {
            type: [String],
            default: () => defProps.numberBox.buttonRadius
        },
        // 输入框和按钮的背景颜色
        bgColor: {
            type: String,
            default: () => defProps.numberBox.bgColor
        },
        // 输入框背景颜色
        inputBgColor: {
            type: String,
            default: () => defProps.numberBox.inputBgColor
        },
        // 指定光标于键盘的距离，避免键盘遮挡输入框，单位px
        cursorSpacing: {
            type: [String, Number],
            default: () => defProps.numberBox.cursorSpacing
        },
        // 是否禁用增加按钮
        disablePlus: {
            type: Boolean,
            default: () => defProps.numberBox.disablePlus
        },
        // 是否禁用减少按钮
        disableMinus: {
            type: Boolean,
            default: () => defProps.numberBox.disableMinus
        },
        // 加减按钮图标的样式
        iconStyle: {
            type: [Object, String],
            default: () => defProps.numberBox.iconStyle
        },
        // 迷你模式
        miniMode: {
            type: Boolean,
            default: () => defProps.numberBox.miniMode
        },
    }
})
