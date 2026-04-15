<template root="uniUpRoot">
	<view class="mine-page" :style="[themeVars]">
		<view class="mine-card" :style="[cardStyle]">
			<up-avatar
				size="72"
				src="https://uview-plus.jiangruyi.com/common/weixin_mini_qrcode.jpg"
			></up-avatar>
			<view class="mine-meta">
				<text class="mine-name">演示用户</text>
				<text class="mine-id">ID: 1008611</text>
			</view>
		</view>

		<up-cell-group title="主题模式">
			<up-cell
				title="跟随系统"
				isLink
				:clickable="true"
				:value="themePreference === 'system' ? '当前' : ''"
				@click="changeThemePreference('system')"
			></up-cell>
			<up-cell
				title="浅色模式"
				isLink
				:clickable="true"
				:value="themePreference === 'light' ? '当前' : ''"
				@click="changeThemePreference('light')"
			></up-cell>
			<up-cell
				title="深色模式"
				isLink
				:clickable="true"
				:value="themePreference === 'dark' ? '当前' : ''"
				@click="changeThemePreference('dark')"
			></up-cell>
		</up-cell-group>

		<view class="mine-status" :style="{ color: $u.color.tipsColor }">
			当前主题：{{ activeTheme === 'dark' ? '深色' : '浅色' }}（{{ preferenceText }}）
		</view>

		<up-cell-group title="Root 根组件">
			<up-cell
				title="测试 UpRootView 通信"
				isLink
				:clickable="true"
				@click="testUpRootBridge"
			></up-cell>
		</up-cell-group>

		<view class="mine-status" :style="{ color: $u.color.tipsColor }">
			{{ upRootStatus }}
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			themePreference: 'system',
			activeTheme: 'light',
			uThemeChangeHandler: null,
			upRootStatus: 'UpRoot 状态：未测试'
		}
	},
	computed: {
		themeVars() {
			if (this.$u.getThemeVars) {
				return this.$u.getThemeVars()
			}
			return {}
		},
		preferenceText() {
			if (this.themePreference === 'system') return '跟随系统'
			return this.themePreference === 'dark' ? '手动深色' : '手动浅色'
		},
		cardStyle() {
			return {
				backgroundColor: this.activeTheme === 'dark' ? '#1c1c1e' : '#ffffff',
				borderColor: this.$u.color.borderColor
			}
		}
	},
	onLoad() {
		this.uThemeChangeHandler = (payload = {}) => {
			this.activeTheme = payload.mode || this.activeTheme
			this.applyNativeThemeUI(this.activeTheme)
		}
		uni.$on('uThemeChange', this.uThemeChangeHandler)
	},
	onShow() {
		uni.setNavigationBarTitle({
			title: '我的'
		})
		this.syncThemeState()
		this.applyNativeThemeUI(this.activeTheme)
	},
	onUnload() {
		if (this.uThemeChangeHandler) {
			uni.$off('uThemeChange', this.uThemeChangeHandler)
			this.uThemeChangeHandler = null
		}
	},
	methods: {
		syncThemeState() {
			const getPreference = this.$u.getThemePreference
				? this.$u.getThemePreference()
				: (this.$u.theme && this.$u.theme.preference) || 'system'
			this.themePreference = getPreference
			this.activeTheme = (this.$u.theme && this.$u.theme.mode) || 'light'
		},
		changeThemePreference(mode) {
			this.themePreference = mode
			if (this.$u.setThemePreference) {
				this.$u.setThemePreference(mode)
			} else if (mode === 'system') {
				this.$u.setTheme(this.$u.getSystemTheme())
			} else {
				this.$u.setTheme(mode)
			}
			this.syncThemeState()
			if (mode === 'system') {
				this.activeTheme = this.$u.getSystemTheme ? this.$u.getSystemTheme() : this.activeTheme
			} else {
				this.activeTheme = mode
			}
			if (this.$u.theme && this.$u.theme.mode) {
				this.activeTheme = this.$u.theme.mode
			}
			this.applyNativeThemeUI(this.activeTheme)
		},
		applyNativeThemeUI(mode) {
			const isDark = mode === 'dark'
			const navBg = isDark ? '#1c1c1e' : '#ffffff'
			const tabBg = isDark ? '#111111' : '#ffffff'
			if (typeof uni.setNavigationBarColor === 'function') {
				uni.setNavigationBarColor({
					frontColor: isDark ? '#ffffff' : '#000000',
					backgroundColor: navBg,
					animation: {
						duration: 0,
						timingFunc: 'linear'
					}
				})
			}
			if (typeof uni.setTabBarStyle === 'function') {
				uni.setTabBarStyle({
					color: isDark ? '#8e8e93' : '#909399',
					selectedColor: isDark ? '#f2f2f7' : '#303133',
					backgroundColor: tabBg,
					borderStyle: isDark ? 'white' : 'black'
				})
			}
		},
		testUpRootBridge() {
			const rootRef = this.$refs && this.$refs.uniUpRoot
			if (rootRef && typeof rootRef.showGlobalMessage === 'function') {
				rootRef.showGlobalMessage('来自 Mine 页的 UpRoot 调用')
				const rootText = rootRef.upRootMessage || 'UpRoot ready'
				this.upRootStatus = `UpRoot 状态：通信成功（${rootText}）`
				return
			}
			this.upRootStatus = 'UpRoot 状态：通信失败（未获取到 uniUpRoot）'
		}
	}
}
</script>

<style lang="scss" scoped>
.mine-page {
	min-height: 100vh;
	padding: 16px;
	background-color: $u-bg-color;
}

.mine-card {
	display: flex;
	align-items: center;
	padding: 16px;
	border-radius: 12px;
	border-width: 1px;
	border-style: solid;
	margin-bottom: 16px;
}

.mine-meta {
	margin-left: 12px;
	display: flex;
	flex-direction: column;
}

.mine-name {
	font-size: 18px;
	font-weight: 600;
	color: $u-main-color;
}

.mine-id {
	margin-top: 6px;
	font-size: 13px;
	color: $u-tips-color;
}

.mine-status {
	margin-top: 14px;
	padding: 0 4px;
	font-size: 13px;
}
</style>
