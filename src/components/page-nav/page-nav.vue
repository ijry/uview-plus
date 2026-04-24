<template>
	<view class="nav-wrap">
		<view class="nav-title">
			<u--image :showLoading="true" src="https://uview-plus.jiangruyi.com/h5/static/uview/common/logo.png" width="70px"
				height="70px" />
			<view class="nav-info">
				<view class="nav-info__title" @tap="jumpToWx">
					<text class="nav-info__title__text" :style="titleStyle">uview-plus3
					<!-- #ifdef APP-HARMONY -->
					鸿蒙
					<!-- #endif -->
					</text>
					<!-- #ifdef MP-WEIXIN -->
					<!-- uni-app不支持text内部的text组件的tap事件，所以放到外部响应tap -->
					<text class="nav-info__title__jump" :style="jumpStyle">查看演示</text>
					<!-- #endif -->
				</view>
				<text class="nav-slogan" :style="sloganStyle">多平台快速开发的UI框架</text>
			</view>
		</view>
		<text class="nav-desc" :style="descStyle">{{desc}}</text>
	</view>
</template>

<script>
	import { getThemeIsDark, getThemeVar, syncThemeRuntimeFromStorage } from '@/uni_modules/uview-plus/libs/theme/runtime.js'

	export default {
		props: {
			desc: String,
			title: String,
		},
		data() {
			return {
				// version: uni.$u.config.v,
				version: '3.x',
				themeVersion: 0,
				themeChangeHandler: null
			}
		},
		created() {
			this.syncTheme()
			if (typeof uni !== 'undefined' && typeof uni.$on === 'function') {
				this.themeChangeHandler = (payload = {}) => {
					this.syncTheme(payload)
				}
				uni.$on('uThemeChange', this.themeChangeHandler)
			}
		},
		beforeUnmount() {
			if (this.themeChangeHandler && typeof uni !== 'undefined' && typeof uni.$off === 'function') {
				uni.$off('uThemeChange', this.themeChangeHandler)
			}
			this.themeChangeHandler = null
		},
		computed: {
			themeColors() {
				this.themeVersion
				const runtimeU = typeof uni !== 'undefined' ? uni.$u : null
				const isDark = getThemeIsDark(runtimeU)
				return {
					mainColor: getThemeVar('--up-main-color', isDark ? '#f5f5f5' : '#303133', runtimeU),
					tipsColor: getThemeVar('--up-tips-color', isDark ? '#9ca3af' : '#909193', runtimeU),
					contentColor: getThemeVar('--up-content-color', isDark ? '#d1d5db' : '#606266', runtimeU),
					primary: getThemeVar('--up-primary', '#3c9cff', runtimeU)
				}
			},
			titleStyle() {
				return {
					color: this.themeColors.mainColor
				}
			},
			jumpStyle() {
				return {
					color: this.themeColors.primary
				}
			},
			sloganStyle() {
				return {
					color: this.themeColors.tipsColor
				}
			},
			descStyle() {
				return {
					color: this.themeColors.contentColor
				}
			}
		},
		methods: {
			syncTheme(payload = {}) {
				syncThemeRuntimeFromStorage(typeof uni !== 'undefined' ? uni.$u : null)
				const runtimeVersion = Number((uni.$u && uni.$u.theme && uni.$u.theme.version) || 0)
				this.themeVersion = Number(payload.version || runtimeVersion || this.themeVersion + 1)
			},
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
