<template>
    <view class="u-datetime-picker">
        <view v-if="hasInput" class="u-datetime-picker__has-input"
            @click="onShowByClickInput"
        >
            <slot name="trigger" :value="inputValue">
				<up-input
					:readonly="!!showByClickInput"
					v-model="inputValue"
					v-bind="inputPropsInner"
				></up-input>
				<div class="input-cover">
				</div>
			</slot>
        </view>
        <u-picker
            ref="picker"
            :show="show || (hasInput && showByClickInput)"
            :popupMode="popupMode"
            :closeOnClickOverlay="closeOnClickOverlay"
            :columns="columns"
            :title="title"
            :itemHeight="itemHeight"
            :showToolbar="showToolbar"
            :visibleItemCount="visibleItemCount"
            :defaultIndex="innerDefaultIndex"
            :cancelText="cancelText"
            :confirmText="confirmText"
            :cancelColor="cancelColor"
            :confirmColor="confirmColor"
            :toolbarRightSlot="toolbarRightSlot"
            @close="close"
            @cancel="cancel"
            @confirm="confirm"
            @change="change"
        >
            <template #toolbar-right>
                <slot name="toolbar-right">
                </slot>
            </template>
            <template #toolbar-bottom>
                <slot name="toolbar-bottom">
                </slot>
            </template>
        </u-picker>
    </view>
</template>

<script>
	function times(n, iteratee) {
	    let index = -1
	    const result = Array(n < 0 ? 0 : n)
	    while (++index < n) {
	        result[index] = iteratee(index)
	    }
	    return result
	}
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	import dayjs from 'dayjs/esm/index';
	import { range, error, padZero } from '../../libs/function/index';
	import test from '../../libs/function/test';
	/**
	 * DatetimePicker 时间日期选择器
	 * @description 此选择器用于时间日期
	 * @tutorial https://ijry.github.io/uview-plus/components/datetimePicker.html
	 * @property {Boolean}			show				用于控制选择器的弹出与收起 ( 默认 false )
	 * @property {Boolean}			showToolbar			是否显示顶部的操作栏  ( 默认 true )
	 * @property {String | Number}	modelValue		    绑定值
	 * @property {String}			title				顶部标题
	 * @property {String}			mode				展示格式 mode=date为日期选择，mode=time为时间选择，mode=year-month为年月选择，mode=datetime为日期时间选择  ( 默认 ‘datetime )
	 * @property {Number}			maxDate				可选的最大时间  默认值为后10年
	 * @property {Number}			minDate				可选的最小时间  默认值为前10年
	 * @property {Number}			minHour				可选的最小小时，仅mode=time有效   ( 默认 0 )
	 * @property {Number}			maxHour				可选的最大小时，仅mode=time有效	  ( 默认 23 )
	 * @property {Number}			minMinute			可选的最小分钟，仅mode=time有效	  ( 默认 0 )
	 * @property {Number}			maxMinute			可选的最大分钟，仅mode=time有效   ( 默认 59 )
	 * @property {Function}			filter				选项过滤函数
	 * @property {Function}			formatter			选项格式化函数
	 * @property {Boolean}			loading				是否显示加载中状态   ( 默认 false )
	 * @property {String | Number}	itemHeight			各列中，单个选项的高度   ( 默认 44 )
	 * @property {String}			cancelText			取消按钮的文字  ( 默认 '取消' )
	 * @property {String}			confirmText			确认按钮的文字  ( 默认 '确认' )
	 * @property {String}			cancelColor			取消按钮的颜色  ( 默认 '#909193' )
	 * @property {String}			confirmColor		确认按钮的颜色  ( 默认 '#3c9cff' )
	 * @property {String | Number}	visibleItemCount	每列中可见选项的数量  ( 默认 5 )
	 * @property {Boolean}			closeOnClickOverlay	是否允许点击遮罩关闭选择器  ( 默认 false )
	 * @property {Array}			defaultIndex		各列的默认索引
	 * @event {Function} close 关闭选择器时触发
	 * @event {Function} confirm 点击确定按钮，返回当前选择的值
	 * @event {Function} change 当选择值变化时触发
	 * @event {Function} cancel 点击取消按钮
	 * @example  <u-datetime-picker :show="show" :value="value1"  mode="datetime" ></u-datetime-picker>
	 */
	export default {
		name: 'up-datetime-picker',
		mixins: [mpMixin, mixin, props],
		data() {
			return {
                // 原来的日期选择器不方便，这里增加一个hasInput选项支持类似element的自带输入框的功能。
                inputValue: '', // 表单显示值
                showByClickInput: false, // 是否在hasInput模式下显示日期选择弹唱
				columns: [],
				innerDefaultIndex: [],
				innerFormatter: (type, value) => value
			}
		},
		watch: {
			show(newValue, oldValue) {
				if (newValue) {
					// #ifdef VUE3
					this.innerValue = this.correctValue(this.modelValue)
					// #endif
					// #ifdef VUE2
					this.innerValue = this.correctValue(this.value)
					// #endif
					this.updateColumnValue(this.innerValue)
				}
			},
			// #ifdef VUE3
			modelValue(newValue) {
				this.init()
				// this.getInputValue(newValue)
			},
			// #endif
			// #ifdef VUE2
			value(newValue) {
				this.init()
				// this.getInputValue(newValue)
			},
			// #endif
			propsChange() {
				this.init()
			}
		},
		computed: {
			// 如果以下这些变量发生了变化，意味着需要重新初始化各列的值
			propsChange() {
				return [this.mode, this.maxDate, this.minDate, this.minHour, this.maxHour, this.minMinute, this.maxMinute, this.filter, this.modelValue]
			},
			// input的props
			inputPropsInner() {
				return {
					border: this.inputBorder,
            		placeholder: this.placeholder,
					disabled: this.disabled,
					disabledColor: this.disabledColor,
					...this.inputProps
				}
			}
		},
		mounted() {
			this.init()
		},
		// #ifdef VUE3
		emits: ['close', 'cancel', 'confirm', 'change', 'update:modelValue'],
		// #endif
		methods: {
			getInputValue(newValue) {
				if (newValue == '' || !newValue || newValue == undefined) {
					this.inputValue = ''
					return
				}
				if (this.mode == 'time') {
					this.inputValue = newValue
				} else {
					if (this.format) {
						this.inputValue = dayjs(newValue).format(this.format)
					} else {
						let format = ''
						switch (this.mode) {
							case 'date':
								format = 'YYYY-MM-DD'
								break;
							case 'year-month':
								format = 'YYYY-MM'
								break;
							case 'datetime':
								format = 'YYYY-MM-DD HH:mm'
								break;
							case 'time':
								format = 'HH:mm'
								break;
							default:
								break;
						}
						this.inputValue = dayjs(newValue).format(format)
					}
				}
			},
			init() {
				// #ifdef VUE3
				this.innerValue = this.correctValue(this.modelValue)
				// #endif
				// #ifdef VUE2
				this.innerValue = this.correctValue(this.value)
				// #endif
				this.updateColumnValue(this.innerValue)

				// 初始化hasInput展示
				this.getInputValue(this.innerValue)
			},
			// 在微信小程序中，不支持将函数当做props参数，故只能通过ref形式调用
			setFormatter(e) {
				this.innerFormatter = e
			},
			// 关闭选择器
			close() {
				if (this.closeOnClickOverlay) {
					this.$emit('close')
				}
			},
			// 点击工具栏的取消按钮
			cancel() {
                if (this.hasInput) {
                    this.showByClickInput = false
                }
				this.$emit('cancel')
			},
			// 点击工具栏的确定按钮
			confirm() {
				// #ifdef VUE3
				this.$emit('update:modelValue', this.innerValue)
				// #endif
				// #ifdef VUE2
				this.$emit('input', this.innerValue)
				// #endif
                if (this.hasInput) {
					this.getInputValue(this.innerValue)
                    this.showByClickInput = false
                }
				this.$emit('confirm', {
					value: this.innerValue,
					mode: this.mode
				})
			},
			//用正则截取输出值,当出现多组数字时,抛出错误
			intercept(e,type){
				let judge = e.match(/\d+/g)
				//判断是否掺杂数字
				if(judge.length>1){
					error("请勿在过滤或格式化函数时添加数字")
					return 0
				}else if(type&&judge[0].length==4){//判断是否是年份
					return judge[0]
				}else if(judge[0].length>2){
					error("请勿在过滤或格式化函数时添加数字")
					return 0
				}else{
					return judge[0]
				}
			},
			// 列发生变化时触发
			change(e) {
				const { indexs, values } = e
				let selectValue = ''
				if(this.mode === 'time') {
					// 根据value各列索引，从各列数组中，取出当前时间的选中值
					selectValue = `${this.intercept(values[0][indexs[0]])}:${this.intercept(values[1][indexs[1]])}`
				} else {
					// 将选择的值转为数值，比如'03'转为数值的3，'2019'转为数值的2019
					const year = parseInt(this.intercept(values[0][indexs[0]],'year'))
					const month = parseInt(this.intercept(values[1][indexs[1]]))
					let date = parseInt(values[2] ? this.intercept(values[2][indexs[2]]) : 1)
					let hour = 0, minute = 0
					// 此月份的最大天数
					const maxDate = dayjs(`${year}-${month}`).daysInMonth()
					// year-month模式下，date不会出现在列中，设置为1，为了符合后边需要减1的需求
					if (this.mode === 'year-month') {
					    date = 1
					}
					// 不允许超过maxDate值
					date = Math.min(maxDate, date)
					if (this.mode === 'datetime') {
					    hour = parseInt(this.intercept(values[3][indexs[3]]))
					    minute = parseInt(this.intercept(values[4][indexs[4]]))
					}
					// 转为时间模式
					selectValue = Number(new Date(year, month - 1, date, hour, minute))
				}
				// 取出准确的合法值，防止超越边界的情况
				selectValue = this.correctValue(selectValue)
				this.innerValue = selectValue
				this.updateColumnValue(selectValue)
				// 发出change时间，value为当前选中的时间戳
				this.$emit('change', {
					value: selectValue,
					// #ifndef MP-WEIXIN
					// 微信小程序不能传递this实例，会因为循环引用而报错
					// picker: this.$refs.picker,
					// #endif
					mode: this.mode
				})
			},
			// 更新各列的值，进行补0、格式化等操作
			updateColumnValue(value) {
				this.innerValue = value
				this.updateColumns()
				// 延迟执行,等待u-picker组件列数据更新完后再设置选中值索引
				setTimeout(() => {
				this.updateIndexs(value)
				}, 0);
			},
			// 更新索引
			updateIndexs(value) {
				let values = []
				const formatter = this.formatter || this.innerFormatter
				if (this.mode === 'time') {
					// 将time模式的时间用:分隔成数组
				    const timeArr = value.split(':')
					// 使用formatter格式化方法进行管道处理
				    values = [formatter('hour', timeArr[0]), formatter('minute', timeArr[1])]
				} else {
				    const date = new Date(value)
				    values = [
				        formatter('year', `${dayjs(value).year()}`),
						// 月份补0
				        formatter('month', padZero(dayjs(value).month() + 1))
				    ]
				    if (this.mode === 'date') {
						// date模式，需要添加天列
				        values.push(formatter('day', padZero(dayjs(value).date())))
				    }
				    if (this.mode === 'datetime') {
						// 数组的push方法，可以写入多个参数
				        values.push(formatter('day', padZero(dayjs(value).date())), formatter('hour', padZero(dayjs(value).hour())), formatter('minute', padZero(dayjs(value).minute())))
				    }
				}

				// 根据当前各列的所有值，从各列默认值中找到默认值在各列中的索引
				const indexs = this.columns.map((column, index) => {
					// 通过取大值，可以保证不会出现找不到索引的-1情况
					return Math.max(0, column.findIndex(item => item === values[index]))
				})
				this.innerDefaultIndex = indexs
			},
			// 更新各列的值
			updateColumns() {
			    const formatter = this.formatter || this.innerFormatter
				// 获取各列的值，并且map后，对各列的具体值进行补0操作
			    const results = this.getOriginColumns().map((column) => column.values.map((value) => formatter(column.type, value)))
				this.columns = results
			},
			getOriginColumns() {
			    // 生成各列的值
			    const results = this.getRanges().map(({ type, range }) => {
			        let values = times(range[1] - range[0] + 1, (index) => {
			            let value = range[0] + index
			            value = type === 'year' ? `${value}` : padZero(value)
			            return value
			        })
					// 进行过滤
			        if (this.filter) {
			            values = this.filter(type, values)
						if (!values || (values && values.length == 0)) {
							// uni.showToast({
							// 	title: '日期filter结果不能为空',
							// 	icon: 'error',
							// 	mask: true
							// })
							console.log('日期filter结果不能为空')
						}
			        }
			        return { type, values }
			    })
			    return results
			},
			// 通过最大值和最小值生成数组
			generateArray(start, end) {
				return Array.from(new Array(end + 1).keys()).slice(start)
			},
			// 得出合法的时间
			correctValue(value) {
				const isDateMode = this.mode !== 'time'
				// if (isDateMode && !test.date(value)) {
				if (isDateMode && !dayjs.unix(value).isValid()) {
					// 如果是日期类型，但是又没有设置合法的当前时间的话，使用最小时间为当前时间
					value = this.minDate
				} else if (!isDateMode && !value) {
					// 如果是时间类型，而又没有默认值的话，就用最小时间
					value = `${padZero(this.minHour)}:${padZero(this.minMinute)}`
				}
				// 时间类型
				if (!isDateMode) {
					if (String(value).indexOf(':') === -1) return error('时间错误，请传递如12:24的格式')
					let [hour, minute] = value.split(':')
					// 对时间补零，同时控制在最小值和最大值之间
					hour = padZero(range(this.minHour, this.maxHour, Number(hour)))
					minute = padZero(range(this.minMinute, this.maxMinute, Number(minute)))
					return `${ hour }:${ minute }`
				} else {
					// 如果是日期格式，控制在最小日期和最大日期之间
					value = dayjs(value).isBefore(dayjs(this.minDate)) ? this.minDate : value
					value = dayjs(value).isAfter(dayjs(this.maxDate)) ? this.maxDate : value
					return value
				}
			},
			// 获取每列的最大和最小值
			getRanges() {
			    if (this.mode === 'time') {
			        return [
			            {
			                type: 'hour',
			                range: [this.minHour, this.maxHour],
			            },
			            {
			                type: 'minute',
			                range: [this.minMinute, this.maxMinute],
			            },
			        ];
			    }
			    const { maxYear, maxDate, maxMonth, maxHour, maxMinute, } = this.getBoundary('max', this.innerValue);
			    const { minYear, minDate, minMonth, minHour, minMinute, } = this.getBoundary('min', this.innerValue);
			    const result = [
			        {
			            type: 'year',
			            range: [minYear, maxYear],
			        },
			        {
			            type: 'month',
			            range: [minMonth, maxMonth],
			        },
			        {
			            type: 'day',
			            range: [minDate, maxDate],
			        },
			        {
			            type: 'hour',
			            range: [minHour, maxHour],
			        },
			        {
			            type: 'minute',
			            range: [minMinute, maxMinute],
			        },
			    ];
			    if (this.mode === 'date')
			        result.splice(3, 2);
			    if (this.mode === 'year-month')
			        result.splice(2, 3);
			    return result;
			},
			// 根据minDate、maxDate、minHour、maxHour等边界值，判断各列的开始和结束边界值
			getBoundary(type, innerValue) {
			    let value = new Date(innerValue)
                if(isNaN(value.getTime())){
                    value = new Date()
                }
			    const boundary = new Date(this[`${type}Date`])
			    const year = dayjs(boundary).year()
			    let month = 1
			    let date = 1
			    let hour = 0
			    let minute = 0
			    if (type === 'max') {
			        month = 12
					// 月份的天数
			        date = dayjs(value).daysInMonth()
			        hour = 23
			        minute = 59
			    }
				// 获取边界值，逻辑是：当年达到了边界值(最大或最小年)，就检查月允许的最大和最小值，以此类推
			    if (dayjs(value).year() === year) {
			        month = dayjs(boundary).month() + 1
			        if (dayjs(value).month() + 1 === month) {
			            date = dayjs(boundary).date()
			            if (dayjs(value).date() === date) {
			                hour = dayjs(boundary).hour()
			                if (dayjs(value).hour() === hour) {
			                    minute = dayjs(boundary).minute()
			                }
			            }
			        }
			    }
			    return {
			        [`${type}Year`]: year,
			        [`${type}Month`]: month,
			        [`${type}Date`]: date,
			        [`${type}Hour`]: hour,
			        [`${type}Minute`]: minute
			    }
			},
			onShowByClickInput(){
				if(!this.disabled){
					this.showByClickInput = !this.showByClickInput
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-datetime-picker {
		flex: 1;
        &__has-input {
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: center;
            /* #ifndef APP-NVUE */
            width: 100%;
            /* #endif */
			.input-cover {
				opacity: 0;
				position: absolute;
				top: 0;
				bottom: 0;
				left:0;
				right:0;
				display: flex;
				flex-direction: column;
				justify-content: center;
				border-radius: 4px;
				border: 1px solid #eee;
				padding: 0 10px;
			}
        }
	}
</style>
