import defProps from '../../libs/config/props.js';
export default {
    props: {
        percentage: {
            type: [String, Number],
            default: () => defProps.circleProgress.percentage
        }
    }
}
