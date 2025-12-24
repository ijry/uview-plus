<template>
	<view class="u-th" :style="[thStyle]">
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
		name: 'u-th',
		mixins: [mpMixin, mixin, props],
		props: {
			// 宽度，百分比或者具体带单位的值，如30%， 200rpx等，一般使用百分比
			width: {
				type: [String],
				default: ''
			}
		},
		data() {
			return {
				thStyle: {}
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
				if (this.width) style.flex = `0 0 ${this.width}`;
				style.textAlign = this.parent.align;
				style.padding = this.parent.padding;
				style.borderBottom = `solid 1px ${this.parent.borderColor}`;
				style.borderRight = `solid 1px ${this.parent.borderColor}`;
				Object.assign(style, this.parent.thStyle);
				this.thStyle = style;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-th {
		@include flex;
		flex-direction: column;
		flex: 1;
		justify-content: center;
		font-size: 28rpx;
		color: $u-main-color;
		font-weight: bold;
		background-color: rgb(245, 246, 248);
	}
</style>
