import defprops from '../../libs/config/props';
export default {
    props: {
        // 倒计时时长，单位ms
        time: {
            type: [String, Number],
            default: defprops.countDown.time
        },
        // 时间格式，DD-日，HH-时，mm-分，ss-秒，SSS-毫秒
        format: {
            type: String,
            default: defprops.countDown.format
        },
        // 是否自动开始倒计时
        autoStart: {
            type: Boolean,
            default: defprops.countDown.autoStart
        },
        // 是否展示毫秒倒计时
        millisecond: {
            type: Boolean,
            default: defprops.countDown.millisecond
        }
    }
}
