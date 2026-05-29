<template>
	<view class="u-calendar-strip">
		<view v-if="!fullCalendar || !innerShowFull">
			<view class="u-calendar-strip__header u-border-bottom">
				<text
					class="u-calendar-strip__header__switch"
					:class="{ 'u-calendar-strip__header__switch--disabled': switchPrevDisabled }"
					@tap="prevMonth"
				>‹</text>
				<text class="u-calendar-strip__header__title">{{ monthLabel }}</text>
				<text
					class="u-calendar-strip__header__switch"
					:class="{ 'u-calendar-strip__header__switch--disabled': switchNextDisabled }"
					@tap="nextMonth"
				>›</text>
				<text
					v-if="fullCalendar"
					class="u-calendar-strip__header__toggle"
					@click="toggleFull('button')"
				>▾</text>
			</view>
			<view
				class="u-calendar-strip__scroll-wrap"
				@touchstart="onTouchStart"
				@touchend="onTouchEnd"
			>
				<scroll-view
					class="u-calendar-strip__scroll"
					scroll-x
					enable-flex
					:show-scrollbar="false"
					:scroll-into-view="scrollIntoView"
				>
					<view class="u-calendar-strip__scroll__inner">
						<view
							v-for="(item, index) in monthDays"
							:key="index"
							class="u-calendar-strip__day"
							:id="getDateId(item.date)"
							:class="[
								item.disabled && 'u-calendar-strip__day--disabled',
								item.selected && 'u-calendar-strip__day--selected',
								item.today && showToday && !item.selected && 'u-calendar-strip__day--today',
							]"
							:style="[dayStyle(item)]"
							@tap="onDayTap(item)"
						>
							<text class="u-calendar-strip__day__date">{{ item.day }}</text>
							<text class="u-calendar-strip__day__week">{{ getWeekLabel(item.week) }}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view
			v-if="fullCalendar && innerShowFull"
			class="u-calendar-strip__panel-wrap"
			@touchstart="onTouchStart"
			@touchend="onTouchEnd"
		>
			<view class="u-calendar-strip__panel">
				<u-calendar
					:show="true"
					:pageInline="true"
					:showTitle="false"
					:showConfirm="false"
					:closeOnClickOverlay="false"
					:monthSwitch="true"
					mode="single"
					:defaultDate="innerSelectedDate"
					:minDate="panelMinDate"
					:maxDate="panelMaxDate"
					:monthNum="panelMonthNum"
					:readonly="readonly"
					:showToday="showToday"
					:color="color"
					v-bind="fullCalendarProps"
					@confirm="onPanelConfirm"
				></u-calendar>
			</view>
			<view class="u-calendar-strip__hint u-calendar-strip__hint--panel">
				<text class="u-calendar-strip__hint__text" @click="toggleFull('hint')">{{ collapseHint }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import { props } from './props'
import { mpMixin } from '../../libs/mixin/mpMixin'
import { mixin } from '../../libs/mixin/mixin'
import dayjs from '../u-datetime-picker/dayjs.esm.min.js'
import test from '../../libs/function/test'

/**
 * CalendarStrip 单行日历
 * @description 单行横向日期日历，支持切月、下拉展开完整月历
 */
export default {
	name: 'u-calendar-strip',
	mixins: [mpMixin, mixin, props],
	data() {
		return {
			innerSelectedDate: '',
			currentMonth: '',
			scrollIntoView: '',
			innerShowFull: false,
			touchStartX: 0,
			touchStartY: 0
		}
	},
	computed: {
		innerMaxDate() {
			return test.number(this.maxDate) ? Number(this.maxDate) : this.maxDate
		},
		innerMinDate() {
			return test.number(this.minDate) ? Number(this.minDate) : this.minDate
		},
		rangeChange() {
			return [this.innerMinDate, this.innerMaxDate]
		},
		hasMaxDate() {
			return !!this.innerMaxDate && dayjs(this.innerMaxDate).isValid()
		},
		hasMinDate() {
			return !!this.innerMinDate && dayjs(this.innerMinDate).isValid()
		},
		minDateDay() {
			if (!this.hasMinDate) return ''
			return dayjs(this.innerMinDate).format('YYYY-MM-DD')
		},
		maxDateDay() {
			if (!this.hasMaxDate) return ''
			return dayjs(this.innerMaxDate).format('YYYY-MM-DD')
		},
		todayDate() {
			return dayjs().format('YYYY-MM-DD')
		},
		monthLabel() {
			if (!this.currentMonth) return ''
			const date = dayjs(`${this.currentMonth}-01`)
			if (this.monthFormat) return date.format(this.monthFormat)
			if (uni.getLocale() == 'zh-Hans' || uni.getLocale() == 'zh-Hant') {
				return date.format('YYYY年MM月')
			}
			return date.format('MM/YYYY')
		},
		monthDays() {
			if (!this.currentMonth) return []
			const start = dayjs(`${this.currentMonth}-01`)
			const days = start.daysInMonth()
			return new Array(days).fill(0).map((item, index) => {
				const date = start.date(index + 1).format('YYYY-MM-DD')
				return {
					day: index + 1,
					date,
					week: start.date(index + 1).day(),
					disabled: this.isDateDisabled(date),
					selected: this.dateSame(date, this.innerSelectedDate),
					today: this.dateSame(date, this.todayDate)
				}
			})
		},
		switchPrevDisabled() {
			if (!this.hasMinDate || !this.currentMonth) return false
			const current = dayjs(`${this.currentMonth}-01`)
			const minMonth = dayjs(this.minDateDay).startOf('month')
			return current.isSame(minMonth, 'month') || current.isBefore(minMonth, 'month')
		},
		switchNextDisabled() {
			if (!this.hasMaxDate || !this.currentMonth) return false
			const current = dayjs(`${this.currentMonth}-01`)
			const maxMonth = dayjs(this.maxDateDay).startOf('month')
			return current.isSame(maxMonth, 'month') || current.isAfter(maxMonth, 'month')
		},
		panelMinDate() {
			if (this.hasMinDate) return this.minDateDay
			const monthNum = Math.max(1, Number(this.fullMonthNum) || 24)
			const anchor = this.currentMonth || dayjs().format('YYYY-MM')
			return dayjs(`${anchor}-01`).subtract(monthNum - 1, 'month').startOf('month').format('YYYY-MM-DD')
		},
		panelMaxDate() {
			if (this.hasMaxDate) return this.maxDateDay
			const monthNum = Math.max(1, Number(this.fullMonthNum) || 24)
			const anchor = this.currentMonth || dayjs().format('YYYY-MM')
			return dayjs(`${anchor}-01`).add(monthNum - 1, 'month').endOf('month').format('YYYY-MM-DD')
		},
		panelMonthNum() {
			return this.getMonths(this.panelMinDate, this.panelMaxDate)
		},
		pullHintText() {
			return this.innerShowFull ? this.collapseHint : this.expandHint
		}
	},
	watch: {
		modelValue: {
			immediate: true,
			handler(n) {
				this.syncByValue(n, false, 'sync')
			}
		},
		rangeChange() {
			this.syncByValue(this.innerSelectedDate || this.modelValue, true, 'range')
		}
	},
	emits: ['change', 'confirm', 'monthChange', 'toggleFull', 'update:modelValue'],
	methods: {
		dateSame(date1, date2) {
			if (!date1 || !date2) return false
			return dayjs(date1).isSame(dayjs(date2), 'day')
		},
		normalizeDate(value) {
			if (!value) return ''
			const parsed = dayjs(value)
			if (!parsed.isValid()) return ''
			return parsed.format('YYYY-MM-DD')
		},
		clampDate(date) {
			let next = this.normalizeDate(date)
			if (!next) return ''
			if (this.hasMinDate && dayjs(next).isBefore(dayjs(this.minDateDay), 'day')) {
				next = this.minDateDay
			}
			if (this.hasMaxDate && dayjs(next).isAfter(dayjs(this.maxDateDay), 'day')) {
				next = this.maxDateDay
			}
			return next
		},
		isDateDisabled(date) {
			if (!date) return true
			if (this.hasMinDate && dayjs(date).isBefore(dayjs(this.minDateDay), 'day')) {
				return true
			}
			if (this.hasMaxDate && dayjs(date).isAfter(dayjs(this.maxDateDay), 'day')) {
				return true
			}
			return false
		},
		getDateId(date) {
			return `u-calendar-strip-day-${dayjs(date).format('YYYYMMDD')}`
		},
		getWeekLabel(week) {
			const index = week === 0 ? 6 : week - 1
			return this.weekText[index] || ''
		},
		dayStyle(item) {
			const style = {}
			if (item.selected) {
				style.backgroundColor = this.color
			}
			if (!item.selected && item.today && this.showToday) {
				style.borderColor = this.color
			}
			return style
		},
		scrollToDate(date) {
			if (!date) {
				this.scrollIntoView = ''
				return
			}
			const target = this.getDateId(date)
			this.scrollIntoView = ''
			this.$nextTick(() => {
				this.scrollIntoView = target
			})
		},
		syncByValue(value, emit = false, scene = 'sync') {
			let next = this.clampDate(value)
			if (!next) {
				next = this.clampDate(this.todayDate)
			}
			if (!next) return
			this.setSelectedDate(next, scene, emit)
		},
		setSelectedDate(date, scene = 'tap', emit = true) {
			const next = this.clampDate(date)
			if (!next || this.isDateDisabled(next)) return
			const prevDate = this.innerSelectedDate
			const prevMonth = this.currentMonth
			this.innerSelectedDate = next
			this.currentMonth = dayjs(next).format('YYYY-MM')
			this.scrollToDate(next)
			if (!emit) return
			const payload = {
				date: next,
				month: this.currentMonth,
				scene
			}
			if (!this.dateSame(prevDate, next)) {
				this.$emit('update:modelValue', next)
			}
			this.$emit('change', payload)
			this.$emit('confirm', payload)
			if (prevMonth !== this.currentMonth) {
				this.$emit('monthChange', {
					month: this.currentMonth,
					scene
				})
			}
		},
		getMonths(minDate, maxDate) {
			const minYear = dayjs(minDate).year()
			const minMonth = dayjs(minDate).month() + 1
			const maxYear = dayjs(maxDate).year()
			const maxMonth = dayjs(maxDate).month() + 1
			return Math.max(1, (maxYear - minYear) * 12 + (maxMonth - minMonth) + 1)
		},
		findFirstEnabledDate(month) {
			const start = dayjs(`${month}-01`)
			const days = start.daysInMonth()
			for (let i = 1; i <= days; i++) {
				const date = start.date(i).format('YYYY-MM-DD')
				if (!this.isDateDisabled(date)) {
					return date
				}
			}
			return ''
		},
		switchMonth(step = 0) {
			if (step < 0 && this.switchPrevDisabled) return
			if (step > 0 && this.switchNextDisabled) return
			const baseMonth = this.currentMonth || dayjs(this.todayDate).format('YYYY-MM')
			const target = dayjs(`${baseMonth}-01`).add(step, 'month')
			const targetMonth = target.format('YYYY-MM')
			const selectedDay = dayjs(this.innerSelectedDate || this.todayDate).date()
			const dayInTargetMonth = Math.min(selectedDay, target.daysInMonth())
			let next = target.date(dayInTargetMonth).format('YYYY-MM-DD')
			next = this.clampDate(next)
			if (!next || !dayjs(next).isSame(target, 'month') || this.isDateDisabled(next)) {
				next = this.findFirstEnabledDate(targetMonth)
			}
			if (!next) return
			this.setSelectedDate(next, 'switch', true)
		},
		prevMonth() {
			this.switchMonth(-1)
		},
		nextMonth() {
			this.switchMonth(1)
		},
		onDayTap(item) {
			if (this.readonly || item.disabled) return
			this.setSelectedDate(item.date, 'tap', true)
		},
		setFullVisible(show, source = 'button') {
			if (!this.fullCalendar) return
			if (this.innerShowFull === show) return
			this.innerShowFull = show
			this.$emit('toggleFull', {
				show,
				source
			})
		},
		toggleFull(source = 'button') {
			this.setFullVisible(!this.innerShowFull, source)
		},
		onPanelConfirm(e) {
			if (!Array.isArray(e) || !e.length) return
			this.setSelectedDate(e[0], 'full', true)
			if (this.collapseAfterSelect) {
				this.setFullVisible(false, 'auto')
			}
		},
		onTouchStart(event) {
			if (!this.fullCalendar) return
			const point = event?.changedTouches?.[0] || event?.touches?.[0]
			if (!point) return
			this.touchStartX = point.clientX
			this.touchStartY = point.clientY
		},
		onTouchEnd(event) {
			if (!this.fullCalendar) return
			const point = event?.changedTouches?.[0] || event?.touches?.[0]
			if (!point) return
			const deltaX = point.clientX - this.touchStartX
			const deltaY = point.clientY - this.touchStartY
			const threshold = Number(this.pullDownThreshold) || 40
			if (Math.abs(deltaY) < threshold || Math.abs(deltaY) <= Math.abs(deltaX)) {
				return
			}
			if (deltaY > 0 && !this.innerShowFull) {
				this.setFullVisible(true, 'pull-down')
			}
			if (deltaY < 0 && this.innerShowFull) {
				this.setFullVisible(false, 'pull-up')
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.u-calendar-strip {
	background-color: var(--up-card-bg-color, #ffffff);
	border-radius: 10px;
	margin: 0 8px;

	&__header {
		@include flex;
		align-items: center;
		padding: 0 4px;
		height: 40px;

		&__switch {
			width: 40px;
			text-align: center;
			font-size: 20px;
			line-height: 40px;
			color: var(--up-main-color, $u-main-color);

			&--disabled {
				opacity: 0.35;
			}
		}

		&__title {
			flex: 1;
			text-align: center;
			font-size: 14px;
			font-weight: bold;
			color: var(--up-main-color, $u-main-color);
		}

		&__toggle {
			width: 40px;
			text-align: center;
			font-size: 18px;
			line-height: 40px;
			color: var(--up-content-color, $u-content-color);
		}
	}

	&__scroll-wrap {
		padding: 10px 0 6px;
	}

	&__scroll {
		&__inner {
			@include flex;
			padding: 0 8px;
		}
	}

	&__day {
		width: 54px;
		height: 62px;
		margin-right: 8px;
		border-radius: 8px;
		border: 1px solid transparent;
		@include flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;

		&__date {
			font-size: 18px;
			line-height: 22px;
			color: var(--up-main-color, $u-main-color);
		}

		&__week {
			margin-top: 4px;
			font-size: 12px;
			line-height: 16px;
			color: var(--up-content-color, $u-content-color);
		}

		&--selected {
			.u-calendar-strip__day__date,
			.u-calendar-strip__day__week {
				color: #ffffff;
			}
		}

		&--today {
			border-style: solid;
		}

		&--disabled {
			opacity: 0.4;
		}
	}

	&__hint {
		padding: 4px 0 10px;
		text-align: center;

		&__text {
			font-size: 12px;
			color: var(--up-tips-color, $u-tips-color);
		}
	}

	&__panel {
		padding: 0 8px 8px;
	}

	&__panel-wrap {
		padding-top: 4px;
	}

	&__hint--panel {
		padding: 0 0 8px;
	}
}
</style>
