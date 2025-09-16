/*
 * @Author       : jry
 * @Description  :
 * @version      : 3.0
 * @LastAuthor   : jry
 * @lastTime     : 2025-08-17 17:23:53
 * @FilePath     : /uview-plus/libs/config/props/props.js
 */
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
        },
        // 动画类型
        transitionMode: {
            type: [String],
            default: () => defProps.alert.transitionMode
        },
        // 自动定时关闭毫秒
        duration: {
            type: [Number],
            default: () => defProps.alert.duration
        },
        // 自定义图标
        icon: {
            type: [String],
            default: () => defProps.alert.icon
        },
        // 是否显示
        modelValue: {
            type: [Boolean],
            default: () => defProps.alert.value
        }
    }
})
