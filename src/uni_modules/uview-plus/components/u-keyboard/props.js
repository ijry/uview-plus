import defProps from '../../libs/config/props';
const defprops = uni?.$u?.props || defProps;
export default {
    props: {
        // 键盘的类型，number-数字键盘，card-身份证键盘，car-车牌号键盘
        mode: {
            type: String,
            default: defprops.keyboard.mode
        },
        // 是否显示键盘的"."符号
        dotDisabled: {
            type: Boolean,
            default: defprops.keyboard.dotDisabled
        },
        // 是否显示顶部工具条
        tooltip: {
            type: Boolean,
            default: defprops.keyboard.tooltip
        },
        // 是否显示工具条中间的提示
        showTips: {
            type: Boolean,
            default: defprops.keyboard.showTips
        },
        // 工具条中间的提示文字
        tips: {
            type: String,
            default: defprops.keyboard.tips
        },
        // 是否显示工具条左边的"取消"按钮
        showCancel: {
            type: Boolean,
            default: defprops.keyboard.showCancel
        },
        // 是否显示工具条右边的"完成"按钮
        showConfirm: {
            type: Boolean,
            default: defprops.keyboard.showConfirm
        },
        // 是否打乱键盘按键的顺序
        random: {
            type: Boolean,
            default: defprops.keyboard.random
        },
        // 是否开启底部安全区适配，开启的话，会在iPhoneX机型底部添加一定的内边距
        safeAreaInsetBottom: {
            type: Boolean,
            default: defprops.keyboard.safeAreaInsetBottom
        },
        // 是否允许通过点击遮罩关闭键盘
        closeOnClickOverlay: {
            type: Boolean,
            default: defprops.keyboard.closeOnClickOverlay
        },
        // 控制键盘的弹出与收起
        show: {
            type: Boolean,
            default: defprops.keyboard.show
        },
        // 是否显示遮罩，某些时候数字键盘时，用户希望看到自己的数值，所以可能不想要遮罩
        overlay: {
            type: Boolean,
            default: defprops.keyboard.overlay
        },
        // z-index值
        zIndex: {
            type: [String, Number],
            default: defprops.keyboard.zIndex
        },
        // 取消按钮的文字
        cancelText: {
            type: String,
            default: defprops.keyboard.cancelText
        },
        // 确认按钮的文字
        confirmText: {
            type: String,
            default: defprops.keyboard.confirmText
        },
        // 输入一个中文后，是否自动切换到英文
        autoChange: {
            type: Boolean,
            default: defprops.keyboard.autoChange
        }
    }
}
