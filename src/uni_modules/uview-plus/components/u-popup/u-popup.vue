<template>
	<view class="u-popup" :class="[customClass]"
		:style="{width: show == false ? '0px' : '',
			height: show == false ? '0px' : ''}">
		<view class="u-popup__trigger">
			<slot name="trigger">
			</slot>
			<view @click="open"
				class="u-popup__trigger__cover"></view>
		</view>
		<u-overlay
			:show="show && pageInline == false"
			@click="overlayClick"
			v-if="overlay"
			:zIndex="zIndex"
			:duration="overlayDuration"
			:customStyle="overlayStyle"
			:opacity="overlayOpacity"
		></u-overlay>
		<u-transition
			class="u-popup__content—transition"
			:style="contentStyleWrap"
			:show="pageInline ? true : show"
			:customStyle="transitionStyle"
			:mode="pageInline ? 'none' : position"
			:duration="duration"
			@afterEnter="afterEnter"
			@click="clickHandler"
		>
			<!-- @click.stop不能去除，去除会导致居中模式下点击内容区域触发关闭弹窗 -->
			<view
				class="u-popup__content"
				:style="[contentStyle]"
				@click.stop="noop"
				@touchmove.stop.prevent="noop"
			>
				<u-status-bar v-if="safeAreaInsetTop"></u-status-bar>
				<!-- 增加触摸区域，用于处理手势 -->
				<view 
					v-if="touchable && mode === 'bottom'"
					class="u-popup__content__touch-area"
					@touchstart="onTouchStart"
					@touchmove="onTouchMove"
					@touchend="onTouchEnd"
					@touchcancel="onTouchEnd"
				>
					<!-- iOS风格的横条指示器 -->
					<view class="u-popup__content__indicator"></view>
				</view>
				<slot></slot>
				<view
					v-if="closeable"
					@tap.stop="close"
					class="u-popup__content__close"
					:class="['u-popup__content__close--' + closeIconPos]"
					hover-class="u-popup__content__close--hover"
					hover-stay-time="150"
				>
					<up-icon
						name="close"
						color="#909399"
						size="18"
						bold
					></up-icon>
				</view>
				<u-safe-bottom v-if="safeAreaInsetBottom"></u-safe-bottom>
			</view>
			<slot name="bottom"></slot>
		</u-transition>
	</view>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	import { addUnit, addStyle, deepMerge, sleep, getWindowInfo } from '../../libs/function/index';
	/**
	 * popup 弹窗
	 * @description 弹出层容器，用于展示弹窗、信息提示等内容，支持上、下、左、右和中部弹出。组件只提供容器，内部内容由用户自定义
	 * @tutorial https://ijry.github.io/uview-plus/components/popup.html
	 * @property {Boolean}			show				是否展示弹窗 (默认 false )
	 * @property {Boolean}			overlay				是否显示遮罩 （默认 true ）
	 * @property {String}			mode				弹出方向（默认 'bottom' ）
	 * @property {String | Number}	duration			动画时长，单位ms （默认 300 ）
	 * @property {String | Number}	overlayDuration		遮罩层动画时长，单位ms （默认 350 ）
	 * @property {Boolean}			closeable			是否显示关闭图标（默认 false ）
	 * @property {Object | String}	overlayStyle		自定义遮罩的样式
	 * @property {String | Number}	overlayOpacity		遮罩透明度，0-1之间（默认 0.5）
	 * @property {Boolean}			closeOnClickOverlay	点击遮罩是否关闭弹窗 （默认  true ）
	 * @property {String | Number}	zIndex				层级 （默认 10075 ）
	 * @property {Boolean}			safeAreaInsetBottom	是否为iPhoneX留出底部安全距离 （默认 true ）
	 * @property {Boolean}			safeAreaInsetTop	是否留出顶部安全距离（状态栏高度） （默认 false ）
	 * @property {String}			closeIconPos		自定义关闭图标位置（默认 'top-right' ）
	 * @property {String | Number}	round				圆角值（默认 20px）
	 * @property {String }	        bgColor				背景色值（默认 '' ）
	 * @property {Boolean}			zoom				当mode=center时 是否开启缩放（默认 true ）
	 * @property {Boolean}			touchable			是否开启底部弹窗手势功能（默认 false ）
	 * @property {String}			minHeight			最小高度，单位任意，数值默认为px（默认 '200px' ）
	 * @property {String}			maxHeight			最大高度，单位任意，数值默认为px（默认 '80%' ）
	 * @property {Object}			customStyle			组件的样式，对象形式
	 * @event {Function} open 弹出层打开
	 * @event {Function} close 弹出层收起
	 * @example <u-popup v-model:show="show"><text>出淤泥而不染，濯清涟而不妖</text></u-popup>
	 */
	export default {
		name: 'u-popup',
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				overlayDuration: this.duration + 50,
				// 触摸相关数据
				touchStartY: 0,
				touchStartHeight: 0,
				isTouching: false,
				// 当前弹窗高度
				currentHeight: 'auto'
			}
		},
		watch: {
			show(newValue, oldValue) {
				if (newValue === true) {
					// #ifdef MP-WEIXIN
					const children = this.$children
					this.retryComputedComponentRect(children)
					// #endif
				}
			}
		},
		computed: {
			transitionStyle() {
				const style = {
					display: 'flex',
				}
				if (!this.pageInline) {
					style.zIndex = this.zIndex
					style.position = 'fixed'
				}
				style[this.mode] = 0
				if (this.mode === 'left') {
					return deepMerge(style, {
						bottom: 0,
						top: 0,
					})
				} else if (this.mode === 'right') {
					return deepMerge(style, {
						bottom: 0,
						top: 0,
					})
				} else if (this.mode === 'top') {
					return deepMerge(style, {
						left: 0,
						right: 0
					})
				} else if (this.mode === 'bottom') {
					return deepMerge(style, {
						left: 0,
						right: 0,
					})
				} else if (this.mode === 'center') {
					return deepMerge(style, {
						alignItems: 'center',
						'justify-content': 'center',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0
					})
				}
			},
			contentStyleWrap() {
				const style = {}
				
				// 处理手势滑动时的高度变化
				if (this.mode === 'bottom' && this.touchable) {
					if (this.currentHeight !== 'auto') {
						style.height = this.currentHeight
					}
					if (this.maxHeight) {
						style.maxHeight = addUnit(this.maxHeight)
					}
					if (this.minHeight) {
						style.minHeight = addUnit(this.minHeight)
					}
				}
				return style;
			},
			contentStyle() {
				const style = {}
				// 通过设备信息的safeAreaInsets值来判断是否需要预留顶部状态栏和底部安全局的位置
				// 不使用css方案，是因为nvue不支持css的iPhoneX安全区查询属性
				const {
					safeAreaInsets
				} = getWindowInfo()
				if (this.mode !== 'center') {
					style.flex = 1
				}
				// 背景色，一般用于设置为transparent，去除默认的白色背景
				if (this.bgColor) {
					style.backgroundColor = this.bgColor
				}
				if(this.round) {
					const value = addUnit(this.round)
					if(this.mode === 'top') {
						style.borderBottomLeftRadius = value
						style.borderBottomRightRadius = value
					} else if(this.mode === 'bottom') {
						style.borderTopLeftRadius = value
						style.borderTopRightRadius = value
					} else if(this.mode === 'center') {
						style.borderRadius = value
					} 
				}
				
				return deepMerge(style, addStyle(this.customStyle))
			},
			position() {
				if (this.mode === 'center') {
					return this.zoom ? 'fade-zoom' : 'fade'
				}
				if (this.mode === 'left') {
					return 'slide-left'
				}
				if (this.mode === 'right') {
					return 'slide-right'
				}
				if (this.mode === 'bottom') {
					return 'slide-up'
				}
				if (this.mode === 'top') {
					return 'slide-down'
				}
			},
		},
		emits: ["open", "close", "click", "update:show"],
		methods: {
			// 点击遮罩
			overlayClick() {
				if (this.closeOnClickOverlay) {
					this.$emit('update:show', false)
					this.$emit('close')
				}
			},
			open(e) {
				this.$emit('update:show', true)
			},
			close(e) {
				this.$emit('update:show', false)
				this.$emit('close')
			},
			afterEnter() {
				this.$emit('open')
			},
			clickHandler() {
				// 由于中部弹出时，其u-transition占据了整个页面相当于遮罩，此时需要发出遮罩点击事件，是否无法通过点击遮罩关闭弹窗
				if(this.mode === 'center') {
					this.overlayClick()
				}
				this.$emit('click')
			},
			// #ifdef MP-WEIXIN
			retryComputedComponentRect(children) {
				// 组件内部需要计算节点的组件
				const names = ['u-calendar-month', 'u-album', 'u-collapse-item', 'u-dropdown', 'u-index-item', 'u-index-list',
					'u-line-progress', 'u-list-item', 'u-rate', 'u-read-more', 'u-row', 'u-row-notice', 'u-scroll-list',
					'u-skeleton', 'u-slider', 'u-steps-item', 'u-sticky', 'u-subsection', 'u-swipe-action-item', 'u-tabbar',
					'u-tabs', 'u-tooltip'
				]
				// 历遍所有的子组件节点
				for (let i = 0; i < children.length; i++) {
					const child = children[i]
					// 拿到子组件的子组件
					const grandChild = child.$children
					// 判断如果在需要重新初始化的组件数组中名中，并且存在init方法的话，则执行
					if (names.includes(child.$options.name) && typeof child?.init === 'function') {
						// 需要进行一定的延时，因为初始化页面需要时间
						sleep(50).then(() => {
							child.init()
						})
					}
					// 如果子组件还有孙组件，进行递归历遍
					if (grandChild.length) {
						this.retryComputedComponentRect(grandChild)
					}
				}
			},
			// #endif
			
			// 触摸开始
			onTouchStart(e) {
				if (!this.touchable || this.mode !== 'bottom') return;
				this.isTouching = true;
				this.touchStartY = e.touches[0].clientY;
				// 保存当前高度
				this.touchStartHeight = this.$el.querySelector('.u-popup__content—transition').offsetHeight;
			},
			
			// 触摸移动
			onTouchMove(e) {
				if (!this.isTouching || !this.touchable || this.mode !== 'bottom') return;
				const touchY = e.touches[0].clientY;
				const deltaY = touchY - this.touchStartY;
				
				// 只处理向上滑动（减小高度）和向下滑动（增加高度）
				if (deltaY !== 0) {
					const newHeight = this.touchStartHeight - deltaY;
					const minHeight = parseFloat(addUnit(this.minHeight)) || 200;
					const maxHeight = this.maxHeight ? 
						(this.maxHeight.toString().includes('%') ? 
							getWindowInfo().windowHeight * (parseFloat(this.maxHeight) / 100) : 
							parseFloat(addUnit(this.maxHeight))) : 
						getWindowInfo().windowHeight * 0.8;
					
					// 限制高度在最小值和最大值之间
					if (newHeight >= minHeight && newHeight <= maxHeight) {
						this.currentHeight = newHeight + 'px';
					}
				}
				
				// 阻止默认滚动行为
				e.preventDefault();
			},
			
			// 触摸结束
			onTouchEnd(e) {
				if (!this.isTouching || !this.touchable || this.mode !== 'bottom') return;
				this.isTouching = false;
				
				const touchY = e.changedTouches[0].clientY;
				const deltaY = touchY - this.touchStartY;
				const velocity = Math.abs(deltaY) / (e.timeStamp - e.changedTouches[0].timestamp); // 简单的速度计算
				
				// 快速向下滑动时关闭弹窗
				if (deltaY > 100 || (deltaY > 30 && velocity > 0.5)) {
					this.close();
				} else {
					// 恢复到自适应高度
					// this.currentHeight = 'auto';
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	$u-popup-flex:1 !default;
	$u-popup-content-background-color: #fff !default;

	.u-popup {
		flex: $u-popup-flex;
		
		&__trigger {
			position: relative;
			&__cover {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
			}
		}

		&__content {
			background-color: $u-popup-content-background-color;
			position: relative;

			&--round-top {
				border-top-left-radius: 0;
				border-top-right-radius: 0;
				border-bottom-left-radius: 10px;
				border-bottom-right-radius: 10px;
			}

			&--round-left {
				border-top-left-radius: 0;
				border-top-right-radius: 10px;
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 10px;
			}

			&--round-right {
				border-top-left-radius: 10px;
				border-top-right-radius: 0;
				border-bottom-left-radius: 10px;
				border-bottom-right-radius: 0;
			}

			&--round-bottom {
				border-top-left-radius: 10px;
				border-top-right-radius: 10px;
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
			}

			&--round-center {
				border-top-left-radius: 10px;
				border-top-right-radius: 10px;
				border-bottom-left-radius: 10px;
				border-bottom-right-radius: 10px;
			}
			
			&__touch-area {
				// position: absolute;
				top: 0;
				left: 0;
				right: 0;
				height: 42rpx;
				z-index: 10;
				/* #ifndef APP-NVUE */
				display: flex;
				/* #endif */
				justify-content: center;
				align-items: center;
			}
			
			&__indicator {
				width: 100px;
				height: 5px;
				border-radius: 100px;
				background-color: #c0c4cc;
			}

			&__close {
				position: absolute;

				&--hover {
					opacity: 0.4;
				}
			}

			&__close--top-left {
				top: 15px;
				left: 15px;
			}

			&__close--top-right {
				top: 15px;
				right: 15px;
			}

			&__close--bottom-left {
				bottom: 15px;
				left: 15px;
			}

			&__close--bottom-right {
				right: 15px;
				bottom: 15px;
			}
		}
	}
</style>