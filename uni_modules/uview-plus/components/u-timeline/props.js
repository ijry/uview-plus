import defprops from '../../libs/config/props';
export default {
    props: {
        // 是否显示
        show: {
            type: Boolean,
            default: defprops.drawer.show
        },
        // 点击遮罩是否关闭
        mask: {
            type: Boolean,
            default: defprops.drawer.mask
        },
        // 抽屉宽度
        width: {
            type: [String, Number],
            default: defprops.drawer.width 
        },
        // 抽屉位置
        placement: {
            type: String,
            default: defprops.drawer.placement
        },
        // 权重
        zIndex: {
            type: Number,
            default: defprops.drawer.zIndex
        },


      }
    }