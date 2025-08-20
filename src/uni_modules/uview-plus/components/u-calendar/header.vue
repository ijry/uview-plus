<template>
	<view class="u-calendar-header u-border-bottom">
		<text
			class="u-calendar-header__title"
			v-if="showTitle"
		>{{ title }}</text>
		<text
			class="u-calendar-header__subtitle"
			v-if="showSubtitle"
		>{{ subtitle }}</text>
		<view class="u-calendar-header__weekdays">
			<text class="u-calendar-header__weekdays__weekday">{{ weekText[0] }}</text>
			<text class="u-calendar-header__weekdays__weekday">{{ weekText[1] }}</text>
			<text class="u-calendar-header__weekdays__weekday">{{ weekText[2] }}</text>
			<text class="u-calendar-header__weekdays__weekday">{{ weekText[3] }}</text>
			<text class="u-calendar-header__weekdays__weekday">{{ weekText[4] }}</text>
			<text class="u-calendar-header__weekdays__weekday">{{ weekText[5] }}</text>
			<text class="u-calendar-header__weekdays__weekday">{{ weekText[6] }}</text>
		</view>
	</view>
</template>

<script>
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	export default {
		name: 'u-calendar-header',
		mixins: [mpMixin, mixin],
		props: {
			// 标题
			title: {
				type: String,
				default: ''
			},
			// 副标题
			subtitle: {
				type: String,
				default: ''
			},
			// 是否显示标题
			showTitle: {
				type: Boolean,
				default: true
			},
			// 是否显示副标题
			showSubtitle: {
				type: Boolean,
				default: true
			},
			// 星期文本
			weekText: {
				type: Array,
				default: () => {
					return []
				}
			},
		},
		data() {
			return {

			}
		},
		methods: {
			name() {

			}
		},
	}
</script>

<style lang="scss" scoped>

	.u-calendar-header {
		display: flex;
		flex-direction: column;
		padding-bottom: 4px;

		&__title {
			font-size: 16px;
			color: $u-main-color;
			text-align: center;
			height: 42px;
			line-height: 42px;
			font-weight: bold;
		}

		&__subtitle {
			font-size: 14px;
			color: $u-main-color;
			height: 40px;
			text-align: center;
			line-height: 40px;
			font-weight: bold;
		}

		&__weekdays {
			@include flex;
			justify-content: space-between;

			&__weekday {
				font-size: 13px;
				color: $u-main-color;
				line-height: 30px;
				flex: 1;
				text-align: center;
			}
		}
	}
</style>
