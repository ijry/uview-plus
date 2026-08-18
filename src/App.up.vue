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

const getThemePageBgColor = () => {
	const themeVars = getThemeVars()
	return themeVars['--up-page-bg-color'] || themeVars['--up-bg-color'] || getThemeBgColor()
}

const getNvuePageHeight = () => {
	// #ifdef APP-NVUE
	try {
		if (typeof uni !== 'undefined' && typeof uni.getWindowInfo === 'function') {
			return Number((uni.getWindowInfo() || {}).windowHeight || 0)
		}
		if (typeof uni !== 'undefined' && typeof uni.getSystemInfoSync === 'function') {
			return Number((uni.getSystemInfoSync() || {}).windowHeight || 0)
		}
	} catch (e) {}
	// #endif
	return 0
}

const buildRootStyle = () => {
	// #ifdef APP-NVUE
	return {
		...getThemeVars(),
		minHeight: `${getNvuePageHeight()}px`,
		width: '750rpx',
		backgroundColor: getThemePageBgColor()
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
	if (typeof uni !== 'undefined' && uni.$u && typeof uni.$u.applyNativeThemeUI === 'function') {
		uni.$u.applyNativeThemeUI()
	}
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
		<!-- #ifdef APP-VUE -->
		<text class="up-render-mode">VUE</text>
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<text class="up-render-mode">NVUE</text>
		<!-- #endif -->
		<UpRootView />
	</view>
</template>

<style lang="scss">
	/* #ifdef APP-VUE */
	.up-render-mode {
		position: fixed;
		top: 12px;
		right: 12px;
		z-index: 99999;
		padding: 4px 8px;
		border-radius: 4px;
		background-color: rgba(17, 24, 39, 0.78);
		color: #ffffff;
		font-size: 10px;
		line-height: 14px;
		pointer-events: none;
	}
	/* #endif */

	/* #ifdef APP-NVUE */
	.up-root-wrap {
		width: 750rpx;
	}

	.up-render-mode {
		position: fixed;
		top: 12px;
		right: 12px;
		z-index: 99999;
		padding: 4px 8px;
		border-radius: 4px;
		background-color: rgba(17, 24, 39, 0.78);
		color: #ffffff;
		font-size: 10px;
		line-height: 14px;
	}
	/* #endif */
</style>
