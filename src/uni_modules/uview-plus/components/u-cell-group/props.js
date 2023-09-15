import defProps from '../../libs/config/props';
const defprops = uni?.$u?.props || defProps;
export default {
    props: {
        // 分组标题
        title: {
            type: String,
            default: defprops.cellGroup.title
        },
        // 是否显示外边框
        border: {
            type: Boolean,
            default: defprops.cellGroup.border
        }
    }
}
