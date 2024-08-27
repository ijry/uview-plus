<template>
	<view class="nav-wrap">
		<view class="nav-title">
			<!-- <up-image :showLoading="true" src="./static/uview/common/logo.png" width="70px"
				height="70px" /> -->
			<view class="nav-info">
				<view class="nav-info__title" @tap="jumpToWx">
					<text class="nav-info__title__text">uview-plus 4</text>
					<!-- #ifdef MP-WEIXIN -->
					<!-- uni-app不支持text内部的text组件的tap事件，所以放到外部响应tap -->
					<text class="nav-info__title__jump">查看演示</text>
					<!-- #endif -->
				</view>
				<text class="nav-slogan">多平台快速开发的UI框架</text>
			</view>
		</view>
		<text class="nav-desc">{{desc}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			desc: String,
			title: String,
		},
		data() {
			return {
				version: '4.0.0'
			}
		},
		methods: {
			jumpToWx() {
				// #ifdef MP-WEIXIN
				// uni.navigateToMiniProgram({
				// 	appId: ''
				// })
				// #endif
			}
		},
	}
</script>

<style lang="scss" scoped>
	.nav-wrap {
		padding: 15px;
		position: relative;
	}

	.lang {
		position: absolute;
		top: 15px;
		right: 15px;
	}

	.nav-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.nav-info {
		margin-left: 15px;
		
		&__title {
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			align-items: center;
			
			&__text {
				/* #ifndef APP-NVUE */
				display: flex;
				/* #endif */
				color: $u-main-color;
				font-size: 25px;
				font-weight: bold;
				text-align: left;
			}
			
			&__jump {
				font-size: 12px;
				color: $u-primary;
				font-weight: normal;
				margin-left: 20px;
			}
		}
	}

	.logo {
		width: 70px;
		height: 70px;
		/* #ifndef APP-NVUE */
		height: auto;
		/* #endif */
	}

	.nav-slogan {
		color: $u-tips-color;
		font-size: 14px;
	}

	.nav-desc {
		margin-top: 10px;
		font-size: 14px;
		color: $u-content-color;
		line-height: 20px;
	}
</style>
