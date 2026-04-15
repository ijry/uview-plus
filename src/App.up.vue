<script setup>
import { ref } from 'vue'

const upRootMessage = ref('UpRoot ready')

const showGlobalMessage = (message = 'UpRoot bridge ok') => {
	if (typeof uni !== 'undefined' && typeof uni.showToast === 'function') {
		uni.showToast({
			title: message,
			icon: 'none'
		})
	}
}

defineExpose({
	upRootMessage,
	showGlobalMessage
})
</script>

<template>
	<view class="up-root-wrap">
		<UpRootView />
	</view>
</template>
