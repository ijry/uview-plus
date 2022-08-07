import defprops from '../../libs/config/props';
export default {
    props: {
        // #ifdef VUE3
        // 用于v-model双向绑定选中的星星数量
        modelValue: {
            type: [String, Number],
            default: defprops.rate.value
        },
        // #endif
        // #ifdef VUE2
        // 用于v-model双向绑定选中的星星数量
        value: {
            type: [String, Number],
            default: defprops.rate.value
        },
        // #endif
        // 要显示的星星数量
        count: {
            type: [String, Number],
            default: defprops.rate.count
        },
        // 是否不可选中
        disabled: {
            type: Boolean,
            default: defprops.rate.disabled
        },
        // 是否只读
        readonly: {
            type: Boolean,
            default: defprops.rate.readonly
        },
        // 星星的大小，单位px
        size: {
            type: [String, Number],
            default: defprops.rate.size
        },
        // 未选中时的颜色
        inactiveColor: {
            type: String,
            default: defprops.rate.inactiveColor
        },
        // 选中的颜色
        activeColor: {
            type: String,
            default: defprops.rate.activeColor
        },
        // 星星之间的间距，单位px
        gutter: {
            type: [String, Number],
            default: defprops.rate.gutter
        },
        // 最少能选择的星星个数
        minCount: {
            type: [String, Number],
            default: defprops.rate.minCount
        },
        // 是否允许半星
        allowHalf: {
            type: Boolean,
            default: defprops.rate.allowHalf
        },
        // 选中时的图标(星星)
        activeIcon: {
            type: String,
            default: defprops.rate.activeIcon
        },
        // 未选中时的图标(星星)
        inactiveIcon: {
            type: String,
            default: defprops.rate.inactiveIcon
        },
        // 是否可以通过滑动手势选择评分
        touchable: {
            type: Boolean,
            default: defprops.rate.touchable
        }
    }
}
