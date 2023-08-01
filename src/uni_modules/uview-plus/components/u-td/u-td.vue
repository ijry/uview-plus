<template>
	<view class="u-td">
		
	</view>
</template>

<script>
	import props from './props.js';
	import mpMixin from '../../libs/mixin/mpMixin.js';
	import mixin from '../../libs/mixin/mixin.js';
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
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";
	
</style>
