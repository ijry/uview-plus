import defprops from '../../libs/config/props';
export default {
    props: {
        // 日历顶部标题
        title: {
            type: String,
            default: defprops.calendar.title
        },
        // 是否显示标题
        showTitle: {
            type: Boolean,
            default: defprops.calendar.showTitle
        },
        // 是否显示副标题
        showSubtitle: {
            type: Boolean,
            default: defprops.calendar.showSubtitle
        },
        // 日期类型选择，single-选择单个日期，multiple-可以选择多个日期，range-选择日期范围
        mode: {
            type: String,
            default: defprops.calendar.mode
        },
        // mode=range时，第一个日期底部的提示文字
        startText: {
            type: String,
            default: defprops.calendar.startText
        },
        // mode=range时，最后一个日期底部的提示文字
        endText: {
            type: String,
            default: defprops.calendar.endText
        },
        // 自定义列表
        customList: {
            type: Array,
            default: defprops.calendar.customList
        },
        // 主题色，对底部按钮和选中日期有效
        color: {
            type: String,
            default: defprops.calendar.color
        },
        // 最小的可选日期
        minDate: {
            type: [String, Number],
            default: defprops.calendar.minDate
        },
        // 最大可选日期
        maxDate: {
            type: [String, Number],
            default: defprops.calendar.maxDate
        },
        // 默认选中的日期，mode为multiple或range是必须为数组格式
        defaultDate: {
            type: [Array, String, Date, null],
            default: defprops.calendar.defaultDate
        },
        // mode=multiple时，最多可选多少个日期
        maxCount: {
            type: [String, Number],
            default: defprops.calendar.maxCount
        },
        // 日期行高
        rowHeight: {
            type: [String, Number],
            default: defprops.calendar.rowHeight
        },
        // 日期格式化函数
        formatter: {
            type: [Function, null],
            default: defprops.calendar.formatter
        },
        // 是否显示农历
        showLunar: {
            type: Boolean,
            default: defprops.calendar.showLunar
        },
        // 是否显示月份背景色
        showMark: {
            type: Boolean,
            default: defprops.calendar.showMark
        },
        // 确定按钮的文字
        confirmText: {
            type: String,
            default: defprops.calendar.confirmText
        },
        // 确认按钮处于禁用状态时的文字
        confirmDisabledText: {
            type: String,
            default: defprops.calendar.confirmDisabledText
        },
        // 是否显示日历弹窗
        show: {
            type: Boolean,
            default: defprops.calendar.show
        },
        // 是否允许点击遮罩关闭日历
        closeOnClickOverlay: {
            type: Boolean,
            default: defprops.calendar.closeOnClickOverlay
        },
        // 是否为只读状态，只读状态下禁止选择日期
        readonly: {
            type: Boolean,
            default: defprops.calendar.readonly
        },
        // 	是否展示确认按钮
        showConfirm: {
            type: Boolean,
            default: defprops.calendar.showConfirm
        },
        // 日期区间最多可选天数，默认无限制，mode = range时有效
        maxRange: {
            type: [Number, String],
            default: defprops.calendar.maxRange
        },
        // 范围选择超过最多可选天数时的提示文案，mode = range时有效
        rangePrompt: {
            type: String,
            default: defprops.calendar.rangePrompt
        },
        // 范围选择超过最多可选天数时，是否展示提示文案，mode = range时有效
        showRangePrompt: {
            type: Boolean,
            default: defprops.calendar.showRangePrompt
        },
        // 是否允许日期范围的起止时间为同一天，mode = range时有效
        allowSameDay: {
            type: Boolean,
            default: defprops.calendar.allowSameDay
        },
		// 圆角值
		round: {
		    type: [Boolean, String, Number],
		    default: defprops.calendar.round
		},
		// 最多展示月份数量
		monthNum: {
			type: [Number, String],
			default: 3
		}	
    }
}
