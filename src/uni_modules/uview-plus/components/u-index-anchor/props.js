import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 列表锚点文本内容
        text: {
            type: [String, Number],
            default: () => defProps.indexAnchor.text
        },
        // 列表锚点文字颜色
        color: {
            type: String,
            default: () => defProps.indexAnchor.color
        },
        // 列表锚点文字大小，单位默认px
        size: {
            type: [String, Number],
            default: () => defProps.indexAnchor.size
        },
        // 列表锚点背景颜色
        bgColor: {
            type: String,
            default: () => defProps.indexAnchor.bgColor
        },
        // 列表锚点高度，单位默认px
        height: {
            type: [String, Number],
            default: () => defProps.indexAnchor.height
        }
    }
})
