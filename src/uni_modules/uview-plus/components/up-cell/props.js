import { defineMixin } from '../../libs/vue.js'
import defProps from '../../libs/config/props.js'

export const propsCell = defineMixin({
    props: {
        // 标题
        title: {
            type: [String, Number],
            default: () => defProps.cell.title
        },
        // 标题下方的描述信息
        label: {
            type: [String, Number],
            default: () => defProps.cell.label
        },
        // 右侧的内容
        value: {
            type: [String, Number],
            default: () => defProps.cell.value
        },
        // 左侧图标名称，或者图片链接(本地文件建议使用绝对地址)
        icon: {
            type: String,
            default: () => defProps.cell.icon
        },
        // 是否禁用cell
        disabled: {
            type: Boolean,
            default: () => defProps.cell.disabled
        },
        // 是否显示下边框
        border: {
            type: Boolean,
            default: () => defProps.cell.border
        },
        // 内容是否垂直居中(主要是针对右侧的value部分)
        center: {
            type: Boolean,
            default: () => defProps.cell.center
        },
        // 点击后跳转的URL地址
        url: {
            type: String,
            default: () => defProps.cell.url
        },
        // 链接跳转的方式，内部使用的是uView封装的route方法，可能会进行拦截操作
        linkType: {
            type: String,
            default: () => defProps.cell.linkType
        },
        // 是否开启点击反馈(表现为点击时加上灰色背景)
        clickable: {
            type: Boolean,
            default: () => defProps.cell.clickable
        },
        // 是否展示右侧箭头并开启点击反馈
        isLink: {
            type: Boolean,
            default: () => defProps.cell.isLink
        },
        // 是否显示表单状态下的必填星号(此组件可能会内嵌入input组件)
        required: {
            type: Boolean,
            default: () => defProps.cell.required
        },
        // 右侧的图标箭头
        rightIcon: {
            type: String,
            default: () => defProps.cell.rightIcon
        },
        // 右侧箭头的方向，可选值为：left，up，down
        arrowDirection: {
            type: String,
            default: () => defProps.cell.arrowDirection
        },
        // 左侧图标样式
        iconStyle: {
            type: [Object, String],
            default: () => {
				return defProps.cell.iconStyle
			}
        },
        // 右侧箭头图标的样式
        rightIconStyle: {
            type: [Object, String],
            default: () => {
				return defProps.cell.rightIconStyle
			}
        },
        // 标题的样式
        titleStyle: {
            type: [Object, String],
			default: () => {
				return defProps.cell.titleStyle
			}
        },
        // 单位元的大小，可选值为large
        size: {
            type: String,
            default: () => defProps.cell.size
        },
        // 点击cell是否阻止事件传播
        stop: {
            type: Boolean,
            default: () => defProps.cell.stop
        },
        // 标识符，cell被点击时返回
        name: {
            type: [Number, String],
            default: () => defProps.cell.name
        }
    }
})