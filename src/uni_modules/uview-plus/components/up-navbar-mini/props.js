import { defineMixin } from '../../libs/vue'

export const props = defineMixin({
	props: {
		// 是否开启顶部安全区适配
		safeAreaInsetTop: {
			type: Boolean,
			default: () => true
		},
		// 是否固定在顶部
		fixed: {
			type: Boolean,
			default: () => true
		},
		// 左边的图标
		leftIcon: {
			type: String,
			default: 'arrow-leftward'
		},
		// 背景颜色
		bgColor: {
			type: String,
			default: () => 'rgba(0,0,0,.15)'
		},
		// 导航栏高度
		height: {
			type: [String, Number],
			default: () => '32px'
		},
		// 图标的大小
		iconSize: {
			type: [String, Number],
			default: '20px'
		},
		// 图标的颜色
		iconColor: {
			type: String,
			default: '#fff'
		},
		// 点击左侧区域(返回图标)，是否自动返回上一页
		autoBack: {
			type: Boolean,
			default: () => true
		},
		// 首页路径
		homeUrl: {
			type: [String],
			default: ''
		}
	}
})
