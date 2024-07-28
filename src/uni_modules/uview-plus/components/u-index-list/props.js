import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 右边锚点非激活的颜色
        inactiveColor: {
            type: String,
            default: () => defProps.indexList.inactiveColor
        },
        // 右边锚点激活的颜色
        activeColor: {
            type: String,
            default: () => defProps.indexList.activeColor
        },
        // 索引字符列表，数组形式
        indexList: {
            type: Array,
            default: () => defProps.indexList.indexList
        },
        // 是否开启锚点自动吸顶
        sticky: {
            type: Boolean,
            default: () => defProps.indexList.sticky
        },
        // 自定义导航栏的高度
        customNavHeight: {
            type: [String, Number],
            default: () => defProps.indexList.customNavHeight
        },
        // 是否开启底部安全距离适配
        safeBottomFix: {
            type: Boolean,
            default: () => defProps.indexList.safeBottomFix
        },
    }
})
