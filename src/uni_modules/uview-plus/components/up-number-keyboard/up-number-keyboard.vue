<template>
	<view
		class="up-keyboard"
		@touchmove.stop.prevent="noop"
	>
		<view
			class="up-keyboard__button-wrapper"
			v-for="(item, index) in numList"
			:key="index"
		>
			<view
				class="up-keyboard__button-wrapper__button"
				:style="[itemStyle(index)]"
				@tap="keyboardClick(item)"
				hover-class="up-hover-class"
				:hover-stay-time="200"
			>
				<text class="up-keyboard__button-wrapper__button__text">{{ item }}</text>
			</view>
		</view>
		<view
			class="up-keyboard__button-wrapper"
		>
			<view
				class="up-keyboard__button-wrapper__button up-keyboard__button-wrapper__button--gray"
				hover-class="up-hover-class"
				:hover-stay-time="200"
				@touchstart.stop="backspaceClick"
				@touchend="clearTimer"
			>
				<up-icon
					name="backspace"
					color="#303133"
					size="28"
				></up-icon>
			</view>
		</view>
	</view>
</template>

<script>
	import { props } from './props.js';
	import { mpMixin } from '../../libs/mixin/mpMixin.js';
	import { mixin } from '../../libs/mixin/mixin.js';
	import { randomArray } from '../../libs/function/index.js';
	/**
	 * keyboard 键盘组件
	 * @description
	 * @tutorial
	 * @property {String}	mode		键盘的类型，number-数字键盘，card-身份证键盘
	 * @property {Boolean}	dotDisabled	是否显示键盘的"."符号
	 * @property {Boolean}	random		是否打乱键盘按键的顺序
	 * @event {Function} change		点击键盘触发
	 * @event {Function} backspace	点击退格键触发
	 * @example
	 */
	export default {
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				backspace: 'backspace', // 退格键内容
				dot: '.', // 点
				timer: null, // 长按多次删除的事件监听
				cardX: 'X' // 身份证的X符号
			};
		},
		computed: {
			// 键盘需要显示的内容
			numList() {
				let tmp = [];
				if (this.dotDisabled && this.mode == 'number') {
					if (!this.random) {
						return [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
					} else {
						return randomArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
					}
				} else if (!this.dotDisabled && this.mode == 'number') {
					if (!this.random) {
						return [1, 2, 3, 4, 5, 6, 7, 8, 9, this.dot, 0];
					} else {
						return randomArray([1, 2, 3, 4, 5, 6, 7, 8, 9, this.dot, 0]);
					}
				} else if (this.mode == 'card') {
					if (!this.random) {
						return [1, 2, 3, 4, 5, 6, 7, 8, 9, this.cardX, 0];
					} else {
						return randomArray([1, 2, 3, 4, 5, 6, 7, 8, 9, this.cardX, 0]);
					}
				}
			},
			// 按键的样式，在非乱序&&数字键盘&&不显示点按钮时，index为9时，按键占位两个空间
			itemStyle() {
				return index => {
					let style = {};
					if (this.mode == 'number' && this.dotDisabled && index == 9) style.width = '464rpx';
					return style;
				};
			},
			// 是否让按键显示灰色，只在非乱序&&数字键盘&&且允许点按键的时候
			btnBgGray() {
				return index => {
					if (!this.random && index == 9 && (this.mode != 'number' || (this.mode == 'number' && !this
							.dotDisabled))) return true;
					else return false;
				};
			},
		},
		created() {
		},
		emits: ["backspace", "change"],
		methods: {
			// 点击退格键
			backspaceClick() {
				this.$emit('backspace');
				clearInterval(this.timer); //再次清空定时器，防止重复注册定时器
				this.timer = null;
				this.timer = setInterval(() => {
					this.$emit('backspace');
				}, 250);
			},
			clearTimer() {
				clearInterval(this.timer);
				this.timer = null;
			},
			// 获取键盘显示的内容
			keyboardClick(val) {
				// 允许键盘显示点模式和触发非点按键时，将内容转为数字类型
				if (!this.dotDisabled && val != this.dot && val != this.cardX) val = Number(val);
				this.$emit('change', val);
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";
	$up-number-keyboard-background-color:rgb(224, 228, 230) !default;
	$up-number-keyboard-padding:8px 10rpx 8px 10rpx !default;
	$up-number-keyboard-button-width:222rpx !default;
	$up-number-keyboard-button-margin:4px 6rpx !default;
	$up-number-keyboard-button-border-top-left-radius:4px !default;
	$up-number-keyboard-button-border-top-right-radius:4px !default;
	$up-number-keyboard-button-border-bottom-left-radius:4px !default;
	$up-number-keyboard-button-border-bottom-right-radius:4px !default;
	$up-number-keyboard-button-height: 90rpx!default;
	$up-number-keyboard-button-background-color:#FFFFFF !default;
	$up-number-keyboard-button-box-shadow:0 2px 0px #BBBCBE !default;
	$up-number-keyboard-text-font-size:20px !default;
	$up-number-keyboard-text-font-weight:500 !default;
	$up-number-keyboard-text-color:$up-main-color !default;
	$up-number-keyboard-gray-background-color:rgb(200, 202, 210) !default;
	$up-number-keyboard-up-hover-class-background-color: #BBBCC6 !default;

	.up-keyboard {
		@include flex;
		flex-direction: row;
		justify-content: space-around;
		background-color: $up-number-keyboard-background-color;
		flex-wrap: wrap;
		padding: $up-number-keyboard-padding;

		&__button-wrapper {
			box-shadow: $up-number-keyboard-button-box-shadow;
			margin: $up-number-keyboard-button-margin;
			border-top-left-radius: $up-number-keyboard-button-border-top-left-radius;
			border-top-right-radius: $up-number-keyboard-button-border-top-right-radius;
			border-bottom-left-radius: $up-number-keyboard-button-border-bottom-left-radius;
			border-bottom-right-radius: $up-number-keyboard-button-border-bottom-right-radius;

			&__button {
				width: $up-number-keyboard-button-width;
				height: $up-number-keyboard-button-height;
				background-color: $up-number-keyboard-button-background-color;
				@include flex;
				justify-content: center;
				align-items: center;
				border-top-left-radius: $up-number-keyboard-button-border-top-left-radius;
				border-top-right-radius: $up-number-keyboard-button-border-top-right-radius;
				border-bottom-left-radius: $up-number-keyboard-button-border-bottom-left-radius;
				border-bottom-right-radius: $up-number-keyboard-button-border-bottom-right-radius;

				&__text {
					font-size: $up-number-keyboard-text-font-size;
					font-weight: $up-number-keyboard-text-font-weight;
					color: $up-number-keyboard-text-color;
				}

				&--gray {
					background-color: $up-number-keyboard-gray-background-color;
				}
			}
		}
	}

	.up-hover-class {
		background-color: $up-number-keyboard-up-hover-class-background-color;
	}
</style>
