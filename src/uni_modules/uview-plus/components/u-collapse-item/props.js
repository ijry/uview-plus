import defprops from '../../libs/config/props';
export default {
    props: {
        // 标题
        title: {
            type: String,
            default: defprops.collapseItem.title
        },
        // 标题右侧内容
        value: {
            type: String,
            default: defprops.collapseItem.value
        },
        // 标题下方的描述信息
        label: {
            type: String,
            default: defprops.collapseItem.label
        },
        // 是否禁用折叠面板
        disabled: {
            type: Boolean,
            default: defprops.collapseItem.disabled
        },
        // 是否展示右侧箭头并开启点击反馈
        isLink: {
            type: Boolean,
            default: defprops.collapseItem.isLink
        },
        // 是否开启点击反馈
        clickable: {
            type: Boolean,
            default: defprops.collapseItem.clickable
        },
        // 是否显示内边框
        border: {
            type: Boolean,
            default: defprops.collapseItem.border
        },
        // 标题的对齐方式
        align: {
            type: String,
            default: defprops.collapseItem.align
        },
        // 唯一标识符
        name: {
            type: [String, Number],
            default: defprops.collapseItem.name
        },
        // 标题左侧图片，可为绝对路径的图片或内置图标
        icon: {
            type: String,
            default: defprops.collapseItem.icon
        },
        // 面板展开收起的过渡时间，单位ms
        duration: {
            type: Number,
            default: defprops.collapseItem.duration
        }
    }
}
