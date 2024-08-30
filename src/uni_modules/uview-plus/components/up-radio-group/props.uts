import { defineMixin } from '../../libs/vue'
import defProps from './radioGroup'
import defPropsRadio from '../up-radio/radio'
let crtProp = defProps['radioGroup'] as UTSJSONObject
let crtPropRadio = defPropsRadio['radio'] as UTSJSONObject

export const propsRadioGroup = defineMixin({
    props: {
        // 绑定的值
        modelValue: {
            type: [String, Number, Boolean],
            default: crtProp['value']
        },
        // 是否禁用全部radio
        disabled: {
            type: Boolean,
            default: crtProp['disabled']
        },
        // 形状，circle-圆形，square-方形
        shape: {
            type: String,
            default: crtProp['shape']
        },
        // 选中状态下的颜色，如设置此值，将会覆盖parent的activeColor值
        activeColor: {
            type: String,
            default: crtProp['activeColor']
        },
        // 未选中的颜色
        inactiveColor: {
            type: String,
            default: crtProp['inactiveColor']
        },
        // 标识符
        name: {
            type: String,
            default: crtProp['name']
        },
        // 整个组件的尺寸，默认px
        size: {
            type: [String, Number],
            default: crtProp['size']
        },
        // 布局方式，row-横向，column-纵向
        placement: {
            type: String,
            default: crtProp['placement']
        },
        // label的文本
        label: {
            type: [String],
            default: crtProp['label']
        },
        // label的颜色 （默认 '#303133' ）
        labelColor: {
            type: [String],
            default: crtProp['labelColor']
        },
        // label的字体大小，px单位
        labelSize: {
            type: [String, Number],
            default: crtProp['labelSize']
        },
        // 是否禁止点击文本操作checkbox(默认 false )
        labelDisabled: {
            type: Boolean,
            default: crtProp['labelDisabled']
        },
        // 图标颜色
        iconColor: {
            type: String,
            default: crtProp['iconColor']
        },
        // 图标的大小，单位px
        iconSize: {
            type: [String, Number],
            default: crtProp['iconSize']
        },
        // 竖向配列时，是否显示下划线
        borderBottom: {
            type: Boolean,
            default: crtProp['borderBottom']
        },
        // 图标与文字的对齐方式
        iconPlacement: {
            type: String,
            default: crtPropRadio['iconPlacement']
        }
    }
})
