import defProps from '../../libs/config/props';
const defprops = uni?.$u?.props || defProps;
export default {
    props: {
        // 宫格的name
        name: {
            type: [String, Number, null],
            default: defprops.gridItem.name
        },
        // 背景颜色
        bgColor: {
            type: String,
            default: defprops.gridItem.bgColor
        }
    }
}
