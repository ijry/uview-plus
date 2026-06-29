import { defineMixin } from '../../libs/vue'
import TabbarDefaultProps from './tabbar'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps(TabbarDefaultProps)
export const props = defineMixin({
    props: {
        // 当前匹配项的name
        value: {
            type: [String, Number, null],
            default: () => defProps.tabbar.value
        },
        // 是否为iPhoneX留出底部安全距离
        safeAreaInsetBottom: {
            type: Boolean,
            default: () => defProps.tabbar.safeAreaInsetBottom
        },
        // 是否显示上方边框
        border: {
            type: Boolean,
            default: () => defProps.tabbar.border
        },
        // 上方边框颜色
        borderColor: {
            type: String,
            default: () => defProps.tabbar.borderColor
        },
        // 元素层级z-index
        zIndex: {
            type: [String, Number],
            default: () => defProps.tabbar.zIndex
        },
        // 选中标签的颜色
        activeColor: {
            type: String,
            default: () => defProps.tabbar.activeColor
        },
        // 未选中标签的颜色
        inactiveColor: {
            type: String,
            default: () => defProps.tabbar.inactiveColor
        },
        // 是否固定在底部
        fixed: {
            type: Boolean,
            default: () => defProps.tabbar.fixed
        },
        // fixed定位固定在底部时，是否生成一个等高元素防止塌陷
        placeholder: {
            type: Boolean,
            default: () => defProps.tabbar.placeholder
        },
        // 背景色
        backgroundColor: {
            type: String,
            default: () => defProps.tabbar.backgroundColor
        },
        // 风格类型
        styleType: {
            type: String,
            default: () => defProps.tabbar.styleType
        },
        // 激活动画类型
        animationType: {
            type: String,
            default: () => defProps.tabbar.animationType
        },
        // 选中项背景色
        activeBackgroundColor: {
            type: String,
            default: () => defProps.tabbar.activeBackgroundColor
        },
        // 未选中项背景色
        inactiveBackgroundColor: {
            type: String,
            default: () => defProps.tabbar.inactiveBackgroundColor
        },
        // item 形状
        itemShape: {
            type: String,
            default: () => defProps.tabbar.itemShape
        },
        // 图标缩放比例
        iconScale: {
            type: [String, Number],
            default: () => defProps.tabbar.iconScale
        },
        // 文本显示模式
        textMode: {
            type: String,
            default: () => defProps.tabbar.textMode
        }
    }
})
