<template>
    <view
        class="up-novel-reader__content"
        :style="{ color: themeTokens.text, backgroundColor: themeTokens.background }"
        @tap="handleTap"
    >
        <view v-if="loading" class="up-novel-reader__state">
            <slot name="loading">
                <text class="up-novel-reader__state-text">章节加载中</text>
            </slot>
        </view>
        <view v-else-if="error" class="up-novel-reader__state">
            <slot name="error" :error="error" :retry="retry">
                <text class="up-novel-reader__state-text">{{ error.message || '章节加载失败' }}</text>
                <view class="up-novel-reader__state-action" @tap.stop="retry">重试</view>
            </slot>
        </view>
        <view v-else-if="!hasContent" class="up-novel-reader__state">
            <slot name="empty">
                <text class="up-novel-reader__state-text">暂无正文</text>
            </slot>
        </view>
        <scroll-view
            v-else-if="mode === 'scroll'"
            class="up-novel-reader__scroll"
            scroll-y
            :scroll-top="scrollTop"
            @scroll="handleScroll"
        >
            <view class="up-novel-reader__article" :style="articleStyle">
                <view
                    v-for="paragraph in paragraphs"
                    :key="paragraph.index"
                    class="up-novel-reader__paragraph"
                    :style="paragraphStyle"
                >
                    <text>{{ paragraph.text }}</text>
                </view>
            </view>
        </scroll-view>
        <swiper
            v-else
            class="up-novel-reader__swiper"
            :current="pageIndex"
            :duration="pageAnimation ? 300 : 0"
            :disable-touch="false"
            @change="handlePageChange"
        >
            <swiper-item
                v-for="page in pages"
                :key="page.index"
                class="up-novel-reader__page"
            >
                <view class="up-novel-reader__article" :style="articleStyle">
                    <text class="up-novel-reader__page-text">{{ page.text }}</text>
                </view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
    import { addUnit } from '../../libs/function/index'

    export default {
        name: 'NovelReaderContent',
        props: {
            mode: {
                type: String,
                default: 'scroll'
            },
            paragraphs: {
                type: Array,
                default: () => []
            },
            pages: {
                type: Array,
                default: () => []
            },
            pageIndex: {
                type: Number,
                default: 0
            },
            scrollTop: {
                type: Number,
                default: 0
            },
            settings: {
                type: Object,
                default: () => ({})
            },
            themeTokens: {
                type: Object,
                default: () => ({})
            },
            loading: {
                type: Boolean,
                default: false
            },
            error: {
                type: Object,
                default: null
            },
            pageAnimation: {
                type: Boolean,
                default: true
            }
        },
        emits: ['content-scroll', 'page-change', 'tap-zone', 'retry'],
        computed: {
            hasContent() {
                return this.paragraphs.length > 0 || this.pages.length > 0
            },
            articleStyle() {
                const style = {
                    width: this.settings.contentWidth || '92%',
                    color: this.themeTokens.text,
                    fontSize: addUnit(this.settings.fontSize || 18, 'px'),
                    lineHeight: this.getLineHeight(this.settings.lineHeight),
                    fontWeight: this.settings.fontWeight || 400
                }
                if (this.settings.fontFamily && this.settings.fontFamily !== 'system') {
                    style.fontFamily = this.settings.fontFamily
                }
                return style
            },
            paragraphStyle() {
                return {
                    marginBottom: addUnit(this.settings.paragraphSpacing || 0, 'px')
                }
            }
        },
        methods: {
            getLineHeight(value) {
                const lineHeight = Number(value)
                if (!Number.isFinite(lineHeight)) return '1.8'
                return lineHeight <= 4 ? String(lineHeight) : addUnit(lineHeight, 'px')
            },
            handleScroll(event) {
                this.$emit('content-scroll', event)
            },
            handlePageChange(event) {
                this.$emit('page-change', {
                    pageIndex: Number(event && event.detail && event.detail.current) || 0
                })
            },
            handleTap(event) {
                const detail = event && event.detail ? event.detail : {}
                const x = Number(detail.x)
                const width = Number(detail.width) || 0
                const resolvedWidth = width || (typeof uni !== 'undefined' && uni.getWindowInfo
                    ? uni.getWindowInfo().windowWidth
                    : 375)
                const zone = x < resolvedWidth / 3
                    ? 'left'
                    : x > resolvedWidth * 2 / 3
                        ? 'right'
                        : 'center'
                this.$emit('tap-zone', zone)
            },
            retry() {
                this.$emit('retry')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .up-novel-reader__content {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .up-novel-reader__scroll,
    .up-novel-reader__swiper {
        width: 100%;
        height: 100%;
    }

    .up-novel-reader__article {
        box-sizing: border-box;
        min-height: 100%;
        margin: 0 auto;
        padding: 32px 0;
    }

    .up-novel-reader__paragraph {
        white-space: pre-wrap;
        word-break: break-word;
    }

    .up-novel-reader__page {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        overflow: hidden;
    }

    .up-novel-reader__page-text {
        white-space: pre-wrap;
        word-break: break-word;
    }

    .up-novel-reader__state {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        gap: 16px;
    }

    .up-novel-reader__state-text {
        color: var(--up-novel-reader-muted, #909399);
        font-size: 14px;
    }

    .up-novel-reader__state-action {
        padding: 8px 18px;
        color: var(--up-primary, #2979ff);
        font-size: 14px;
    }
</style>
