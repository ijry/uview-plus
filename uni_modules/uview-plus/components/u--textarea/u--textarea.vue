<template>
	<uvTextarea
		:value="value"
		:modelValue="modelValue"
		:placeholder="placeholder"
		:height="height"
		:confirmType="confirmType"
		:disabled="disabled"
		:count="count"
		:focus="focus"
		:autoHeight="autoHeight"
		:fixed="fixed"
		:cursorSpacing="cursorSpacing"
		:cursor="cursor"
		:showConfirmBar="showConfirmBar"
		:selectionStart="selectionStart"
		:selectionEnd="selectionEnd"
		:adjustPosition="adjustPosition"
		:disableDefaultPadding="disableDefaultPadding"
		:holdKeyboard="holdKeyboard"
		:maxlength="maxlength"
		:border="border"
		:customStyle="customStyle"
		:formatter="formatter"
		:ignoreCompositionEvent="ignoreCompositionEvent"
		@input="e => $emit('input', e)"
		@update:modelValue="e => $emit('update:modelValue', e)"
	></uvTextarea>
</template>

<script>
	/**
	 * 此组件存在的理由是，在nvue下，u--textarea被uni-app官方占用了，u-textarea在nvue中相当于textarea组件
	 * 所以在nvue下，取名为u--textarea，内部其实还是u-textarea.vue，只不过做一层中转
	 */
	import uvTextarea from '../u-textarea/u-textarea.vue';
	import props from '../u-textarea/props.js';
	import mpMixin from '../../libs/mixin/mpMixin.js';
	import mixin from '../../libs/mixin/mixin.js';
	export default {
		name: 'u--textarea',
		mixins: [mpMixin, props, mixin],
		components: {
			uvTextarea
		},
	}
</script>
