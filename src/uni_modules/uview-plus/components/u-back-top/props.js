import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 返回顶部的形状，circle-圆形，square-方形
        mode: {
            type: String,
            default: () => defProps.backtop.mode
        },
        // 自定义图标
        icon: {
            type: String,
            default: () => defProps.backtop.icon
        },
        // 提示文字
        text: {
            type: String,
            default: () => defProps.backtop.text
        },
        // 返回顶部滚动时间
        duration: {
            type: [String, Number],
            default: () => defProps.backtop.duration
        },
        // 滚动距离
        scrollTop: {
            type: [String, Number],
            default: () => defProps.backtop.scrollTop
        },
        // 距离顶部多少距离显示，单位px
        top: {
            type: [String, Number],
            default: () => defProps.backtop.top
        },
        // 返回顶部按钮到底部的距离，单位px
        bottom: {
            type: [String, Number],
            default: () => defProps.backtop.bottom
        },
        // 返回顶部按钮到右边的距离，单位px
        right: {
            type: [String, Number],
            default: () => defProps.backtop.right
        },
        // 层级
        zIndex: {
            type: [String, Number],
            default: () => defProps.backtop.zIndex
        },
        // 图标的样式，对象形式
        iconStyle: {
            type: Object,
            default: () => defProps.backtop.iconStyle
        }
    }
})
