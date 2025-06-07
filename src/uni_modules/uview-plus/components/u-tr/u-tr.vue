<template>
	<view class="u-tr">
		<slot></slot>
	</view>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	/**
	 * Tr  
	 * @description 
	 * @tutorial url
	 * @property {String}
	 * @event {Function}
	 * @example
	 */
	export default {
		name: 'u-tr',
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-tr {
		@include flex;
	}
</style>
