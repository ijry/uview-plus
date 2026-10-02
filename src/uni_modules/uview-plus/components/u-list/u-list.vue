<template>
	<!-- #ifdef APP-NVUE -->
	<list
		class="u-list"
		:enableBackToTop="enableBackToTop"
		:loadmoreoffset="lowerThreshold"
		:showScrollbar="showScrollbar"
		:style="[listStyle]"
		:offset-accuracy="Number(offsetAccuracy)"
		@scroll="onScroll"
		@loadmore="scrolltolower"
	>
		<slot />
	</list>
	<!-- #endif -->
	<!-- #ifndef APP-NVUE -->
	<scroll-view
		class="u-list"
		:scroll-into-view="innerScrollIntoView"
		:style="[listStyle]"
		:scroll-y="scrollable"
		:scroll-top="Number(scrollTop)"
		:lower-threshold="Number(lowerThreshold)"
		:upper-threshold="Number(upperThreshold)"
		:show-scrollbar="showScrollbar"
		:enable-back-to-top="enableBackToTop"
		:scroll-with-animation="scrollWithAnimation"
		@scroll="onScroll"
		@scrolltolower="scrolltolower"
		@scrolltoupper="scrolltoupper"
		:refresher-enabled="refresherEnabled"
		:refresher-threshold="refresherThreshold"
		:refresher-default-style="refresherDefaultStyle"
		:refresher-background="refresherBackground"
		:refresher-triggered="refresherTriggered"
		@refresherpulling="refresherpulling"
		@refresherrefresh="refresherrefresh"
		@refresherrestore="refresherrestore"
		@refresherabort="refresherabort"
		:scroll-anchoring="true"
	>
		<view>
			<slot />
		</view>
	</scroll-view>
	<!-- #endif -->
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	import { addUnit, addStyle, deepMerge, sleep, getWindowInfo } from '../../libs/function/index';
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom')
	// #endif
	/**
	 * List 列表
	 * @description 该组件为高性能列表组件
	 * @tutorial https://uview-plus.jiangruyi.com/components/list.html
	 * @property {Boolean}			showScrollbar		控制是否出现滚动条，仅nvue有效 （默认 false ）
	 * @property {String ｜ Number}	lowerThreshold		距底部多少时触发scrolltolower事件 （默认 50 ）
	 * @property {String ｜ Number}	upperThreshold		距顶部多少时触发scrolltoupper事件，非nvue有效 （默认 0 ）
	 * @property {String ｜ Number}	scrollTop			设置竖向滚动条位置（默认 0 ）
	 * @property {String ｜ Number}	offsetAccuracy		控制 onscroll 事件触发的频率，仅nvue有效（默认 10 ）
	 * @property {Boolean}			enableFlex			启用 flexbox 布局。开启后，当前节点声明了display: flex就会成为flex container，并作用于其孩子节点，仅微信小程序有效（默认 false ）
	 * @property {Boolean}			pagingEnabled		是否按分页模式显示List，（默认 false ）
	 * @property {Boolean}			scrollable			是否允许List滚动（默认 true ）
	 * @property {String}			scrollIntoView		滚动到指定位置，值为u-list-item的anchor，或item内某个子元素的id（id不能以数字开头）
	 * @property {Boolean}			scrollWithAnimation	在设置滚动条位置时使用动画过渡 （默认 false ）
	 * @property {Boolean}			enableBackToTop		iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只对微信小程序有效 （默认 false ）
	 * @property {String ｜ Number}	height				列表的高度 （默认 0 ）
	 * @property {String ｜ Number}	width				列表宽度 （默认 0 ）
	 * @property {String ｜ Number}	preLoadScreen		列表前后预渲染的屏数，1代表一个屏幕的高度，1.5代表1个半屏幕高度  （默认 1 ）
	 * @property {Object}			customStyle			定义需要用到的外部样式
	 *
	 * @example <u-list @scrolltolower="scrolltolower"></u-list>
	 */
	export default {
		name: 'u-list',
		mixins: [mpMixin, mixin, props],
		watch: {
			scrollIntoView(n) {
				this.scrollIntoViewById(n)
			}
		},
		data() {
			return {
				// 记录内部滚动的距离
				innerScrollTop: 0,
				// 非nvue下真正传给scroll-view的scroll-into-view值
				innerScrollIntoView: '',
				// vue下，scroll-view在上拉加载时的偏移值
				offset: 0,
				sys: getWindowInfo()
			}
		},
		computed: {
			listStyle() {
				const style = {};
				if (this.width != 0) style.width = addUnit(this.width)
				if (this.height != 0) style.height = addUnit(this.height)
				// 如果没有定义列表高度，则默认使用屏幕高度
				if (!style.height) style.height = addUnit(this.sys.windowHeight, 'px')
				return deepMerge(style, addStyle(this.customStyle))
			}
		},
		provide() {
			return {
				uList: this
			}
		},
		created() {
			this.children = []
			this.anchors = []
			// 最后一次请求滚动的目标，非响应式，仅用于丢弃过期的重试
			this.scrollIntoViewTarget = ''
		},
		mounted() {
			// 初始就设置了scroll-into-view时，子组件已挂载完成，此时才能匹配到anchor
			if (this.scrollIntoView) {
				this.scrollIntoViewById(this.scrollIntoView)
			}
		},
		emits: ["scroll", "scrolltolower", "scroll-to-lower", "scrolltoupper", "scroll-to-upper",
			"refresherpulling", "refresherrefresh", "refresherrestore", "refresherabort"],
		methods: {
			updateOffsetFromChild(top) {
				this.offset = top
			},
			onScroll(e) {
				let scrollTop = 0
				// #ifdef APP-NVUE
				scrollTop = e.contentOffset.y
				// #endif
				// #ifndef APP-NVUE
				scrollTop = e.detail.scrollTop
				// #endif
				this.innerScrollTop = scrollTop
				this.$emit('scroll', scrollTop)
			},
			// 根据id找到设置了对应anchor的u-list-item，anchor与u-list-item-${anchor}两种写法都支持
			getAnchorChild(id) {
				const anchorId = String(id)
				return this.children.find(child => {
					const anchor = String(child.anchor)
					return anchor !== '' && (anchor === anchorId || `u-list-item-${anchor}` === anchorId)
				})
			},
			scrollIntoViewById(id, retry = true) {
				// 记录最后一次请求，避免过期的重试覆盖掉新值
				this.scrollIntoViewTarget = id
				// #ifndef APP-NVUE
				if (!id) {
					this.innerScrollIntoView = ''
					return
				}
				// #endif
				// 根据id参数，找到所有u-list-item中匹配的节点
				const child = this.getAnchorChild(id)
				// 数据和scroll-into-view同时赋值时item尚未挂载，等下一帧再匹配一次
				if (!child && retry) {
					this.$nextTick(() => {
						if (this.scrollIntoViewTarget === id) this.scrollIntoViewById(id, false)
					})
					return
				}
				// #ifndef APP-NVUE
				// 命中anchor时滚动到该item，否则依然当作使用者自己在item内设置的子元素id
				this.innerScrollIntoView = child ? `u-list-item-${child.anchor}` : id
				// #endif
				// #ifdef APP-NVUE
				// nvue下scroll-view不可用，通过dom模块滚动到对应的位置
				const ref = child && child.$refs[`u-list-item-${child.anchor}`]
				if (!ref) return
				dom.scrollToElement(ref, {
					// 是否需要滚动动画
					animated: this.scrollWithAnimation
				})
				// #endif
			},
			// 滚动到底部触发事件
			scrolltolower(e) {
				sleep(30).then(() => {
					this.$emit('scrolltolower')
					// 支付宝小程序奇怪无法触发scrolltolowerhttps://github.com/ijry/uview-plus/issues/422
					this.$emit('scroll-to-lower')
				})
			},
			// #ifndef APP-NVUE
			// 滚动到底部时触发，非nvue有效
			scrolltoupper(e) {
				sleep(30).then(() => {
					this.$emit('scrolltoupper')
					this.$emit('scroll-to-upper')
					// 这一句很重要，能绝对保证在性功能障碍的webview，滚动条到顶时，取消偏移值，让页面置顶
					this.offset = 0
				})
			},
			refresherpulling(e) {
				this.$emit('refresherpulling', e)
			},
			refresherrefresh(e) {
				this.$emit('refresherrefresh', e)
			},
			refresherrestore(e) {
				this.$emit('refresherrestore', e)
			},
			refresherabort(e) {
				this.$emit('refresherabort', e)
			}
			// #endif
		},
	}
</script>

<style lang="scss" scoped>

	.u-list {
		@include flex(column);

	}
</style>
