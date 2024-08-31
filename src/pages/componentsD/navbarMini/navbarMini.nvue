<template>
	<view class="u-page">
		<up-navbar-mini
			safeAreaInsetTop
			fixed
			:autoBack="true"
		>
		</up-navbar-mini>
		<view class="u-page__item">
			<text class="u-page__item__title">基础功能</text>
			<up-navbar-mini
				homeUrl="/pages/index/index"
				:safeAreaInsetTop="true"
				:fixed="true"
				@leftClick="leftClick"
			>
			</up-navbar-mini>
		</view>
		<view class="u-page__item">
			<text class="u-page__item__title">自定义插槽</text>
			<up-navbar-mini
				:fixed="false"
				:safeAreaInsetTop="false"
			>
				<template #left>
					<up-icon
						name="arrow-left"
						size="19"
					></up-icon>
				</template>
			</up-navbar-mini>
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
