import defProps from '../../libs/config/props';
const defprops = uni?.$u?.props || defProps;
export default {
    props: {
        // 列表锚点文本内容
        text: {
            type: [String, Number],
            default: defprops.indexAnchor.text
        },
        // 列表锚点文字颜色
        color: {
            type: String,
            default: defprops.indexAnchor.color
        },
        // 列表锚点文字大小，单位默认px
        size: {
            type: [String, Number],
            default: defprops.indexAnchor.size
        },
        // 列表锚点背景颜色
        bgColor: {
            type: String,
            default: defprops.indexAnchor.bgColor
        },
        // 列表锚点高度，单位默认px
        height: {
            type: [String, Number],
            default: defprops.indexAnchor.height
        }
    }
}
