import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'

export const props = defineMixin({
    props: {
        // 显示的文字内容
        text: {
            type: [String, Number],
            default: ''
        },
        // 文字颜色
        color: {
            type: String,
            default: '#333'
        },
        // 背景颜色
        bgColor: {
            type: String,
            default: '#f7f7f7'
        },
        // 弹出框背景颜色
        popupBgColor: {
            type: String,
            default: '#f7f7f7'
        },
        // 弹出框位置
        placement: {
            type: String,
            default: 'top'
        },
        // 触发方式
        triggerMode: {
            type: String,
            default: 'click'
        },
        // 是否显示 (manual模式下使用)
        show: {
            type: Boolean,
            default: false
        },
        // z-index值
        zIndex: {
            type: [Number, String],
            default: 10070
        },
        // 强制定位
        forcePosition: {
            type: Object,
            default() {
                return {}
            }
        },
        // 弹出方向
        direction: {
            type: String,
            default: 'top'
        }
    }
})
