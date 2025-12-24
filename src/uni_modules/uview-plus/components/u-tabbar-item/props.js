import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // item标签的名称，作为与u-tabbar的value参数匹配的标识符
        name: {
            type: [String, Number, null],
            default: () => defProps.tabbarItem.name
        },
        // uview-plus内置图标或者绝对路径的图片
        icon: {
            icon: String,
            default: () => defProps.tabbarItem.icon
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
        }
    }
})
