import defprops from '../../libs/config/props';
export default {
    props: {
        // 是否展示modal
        show: {
            type: Boolean,
            default: defprops.modal.show
        },
        // 标题
        title: {
            type: [String],
            default: defprops.modal.title
        },
        // 弹窗内容
        content: {
            type: String,
            default: defprops.modal.content
        },
        // 确认文案
        confirmText: {
            type: String,
            default: defprops.modal.confirmText
        },
        // 取消文案
        cancelText: {
            type: String,
            default: defprops.modal.cancelText
        },
        // 是否显示确认按钮
        showConfirmButton: {
            type: Boolean,
            default: defprops.modal.showConfirmButton
        },
        // 是否显示取消按钮
        showCancelButton: {
            type: Boolean,
            default: defprops.modal.showCancelButton
        },
        // 确认按钮颜色
        confirmColor: {
            type: String,
            default: defprops.modal.confirmColor
        },
        // 取消文字颜色
        cancelColor: {
            type: String,
            default: defprops.modal.cancelColor
        },
        // 对调确认和取消的位置
        buttonReverse: {
            type: Boolean,
            default: defprops.modal.buttonReverse
        },
        // 是否开启缩放效果
        zoom: {
            type: Boolean,
            default: defprops.modal.zoom
        },
        // 是否异步关闭，只对确定按钮有效
        asyncClose: {
            type: Boolean,
            default: defprops.modal.asyncClose
        },
        // 是否允许点击遮罩关闭modal
        closeOnClickOverlay: {
            type: Boolean,
            default: defprops.modal.closeOnClickOverlay
        },
        // 给一个负的margin-top，往上偏移，避免和键盘重合的情况
        negativeTop: {
            type: [String, Number],
            default: defprops.modal.negativeTop
        },
        // modal宽度，不支持百分比，可以数值，px，rpx单位
        width: {
            type: [String, Number],
            default: defprops.modal.width
        },
        // 确认按钮的样式，circle-圆形，square-方形，如设置，将不会显示取消按钮
        confirmButtonShape: {
            type: String,
            default: defprops.modal.confirmButtonShape
        }
    }
}
