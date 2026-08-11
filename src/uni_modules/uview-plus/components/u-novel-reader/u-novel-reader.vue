<template>
    <view
        class="up-novel-reader"
        :style="readerStyle"
    >
        <view class="up-novel-reader__viewport">
            <reader-content
                :mode="resolvedMode"
                :paragraphs="normalizedContent.paragraphs"
                :pages="layout.pages"
                :page-index="pageIndex"
                :scroll-top="scrollTop"
                :settings="resolvedSettings"
                :theme-tokens="themeTokens"
                :loading="loading"
                :error="error"
                :page-animation="effectiveAnimation"
                @content-scroll="handleContentScroll"
                @page-change="handlePageChange"
                @tap-zone="handleTapZone"
                @retry="handleRetry"
            >
                <template #loading>
                    <slot name="loading"></slot>
                </template>
                <template #error="{ error: slotError, retry }">
                    <slot name="error" :error="slotError" :retry="retry"></slot>
                </template>
                <template #empty>
                    <slot name="empty"></slot>
                </template>
            </reader-content>
        </view>
    </view>
</template>

<script>
    import { nextTick } from 'vue'
    import { getWindowInfo } from '../../libs/function/index'
    import { mixin } from '../../libs/mixin/mixin'
    import { mpMixin } from '../../libs/mixin/mpMixin'
    import { measureContainer, measureTextWidth } from './measure-adapter'
    import { normalizeContent, normalizeProgress } from './content-normalizer'
    import {
        mergeReaderSettings,
        normalizeMode
    } from './reader-core'
    import { paginateParagraphs, resolveAnchor } from './layout-engine'
    import props from './props'
    import ReaderContent from './reader-content.vue'

    const THEME_TOKENS = {
        day: {
            background: '#f7f8fa',
            text: '#303133',
            muted: '#909399',
            toolbar: '#ffffff'
        },
        paper: {
            background: '#f3ead7',
            text: '#51483d',
            muted: '#8f806d',
            toolbar: '#f7efdf'
        },
        green: {
            background: '#e7f1e4',
            text: '#3f5140',
            muted: '#708371',
            toolbar: '#eef6eb'
        },
        night: {
            background: '#202124',
            text: '#d6d7da',
            muted: '#9ca0a8',
            toolbar: '#292b30'
        },
        dark: {
            background: '#111214',
            text: '#e5e7eb',
            muted: '#9ca3af',
            toolbar: '#1b1d21'
        }
    }

    export default {
        name: 'up-novel-reader',
        components: {
            ReaderContent
        },
        mixins: [mpMixin, mixin, props],
        emits: [
            'chapter-request',
            'chapter-prefetch',
            'progress-change',
            'settings-change',
            'mode-change',
            'toolbar-change',
            'layout-ready',
            'retry'
        ],
        data() {
            return {
                controlsVisible: false,
                normalizedContent: {
                    paragraphs: [],
                    text: '',
                    length: 0
                },
                layout: {
                    pages: [],
                    pageCount: 0,
                    charOffsetToPage: []
                },
                pageIndex: 0,
                scrollTop: 0,
                viewport: {
                    width: 0,
                    height: 0
                },
                refreshToken: 0,
                pendingChapter: null
            }
        },
        computed: {
            resolvedSettings() {
                return mergeReaderSettings(this.defaultSettings, this.settings)
            },
            resolvedMode() {
                return normalizeMode(this.mode)
            },
            themeTokens() {
                return THEME_TOKENS[this.resolvedSettings.theme] || THEME_TOKENS.day
            },
            effectiveAnimation() {
                return this.pageAnimation && this.resolvedSettings.animation
            },
            readerStyle() {
                return {
                    backgroundColor: this.themeTokens.background,
                    color: this.themeTokens.text
                }
            },
            currentChapterIndex() {
                const index = Number(this.currentChapter && this.currentChapter.index)
                if (Number.isFinite(index)) return index
                return this.chapters.findIndex((item) => (
                    item && this.currentChapter && item.id === this.currentChapter.id
                ))
            },
            currentProgress() {
                return normalizeProgress(this.progress || this.initialProgress, this.currentChapter)
            }
        },
        watch: {
            currentChapter: {
                handler() {
                    this.refreshContent()
                },
                deep: true,
                immediate: true
            },
            mode() {
                this.refreshLayout()
            },
            settings: {
                handler() {
                    this.refreshLayout()
                },
                deep: true
            },
            progress: {
                handler() {
                    this.syncProgress()
                },
                deep: true
            }
        },
        mounted() {
            this.refreshLayout()
            if (typeof uni !== 'undefined' && typeof uni.onWindowResize === 'function') {
                uni.onWindowResize(this.handleWindowResize)
            }
        },
        beforeUnmount() {
            if (typeof uni !== 'undefined' && typeof uni.offWindowResize === 'function') {
                uni.offWindowResize(this.handleWindowResize)
            }
        },
        methods: {
            async refreshContent() {
                this.normalizedContent = normalizeContent(
                    this.currentChapter && this.currentChapter.content
                )
                const progress = this.currentProgress
                this.pageIndex = progress.pageIndex
                this.scrollTop = progress.scrollTop
                await nextTick()
                this.refreshLayout()
            },
            async refreshLayout() {
                const token = ++this.refreshToken
                const rect = await measureContainer('.up-novel-reader__viewport', this)
                if (token !== this.refreshToken) return
                const windowInfo = getWindowInfo()
                const width = Number(rect && rect.width) || Number(windowInfo.windowWidth) || 375
                const height = Number(rect && rect.height) || Number(windowInfo.windowHeight) || 667
                this.viewport = { width, height }
                if (this.resolvedMode !== 'page') {
                    this.$emit('layout-ready', {
                        mode: this.resolvedMode,
                        width,
                        height,
                        pageCount: 0
                    })
                    return
                }
                const contentWidth = this.resolveContentWidth(width)
                const layout = paginateParagraphs(this.normalizedContent.paragraphs, {
                    width: contentWidth,
                    height: Math.max(1, height - 64),
                    fontSize: this.resolvedSettings.fontSize,
                    lineHeight: this.resolvedSettings.lineHeight,
                    paragraphSpacing: this.resolvedSettings.paragraphSpacing,
                    fontFamily: this.resolvedSettings.fontFamily,
                    fontWeight: this.resolvedSettings.fontWeight,
                    measureText: (text) => measureTextWidth(text, this.resolvedSettings)
                })
                this.layout = layout
                const anchor = resolveAnchor(layout.pages, this.currentProgress.charOffset)
                this.pageIndex = anchor.pageIndex
                this.$emit('layout-ready', {
                    mode: this.resolvedMode,
                    width,
                    height,
                    pageCount: layout.pageCount
                })
            },
            resolveContentWidth(width) {
                const value = this.resolvedSettings.contentWidth
                if (typeof value === 'string' && value.endsWith('%')) {
                    return width * Math.min(100, Math.max(40, Number.parseFloat(value))) / 100
                }
                return Math.min(width, Math.max(1, Number.parseFloat(value) || width))
            },
            handleWindowResize() {
                this.refreshLayout()
            },
            handleContentScroll(event) {
                this.scrollTop = Math.max(0, Number(event && event.detail && event.detail.scrollTop) || 0)
                this.emitProgress({
                    scrollTop: this.scrollTop
                })
            },
            handlePageChange(payload) {
                this.pageIndex = Math.max(0, Number(payload && payload.pageIndex) || 0)
                this.emitProgress({
                    pageIndex: this.pageIndex,
                    charOffset: this.layout.pages[this.pageIndex]
                        ? this.layout.pages[this.pageIndex].startOffset
                        : 0
                })
            },
            handleTapZone(zone) {
                if (zone === 'center') {
                    this.controlsVisible = !this.controlsVisible
                    this.$emit('toolbar-change', {
                        visible: this.controlsVisible,
                        reason: 'tap-center'
                    })
                    return
                }
                if (this.resolvedMode !== 'page') return
                this.movePage(zone === 'left' ? -1 : 1)
            },
            movePage(offset) {
                const nextPageIndex = this.pageIndex + offset
                if (nextPageIndex >= 0 && nextPageIndex < this.layout.pageCount) {
                    this.pageIndex = nextPageIndex
                    this.emitProgress({
                        pageIndex: nextPageIndex,
                        charOffset: this.layout.pages[nextPageIndex].startOffset
                    })
                    return
                }
                this.requestChapter(offset < 0 ? 'previous' : 'next')
            },
            requestChapter(direction, targetIndex) {
                if (this.loading || this.pendingChapter) return false
                const currentIndex = this.currentChapterIndex
                const nextIndex = Number.isFinite(targetIndex)
                    ? targetIndex
                    : currentIndex + (direction === 'previous' ? -1 : 1)
                const target = this.chapters[nextIndex]
                if (!target || target.isLocked) return false
                const payload = {
                    targetIndex: nextIndex,
                    targetId: target.id,
                    direction
                }
                this.pendingChapter = payload
                this.$emit('chapter-request', payload)
                return true
            },
            handleRetry() {
                this.$emit('retry')
            },
            syncProgress() {
                if (!this.progress || !this.currentChapter) return
                if (
                    this.progress.chapterId != null &&
                    this.progress.chapterId !== this.currentChapter.id
                ) {
                    return
                }
                this.pageIndex = Math.max(0, Number(this.progress.pageIndex) || 0)
                this.scrollTop = Math.max(0, Number(this.progress.scrollTop) || 0)
            },
            emitProgress(extra = {}) {
                const page = this.layout.pages[this.pageIndex]
                const pageCount = this.layout.pageCount
                const progress = {
                    chapterId: this.currentChapter && this.currentChapter.id,
                    chapterIndex: this.currentChapterIndex,
                    pageIndex: this.pageIndex,
                    pageCount,
                    charOffset: page ? page.startOffset : 0,
                    chapterProgress: pageCount ? (this.pageIndex + 1) / pageCount : 0,
                    totalProgress: this.chapters.length
                        ? (this.currentChapterIndex + (pageCount ? this.pageIndex / pageCount : 0)) / this.chapters.length
                        : 0,
                    scrollTop: this.scrollTop,
                    updatedAt: Date.now(),
                    ...extra
                }
                this.$emit('progress-change', progress)
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./theme-vars.scss";

    .up-novel-reader {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .up-novel-reader__viewport {
        width: 100%;
        height: 100%;
    }
</style>
