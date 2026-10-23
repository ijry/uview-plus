import { defineMixin } from '../../libs/vue'
import LottieDefaultProps from './lottie'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps(LottieDefaultProps)

export const props = defineMixin({
    props: {
        // 动画 JSON 路径，支持 http(s)；H5 / App-Vue 额外支持本地静态路径
        filePath: {
            type: String,
            default: () => defProps.lottie.filePath
        },
        // 直接传入 Lottie JSON 对象，优先级高于 filePath
        animationData: {
            type: Object,
            default: () => defProps.lottie.animationData
        },
        // 内容填充模式：ScaleToFill / AspectFill / Center
        contentModel: {
            type: String,
            default: () => defProps.lottie.contentModel
        },
        // 是否循环播放
        loop: {
            type: Boolean,
            default: () => defProps.lottie.loop
        },
        // 数据与引擎就绪后是否自动播放
        autoplay: {
            type: Boolean,
            default: () => defProps.lottie.autoplay
        }
    }
})
