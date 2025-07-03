/*
 * @Author       : jry
 * @Description  : uview-plus component's props mixin file
 * @version      : 4.0
 * @Date         : 2024-08-30 23:17:21
 * @LastAuthor   : jry
 * @lastTime     : 2024-08-30 23:17:20
 */
import { defineMixin } from '../../libs/vue'
import defProps from './radio'
let crtProp = defProps['radio'] as UTSJSONObject

export const propsRadio = defineMixin({
    props: {
        // radio的名称
        name: {
            type: [String, Number, Boolean],
            default: crtProp['name']
        },
        // 形状，square为方形，circle为圆型
        shape: {
            type: String,
            default: crtProp['shape']
        },
        // 是否禁用
        disabled: {
            type: [String, Boolean],
            default: crtProp['disabled']
        },
        // 是否禁止点击提示语选中单选框
        labelDisabled: {
            type: [String, Boolean],
            default: crtProp['labelDisabled']
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
        // 图标的大小，单位px
        iconSize: {
            type: [String, Number],
            default: crtProp['iconSize']
        },
        // label的字体大小，px单位
        labelSize: {
            type: [String, Number],
            default: crtProp['labelSize']
        },
        // label提示文字，因为nvue下，直接slot进来的文字，由于特殊的结构，无法修改样式
        label: {
            type: [String, Number],
            default: crtProp['label']
        },
        // 整体的大小
        size: {
            type: [String, Number],
            default: crtProp['size']
        },
        // 图标颜色
        color: {
            type: String,
            default: crtProp['color']
        },
        // label的颜色
        labelColor: {
            type: String,
            default: crtProp['labelColor']
        },
        // 图标颜色
        iconColor: {
            type: String,
            default: crtProp['iconColor']
        }
    }
})
