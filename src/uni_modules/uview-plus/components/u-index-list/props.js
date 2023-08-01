import defprops from '../../libs/config/props';
export default {
    props: {
        // 右边锚点非激活的颜色
        inactiveColor: {
            type: String,
            default: defprops.indexList.inactiveColor
        },
        // 右边锚点激活的颜色
        activeColor: {
            type: String,
            default: defprops.indexList.activeColor
        },
        // 索引字符列表，数组形式
        indexList: {
            type: Array,
            default: defprops.indexList.indexList
        },
        // 是否开启锚点自动吸顶
        sticky: {
            type: Boolean,
            default: defprops.indexList.sticky
        },
        // 自定义导航栏的高度
        customNavHeight: {
            type: [String, Number],
            default: defprops.indexList.customNavHeight
        }
    }
}
