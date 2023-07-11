import defprops from '../../libs/config/props';
export default {
    props: {
        // 排列方向
        direction: {
            type: String,
            default: defprops.steps.direction
        },
        // 设置第几个步骤
        current: {
            type: [String, Number],
            default: defprops.steps.current
        },
        // 激活状态颜色
        activeColor: {
            type: String,
            default: defprops.steps.activeColor
        },
        // 未激活状态颜色
        inactiveColor: {
            type: String,
            default: defprops.steps.inactiveColor
        },
        // 激活状态的图标
        activeIcon: {
            type: String,
            default: defprops.steps.activeIcon
        },
        // 未激活状态图标
        inactiveIcon: {
            type: String,
            default: defprops.steps.inactiveIcon
        },
        // 是否显示点类型
        dot: {
            type: Boolean,
            default: defprops.steps.dot
        }
    }
}
