import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 是否展示骨架组件
        loading: {
            type: Boolean,
            default: () => defProps.skeleton.loading
        },
        // 是否开启动画效果
        animate: {
            type: Boolean,
            default: () => defProps.skeleton.animate
        },
        // 段落占位图行数
        rows: {
            type: [String, Number],
            default: () => defProps.skeleton.rows
        },
        // 段落占位图的宽度
        rowsWidth: {
            type: [String, Number, Array],
            default: () => defProps.skeleton.rowsWidth
        },
        // 段落占位图的高度
        rowsHeight: {
            type: [String, Number, Array],
            default: () => defProps.skeleton.rowsHeight
        },
        // 是否展示标题占位图
        title: {
            type: Boolean,
            default: () => defProps.skeleton.title
        },
        // 段落标题的宽度
        titleWidth: {
            type: [String, Number],
            default: () => defProps.skeleton.titleWidth
        },
        // 段落标题的高度
        titleHeight: {
            type: [String, Number],
            default: () => defProps.skeleton.titleHeight
        },
        // 是否展示头像占位图
        avatar: {
            type: Boolean,
            default: () => defProps.skeleton.avatar
        },
        // 头像占位图大小
        avatarSize: {
            type: [String, Number],
            default: () => defProps.skeleton.avatarSize
        },
        // 头像占位图的形状，circle-圆形，square-方形
        avatarShape: {
            type: String,
            default: () => defProps.skeleton.avatarShape
        }
    }
})
