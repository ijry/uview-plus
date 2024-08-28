/*
 * @Author       : jry
 * @Description  : uview-plus component's props mixin file
 * @version      : 4.0
 * @Date         : 2024-04-22 16:44:21
 * @LastAuthor   : jry
 * @lastTime     : 2024-08-28 12:27:20
 */
import { defineMixin } from '../../libs/vue'
import defProps from './tag'
let crtProp = defProps['tag'] as UTSJSONObject

export const propsTag = defineMixin({
    props: {
        // 标签类型info、primary、success、warning、error
        type: {
            type: String,
            default: crtProp['type']
        },
        // 不可用
        disabled: {
            type: [Boolean, String],
            default: crtProp['disabled']
        },
        // 标签的大小，large，medium，mini
        size: {
            type: String,
            default: crtProp['size']
        },
        // tag的形状，circle（两边半圆形）, square（方形，带圆角）
        shape: {
            type: String,
            default: crtProp['shape']
        },
        // 标签文字
        text: {
            type: [String, Number],
            default: crtProp['text']
        },
        // 背景颜色，默认为空字符串，即不处理
        bgColor: {
            type: String,
            default: crtProp['bgColor']
        },
        // 标签字体颜色，默认为空字符串，即不处理
        color: {
            type: String,
            default: crtProp['color']
        },
        // 标签的边框颜色
        borderColor: {
            type: String,
            default: crtProp['borderColor']
        },
        // 关闭按钮图标的颜色
        closeColor: {
            type: String,
            default: crtProp['closeColor']
        },
        // 点击时返回的索引值，用于区分例遍的数组哪个元素被点击了
        name: {
            type: [String, Number],
            default: crtProp['name']
        },
        // // 模式选择，dark|light|plain
        // mode: {
        // 	type: String,
        // 	default: 'light'
        // },
        // 镂空时是否填充背景色
        plainFill: {
            type: Boolean,
            default: crtProp['plainFill']
        },
        // 是否镂空
        plain: {
            type: Boolean,
            default: crtProp['plain']
        },
        // 是否可关闭
        closable: {
            type: Boolean,
            default: crtProp['closable']
        },
        // 是否显示
        show: {
            type: Boolean,
            default: crtProp['show']
        },
        // 内置图标，或绝对路径的图片
        icon: {
            type: String,
            default: crtProp['icon,']
		},
		iconColor: {
            type: String,
            default: crtProp['iconColor']
        }
    }
})
