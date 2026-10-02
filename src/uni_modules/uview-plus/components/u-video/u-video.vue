<template>
    <view
        class="up-video"
        :class="[customClass, fullscreen ? 'up-video--fullscreen' : '']"
        :style="[rootStyle, addStyle(customStyle)]"
    >
        <video
            :id="innerVideoId"
            class="up-video__player"
            :src="playingSrc"
            :poster="currentPoster"
            :controls="false"
            :autoplay="nativeAutoplay"
            :loop="loop"
            :muted="innerMuted"
            :initial-time="initialTime"
            :object-fit="objectFit"
            :direction="nativeDirection"
            :show-fullscreen-btn="false"
            :show-play-btn="false"
            :show-center-play-btn="false"
            :show-mute-btn="false"
            :enable-progress-gesture="enableProgressGesture"
            :page-gesture="pageGesture"
            :vslide-gesture="vslideGesture"
            :auto-pause-if-navigate="autoPauseIfNavigate"
            :auto-pause-if-open-native="autoPauseIfOpenNative"
            @play="onPlay"
            @pause="onPause"
            @ended="onEnded"
            @timeupdate="onTimeUpdate"
            @waiting="onWaiting"
            @error="onError"
            @progress="onProgress"
            @fullscreenchange="onFullscreenChange"
            @loadedmetadata="onLoadedMetadata"
        >
            <!-- 弹幕层 -->
            <video-danmaku
                v-if="enableDanmu"
                ref="danmaku"
                class="up-video__layer"
                :list="activeDanmuList"
                :open="innerDanmuOpen"
                :color="danmuColor"
                :font-size="danmuFontSize"
                :duration="danmuDuration"
                :area="danmuArea"
                :opacity="danmuOpacity"
                :max="danmuMax"
            ></video-danmaku>

            <!-- 整块点击区，用于显示/隐藏控制层 -->
            <view class="up-video__layer" @click.stop="onPlayerTap"></view>

            <!-- 缓冲提示 -->
            <view v-if="loading" class="up-video__layer up-video__center">
                <up-loading-icon mode="circle" color="#ffffff" size="30"></up-loading-icon>
            </view>

            <!-- 播放失败 -->
            <view v-if="errored" class="up-video__layer up-video__center up-video__mask">
                <text class="up-video__hint">{{ t('up.video.error') }}</text>
                <view class="up-video__retry" @click.stop="retry">
                    <text class="up-video__retry-text">{{ t('up.common.retry') }}</text>
                </view>
            </view>

            <!-- 封面 -->
            <view v-if="coverVisible" class="up-video__layer up-video__cover" @click.stop="onCoverTap">
                <image v-if="currentPoster" class="up-video__cover-image" :src="currentPoster" mode="aspectFill"></image>
                <view class="up-video__cover-mask"></view>
                <view v-if="showCenterPlayBtn" class="up-video__cover-btn">
                    <up-icon name="play-right-fill" color="#ffffff" size="26"></up-icon>
                </view>
            </view>

            <!-- 顶部信息栏 -->
            <view v-if="topBarVisible" class="up-video__top">
                <view v-if="showBack" class="up-video__icon-btn" @click.stop="onBack">
                    <up-icon :name="backIcon" color="#ffffff" size="20"></up-icon>
                </view>
                <text v-if="title" class="up-video__top-title">{{ title }}</text>
            </view>

            <!-- 锁屏后只留一个解锁按钮 -->
            <view v-if="locked" class="up-video__unlock" @click.stop="toggleLock">
                <up-icon name="lock-fill" color="#ffffff" size="18"></up-icon>
            </view>

            <!-- 控制条 -->
            <view v-if="barVisible" class="up-video__controls">
                <view class="up-video__row">
                    <view class="up-video__icon-btn" @click.stop="toggle">
                        <up-icon :name="playing ? 'pause' : 'play-right-fill'" color="#ffffff" size="18"></up-icon>
                    </view>
                    <text class="up-video__time">{{ timeText }}</text>
                    <video-slider
                        :percent="progressPercent"
                        :buffered="bufferedPercent"
                        :active-color="activeColor"
                        @start="onProgressStart"
                        @changing="onProgressChanging"
                        @change="onProgressChange"
                    ></video-slider>
                    <text class="up-video__time">{{ durationText }}</text>
                    <view v-if="showVolume" class="up-video__icon-btn" @click.stop="togglePanel('volume')">
                        <up-icon :name="volumeIcon" color="#ffffff" size="18"></up-icon>
                    </view>
                    <view v-if="showRate" class="up-video__text-btn" @click.stop="togglePanel('rate')">
                        <text class="up-video__btn-text">{{ rateText }}</text>
                    </view>
                    <view v-if="danmuEntryVisible" class="up-video__icon-btn" @click.stop="toggleDanmu">
                        <up-icon :name="innerDanmuOpen ? 'chat-fill' : 'chat'" color="#ffffff" size="18"></up-icon>
                    </view>
                    <view v-if="danmuEntryVisible" class="up-video__text-btn" @click.stop="togglePanel('danmu')">
                        <text class="up-video__btn-text">{{ t('up.video.danmu') }}</text>
                    </view>
                    <view v-if="episodeList.length > 1" class="up-video__text-btn" @click.stop="togglePanel('episode')">
                        <text class="up-video__btn-text">{{ t('up.video.episodes') }}</text>
                    </view>
                    <view v-if="showLock" class="up-video__icon-btn" @click.stop="toggleLock">
                        <up-icon name="lock" color="#ffffff" size="18"></up-icon>
                    </view>
                    <view v-if="showFullscreenBtn" class="up-video__icon-btn" @click.stop="toggleFullscreen">
                        <view class="up-video__fullscreen">
                            <view :class="[fullscreen ? 'up-video__corner-tl-in' : 'up-video__corner-tl']"></view>
                            <view :class="[fullscreen ? 'up-video__corner-tr-in' : 'up-video__corner-tr']"></view>
                            <view :class="[fullscreen ? 'up-video__corner-bl-in' : 'up-video__corner-bl']"></view>
                            <view :class="[fullscreen ? 'up-video__corner-br-in' : 'up-video__corner-br']"></view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 倍速面板 -->
            <view v-if="panel === 'rate'" class="up-video__layer up-video__panel" @click.stop="closePanel">
                <view class="up-video__panel-body" @click.stop="noop">
                    <text class="up-video__panel-title">{{ t('up.video.rate') }}</text>
                    <view
                        v-for="(item, index) in rates"
                        :key="index"
                        class="up-video__panel-item"
                        @click.stop="setRate(item)"
                    >
                        <text
                            class="up-video__panel-text"
                            :style="{ color: item === innerRate ? activeColor : '#ffffff' }"
                        >{{ item }}x</text>
                    </view>
                </view>
            </view>

            <!-- 选集面板 -->
            <view v-if="panel === 'episode'" class="up-video__layer up-video__panel" @click.stop="closePanel">
                <view class="up-video__panel-body up-video__panel-body--wide" @click.stop="noop">
                    <text class="up-video__panel-title">{{ t('up.video.episodes') }}</text>
                    <view class="up-video__episode-grid">
                        <view
                            v-for="(item, index) in episodeList"
                            :key="index"
                            class="up-video__episode-cell"
                            :style="{ width: episodeWidth }"
                            @click.stop="switchEpisode(index)"
                        >
                            <view class="up-video__episode" :style="episodeStyle(index)">
                                <text class="up-video__episode-text">{{ item.title }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 音量面板 -->
            <view v-if="panel === 'volume'" class="up-video__volume" @click.stop="noop">
                <view class="up-video__icon-btn" @click.stop="toggleMute">
                    <up-icon :name="volumeIcon" color="#ffffff" size="16"></up-icon>
                </view>
                <text class="up-video__volume-label">{{ t('up.video.volume') }}</text>
                <video-slider
                    :percent="volumePercent"
                    :active-color="activeColor"
                    @changing="onVolumeChanging"
                    @change="onVolumeChange"
                ></video-slider>
                <text class="up-video__volume-value">{{ volumeText }}</text>
            </view>
        </video>

        <!-- 广告层：独立 video 节点，不嵌套进主播放器 -->
        <view v-if="currentAd" class="up-video__ad">
            <video
                v-if="currentAd.src"
                :id="adVideoId"
                class="up-video__ad-media"
                :src="currentAd.src"
                :controls="false"
                :muted="innerMuted"
                autoplay
                object-fit="contain"
                @timeupdate="onAdTimeUpdate"
                @ended="finishAd"
                @error="finishAd"
            ></video>
            <image
                v-else-if="currentAd.image"
                class="up-video__ad-media"
                :src="currentAd.image"
                mode="aspectFill"
                @click="onAdClick"
            ></image>
            <view class="up-video__ad-bar">
                <text class="up-video__ad-tag">{{ adTagText }}</text>
                <view v-if="currentAd.link" class="up-video__ad-btn" @click.stop="onAdClick">
                    <text class="up-video__ad-btn-text">{{ t('up.video.adDetail') }}</text>
                </view>
                <view v-if="adCanSkip" class="up-video__ad-btn" @click.stop="skipAd">
                    <text class="up-video__ad-btn-text">{{ t('up.video.skipAd') }}</text>
                </view>
            </view>
        </view>

        <!-- 暂停贴片广告 -->
        <view v-if="pauseAdVisible" class="up-video__pause-ad">
            <image
                class="up-video__pause-ad-media"
                :src="pauseAd.image"
                mode="aspectFit"
                @click="onAdClick"
            ></image>
            <view class="up-video__pause-ad-close" @click.stop="closePauseAd">
                <up-icon name="close" color="#ffffff" size="14"></up-icon>
            </view>
        </view>

        <!-- 弹幕输入：原生 input 放在 video 节点外，规避小程序同层渲染限制 -->
        <view v-if="panel === 'danmu'" class="up-video__danmu-input">
            <input
                v-model="danmuText"
                class="up-video__danmu-field"
                type="text"
                :placeholder="t('up.video.danmuPlaceholder')"
                placeholder-style="color: rgba(255, 255, 255, 0.5)"
                confirm-type="send"
                @confirm="sendDanmu"
            />
            <view class="up-video__danmu-send" :style="{ backgroundColor: activeColor }" @click.stop="sendDanmu">
                <text class="up-video__danmu-send-text">{{ t('up.video.send') }}</text>
            </view>
        </view>
    </view>
</template>

<script>
    import { addStyle, addUnit, guid, toast } from '../../libs/function/index'
    import { mixin } from '../../libs/mixin/mixin'
    import { mpMixin } from '../../libs/mixin/mpMixin'
    import { t } from '../../libs/i18n'
    import props from './props'
    import VideoDanmaku from './video-danmaku.vue'
    import VideoSlider from './video-slider.vue'
    import {
        adSkippable,
        clampNumber,
        formatVideoTime,
        normalizeAds,
        normalizeEpisodes,
        normalizeRateList,
        pickAds,
        progressToTime,
        timeToProgress
    } from './video-utils'

    /**
     * Video 视频播放器
     * @description 在原生 video 之上自绘控制层的播放器，支持倍速、弹幕、选集、音量、封面与贴片广告。
     * 控制层渲染在 video 节点内部，因此进入全屏后依然可用；广告层是独立的 video 节点，避免嵌套原生组件。
     * @tutorial https://uview-plus.jiangruyi.com/components/video.html
     * @property {String}			src					视频地址，传了 episodes 时作为兜底地址
     * @property {String}			poster				封面图，首次播放前展示
     * @property {String}			title				标题，显示在顶部信息栏
     * @property {String | Number}	width				宽度，默认 100%
     * @property {String | Number}	height				高度，默认 211px
     * @property {String | Number}	radius				圆角
     * @property {String}			objectFit			视频填充模式 contain | fill | cover
     * @property {Boolean}			autoplay			是否自动播放，存在前置广告时先播广告
     * @property {Boolean}			loop				是否循环播放
     * @property {Boolean}			muted				是否静音
     * @property {String | Number}	initialTime			指定开始播放的位置，单位秒
     * @property {Boolean}			controls			是否显示自绘控制层，默认 true
     * @property {Boolean}			showCenterPlayBtn	封面上是否显示大播放按钮，默认 true
     * @property {Boolean}			showFullscreenBtn	是否显示全屏按钮，默认 true
     * @property {Boolean}			showBack			是否显示顶部返回按钮，默认 false
     * @property {String}			backIcon			返回按钮图标，默认 arrow-left
     * @property {String | Number}	autoHide			控制层自动隐藏毫秒数，0 表示不隐藏，默认 4000
     * @property {Boolean}			showLock			是否显示锁屏按钮，默认 true
     * @property {Boolean}			showRate			是否显示倍速入口，默认 true
     * @property {String | Number}	rate				当前倍速，默认 1
     * @property {Array}			rateList			可选倍速，默认 [0.5, 0.75, 1, 1.25, 1.5, 2]
     * @property {Boolean}			showVolume			是否显示音量入口，默认 true
     * @property {String | Number}	volume				音量 0-1，App 端调节的是系统音量，小程序端仅支持静音切换
     * @property {Boolean}			enableDanmu			是否开启弹幕，默认 false
     * @property {Array}			danmuList			弹幕列表，元素为 { text, color, time, type }，type 支持 scroll | top | bottom
     * @property {Boolean}			danmuBtn			是否显示弹幕开关与输入入口，默认 true
     * @property {Boolean}			danmuOpen			弹幕是否可见，默认 true
     * @property {String}			danmuColor			默认弹幕颜色
     * @property {String | Number}	danmuFontSize		弹幕字号，默认 14
     * @property {String | Number}	danmuDuration		一条滚动弹幕走完全屏的秒数，默认 8
     * @property {String}			danmuArea			弹幕区域 full | half | top，默认 full
     * @property {String | Number}	danmuOpacity		弹幕透明度，默认 1
     * @property {String | Number}	danmuMax			同屏最大弹幕数，默认 30
     * @property {Array}			episodes			选集列表，元素为地址字符串或 { title, src, poster, danmuList }
     * @property {String | Number}	episodeIndex		当前集索引，支持 v-model:episodeIndex
     * @property {String | Number}	episodeColumns		选集面板列数，默认 5
     * @property {Boolean}			autoNext			播完是否自动下一集，默认 true
     * @property {Array}			ads					广告列表，元素为 { type, src, image, duration, skipAfter, link, text }
     * @property {Boolean}			enableProgressGesture	是否启用原生进度手势，默认 false
     * @property {Boolean}			pageGesture			是否开启亮度与音量手势，默认 false
     * @property {Boolean}			vslideGesture		是否开启竖向手势，默认 false
     * @property {String | Number}	direction			全屏方向，-1 表示由系统判断
     * @property {String}			videoId				自定义 video 节点 id，留空自动生成
     * @property {String}			activeColor			进度条与选中态颜色，默认 #2979ff
     * @event {Function} play				开始或继续播放
     * @event {Function} pause				暂停播放
     * @event {Function} ended				播放结束
     * @event {Function} timeupdate			播放进度变化
     * @event {Function} waiting			缓冲中
     * @event {Function} error				播放错误
     * @event {Function} progress			缓冲进度变化
     * @event {Function} fullscreenchange	全屏状态变化
     * @event {Function} loadedmetadata		视频元数据加载完成
     * @event {Function} ratechange			倍速变化
     * @event {Function} volumechange		音量变化
     * @event {Function} danmu				发送了一条弹幕
     * @event {Function} danmu-toggle		弹幕显示开关变化
     * @event {Function} episode-change		切换选集
     * @event {Function} ad-start			广告开始
     * @event {Function} ad-end				广告结束
     * @event {Function} ad-skip			跳过广告
     * @event {Function} ad-click			点击广告，由业务侧决定跳转
     * @event {Function} lock				锁屏状态变化
     * @event {Function} back				点击返回按钮
     * @event {Function} controlstoggle		控制层显示状态变化
     * @example <up-video src="https://xxx.mp4" poster="https://xxx.png" enable-danmu></up-video>
     */
    export default {
        name: 'up-video',
        components: {
            VideoDanmaku,
            VideoSlider
        },
        mixins: [mpMixin, mixin, props],
        // #ifdef VUE3
        emits: [
            'play', 'pause', 'ended', 'timeupdate', 'waiting', 'error', 'progress',
            'fullscreenchange', 'loadedmetadata', 'ratechange', 'volumechange',
            'danmu', 'danmu-toggle', 'episode-change', 'ad-start', 'ad-end',
            'ad-skip', 'ad-click', 'lock', 'back', 'controlstoggle',
            'update:rate', 'update:volume', 'update:danmuOpen', 'update:episodeIndex'
        ],
        // #endif
        data() {
            return {
                innerVideoId: '',
                adVideoId: '',
                playing: false,
                // 是否已经开始播放过，用于决定封面是否显示
                started: false,
                loading: false,
                errored: false,
                currentTime: 0,
                videoDuration: 0,
                buffered: 0,
                dragging: false,
                dragPercent: 0,
                controlsVisible: true,
                locked: false,
                fullscreen: false,
                // '' | rate | episode | volume | danmu
                panel: '',
                innerRate: 1,
                innerVolume: 1,
                innerMuted: false,
                innerDanmuOpen: true,
                innerEpisodeIndex: 0,
                danmuText: '',
                currentAd: null,
                adRole: '',
                adElapsed: 0,
                adDuration: 0,
                prerollCursor: 0,
                postrollCursor: 0,
                pauseAdVisible: false
            }
        },
        computed: {
            rootStyle() {
                const style = {
                    width: addUnit(this.width),
                    height: addUnit(this.height)
                }
                if (this.radius) style.borderRadius = addUnit(this.radius)
                return style
            },
            // uni 的 direction 只接受 0 / 90 / -90，-1 表示交给系统判断
            nativeDirection() {
                const direction = Number(this.direction)
                return [0, 90, -90].includes(direction) ? direction : undefined
            },
            // 有前置广告时交给组件自己调度，避免原生自动播放抢在广告之前
            nativeAutoplay() {
                return this.autoplay && !this.prerollAds.length
            },
            episodeList() {
                return normalizeEpisodes(this.episodes)
            },
            currentEpisode() {
                return this.episodeList[this.innerEpisodeIndex] || null
            },
            playingSrc() {
                return (this.currentEpisode && this.currentEpisode.src) || this.src
            },
            currentPoster() {
                return (this.currentEpisode && this.currentEpisode.poster) || this.poster
            },
            activeDanmuList() {
                return (this.currentEpisode && this.currentEpisode.danmuList) || this.danmuList
            },
            rates() {
                return normalizeRateList(this.rateList)
            },
            normalizedAds() {
                return normalizeAds(this.ads)
            },
            prerollAds() {
                return pickAds(this.normalizedAds, 'preroll')
            },
            postrollAds() {
                return pickAds(this.normalizedAds, 'postroll')
            },
            pauseAd() {
                return pickAds(this.normalizedAds, 'pause')[0] || null
            },
            coverVisible() {
                return !this.started && !this.currentAd
            },
            topBarVisible() {
                return this.controlsVisible && !this.locked && !this.currentAd && (this.showBack || !!this.title)
            },
            barVisible() {
                return this.controls && this.controlsVisible && !this.locked && !this.currentAd
            },
            danmuEntryVisible() {
                return this.enableDanmu && this.danmuBtn
            },
            progressPercent() {
                return this.dragging ? this.dragPercent : timeToProgress(this.currentTime, this.videoDuration)
            },
            bufferedPercent() {
                return clampNumber(this.buffered, 0, 100)
            },
            timeText() {
                const time = this.dragging
                    ? progressToTime(this.dragPercent, this.videoDuration)
                    : this.currentTime
                return formatVideoTime(time)
            },
            durationText() {
                return formatVideoTime(this.videoDuration)
            },
            rateText() {
                return `${this.innerRate}x`
            },
            volumePercent() {
                return this.innerMuted ? 0 : clampNumber(this.innerVolume * 100, 0, 100)
            },
            volumeText() {
                return `${Math.round(this.volumePercent)}`
            },
            volumeIcon() {
                return this.innerMuted || this.innerVolume <= 0 ? 'volume-off' : 'volume'
            },
            episodeWidth() {
                const columns = Math.max(1, parseInt(this.episodeColumns, 10) || 1)
                return `${(100 / columns).toFixed(4)}%`
            },
            adCanSkip() {
                return !!this.currentAd && adSkippable(this.currentAd, this.adElapsed)
            },
            adTagText() {
                if (!this.currentAd) return ''
                const total = Number(this.adDuration) || 0
                if (total > 0) {
                    const left = Math.max(0, Math.ceil(total - this.adElapsed))
                    return t('up.video.adCountdown', { seconds: left })
                }
                return t('up.video.ad')
            }
        },
        watch: {
            src() {
                this.resetPlayback()
            },
            episodeIndex(value) {
                const index = parseInt(value, 10) || 0
                if (index !== this.innerEpisodeIndex) this.switchEpisode(index, true)
            },
            rate(value) {
                this.setRate(value, true)
            },
            volume(value) {
                this.innerVolume = clampNumber(value, 0, 1)
                this.applyVolume()
            },
            muted(value) {
                this.innerMuted = value
                this.applyVolume()
            },
            danmuOpen(value) {
                this.innerDanmuOpen = value
            }
        },
        created() {
            this.ctx = null
            this.hideTimer = null
            this.adTimer = null
            this.innerVideoId = this.videoId || `up-video-${guid(10, false)}`
            this.adVideoId = `${this.innerVideoId}-ad`
            this.innerRate = Number(this.rate) || 1
            this.innerVolume = clampNumber(this.volume, 0, 1)
            this.innerMuted = this.muted
            this.innerDanmuOpen = this.danmuOpen
            this.innerEpisodeIndex = parseInt(this.episodeIndex, 10) || 0
        },
        mounted() {
            this.applyVolume()
            if (this.autoplay) {
                // 原生 autoplay 已经被前置广告接管时，这里补一次调度
                if (this.prerollAds.length) {
                    this.play()
                } else {
                    this.started = true
                }
            }
            this.scheduleHide()
        },
        beforeUnmount() {
            this.clearHideTimer()
            this.clearAdTimer()
        },
        // #ifdef VUE2
        beforeDestroy() {
            this.clearHideTimer()
            this.clearAdTimer()
        },
        // #endif
        methods: {
            t,
            addStyle,
            noop() {},
            getContext() {
                if (!this.ctx) {
                    this.ctx = uni.createVideoContext(this.innerVideoId, this)
                }
                return this.ctx
            },
            getAdContext() {
                return uni.createVideoContext(this.adVideoId, this)
            },
            // ---------- 播放控制 ----------
            play() {
                if (this.currentAd) return
                // 前置贴片广告优先，播完后由 finishAd 接着播正片
                if (this.playAdQueue('preroll')) return
                this.playMain()
            },
            playMain() {
                this.started = true
                this.errored = false
                this.closePauseAd()
                const ctx = this.getContext()
                if (ctx) ctx.play()
            },
            pause() {
                const ctx = this.getContext()
                if (ctx) ctx.pause()
            },
            toggle() {
                if (this.playing) {
                    this.pause()
                } else {
                    this.play()
                }
            },
            stop() {
                const ctx = this.getContext()
                if (ctx) ctx.stop()
                this.playing = false
                this.started = false
                this.currentTime = 0
            },
            seek(time) {
                const target = clampNumber(time, 0, this.videoDuration || Number(time) || 0)
                const ctx = this.getContext()
                if (ctx) ctx.seek(target)
                this.currentTime = target
                if (this.$refs.danmaku) this.$refs.danmaku.reset(target)
                return target
            },
            retry() {
                this.errored = false
                this.loading = true
                this.$nextTick(() => this.playMain())
            },
            // 换源、换集后把播放态清干净，广告游标一起重置
            resetPlayback() {
                this.playing = false
                this.started = false
                this.loading = false
                this.errored = false
                this.currentTime = 0
                this.videoDuration = 0
                this.buffered = 0
                this.dragging = false
                this.prerollCursor = 0
                this.postrollCursor = 0
                this.closePauseAd()
                if (this.$refs.danmaku) this.$refs.danmaku.reset(0)
            },
            // ---------- 原生事件 ----------
            onPlay(event) {
                this.playing = true
                this.started = true
                this.loading = false
                this.errored = false
                this.closePauseAd()
                // 换源后倍速会被重置，这里补一次
                this.applyRate()
                this.applyVolume()
                this.scheduleHide()
                this.$emit('play', event)
            },
            onPause(event) {
                this.playing = false
                this.showControls()
                if (this.pauseAd && this.started && !this.currentAd) {
                    this.pauseAdVisible = true
                }
                this.$emit('pause', event)
            },
            onEnded(event) {
                this.playing = false
                this.$emit('ended', event)
                if (this.loop) return
                if (this.autoNext && this.innerEpisodeIndex < this.episodeList.length - 1) {
                    this.switchEpisode(this.innerEpisodeIndex + 1)
                    return
                }
                if (this.playAdQueue('postroll')) return
                this.started = false
                this.currentTime = 0
                this.showControls()
            },
            onTimeUpdate(event) {
                const detail = event && event.detail ? event.detail : {}
                if (!this.dragging && detail.currentTime !== undefined) {
                    this.currentTime = detail.currentTime
                }
                if (detail.duration) this.videoDuration = detail.duration
                this.loading = false
                if (this.$refs.danmaku) this.$refs.danmaku.sync(this.currentTime)
                this.$emit('timeupdate', event)
            },
            onWaiting(event) {
                this.loading = true
                this.$emit('waiting', event)
            },
            onError(event) {
                this.loading = false
                this.playing = false
                this.errored = true
                this.$emit('error', event)
            },
            onProgress(event) {
                const detail = event && event.detail ? event.detail : {}
                if (detail.buffered !== undefined) this.buffered = detail.buffered
                this.$emit('progress', event)
            },
            onFullscreenChange(event) {
                const detail = event && event.detail ? event.detail : {}
                this.fullscreen = !!detail.fullScreen
                this.showControls()
                this.$emit('fullscreenchange', event)
            },
            onLoadedMetadata(event) {
                const detail = event && event.detail ? event.detail : {}
                if (detail.duration) this.videoDuration = detail.duration
                this.loading = false
                this.$emit('loadedmetadata', event)
            },
            // ---------- 控制层显示 ----------
            onPlayerTap() {
                if (this.locked) return
                if (this.panel) {
                    this.closePanel()
                    return
                }
                this.toggleControls()
            },
            onCoverTap() {
                this.play()
            },
            toggleControls() {
                this.controlsVisible = !this.controlsVisible
                this.$emit('controlstoggle', this.controlsVisible)
                if (this.controlsVisible) this.scheduleHide()
            },
            showControls() {
                this.controlsVisible = true
                this.scheduleHide()
            },
            scheduleHide() {
                this.clearHideTimer()
                const delay = Number(this.autoHide)
                if (!delay || delay <= 0) return
                this.hideTimer = setTimeout(() => {
                    // 面板打开或暂停时不收起，避免操作被打断
                    if (this.panel || !this.playing) return
                    this.controlsVisible = false
                    this.$emit('controlstoggle', false)
                }, delay)
            },
            clearHideTimer() {
                if (this.hideTimer) {
                    clearTimeout(this.hideTimer)
                    this.hideTimer = null
                }
            },
            togglePanel(name) {
                this.panel = this.panel === name ? '' : name
                if (this.panel) this.clearHideTimer()
                else this.scheduleHide()
            },
            closePanel() {
                this.panel = ''
                this.scheduleHide()
            },
            toggleLock() {
                this.locked = !this.locked
                if (this.locked) {
                    this.panel = ''
                    this.controlsVisible = false
                    toast(t('up.video.lock'))
                } else {
                    this.showControls()
                    toast(t('up.video.unlock'))
                }
                this.$emit('lock', this.locked)
            },
            onBack() {
                if (this.fullscreen) {
                    this.exitFullScreen()
                    return
                }
                this.$emit('back')
            },
            // ---------- 进度拖动 ----------
            onProgressStart() {
                this.dragging = true
                this.dragPercent = timeToProgress(this.currentTime, this.videoDuration)
                this.clearHideTimer()
            },
            onProgressChanging(percent) {
                this.dragPercent = percent
            },
            onProgressChange(percent) {
                this.dragging = false
                this.seek(progressToTime(percent, this.videoDuration))
                this.scheduleHide()
            },
            // ---------- 倍速 ----------
            applyRate() {
                const ctx = this.getContext()
                if (ctx && ctx.playbackRate) ctx.playbackRate(this.innerRate)
            },
            setRate(rate, silent = false) {
                const value = Number(rate)
                if (!Number.isFinite(value) || value <= 0) return
                this.innerRate = value
                this.applyRate()
                this.closePanel()
                if (!silent) {
                    this.$emit('update:rate', value)
                    this.$emit('ratechange', value)
                }
            },
            // ---------- 音量 ----------
            applyVolume() {
                const value = this.innerMuted ? 0 : clampNumber(this.innerVolume, 0, 1)
                // #ifdef H5
                if (typeof document !== 'undefined') {
                    const wrapper = document.getElementById(this.innerVideoId)
                    const media = wrapper ? wrapper.querySelector('video') : null
                    if (media) media.volume = value
                }
                // #endif
                // #ifdef APP-PLUS
                // App 端没有播放器级音量接口，只能调节系统音量
                if (typeof plus !== 'undefined' && plus.device && plus.device.setVolume) {
                    plus.device.setVolume(value)
                }
                // #endif
                return value
            },
            setVolume(value, silent = false) {
                this.innerVolume = clampNumber(value, 0, 1)
                if (this.innerVolume > 0) this.innerMuted = false
                this.applyVolume()
                if (!silent) {
                    this.$emit('update:volume', this.innerVolume)
                    this.$emit('volumechange', { volume: this.innerVolume, muted: this.innerMuted })
                }
            },
            onVolumeChanging(percent) {
                this.setVolume(percent / 100, true)
            },
            onVolumeChange(percent) {
                this.setVolume(percent / 100)
            },
            toggleMute() {
                this.innerMuted = !this.innerMuted
                this.applyVolume()
                this.$emit('volumechange', { volume: this.innerVolume, muted: this.innerMuted })
            },
            // ---------- 弹幕 ----------
            toggleDanmu() {
                this.innerDanmuOpen = !this.innerDanmuOpen
                this.$emit('update:danmuOpen', this.innerDanmuOpen)
                this.$emit('danmu-toggle', this.innerDanmuOpen)
            },
            sendDanmu(payload) {
                let danmu = null
                if (typeof payload === 'string') {
                    danmu = { text: payload }
                } else if (payload && payload.text) {
                    danmu = payload
                } else {
                    danmu = { text: this.danmuText }
                }
                if (!danmu.text) return null
                const item = {
                    text: danmu.text,
                    color: danmu.color || this.danmuColor,
                    time: this.currentTime,
                    type: danmu.type || 'scroll'
                }
                if (this.$refs.danmaku) {
                    if (!this.innerDanmuOpen) {
                        this.innerDanmuOpen = true
                        this.$emit('update:danmuOpen', true)
                    }
                    this.$refs.danmaku.push(item)
                }
                this.danmuText = ''
                this.closePanel()
                this.$emit('danmu', item)
                return item
            },
            // ---------- 选集 ----------
            switchEpisode(index, silent = false) {
                this.closePanel()
                const target = parseInt(index, 10)
                if (!Number.isFinite(target) || target < 0 || target >= this.episodeList.length) return
                if (target === this.innerEpisodeIndex && this.started) return
                this.innerEpisodeIndex = target
                this.resetPlayback()
                if (!silent) {
                    this.$emit('update:episodeIndex', target)
                    this.$emit('episode-change', { index: target, episode: this.episodeList[target] })
                }
                // 等 src 生效后再播，否则部分平台会播上一集
                this.$nextTick(() => this.play())
            },
            playNext() {
                this.switchEpisode(this.innerEpisodeIndex + 1)
            },
            episodeStyle(index) {
                const active = index === this.innerEpisodeIndex
                return {
                    backgroundColor: active ? this.activeColor : 'rgba(255, 255, 255, 0.16)'
                }
            },
            // ---------- 全屏 ----------
            requestFullScreen() {
                const ctx = this.getContext()
                if (!ctx || !ctx.requestFullScreen) return
                const direction = this.nativeDirection
                ctx.requestFullScreen(direction === undefined ? {} : { direction })
            },
            exitFullScreen() {
                const ctx = this.getContext()
                if (ctx && ctx.exitFullScreen) ctx.exitFullScreen()
            },
            toggleFullscreen() {
                if (this.fullscreen) {
                    this.exitFullScreen()
                } else {
                    this.requestFullScreen()
                }
            },
            // ---------- 广告 ----------
            playAdQueue(role) {
                const list = role === 'preroll' ? this.prerollAds : this.postrollAds
                const cursorKey = role === 'preroll' ? 'prerollCursor' : 'postrollCursor'
                if (this[cursorKey] >= list.length) return false
                const ad = list[this[cursorKey]]
                this[cursorKey] += 1
                this.adRole = role
                this.startAd(ad)
                return true
            },
            startAd(ad) {
                // 先落 currentAd，再暂停正片，避免异步的 pause 事件把暂停贴片顶出来
                this.currentAd = ad
                this.adElapsed = 0
                this.adDuration = Number(ad.duration) || 0
                this.panel = ''
                this.pause()
                this.closePauseAd()
                this.$emit('ad-start', ad)
                // 图片广告没有 timeupdate，用定时器走倒计时
                if (!ad.src) {
                    this.clearAdTimer()
                    this.adTimer = setInterval(() => {
                        this.adElapsed += 0.5
                        if (this.adDuration > 0 && this.adElapsed >= this.adDuration) this.finishAd()
                    }, 500)
                }
            },
            onAdTimeUpdate(event) {
                const detail = event && event.detail ? event.detail : {}
                if (detail.currentTime !== undefined) this.adElapsed = detail.currentTime
                if (!this.adDuration && detail.duration) this.adDuration = detail.duration
            },
            onAdEnded() {
                this.finishAd(false)
            },
            skipAd() {
                if (!this.adCanSkip) return
                this.$emit('ad-skip', this.currentAd)
                this.finishAd(true)
            },
            onAdClick() {
                // 只抛事件，跳转交给业务侧决定
                this.$emit('ad-click', this.currentAd || this.pauseAd)
            },
            finishAd(skipped = false) {
                const ad = this.currentAd
                const role = this.adRole
                this.clearAdTimer()
                this.currentAd = null
                this.adRole = ''
                this.adElapsed = 0
                this.adDuration = 0
                if (ad) this.$emit('ad-end', { ad, skipped })
                this.$nextTick(() => {
                    if (role === 'preroll') {
                        if (!this.playAdQueue('preroll')) this.playMain()
                        return
                    }
                    if (role === 'postroll' && !this.playAdQueue('postroll')) {
                        // 后置广告播完回到封面
                        this.started = false
                        this.currentTime = 0
                    }
                })
            },
            clearAdTimer() {
                if (this.adTimer) {
                    clearInterval(this.adTimer)
                    this.adTimer = null
                }
            },
            closePauseAd() {
                this.pauseAdVisible = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .up-video {
        position: relative;
        overflow: hidden;
        background-color: #000000;
    }

    .up-video__player {
        width: 100%;
        height: 100%;
    }

    /* 控制层统一铺满 video 节点 */
    .up-video__layer {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .up-video__center {
        align-items: center;
        justify-content: center;
    }

    .up-video__mask {
        background-color: rgba(0, 0, 0, 0.5);
    }

    .up-video__hint {
        color: #ffffff;
        font-size: 14px;
    }

    .up-video__retry {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        padding: 4px 14px;
        border-radius: 30px;
        border-width: 1px;
        border-style: solid;
        border-color: rgba(255, 255, 255, 0.7);
    }

    .up-video__retry-text {
        color: #ffffff;
        font-size: 12px;
    }

    .up-video__cover {
        align-items: center;
        justify-content: center;
        background-color: #000000;
    }

    .up-video__cover-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .up-video__cover-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.25);
    }

    .up-video__cover-btn {
        width: 52px;
        height: 52px;
        border-radius: 26px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.45);
    }

    .up-video__top {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 40px;
        flex-direction: row;
        align-items: center;
        padding-left: 6px;
        padding-right: 6px;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .up-video__top-title {
        flex: 1;
        margin-left: 6px;
        color: #ffffff;
        font-size: 14px;
        lines: 1;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .up-video__icon-btn {
        width: 30px;
        height: 30px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .up-video__text-btn {
        height: 30px;
        padding-left: 5px;
        padding-right: 5px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .up-video__btn-text {
        color: #ffffff;
        font-size: 12px;
    }

    .up-video__controls {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding-left: 4px;
        padding-right: 4px;
        background-color: rgba(0, 0, 0, 0.35);
    }

    .up-video__row {
        flex-direction: row;
        align-items: center;
    }

    .up-video__time {
        width: 44px;
        color: #ffffff;
        font-size: 11px;
        text-align: center;
    }

    .up-video__unlock {
        position: absolute;
        left: 12px;
        top: 50%;
        margin-top: -16px;
        width: 32px;
        height: 32px;
        border-radius: 16px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
    }

    /* 全屏图标用 4 个角括号拼出来，图标字体里没有对应字形 */
    .up-video__fullscreen {
        position: relative;
        width: 15px;
        height: 15px;
    }

    .up-video__corner-tl,
    .up-video__corner-tr,
    .up-video__corner-bl,
    .up-video__corner-br,
    .up-video__corner-tl-in,
    .up-video__corner-tr-in,
    .up-video__corner-bl-in,
    .up-video__corner-br-in {
        position: absolute;
        width: 6px;
        height: 6px;
        border-style: solid;
        border-color: #ffffff;
        border-top-width: 0;
        border-right-width: 0;
        border-bottom-width: 0;
        border-left-width: 0;
    }

    .up-video__corner-tl {
        top: 0;
        left: 0;
        border-top-width: 2px;
        border-left-width: 2px;
    }

    .up-video__corner-tr {
        top: 0;
        right: 0;
        border-top-width: 2px;
        border-right-width: 2px;
    }

    .up-video__corner-bl {
        bottom: 0;
        left: 0;
        border-bottom-width: 2px;
        border-left-width: 2px;
    }

    .up-video__corner-br {
        bottom: 0;
        right: 0;
        border-bottom-width: 2px;
        border-right-width: 2px;
    }

    /* 退出全屏时角括号朝内 */
    .up-video__corner-tl-in {
        top: 0;
        left: 0;
        border-bottom-width: 2px;
        border-right-width: 2px;
    }

    .up-video__corner-tr-in {
        top: 0;
        right: 0;
        border-bottom-width: 2px;
        border-left-width: 2px;
    }

    .up-video__corner-bl-in {
        bottom: 0;
        left: 0;
        border-top-width: 2px;
        border-right-width: 2px;
    }

    .up-video__corner-br-in {
        bottom: 0;
        right: 0;
        border-top-width: 2px;
        border-left-width: 2px;
    }

    .up-video__panel {
        flex-direction: row;
        justify-content: flex-end;
        background-color: rgba(0, 0, 0, 0.4);
    }

    .up-video__panel-body {
        width: 104px;
        height: 100%;
        padding: 10px;
        background-color: rgba(0, 0, 0, 0.85);
    }

    .up-video__panel-body--wide {
        width: 240px;
    }

    .up-video__panel-title {
        color: rgba(255, 255, 255, 0.6);
        font-size: 12px;
        margin-bottom: 6px;
    }

    .up-video__panel-item {
        height: 32px;
        justify-content: center;
    }

    .up-video__panel-text {
        font-size: 13px;
    }

    .up-video__episode-grid {
        flex-direction: row;
        flex-wrap: wrap;
    }

    .up-video__episode {
        height: 32px;
        margin: 3px;
        border-radius: 4px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .up-video__episode-text {
        color: #ffffff;
        font-size: 12px;
    }

    .up-video__volume {
        position: absolute;
        right: 44px;
        bottom: 44px;
        width: 200px;
        flex-direction: row;
        align-items: center;
        padding-left: 4px;
        padding-right: 10px;
        border-radius: 30px;
        background-color: rgba(0, 0, 0, 0.85);
    }

    .up-video__volume-label {
        color: rgba(255, 255, 255, 0.7);
        font-size: 11px;
        margin-right: 6px;
    }

    .up-video__volume-value {
        width: 28px;
        margin-left: 6px;
        color: #ffffff;
        font-size: 11px;
        text-align: right;
    }

    .up-video__ad {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #000000;
    }

    .up-video__ad-media {
        width: 100%;
        height: 100%;
    }

    .up-video__ad-bar {
        position: absolute;
        top: 8px;
        right: 8px;
        flex-direction: row;
        align-items: center;
    }

    .up-video__ad-tag {
        color: #ffffff;
        font-size: 11px;
        padding: 2px 6px;
        border-radius: 3px;
        background-color: rgba(0, 0, 0, 0.55);
    }

    .up-video__ad-btn {
        margin-left: 6px;
        padding: 2px 8px;
        border-radius: 3px;
        flex-direction: row;
        align-items: center;
        border-width: 1px;
        border-style: solid;
        border-color: rgba(255, 255, 255, 0.6);
        background-color: rgba(0, 0, 0, 0.55);
    }

    .up-video__ad-btn-text {
        color: #ffffff;
        font-size: 11px;
    }

    .up-video__pause-ad {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.6);
    }

    .up-video__pause-ad-media {
        width: 70%;
        height: 60%;
    }

    .up-video__pause-ad-close {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        border-radius: 12px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.6);
    }

    .up-video__danmu-input {
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: 8px;
        flex-direction: row;
        align-items: center;
        padding: 4px 4px 4px 12px;
        border-radius: 30px;
        background-color: rgba(0, 0, 0, 0.85);
    }

    .up-video__danmu-field {
        flex: 1;
        height: 30px;
        color: #ffffff;
        font-size: 13px;
    }

    .up-video__danmu-send {
        height: 28px;
        padding-left: 14px;
        padding-right: 14px;
        border-radius: 20px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .up-video__danmu-send-text {
        color: #ffffff;
        font-size: 12px;
    }
</style>
