import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
		// 键盘弹起时，是否自动上推页面
		adjustPosition: {
			type: Boolean,
            default: () => defProps.codeInput.adjustPosition
		},
        // 最大输入长度
        maxlength: {
            type: [String, Number],
            default: () => defProps.codeInput.maxlength
        },
        // 是否用圆点填充
        dot: {
            type: Boolean,
            default: () => defProps.codeInput.dot
        },
        // 显示模式，box-盒子模式，line-底部横线模式
        mode: {
            type: String,
            default: () => defProps.codeInput.mode
        },
        // 是否细边框
        hairline: {
            type: Boolean,
            default: () => defProps.codeInput.hairline
        },
        // 字符间的距离
        space: {
            type: [String, Number],
            default: () => defProps.codeInput.space
        },
		// #ifdef VUE3
		// 预置值
		modelValue: {
			type: [String, Number],
			default: () => defProps.codeInput.value
		},
		// #endif
		// #ifdef VUE2
		// 预置值
		value: {
			type: [String, Number],
			default: () => defProps.codeInput.value
		},
		// #endif
        // 是否自动获取焦点
        focus: {
            type: Boolean,
            default: () => defProps.codeInput.focus
        },
        // 字体是否加粗
        bold: {
            type: Boolean,
            default: () => defProps.codeInput.bold
        },
        // 字体颜色
        color: {
            type: String,
            default: () => defProps.codeInput.color
        },
        // 字体大小
        fontSize: {
            type: [String, Number],
            default: () => defProps.codeInput.fontSize
        },
        // 输入框的大小，宽等于高
        size: {
            type: [String, Number],
            default: () => defProps.codeInput.size
        },
        // 是否隐藏原生键盘，如果想用自定义键盘的话，需设置此参数为true
        disabledKeyboard: {
            type: Boolean,
            default: () => defProps.codeInput.disabledKeyboard
        },
        // 边框和线条颜色
        borderColor: {
            type: String,
            default: () => defProps.codeInput.borderColor
        },
		// 是否禁止输入"."符号
		disabledDot: {
			type: Boolean,
			default: () => defProps.codeInput.disabledDot
		}
    }
})
