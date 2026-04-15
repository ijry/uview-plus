<template>
	<view class="wrap" :style="[themeVars, { backgroundColor: pageBg }]">
		<page-nav :desc="desc" title="nav.template"></page-nav>
		<view class="list-wrap">
			<up-cell-group :title-bg-color="groupTitleBg"
				:title="getGroupTitle(item)"
				v-for="(item, index) in list" :key="index">
				<up-cell :titleStyle="{fontWeight: 500}"
					@click="openPage(item1.path)" :title="getFieldTitle(item1)"
				 	v-for="(item1, index1) in item.list" :key="index1">
					<template v-slot:icon>
						<image class="u-cell-icon"
							:src="getIcon(item1.icon)" mode="widthFix"></image>
					</template>
				</up-cell>
			</up-cell-group>
		</view>
		<up-gap height="70"></up-gap>
		<!-- <up-tabbar :list="vuex_tabbar" :mid-button="true"></up-tabbar> -->
	</view>
</template>

<script lang="ts">
	import list from "./template.config.js";
	export default {
	data() {
			return {
				list: list,
				activeTheme: 'light',
				uThemeChangeHandler: null,
				// desc: '收集众多的常用页面和布局，减少开发者的重复工作，让你专注逻辑，事半功倍'
			}
		},
		computed: {
			desc() {
				return this.$t('template.desc');
			},
			pageBg() {
				return this.activeTheme === 'dark' ? '#111111' : '#ffffff'
			},
			groupTitleBg() {
				return this.activeTheme === 'dark' ? '#1f1f1f' : 'rgb(243, 244, 246)'
			},
			themeVars() {
				if (uni.$u && uni.$u.getThemeVars) return uni.$u.getThemeVars()
				return {}
			}
		},
		onLoad() {
			this.activeTheme = (uni.$u && uni.$u.theme && uni.$u.theme.mode) || 'light'
			this.uThemeChangeHandler = (payload = {}) => {
				this.activeTheme = payload.mode || this.activeTheme
			}
			uni.$on('uThemeChange', this.uThemeChangeHandler)
		},
		onShow() {
			this.activeTheme = (uni.$u && uni.$u.theme && uni.$u.theme.mode) || 'light'
			uni.setNavigationBarTitle({
				title: this.$t('nav.template')
			});
		},
		onUnload() {
			if (this.uThemeChangeHandler) {
				uni.$off('uThemeChange', this.uThemeChangeHandler)
				this.uThemeChangeHandler = null
			}
		},
		methods: {
			getIcon(path) {
				return 'https://uview-plus.jiangruyi.com/h5/static/uview/demo/' + path + '.png';
			},
			openPage(path) {
				const route = (uni.$u && uni.$u.route) || (this.$u && this.$u.route)
				const url = path.indexOf('/page') == 0 ? path : '/pages/template/' + path + '/index'
				if (route) {
					route({ url })
					return
				}
				uni.navigateTo({ url })
			},
			getGroupTitle(item) {
				return this.$i18n.locale == 'zh-Hans' ? item.groupName : item.groupName_en
			},
			getFieldTitle(item) {
				return this.$i18n.locale == 'zh-Hans' ? item.title : item.title_en
			}
		}
	}
</script>

<style>
	/* page {
		background-color: rgb(240, 242, 244);
	} */
</style>

<style lang="scss" scoped>
	.u-cell-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 8rpx;
	}
</style>
