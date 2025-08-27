import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 是否展示弹窗
        show: {
            type: Boolean,
            default: () => defProps.popup.show
        },
        // 是否显示遮罩
        overlay: {
            type: Boolean,
            default: () => defProps.popup.overlay
        },
        // 弹出的方向，可选值为 top bottom right left center
        mode: {
            type: String,
            default: () => defProps.popup.mode
        },
        // 动画时长，单位ms
        duration: {
            type: [String, Number],
            default: () => defProps.popup.duration
        },
        // 是否显示关闭图标
        closeable: {
            type: Boolean,
            default: () => defProps.popup.closeable
        },
        // 自定义遮罩的样式
        overlayStyle: {
            type: [Object, String],
            default: () => defProps.popup.overlayStyle
        },
        // 点击遮罩是否关闭弹窗
        closeOnClickOverlay: {
            type: Boolean,
            default: () => defProps.popup.closeOnClickOverlay
        },
        // 层级
        zIndex: {
            type: [String, Number],
            default: () => defProps.popup.zIndex
        },
        // 是否为iPhoneX留出底部安全距离
        safeAreaInsetBottom: {
            type: Boolean,
            default: () => defProps.popup.safeAreaInsetBottom
        },
        // 是否留出顶部安全距离（状态栏高度）
        safeAreaInsetTop: {
            type: Boolean,
            default: () => defProps.popup.safeAreaInsetTop
        },
        // 自定义关闭图标位置，top-left为左上角，top-right为右上角，bottom-left为左下角，bottom-right为右下角
        closeIconPos: {
            type: String,
            default: () => defProps.popup.closeIconPos
        },
        // 是否显示圆角
        round: {
            type: [Boolean, String, Number],
            default: () => defProps.popup.round
        },
        // mode=center，也即中部弹出时，是否使用缩放模式
        zoom: {
            type: Boolean,
            default: () => defProps.popup.zoom
        },
        // 弹窗背景色，设置为transparent可去除白色背景
        bgColor: {
            type: String,
            default: () => defProps.popup.bgColor
        },
        // 遮罩的透明度，0-1之间
        overlayOpacity: {
            type: [Number, String],
            default: () => defProps.popup.overlayOpacity
        },
        // 是否页面内展示
        pageInline:{
			type: Boolean,
			default: () => defProps.popup.pageInline
		},
        // 是否页开启手势滑动
        touchable:{
			type: Boolean,
			default: () => defProps.popup.touchable
		},
        // 手势滑动最小高度
        minHeight:{
			type: [String],
			default: () => defProps.popup.minHeight
		},
        // 手势滑动最大高度
        maxHeight:{
			type: [String],
			default: () => defProps.popup.maxHeight
		}
    }
})
