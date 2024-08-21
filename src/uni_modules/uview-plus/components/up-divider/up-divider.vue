<template>
	<view
	    class="up-divider"
	    :style="[addStyle(customStyle)]"
		@tap="click"
	>
		<up-line
		    :color="lineColor"
		    :customStyle="leftLineStyle"
		    :hairline="hairline"
			:dashed="dashed"
		></up-line>
		<text
		    v-if="dot"
		    class="up-divider__dot"
		>●</text>
		<text
		    v-else-if="text"
		    class="up-divider__text"
		    :style="[textStyle]"
		>{{text}}</text>
		<up-line
		    :color="lineColor"
		    :customStyle="rightLineStyle"
		    :hairline="hairline"
			:dashed="dashed"
		></up-line>
	</view>
</template>

<script>
	import { props } from './props.js';
	import { mpMixin } from '../../libs/mixin/mpMixin.js';
	import { mixin } from '../../libs/mixin/mixin.js';
	import { addStyle, addUnit } from '../../libs/function/index.js';
	/**
	 * divider 分割线
	 * @description 区隔内容的分割线，一般用于页面底部"没有更多"的提示。
	 * @tutorial https://ijry.github.io/uview-plus/components/divider.html
	 * @property {Boolean}			dashed			是否虚线 （默认 false ）
	 * @property {Boolean}			hairline		是否细线 （默认  true ）
	 * @property {Boolean}			dot				是否以点替代文字，优先于text字段起作用 （默认 false ）
	 * @property {String}			textPosition	内容文本的位置，left-左边，center-中间，right-右边 （默认 'center' ）
	 * @property {String | Number}	text			文本内容
	 * @property {String | Number}	textSize		文本大小 （默认 14）
	 * @property {String}			textColor		文本颜色 （默认 '#909399' ）
	 * @property {String}			lineColor		线条颜色 （默认 '#dcdfe6' ）
	 * @property {Object}			customStyle		定义需要用到的外部样式
	 *
	 * @event {Function}	click	divider组件被点击时触发
	 * @example <up-divider :color="color">锦瑟无端五十弦</up-divider>
	 */
	export default {
		name:'up-divider',
		mixins: [mpMixin, mixin, props],
		computed: {
			textStyle() {
				const style = {}
				style.fontSize = addUnit(this.textSize)
				style.color = this.textColor
				return style
			},
			// 左边线条的的样式
			leftLineStyle() {
				const style = {}
				// 如果是在左边，设置左边的宽度为固定值
				if (this.textPosition === 'left') {
					style.width = '80rpx'
				} else {
					style.flex = 1
				}
				return style
			},
			// 右边线条的的样式
			rightLineStyle() {
				const style = {}
				// 如果是在右边，设置右边的宽度为固定值
				if (this.textPosition === 'right') {
					style.width = '80rpx'
				} else {
					style.flex = 1
				}
				return style
			}
		},
		emits: ["click"],
		methods: {
			addStyle,
			// divider组件被点击时触发
			click() {
				this.$emit('click');
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../libs/css/components.scss';
	$up-divider-margin:15px 0 !default;
	$up-divider-text-margin:0 15px !default;
	$up-divider-dot-font-size:12px !default;
	$up-divider-dot-margin:0 12px !default;
	$up-divider-dot-color: #c0c4cc !default;

	.up-divider {
		@include flex;
		flex-direction: row;
		align-items: center;
		margin: $up-divider-margin;

		&__text {
			margin: $up-divider-text-margin;
		}

		&__dot {
			font-size: $up-divider-dot-font-size;
			margin: $up-divider-dot-margin;
			color: $up-divider-dot-color;
		}
	}
</style>
