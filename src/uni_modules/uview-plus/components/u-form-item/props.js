import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // input的label提示语
        label: {
            type: String,
            default: () => defProps.formItem.label
        },
        // 绑定的值
        prop: {
            type: String,
            default: () => defProps.formItem.prop
        },
        // 绑定的规则
        rule: {
            type: String,
            default: () => defProps.formItem.rule
        },
        // 是否显示表单域的下划线边框
        borderBottom: {
            type: [String, Boolean],
            default: () => defProps.formItem.borderBottom
        },
        // label的位置，left-左边，top-上边
        labelPosition: {
            type: String,
            default: () => defProps.formItem.labelPosition
        },
        // label的宽度，单位px
        labelWidth: {
            type: [String, Number],
            default: () => defProps.formItem.labelWidth
        },
        // 右侧图标
        rightIcon: {
            type: String,
            default: () => defProps.formItem.rightIcon
        },
        // 左侧图标
        leftIcon: {
            type: String,
            default: () => defProps.formItem.leftIcon
        },
        // 是否显示左边的必填星号，只作显示用，具体校验必填的逻辑，请在rules中配置
        required: {
            type: Boolean,
            default: () => defProps.formItem.required
        },
        leftIconStyle: {
            type: [String, Object],
            default: () => defProps.formItem.leftIconStyle,
        }
    }
})
