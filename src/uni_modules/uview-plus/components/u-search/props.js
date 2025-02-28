import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 搜索框形状，round-圆形，square-方形
        shape: {
            type: String,
            default: () => defProps.search.shape
        },
        // 搜索框背景色，默认值#f2f2f2
        bgColor: {
            type: String,
            default: () => defProps.search.bgColor
        },
        // 占位提示文字
        placeholder: {
            type: String,
            default: () => defProps.search.placeholder
        },
        // 是否启用清除控件
        clearabled: {
            type: Boolean,
            default: () => defProps.search.clearabled
        },
        // 是否自动聚焦
        focus: {
            type: Boolean,
            default: () => defProps.search.focus
        },
        // 是否在搜索框右侧显示取消按钮
        showAction: {
            type: Boolean,
            default: () => defProps.search.showAction
        },
        // 右边控件的样式
        actionStyle: {
            type: Object,
            default: () => defProps.search.actionStyle
        },
        // 取消按钮文字
        actionText: {
            type: String,
            default: () => defProps.search.actionText
        },
        // 输入框内容对齐方式，可选值为 left|center|right
        inputAlign: {
            type: String,
            default: () => defProps.search.inputAlign
        },
        // input输入框的样式，可以定义文字颜色，大小等，对象形式
        inputStyle: {
            type: Object,
            default: () => defProps.search.inputStyle
        },
        // 是否启用输入框
        disabled: {
            type: Boolean,
            default: () => defProps.search.disabled
        },
        // 边框颜色
        borderColor: {
            type: String,
            default: () => defProps.search.borderColor
        },
        // 搜索图标的颜色，默认同输入框字体颜色
        searchIconColor: {
            type: String,
            default: () => defProps.search.searchIconColor
        },
        // 输入框字体颜色
        color: {
            type: String,
            default: () => defProps.search.color
        },
        // placeholder的颜色
        placeholderColor: {
            type: String,
            default: () => defProps.search.placeholderColor
        },
           // placeholderClass的颜色
        placeholderClass: {
            type: String,
            default: () => defProps.search.placeholderClass
        },
        // 左边输入框的图标，可以为uView图标名称或图片路径
        searchIcon: {
            type: String,
            default: () => defProps.search.searchIcon
        },
        searchIconSize: {
            type: [Number, String],
            default: () => defProps.search.searchIconSize
        },
        // 组件与其他上下左右元素之间的距离，带单位的字符串形式，如"30px"、"30px 20px"等写法
        margin: {
            type: String,
            default: () => defProps.search.margin
        },
        // 开启showAction时，是否在input获取焦点时才显示
        animation: {
            type: Boolean,
            default: () => defProps.search.animation
        },
        // 输入框的初始化内容
        modelValue: {
            type: String,
            default: () => defProps.search.value
        },
		value: {
		    type: String,
		    default: () => defProps.search.value
		},
        // 输入框最大能输入的长度，-1为不限制长度(来自uniapp文档)
        maxlength: {
            type: [String, Number],
            default: () => defProps.search.maxlength
        },
        // 搜索框高度，单位px
        height: {
            type: [String, Number],
            default: () => defProps.search.height
        },
        // 搜索框左侧文本
        label: {
            type: [String, Number, null],
            default: () => defProps.search.label
        },
        // 键盘弹起时，是否自动上推页面	
        adjustPosition: {
            type: Boolean,
            default: () => true
        },
        // 键盘收起时，是否自动失去焦点	
        autoBlur: {
            type: Boolean,
            default: () => false
        }
    }
})
