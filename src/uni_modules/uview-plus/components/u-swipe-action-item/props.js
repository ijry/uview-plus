import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 控制打开或者关闭
        show: {
            type: Boolean,
            default: () => defProps.swipeActionItem.show
        },
        // 标识符，如果是v-for，可用index索引值
        name: {
            type: [String, Number],
            default: () => defProps.swipeActionItem.name
        },
        // 是否禁用
        disabled: {
            type: Boolean,
            default: () => defProps.swipeActionItem.disabled
        },
        // 是否自动关闭其他swipe按钮组
        autoClose: {
            type: Boolean,
            default: () => defProps.swipeActionItem.autoClose
        },
        // 滑动距离阈值，只有大于此值，才被认为是要打开菜单
        threshold: {
            type: Number,
            default: () => defProps.swipeActionItem.threshold
        },
        // 右侧按钮内容
        options: {
            type: Array,
            default() {
                return defProps.swipeActionItem.rightOptions
            }
        },
        // 动画过渡时间，单位ms
        duration: {
            type: [String, Number],
            default: () => defProps.swipeActionItem.duration
        }
    }
})
