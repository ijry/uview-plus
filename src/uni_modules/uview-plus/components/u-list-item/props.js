import defProps from '../../libs/config/props.js';
export default {
    props: {
        // 用于滚动到指定item
        anchor: {
            type: [String, Number],
            default: () => defProps.listItem.anchor
        }
    }
}
