<template>
	<view
	    class="u-tabbar-item"
	    :style="[itemInlineStyle, addStyle(customStyle)]"
	    :class="itemClassNames"
	    @tap="clickHandler"
	>
		<view class="u-tabbar-item__content" :class="contentClassNames">
			<view class="u-tabbar-item__bubble" :class="bubbleClassNames">
				<view
					class="u-tabbar-item__icon"
					:class="iconClassNames"
				>
					<view v-if="isMidButton" class="u-tabbar-item__mid-button-arc">
						<svg viewBox="0 0 72 72" preserveAspectRatio="none">
							<path d="M 4 36 A 32 32 0 0 1 68 36"></path>
						</svg>
					</view>
					<view v-if="isMidButton" class="u-tabbar-item__mid-button-inner"></view>
					<up-icon
						v-if="resolvedIconName"
						:name="resolvedIconName"
						:color="isMidButton ? resolvedMidButtonIconColor : (isActive ? resolvedActiveColor : resolvedInactiveColor)"
						:size="isMidButton ? midButtonIconSize : 24"
					></up-icon>
					<template v-else>
						<slot
							v-if="isActive"
							name="active-icon"
						/>
						<slot
							v-else
							name="inactive-icon"
						/>
					</template>
					<u-badge
						absolute
						:offset="[0, dot ? '34rpx' : badge > 9 ? '14rpx' : '20rpx']"
						:customStyle="badgeStyle"
						:isDot="dot"
						:value="badge || (dot ? 1 : null)"
						:show="dot || badge > 0"
					></u-badge>
				</view>

				<slot name="text">
					<text
						class="u-tabbar-item__text"
						:class="textClassNames"
						:style="{
							color: isActive ? resolvedActiveColor : resolvedInactiveColor
						}"
					>{{ text }}</text>
				</slot>
			</view>
		</view>
		<view v-if="resolvedStyleType === 'underline'" class="u-tabbar-item__underline"></view>
		<view v-if="resolvedStyleType === 'dot'" class="u-tabbar-item__active-dot"></view>
	</view>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	import { addStyle, error } from '../../libs/function/index';
	/**
	 * TabbarItem 底部导航栏子组件
	 * @description 此组件提供了自定义tabbar的能力。
	 * @tutorial https://uview-plus.jiangruyi.com/components/tabbar.html
	 * @property {String | Number}	name		item标签的名称，作为与u-tabbar的value参数匹配的标识符
	 * @property {String}			icon		uView内置图标或者绝对路径的图片
	 * @property {String | Number}	badge		右上角的角标提示信息
	 * @property {Boolean}			dot			是否显示圆点，将会覆盖badge参数（默认 false ）
	 * @property {String}			text		描述文本
	 * @property {Object | String}	badgeStyle	控制徽标的位置，对象或者字符串形式，可以设置top和right属性（默认 'top: 6px;right:2px;' ）
	 * @property {Object}			customStyle	定义需要用到的外部样式
	 * 
	 * @example <u-tabbar :value="value2" :placeholder="false" @change="name => value2 = name" :fixed="false" :safeAreaInsetBottom="false"><u-tabbar-item text="首页" icon="home" dot ></u-tabbar-item></u-tabbar>
	 */
	export default {
		name: 'u-tabbar-item',
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				isActive: false, // 是否处于激活状态
				parentData: {
					value: null,
					activeColor: '',
					inactiveColor: '',
					styleType: 'default',
					animationType: 'none',
					activeBackgroundColor: '',
					inactiveBackgroundColor: '',
					itemShape: 'default',
					iconScale: 1.1,
					textMode: 'always'
				}
			}
		},
		//  微信小程序中 options 选项
		options: {
		    virtualHost: true //将自定义节点设置成虚拟的，更加接近Vue组件的表现。我们不希望自定义组件的这个节点本身可以设置样式、响应 flex 布局等
		},
		computed: {
			// 计算是否为中间按钮
			isMidButton() {
				return this.mode === 'midButton';
			},
			resolvedActiveColor() {
				return !this.parentData.activeColor || this.parentData.activeColor === '#1989fa'
					? this.upThemeVar('--up-primary', '#1989fa')
					: this.parentData.activeColor
			},
			resolvedInactiveColor() {
				return !this.parentData.inactiveColor || this.parentData.inactiveColor === '#7d7e80'
					? this.upThemeVar('--up-content-color', '#7d7e80')
					: this.parentData.inactiveColor
			},
			resolvedStyleType() {
				return this.parentData.styleType || 'default'
			},
			resolvedAnimationType() {
				return this.parentData.animationType || 'none'
			},
			resolvedItemShape() {
				return this.parentData.itemShape || 'default'
			},
			resolvedIconName() {
				if (this.$slots['active-icon'] || this.$slots['inactive-icon']) return ''
				if (this.isActive) return this.activeIcon || this.icon
				return this.inactiveIcon || this.icon
			},
			resolvedMidButtonIconColor() {
				if (this.midButtonIconColor) return this.midButtonIconColor
				return this.isMidButton ? '#3c9cff' : this.resolvedActiveColor
			},
			itemClassNames() {
				return [
					this.isActive ? 'u-tabbar-item--active' : 'u-tabbar-item--inactive',
					this.isMidButton ? 'u-tabbar-item--mid-button' : '',
					`u-tabbar-item--${this.resolvedStyleType}`,
					this.resolvedAnimationType !== 'none' && this.isActive ? `u-tabbar-item--anim-${this.resolvedAnimationType}` : '',
					this.resolvedItemShape !== 'default' ? `u-tabbar-item--shape-${this.resolvedItemShape}` : '',
					this.isActive ? this.activeClass : this.inactiveClass
				]
			},
			iconClassNames() {
				return [
					this.isMidButton ? 'u-tabbar-item__icon--mid-button' : '',
					`u-tabbar-item__icon--${this.resolvedStyleType}`,
					this.isActive && this.resolvedAnimationType !== 'none' ? `u-tabbar-item__icon--anim-${this.resolvedAnimationType}` : ''
				]
			},
			contentClassNames() {
				return [
					`u-tabbar-item__content--${this.resolvedStyleType}`,
					this.isMidButton ? 'u-tabbar-item__content--mid-button' : ''
				]
			},
			bubbleClassNames() {
				return [
					`u-tabbar-item__bubble--${this.resolvedStyleType}`,
					this.isActive ? 'u-tabbar-item__bubble--active' : '',
					this.isMidButton ? 'u-tabbar-item__bubble--mid-button' : ''
				]
			},
			textClassNames() {
				return [
					`u-tabbar-item__text--${this.resolvedStyleType}`,
					this.parentData.textMode === 'active' && !this.isActive ? 'u-tabbar-item__text--muted' : ''
				]
			},
			itemInlineStyle() {
				return {
					backgroundColor: this.isActive
						? (this.parentData.activeBackgroundColor || 'transparent')
						: (this.parentData.inactiveBackgroundColor || 'transparent')
				}
			}
		},
		created() {
			this.init()
		},
		emits: ["click", "change"],
		methods: {
			addStyle,
			init() {
				// 支付宝小程序不支持provide/inject，所以使用这个方法获取整个父组件，在created定义，避免循环引用
				this.updateParentData()
				if (!this.parent) {
					error('up-tabbar-item必须搭配up-tabbar组件使用')
				}
				// 本子组件在u-tabbar的children数组中的索引
				const index = this.parent.children.indexOf(this)
				// 判断本组件的name(如果没有定义name，就用index索引)是否等于父组件的value参数
				this.isActive = (this.name || index) === this.parentData.value
			},
			updateParentData() {
				// 此方法在mixin中
				this.getParentData('u-tabbar')
			},
			// 此方法将会被父组件u-tabbar调用
			updateFromParent() {
				// 重新初始化
				this.init()
			},
			clickHandler() {
				this.$nextTick(() => {
					const index = this.parent.children.indexOf(this)
					const name = this.name || index
					// 点击的item为非激活的item才发出change事件
					if (name !== this.parent.value) {
						this.parent.$emit('change', name)
					}
					this.$emit('click', name)
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.u-tabbar-item {
		@include flex(column);
		align-items: center;
		justify-content: center;
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		/* #endif */
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		
		&__icon {
			@include flex;
			position: relative;
			width: 150rpx;
			justify-content: center;
			min-height: 46rpx;
			transition: transform 0.22s ease, opacity 0.22s ease;

			&--pill,
			&--card,
			&--glow,
			&--convex {
				width: 100%;
			}

			&--anim-scale {
				transform: scale(var(--up-tabbar-icon-scale, 1.1));
			}

			&--anim-lift {
				transform: translateY(-6rpx) scale(var(--up-tabbar-icon-scale, 1.08));
			}

			&--anim-swing {
				transform: rotate(-10deg) scale(var(--up-tabbar-icon-scale, 1.08));
			}

			&--anim-pulse {
				transform: scale(var(--up-tabbar-icon-scale, 1.14));
			}
		}

		&__content {
			@include flex(column);
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;

			&--mid-button {
				justify-content: center;
			}
		}

		&__bubble {
			@include flex(column);
			align-items: center;
			justify-content: center;
			min-width: 0;
			padding: 0;
			max-width: 100rpx;
			border-radius: 999px;
			transition: background-color 0.22s ease, transform 0.22s ease;

			&--pill.u-tabbar-item__bubble--active {
				background-color: transparent;
			}

			&--glow.u-tabbar-item__bubble--active {
				background-color: var(--up-tabbar-active-bg, rgba(125, 211, 252, 0.12));
			}

			&--mid-button {
				padding: 0;
				background-color: transparent !important;
			}
		}

		&__text {
			margin-top: 2px;
			font-size: 12px;
			color: $u-content-color;
			transition: transform 0.22s ease, opacity 0.22s ease;

			&--muted {
				opacity: 0.68;
				transform: scale(0.94);
			}
		}

		&__underline {
			position: absolute;
			left: 50%;
			bottom: 2rpx;
			width: 34rpx;
			height: 6rpx;
			border-radius: 999px;
			background-color: currentColor;
			transform: translateX(-50%);
		}

		&__active-dot {
			position: absolute;
			left: 50%;
			bottom: 8rpx;
			width: 10rpx;
			height: 10rpx;
			border-radius: 50%;
			background-color: currentColor;
			transform: translateX(-50%);
		}
	}

	.u-tabbar-item--active {
		color: inherit;
	}

	.u-tabbar-item--pill,
	.u-tabbar-item--glow,
	.u-tabbar-item--card {
		margin: 0;
		border-radius: 999px;
	}

	.u-tabbar-item--card {
		border-radius: 24rpx;
	}

	.u-tabbar-item--active.u-tabbar-item--pill,
	.u-tabbar-item--active.u-tabbar-item--card {
		box-shadow: none;
	}

	.u-tabbar-item--active.u-tabbar-item--glow {
		box-shadow: none;
	}

	.u-tabbar-item--lift.u-tabbar-item--active {
		transform: none;
	}

	.u-tabbar-item--lift.u-tabbar-item--active .u-tabbar-item__icon {
		transform: translateY(-6rpx) scale(1.04);
	}

	.u-tabbar-item--underline,
	.u-tabbar-item--dot {
		padding-bottom: 10rpx;
	}

	.u-tabbar-item--convex.u-tabbar-item--active:not(.u-tabbar-item--mid-button) {
		transform: none;
	}
	
	// 中间按钮样式
	.u-tabbar-item--mid-button {
		/* #ifndef APP-NVUE */
		transform: translateY(v-bind('`${midButtonOffsetY}px`'));
		/* #endif */
		z-index: 2;
		flex: 1;
	}
	
	.u-tabbar-item__icon--mid-button {
		width: 64px;
		height: 64px;
		border-radius: 999px;
		background: #ffffff;
		box-shadow: v-bind('midButtonBoxShadow || "none"');
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: visible;
	}

	.u-tabbar-item__mid-button-arc {
		position: absolute;
		left: -4px;
		top: -4px;
		width: calc(100% + 8px);
		height: calc(100% + 8px);
		pointer-events: none;
		z-index: 0;
	}

	.u-tabbar-item__mid-button-arc svg {
		width: 100%;
		height: 100%;
	}

	.u-tabbar-item__mid-button-arc path {
		fill: none;
		stroke: none;
		stroke-width: 0;
		stroke-linecap: round;
	}

	.u-tabbar-item__mid-button-inner {
		position: absolute;
		left: 6px;
		top: 6px;
		right: 6px;
		bottom: 6px;
		border-radius: 999px;
		background: v-bind('midButtonBgColor || "#ffffff"');
		box-shadow: v-bind('midButtonInnerBoxShadow');
		z-index: 1;
	}

	.u-tabbar-item__icon--mid-button :deep(.u-icon),
	.u-tabbar-item__icon--mid-button :deep(.u-badge) {
		position: relative;
		z-index: 2;
	}

	.u-tabbar-item--mid-button .u-tabbar-item__text {
		margin-top: 0;
		transform: translateY(-4px);
	}

	.u-tabbar-item--lift .u-tabbar-item__bubble {
		background-color: transparent !important;
	}

	.u-tabbar-item--lift.u-tabbar-item--active .u-tabbar-item__text {
		transform: translateY(-4rpx);
	}

	.u-tabbar-item--anim-pulse .u-tabbar-item__icon {
		animation: u-tabbar-item-pulse 1.4s ease-in-out infinite;
	}

	@keyframes u-tabbar-item-pulse {
		0%, 100% {
			transform: scale(var(--up-tabbar-icon-scale, 1.1));
		}
		50% {
			transform: scale(calc(var(--up-tabbar-icon-scale, 1.1) + 0.08));
		}
	}

	/* #ifdef MP */
	// 由于小程序都使用shadow DOM形式实现，需要给影子宿主设置flex: 1才能让其撑开
	:host {
		flex: 1;
		width: 100%;
	}
	/* #endif */
</style>
