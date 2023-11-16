<template>
	<view
		class="u-slider"
		:style="[$u.addStyle(customStyle)]"
	>
		<slider
			:min="min"
			:max="max"
			:step="step"
			:value="modelValue"
			:activeColor="activeColor"
			:backgroundColor="inactiveColor"
			:blockSize="$u.getPx(blockSize)"
			:blockColor="blockColor"
			:showValue="showValue"
			:disabled="disabled"
			@changing="changingHandler"
			@change="changeHandler"
		></slider>
	</view>
</template>

<script>
	import props from './props.js';
	import mpMixin from '../../libs/mixin/mpMixin.js';
	import mixin from '../../libs/mixin/mixin.js';
	export default {
		name: 'u--slider',
		mixins: [mpMixin, mixin, props],
		emits: ["changing", "change", "update:modelValue"],
		methods: {
			// 拖动过程中触发
			changingHandler(e) {
				const {
					value
				} = e.detail
				// 更新v-model的值
				// #ifdef VUE3
                this.$emit("update:modelValue", value);
                // #endif
                // #ifdef VUE2
                this.$emit("input", value);
                // #endif
				// 触发事件
				this.$emit('changing', value)
			},
			// 滑动结束时触发
			changeHandler(e) {
				const {
					value
				} = e.detail
				// 更新v-model的值
				// #ifdef VUE3
                this.$emit("update:modelValue", value);
                // #endif
                // #ifdef VUE2
                this.$emit("input", value);
                // #endif
				// 触发事件
				this.$emit('change', value)
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";
</style>
