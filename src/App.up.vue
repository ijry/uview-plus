<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const upRootMessage = ref('UpRoot ready')
const upRootStyle = ref({})

const getThemeVars = () => {
	if (typeof uni === 'undefined' || !uni.$u || typeof uni.$u.getThemeVars !== 'function') return {}
	return uni.$u.getThemeVars() || {}
}

const getThemeBgColor = () => {
	if (typeof uni === 'undefined' || !uni.$u || !uni.$u.color) return '#f3f4f6'
	return uni.$u.color.bgColor || '#f3f4f6'
}

const buildRootStyle = () => {
	// #ifdef APP-NVUE
	return {
		minHeight: '100vh',
		backgroundColor: getThemeBgColor()
	}
	// #endif
	// #ifndef APP-NVUE
	const fallbackBg = getThemeBgColor()
	return {
		...getThemeVars(),
		minHeight: '100vh',
		backgroundColor: `var(--up-page-bg-color, var(--up-bg-color, ${fallbackBg}))`
	}
	// #endif
}

const refreshRootStyle = () => {
	upRootStyle.value = buildRootStyle()
}

const showGlobalMessage = (message = 'UpRoot bridge ok') => {
	if (typeof uni !== 'undefined' && uni.$u && typeof uni.$u.rootToast === 'function') {
		uni.$u.rootToast({ message })
		return
	}
	if (typeof uni !== 'undefined' && typeof uni.showToast === 'function') {
		uni.showToast({ title: message, icon: 'none' })
	}
}

defineExpose({
	upRootMessage,
	showGlobalMessage
})

onMounted(() => {
	refreshRootStyle()
	if (typeof uni !== 'undefined' && typeof uni.$on === 'function') {
		uni.$on('uThemeChange', refreshRootStyle)
	}
})

onBeforeUnmount(() => {
	if (typeof uni !== 'undefined' && typeof uni.$off === 'function') {
		uni.$off('uThemeChange', refreshRootStyle)
	}
})
</script>

<template>
	<view class="up-root-wrap" :style="upRootStyle">
		<UpRootView />
	</view>
</template>
