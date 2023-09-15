const defprops = uni.$u.props;
export default {
    props: {
        percentage: {
            type: [String, Number],
            default: defprops.circleProgress.percentage
        }
    }
}
