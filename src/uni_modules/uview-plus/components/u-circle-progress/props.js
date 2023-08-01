import defprops from '../../libs/config/props';
export default {
    props: {
        percentage: {
            type: [String, Number],
            default: defprops.circleProgress.percentage
        }
    }
}
