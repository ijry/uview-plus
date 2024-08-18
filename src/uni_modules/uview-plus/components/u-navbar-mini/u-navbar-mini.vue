<template>
	<view class="u-navbar-mini" :class="[customClass]">
		<view class="u-navbar-mini__inner" :class="[fixed && 'u-navbar-mini--fixed']">
			<u-status-bar
				v-if="safeAreaInsetTop"
			></u-status-bar>
			<view
				class="u-navbar-mini__content"
				:class="[border && 'u-border-bottom']"
				:style="{
					height: addUnit(height),
					backgroundColor: bgColor,
				}"
			>
				<view
					class="u-navbar-mini__content__left"
					hover-class="u-navbar-mini__content__left--hover"
					hover-start-time="150"
					@tap="leftClick"
				>
					<slot name="left">
						<up-icon
							:name="leftIcon"
							:size="iconSize"
							:color="iconColor"
						></up-icon>
					</slot>
				</view>
				<view style="padding: 10px 10px;">
					<up-line direction="col" color="#fff" length="16px"></up-line>
				</view>
                <view
					class="u-navbar-mini__content__center" @tap="homeClick">
                    <slot name="center">
                        <up-icon name="home" :size="iconSize" :color="iconColor"></up-icon>
                    </slot>
                </view>
			</view>
		</view>
	</view>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	import { addUnit, addStyle, getPx, sys } from '../../libs/function/index';
	/**
	 * NavbarMini 迷你导航栏
	 * @description 此组件一般用于在全屏页面中，典型的如微信小程序左上角。
	 * @tutorial https://ijry.github.io/uview-plus/components/navbar-mini.html
	 * @property {Boolean}			safeAreaInsetTop	是否开启顶部安全区适配  （默认 true ）
	 * @property {Boolean}			placeholder			固定在顶部时，是否生成一个等高元素，以防止塌陷 （默认 false ）
	 * @property {Boolean}			fixed				导航栏是否固定在顶部 （默认 false ）
	 * @property {String}			leftIcon			左边返回图标的名称，只能为uView自带的图标 （默认 'arrow-left' ）
	 * @property {String}			title				导航栏标题，如设置为空字符，将会隐藏标题占位区域
	 * @property {String}			bgColor				导航栏背景设置 （默认 '#ffffff' ）
	 * @property {String | Number}	height				导航栏高度(不包括状态栏高度在内，内部自动加上)（默认 '44px' ）
	 * @property {String | Number}	iconSize			左侧返回图标的大小（默认 20px ）
	 * @property {String | Number}	leftIconColor		左侧返回图标的颜色（默认 #303133 ）
	 * @property {Boolean}	        autoBack			点击左侧区域(返回图标)，是否自动返回上一页（默认 false ）
	 * @property {Object | String}	titleStyle			标题的样式，对象或字符串
	 * @event {Function} leftClick		点击左侧区域
	 * @event {Function} rightClick		点击右侧区域
	 * @example <u-navbar-mini @click-left="onClickBack"></u-navbar-mini>
	 */
	export default {
		name: 'u-navbar-mini',
		mixins: [mpMixin, mixin, props],
		data() {
			return {
			}
		},
		emits: ["leftClick", "homeClick"],
        created() {
        },
		methods: {
			addStyle,
			addUnit,
			sys,
			getPx,
			// 点击左侧区域
			leftClick() {
				// 如果配置了autoBack，自动返回上一页
				this.$emit('leftClick')
				if(this.autoBack) {
					uni.navigateBack()
				}
			},
			homeClick() {
				if (this.homeUrl) {
					uni.reLaunch({ url: this.homeUrl })
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";

	.u-navbar-mini {

        &__inner {
            width: 180rpx;
            overflow: hidden;
        }

		&--fixed {
			position: fixed;
			left: 20px;
			right: 0;
			top: 10px;
			z-index: 11;
		}

		&__content {
			@include flex(row);
            padding: 0 15px;
			border-radius: 20px;
			align-items: center;
			height: 36px;
			background-color: #9acafc;
			position: relative;
			justify-content: space-between;

			&__left {
				@include flex(row);
				align-items: center;
			}

			&__left {
				&--hover {
					opacity: 0.7;
				}
			}
		}
	}
</style>
