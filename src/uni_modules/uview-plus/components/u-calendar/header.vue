<template>
	<view class="u-calendar-header u-border-bottom">
		<text
			class="u-calendar-header__title"
			v-if="showTitle"
		>{{ title }}</text>
		<view
			class="u-calendar-header__subtitle-wrap"
			v-if="showSubtitle"
		>
			<text
				v-if="showSwitch"
				class="u-calendar-header__switch"
				:class="{ 'u-calendar-header__switch--disabled': prevYearDisabled }"
				@click="prevYear"
			>«</text>
			<text
				v-if="showSwitch"
				class="u-calendar-header__switch"
				:class="{ 'u-calendar-header__switch--disabled': prevDisabled }"
				@click="prev"
			>‹</text>
			<text class="u-calendar-header__subtitle">{{ subtitle }}</text>
			<text
				v-if="showSwitch"
				class="u-calendar-header__switch"
				:class="{ 'u-calendar-header__switch--disabled': nextDisabled }"
				@click="next"
			>›</text>
			<text
				v-if="showSwitch"
				class="u-calendar-header__switch"
				:class="{ 'u-calendar-header__switch--disabled': nextYearDisabled }"
				@click="nextYear"
			>»</text>
		</view>
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
			// 是否显示月份切换按钮
			showSwitch: {
				type: Boolean,
				default: false
			},
			// 上个月按钮是否禁用
			prevDisabled: {
				type: Boolean,
				default: false
			},
			// 下个月按钮是否禁用
			nextDisabled: {
				type: Boolean,
				default: false
			},
			// 上一年按钮是否禁用
			prevYearDisabled: {
				type: Boolean,
				default: false
			},
			// 下一年按钮是否禁用
			nextYearDisabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			}
		},
		methods: {
			prev() {
				if (!this.prevDisabled) {
					this.$emit('prev')
				}
			},
			next() {
				if (!this.nextDisabled) {
					this.$emit('next')
				}
			},
			prevYear() {
				if (!this.prevYearDisabled) {
					this.$emit('prevYear')
				}
			},
			nextYear() {
				if (!this.nextYearDisabled) {
					this.$emit('nextYear')
				}
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
			color: var(--up-main-color, $u-main-color);
			text-align: center;
			height: 42px;
			line-height: 42px;
			font-weight: bold;
		}

		&__subtitle-wrap {
			@include flex;
			align-items: center;
			justify-content: center;
			height: 40px;
		}

		&__subtitle {
			font-size: 14px;
			color: var(--up-main-color, $u-main-color);
			text-align: center;
			font-weight: bold;
			min-width: 120px;
		}

		&__switch {
			width: 44px;
			height: 40px;
			line-height: 40px;
			text-align: center;
			color: var(--up-main-color, $u-main-color);
			font-size: 22px;
			font-weight: bold;
			flex-shrink: 0;

			&--disabled {
				opacity: 0.35;
			}
		}

		&__weekdays {
			@include flex;
			justify-content: space-between;

			&__weekday {
				font-size: 13px;
				color: var(--up-main-color, $u-main-color);
				line-height: 30px;
				flex: 1;
				text-align: center;
			}
		}
	}
</style>
