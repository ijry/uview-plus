<template>
	<view class="u-navbar" :class="[customClass]">
		<!-- ios 模式：in-flow 层，恒定渲染，随页面原生滚动被带走 -->
		<view
			v-if="isIosMode"
			class="u-navbar__flow"
		>
			<view :style="{ height: navbarFlowSpacerHeight }"></view>
			<view
				v-if="title"
				class="u-navbar__large-title"
				:style="{ height: addUnit(largeTitleHeight) }"
			>
				<text
					class="u-line-1 u-navbar__large-title__text"
					:style="[{ color: navbarTitleColor }, addStyle(titleStyle)]"
				>{{ title }}</text>
			</view>
		</view>
		<!-- default 模式：原有占位块，行为保持不变 -->
		<view
			class="u-navbar__placeholder"
			v-if="!isIosMode && fixed && placeholder"
			:style="{
				height: addUnit(getPx(height) + getWindowInfo().statusBarHeight,'px'),
			}"
		></view>
		<view
			class="u-navbar__inner"
			:class="[(isIosMode || fixed) && 'u-navbar--fixed']"
			:style="[navbarInnerStyle]"
		>
			<view
				v-if="isIosMode"
				class="u-navbar__glass"
				:style="{
					opacity: navbarGlassOpacity,
					background: navbarGlassBgColor,
				}"
			></view>
			<u-status-bar v-if="safeAreaInsetTop"></u-status-bar>
			<view
				class="u-navbar__content"
				:class="[border && !isIosMode && 'u-border-bottom']"
				:style="{
					height: addUnit(height),
					backgroundColor: 'transparent',
				}"
			>
				<view
					class="u-navbar__content__left"
					hover-class="u-navbar__content__left--hover"
					hover-start-time="150"
					@tap="leftClick"
				>
					<slot name="left">
						<up-icon
							v-if="leftIcon"
							:name="leftIcon"
							:size="leftIconSize"
							:color="navbarLeftIconColor"
						></up-icon>
						<text
							v-if="leftText"
							:style="{
								color: navbarLeftIconColor
							}"
							class="u-navbar__content__left__text"
						>{{ leftText }}</text>
					</slot>
				</view>
				<view
					class="u-navbar__content__center"
					:style="[navbarCenterStyle]"
				>
					<slot name="center">
						<text
							class="u-line-1 u-navbar__content__title"
							:style="[{
								width: addUnit(titleWidth),
								color: navbarTitleColor,
							}, addStyle(titleStyle)]"
						>{{ title }}</text>
					</slot>
				</view>
				<view
					class="u-navbar__content__right"
					v-if="$slots.right || rightIcon || rightText"
					@tap="rightClick"
				>
					<slot name="right">
						<up-icon
							v-if="rightIcon"
							:name="rightIcon"
							size="20"
							:color="navbarRightColor"
						></up-icon>
						<text
							v-if="rightText"
							class="u-navbar__content__right__text"
							:style="{ color: navbarRightColor }"
						>{{ rightText }}</text>
					</slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	import config  from '../../libs/config/config';
	import { addUnit, addStyle, getPx, getWindowInfo } from '../../libs/function/index';

	// iOS 大标题行高。它同时是 navbarProgress 的分母，
	// 因此改动此值会同步改变压缩过程的滚动区间。
	const LARGE_TITLE_HEIGHT = 52
	// 居中标题上浮的起始偏移，与淡入同步归零
	const CENTER_TITLE_RISE = 12
	/**
	 * Navbar 自定义导航栏
	 * @description 此组件一般用于在特殊情况下，需要自定义导航栏的时候用到，一般建议使用uni-app带的导航栏。
	 * @tutorial https://uview-plus.jiangruyi.com/components/navbar.html
	 * @property {Boolean}			safeAreaInsetTop	是否开启顶部安全区适配  （默认 true ）
	 * @property {Boolean}			placeholder			固定在顶部时，是否生成一个等高元素，以防止塌陷 （默认 false ）
	 * @property {Boolean}			fixed				导航栏是否固定在顶部 （默认 false ）
	 * @property {Boolean}			border				导航栏底部是否显示下边框 （默认 false ）
	 * @property {String}			leftIcon			左边返回图标的名称，只能为uview-pls自带的图标 （默认 'arrow-left' ）
	 * @property {String}			leftText			左边的提示文字
	 * @property {String}			rightText			右边的提示文字
	 * @property {String}			rightIcon			右边返回图标的名称，只能为uview-plus自带的图标
	 * @property {String}			title				导航栏标题，如设置为空字符，将会隐藏标题占位区域
	 * @property {String}			titleColor			文字颜色 （默认 '' ）
	 * @property {String}			bgColor				导航栏背景设置，支持颜色、渐变或背景图 （默认 '#ffffff' ）
	 * @property {String}			statusBarBgColor	状态栏背景颜色，保留兼容；导航栏内部统一使用 bgColor 作为整体背景
	 * @property {String | Number}	titleWidth			导航栏标题的最大宽度，内容超出会以省略号隐藏 （默认 '400rpx' ）
	 * @property {String | Number}	height				导航栏高度(不包括状态栏高度在内，内部自动加上)（默认 '44px' ）
	 * @property {String | Number}	leftIconSize		左侧返回图标的大小（默认 20px ）
	 * @property {String | Number}	leftIconColor		左侧返回图标的颜色（默认 #303133 ）
	 * @property {Boolean}	        autoBack			点击左侧区域(返回图标)，是否自动返回上一页（默认 false ）
	 * @property {Object | String}	titleStyle			标题的样式，对象或字符串
	 * @property {String}			mode				导航栏模式，default-常规，ios-大标题磨砂模式（默认 'default' ）
	 * @property {String | Number}	scrollTop			页面滚动距离，仅 ios 模式使用，由页面 onPageScroll 传入（默认 0 ）
	 * @event {Function} leftClick		点击左侧区域
	 * @event {Function} rightClick		点击右侧区域
	 * @example <u-navbar title="剑未配妥，出门已是江湖" left-text="返回" right-text="帮助" @click-left="onClickBack" @click-right="onClickRight"></u-navbar>
	 */
	export default {
		name: 'u-navbar',
		mixins: [mpMixin, mixin, props],
		data() {
			return {
			}
		},
		computed: {
			isIosMode() {
				// nvue 缺少 filter 管线、页面非原生滚动容器、onPageScroll 不可靠，
				// 三条约束任意一条都足以让 ios 模式失效，整体降级为 default。
				// 注意 APP-NVUE 在 app-harmony 上为 false，harmony 走 ArkWeb 应获得完整 ios 模式。
				// #ifdef APP-NVUE
				return false
				// #endif
				// #ifndef APP-NVUE
				return this.mode === 'ios'
				// #endif
			},
			// 有效大标题行高：title 为空时不渲染大标题行，行高塌陷为 0
			largeTitleHeight() {
				return this.title ? LARGE_TITLE_HEIGHT : 0
			},
			// in-flow 层顶部让位块高度，为固定层腾出空间
			navbarFlowSpacerHeight() {
				const statusBarHeight = this.safeAreaInsetTop ? getWindowInfo().statusBarHeight : 0
				return addUnit(getPx(this.height) + statusBarHeight, 'px')
			},
			// 压缩进度。分母取有效大标题行高，progress=1 即大标题恰好完全没入导航栏
			navbarProgress() {
				if (!this.isIosMode) return 1
				const height = this.largeTitleHeight
				if (height <= 0) return 1
				const offset = getPx(this.scrollTop) || 0
				return Math.min(Math.max(offset / height, 0), 1)
			},
			// 磨砂在前半段走完，为居中标题的出现铺好不透明底
			navbarGlassOpacity() {
				if (!this.isIosMode) return 0
				return Math.min(Math.max(this.navbarProgress / 0.5, 0), 1)
			},
			// 居中标题在后段才启动，此时玻璃已满不透明，不会与大标题互相透出
			navbarCenterOpacity() {
				if (!this.isIosMode) return 1
				return Math.min(Math.max((this.navbarProgress - 0.75) / 0.25, 0), 1)
			},
			// 居中标题由下往上浮现：与淡入同一段行程，位移随之归零
			navbarCenterStyle() {
				if (!this.isIosMode) return {}
				const opacity = this.navbarCenterOpacity
				return {
					opacity,
					transform: `translateY(${(1 - opacity) * CENTER_TITLE_RISE}px)`
				}
			},
			navbarGlassBgColor() {
				// 0.82 是可读性下限的承重值：backdrop-filter 不生效时，
				// 仅靠这个不透明度也必须保证文字不与下方内容读串。
				return this.bgColor
					|| this.upThemeVar('--up-navbar-glass-bg-color',
						this.upThemeIsDark ? 'rgba(28, 28, 30, 0.82)' : 'rgba(255, 255, 255, 0.82)')
			},
			navbarBgColor() {
				if (this.bgColor) return this.bgColor
				return this.upThemeVar('--up-navbar-bg-color', this.upThemeIsDark ? '#1c1c1e' : '#ffffff')
			},
			navbarTitleColor() {
				if (this.titleColor) return this.titleColor
				return this.upThemeVar('--up-main-color', this.$u.color.mainColor)
			},
			navbarLeftIconColor() {
				if (this.leftIconColor) return this.leftIconColor
				return this.upThemeVar('--up-main-color', this.$u.color.mainColor)
			},
			navbarRightColor() {
				return this.upThemeVar('--up-main-color', this.$u.color.mainColor)
			},
			navbarInnerStyle() {
				const style = {}
				style.background = this.navbarBgColor
				// ios 模式下固定层必须透明，否则 backdrop-filter 采样到自身底色，模糊不出内容。
				// 背景由独立的 __glass 层承担，随滚动淡入。
				if (this.isIosMode) {
					style.background = 'transparent'
				}
				return style
			}
		},
		emits: ["leftClick", "rightClick"],
		methods: {
			addStyle,
			addUnit,
			getWindowInfo,
			getPx,
			// 点击左侧区域
			leftClick() {
				// 如果配置了autoBack，自动返回上一页
				this.$emit('leftClick')
				if (config.interceptor.navbarLeftClick != null) {
					config.interceptor.navbarLeftClick.call(this, this)
				} else {
					if(this.autoBack) {
						uni.navigateBack()
					}
				}
			},
			// 点击右侧区域
			rightClick() {
				this.$emit('rightClick')
			},
		}
	}
</script>

<style lang="scss">
	@import "./theme-vars.scss";
</style>

<style lang="scss" scoped>

	.u-navbar {

		&--fixed {
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			z-index: 11;
		}

		&__flow {
			/* #ifndef APP-NVUE */
			width: 100%;
			/* #endif */
		}

		&__large-title {
			@include flex(row);
			align-items: center;
			padding: 0 13px;

			&__text {
				font-size: 34px;
				font-weight: 700;
				line-height: 1.2;
			}
		}

		&__glass {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			// 模糊半径写在静态 class 内而非 :style 绑定，使 -webkit- 前缀在编译期确定。
			// iOS 16 之前的 WKWebView 只认前缀版本，两条都必须保留。
			// CSS 变量不被支持时回落到字面量 20px。
			-webkit-backdrop-filter: saturate(180%) blur(var(--up-navbar-glass-blur, 20px));
			        backdrop-filter: saturate(180%) blur(var(--up-navbar-glass-blur, 20px));
		}

		&__content {
			@include flex(row);
			align-items: center;
			height: 44px;
			background-color: $u-bg-color;
			// 玻璃层是绝对定位的，会盖住同级的非定位元素。
			// 缺少这两行的表现是整个导航栏内容不可见。
			position: relative;
			z-index: 1;
			justify-content: center;

			&__left,
			&__right {
				padding: 0 13px;
				position: absolute;
				top: 0;
				bottom: 0;
				@include flex(row);
				align-items: center;
			}

			&__left {
				left: 0;

				&--hover {
					opacity: 0.7;
				}

				&__text {
					font-size: 15px;
					margin-left: 3px;
					color: $u-main-color;
				}
			}

			&__center {
				@include flex(row);
				align-items: center;
				justify-content: center;
				// 滚动事件是离散到达的，补一段短过渡让上浮与淡入连续。
				// 时长刻意短于一次滚动事件的间隔，避免落后于手指。
				/* #ifndef APP-NVUE */
				transition: opacity 0.15s linear, transform 0.15s ease-out;
				/* #endif */
			}

			&__title {
				text-align: center;
				font-size: 16px;
				color: $u-main-color;
			}

			&__right {
				right: 0;

				&__text {
					font-size: 15px;
					margin-left: 3px;
				}
			}
		}
	}
</style>
