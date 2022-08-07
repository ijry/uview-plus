import defprops from '../../libs/config/props';
export default {
    props: {
        // 是否显示遮罩
        show: {
            type: Boolean,
            default: defprops.overlay.show
        },
        // 层级z-index
        zIndex: {
            type: [String, Number],
            default: defprops.overlay.zIndex
        },
        // 遮罩的过渡时间，单位为ms
        duration: {
            type: [String, Number],
            default: defprops.overlay.duration
        },
        // 不透明度值，当做rgba的第四个参数
        opacity: {
            type: [String, Number],
            default: defprops.overlay.opacity
        }
    }
}
