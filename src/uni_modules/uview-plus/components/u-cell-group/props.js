import defProps from '../../libs/config/props.js';
export default {
    props: {
        // 分组标题
        title: {
            type: String,
            default: () => defProps.cellGroup.title
        },
        // 是否显示外边框
        border: {
            type: Boolean,
            default: () => defProps.cellGroup.border
        }
    }
}
