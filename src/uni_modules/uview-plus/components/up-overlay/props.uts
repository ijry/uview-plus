import { defineMixin } from '../../libs/vue'
import defProps from './overlay'
let crtProp = defProps['overlay'] as UTSJSONObject

export const propsOverlay = defineMixin({
    props: {
        // 是否显示遮罩
        show: {
            type: Boolean,
            default: crtProp['show']
        },
        // 层级z-index
        zIndex: {
            type: [String, Number],
            default: crtProp['zIndex']
        },
        // 遮罩的过渡时间，单位为ms
        duration: {
            type: [String, Number],
            default: crtProp['duration']
        },
        // 不透明度值，当做rgba的第四个参数
        opacity: {
            type: [String, Number],
            default: crtProp['opacity']
        }
    }
})
