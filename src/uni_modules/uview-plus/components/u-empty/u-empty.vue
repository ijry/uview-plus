<template>
	<view
	    class="u-empty"
	    :style="[emptyStyle]"
	    v-if="show"
	>
		<up-icon
		    v-if="!isSrc"
		    :name="mode === 'message' ? 'chat' : `empty-${mode}`"
		    :size="iconSize"
		    :color="iconColor"
		    margin-top="14"
		></up-icon>
		<image
		    v-else
		    :style="{
				width: addUnit(width),
				height: addUnit(height),
			}"
		    :src="icon"
		    mode="widthFix"
		></image>
		<text
		    class="u-empty__text"
		    :style="[textStyle]"
		>{{text ? text : icons[mode]}}</text>
		<view class="u-empty__wrap" v-if="$slots.default || $slots.$default">
			<slot />
		</view>
	</view>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	import { addUnit, addStyle, deepMerge } from '../../libs/function/index';
	import { t } from '../../libs/i18n'
	/**
	 * empty 内容为空
	 * @description 该组件用于需要加载内容，但是加载的第一页数据就为空，提示一个"没有内容"的场景， 我们精心挑选了十几个场景的图标，方便您使用。
	 * @tutorial https://ijry.github.io/uview-plus/components/empty.html
	 * @property {String}			icon		内置图标名称，或图片路径，建议绝对路径
	 * @property {String}			text		提示文字
	 * @property {String}			textColor	文字颜色 (默认 '#c0c4cc' )
	 * @property {String | Number}	textSize	文字大小 （默认 14 ）
	 * @property {String}			iconColor	图标的颜色 （默认 '#c0c4cc' ）
	 * @property {String | Number}	iconSize	图标的大小 （默认 90 ）
	 * @property {String}			mode		选择预置的图标类型 （默认 'data' ）
	 * @property {String | Number}	width		图标宽度，单位px （默认 160 ）
	 * @property {String | Number}	height		图标高度，单位px （默认 160 ）
	 * @property {Boolean}			show		是否显示组件 （默认 true ）
	 * @property {String | Number}	marginTop	组件距离上一个元素之间的距离，默认px单位 （默认 0 ）
	 * @property {Object}			customStyle	定义需要用到的外部样式
	 * 
	 * @event {Function} click 点击组件时触发
	 * @event {Function} close 点击关闭按钮时触发
	 * @example <u-empty text="所谓伊人，在水一方" mode="list"></u-empty>
	 */
	export default {
		name: "u-empty",
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				icons: {
					car: t("up.empty.car"),
					page: t("up.empty.page"),
					search: t("up.empty.search"),
					address: t("up.empty.address"),
					wifi: t("up.empty.wifi"),
					order: t("up.empty.order"),
					coupon: t("up.empty.coupon"),
					favor: t("up.empty.favor"),
					permission: t("up.empty.permission"),
					history: t("up.empty.history"),
					news: t("up.empty.news"),
					message: t("up.empty.message"),
					list: t("up.empty.list"),
					data: t("up.empty.data"),
					comment: t("up.empty.comment"),
				}
			}
		},
		computed: {
			// 组件样式
			emptyStyle() {
				const style = {}
				style.marginTop = addUnit(this.marginTop)
				// 合并customStyle样式，此参数通过mixin中的props传递
				return deepMerge(addStyle(this.customStyle), style)
			},
			// 文本样式
			textStyle() {
				const style = {}
				style.color = this.textColor
				style.fontSize = addUnit(this.textSize)
				return style
			},
			// 判断icon是否图片路径
			isSrc() {
				return this.icon.indexOf('/') >= 0
			}
		},
		methods: {
			addUnit
		}
	}
</script>

<style lang="scss" scoped>
	$u-empty-text-margin-top:20rpx !default;
	$u-empty-slot-margin-top:20rpx !default;

	.u-empty {
		@include flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		&__text {
			@include flex;
			justify-content: center;
			align-items: center;
			margin-top: $u-empty-text-margin-top;
		}
	}
		.u-slot-wrap {
			@include flex;
			justify-content: center;
			align-items: center;
			margin-top:$u-empty-slot-margin-top;
		}
</style>
