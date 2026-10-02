<template>
    <view
        class="up-video-slider"
        :class="[disabled ? 'up-video-slider--disabled' : '']"
        @touchstart.stop.prevent="onTouchStart"
        @touchmove.stop.prevent="onTouchMove"
        @touchend.stop="onTouchEnd"
        @touchcancel.stop="onTouchEnd"
        @click.stop="onTrackClick"
    >
        <view class="up-video-slider__track" :style="{ height: barHeight }">
            <view
                v-if="buffered > 0"
                class="up-video-slider__buffered"
                :style="{ width: buffered + '%' }"
            ></view>
            <view
                class="up-video-slider__active"
                :style="{ width: innerPercent + '%', backgroundColor: activeColor }"
            ></view>
            <view
                class="up-video-slider__block"
                :style="{
                    left: innerPercent + '%',
                    width: blockSize,
                    height: blockSize,
                    marginLeft: '-' + halfBlock,
                    marginTop: '-' + halfBlock,
                    backgroundColor: activeColor
                }"
            ></view>
        </view>
    </view>
</template>

<script>
    import { upGetRect } from '../../libs/function/index'
    import { clampNumber } from './video-utils'

    /**
     * u-video 内部使用的拖动条，进度与音量共用。
     * 独立成组件是为了让触摸计算只写一遍，文件名不以 u- 开头以免被 easycom 收录。
     */
    export default {
        name: 'video-slider',
        props: {
            percent: {
                type: [String, Number],
                default: 0
            },
            // 已缓冲百分比，仅进度条使用
            buffered: {
                type: [String, Number],
                default: 0
            },
            activeColor: {
                type: String,
                default: '#2979ff'
            },
            barHeight: {
                type: String,
                default: '2px'
            },
            blockSize: {
                type: String,
                default: '10px'
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        emits: ['start', 'changing', 'change'],
        data() {
            return {
                dragging: false,
                innerPercent: 0,
                rect: null,
                touchedAt: 0
            }
        },
        computed: {
            halfBlock() {
                const size = parseFloat(this.blockSize)
                const unit = String(this.blockSize).replace(/[\d.]/g, '') || 'px'
                return `${size / 2}${unit}`
            }
        },
        watch: {
            percent(value) {
                // 拖动过程中不接受外部回写，否则手指会被播放进度拽走
                if (!this.dragging) this.innerPercent = clampNumber(value, 0, 100)
            }
        },
        mounted() {
            this.innerPercent = clampNumber(this.percent, 0, 100)
        },
        methods: {
            async ensureRect() {
                const rect = await upGetRect('.up-video-slider__track', false, this)
                if (rect && rect.width) this.rect = rect
                return this.rect
            },
            percentFromPageX(pageX) {
                if (!this.rect || !this.rect.width) return this.innerPercent
                return clampNumber(((pageX - this.rect.left) / this.rect.width) * 100, 0, 100)
            },
            async onTouchStart(event) {
                if (this.disabled) return
                this.dragging = true
                await this.ensureRect()
                this.$emit('start')
                this.onTouchMove(event)
            },
            onTouchMove(event) {
                if (this.disabled || !this.dragging) return
                const touch = event.touches && event.touches[0] ? event.touches[0] : event.changedTouches && event.changedTouches[0]
                if (!touch) return
                this.innerPercent = this.percentFromPageX(touch.pageX)
                this.$emit('changing', this.innerPercent)
            },
            onTouchEnd() {
                if (this.disabled || !this.dragging) return
                this.dragging = false
                this.touchedAt = Date.now()
                this.$emit('change', this.innerPercent)
            },
            async onTrackClick(event) {
                // 触摸设备上 touchend 后浏览器还会补一个 click，这里只服务鼠标点击
                if (this.disabled || this.dragging) return
                if (this.touchedAt && Date.now() - this.touchedAt < 400) return
                const pageX = event.detail && event.detail.x !== undefined ? event.detail.x : event.pageX
                if (pageX === undefined) return
                await this.ensureRect()
                this.innerPercent = this.percentFromPageX(pageX)
                this.$emit('change', this.innerPercent)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .up-video-slider {
        flex: 1;
        padding-top: 8px;
        padding-bottom: 8px;
        justify-content: center;
    }

    .up-video-slider--disabled {
        opacity: 0.5;
    }

    .up-video-slider__track {
        position: relative;
        width: 100%;
        border-radius: 4px;
        background-color: rgba(255, 255, 255, 0.3);
    }

    .up-video-slider__buffered,
    .up-video-slider__active {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        border-radius: 4px;
    }

    .up-video-slider__buffered {
        background-color: rgba(255, 255, 255, 0.45);
    }

    .up-video-slider__block {
        position: absolute;
        top: 50%;
        border-radius: 50%;
    }
</style>
