import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // #ifdef VUE3
        // 当前选中项的value值
        modelValue: {
            type: [Number, String, Array],
            default: ''
        },
		// #endif
		// #ifdef VUE2
		// 当前选中项的value值
        value: {
            type: [Number, String, Array],
            default: ''
        },
		// #endif
        // 菜单项标题
        title: {
            type: [String, Number],
            default: ''
        },
        // 选项数据，如果传入了默认slot，此参数无效
        options: {
            type: Array,
            default() {
                return []
            }
        },
        // 是否禁用此菜单项
        disabled: {
            type: Boolean,
            default: false
        },
        // 下拉弹窗的高度
        height: {
            type: [Number, String],
            default: 'auto'
        },
        // 点击遮罩是否可以收起弹窗
        closeOnClickOverlay: {
            type: Boolean,
            default: true
        }
    }
})
