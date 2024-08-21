<template>
	<view class="up-gap" :style="[gapStyle]"></view>
</template>

<script>
	import { propsGap } from './props.js';
	import { mpMixin } from '../../libs/mixin/mpMixin.js';
	import { mixin } from '../../libs/mixin/mixin.js';
	import { addStyle, addUnit, deepMerge } from '../../libs/function/index.js';
	/**
	 * gap 间隔槽
	 * @description 该组件一般用于内容块之间的用一个灰色块隔开的场景，方便用户风格统一，减少工作量
	 * @tutorial https://ijry.github.io/uview-plus/components/gap.html
	 * @property {String}			bgColor			背景颜色 （默认 'transparent' ）
	 * @property {String | Number}	height			分割槽高度，单位px （默认 20 ）
	 * @property {String | Number}	marginTop		与前一个组件的距离，单位px（ 默认 0 ）
	 * @property {String | Number}	marginBottom	与后一个组件的距离，单位px （默认 0 ）
	 * @property {Object}			customStyle		定义需要用到的外部样式
	 * 
	 * @example <up-gap height="80" bg-color="#bbb"></up-gap>
	 */
	export default {
		name: "up-gap",
		mixins: [mpMixin, mixin, propsGap],
		computed: {
			gapStyle() {
				const style = {
					backgroundColor: this.bgColor,
					height: addUnit(this.height),
					marginTop: addUnit(this.marginTop),
					marginBottom: addUnit(this.marginBottom),
				}
				return deepMerge(style, addStyle(this.customStyle))
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";
</style>
