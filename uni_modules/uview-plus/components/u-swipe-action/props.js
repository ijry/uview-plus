import defprops from '../../libs/config/props';
export default {
    props: {
        // 是否自动关闭其他swipe按钮组
        autoClose: {
            type: Boolean,
            default: defprops.swipeAction.autoClose
        }
    }
}
