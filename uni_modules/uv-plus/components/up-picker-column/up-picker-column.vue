<template>
	<picker-view-column>
		<view class="up-picker-column">
		</view>
	</picker-view-column>
</template>

<script>
	import { props } from './props.js';
	import { mpMixin } from '../../libs/mixin/mpMixin.js';
	import { mixin } from '../../libs/mixin/mixin.js';
	/**
	 * PickerColumn 
	 * @description 
	 * @tutorial url
	 * @property {String}
	 * @event {Function}
	 * @example
	 */
	export default {
		name: 'up-picker-column',
		mixins: [mpMixin, mixin, props],
	}
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";
</style>
