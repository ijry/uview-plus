import defprops from '../../libs/config/props';
export default {
    props: {
        // 显示的内容，字符串
        text: {
            type: String,
            default: defprops.rowNotice.text
        },
        // 是否显示左侧的音量图标
        icon: {
            type: String,
            default: defprops.rowNotice.icon
        },
        // 通告模式，link-显示右箭头，closable-显示右侧关闭图标
        mode: {
            type: String,
            default: defprops.rowNotice.mode
        },
        // 文字颜色，各图标也会使用文字颜色
        color: {
            type: String,
            default: defprops.rowNotice.color
        },
        // 背景颜色
        bgColor: {
            type: String,
            default: defprops.rowNotice.bgColor
        },
        // 字体大小，单位px
        fontSize: {
            type: [String, Number],
            default: defprops.rowNotice.fontSize
        },
        // 水平滚动时的滚动速度，即每秒滚动多少px(rpx)，这有利于控制文字无论多少时，都能有一个恒定的速度
        speed: {
            type: [String, Number],
            default: defprops.rowNotice.speed
        }
    }
}
