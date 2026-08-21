<template>
	<view class="ios-demo">
		<up-navbar
			mode="ios"
			title="设置"
			:scrollTop="scrollTop"
			:autoBack="true"
			rightIcon="search"
			@rightClick="rightClick"
		></up-navbar>
		<view class="ios-demo__body">
			<text class="ios-demo__tip">向下滚动，观察大标题被压缩进导航栏，标题过渡为居中形态并出现磨砂背景。</text>
			<view
				class="ios-demo__cell"
				v-for="item in cells"
				:key="item"
			>
				<text class="ios-demo__cell__text">{{ item }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'

const scrollTop = ref(0)

const cells = ref(Array.from({ length: 30 }, (_, i) => `列表项 ${i + 1}`))

// ios 模式必须由页面把滚动距离喂给组件，
// 组件内部无法获取页面级的 onPageScroll。
onPageScroll((e) => {
	scrollTop.value = e.scrollTop
})

const rightClick = () => {
	console.log('rightClick')
}
</script>

<style lang="scss" scoped>
.ios-demo {
	min-height: 100vh;
	background-color: #f3f4f6;

	&__body {
		padding: 0 15px 40px 15px;
	}

	&__tip {
		display: block;
		font-size: 13px;
		color: #909193;
		padding: 12px 0 16px 0;
	}

	&__cell {
		background-color: #ffffff;
		border-radius: 8px;
		margin-bottom: 8px;
		padding: 14px 16px;

		&__text {
			font-size: 15px;
			color: #303133;
		}
	}
}
</style>
