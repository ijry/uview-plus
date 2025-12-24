import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 激活部分的颜色
        activeColor: {
            type: String,
            default: () => defProps.lineProgress.activeColor
        },
        inactiveColor: {
            type: String,
            default: () => defProps.lineProgress.color
        },
        // 进度百分比，数值
        percentage: {
            type: [String, Number],
            default: () => defProps.lineProgress.inactiveColor
        },
        // 是否在进度条内部显示百分比的值
        showText: {
            type: Boolean,
            default: () => defProps.lineProgress.showText
        },
        // 进度条的高度，单位px
        height: {
            type: [String, Number],
            default: () => defProps.lineProgress.height
        },
		// 是否从右往左加载
		fromRight: {
            type: Boolean,
            default: () => defProps.lineProgress.fromRight
        }
    }
})
