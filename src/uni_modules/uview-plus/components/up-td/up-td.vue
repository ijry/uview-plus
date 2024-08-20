<template>
	<view class="up-td">
		
	</view>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	/** 
	 * Td 表格中的单元格
	 * @description 
	 * @tutorial url
	 * @property {String | Number} 
	 * @event {Function}
	 * @example
	 */
	export default {
		name: 'up-td',
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
