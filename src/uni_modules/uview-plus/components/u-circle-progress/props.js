import defProps from '../../libs/config/props';
const defprops = uni?.$u?.props || defProps;
export default {
    props: {
        percentage: {
            type: [String, Number],
            default: defprops.circleProgress.percentage
        }
    }
}
