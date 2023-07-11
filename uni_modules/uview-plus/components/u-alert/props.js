import defprops from '../../libs/config/props';
export default {
    props: {
        // 显示文字
        title: {
            type: String,
            default: defprops.alert.title
        },
        // 主题，success/warning/info/error
        type: {
            type: String,
            default: defprops.alert.type
        },
        // 辅助性文字
        description: {
            type: String,
            default: defprops.alert.description
        },
        // 是否可关闭
        closable: {
            type: Boolean,
            default: defprops.alert.closable
        },
        // 是否显示图标
        showIcon: {
            type: Boolean,
            default: defprops.alert.showIcon
        },
        // 浅或深色调，light-浅色，dark-深色
        effect: {
            type: String,
            default: defprops.alert.effect
        },
        // 文字是否居中
        center: {
            type: Boolean,
            default: defprops.alert.center
        },
        // 字体大小
        fontSize: {
            type: [String, Number],
            default: defprops.alert.fontSize
        }
    }
}
