import defProps from '../../libs/config/props.js';
export default {
    props: {
        bgColor: {
            type: String,
            default: () => defProps.statusBar.bgColor
        }
    }
}
