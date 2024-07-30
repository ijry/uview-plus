<template>
	<view
		class="u-slider"
		:style="[addStyle(customStyle)]"
	>
		<template v-if="!useNative || isRange">
			<view ref="u-slider-inner" class="u-slider-inner" @click="onClick"
				@onTouchStart="onTouchStart2($event, 1)" @touchmove="onTouchMove2($event, 1)"
				@touchend="onTouchEnd2($event, 1)" @touchcancel="onTouchEnd2($event, 1)"
				:class="[disabled ? 'u-slider--disabled' : '']" :style="{
					height: (isRange && showValue) ? (getPx(blockSize) + 24) + 'px' : (getPx(blockSize)) + 'px',
				}"
			>
				<view ref="u-slider__base"
					class="u-slider__base"
					:style="[
						{
							height: height,
							backgroundColor: inactiveColor
						}
					]"
				>
				</view>
				<view
					class="u-slider__gap"
					:style="[
						barStyle,
						{
							height: height,
							marginTop: '-' + height,
							backgroundColor: activeColor
						}
					]"
				>
				</view>
				<view v-if="isRange"
					class="u-slider__gap u-slider__gap-0"
					:style="[
						barStyle0,
						{
							height: height,
							marginTop: '-' + height,
							backgroundColor: inactiveColor
						}
					]"
				>
				</view>
				<text v-if="isRange && showValue"
					class="u-slider__show-range-value" :style="{left: (getPx(barStyle0.width) + getPx(blockSize)/2) + 'px'}">
					{{ this.rangeValue[0] }}
				</text>
				<text v-if="isRange && showValue"
					class="u-slider__show-range-value" :style="{left: (getPx(barStyle.width) + getPx(blockSize)/2) + 'px'}">
					{{ this.rangeValue[1] }}
				</text>
				<template v-if="isRange">
					<view class="u-slider__button-wrap u-slider__button-wrap-0" @touchstart="onTouchStart($event, 0)"
						@touchmove="onTouchMove($event, 0)" @touchend="onTouchEnd($event, 0)"
						@touchcancel="onTouchEnd($event, 0)" :style="{left: (getPx(barStyle0.width) + getPx(blockSize)/2) + 'px'}">
						<slot v-if="$slots.default  || $slots.$default"/>
						<view v-else class="u-slider__button" :style="[blockStyle, {
							height: getPx(blockSize, true),
							width: getPx(blockSize, true),
							backgroundColor: blockColor
						}]"></view>
					</view>
				</template>
				<view class="u-slider__button-wrap" @touchstart="onTouchStart"
					@touchmove="onTouchMove" @touchend="onTouchEnd"
					@touchcancel="onTouchEnd" :style="{left: (getPx(barStyle.width) + getPx(blockSize)/2) + 'px'}">
					<slot v-if="$slots.default  || $slots.$default"/>
					<view v-else class="u-slider__button" :style="[blockStyle, {
						height: getPx(blockSize, true),
						width: getPx(blockSize, true),
						backgroundColor: blockColor
					}]"></view>
				</view>
			</view>
			<view class="u-slider__show-value" v-if="showValue && !isRange">{{ modelValue }}</view>
		</template>
		<slider
			class="u-slider__native"
			v-else
			:min="min"
			:max="max"
			:step="step"
			:value="modelValue"
			:activeColor="activeColor"
			:backgroundColor="inactiveColor"
			:blockSize="getPx(blockSize)"
			:blockColor="blockColor"
			:showValue="showValue"
			:disabled="disabled"
			@changing="changingHandler"
			@change="changeHandler"
		></slider>
	</view>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	import { addStyle, getPx, sleep } from '../../libs/function/index.js';
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom')
	// #endif
	/**
	 * slider 滑块选择器
	 * @tutorial https://uview-plus.jiangruyi.com/components/slider.html
	 * @property {Number | String} value 滑块默认值（默认0）
	 * @property {Number | String} min 最小值（默认0）
	 * @property {Number | String} max 最大值（默认100）
	 * @property {Number | String} step 步长（默认1）
	 * @property {Number | String} blockWidth 滑块宽度，高等于宽（30）
	 * @property {Number | String} height 滑块条高度，单位rpx（默认6）
	 * @property {String} inactiveColor 底部条背景颜色（默认#c0c4cc）
	 * @property {String} activeColor 底部选择部分的背景颜色（默认#2979ff）
	 * @property {String} blockColor 滑块颜色（默认#ffffff）
	 * @property {Object} blockStyle 给滑块自定义样式，对象形式
	 * @property {Boolean} disabled 是否禁用滑块(默认为false)
	 * @event {Function} changing 正在滑动中
	 * @event {Function} change 滑动结束
	 * @example <up-slider v-model="value" />
	 */
	export default {
		name: 'u-slider',
		mixins: [mpMixin, mixin, props],
		emits: ["start", "changing", "change", "update:modelValue"],
		data() {
			return {
				startX: 0,
				status: 'end',
				newValue: 0,
				distanceX: 0,
				startValue0: 0,
				startValue: 0,
				barStyle0: {},
				barStyle: {},
				sliderRect: {
					left: 0,
					width: 0
				}
			};
		},
		watch: {
			// #ifdef VUE3
			modelValue(n) {
				// 只有在非滑动状态时，才可以通过value更新滑块值，这里监听，是为了让用户触发
				if(this.status == 'end') this.updateValue(this.modelValue, false);
			},
			// #endif
			// #ifdef VUE2
			value(n) {
				// 只有在非滑动状态时，才可以通过value更新滑块值，这里监听，是为了让用户触发
				if(this.status == 'end') this.updateValue(this.value, false);
			}
			// #endif
		},
		created() {
		},
		async mounted() {
			// 获取滑块条的尺寸信息
			if (!this.useNative) {
				// #ifndef APP-NVUE
				this.$uGetRect('.u-slider__base').then(rect => {
					this.sliderRect = rect;
					this.init()
				});
				// #endif
				// #ifdef APP-NVUE
				await sleep(30) // 不延迟会出现size获取都为0的问题
				const ref = this.$refs['u-slider__base']
				ref &&
					dom.getComponentRect(ref, (res) => {
						// console.log(res)
						this.sliderRect = {
							left: res.size.left,
							width: res.size.width
						};
						this.init()
					})
				// #endif
			}
		},
		methods: {
			addStyle,
			getPx,
			init() {
				if (this.isRange) {
					this.updateValue(this.rangeValue[0], false, 0);
					this.updateValue(this.rangeValue[1], false, 1);
				} else {
					// #ifdef VUE3
					this.updateValue(this.modelValue, false);
					// #endif
					// #ifdef VUE2
					this.updateValue(this.value, false);
					// #endif
				}
			},
			// native拖动过程中触发
			changingHandler(e) {
				const {
					value
				} = e.detail
				// 更新v-model的值
				// #ifdef VUE3
                this.$emit("update:modelValue", value);
                // #endif
                // #ifdef VUE2
                this.$emit("input", value);
                // #endif
				// 触发事件
				this.$emit('changing', value)
			},
			// native滑动结束时触发
			changeHandler(e) {
				const {
					value
				} = e.detail
				// 更新v-model的值
				// #ifdef VUE3
                this.$emit("update:modelValue", value);
                // #endif
                // #ifdef VUE2
                this.$emit("input", value);
                // #endif
				// 触发事件
				this.$emit('change', value);
			},
			onTouchStart(event, index = 1) {
				if (this.disabled) return;
				this.startX = 0;
				// 触摸点集
				let touches = event.touches[0];
				// 触摸点到屏幕左边的距离
				this.startX = touches.clientX;
				// 此处的this.modelValue虽为props值，但是通过$emit('update:modelValue')进行了修改
				if (this.isRange) {
					this.startValue0 = this.format(this.rangeValue[0], 0);
					this.startValue = this.format(this.rangeValue[1], 1);
				} else {
					// #ifdef VUE3
					this.startValue = this.format(this.modelValue);
					// #endif
					// #ifdef VUE2
					this.startValue = this.format(this.value);
					// #endif
				}
				// 标示当前的状态为开始触摸滑动
				this.status = 'start';

				let clientX = 0;
				// #ifndef APP-NVUE
				clientX = touches.clientX;
				// #endif
				// #ifdef APP-NVUE
				clientX = touches.screenX;
				// #endif
				this.distanceX = clientX - this.sliderRect.left;
				// 获得移动距离对整个滑块的值，此为带有多位小数的值，不能用此更新视图
				// 否则造成通信阻塞，需要每改变一个step值时修改一次视图
				this.newValue = ((this.distanceX / this.sliderRect.width) * (this.max - this.min)) + parseFloat(this.min);
				this.status = 'moving';
				// 发出moving事件
				this.$emit('changing');
				this.updateValue(this.newValue, true, index);
			},
			onTouchMove(event, index = 1) {
				if (this.disabled) return;
				// 连续触摸的过程会一直触发本方法，但只有手指触发且移动了才被认为是拖动了，才发出事件
				// 触摸后第一次移动已经将status设置为moving状态，故触摸第二次移动不会触发本事件
				if (this.status == 'start') this.$emit('start');
				let touches = event.touches[0];
				console.log('touchs', touches)
				// 滑块的左边不一定跟屏幕左边接壤，所以需要减去最外层父元素的左边值
				let clientX = 0;
				// #ifndef APP-NVUE
				clientX = touches.clientX;
				// #endif
				// #ifdef APP-NVUE
				clientX = touches.screenX;
				// #endif
				this.distanceX = clientX - this.sliderRect.left;
				// 获得移动距离对整个滑块的值，此为带有多位小数的值，不能用此更新视图
				// 否则造成通信阻塞，需要每改变一个step值时修改一次视图
				this.newValue = ((this.distanceX / this.sliderRect.width) * (this.max - this.min)) + parseFloat(this.min);
				this.status = 'moving';
				// 发出moving事件
				this.$emit('changing');
				this.updateValue(this.newValue, true, index);
			},
			onTouchEnd(event, index = 1) {
				if (this.disabled) return;
				if (this.status === 'moving') {
					this.updateValue(this.newValue, false, index);
					this.$emit('change');
				}
				this.status = 'end';
			},
			onTouchStart2(event, index = 1) {
				if (!this.isRange) {
					this.onChangeStart(event, index);
				}
			},
			onTouchMove2(event, index = 1) {
				if (!this.isRange) {
					this.onTouchMove(event, index);
				}
			},
			onTouchEnd2(event, index = 1) {
				if (!this.isRange) {
					this.onTouchEnd(event, index);
				}
			},
			onClick(event) {
				if (this.disabled) return;
				// 直接点击滑块的情况，计算方式与onTouchMove方法相同
				// console.log('click', event)
				// #ifndef APP-NVUE
				// nvue下暂时无法获取坐标
				let clientX = event.detail.x - this.sliderRect.left
				this.newValue = ((clientX / this.sliderRect.width) * (this.max - this.min)) + parseFloat(this.min);
				this.updateValue(this.newValue, false, 1);
				// #endif
			},
			updateValue(value, drag, index = 1) {
				// 去掉小数部分，同时也是对step步进的处理
				let valueFormat = this.format(value, index);
				// 不允许滑动的值超过max最大值
				if(valueFormat > this.max ) {
					valueFormat = this.max
				}
				// 设置移动的距离，不能用百分比，因为NVUE不支持。
				let width = Math.min((valueFormat - this.min) / (this.max - this.min) * this.sliderRect.width, this.sliderRect.width)
				let barStyle = {
					width: width + 'px'
				};
				// 移动期间无需过渡动画
				if (drag == true) {
					barStyle.transition = 'none';
				} else {
					// 非移动期间，删掉对过渡为空的声明，让css中的声明起效
					delete barStyle.transition;
				}
				// 修改value值
				if (this.isRange) {
					this.rangeValue[index] = valueFormat;
					this.$emit("update:modelValue", this.rangeValue);
				} else {
					// #ifdef VUE3
					this.$emit("update:modelValue", valueFormat);
					// #endif
					// #ifdef VUE2
					this.$emit("input", valueFormat);
					// #endif
				}

				switch (index) {
					case 0:
						this.barStyle0 = {...barStyle};
						break;
					case 1:
						this.barStyle = {...barStyle};
						break;
					default:
						break;
				}
				
			},
			format(value, index = 1) {
				// 将小数变成整数，为了减少对视图的更新，造成视图层与逻辑层的阻塞
				if (this.isRange) {
					switch (index) {
						case 0:
							return Math.round(
								Math.max(this.min, Math.min(value, this.rangeValue[1] - this.step,this.max))
								/ this.step
							) * this.step;
							break;
						case 1:
							return Math.round(
								Math.max(this.min, this.rangeValue[0] + this.step, Math.min(value, this.max))
								/ this.step
							) * this.step;
							break;
						default:
							break;
					}
				} else {
					return Math.round(
						Math.max(this.min, Math.min(value, this.max))
						/ this.step
					) * this.step;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";
	.u-slider {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;

		&__native {
			flex: 1;
		}

		&-inner {
			flex: 1;
			position: relative;
			border-radius: 999px;
			padding: 10px 18px;
			justify-content: center;
		}

		&__show-value {
			margin: 10px 18px 10px 0px;
		}

		&__show-range-value {
			padding-top: 2px;
			font-size: 12px;
			line-height: 12px;
			position: absolute;
    		bottom: 0;
		}

		&__base {
			background-color: #ebedf0;
		}

		/* #ifndef APP-NVUE */
		&-inner:before {
			position: absolute;
			right: 0;
			left: 0;
			content: '';
			top: -8px;
			bottom: -8px;
			z-index: -1;
		}
		/* #endif */

		&__gap {
			position: relative;
			border-radius: 999px;
			transition: width 0.2s;
			background-color: #1989fa;
		}

		&__button {
			width: 24px;
			height: 24px;
			border-radius: 50%;
			box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
			background-color: #fff;
			transform: scale(0.9);
			/* #ifdef H5 */
			cursor: pointer;
			/* #endif */
		}

		&__button-wrap {
			position: absolute;
			// transform: translate3d(50%, -50%, 0);
		}

		&--disabled {
			opacity: 0.5;
		}
	}
</style>
