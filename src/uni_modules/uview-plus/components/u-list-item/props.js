import defProps from '../../libs/config/props';
const defprops = uni?.$u?.props || defProps;
export default {
    props: {
        // 用于滚动到指定item
        anchor: {
            type: [String, Number],
            default: defprops.listItem.anchor
        }
    }
}
