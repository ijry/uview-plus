<template>
    <view class="up-video-danmaku" :style="{ opacity: opacity }">
        <view
            v-for="item in items"
            :key="item.id"
            class="up-video-danmaku__item"
            :style="itemStyle(item)"
        >
            <text class="up-video-danmaku__text" :style="{ color: item.color, fontSize: fontSizePx }">{{ item.text }}</text>
        </view>
    </view>
</template>

<script>
    import { upGetRect } from '../../libs/function/index'
    import {
        acquireDanmuTrack,
        createDanmuState,
        estimateDanmuWidth,
        findDanmuCursor,
        normalizeDanmuItem,
        normalizeDanmuList,
        resetDanmuState
    } from './danmaku'

    // 顶部/底部固定弹幕的停留毫秒数
    const STATIC_HOLD = 4000

    /**
     * u-video 的弹幕层。父组件在 timeupdate 里调用 sync(currentTime) 投放弹幕，
     * 发送弹幕走 push()。文件名不以 u- 开头，避免被 easycom 当成公开组件。
     */
    export default {
        name: 'video-danmaku',
        props: {
            list: {
                type: Array,
                default: () => []
            },
            open: {
                type: Boolean,
                default: true
            },
            color: {
                type: String,
                default: '#ffffff'
            },
            fontSize: {
                type: [String, Number],
                default: 14
            },
            duration: {
                type: [String, Number],
                default: 8
            },
            // full 全屏 / half 上半屏 / top 顶部三行
            area: {
                type: String,
                default: 'full'
            },
            opacity: {
                type: [String, Number],
                default: 1
            },
            max: {
                type: [String, Number],
                default: 30
            }
        },
        data() {
            return {
                items: [],
                containerWidth: 0,
                containerHeight: 0,
                cursor: 0,
                lastTime: 0,
                seq: 0,
                timers: []
            }
        },
        computed: {
            fontSizePx() {
                return `${Number(this.fontSize) || 14}px`
            },
            trackHeight() {
                return Math.round((Number(this.fontSize) || 14) * 1.6)
            },
            sortedList() {
                return normalizeDanmuList(this.list)
            }
        },
        watch: {
            list() {
                // 换集/换弹幕源后重新对齐游标
                this.reset(this.lastTime)
            },
            open(value) {
                if (!value) this.clear()
            }
        },
        created() {
            this.state = createDanmuState()
        },
        mounted() {
            this.measure()
        },
        beforeUnmount() {
            this.clear()
        },
        // #ifdef VUE2
        beforeDestroy() {
            this.clear()
        },
        // #endif
        methods: {
            async measure() {
                const rect = await upGetRect('.up-video-danmaku', false, this)
                if (rect && rect.width) {
                    this.containerWidth = rect.width
                    this.containerHeight = rect.height
                }
                return rect
            },
            trackCount() {
                const height = this.containerHeight || 0
                let usable = height
                if (this.area === 'half') usable = height / 2
                if (this.area === 'top') usable = this.trackHeight * 3
                return Math.max(1, Math.floor(usable / this.trackHeight) || 1)
            },
            // 拖动进度条、切集后调用，清空在屏弹幕并把游标移到新时间点
            reset(time = 0) {
                this.clear()
                this.lastTime = Number(time) || 0
                this.cursor = findDanmuCursor(this.sortedList, this.lastTime)
            },
            clear() {
                this.timers.forEach((timer) => clearTimeout(timer))
                this.timers = []
                this.items = []
                resetDanmuState(this.state)
            },
            // 播放进度推进时投放到点的弹幕，跳转超过 2 秒视为 seek
            sync(currentTime) {
                const time = Number(currentTime) || 0
                if (!this.open) {
                    this.lastTime = time
                    return
                }
                if (time < this.lastTime || time - this.lastTime > 2) {
                    this.reset(time)
                }
                this.lastTime = time
                const list = this.sortedList
                // 宽度还没量到（首帧或隐藏中）时先不投放，避免弹幕从左边冒出来
                if (!this.containerWidth) {
                    this.measure()
                    return
                }
                while (this.cursor < list.length && list[this.cursor].time <= time) {
                    this.spawn(list[this.cursor])
                    this.cursor += 1
                }
            },
            // 主动发送一条弹幕（输入框、外部调用）
            push(danmu) {
                const item = normalizeDanmuItem(danmu)
                if (!item.text) return null
                item.time = this.lastTime
                this.spawn(item)
                return item
            },
            spawn(danmu) {
                if (!this.open || !danmu || !danmu.text) return
                if (this.items.length >= Number(this.max)) return
                if (!this.containerWidth) this.measure()
                const width = estimateDanmuWidth(danmu.text, this.fontSize)
                const isStatic = danmu.type === 'top' || danmu.type === 'bottom'
                const track = acquireDanmuTrack(this.state, {
                    now: Date.now(),
                    itemWidth: width,
                    containerWidth: this.containerWidth,
                    duration: Number(this.duration) || 8,
                    trackCount: this.trackCount(),
                    hold: isStatic ? STATIC_HOLD : 0
                })
                if (track < 0) return
                this.mount(danmu, track, width, isStatic)
            },
            mount(danmu, track, width, isStatic) {
                this.seq += 1
                const life = isStatic ? STATIC_HOLD : (Number(this.duration) || 8) * 1000
                const item = {
                    id: this.seq,
                    text: danmu.text,
                    color: danmu.color || this.color,
                    width,
                    type: danmu.type,
                    offset: track * this.trackHeight,
                    x: isStatic ? Math.max(0, (this.containerWidth - width) / 2) : this.containerWidth,
                    moving: false,
                    life
                }
                this.items.push(item)
                if (!isStatic) {
                    // 必须等节点带着初始 transform 上屏，再改终点值，transition 才会跑起来
                    this.$nextTick(() => {
                        this.timers.push(setTimeout(() => {
                            const target = this.items.find((current) => current.id === item.id)
                            if (target) {
                                target.x = -width
                                target.moving = true
                            }
                        }, 20))
                    })
                }
                this.timers.push(setTimeout(() => this.remove(item.id), life + 200))
            },
            remove(id) {
                const index = this.items.findIndex((item) => item.id === id)
                if (index > -1) this.items.splice(index, 1)
            },
            itemStyle(item) {
                const style = {
                    transform: `translateX(${item.x}px)`
                }
                if (item.type === 'bottom') {
                    style.bottom = `${item.offset}px`
                } else {
                    style.top = `${item.offset}px`
                }
                if (item.moving) {
                    style.transitionProperty = 'transform'
                    style.transitionDuration = `${item.life}ms`
                    style.transitionTimingFunction = 'linear'
                }
                return style
            }
        }
    }
</script>

<style lang="scss" scoped>
    .up-video-danmaku {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        /* #ifndef APP-NVUE */
        pointer-events: none;
        /* #endif */
    }

    .up-video-danmaku__item {
        position: absolute;
        left: 0;
        flex-direction: row;
        /* #ifndef APP-NVUE */
        white-space: nowrap;
        will-change: transform;
        /* #endif */
    }

    .up-video-danmaku__text {
        /* #ifndef APP-NVUE */
        white-space: nowrap;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
        /* #endif */
        line-height: 1.6;
    }
</style>
