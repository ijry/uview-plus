<template>
	<view class="u-page">
		<view class="u-demo-block">
			<text class="u-demo-block__title">右侧弹出</text>
			<view class="u-demo-block__content">
				<up-popover
					color="#333"
					bgColor="#e3e4e6"
					popupBgColor="#f7f7f7"
					direction="right"
				>
					<template #trigger>
						<up-button style="width: 100px" :stop="false" type="primary">点击</up-button>
					</template>
					<template #content>
						<view style="padding: 6px 12px;">自定义内容</view>
					</template>
				</up-popover>
			</view>
		</view>
		<view class="u-demo-block">
			<text class="u-demo-block__title">左侧弹出及强制定位</text>
			<view class="u-demo-block__content u-flex-x u-flex-end">
				<up-popover
					color="#fff"
					bgColor="#333"
					popupBgColor="#333"
					:forcePosition="{right: '108px', top: '0px'}"
					direction="left"
				>
					<template #trigger>
						<up-button style="width: 100px" :stop="false" type="primary">点击</up-button>
					</template>
					<template #content>
						<view style="padding: 6px 12px;">自定义内容</view>
					</template>
				</up-popover>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				text5: '长按文本，显示背景色',
			}
		},
		onLoad() {
			
		},
		methods: {
			click(index) {
				console.log('index', index);
			}
		}
	}
</script>

<style lang="scss">
	.u-page {
		
	}
	
	.u-demo-block__content {
		padding-top: 10px;
	}
</style>
