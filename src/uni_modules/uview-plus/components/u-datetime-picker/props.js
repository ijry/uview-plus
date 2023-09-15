import defProps from '../../libs/config/props';
const defprops = uni?.$u?.props || defProps;
export default {
    props: {
        // 是否打开组件
        show: {
            type: Boolean,
            default: defprops.datetimePicker.show
        },
        // 是否展示顶部的操作栏
        showToolbar: {
            type: Boolean,
            default: defprops.datetimePicker.showToolbar
        },
        // #ifdef VUE2
        // 绑定值
        value: {
            type: [String, Number],
            default: defprops.datetimePicker.value
        },
        // #endif
        // #ifdef VUE3
        // 绑定值
        modelValue: {
            type: [String, Number],
            default: defprops.datetimePicker.value
        },
        // #endif
        // 顶部标题
        title: {
            type: String,
            default: defprops.datetimePicker.title
        },
        // 展示格式，mode=date为日期选择，mode=time为时间选择，mode=year-month为年月选择，mode=datetime为日期时间选择
        mode: {
            type: String,
            default: defprops.datetimePicker.mode
        },
        // 可选的最大时间
        maxDate: {
            type: Number,
            // 最大默认值为后10年
            default: defprops.datetimePicker.maxDate
        },
        // 可选的最小时间
        minDate: {
            type: Number,
            // 最小默认值为前10年
            default: defprops.datetimePicker.minDate
        },
        // 可选的最小小时，仅mode=time有效
        minHour: {
            type: Number,
            default: defprops.datetimePicker.minHour
        },
        // 可选的最大小时，仅mode=time有效
        maxHour: {
            type: Number,
            default: defprops.datetimePicker.maxHour
        },
        // 可选的最小分钟，仅mode=time有效
        minMinute: {
            type: Number,
            default: defprops.datetimePicker.minMinute
        },
        // 可选的最大分钟，仅mode=time有效
        maxMinute: {
            type: Number,
            default: defprops.datetimePicker.maxMinute
        },
        // 选项过滤函数
        filter: {
            type: [Function, null],
            default: defprops.datetimePicker.filter
        },
        // 选项格式化函数
        formatter: {
            type: [Function, null],
            default: defprops.datetimePicker.formatter
        },
        // 是否显示加载中状态
        loading: {
            type: Boolean,
            default: defprops.datetimePicker.loading
        },
        // 各列中，单个选项的高度
        itemHeight: {
            type: [String, Number],
            default: defprops.datetimePicker.itemHeight
        },
        // 取消按钮的文字
        cancelText: {
            type: String,
            default: defprops.datetimePicker.cancelText
        },
        // 确认按钮的文字
        confirmText: {
            type: String,
            default: defprops.datetimePicker.confirmText
        },
        // 取消按钮的颜色
        cancelColor: {
            type: String,
            default: defprops.datetimePicker.cancelColor
        },
        // 确认按钮的颜色
        confirmColor: {
            type: String,
            default: defprops.datetimePicker.confirmColor
        },
        // 每列中可见选项的数量
        visibleItemCount: {
            type: [String, Number],
            default: defprops.datetimePicker.visibleItemCount
        },
        // 是否允许点击遮罩关闭选择器
        closeOnClickOverlay: {
            type: Boolean,
            default: defprops.datetimePicker.closeOnClickOverlay
        },
        // 各列的默认索引
        defaultIndex: {
            type: Array,
            default: defprops.datetimePicker.defaultIndex
        }
    }
}
