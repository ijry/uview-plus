import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 标签类型info、primary、success、warning、error
        type: {
            type: String,
            default: () => defProps.tag.type
        },
        // 不可用
        disabled: {
            type: [Boolean, String],
            default: () => defProps.tag.disabled
        },
        // 标签的大小，large，medium，mini
        size: {
            type: String,
            default: () => defProps.tag.size
        },
        // tag的形状，circle（两边半圆形）, square（方形，带圆角）
        shape: {
            type: String,
            default: () => defProps.tag.shape
        },
        // 标签文字
        text: {
            type: [String, Number],
            default: () => defProps.tag.text
        },
        // 背景颜色，默认为空字符串，即不处理
        bgColor: {
            type: String,
            default: () => defProps.tag.bgColor
        },
        // 标签字体颜色，默认为空字符串，即不处理
        color: {
            type: String,
            default: () => defProps.tag.color
        },
        // 标签的边框颜色
        borderColor: {
            type: String,
            default: () => defProps.tag.borderColor
        },
        // 关闭按钮图标的颜色
        closeColor: {
            type: String,
            default: () => defProps.tag.closeColor
        },
        // 点击时返回的索引值，用于区分例遍的数组哪个元素被点击了
        name: {
            type: [String, Number],
            default: () => defProps.tag.name
        },
        // // 模式选择，dark|light|plain
        // mode: {
        // 	type: String,
        // 	default: 'light'
        // },
        // 镂空时是否填充背景色
        plainFill: {
            type: Boolean,
            default: () => defProps.tag.plainFill
        },
        // 是否镂空
        plain: {
            type: Boolean,
            default: () => defProps.tag.plain
        },
        // 是否可关闭
        closable: {
            type: Boolean,
            default: () => defProps.tag.closable
        },
        // 是否显示
        show: {
            type: Boolean,
            default: () => defProps.tag.show
        },
        // 内置图标，或绝对路径的图片
        icon: {
            type: String,
            default: () => defProps.tag.icon,
		},
        // 自定义尺寸字体大小
		textSize: {
            type: String,
            default: () => defProps.tag.textSize
        },
        // 自定义尺寸高度
        height: {
            type: String,
            default: () => defProps.tag.height
        },
        // 自定义尺寸padding
        padding: {
            type: String,
            default: () => defProps.tag.padding
        },
        // 自定义尺寸
        borderRadius: {
            type: String,
            default: () => defProps.tag.borderRadius
        },
        // 自动计算背景色
        autoBgColor: {
            type: Number,
            default: () => defProps.tag.autoBgColor
        },
    }
})
