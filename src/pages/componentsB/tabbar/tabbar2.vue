<template>
	<view class="u-page">
		<view class="u-page__item">
			<text class="u-page__item__title">基础功能</text>
			<up-tabbar
			    :value="value1"
			    @change="change1"
			    :fixed="false"
			    :placeholder="false"
			    :safeAreaInsetBottom="false"
			>
				<up-tabbar-item
					text="首页"
					icon="home"
					@click="click1"
				></up-tabbar-item>
				<up-tabbar-item
					text="放映厅"
					icon="photo"
					@click="click1"
				></up-tabbar-item>
				<up-tabbar-item
					text="直播"
					icon="play-right"
					@click="click1"
				></up-tabbar-item>
				<up-tabbar-item
					text="我的"
					icon="account"
					@click="click1"
				></up-tabbar-item>
			</up-tabbar>
		</view>
		<view class="u-page__item">
			<text class="u-page__item__title">显示徽标</text>
			<up-tabbar
			    :value="value2"
			    :placeholder="false"
			    @change="name => value2 = name"
			    :fixed="false"
			    :safeAreaInsetBottom="false"
			>
				<up-tabbar-item
				    text="首页"
				    icon="home"
				    dot
				></up-tabbar-item>
				<up-tabbar-item
				    text="放映厅"
				    icon="photo"
				    badge="3"
				></up-tabbar-item>
				<up-tabbar-item
				    text="直播"
				    icon="play-right"
				></up-tabbar-item>
				<up-tabbar-item
				    text="我的"
				    icon="account"
				></up-tabbar-item>
			</up-tabbar>
		</view>
		<view class="u-page__item">
			<text class="u-page__item__title">匹配标签的名称</text>
			<up-tabbar
			    :placeholder="false"
			    :value="value3"
			    @change="name => value3 = name"
			    :fixed="false"
			    :safeAreaInsetBottom="false"
			>
				<up-tabbar-item
				    text="首页"
				    icon="home"
				    name="home"
				></up-tabbar-item>
				<up-tabbar-item
				    text="放映厅"
				    icon="photo"
				    name="photo"
				></up-tabbar-item>
				<up-tabbar-item
				    text="直播"
				    icon="play-right"
				    name="play-right"
				></up-tabbar-item>
				<up-tabbar-item
				    text="我的"
				    name="account"
				    icon="account"
				></up-tabbar-item>
			</up-tabbar>
		</view>
		<view class="u-page__item">
			<text class="u-page__item__title">自定义图标/颜色</text>
			<up-tabbar
			    :value="value4"
			    @change="name => value4 = name"
			    :fixed="false"
			    :placeholder="false"
			    activeColor="#d81e06"
			    :safeAreaInsetBottom="false"
			>
				<up-tabbar-item text="首页">
					<template v-slot:active-icon>
						<image
						    class="u-page__item__slot-icon"
						    src="https://cdn.uviewui.com/uview/common/bell-selected.png"
						></image>
					</template>
					<template v-slot:inactive-icon>
						<image
							class="u-page__item__slot-icon"
							src="https://cdn.uviewui.com/uview/common/bell.png"
						></image>
					</template>
				</up-tabbar-item>
				<up-tabbar-item
				    text="放映厅"
				    icon="photo"
				></up-tabbar-item>
				<up-tabbar-item
				    text="直播"
				    icon="play-right"
				></up-tabbar-item>
				<up-tabbar-item
				    text="我的"
				    icon="account"
				></up-tabbar-item>
			</up-tabbar>
		</view>
		<view class="u-page__item">
			<text class="u-page__item__title">拦截切换事件(点击第二个标签)</text>
			<up-tabbar
			    :value="value5"
			    :fixed="false"
				@change="change5"
			    :safeAreaInsetBottom="false"
			    :placeholder="false"
			>
				<up-tabbar-item
				    text="首页"
				    icon="home"
				>
				</up-tabbar-item>
				<up-tabbar-item
				    text="放映厅"
				    icon="photo"
				></up-tabbar-item>
				<up-tabbar-item
				    text="直播"
				    icon="play-right"
				></up-tabbar-item>
				<up-tabbar-item
				    text="我的"
				    icon="account"
				></up-tabbar-item>
			</up-tabbar>
		</view>
		<view class="u-page__item">
			<text class="u-page__item__title">去除上边框</text>
			<up-tabbar
			    :value="value7"
			    :placeholder="false"
				:border="false"
			    @change="name => value7 = name"
			    :fixed="false"
			    :safeAreaInsetBottom="false"
			>
				<up-tabbar-item
				    text="首页"
				    icon="home"
				></up-tabbar-item>
				<up-tabbar-item
				    text="放映厅"
				    icon="photo"
				></up-tabbar-item>
				<up-tabbar-item
				    text="直播"
				    icon="play-right"
				></up-tabbar-item>
				<up-tabbar-item
				    text="我的"
				    icon="account"
				></up-tabbar-item>
			</up-tabbar>
		</view>
		<view class="u-page__item">
			<text class="u-page__item__title">固定在底部(固定在屏幕最下方)</text>
			<up-gap height="150"></up-gap>
			<up-tabbar
			    :value="value6"
			    @change="name => value6 = name"
			    :fixed="true"
				:placeholder="true"
			    :safeAreaInsetBottom="true"
			>
				<up-tabbar-item
					text="首页"
					icon="home"
				>
				</up-tabbar-item>
				<up-tabbar-item
					text="放映厅"
					icon="photo"
				></up-tabbar-item>
				<up-tabbar-item
					text="直播"
					icon="play-right"
				></up-tabbar-item>
				<up-tabbar-item
					text="我的"
					icon="account"
				></up-tabbar-item>
			</up-tabbar>
		</view>
	</view>
</template>

<script>
	import { toast } from '@/uni_modules/uview-plus'
	export default {
		data() {
			return {
				value1: 0,
				value2: 1,
				value3: 'play-right',
				value4: 0,
				value5: 0,
				value6: 0,
				value7: 3
			}
		},
		onLoad() {

		},
		methods: {
			change5(name) {
				if (name === 1) return toast('请您先登录')
				else this.value5 = name
			},
			change1(e) {
				this.value1 = e
				console.log('change1', e);
			},
			click1(e) {
				console.log('click1', e);
			}
		},
	}
</script>

<style lang="scss">
	.u-page {
		padding: 0;
		&__item {

			&__title {
				color: $u-tips-color;
				background-color: $u-bg-color;
				padding: 15px 15px 5px 15px;
				font-size: 15px;

				&__slot-title {
					color: $u-primary;
					font-size: 14px;
				}
			}

			&__slot-icon {
				width: 17px;
				height: 17px;
			}
		}
	}
</style>
