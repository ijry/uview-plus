import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'

export const props = defineMixin({
	props: {
		// 是否开启顶部安全区适配
		safeAreaInsetTop: {
			type: Boolean,
			default: () => defProps.navbar.safeAreaInsetTop
		},
		// 固定在顶部时，是否生成一个等高元素，以防止塌陷
		placeholder: {
			type: Boolean,
			default: () => defProps.navbar.placeholder
		},
		// 是否固定在顶部
		fixed: {
			type: Boolean,
			default: () => defProps.navbar.fixed
		},
		// 是否显示下边框
		border: {
			type: Boolean,
			default: () => defProps.navbar.border
		},
		// 左边的图标
		leftIcon: {
			type: String,
			default: () => defProps.navbar.leftIcon
		},
		// 左边的提示文字
		leftText: {
			type: String,
			default: () => defProps.navbar.leftText
		},
		// 左右的提示文字
		rightText: {
			type: String,
			default: () => defProps.navbar.rightText
		},
		// 右边的图标
		rightIcon: {
			type: String,
			default: () => defProps.navbar.rightIcon
		},
		// 标题
		title: {
			type: [String, Number],
			default: () => defProps.navbar.title
		},
		// 标题颜色
		titleColor: {
			type: String,
			default: () => defProps.navbar.titleColor
		},
		// 背景颜色
		bgColor: {
			type: String,
			default: () => defProps.navbar.bgColor
		},
        // 状态栏背景颜色 不写会使用背景颜色bgColor
        statusBarBgColor: {
            type: String,
            default: () => ''
        },
		// 标题的宽度
		titleWidth: {
			type: [String, Number],
			default: () => defProps.navbar.titleWidth
		},
		// 导航栏高度
		height: {
			type: [String, Number],
			default: () => defProps.navbar.height
		},
		// 左侧返回图标的大小
		leftIconSize: {
			type: [String, Number],
			default: () => defProps.navbar.leftIconSize
		},
		// 左侧返回图标的颜色
		leftIconColor: {
			type: String,
			default: () => defProps.navbar.leftIconColor
		},
		// 点击左侧区域(返回图标)，是否自动返回上一页
		autoBack: {
			type: Boolean,
			default: () => defProps.navbar.autoBack
		},
		// 标题的样式，对象或字符串
		titleStyle: {
			type: [String, Object],
			default: () => defProps.navbar.titleStyle
		}
	}
})
