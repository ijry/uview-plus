import defprops from '../../libs/config/props';
export default {
    props: {
        // 是否为加载中状态
        loading: {
            type: Boolean,
            default: defprops.switch.loading
        },
        // 是否为禁用装填
        disabled: {
            type: Boolean,
            default: defprops.switch.disabled
        },
        // 开关尺寸，单位px
        size: {
            type: [String, Number],
            default: defprops.switch.size
        },
        // 打开时的背景颜色
        activeColor: {
            type: String,
            default: defprops.switch.activeColor
        },
        // 关闭时的背景颜色
        inactiveColor: {
            type: String,
            default: defprops.switch.inactiveColor
        },
        // 通过v-model双向绑定的值
        // #ifdef VUE3
        modelValue: {
            type: [Boolean, String, Number],
            default: defprops.switch.value
        },
        // #endif
        // #ifdef VUE2
        value: {
            type: [Boolean, String, Number],
            default: defprops.switch.value
        },
        // #endif
        // switch打开时的值
        activeValue: {
            type: [String, Number, Boolean],
            default: defprops.switch.activeValue
        },
        // switch关闭时的值
        inactiveValue: {
            type: [String, Number, Boolean],
            default: defprops.switch.inactiveValue
        },
        // 是否开启异步变更，开启后需要手动控制输入值
        asyncChange: {
            type: Boolean,
            default: defprops.switch.asyncChange
        },
        // 圆点与外边框的距离
        space: {
            type: [String, Number],
            default: defprops.switch.space
        }
    }
}
