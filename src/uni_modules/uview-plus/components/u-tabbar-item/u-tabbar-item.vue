<template>
	<view
	    class="u-tabbar-item"
	    :style="[itemInlineStyle, addStyle(customStyle)]"
	    :class="itemClassNames"
	    @tap="clickHandler"
	>
		<view 
			class="u-tabbar-item__icon"
			:class="iconClassNames"
		>
			<view class="u-tabbar-item--mid-button-cover" v-if="isMidButton">
			</view>
			<up-icon
			    v-if="resolvedIconName"
			    :name="resolvedIconName"
			    :color="isActive ? resolvedActiveColor : resolvedInactiveColor"
			    :size="isMidButton ? 26 : 20"
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
		margin: 6rpx 0;
		border-radius: 999px;
	}

	.u-tabbar-item--card {
		border-radius: 24rpx;
	}

	.u-tabbar-item--active.u-tabbar-item--pill,
	.u-tabbar-item--active.u-tabbar-item--card {
		box-shadow: 0 10rpx 24rpx rgba(60, 156, 255, 0.14);
	}

	.u-tabbar-item--active.u-tabbar-item--glow {
		box-shadow: 0 0 0 2rpx rgba(60, 156, 255, 0.06), 0 8rpx 28rpx rgba(60, 156, 255, 0.22);
	}

	.u-tabbar-item--lift.u-tabbar-item--active {
		transform: translateY(-8rpx);
	}

	.u-tabbar-item--underline,
	.u-tabbar-item--dot {
		padding-bottom: 10rpx;
	}

	.u-tabbar-item--convex.u-tabbar-item--active:not(.u-tabbar-item--mid-button) {
		transform: translateY(-4rpx);
	}
	
	// 中间按钮样式
	.u-tabbar-item--mid-button {
		/* #ifndef APP-NVUE */
		transform: translateY(-10px);
		/* #endif */
	}
	
	.u-tabbar-item--mid-button-cover {
		background-color: var(--up-card-bg-color, #fff);
		position: absolute;
		top: 22px;
		left: -10px;
		// right: -10px;
		width: 90px;
		bottom: 0;
	}
	
	.u-tabbar-item__icon--mid-button {
		width: 70px;
		height: 70px;
		border-radius: 100px;
		background-color: var(--up-card-bg-color, #ffffff);
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border: 1px solid var(--up-border-color, rgba(0, 0, 0, 0.08));
		display: flex;
		align-items: center;
		justify-content: center;
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
