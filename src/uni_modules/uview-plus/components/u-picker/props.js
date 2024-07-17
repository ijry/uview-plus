import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        modelValue: {
            type: Array,
            default: () => []
        },
        hasInput: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: () => '请选择'
        },
        // 是否展示picker弹窗
        show: {
            type: Boolean,
            default: () => defProps.picker.show
        },
		// 弹出的方向，可选值为 top bottom right left center
        popupMode: {
            type: String,
            default: () => defProps.picker.popupMode
        },
        // 是否展示顶部的操作栏
        showToolbar: {
            type: Boolean,
            default: () => defProps.picker.showToolbar
        },
        // 顶部标题
        title: {
            type: String,
            default: () => defProps.picker.title
        },
        // 对象数组，设置每一列的数据
        columns: {
            type: Array,
            default: () => defProps.picker.columns
        },
        // 是否显示加载中状态
        loading: {
            type: Boolean,
            default: () => defProps.picker.loading
        },
        // 各列中，单个选项的高度
        itemHeight: {
            type: [String, Number],
            default: () => defProps.picker.itemHeight
        },
        // 取消按钮的文字
        cancelText: {
            type: String,
            default: () => defProps.picker.cancelText
        },
        // 确认按钮的文字
        confirmText: {
            type: String,
            default: () => defProps.picker.confirmText
        },
        // 取消按钮的颜色
        cancelColor: {
            type: String,
            default: () => defProps.picker.cancelColor
        },
        // 确认按钮的颜色
        confirmColor: {
            type: String,
            default: () => defProps.picker.confirmColor
        },
        // 每列中可见选项的数量
        visibleItemCount: {
            type: [String, Number],
            default: () => defProps.picker.visibleItemCount
        },
        // 选项对象中，需要展示的属性键名
        keyName: {
            type: String,
            default: () => defProps.picker.keyName
        },
        // 是否允许点击遮罩关闭选择器
        closeOnClickOverlay: {
            type: Boolean,
            default: () => defProps.picker.closeOnClickOverlay
        },
        // 各列的默认索引
        defaultIndex: {
            type: Array,
            default: () => defProps.picker.defaultIndex
        },
		// 是否在手指松开时立即触发 change 事件。若不开启则会在滚动动画结束后触发 change 事件，只在微信2.21.1及以上有效
		immediateChange: {
			type: Boolean,
			default: () => defProps.picker.immediateChange
		}
    }
})
