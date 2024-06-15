import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 显示文字
        title: {
            type: String,
            default: () => defProps.alert.title
        },
        // 主题，success/warning/info/error
        type: {
            type: String,
            default: () => defProps.alert.type
        },
        // 辅助性文字
        description: {
            type: String,
            default: () => defProps.alert.description
        },
        // 是否可关闭
        closable: {
            type: Boolean,
            default: () => defProps.alert.closable
        },
        // 是否显示图标
        showIcon: {
            type: Boolean,
            default: () => defProps.alert.showIcon
        },
        // 浅或深色调，light-浅色，dark-深色
        effect: {
            type: String,
            default: () => defProps.alert.effect
        },
        // 文字是否居中
        center: {
            type: Boolean,
            default: () => defProps.alert.center
        },
        // 字体大小
        fontSize: {
            type: [String, Number],
            default: () => defProps.alert.fontSize
        }
    }
})
