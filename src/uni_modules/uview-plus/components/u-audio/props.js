import { defineMixin } from '../../libs/vue'
import { registerComponentProps } from '../../libs/config/props.js'
import AudioDefaultProps from './audio'

const defProps = registerComponentProps(AudioDefaultProps)

export const props = defineMixin({
    props: {
        // 音频地址，支持单个地址或地址数组（多源）
        src: {
            type: [String, Array],
            default: () => defProps.audio.src
        },
        // 标题
        title: {
            type: String,
            default: () => defProps.audio.title
        },
        // 是否循环播放
        loop: {
            type: Boolean,
            default: () => defProps.audio.loop
        },
        // 是否显示倍速切换
        showRate: {
            type: Boolean,
            default: () => defProps.audio.showRate
        },
        // 可切换的倍速档位
        rateList: {
            type: Array,
            default: () => defProps.audio.rateList
        },
        // 主题色
        activeColor: {
            type: String,
            default: () => defProps.audio.activeColor
        },
        // 是否显示标题
        showTitle: {
            type: Boolean,
            default: () => defProps.audio.showTitle
        }
    }
})

export default props
