import { defineMixin } from '../../libs/vue'
import defProps from './navbar'
let crtProp = defProps['navbar'] as UTSJSONObject

export const propsNavbar = defineMixin({
	props: {
		// 是否开启顶部安全区适配
		safeAreaInsetTop: {
			type: Boolean,
			default: crtProp['safeAreaInsetTop']
		},
		// 固定在顶部时，是否生成一个等高元素，以防止塌陷
		placeholder: {
			type: Boolean,
			default: crtProp['placeholder']
		},
		// 是否固定在顶部
		fixed: {
			type: Boolean,
			default: crtProp['fixed']
		},
		// 是否显示下边框
		border: {
			type: Boolean,
			default: crtProp['border']
		},
		// 左边的图标
		leftIcon: {
			type: String,
			default: crtProp['leftIcon']
		},
		// 左边的提示文字
		leftText: {
			type: String,
			default: crtProp['leftText']
		},
		// 左右的提示文字
		rightText: {
			type: String,
			default: crtProp['rightText']
		},
		// 右边的图标
		rightIcon: {
			type: String,
			default: crtProp['rightIcon']
		},
		// 标题
		title: {
			type: [String, Number],
			default: crtProp['title']
		},
		// 背景颜色
		bgColor: {
			type: String,
			default: crtProp['bgColor']
		},
		// 标题的宽度
		titleWidth: {
			type: [String, Number],
			default: crtProp['titleWidth']
		},
		// 导航栏高度
		height: {
			type: [String, Number],
			default: crtProp['height']
		},
		// 左侧返回图标的大小
		leftIconSize: {
			type: [String, Number],
			default: crtProp['leftIconSize']
		},
		// 左侧返回图标的颜色
		leftIconColor: {
			type: String,
			default: crtProp['leftIconColor']
		},
		// 点击左侧区域(返回图标)，是否自动返回上一页
		autoBack: {
			type: Boolean,
			default: crtProp['autoBack']
		},
		// 标题的样式，对象或字符串
		titleStyle: {
			type: [Object],
			default: crtProp['titleStyle']
		}
	}
})
