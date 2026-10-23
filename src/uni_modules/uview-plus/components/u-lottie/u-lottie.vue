<template>
    <view class="u-lottie">
        <!-- #ifdef H5 || APP-PLUS -->
        <!-- #ifndef APP-NVUE -->
        <view
            ref="webContainer"
            class="u-lottie__web"
            :style="webContentStyle"
        ></view>
        <!-- #endif -->
        <!-- #endif -->
    </view>
</template>

<script>
import { props } from './props'
import { mpMixin } from '../../libs/mixin/mpMixin'
import { mixin } from '../../libs/mixin/mixin'

// #ifdef H5 || APP-PLUS
// #ifndef APP-NVUE
import lottieWeb from './libs/lottie_svg.min.js'
// #endif
// #endif

/**
 * lottie 动画
 * @description 加载 AE 导出的 Lottie JSON 并播放；H5/App-Vue 使用 SVG，微信小程序/鸿蒙使用 canvas。
 * @property {String} filePath 动画 JSON 路径，支持 http(s)；H5 / App-Vue 额外支持本地静态路径
 * @property {Object} animationData 直接传入 Lottie JSON 对象，优先级高于 filePath
 * @property {String} contentModel 填充模式：ScaleToFill / AspectFill / Center
 * @property {Boolean} loop 是否循环播放
 * @property {Boolean} autoplay 就绪后是否自动播放
 * @event {Function} statechange 状态变化，detail.type 为 ready/play/pause/resume/stop/complete/error
 * @example <up-lottie :animation-data="data" content-model="AspectFill" @statechange="onState" />
 */
export default {
    name: 'u-lottie',
    mixins: [mpMixin, mixin, props],
    emits: ['statechange'],
    data() {
        return {
            webCenterSize: null,
            canvasVisible: false,
            canvasWidth: 300,
            canvasHeight: 300,
            canvasId: `u-lottie-canvas-${Date.now()}${Math.floor(Math.random() * 1000)}`
        }
    },
    computed: {
        rendererKind() {
            // #ifdef APP-NVUE
            return 'unsupported'
            // #endif
            // #ifdef MP-WEIXIN || APP-HARMONY
            return 'canvas'
            // #endif
            // #ifdef MP
            return 'unsupported'
            // #endif
            // #ifdef H5 || APP-PLUS
            return 'web'
            // #endif
            return 'unsupported'
        },
        preserveAspectRatio() {
            if (this.contentModel === 'ScaleToFill') return 'none'
            if (this.contentModel === 'Center') return 'xMidYMid meet'
            return 'xMidYMid slice'
        },
        webContentStyle() {
            if (this.contentModel !== 'Center') {
                return { width: '100%', height: '100%', flex: '0 0 auto' }
            }
            if (this.webCenterSize) {
                return {
                    width: `${this.webCenterSize.width}px`,
                    height: `${this.webCenterSize.height}px`,
                    flex: '0 0 auto'
                }
            }
            return { width: '100%', height: '100%', flex: '0 0 auto' }
        }
    },
    watch: {
        filePath() {
            this.reload()
        },
        animationData() {
            this.reload()
        },
        contentModel() {
            this.reload()
        },
        loop(value) {
            if (this._animation) {
                this._animation.loop = value
            }
        }
    },
    created() {
        this._animation = null
        this._requestTask = null
        this._loadToken = 0
        this._pendingPlay = false
        this._ready = false
        this._completed = false
        this._engineState = 'idle'
        this._failedToken = -1
    },
    mounted() {
        this.reload()
    },
    beforeUnmount() {
        this._loadToken += 1
        if (this._requestTask && typeof this._requestTask.abort === 'function') {
            this._requestTask.abort()
        }
        this._requestTask = null
        this.destroyEngine()
    },
    methods: {
        async reload() {
            const token = this._loadToken + 1
            this._loadToken = token
            if (this._requestTask && typeof this._requestTask.abort === 'function') {
                this._requestTask.abort()
            }
            this._requestTask = null
            this.destroyEngine()
            this.canvasVisible = false
            this.webCenterSize = null
            this._ready = false
            this._completed = false
            this._pendingPlay = false
            this._failedToken = -1
            this._engineState = 'idle'

            const kind = this.rendererKind
            if (kind === 'unsupported') {
                this.fail('当前平台不支持 u-lottie', token)
                return
            }

            try {
                const source = await this.resolveSource()
                if (token !== this._loadToken) return
                if (kind === 'web') {
                    await this.initWeb(source, token)
                    return
                }
                this.fail('当前平台暂未接入画布渲染', token)
            } catch (error) {
                if (token !== this._loadToken) return
                this.fail(this.normalizeError(error), token)
            }
        },
        async resolveSource() {
            if (this.animationData && typeof this.animationData === 'object') {
                return { data: this.animationData }
            }
            const path = typeof this.filePath === 'string' ? this.filePath.trim() : ''
            if (!path) {
                throw new Error('u-lottie: filePath 与 animationData 不能同时为空')
            }
            if (/^https?:\/\//i.test(path)) {
                return { data: await this.requestJson(path) }
            }

            // #ifdef APP-HARMONY
            try {
                return { data: await this.requestJson(path) }
            } catch (error) {
                throw new Error('u-lottie: 鸿蒙暂不支持读取本地 JSON，请改用 animationData')
            }
            // #endif

            // #ifdef H5 || APP-PLUS
            // #ifndef APP-NVUE
            return { path }
            // #endif
            // #endif

            // #ifdef MP-WEIXIN
            throw new Error('u-lottie: 微信小程序无法读取本地 JSON，请改用 animationData')
            // #endif

            throw new Error('u-lottie: 当前平台不支持该数据源')
        },
        requestJson(url) {
            return new Promise((resolve, reject) => {
                const task = uni.request({
                    url,
                    method: 'GET',
                    dataType: 'json',
                    responseType: 'text',
                    success: (response) => {
                        if (this._requestTask === task) this._requestTask = null
                        if (response.statusCode < 200 || response.statusCode >= 300) {
                            reject(new Error(`u-lottie: 请求失败 (${response.statusCode})`))
                            return
                        }
                        let data = response.data
                        if (typeof data === 'string') {
                            try {
                                data = JSON.parse(data)
                            } catch (error) {
                                reject(new Error('u-lottie: JSON 解析失败'))
                                return
                            }
                        }
                        if (!data || typeof data !== 'object') {
                            reject(new Error('u-lottie: 返回内容不是有效的 Lottie JSON'))
                            return
                        }
                        resolve(data)
                    },
                    fail: (error) => {
                        if (this._requestTask === task) this._requestTask = null
                        const suffix = error && error.errMsg ? ` - ${error.errMsg}` : ''
                        reject(new Error(`u-lottie: 请求失败${suffix}`))
                    }
                })
                this._requestTask = task
            })
        },
        async initWeb(source, token) {
            // #ifdef H5 || APP-PLUS
            // #ifndef APP-NVUE
            if (!lottieWeb || typeof lottieWeb.loadAnimation !== 'function') {
                this.fail('lottie-web 引擎未加载', token)
                return
            }
            if (source.data && this.contentModel === 'Center') {
                this.applyWebCenterSize(source.data)
            }
            await this.$nextTick()
            if (token !== this._loadToken) return
            const containerRef = this.$refs.webContainer
            const container = containerRef && (containerRef.$el || containerRef)
            if (!container) {
                this.fail('动画容器不存在', token)
                return
            }
            const options = {
                container,
                renderer: 'svg',
                loop: this.loop,
                autoplay: false,
                rendererSettings: {
                    preserveAspectRatio: this.preserveAspectRatio
                }
            }
            if (source.data) {
                options.animationData = source.data
            } else {
                options.path = source.path
            }
            let animation
            try {
                animation = lottieWeb.loadAnimation(options)
            } catch (error) {
                this.fail(this.normalizeError(error), token)
                return
            }
            if (token !== this._loadToken) {
                animation.destroy()
                return
            }
            this._animation = animation
            this.bindEngineEvents(animation, token)
            // #endif
            // #endif
        },
        applyWebCenterSize(data) {
            const width = Number(data && data.w)
            const height = Number(data && data.h)
            if (width > 0 && height > 0) {
                this.webCenterSize = { width, height }
            }
        },
        bindEngineEvents(animation, token) {
            const isCurrent = () => token === this._loadToken
            animation.addEventListener('DOMLoaded', () => {
                if (!isCurrent()) return
                if (
                    this.rendererKind === 'web' &&
                    this.contentModel === 'Center' &&
                    !this.webCenterSize
                ) {
                    this.applyWebCenterSize(animation.animationData)
                    if (this.webCenterSize) {
                        this.$nextTick(() => {
                            if (isCurrent() && this._animation) {
                                this._animation.resize()
                            }
                        })
                    }
                }
                this._ready = true
                this.emitState('ready')
                if (this.autoplay || this._pendingPlay) {
                    this._pendingPlay = false
                    this.startPlayback()
                }
            })
            animation.addEventListener('complete', () => {
                if (!isCurrent() || this.loop) return
                this._completed = true
                this._engineState = 'completed'
                this.emitState('complete')
            })
            const onFailure = () => {
                if (!isCurrent()) return
                this.fail('动画加载失败', token)
            }
            animation.addEventListener('data_failed', onFailure)
            animation.addEventListener('error', onFailure)
        },
        startPlayback() {
            const animation = this._animation
            if (!animation) {
                this._pendingPlay = true
                return
            }
            if (this._engineState === 'playing') return
            if (this._completed || this._engineState === 'stopped') {
                animation.goToAndStop(0, true)
                this._completed = false
            }
            animation.play()
            this._engineState = 'playing'
            this.emitState('play')
        },
        playAnimation() {
            if (!this._animation || !this._ready) {
                this._pendingPlay = true
                return
            }
            this.startPlayback()
        },
        pauseAnimation() {
            if (!this._animation || this._engineState !== 'playing') return
            this._animation.pause()
            this._engineState = 'paused'
            this.emitState('pause')
        },
        resumeAnimation() {
            if (!this._animation || this._engineState !== 'paused') return
            this._animation.play()
            this._engineState = 'playing'
            this.emitState('resume')
        },
        cancelAnimation() {
            this._pendingPlay = false
            if (!this._animation) return
            this._animation.stop()
            this._completed = false
            this._engineState = 'stopped'
            this.emitState('stop')
        },
        emitState(type, message = '') {
            const detail = { type }
            if (type === 'error') {
                detail.message = message
            }
            this.$emit('statechange', detail)
        },
        fail(message, token) {
            if (typeof token === 'number' && token !== this._loadToken) return
            if (this._failedToken === this._loadToken) return
            this._failedToken = this._loadToken
            this._engineState = 'error'
            this.emitState('error', message || '动画初始化失败')
        },
        normalizeError(error) {
            if (!error) return '动画初始化失败'
            if (typeof error === 'string') return error
            return error.message || error.errMsg || '动画初始化失败'
        },
        destroyEngine() {
            if (this._animation) {
                try {
                    this._animation.destroy()
                } catch (error) {
                    // 引擎可能尚未完成初始化，销毁失败不影响后续重载
                }
                this._animation = null
            }
            this._ready = false
            this._engineState = 'idle'
        }
    }
}
</script>

<style lang="scss" scoped>
.u-lottie {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.u-lottie__web {
    flex: 0 0 auto;
}
</style>
