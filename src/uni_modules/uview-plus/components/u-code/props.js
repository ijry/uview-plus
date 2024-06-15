import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 倒计时总秒数
        seconds: {
            type: [String, Number],
            default: () => defProps.code.seconds
        },
        // 尚未开始时提示
        startText: {
            type: String,
            default: () => defProps.code.startText
        },
        // 正在倒计时中的提示
        changeText: {
            type: String,
            default: () => defProps.code.changeText
        },
        // 倒计时结束时的提示
        endText: {
            type: String,
            default: () => defProps.code.endText
        },
        // 是否在H5刷新或各端返回再进入时继续倒计时
        keepRunning: {
            type: Boolean,
            default: () => defProps.code.keepRunning
        },
        // 为了区分多个页面，或者一个页面多个倒计时组件本地存储的继续倒计时变了
        uniqueKey: {
            type: String,
            default: () => defProps.code.uniqueKey
        }
    }
})
