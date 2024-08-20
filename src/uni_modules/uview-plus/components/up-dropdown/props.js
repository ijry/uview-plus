import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 菜单标题和选项的激活态颜色
        activeColor: {
            type: String,
            default: '#2979ff'
        },
        // 菜单标题和选项的未激活态颜色
        inactiveColor: {
            type: String,
            default: '#606266'
        },
        // 点击遮罩是否关闭菜单
        closeOnClickMask: {
            type: Boolean,
            default: true
        },
        // 点击当前激活项标题是否关闭菜单
        closeOnClickSelf: {
            type: Boolean,
            default: true
        },
        // 过渡时间
        duration: {
            type: [Number, String],
            default: 300
        },
        // 标题菜单的高度
        height: {
            type: [Number, String],
            default: 40
        },
        // 是否显示下边框
        borderBottom: {
            type: Boolean,
            default: false
        },
        // 标题的字体大小
        titleSize: {
            type: [Number, String],
            default: 14
        },
        // 下拉出来的内容部分的圆角值
        borderRadius: {
            type: [Number, String],
            default: 0
        },
        // 菜单右侧的icon图标
        menuIcon: {
            type: String,
            default: 'arrow-down'
        },
        // 菜单右侧图标的大小
        menuIconSize: {
            type: [Number, String],
            default: 14
        }
    }
})
