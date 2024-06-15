import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 是否显示遮罩
        show: {
            type: Boolean,
            default: () => defProps.overlay.show
        },
        // 层级z-index
        zIndex: {
            type: [String, Number],
            default: () => defProps.overlay.zIndex
        },
        // 遮罩的过渡时间，单位为ms
        duration: {
            type: [String, Number],
            default: () => defProps.overlay.duration
        },
        // 不透明度值，当做rgba的第四个参数
        opacity: {
            type: [String, Number],
            default: () => defProps.overlay.opacity
        }
    }
})
