const defprops = uni.$u.props;
export default {
    props: {
        // 当前匹配项的name
        value: {
            type: [String, Number, null],
            default: defprops.tabbar.value
        },
        // 是否为iPhoneX留出底部安全距离
        safeAreaInsetBottom: {
            type: Boolean,
            default: defprops.tabbar.safeAreaInsetBottom
        },
        // 是否显示上方边框
        border: {
            type: Boolean,
            default: defprops.tabbar.border
        },
        // 元素层级z-index
        zIndex: {
            type: [String, Number],
            default: defprops.tabbar.zIndex
        },
        // 选中标签的颜色
        activeColor: {
            type: String,
            default: defprops.tabbar.activeColor
        },
        // 未选中标签的颜色
        inactiveColor: {
            type: String,
            default: defprops.tabbar.inactiveColor
        },
        // 是否固定在底部
        fixed: {
            type: Boolean,
            default: defprops.tabbar.fixed
        },
        // fixed定位固定在底部时，是否生成一个等高元素防止塌陷
        placeholder: {
            type: Boolean,
            default: defprops.tabbar.placeholder
        }
    }
}
