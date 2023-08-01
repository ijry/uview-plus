import defprops from '../../libs/config/props';
export default {
    props: {
        // 激活部分的颜色
        activeColor: {
            type: String,
            default: defprops.lineProgress.activeColor
        },
        inactiveColor: {
            type: String,
            default: defprops.lineProgress.color
        },
        // 进度百分比，数值
        percentage: {
            type: [String, Number],
            default: defprops.lineProgress.inactiveColor
        },
        // 是否在进度条内部显示百分比的值
        showText: {
            type: Boolean,
            default: defprops.lineProgress.showText
        },
        // 进度条的高度，单位px
        height: {
            type: [String, Number],
            default: defprops.lineProgress.height
        }
    }
}
