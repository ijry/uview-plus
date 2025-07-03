<template>
	<view class="up-box" :style="[{height: height}, addStyle(customStyle)]">
        <view class="up-box__left" :style="{borderRadius: borderRadius, backgroundColor: bgColors[0]}">
            <slot name="left">
                <view class="flex flex-row items-center justify-center">
                    <up-icon size="36" :name="leftIcon"></up-icon>
                    <text class="ml-2 text-16px">{{leftTitle}}</text>
                </view>
            </slot>
        </view>
        <view class="up-box__gap" :style="{width: gap, height: height}"></view>
        <view class="up-box__right">
            <view class="up-box__right-top" :style="{borderRadius: borderRadius, backgroundColor: bgColors[1]}">
                <slot name="rightTop">
                    <view class="flex flex-row items-center justify-center">
                        <up-icon size="36" :name="rightTopIcon"></up-icon>
                        <text class="ml-2 text-15px">{{rightTopTitle}}</text>
                    </view>
                </slot>
            </view>
            <view class="up-box__right-gap" :style="{height: gap}"></view>
            <view class="up-box__right-bottom" :style="{borderRadius: borderRadius, backgroundColor: bgColors[2]}">
                <slot name="rightBottom">
                    <view class="flex flex-row items-center justify-center">
                        <up-icon size="36" :name="rightBottomIcon"></up-icon>
                        <text class="ml-2 text-15px">{{rightBottomTitle}}</text>
                    </view>
                </slot>
            </view>
        </view>
	</view>
</template>

<script>
	import { propsBox } from './props.js';
	import { mpMixin } from '../../libs/mixin/mpMixin.js';
	import { mixin } from '../../libs/mixin/mixin.js';
	import { addStyle } from '../../libs/function/index.js';
	import test from '../../libs/function/test.js';
	/**
	 * box 盒子
	 * @description box盒子一般为左边一个盒子，右侧两个等高的半盒组成，常用于App首页座位重点突出。
	 * @tutorial https://uview-plus.jiangruyi.com/components/box.html
	 * @property {Array}	bgColors			背景色
	 * @property {String}	height			    高度
     * @property {String}	borderRadius		圆角
	 * @property {Object}   customStyle		    定义需要用到的外部样式
	 * 
	 * @event {Function}			click			点击cell列表时触发
	 * @example <up-box colors=['blue', 'red', 'yellow'] height="200px"></up-box>
	 */
	export default {
		name: 'up-box',
		data() {
			return {
			}
		},
		mixins: [mpMixin, mixin, propsBox],
		computed: {
		},
		emits: [],
		methods: {
			addStyle,
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";

	.up-box {
        /* #ifndef APP-NVUE */
        /* #endif */
        @include flex();
        flex: 1;

		&__left {
            @include flex();
            justify-content: center;
            align-items: center;
            flex: 1;
        }
        &__gap {
            @include flex();
            flex-direction: column;
        }
        &__right {
            @include flex();
            flex-direction: column;
            flex: 1;
        }

        &__right-top {
            @include flex();
            flex: 1;
            justify-content: center;
            align-items: center;
        }

        &__right-bottom {
            @include flex();
            flex: 1;
            justify-content: center;
            align-items: center;
        }
	}
</style>
