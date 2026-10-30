<template>
    <view class="up-audio">
        <!-- 播放/暂停按钮 -->
        <view
            class="up-audio__btn"
            :style="{ backgroundColor: activeColor }"
            @tap.stop="toggle"
        >
            <text class="up-audio__btn-icon">{{ playing ? '❚❚' : '▶' }}</text>
        </view>
        <!-- 主体：标题 + 时间 + 进度条 -->
        <view class="up-audio__main">
            <view class="up-audio__row">
                <text
                    v-if="showTitle && displayTitle"
                    class="up-audio__title"
                >{{ displayTitle }}</text>
                <text class="up-audio__time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</text>
            </view>
            <slider
                class="up-audio__slider"
                :value="progress"
                :max="100"
                :block-size="10"
                :activeColor="activeColor"
                backgroundColor="#e4e7ed"
                @changing="onChanging"
                @change="onChange"
            />
        </view>
        <!-- 倍速 -->
        <view
            v-if="showRate"
            class="up-audio__rate"
            @tap.stop="changeRate"
        >
            <text class="up-audio__rate-text">{{ rate }}x</text>
        </view>
    </view>
</template>

<script>
/**
 * audio 音频播放器
 * @description Vue3 已废弃 <audio> 组件，本组件基于 uni.createInnerAudioContext 实现播放
 * @tutorial https://uniapp.dcloud.net.cn/api/media/audio-context.html
 * @property {String|Array} src 音频地址，支持数组多源
 * @property {String} title 标题
 * @property {Boolean} loop 是否循环
 * @property {Boolean} showRate 是否显示倍速
 * @property {Array} rateList 倍速档位
 * @property {String} activeColor 主题色
 * @property {Boolean} showTitle 是否显示标题
 * @event {Function} play 开始播放时触发
 * @event {Function} error 加载/播放出错时触发
 */
import props from './props.js'
import mpMixin from '../../libs/mixin/mpMixin.js'
import mixin from '../../libs/mixin/mixin.js'

// 全局实例池：播放某个音频时暂停其它音频
const instancePool = []

export default {
    name: 'up-audio',
    mixins: [mpMixin, mixin, props],
    // #ifdef VUE3
    emits: ['play', 'error'],
    // #endif
    data() {
        return {
            playing: false,
            currentTime: 0,
            duration: 0,
            progress: 0,
            srcIndex: 0,
            rate: 1,
            seeking: false,
            errorMsg: ''
        }
    },
    computed: {
        srcList() {
            if (Array.isArray(this.src)) return this.src.filter(Boolean)
            return this.src ? [this.src] : []
        },
        displayTitle() {
            return this.title || ''
        },
        currentSrc() {
            return this.srcList[this.srcIndex] || ''
        }
    },
    watch: {
        src: {
            handler() {
                this.reset()
            },
            deep: true
        }
    },
    mounted() {
        this.init()
    },
    beforeUnmount() {
        this.destroy()
    },
    methods: {
        // 源变化时重建
        reset() {
            this.destroy()
            this.srcIndex = 0
            this.currentTime = 0
            this.duration = 0
            this.progress = 0
            this.playing = false
            this.init()
        },
        init() {
            if (!this.currentSrc) return
            const ctx = uni.createInnerAudioContext()
            this.ctx = ctx
            ctx.src = this.currentSrc
            if (this.loop) ctx.loop = true
            ctx.onPlay(() => {
                this.playing = true
                // 暂停实例池中的其它音频
                for (let i = instancePool.length; i--;) {
                    if (instancePool[i] !== ctx) {
                        try { instancePool[i].pause() } catch (e) {}
                    }
                }
                this.$emit('play', {
                    source: 'audio',
                    src: this.currentSrc
                })
            })
            ctx.onPause(() => { this.playing = false })
            ctx.onStop(() => { this.playing = false })
            ctx.onEnded(() => {
                this.playing = false
                this.currentTime = 0
                this.progress = 0
            })
            ctx.onTimeUpdate(() => {
                if (this.seeking) return
                this.currentTime = ctx.currentTime || 0
                if (ctx.duration) this.duration = ctx.duration
                this.progress = this.duration ? (this.currentTime / this.duration) * 100 : 0
            })
            ctx.onCanplay(() => {
                if (ctx.duration) this.duration = ctx.duration
            })
            ctx.onError(err => this.handleError(err))
            instancePool.push(ctx)
        },
        destroy() {
            if (this.ctx) {
                const idx = instancePool.indexOf(this.ctx)
                if (idx > -1) instancePool.splice(idx, 1)
                try { this.ctx.destroy() } catch (e) {}
                this.ctx = null
            }
        },
        toggle() {
            if (!this.ctx) return
            if (this.playing) {
                this.ctx.pause()
            } else {
                this.ctx.play()
            }
        },
        // 拖动进度条中（只更新本地显示）
        onChanging(e) {
            this.seeking = true
            this.progress = e.detail.value
            this.currentTime = this.duration ? (this.duration * e.detail.value) / 100 : 0
        },
        // 拖动结束，真正 seek
        onChange(e) {
            this.seeking = false
            this.progress = e.detail.value
            if (this.ctx && this.duration) {
                try { this.ctx.seek((this.duration * e.detail.value) / 100) } catch (err) {}
            }
        },
        changeRate() {
            const list = (this.rateList && this.rateList.length) ? this.rateList : [0.5, 0.75, 1, 1.25, 1.5, 2]
            let i = list.indexOf(this.rate)
            if (i === -1) i = list.indexOf(1)
            this.rate = list[(i + 1) % list.length]
            if (this.ctx) {
                try { this.ctx.playbackRate = this.rate } catch (e) {}
            }
        },
        // 加载失败：尝试下一个源；全部失败则抛 error
        handleError(err) {
            if (this.srcIndex < this.srcList.length - 1) {
                this.srcIndex += 1
                this.currentTime = 0
                this.progress = 0
                if (this.ctx) {
                    this.ctx.src = this.currentSrc
                    try { this.ctx.play() } catch (e) {}
                }
                return
            }
            this.playing = false
            this.errorMsg = (err && err.errMsg) || '音频加载失败'
            this.$emit('error', {
                source: 'audio',
                errMsg: this.errorMsg
            })
        },
        formatTime(sec) {
            sec = Math.floor(sec || 0)
            const m = Math.floor(sec / 60)
            const s = sec % 60
            return m + ':' + (s < 10 ? '0' + s : s)
        }
    }
}
</script>

<style lang="scss">
.up-audio {
    display: flex;
    align-items: center;
    padding: 12rpx 16rpx;
    margin: 8rpx 0;
    border-radius: 8rpx;
    background-color: #f5f7fa;

    &__btn {
        flex-shrink: 0;
        width: 56rpx;
        height: 56rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16rpx;
    }

    &__btn-icon {
        color: #ffffff;
        font-size: 22rpx;
        line-height: 1;
    }

    &__main {
        flex: 1;
        min-width: 0;
    }

    &__row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rpx;
    }

    &__title {
        flex: 1;
        font-size: 26rpx;
        color: #303133;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__time {
        flex-shrink: 0;
        font-size: 22rpx;
        color: #909399;
        margin-left: 12rpx;
    }

    &__slider {
        margin: 0;
        padding: 0;
    }

    &__rate {
        flex-shrink: 0;
        margin-left: 16rpx;
        padding: 4rpx 12rpx;
        border-radius: 20rpx;
        border: 1px solid #dcdfe6;
    }

    &__rate-text {
        font-size: 22rpx;
        color: #606266;
    }
}
</style>
