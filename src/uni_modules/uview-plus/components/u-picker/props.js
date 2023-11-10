import defprops from '../../libs/config/props';
export default {
    props: {
        // 是否展示picker弹窗
        show: {
            type: Boolean,
            default: defprops.picker.show
        },
		// 弹出的方向，可选值为 top bottom right left center
        popupMode: {
            type: String,
            default: defprops.picker.popupMode
        },
        // 是否展示顶部的操作栏
        showToolbar: {
            type: Boolean,
            default: defprops.picker.showToolbar
        },
        // 顶部标题
        title: {
            type: String,
            default: defprops.picker.title
        },
        // 对象数组，设置每一列的数据
        columns: {
            type: Array,
            default: defprops.picker.columns
        },
        // 是否显示加载中状态
        loading: {
            type: Boolean,
            default: defprops.picker.loading
        },
        // 各列中，单个选项的高度
        itemHeight: {
            type: [String, Number],
            default: defprops.picker.itemHeight
        },
        // 取消按钮的文字
        cancelText: {
            type: String,
            default: defprops.picker.cancelText
        },
        // 确认按钮的文字
        confirmText: {
            type: String,
            default: defprops.picker.confirmText
        },
        // 取消按钮的颜色
        cancelColor: {
            type: String,
            default: defprops.picker.cancelColor
        },
        // 确认按钮的颜色
        confirmColor: {
            type: String,
            default: defprops.picker.confirmColor
        },
        // 每列中可见选项的数量
        visibleItemCount: {
            type: [String, Number],
            default: defprops.picker.visibleItemCount
        },
        // 选项对象中，需要展示的属性键名
        keyName: {
            type: String,
            default: defprops.picker.keyName
        },
        // 是否允许点击遮罩关闭选择器
        closeOnClickOverlay: {
            type: Boolean,
            default: defprops.picker.closeOnClickOverlay
        },
        // 各列的默认索引
        defaultIndex: {
            type: Array,
            default: defprops.picker.defaultIndex
        },
		// 是否在手指松开时立即触发 change 事件。若不开启则会在滚动动画结束后触发 change 事件，只在微信2.21.1及以上有效
		immediateChange: {
			type: Boolean,
			default: defprops.picker.immediateChange
		}
    }
}
