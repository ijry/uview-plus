<template>
	<view class="u-page">
		<view class="u-page__item">
			<text class="u-page__item__title">基础功能</text>
			<view class="p-4 bg-white">
				<up-box height="160px" gap="12px">
					<template #left>
						左
					</template>
					<template #rightTop>
						右上
					</template>
					<template #rightBottom>
						右下
					</template>
				</up-box>
			</view>
		</view>
		<view class="u-page__item">
			<text class="u-page__item__title">自定义插槽</text>
			<up-box
				height="180px" gap="12px"
			>
				<template #left>
					<up-icon
						name="arrow-left"
						size="19"
					></up-icon>
				</template>
				<template #rightTop>
					<up-icon
						name="arrow-left"
						size="19"
					></up-icon>
				</template>
				<template #rightBottom>
					<up-icon
						name="arrow-left"
						size="19"
					></up-icon>
				</template>
			</up-box>
		</view>
		<up-gap height="50"></up-gap>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			navigateBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			leftClick() {
				console.log('leftClick');
			}
		}
	}
</script>

<style lang="scss">
	/* #ifndef APP-NVUE */
	page {
		background-color: $u-bg-color;
	}
	/* #endif */
	
	.u-page {
		padding: 0;
		flex: 1;
		background-color: $u-bg-color;

		&__item {

			&__title {
				color: $u-tips-color;
				background-color: $u-bg-color;
				padding: 15px;
				font-size: 15px;

				&__slot-title {
					color: $u-primary;
					font-size: 14px;
				}
			}
		}
	}

	.u-nav-slot {
		@include flex;
		align-items: center;
		justify-content: space-between;
		border-width: 0.5px;
		border-radius: 100px;
		border-color: $u-border-color;
		padding: 3px 7px;
		opacity: 0.8;
	}
</style>
