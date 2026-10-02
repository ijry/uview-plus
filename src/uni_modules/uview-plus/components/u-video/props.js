import { defineMixin } from '../../libs/vue'
import { registerComponentProps } from '../../libs/config/props.js'
import VideoDefaultProps from './video'

const defProps = registerComponentProps(VideoDefaultProps)

export const props = defineMixin({
    props: {
        // 视频地址，传了 episodes 时作为兜底地址
        src: {
            type: String,
            default: () => defProps.video.src
        },
        // 封面图
        poster: {
            type: String,
            default: () => defProps.video.poster
        },
        title: {
            type: String,
            default: () => defProps.video.title
        },
        width: {
            type: [String, Number],
            default: () => defProps.video.width
        },
        height: {
            type: [String, Number],
            default: () => defProps.video.height
        },
        radius: {
            type: [String, Number],
            default: () => defProps.video.radius
        },
        objectFit: {
            type: String,
            default: () => defProps.video.objectFit
        },
        autoplay: {
            type: Boolean,
            default: () => defProps.video.autoplay
        },
        loop: {
            type: Boolean,
            default: () => defProps.video.loop
        },
        muted: {
            type: Boolean,
            default: () => defProps.video.muted
        },
        initialTime: {
            type: [String, Number],
            default: () => defProps.video.initialTime
        },
        // 自绘控制层总开关
        controls: {
            type: Boolean,
            default: () => defProps.video.controls
        },
        showCenterPlayBtn: {
            type: Boolean,
            default: () => defProps.video.showCenterPlayBtn
        },
        showFullscreenBtn: {
            type: Boolean,
            default: () => defProps.video.showFullscreenBtn
        },
        showBack: {
            type: Boolean,
            default: () => defProps.video.showBack
        },
        backIcon: {
            type: String,
            default: () => defProps.video.backIcon
        },
        autoHide: {
            type: [String, Number],
            default: () => defProps.video.autoHide
        },
        showLock: {
            type: Boolean,
            default: () => defProps.video.showLock
        },
        // 倍速
        showRate: {
            type: Boolean,
            default: () => defProps.video.showRate
        },
        rate: {
            type: [String, Number],
            default: () => defProps.video.rate
        },
        rateList: {
            type: Array,
            default: () => defProps.video.rateList
        },
        // 音量
        showVolume: {
            type: Boolean,
            default: () => defProps.video.showVolume
        },
        volume: {
            type: [String, Number],
            default: () => defProps.video.volume
        },
        // 弹幕
        enableDanmu: {
            type: Boolean,
            default: () => defProps.video.enableDanmu
        },
        danmuList: {
            type: Array,
            default: () => defProps.video.danmuList
        },
        danmuBtn: {
            type: Boolean,
            default: () => defProps.video.danmuBtn
        },
        danmuOpen: {
            type: Boolean,
            default: () => defProps.video.danmuOpen
        },
        danmuColor: {
            type: String,
            default: () => defProps.video.danmuColor
        },
        danmuFontSize: {
            type: [String, Number],
            default: () => defProps.video.danmuFontSize
        },
        danmuDuration: {
            type: [String, Number],
            default: () => defProps.video.danmuDuration
        },
        danmuArea: {
            type: String,
            default: () => defProps.video.danmuArea
        },
        danmuOpacity: {
            type: [String, Number],
            default: () => defProps.video.danmuOpacity
        },
        danmuMax: {
            type: [String, Number],
            default: () => defProps.video.danmuMax
        },
        // 选集
        episodes: {
            type: Array,
            default: () => defProps.video.episodes
        },
        episodeIndex: {
            type: [String, Number],
            default: () => defProps.video.episodeIndex
        },
        episodeColumns: {
            type: [String, Number],
            default: () => defProps.video.episodeColumns
        },
        autoNext: {
            type: Boolean,
            default: () => defProps.video.autoNext
        },
        // 广告
        ads: {
            type: Array,
            default: () => defProps.video.ads
        },
        // 原生手势
        enableProgressGesture: {
            type: Boolean,
            default: () => defProps.video.enableProgressGesture
        },
        pageGesture: {
            type: Boolean,
            default: () => defProps.video.pageGesture
        },
        vslideGesture: {
            type: Boolean,
            default: () => defProps.video.vslideGesture
        },
        direction: {
            type: [String, Number],
            default: () => defProps.video.direction
        },
        autoPauseIfNavigate: {
            type: Boolean,
            default: () => defProps.video.autoPauseIfNavigate
        },
        autoPauseIfOpenNative: {
            type: Boolean,
            default: () => defProps.video.autoPauseIfOpenNative
        },
        videoId: {
            type: String,
            default: () => defProps.video.videoId
        },
        activeColor: {
            type: String,
            default: () => defProps.video.activeColor
        }
    }
})

export default props
