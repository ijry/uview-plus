import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // #ifdef VUE3
        // 绑定的值
        modelValue: {
            type: [String, Number, Boolean],
            default: () => defProps.radioGroup.value
        },
        // #endif
        // #ifdef VUE2
        // 绑定的值
        value: {
            type: [String, Number, Boolean],
            default: () => defProps.radioGroup.value
        },
        // #endif
        // 是否禁用全部radio
        disabled: {
            type: Boolean,
            default: () => defProps.radioGroup.disabled
        },
        // 形状，circle-圆形，square-方形
        shape: {
            type: String,
            default: () => defProps.radioGroup.shape
        },
        // 选中状态下的颜色，如设置此值，将会覆盖parent的activeColor值
        activeColor: {
            type: String,
            default: () => defProps.radioGroup.activeColor
        },
        // 未选中的颜色
        inactiveColor: {
            type: String,
            default: () => defProps.radioGroup.inactiveColor
        },
        // 标识符
        name: {
            type: String,
            default: () => defProps.radioGroup.name
        },
        // 整个组件的尺寸，默认px
        size: {
            type: [String, Number],
            default: () => defProps.radioGroup.size
        },
        // 布局方式，row-横向，column-纵向
        placement: {
            type: String,
            default: () => defProps.radioGroup.placement
        },
        // label的文本
        label: {
            type: [String],
            default: () => defProps.radioGroup.label
        },
        // label的颜色 （默认 '#303133' ）
        labelColor: {
            type: [String],
            default: () => defProps.radioGroup.labelColor
        },
        // label的字体大小，px单位
        labelSize: {
            type: [String, Number],
            default: () => defProps.radioGroup.labelSize
        },
        // 是否禁止点击文本操作checkbox(默认 false )
        labelDisabled: {
            type: Boolean,
            default: () => defProps.radioGroup.labelDisabled
        },
        // 图标颜色
        iconColor: {
            type: String,
            default: () => defProps.radioGroup.iconColor
        },
        // 图标的大小，单位px
        iconSize: {
            type: [String, Number],
            default: () => defProps.radioGroup.iconSize
        },
        // 竖向配列时，是否显示下划线
        borderBottom: {
            type: Boolean,
            default: () => defProps.radioGroup.borderBottom
        },
        // 图标与文字的对齐方式
        iconPlacement: {
            type: String,
            default: () => defProps.radio.iconPlacement
        },
        // item 之间的间距
		gap: {
			type: [String, Number],
			default: () => defProps.radioGroup.gap
		}
    }
})
