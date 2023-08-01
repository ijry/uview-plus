import defprops from '../../libs/config/props';
export default {
    props: {
        // 分成几列
        col: {
            type: [String, Number],
            default: defprops.grid.col
        },
        // 是否显示边框
        border: {
            type: Boolean,
            default: defprops.grid.border
        },
        // 宫格对齐方式，表现为数量少的时候，靠左，居中，还是靠右
        align: {
            type: String,
            default: defprops.grid.align
        }
    }
}
