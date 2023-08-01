import defprops from '../../libs/config/props';
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
