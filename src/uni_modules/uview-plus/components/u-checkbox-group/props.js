import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'

export const props = defineMixin({
    props: {
        // 标识符
        name: {
            type: String,
            default: () => defProps.checkboxGroup.name
        },
		// #ifdef VUE3
		// 绑定的值
		modelValue: {
		    type: Array,
		    default: () => defProps.checkboxGroup.value
		},
		// #endif
		// #ifdef VUE2
		// 绑定的值
		value: {
		    type: Array,
		    default: () => defProps.checkboxGroup.value
		},
		// #endif
        // 形状，circle-圆形，square-方形
        shape: {
            type: String,
            default: () => defProps.checkboxGroup.shape
        },
        // 是否禁用全部checkbox
        disabled: {
            type: Boolean,
            default: () => defProps.checkboxGroup.disabled
        },

        // 选中状态下的颜色，如设置此值，将会覆盖parent的activeColor值
        activeColor: {
            type: String,
            default: () => defProps.checkboxGroup.activeColor
        },
        // 未选中的颜色
        inactiveColor: {
            type: String,
            default: () => defProps.checkboxGroup.inactiveColor
        },

        // 整个组件的尺寸，默认px
        size: {
            type: [String, Number],
            default: () => defProps.checkboxGroup.size
        },
        // 布局方式，row-横向，column-纵向
        placement: {
            type: String,
            default: () => defProps.checkboxGroup.placement
        },
        // label的字体大小，px单位
        labelSize: {
            type: [String, Number],
            default: () => defProps.checkboxGroup.labelSize
        },
        // label的字体颜色
        labelColor: {
            type: [String],
            default: () => defProps.checkboxGroup.labelColor
        },
        // 是否禁止点击文本操作
        labelDisabled: {
            type: Boolean,
            default: () => defProps.checkboxGroup.labelDisabled
        },
        // 图标颜色
        iconColor: {
            type: String,
            default: () => defProps.checkboxGroup.iconColor
        },
        // 图标的大小，单位px
        iconSize: {
            type: [String, Number],
            default: () => defProps.checkboxGroup.iconSize
        },
        // 勾选图标的对齐方式，left-左边，right-右边
        iconPlacement: {
            type: String,
            default: () => defProps.checkboxGroup.iconPlacement
        },
        // 竖向配列时，是否显示下划线
        borderBottom: {
            type: Boolean,
            default: () => defProps.checkboxGroup.borderBottom
        }
    }
})
