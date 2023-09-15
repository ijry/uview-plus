import defProps from '../../libs/config/props';
const defprops = uni?.$u?.props || defProps;
export default {
    props: {
        bgColor: {
            type: String,
            default: defprops.statusBar.bgColor
        }
    }
}
