<template>
	<u-popup
		:show="show"
		mode="bottom"
		:closeable="!pageInline"
		@close="close"
		:round="round"
		:pageInline="pageInline"
		:closeOnClickOverlay="closeOnClickOverlay"
	>
		<view class="u-calendar">
			<uHeader
				:title="title"
				:subtitle="subtitle"
				:showSubtitle="showSubtitle"
				:showTitle="showTitle"
				:weekText="weekText"
				:showSwitch="monthSwitch"
				:showToday="showToday"
				:todayText="todayText"
				:todayDisabled="todayDisabled"
				:prevDisabled="switchPrevDisabled"
				:nextDisabled="switchNextDisabled"
				:prevYearDisabled="switchPrevYearDisabled"
				:nextYearDisabled="switchNextYearDisabled"
				@prev="prevMonth"
				@next="nextMonth"
				@prevYear="prevYear"
				@nextYear="nextYear"
				@today="jumpToToday"
			></uHeader>
			<view v-if="showTimePanel" class="u-calendar__time-panel">
				<view v-if="mode === 'single'" class="u-calendar__time-row">
					<text class="u-calendar__time-date">{{ singleDateLabel }}</text>
					<view class="u-calendar__time-trigger" @click="openTimePicker('single')">
						<text class="u-calendar__time-text">{{ singleTime }}</text>
					</view>
				</view>
				<view v-else-if="mode === 'range' && rangeResultMode === 'boundary'">
					<view class="u-calendar__time-row">
						<text class="u-calendar__time-date">{{ rangeStartDateLabel }}</text>
						<view class="u-calendar__time-trigger" @click="openTimePicker('start')">
							<text class="u-calendar__time-text">{{ rangeStartTime }}</text>
						</view>
					</view>
					<view class="u-calendar__time-row">
						<text class="u-calendar__time-date">{{ rangeEndDateLabel }}</text>
						<view class="u-calendar__time-trigger" @click="openTimePicker('end')">
							<text class="u-calendar__time-text">{{ rangeEndTime }}</text>
						</view>
					</view>
				</view>
			</view>
			<scroll-view
				v-if="!monthSwitch"
				:style="{
                    height: addUnit(listHeight, 'px')
                }"
				scroll-y
				@scroll="onScroll"
				:scroll-top="scrollTop"
				:scrollIntoView="scrollIntoView"
			>
				<uMonth
					:color="color"
					:rowHeight="rowHeight"
					:showMark="showMark"
					:months="months"
					:mode="mode"
					:maxCount="maxCount"
					:startText="startText"
					:endText="endText"
					:defaultDate="defaultDate"
					:minDate="innerMinDate"
					:maxDate="innerMaxDate"
					:maxMonth="monthNum"
					:readonly="readonly"
					:maxRange="maxRange"
					:rangePrompt="rangePrompt"
					:showRangePrompt="showRangePrompt"
					:allowSameDay="allowSameDay"
					:forbidDays="forbidDays"
					:forbidDaysToast="forbidDaysToast"
					:monthFormat="monthFormat"
					:todayDate="todayDate"
					:todayColor="todayColor"
					ref="month"
					@monthSelected="monthSelected"
					@updateMonthTop="onUpdateMonthTop"
				></uMonth>
			</scroll-view>
			<view
				v-else
				:style="{
                    height: addUnit(listHeight, 'px')
                }"
			>
				<uMonth
					:color="color"
					:rowHeight="rowHeight"
					:showMark="showMark"
					:months="currentMonths"
					:mode="mode"
					:maxCount="maxCount"
					:startText="startText"
					:endText="endText"
					:defaultDate="defaultDate"
					:minDate="innerMinDate"
					:maxDate="innerMaxDate"
					:maxMonth="monthNum"
					:readonly="readonly"
					:maxRange="maxRange"
					:rangePrompt="rangePrompt"
					:showRangePrompt="showRangePrompt"
					:allowSameDay="allowSameDay"
					:forbidDays="forbidDays"
					:forbidDaysToast="forbidDaysToast"
					:monthFormat="monthFormat"
					:todayDate="todayDate"
					:todayColor="todayColor"
					ref="month"
					@monthSelected="monthSelected"
					@updateMonthTop="onUpdateMonthTop"
				></uMonth>
			</view>
			<slot name="footer" v-if="showConfirm">
				<view class="u-calendar__confirm">
					<u-button
						shape="circle"
						:text="
                            buttonDisabled ? confirmDisabledText : confirmText
                        "
						:color="color"
						@click="confirm"
						:disabled="buttonDisabled"
					></u-button>
				</view>
			</slot>
		</view>
	</u-popup>
	<u-popup
		:show="timePickerShow"
		mode="center"
		:round="8"
		:closeOnClickOverlay="true"
		@close="closeTimePicker"
	>
		<view class="u-calendar__time-picker">
			<view class="u-calendar__time-picker__header">
				<text class="u-calendar__time-picker__cancel" @click="closeTimePicker">取消</text>
				<text class="u-calendar__time-picker__title">选择时间</text>
				<text class="u-calendar__time-picker__confirm" @click="confirmTimePicker">确定</text>
			</view>
			<picker-view class="u-calendar__time-picker__body" :value="timePickerValue" @change="onTimePickerChange">
				<picker-view-column>
					<view v-for="(item, index) in hourOptions" :key="`h-${index}`" class="u-calendar__time-picker__item">{{ item }}</view>
				</picker-view-column>
				<picker-view-column v-if="timePrecision !== 'hour'">
					<view v-for="(item, index) in minuteOptions" :key="`m-${index}`" class="u-calendar__time-picker__item">{{ item }}</view>
				</picker-view-column>
				<picker-view-column v-if="timePrecision === 'second'">
					<view v-for="(item, index) in secondOptions" :key="`s-${index}`" class="u-calendar__time-picker__item">{{ item }}</view>
				</picker-view-column>
			</picker-view>
		</view>
	</u-popup>
</template>

<script>
import uHeader from './header.vue'
import uMonth from './month.vue'
import { props } from './props.js'
import util from './util.js'
import dayjs from '../u-datetime-picker/dayjs.esm.min.js';
import Calendar from '../../libs/util/calendar.js'
import { mpMixin } from '../../libs/mixin/mpMixin.js'
import { mixin } from '../../libs/mixin/mixin.js'
import { addUnit, getPx, range, error, padZero } from '../../libs/function/index';
import test from '../../libs/function/test';
import { t } from '../../libs/i18n'
/**
 * Calendar 日历
 * @description  此组件用于单个选择日期，范围选择日期等，日历被包裹在底部弹起的容器中.
 * @tutorial https://uview-plus.jiangruyi.com/components/calendar.html
 *
 * @property {String}				title				标题内容 (默认 日期选择 )
 * @property {Boolean}				showTitle			是否显示标题  (默认 true )
 * @property {Boolean}				showSubtitle		是否显示副标题	(默认 true )
 * @property {String}				mode				日期类型选择  single-选择单个日期，multiple-可以选择多个日期，range-选择日期范围 （ 默认 'single' )
 * @property {String}				startText			mode=range时，第一个日期底部的提示文字  (默认 '开始' )
 * @property {String}				endText				mode=range时，最后一个日期底部的提示文字 (默认 '结束' )
 * @property {Array}				customList			自定义列表
 * @property {String}				color				主题色，对底部按钮和选中日期有效  (默认 ‘#3c9cff' )
 * @property {String | Number}		minDate				最小的可选日期	 (默认 0 )
 * @property {String | Number}		maxDate				最大可选日期  (默认 0 )
 * @property {Array | String| Date}	defaultDate			默认选中的日期，mode为multiple或range是必须为数组格式
 * @property {String | Number}		maxCount			mode=multiple时，最多可选多少个日期  (默认 	Number.MAX_SAFE_INTEGER  )
 * @property {String | Number}		rowHeight			日期行高 (默认 56 )
 * @property {Function}				formatter			日期格式化函数
 * @property {Boolean}				showLunar			是否显示农历  (默认 false )
 * @property {Boolean}				showMark			是否显示月份背景色 (默认 true )
 * @property {String}				confirmText			确定按钮的文字 (默认 '确定' )
 * @property {String}				confirmDisabledText	确认按钮处于禁用状态时的文字 (默认 '确定' )
 * @property {Boolean}				show				是否显示日历弹窗 (默认 false )
 * @property {Boolean}				closeOnClickOverlay	是否允许点击遮罩关闭日历 (默认 false )
 * @property {Boolean}				readonly	        是否为只读状态，只读状态下禁止选择日期 (默认 false )
 * @property {String | Number}		maxRange	        日期区间最多可选天数，默认无限制，mode = range时有效
 * @property {String}				rangePrompt	        范围选择超过最多可选天数时的提示文案，mode = range时有效
 * @property {Boolean}				showRangePrompt	    范围选择超过最多可选天数时，是否展示提示文案，mode = range时有效 (默认 true )
 * @property {Boolean}				allowSameDay	    是否允许日期范围的起止时间为同一天，mode = range时有效 (默认 false )
 * @property {String}				rangeResultMode	    区间模式下确认返回值格式，all-返回区间内所有日期，boundary-仅返回起止日期 (默认 'all' )
 * @property {Boolean}				enableTime			是否开启时分秒选择 (默认 false )
 * @property {String}				timePrecision		时间精度，hour-仅时，minute-时分，second-时分秒 (默认 'minute' )
 * @property {String}				defaultTime			默认时间，支持HH/HH:mm/HH:mm:ss，不传则按00:00补齐
 * @property {Number|String}	    round				圆角值，默认无圆角  (默认 0 )
 * @property {Number|String}	    monthNum			最多展示的月份数量  (默认 3 )
 * @property {Boolean}	            monthSwitch			是否启用非滚动的单月切换模式  (默认 false )
 * @property {String}	            todayColor			今天日期的独立高亮颜色，默认跟随主题色
 * @property {Array}	            weekText			星期文案  (默认 ['一', '二', '三', '四', '五', '六', '日'] )
 *
 * @event {Function()} confirm 		点击确定按钮时触发		选择日期相关的返回参数
 * @event {Function()} close 		日历关闭时触发			可定义页面关闭时的回调事件
 * @example <u-calendar  :defaultDate="defaultDateMultiple" :show="show" mode="multiple" @confirm="confirm">
	</u-calendar>
 * */
export default {
	name: 'u-calendar',
	mixins: [mpMixin, mixin, props],
	components: {
		uHeader,
		uMonth
	},
	data() {
		return {
			// 需要显示的月份的数组
			months: [],
			// 在月份滚动区域中，当前视图中月份的index索引
			monthIndex: 0,
			// 月份滚动区域的高度
			listHeight: 0,
			// month组件中选择的日期数组
			selected: [],
			scrollIntoView: '',
			scrollIntoViewScroll: '',
			scrollTop:0,
			timePickerShow: false,
			timePickerTarget: 'single',
			timePickerValue: [0, 0, 0],
			hourOptions: [],
			minuteOptions: [],
			secondOptions: [],
			singleTime: '00:00',
			rangeStartTime: '00:00',
			rangeEndTime: '00:00',
			// 过滤处理方法
			innerFormatter: (value) => value
		}
	},
	watch: {
		scrollIntoView: {
			immediate: true,
			handler(n) {
				// console.log('scrollIntoView', n)
			}
		},
		selectedChange: {
			immediate: true,
			handler(n) {
				this.setMonth()
			}
		},
		timePrecision() {
			this.initTimeOptions()
			this.initTimeValues()
		},
		defaultTime() {
			this.initTimeValues()
		},
		// 打开弹窗时，设置月份数据
		show: {
			immediate: true,
			handler(n) {
				if (n) {
					this.setMonth()
				} else {
					// 关闭时重置scrollIntoView，否则会出现二次打开日历，当前月份数据显示不正确。
					// scrollIntoView需要有一个值变动过程，才会产生作用。
					this.scrollIntoView = ''
				}
			}
		}
	},
	computed: {
		// 由于maxDate和minDate可以为字符串(2021-10-10)，或者数值(时间戳)，但是dayjs如果接受字符串形式的时间戳会有问题，这里进行处理
		innerMaxDate() {
			return test.number(this.maxDate)
				? Number(this.maxDate)
				: this.maxDate
		},
		innerMinDate() {
			return test.number(this.minDate)
				? Number(this.minDate)
				: this.minDate
		},
		todayDate() {
			return dayjs().format('YYYY-MM-DD')
		},
		todayText() {
			return t('up.calendar.today')
		},
		todayDisabled() {
			const today = dayjs(this.todayDate)
			const minDate = this.innerMinDate
				? dayjs(this.innerMinDate)
				: null
			const maxDate = this.innerMaxDate
				? dayjs(this.innerMaxDate)
				: null
			if (minDate && today.isBefore(minDate, 'day')) {
				return true
			}
			if (maxDate && today.isAfter(maxDate, 'day')) {
				return true
			}
			return false
		},
		// 多个条件的变化，会引起选中日期的变化，这里统一管理监听
		selectedChange() {
			return [this.innerMinDate, this.innerMaxDate, this.defaultDate]
		},
		subtitle() {
			// 初始化时，this.months为空数组，所以需要特别判断处理
			if (this.months.length) {
				if (uni.getLocale() == 'zh-Hans' || uni.getLocale() == 'zh-Hant') {
					return this.months[this.monthIndex].year + '年' + (this.months[this.monthIndex].month < 10 ? '0' + this.months[this.monthIndex].month : this.months[this.monthIndex].month) + '月'
				} else {
					return (this.months[this.monthIndex].month < 10 ? '0' + this.months[this.monthIndex].month : this.months[this.monthIndex].month) + '/' + this.months[this.monthIndex].year
				}
			} else {
				return ''
			}
		},
		currentMonths() {
			if (this.monthSwitch && this.months.length) {
				return [this.months[this.monthIndex]]
			}
			return this.months
		},
		switchPrevDisabled() {
			return this.monthIndex <= 0
		},
		switchNextDisabled() {
			return this.monthIndex >= this.months.length - 1
		},
		switchPrevYearDisabled() {
			return this.monthIndex - 12 < 0
		},
		switchNextYearDisabled() {
			return this.monthIndex + 12 > this.months.length - 1
		},
		showTimePanel() {
			if (!this.enableTime) return false
			if (this.mode === 'single') return true
			if (this.mode === 'range' && this.rangeResultMode === 'boundary') {
				return true
			}
			return false
		},
		singleDateLabel() {
			return this.selected[0] || '--'
		},
		rangeStartDateLabel() {
			return this.selected[0] || '--'
		},
		rangeEndDateLabel() {
			if (this.selected.length >= 2) {
				return this.selected[this.selected.length - 1]
			}
			return '--'
		},
		buttonDisabled() {
			// 如果为range类型，且选择的日期个数不足1个时，让底部的按钮出于disabled状态
			if (this.mode === 'range') {
				if (this.selected.length <= 1) {
					return true
				} else {
					return false
				}
			} else {
				return false
			}
		}
	},
	mounted() {
		this.start = Date.now()
		this.init()
	},
	emits: ["confirm", "close"],
	methods: {
		addUnit,
		padTime(num) {
			return String(num).padStart(2, '0')
		},
		initTimeOptions() {
			this.hourOptions = Array.from({ length: 24 }, (_, i) => this.padTime(i))
			this.minuteOptions = Array.from({ length: 60 }, (_, i) => this.padTime(i))
			this.secondOptions = Array.from({ length: 60 }, (_, i) => this.padTime(i))
		},
		parseTimeValue(value = '') {
			const raw = String(value || '').trim()
			const parts = raw.length ? raw.split(':') : []
			const getNumber = (index, max) => {
				const current = Number(parts[index] || 0)
				if (Number.isNaN(current)) return 0
				return Math.max(0, Math.min(max, current))
			}
			const hour = getNumber(0, 23)
			const minute = getNumber(1, 59)
			const second = getNumber(2, 59)
			return [hour, minute, second]
		},
		getDefaultTimeValue() {
			const [hour, minute, second] = this.parseTimeValue(this.defaultTime)
			if (this.timePrecision === 'hour') {
				return this.padTime(hour)
			}
			if (this.timePrecision === 'second') {
				return `${this.padTime(hour)}:${this.padTime(minute)}:${this.padTime(second)}`
			}
			return `${this.padTime(hour)}:${this.padTime(minute)}`
		},
		initTimeValues() {
			const value = this.getDefaultTimeValue()
			this.singleTime = value
			this.rangeStartTime = value
			this.rangeEndTime = value
		},
		timeToPickerValue(value = '') {
			const [hour, minute, second] = this.parseTimeValue(value)
			return [hour, minute, second]
		},
		pickerValueToTime(value = []) {
			const hour = Number(value[0] || 0)
			const minute = Number(value[1] || 0)
			const second = Number(value[2] || 0)
			if (this.timePrecision === 'hour') {
				return this.padTime(hour)
			}
			if (this.timePrecision === 'second') {
				return `${this.padTime(hour)}:${this.padTime(minute)}:${this.padTime(second)}`
			}
			return `${this.padTime(hour)}:${this.padTime(minute)}`
		},
		openTimePicker(target) {
			this.timePickerTarget = target
			let currentValue = this.singleTime
			if (target === 'start') currentValue = this.rangeStartTime
			if (target === 'end') currentValue = this.rangeEndTime
			this.timePickerValue = this.timeToPickerValue(currentValue)
			this.timePickerShow = true
		},
		onTimePickerChange(e) {
			this.timePickerValue = e.detail.value
		},
		closeTimePicker() {
			this.timePickerShow = false
		},
		confirmTimePicker() {
			const value = this.pickerValueToTime(this.timePickerValue)
			if (this.timePickerTarget === 'single') this.singleTime = value
			if (this.timePickerTarget === 'start') this.rangeStartTime = value
			if (this.timePickerTarget === 'end') this.rangeEndTime = value
			this.timePickerShow = false
		},
		timeToSecond(timeText = '') {
			const [hour, minute, second] = this.parseTimeValue(timeText)
			return hour * 3600 + minute * 60 + second
		},
		validateSameDayRangeTime() {
			if (!this.enableTime || this.mode !== 'range' || this.rangeResultMode !== 'boundary') {
				return true
			}
			if (this.selected.length < 2) return true
			const startDate = this.selected[0]
			const endDate = this.selected[this.selected.length - 1]
			if (startDate !== endDate) return true
			const startSeconds = this.timeToSecond(this.rangeStartTime)
			const endSeconds = this.timeToSecond(this.rangeEndTime)
			if (endSeconds < startSeconds) {
				uni.showToast({
					title: '结束时间不能早于开始时间',
					icon: 'none'
				})
				return false
			}
			return true
		},
		appendTime(dateText, timeText) {
			return `${dateText} ${timeText}`
		},
		getConfirmValue(selected = this.selected) {
			let result = selected
			if (
				this.mode === 'range' &&
				this.rangeResultMode === 'boundary' &&
				selected.length >= 2
			) {
				const len = selected.length - 1
				result = [selected[0], selected[len]]
			}
			if (!this.showTimePanel || !this.enableTime) {
				return result
			}
			if (this.mode === 'single' && result.length >= 1) {
				return [this.appendTime(result[0], this.singleTime)]
			}
			if (this.mode === 'range' && this.rangeResultMode === 'boundary' && result.length >= 2) {
				return [
					this.appendTime(result[0], this.rangeStartTime),
					this.appendTime(result[1], this.rangeEndTime)
				]
			}
			return result
		},
		// 在微信小程序中，不支持将函数当做props参数，故只能通过ref形式调用
		setFormatter(e) {
			this.innerFormatter = e
		},
		// month组件内部选择日期后，通过事件通知给父组件
		monthSelected(e,scene ='init') {
			this.selected = e
			if (!this.showConfirm) {
				// 在不需要确认按钮的情况下，如果为单选，或者范围多选且已选长度大于2，则直接进行返还
				if (
					this.mode === 'multiple' ||
					this.mode === 'single' ||
					(this.mode === 'range' && this.selected.length >= 2)
				) {
				   if( scene === 'init'){
					 return
				   }
				   if( scene === 'tap') {
					 if (!this.validateSameDayRangeTime()) return
					 this.$emit('confirm', this.getConfirmValue())
				   }
				}
			}
		},
		init() {
			// 校验maxDate，不能小于minDate。
			if (
				this.innerMaxDate &&
                this.innerMinDate &&
				new Date(this.innerMaxDate).getTime() < new Date(this.innerMinDate).getTime()
			) {
				return error('maxDate不能小于minDate时间')
			}
			// 滚动区域的高度
			let bottomPadding = 0;
			if (this.pageInline) {
				bottomPadding = 0
			} else {
				bottomPadding = 30
			}
			this.listHeight = this.rowHeight * (this.monthSwitch ? 6 : 5) + bottomPadding
			this.initTimeOptions()
			this.initTimeValues()
			this.setMonth()
		},
		close() {
			this.$emit('close')
		},
		// 点击确定按钮
		confirm() {
			if (!this.buttonDisabled) {
				if (!this.validateSameDayRangeTime()) return
				this.$emit('confirm', this.getConfirmValue())
			}
		},
		// 获得两个日期之间的月份数
		getMonths(minDate, maxDate) {
			const minYear = dayjs(minDate).year()
			const minMonth = dayjs(minDate).month() + 1
			const maxYear = dayjs(maxDate).year()
			const maxMonth = dayjs(maxDate).month() + 1
			return (maxYear - minYear) * 12 + (maxMonth - minMonth) + 1
		},
		// 设置月份数据
		setMonth() {
			// 最小日期的毫秒数
			const minDate = this.innerMinDate || dayjs().valueOf()
			// 如果没有指定最大日期，则往后推3个月
			const maxDate =
				this.innerMaxDate ||
				dayjs(minDate)
					.add(this.monthNum - 1, 'month')
					.valueOf()
			// 最大最小月份之间的共有多少个月份，
			const months = range(
				1,
				this.monthNum,
				this.getMonths(minDate, maxDate)
			)
			// 先清空数组
			this.months = []
			for (let i = 0; i < months; i++) {
				this.months.push({
					date: new Array(
						dayjs(minDate).add(i, 'month').daysInMonth()
					)
						.fill(1)
						.map((item, index) => {
							// 日期，取值1-31
							let day = index + 1
							// 星期，0-6，0为周日
							const week = dayjs(minDate)
								.add(i, 'month')
								.date(day)
								.day()
							const date = dayjs(minDate)
								.add(i, 'month')
								.date(day)
								.format('YYYY-MM-DD')
							let bottomInfo = ''
							if (this.showLunar) {
								// 将日期转为农历格式
								const lunar = Calendar.solar2lunar(
									dayjs(date).year(),
									dayjs(date).month() + 1,
									dayjs(date).date()
								)
								bottomInfo = lunar.IDayCn
							}
							let config = {
								day,
								week,
								// 小于最小允许的日期，或者大于最大的日期，则设置为disabled状态
								disabled:
									dayjs(date).isBefore(
										dayjs(minDate).format('YYYY-MM-DD')
									) ||
									dayjs(date).isAfter(
										dayjs(maxDate).format('YYYY-MM-DD')
									),
								// 返回一个日期对象，供外部的formatter获取当前日期的年月日等信息，进行加工处理
								date: new Date(date),
								bottomInfo,
								dot: false,
								month:
									dayjs(minDate).add(i, 'month').month() + 1
							}
							const formatter =
								this.formatter || this.innerFormatter
							return formatter(config)
						}),
					// 当前所属的月份
					month: dayjs(minDate).add(i, 'month').month() + 1,
					// 当前年份
					year: dayjs(minDate).add(i, 'month').year()
				})
			}
			if (this.monthSwitch) {
				this.monthIndex = this.getDefaultMonthIndex()
			}
		},
		getDefaultMonthIndex() {
			let selected = dayjs().format('YYYY-MM')
			if (this.defaultDate) {
				if (!test.array(this.defaultDate)) {
					selected = dayjs(this.defaultDate).format('YYYY-MM')
				} else if (this.defaultDate.length) {
					selected = dayjs(this.defaultDate[0]).format('YYYY-MM')
				}
			}
			const index = this.months.findIndex(({ year, month }) => {
				return `${year}-${padZero(month)}` === selected
			})
			return index === -1 ? 0 : index
		},
		prevMonth() {
			if (!this.switchPrevDisabled) {
				this.monthIndex -= 1
			}
		},
		nextMonth() {
			if (!this.switchNextDisabled) {
				this.monthIndex += 1
			}
		},
		prevYear() {
			if (!this.switchPrevYearDisabled) {
				this.monthIndex -= 12
			}
		},
		nextYear() {
			if (!this.switchNextYearDisabled) {
				this.monthIndex += 12
			}
		},
		jumpToToday() {
			if (this.todayDisabled) {
				return
			}
			const targetMonth = dayjs(this.todayDate).format('YYYY-MM')
			const selectToday = () => {
				if (this.mode === 'range') {
					return
				}
				this.$refs.month && this.$refs.month.selectDate(this.todayDate)
			}
			if (this.monthSwitch) {
				const todayMonthIndex = this.months.findIndex(({ year, month }) => {
					return `${year}-${padZero(month)}` === targetMonth
				})
				if (todayMonthIndex !== -1) {
					this.monthIndex = todayMonthIndex
					this.$nextTick(selectToday)
				}
				return
			}
			this.scrollIntoDefaultMonth(targetMonth)
			this.$nextTick(selectToday)
		},
		// 滚动到默认设置的月份
		scrollIntoDefaultMonth(selected) {
			// 查询默认日期在可选列表的下标
			const _index = this.months.findIndex(({
				  year,
				  month
			  }) => {
				month = padZero(month)
				return `${year}-${month}` === selected
			})
			if (_index !== -1) {
				// #ifndef MP-WEIXIN
				this.$nextTick(() => {
					this.scrollIntoView = ''
					this.scrollIntoView = `month-${_index}`
					this.scrollIntoViewScroll = this.scrollIntoView
				})
				// #endif
				// #ifdef MP-WEIXIN
				this.scrollTop = this.months[_index].top || 0;
				// #endif
			}
		},
		// scroll-view滚动监听
		onScroll(event) {
			// 不允许小于0的滚动值，如果scroll-view到顶了，继续下拉，会出现负数值
			const scrollTop = Math.max(0, event.detail.scrollTop)
			// 将当前滚动条数值，除以滚动区域的高度，可以得出当前滚动到了哪一个月份的索引
			for (let i = 0; i < this.months.length; i++) {
				if (scrollTop >= (this.months[i].top || this.listHeight)) {
					this.monthIndex = i
					this.scrollIntoViewScroll = `month-${i}`
				}
			}
		},
		// 更新月份的top值
		onUpdateMonthTop(topArr = []) {
			if (this.monthSwitch) {
				return
			}
			this.updateMonthTop(topArr)
		},
		updateMonthTop(topArr = []) {
			// 设置对应月份的top值，用于onScroll方法更新月份
			topArr.map((item, index) => {
				this.months[index].top = item
			})

			// 获取默认日期的下标
			if (!this.defaultDate) {
				// 如果没有设置默认日期，则将当天日期设置为默认选中的日期
				const selected = dayjs().format("YYYY-MM")
				this.scrollIntoDefaultMonth(selected)
				return
			}
			let selected = dayjs().format("YYYY-MM");
			// 单选模式，可以是字符串或数组，Date对象等
			if (!test.array(this.defaultDate)) {
				selected = dayjs(this.defaultDate).format("YYYY-MM")
			} else {
				selected = dayjs(this.defaultDate[0]).format("YYYY-MM");
			}
			this.scrollIntoDefaultMonth(selected)
		}
	}
}
</script>

<style lang="scss" scoped>
.u-calendar {
	color: var(--up-main-color, $u-main-color);
	background-color: var(--up-card-bg-color, #ffffff);

	&__time-panel {
		padding: 8px 16px 0;
	}

	&__time-row {
		height: 34px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 6px;
	}

	&__time-date {
		font-size: 13px;
		color: #303133;
	}

	&__time-trigger {
		min-width: 92px;
		height: 30px;
		padding: 0 10px;
		border-radius: 15px;
		border: 1px solid #dcdfe6;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__time-text {
		font-size: 14px;
		color: #303133;
	}

	&__time-picker {
		width: 320px;
		background-color: #ffffff;
		border-radius: 8px;
		overflow: hidden;
	}

	&__time-picker__header {
		height: 44px;
		padding: 0 14px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #f0f0f0;
	}

	&__time-picker__cancel {
		font-size: 14px;
		color: #909399;
	}

	&__time-picker__title {
		font-size: 15px;
		color: #303133;
		font-weight: 600;
	}

	&__time-picker__confirm {
		font-size: 14px;
		color: #3c9cff;
	}

	&__time-picker__body {
		width: 320px;
		height: 200px;
	}

	&__time-picker__item {
		height: 40px;
		line-height: 40px;
		text-align: center;
		font-size: 16px;
		color: #303133;
	}

	&__confirm {
		padding: 7px 18px;
	}
}
</style>
