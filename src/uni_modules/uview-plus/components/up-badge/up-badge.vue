<template>
	<text
		v-if="show && ((Number(value) === 0 ? showZero : true) || isDot)"
		:class="[isDot ? 'up-badge--dot' : 'up-badge--not-dot', inverted && 'up-badge--inverted', shape === 'horn' && 'up-badge--horn', `up-badge--${type}${inverted ? '--inverted' : ''}`]"
		:style="[addStyle(customStyle), badgeStyle]"
		class="up-badge"
	>{{ isDot ? '' :showValue }}</text>
</template>

<script>
	import { props } from './props.js';
	import { mpMixin } from '../../libs/mixin/mpMixin.js';
	import { mixin } from '../../libs/mixin/mixin.js';
	import { addStyle, addUnit } from '../../libs/function/index.js';
	/**
	 * badge 徽标数
	 * @description 该组件一般用于图标右上角显示未读的消息数量，提示用户点击，有圆点和圆包含文字两种形式。
	 * @tutorial https://uview-plus.jiangruyi.com/components/badge.html
	 * 
	 * @property {Boolean} 			isDot 		是否显示圆点 （默认 false ）
	 * @property {String | Number} 	value 		显示的内容
	 * @property {Boolean} 			show 		是否显示 （默认 true ）
	 * @property {String | Number} 	max 		最大值，超过最大值会显示 '{max}+'  （默认999）
	 * @property {String} 			type 		主题类型，error|warning|success|primary （默认 'error' ）
	 * @property {Boolean} 			showZero	当数值为 0 时，是否展示 Badge （默认 false ）
	 * @property {String} 			bgColor 	背景颜色，优先级比type高，如设置，type参数会失效
	 * @property {String} 			color 		字体颜色 （默认 '#ffffff' ）
	 * @property {String} 			shape 		徽标形状，circle-四角均为圆角，horn-左下角为直角 （默认 'circle' ）
	 * @property {String} 			numberType	设置数字的显示方式，overflow|ellipsis|limit  （默认 'overflow' ）
	 * @property {Array}} 			offset		设置badge的位置偏移，格式为 [x, y]，也即设置的为top和right的值，absolute为true时有效
	 * @property {Boolean} 			inverted	是否反转背景和字体颜色（默认 false ）
	 * @property {Boolean} 			absolute	是否绝对定位（默认 false ）
	 * @property {Object}			customStyle	定义需要用到的外部样式
	 * @example <up-badge :type="type" :count="count"></up-badge>
	 */
	export default {
		name: 'up-badge',
		mixins: [mpMixin, props, mixin],
		computed: {
			// 是否将badge中心与父组件右上角重合
			boxStyle() {
				let style = {};
				return style;
			},
			// 整个组件的样式
			badgeStyle() {
				const style = {}
				if(this.color) {
					style.color = this.color
				}
				if (this.bgColor && !this.inverted) {
					style.backgroundColor = this.bgColor
				}
				if (this.absolute) {
					style.position = 'absolute'
					// 如果有设置offset参数
					if(this.offset.length) {
						// top和right分为为offset的第一个和第二个值，如果没有第二个值，则right等于top
						const top = this.offset[0]
						const right = this.offset[1] || top
						style.top = addUnit(top)
						style.right = addUnit(right)
					}
				}
				return style
			},
			showValue() {
				switch (this.numberType) {
					case "overflow":
						return Number(this.value) > Number(this.max) ? this.max + "+" : this.value
						break;
					case "ellipsis":
						return Number(this.value) > Number(this.max) ? "..." : this.value
						break;
					case "limit":
						return Number(this.value) > 999 ? Number(this.value) >= 9999 ?
							Math.floor(this.value / 1e4 * 100) / 100 + "w" : Math.floor(this.value /
								1e3 * 100) / 100 + "k" : this.value
						break;
					default:
						return Number(this.value)
				}
			},
		},
		methods: {
			addStyle
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";

	$up-badge-primary: $up-primary !default;
	$up-badge-error: $up-error !default;
	$up-badge-success: $up-success !default;
	$up-badge-info: $up-info !default;
	$up-badge-warning: $up-warning !default;
	$up-badge-dot-radius: 100px !default;
	$up-badge-dot-size: 8px !default;
	$up-badge-dot-right: 4px !default;
	$up-badge-dot-top: 0 !default;
	$up-badge-text-font-size: 11px !default;
	$up-badge-text-right: 10px !default;
	$up-badge-text-padding: 2px 5px !default;
	$up-badge-text-align: center !default;
	$up-badge-text-color: #FFFFFF !default;

	.up-badge {
		border-top-right-radius: $up-badge-dot-radius;
		border-top-left-radius: $up-badge-dot-radius;
		border-bottom-left-radius: $up-badge-dot-radius;
		border-bottom-right-radius: $up-badge-dot-radius;
		@include flex;
		line-height: $up-badge-text-font-size;
		text-align: $up-badge-text-align;
		font-size: $up-badge-text-font-size;
		color: $up-badge-text-color;

		&--dot {
			height: $up-badge-dot-size;
			width: $up-badge-dot-size;
		}
		
		&--inverted {
			font-size: 13px;
		}
		
		&--not-dot {
			padding: $up-badge-text-padding;
		}

		&--horn {
			border-bottom-left-radius: 0;
		}

		&--primary {
			background-color: $up-badge-primary;
		}
		
		&--primary--inverted {
			color: $up-badge-primary;
		}

		&--error {
			background-color: $up-badge-error;
		}
		
		&--error--inverted {
			color: $up-badge-error;
		}

		&--success {
			background-color: $up-badge-success;
		}
		
		&--success--inverted {
			color: $up-badge-success;
		}

		&--info {
			background-color: $up-badge-info;
		}
		
		&--info--inverted {
			color: $up-badge-info;
		}

		&--warning {
			background-color: $up-badge-warning;
		}
		
		&--warning--inverted {
			color: $up-badge-warning;
		}
	}
</style>
