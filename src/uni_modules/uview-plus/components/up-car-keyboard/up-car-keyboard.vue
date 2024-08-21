<template>
	<view
		class="up-keyboard"
		@touchmove.stop.prevent="noop"
	>
		<view
			v-for="(group, i) in abc ? engKeyBoardList : areaList"
			:key="i"
			class="up-keyboard__button"
			:index="i"
			:class="[i + 1 === 4 && 'up-keyboard__button--center']"
		>
			<view
				v-if="i === 3"
				class="up-keyboard__button__inner-wrapper"
			>
				<view
					class="up-keyboard__button__inner-wrapper__left"
					hover-class="up-hover-class"
					:hover-stay-time="200"
					@tap="changeCarInputMode"
				>
					<text
						class="up-keyboard__button__inner-wrapper__left__lang"
						:class="[!abc && 'up-keyboard__button__inner-wrapper__left__lang--active']"
					>中</text>
					<text class="up-keyboard__button__inner-wrapper__left__line">/</text>
					<text
						class="up-keyboard__button__inner-wrapper__left__lang"
						:class="[abc && 'up-keyboard__button__inner-wrapper__left__lang--active']"
					>英</text>
				</view>
			</view>
			<view
				class="up-keyboard__button__inner-wrapper"
				v-for="(item, j) in group"
				:key="j"
			>
				<view
					class="up-keyboard__button__inner-wrapper__inner"
					:hover-stay-time="200"
					@tap="carInputClick(i, j)"
					hover-class="up-hover-class"
				>
					<text class="up-keyboard__button__inner-wrapper__inner__text">{{ item }}</text>
				</view>
			</view>
			<view
				v-if="i === 3"
				@touchstart="backspaceClick"
				@touchend="clearTimer"
				class="up-keyboard__button__inner-wrapper"
			>
				<view
					class="up-keyboard__button__inner-wrapper__right"
					hover-class="up-hover-class"
					:hover-stay-time="200"
				>
					<up-icon
						size="28"
						name="backspace"
						color="#303133"
					></up-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { props } from './props.js';
	import { mpMixin } from '../../libs/mixin/mpMixin.js';
	import { mixin } from '../../libs/mixin/mixin.js';
	import { randomArray, sleep } from '../../libs/function/index.js';
	/**
	 * keyboard 键盘组件
	 * @description 此为uView自定义的键盘面板，内含了数字键盘，车牌号键，身份证号键盘3种模式，都有可以打乱按键顺序的选项。
	 * @tutorial https://uview-plus.jiangruyi.com/components/keyboard.html
	 * @property {Boolean} random 是否打乱键盘的顺序
	 * @event {Function} change 点击键盘触发
	 * @event {Function} backspace 点击退格键触发
	 * @example <up-keyboard ref="uKeyboard" mode="car" v-model="show"></up-keyboard>
	 */
	export default {
		name: "up-keyboard",
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				// 车牌输入时，abc=true为输入车牌号码，bac=false为输入省份中文简称
				abc: false
			};
		},
		computed: {
			areaList() {
				let data = [
					'京',
					'沪',
					'粤',
					'津',
					'冀',
					'豫',
					'云',
					'辽',
					'黑',
					'湘',
					'皖',
					'鲁',
					'苏',
					'浙',
					'赣',
					'鄂',
					'桂',
					'甘',
					'晋',
					'陕',
					'蒙',
					'吉',
					'闽',
					'贵',
					'渝',
					'川',
					'青',
					'琼',
					'宁',
					'挂',
					'藏',
					'港',
					'澳',
					'新',
					'使',
					'学'
				];
				let tmp = [];
				// 打乱顺序
				if (this.random) data = randomArray(data);
				// 切割成二维数组
				tmp[0] = data.slice(0, 10);
				tmp[1] = data.slice(10, 20);
				tmp[2] = data.slice(20, 30);
				tmp[3] = data.slice(30, 36);
				return tmp;
			},
			engKeyBoardList() {
				let data = [
					1,
					2,
					3,
					4,
					5,
					6,
					7,
					8,
					9,
					0,
					'Q',
					'W',
					'E',
					'R',
					'T',
					'Y',
					'U',
					'I',
					'O',
					'P',
					'A',
					'S',
					'D',
					'F',
					'G',
					'H',
					'J',
					'K',
					'L',
					'Z',
					'X',
					'C',
					'V',
					'B',
					'N',
					'M'
				];
				let tmp = [];
				if (this.random) data = randomArray(data);
				tmp[0] = data.slice(0, 10);
				tmp[1] = data.slice(10, 20);
				tmp[2] = data.slice(20, 30);
				tmp[3] = data.slice(30, 36);
				return tmp;
			}
		},
		emits: ["change", "backspace"],
		methods: {
			// 点击键盘按钮
			carInputClick(i, j) {
				let value = '';
				// 不同模式，获取不同数组的值
				if (this.abc) value = this.engKeyBoardList[i][j];
				else value = this.areaList[i][j];
				// 如果允许自动切换，则将中文状态切换为英文
				if (!this.abc && this.autoChange) sleep(200).then(() => this.abc = true)
				this.$emit('change', value);
			},
			// 修改汽车牌键盘的输入模式，中文|英文
			changeCarInputMode() {
				this.abc = !this.abc;
			},
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
		}
	};
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";
	$up-car-keyboard-background-color: rgb(224, 228, 230) !default;
	$up-car-keyboard-padding:6px 0 6px !default;
	$up-car-keyboard-button-inner-width:64rpx !default;
	$up-car-keyboard-button-inner-background-color:#FFFFFF !default;
	$up-car-keyboard-button-height:80rpx !default;
	$up-car-keyboard-button-inner-box-shadow:0 1px 0px #999992 !default;
	$up-car-keyboard-button-border-radius:4px !default;
	$up-car-keyboard-button-inner-margin:8rpx 5rpx !default;
	$up-car-keyboard-button-text-font-size:16px !default;
	$up-car-keyboard-button-text-color:$up-main-color !default;
	$up-car-keyboard-center-inner-margin: 0 4rpx !default;
	$up-car-keyboard-special-button-width:134rpx !default;
	$up-car-keyboard-lang-font-size:16px !default;
	$up-car-keyboard-lang-color:$up-main-color !default;
	$up-car-keyboard-active-color:$up-primary !default;
	$up-car-keyboard-line-font-size:15px !default;
	$up-car-keyboard-line-color:$up-main-color !default;
	$up-car-keyboard-line-margin:0 1px !default;
	$up-car-keyboard-up-hover-class-background-color:#BBBCC6 !default;

	.up-keyboard {
		@include flex(column);
		justify-content: space-around;
		background-color: $up-car-keyboard-background-color;
		align-items: stretch;
		padding: $up-car-keyboard-padding;

		&__button {
			@include flex;
			justify-content: center;
			flex: 1;
			/* #ifndef APP-NVUE */
			/* #endif */

			&__inner-wrapper {
				box-shadow: $up-car-keyboard-button-inner-box-shadow;
				margin: $up-car-keyboard-button-inner-margin;
				border-radius: $up-car-keyboard-button-border-radius;

				&__inner {
					@include flex;
					justify-content: center;
					align-items: center;
					width: $up-car-keyboard-button-inner-width;
					background-color: $up-car-keyboard-button-inner-background-color;
					height: $up-car-keyboard-button-height;
					border-radius: $up-car-keyboard-button-border-radius;

					&__text {
						font-size: $up-car-keyboard-button-text-font-size;
						color: $up-car-keyboard-button-text-color;
					}
				}

				&__left,
				&__right {
					border-radius: $up-car-keyboard-button-border-radius;
					width: $up-car-keyboard-special-button-width;
					height: $up-car-keyboard-button-height;
					background-color: $up-car-keyboard-up-hover-class-background-color;
					@include flex;
					justify-content: center;
					align-items: center;
					box-shadow: $up-car-keyboard-button-inner-box-shadow;
				}

				&__left {
					&__line {
						font-size: $up-car-keyboard-line-font-size;
						color: $up-car-keyboard-line-color;
						margin: $up-car-keyboard-line-margin;
					}

					&__lang {
						font-size: $up-car-keyboard-lang-font-size;
						color: $up-car-keyboard-lang-color;

						&--active {
							color: $up-car-keyboard-active-color;
						}
					}
				}
			}
		}
	}

	.up-hover-class {
		background-color: $up-car-keyboard-up-hover-class-background-color;
	}
</style>
