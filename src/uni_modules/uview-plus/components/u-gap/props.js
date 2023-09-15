const defprops = uni.$u.props;
export default {
    props: {
        // 背景颜色（默认transparent）
        bgColor: {
            type: String,
            default: defprops.gap.bgColor
        },
        // 分割槽高度，单位px（默认30）
        height: {
            type: [String, Number],
            default: defprops.gap.height
        },
        // 与上一个组件的距离
        marginTop: {
            type: [String, Number],
            default: defprops.gap.marginTop
        },
        // 与下一个组件的距离
        marginBottom: {
            type: [String, Number],
            default: defprops.gap.marginBottom
        }
    }
}
