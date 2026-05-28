<template>
	<view class="u-page">
		<view class="u-demo-block">
			<text class="u-demo-block__title">基础使用（首次进入显示）</text>
			<view class="u-demo-block__content">
				<up-button type="primary" text="重新打开引导" @click="openGuide"></up-button>
				<up-button text="重置首次标记" @click="resetGuide"></up-button>
			</view>
		</view>
		<up-guide
			ref="guideRef"
			v-model:show="show"
			storage-key="demo-up-guide-once"
			:list="list"
			@change="onChange"
			@skip="onSkip"
			@finish="onFinish"
		/>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(true)
const guideRef = ref(null)
const list = ref([
    {
        image: '/static/uview/common/logo.png',
        title: '欢迎使用 uview-plus',
        desc: '一套跨端可复用的高质量组件库。'
    },
    {
        image: '/static/uview/common/gray-logo.png',
        title: '引导页支持多页滑动',
        desc: '可配置跳过、下一步和立即体验。'
    },
    {
        image: '/static/uview/common/logo.jpg',
        title: '只显示一次',
        desc: '默认内置本地存储记忆能力。'
    }
])

function openGuide() {
    show.value = true
    guideRef.value?.open?.()
}

function resetGuide() {
    guideRef.value?.reset?.()
    uni.showToast({
        title: '已重置',
        icon: 'none'
    })
}

function onChange(payload) {
    console.log('guide change', payload)
}

function onSkip() {
    console.log('guide skip')
}

function onFinish() {
    console.log('guide finish')
}
</script>

<style lang="scss">
	.u-demo-block__content {
		display: flex;
		gap: 16rpx;
	}
</style>
