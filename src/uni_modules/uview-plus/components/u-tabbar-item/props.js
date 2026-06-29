import { defineMixin } from '../../libs/vue'
import TabbarItemDefaultProps from './tabbarItem'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps(TabbarItemDefaultProps)
export const props = defineMixin({
    props: {
        // item标签的名称，作为与u-tabbar的value参数匹配的标识符
        name: {
            type: [String, Number, null],
            default: () => defProps.tabbarItem.name
        },
        // uview-plus内置图标或者绝对路径的图片
        icon: {
            type: String,
            default: () => defProps.tabbarItem.icon
        },
        // 激活态图标
        activeIcon: {
            type: String,
            default: () => defProps.tabbarItem.activeIcon
        },
        // 未激活态图标
        inactiveIcon: {
            type: String,
            default: () => defProps.tabbarItem.inactiveIcon
        },
        // 右上角的角标提示信息
        badge: {
            type: [String, Number, null],
            default: () => defProps.tabbarItem.badge
        },
        // 是否显示圆点，将会覆盖badge参数
        dot: {
            type: Boolean,
            default: () => defProps.tabbarItem.dot
        },
        // 描述文本
        text: {
            type: String,
            default: () => defProps.tabbarItem.text
        },
        // 控制徽标的位置，对象或者字符串形式，可以设置top和right属性
        badgeStyle: {
            type: [Object, String],
            default: () => defProps.tabbarItem.badgeStyle
        },
        // 模式，默认普通模式，midButton中间按钮模式
        mode: {
            type: String,
            default: () => defProps.tabbarItem.mode
        },
        // 激活态附加类名
        activeClass: {
            type: String,
            default: () => defProps.tabbarItem.activeClass
        },
        // 未激活态附加类名
        inactiveClass: {
            type: String,
            default: () => defProps.tabbarItem.inactiveClass
        },
        // 中间按钮背景色
        midButtonBgColor: {
            type: String,
            default: () => defProps.tabbarItem.midButtonBgColor
        },
        // 中间按钮图标颜色
        midButtonIconColor: {
            type: String,
            default: () => defProps.tabbarItem.midButtonIconColor
        },
        // 中间按钮图标大小
        midButtonIconSize: {
            type: [String, Number],
            default: () => defProps.tabbarItem.midButtonIconSize
        },
        // 中间按钮阴影
        midButtonBoxShadow: {
            type: String,
            default: () => defProps.tabbarItem.midButtonBoxShadow
        },
        // 中间按钮内层阴影
        midButtonInnerBoxShadow: {
            type: String,
            default: () => defProps.tabbarItem.midButtonInnerBoxShadow
        },
        // 中间按钮垂直偏移（负值为上移）
        midButtonOffsetY: {
            type: [String, Number],
            default: () => defProps.tabbarItem.midButtonOffsetY
        }
    }
})
