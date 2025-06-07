<template>
	<picker-view-column>
		<view class="u-picker-column">

		</view>
	</picker-view-column>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	/**
	 * PickerColumn 
	 * @description 
	 * @tutorial url
	 * @property {String}
	 * @event {Function}
	 * @example
	 */
	export default {
		name: 'u-picker-column',
		mixins: [mpMixin, mixin, props],
	}
</script>

<style lang="scss" scoped>
</style>
