const defprops = uni.$u.props;
export default {
    props: {
        bgColor: {
            type: String,
            default: defprops.statusBar.bgColor
        }
    }
}
