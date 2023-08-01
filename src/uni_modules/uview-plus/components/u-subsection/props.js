import defprops from '../../libs/config/props';
export default {
    props: {
        // tab的数据
        list: {
            type: Array,
            default: defprops.subsection.list
        },
        // 当前活动的tab的index
        current: {
            type: [String, Number],
            default: defprops.subsection.current
        },
        // 激活的颜色
        activeColor: {
            type: String,
            default: defprops.subsection.activeColor
        },
        // 未激活的颜色
        inactiveColor: {
            type: String,
            default: defprops.subsection.inactiveColor
        },
        // 模式选择，mode=button为按钮形式，mode=subsection时为分段模式
        mode: {
            type: String,
            default: defprops.subsection.mode
        },
        // 字体大小
        fontSize: {
            type: [String, Number],
            default: defprops.subsection.fontSize
        },
        // 激活tab的字体是否加粗
        bold: {
            type: Boolean,
            default: defprops.subsection.bold
        },
        // mode = button时，组件背景颜色
        bgColor: {
            type: String,
            default: defprops.subsection.bgColor
        },
		// 从list元素对象中读取的键名
		keyName: {
			type: String,
			default: defprops.subsection.keyName
		}
    }
}
