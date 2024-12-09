import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 显示的内容，字符串
        text: {
            type: [Array],
            default: () => defProps.columnNotice.text
        },
        // 是否显示左侧的音量图标
        icon: {
            type: String,
            default: () => defProps.columnNotice.icon
        },
        // 通告模式，link-显示右箭头，closable-显示右侧关闭图标
        mode: {
            type: String,
            default: () => defProps.columnNotice.mode
        },
        // 文字颜色，各图标也会使用文字颜色
        color: {
            type: String,
            default: () => defProps.columnNotice.color
        },
        // 背景颜色
        bgColor: {
            type: String,
            default: () => defProps.columnNotice.bgColor
        },
        // 字体大小，单位px
        fontSize: {
            type: [String, Number],
            default: () => defProps.columnNotice.fontSize
        },
        // 水平滚动时的滚动速度，即每秒滚动多少px(px)，这有利于控制文字无论多少时，都能有一个恒定的速度
        speed: {
            type: [String, Number],
            default: () => defProps.columnNotice.speed
        },
        // direction = row时，是否使用步进形式滚动
        step: {
            type: Boolean,
            default: () => defProps.columnNotice.step
        },
        // 滚动一个周期的时间长，单位ms
        duration: {
            type: [String, Number],
            default: () => defProps.columnNotice.duration
        },
        // 是否禁止用手滑动切换
        // 目前HX2.6.11，只支持App 2.5.5+、H5 2.5.5+、支付宝小程序、字节跳动小程序
        disableTouch: {
            type: Boolean,
            default: () => defProps.columnNotice.disableTouch
        },
		justifyContent: {
			type: String,
			default: () => defProps.columnNotice.justifyContent
		}
    }
})
