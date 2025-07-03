<template>
	<view class="u-td" :style="[tdStyle]">
		<slot></slot>
	</view>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	import { addUnit, $parent } from '../../libs/function/index';
	/** 
	 * Td 表格中的单元格
	 * @description 
	 * @tutorial url
	 * @property {String | Number} 
	 * @event {Function}
	 * @example
	 */
	export default {
		name: 'u-td',
		mixins: [mpMixin, mixin, props],
		props: {
			// 宽度，百分比或者具体带单位的值，如30%， 200rpx等，一般使用百分比
			width: {
				type: [String],
				default: 'auto'
			},
			textAlign: {
				type: String,
				default: ''
			},
			fontSize: {
				type: String,
				default: ''
			},
			borderColor: {
				type: String,
				default: ''
			},
			color: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				tdStyle: {
					
				}
			}
		},
		created() {
			this.parent = false;
		},
		mounted() {
			this.parent = $parent.call(this, 'u-table');
			if (this.parent) {
				// 将父组件的相关参数，合并到本组件
				let style = {};
				if (this.width != "auto") style.flex = `0 0 ${this.width}`;
				style.textAlign = this.parent.align;
				style.fontSize = addUnit(this.parent.fontSize);
				style.padding = this.parent.padding;
				style.borderBottom = `solid 1px ${this.parent.borderColor}`;
				style.borderRight = `solid 1px ${this.parent.borderColor}`;
				style.color = this.parent.color;
				if (this.textAlign != '') {
					style.textAlign = this.textAlign;
				}
				if (this.fontSize != '') {
					style.fontSize = this.fontSize;
				}
				if (this.borderColor != '') {
					style.borderColor = this.borderColor;
				}
				if (this.color != '') {
					style.color = this.color;
				}
				this.tdStyle = style;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-td {
		@include flex;
		flex-direction: column;
		flex: 1;
		justify-content: center;
		font-size: 14px;
		color: $u-content-color;
		align-self: stretch;
		box-sizing: border-box;
		height: 100%;
	}
</style>
