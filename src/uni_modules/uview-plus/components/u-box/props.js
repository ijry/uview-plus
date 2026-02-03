import { defineMixin } from '../../libs/vue.js'
import defProps from './box.js'

export const propsBox = defineMixin({
    props: {
        // 背景色
        bgColors: {
            type: [Array],
            default: () => defProps.box.bgColors
        },
        // 高度
        height: {
            type: [String],
            default: () => defProps.box.height
        },
        // 圆角
        borderRadius: {
            type: [String],
            default: () => defProps.box.borderRadius
        },
        // 间隔
        gap: {
            type: [String],
            default: () => defProps.box.gap
        },
        // 左侧图标
        leftIcon: {
            type: [String],
            default: () => defProps.box.leftIcon
        },
        // 左侧文案
        leftTitle: {
            type: [String],
            default: () => defProps.box.leftTitle
        },
        // 右上图标
        rightTopIcon: {
            type: [String],
            default: () => defProps.box.rightTopIcon
        },
        // 右上文案
        rightTopTitle: {
            type: [String],
            default: () => defProps.box.rightTopTitle
        },
        // 右下图标
        rightBottomIcon: {
            type: [String],
            default: () => defProps.box.rightBottomIcon
        },
        // 右下文案
        rightBottomTitle: {
            type: [String],
            default: () => defProps.box.rightBottomTitle
        },
    }
})