import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 分成几列
        col: {
            type: [String, Number],
            default: () => defProps.grid.col
        },
        // 是否显示边框
        border: {
            type: Boolean,
            default: () => defProps.grid.border
        },
        // 宫格对齐方式，表现为数量少的时候，靠左，居中，还是靠右
        align: {
            type: String,
            default: () => defProps.grid.align
        },
        // 间隔
        gap: {
            type: String,
            default: '0px'
        }
    }
})
