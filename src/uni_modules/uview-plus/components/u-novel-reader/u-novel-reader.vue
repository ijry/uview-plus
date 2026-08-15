<template>
    <view
        class="up-novel-reader"
        :class="`theme-${resolvedSettings.theme}`"
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
        <view v-if="controlsVisible" class="up-novel-reader__controls">
            <view class="up-novel-reader__top-toolbar">
                <u-status-bar
                    v-if="safeAreaInsetTop"
                    :bg-color="themeTokens.toolbar"
                ></u-status-bar>
                <reader-toolbar
                    position="top"
                    :title="currentChapter && currentChapter.title"
                    :show-back="showBack"
                    :back-icon="backIcon"
                    :is-bookmarked="isCurrentBookmarked"
                    :theme-tokens="themeTokens"
                    @back="handleBack"
                    @toggle-catalog="catalogVisible = true"
                    @toggle-bookmark="toggleBookmark"
                    @toggle-controls="hideControls"
                >
                    <template #top>
                        <slot name="top"></slot>
                    </template>
                    <template #toolbar-extra>
                        <slot name="toolbar-extra"></slot>
                    </template>
                </reader-toolbar>
            </view>
            <view class="up-novel-reader__bottom-toolbar">
                <reader-toolbar
                    position="bottom"
                    :progress="currentProgress"
                    :page-count="layout.pageCount"
                    :current-chapter-index="currentChapterIndex"
                    :chapter-count="chapters.length"
                    :has-previous="hasPreviousChapter"
                    :has-next="hasNextChapter"
                    :theme-tokens="themeTokens"
                    @previous="requestChapter('previous')"
                    @next="requestChapter('next')"
                    @toggle-settings="settingsVisible = true"
                    @toggle-controls="hideControls"
                >
                    <template #bottom>
                        <slot name="bottom"></slot>
                    </template>
                </reader-toolbar>
                <u-safe-bottom
                    v-if="safeAreaInsetBottom"
                    :style="{ backgroundColor: themeTokens.toolbar }"
                ></u-safe-bottom>
            </view>
        </view>
        <u-popup
            v-model:show="catalogVisible"
            mode="left"
            round="0"
            :duration="effectiveAnimation ? 300 : 0"
            :overlay-duration="effectiveAnimation ? 350 : 0"
            :safe-area-inset-bottom="safeAreaInsetBottom"
            :custom-style="catalogPopupStyle"
        >
            <reader-catalog
                :chapters="chapters"
                :current-chapter="currentChapter"
                :bookmarks="resolvedBookmarks"
                :progress="currentProgress"
                :theme-tokens="themeTokens"
                @chapter-select="handleChapterSelect"
                @bookmark-select="handleBookmarkSelect"
            >
                <template #default>
                    <slot name="catalog"></slot>
                </template>
            </reader-catalog>
        </u-popup>
        <u-popup
            v-model:show="settingsVisible"
            mode="bottom"
            round="18"
            :duration="effectiveAnimation ? 300 : 0"
            :overlay-duration="effectiveAnimation ? 350 : 0"
            :safe-area-inset-bottom="safeAreaInsetBottom"
            :custom-style="settingsPopupStyle"
        >
            <reader-settings
                :settings="resolvedSettings"
                :theme-tokens="themeTokens"
                @update-settings="handleSettingsUpdate"
                @close="settingsVisible = false"
            >
                <template #default>
                    <slot name="settings"></slot>
                </template>
            </reader-settings>
        </u-popup>
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
        createBookmark,
        mergeReaderSettings,
        normalizeMode
    } from './reader-core'
    import { paginateParagraphs, resolveAnchor } from './layout-engine'
    import {
        createStorageKey,
        readPersistedState,
        writePersistedState
    } from './persistence'
    import props from './props'
    import ReaderContent from './reader-content.vue'
    import ReaderToolbar from './reader-toolbar.vue'
    import ReaderCatalog from './reader-catalog.vue'
    import ReaderSettings from './reader-settings.vue'

    const THEME_TOKENS = {
        day: {
            background: '#f7f8fa',
            text: '#303133',
            muted: '#909399',
            toolbar: '#ffffff',
            border: 'rgba(48, 49, 51, 0.12)',
            active: '#2979ff',
            disabled: '#c8c9cc'
        },
        paper: {
            background: '#f3ead7',
            text: '#51483d',
            muted: '#8f806d',
            toolbar: '#f7efdf',
            border: 'rgba(81, 72, 61, 0.16)',
            active: '#9b7653',
            disabled: '#c7b9a3'
        },
        green: {
            background: '#e7f1e4',
            text: '#3f5140',
            muted: '#708371',
            toolbar: '#eef6eb',
            border: 'rgba(63, 81, 64, 0.16)',
            active: '#4d8b55',
            disabled: '#b6c7b4'
        },
        night: {
            background: '#202124',
            text: '#d6d7da',
            muted: '#9ca0a8',
            toolbar: '#292b30',
            border: 'rgba(214, 215, 218, 0.16)',
            active: '#7da7ff',
            disabled: '#62656d'
        },
        dark: {
            background: '#111214',
            text: '#e5e7eb',
            muted: '#9ca3af',
            toolbar: '#1b1d21',
            border: 'rgba(229, 231, 235, 0.16)',
            active: '#8ab4ff',
            disabled: '#5f6368'
        }
    }

    export default {
        name: 'up-novel-reader',
        components: {
            ReaderContent,
            ReaderToolbar,
            ReaderCatalog,
            ReaderSettings
        },
        mixins: [mpMixin, mixin, props],
        emits: [
            'chapter-request',
            'chapter-prefetch',
            'progress-change',
            'settings-change',
            'bookmark-change',
            'reading-time-change',
            'back',
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
                pendingChapter: null,
                localSettings: null,
                localProgress: null,
                localBookmarks: [],
                persistedState: null,
                readerStorageKey: '',
                persistTimer: null,
                prefetchedTargets: {},
                readingTime: 0,
                readingActive: false,
                readingLastActiveAt: 0,
                scrollHeight: 0,
                catalogVisible: false,
                settingsVisible: false,
                controlsHideTimer: null
            }
        },
        created() {
            this.initializeReaderState()
        },
        computed: {
            resolvedSettings() {
                return mergeReaderSettings(
                    this.defaultSettings,
                    this.localSettings,
                    this.settings
                )
            },
            resolvedMode() {
                return normalizeMode(this.mode)
            },
            themeTokens() {
                const theme = THEME_TOKENS[this.resolvedSettings.theme]
                    ? this.resolvedSettings.theme
                    : 'day'
                return {
                    ...THEME_TOKENS[theme],
                    theme
                }
            },
            effectiveAnimation() {
                return this.pageAnimation && this.resolvedSettings.animation
            },
            hasPreviousChapter() {
                return this.chapters.some((chapter) => (
                    chapter &&
                    Number(chapter.index) < this.currentChapterIndex &&
                    !chapter.isLocked
                ))
            },
            hasNextChapter() {
                return this.chapters.some((chapter) => (
                    chapter &&
                    Number(chapter.index) > this.currentChapterIndex &&
                    !chapter.isLocked
                ))
            },
            resolvedBookmarks() {
                return Array.isArray(this.bookmarks)
                    ? this.bookmarks
                    : this.localBookmarks
            },
            isCurrentBookmarked() {
                const chapterId = this.currentChapter && this.currentChapter.id
                const charOffset = Number(this.currentProgress.charOffset) || 0
                return this.resolvedBookmarks.some((bookmark) => (
                    bookmark &&
                    bookmark.chapterId === chapterId &&
                    Number(bookmark.charOffset) === charOffset
                ))
            },
            readerStyle() {
                return {
                    backgroundColor: this.themeTokens.background,
                    color: this.themeTokens.text,
                    '--up-novel-reader-background': this.themeTokens.background,
                    '--up-novel-reader-text': this.themeTokens.text,
                    '--up-novel-reader-muted': this.themeTokens.muted,
                    '--up-novel-reader-toolbar': this.themeTokens.toolbar,
                    '--up-novel-reader-active': this.themeTokens.active || '#2979ff',
                    '--up-novel-reader-disabled': this.themeTokens.disabled || '#c8c9cc',
                    '--up-novel-reader-border': this.themeTokens.border || 'rgba(48, 49, 51, 0.12)'
                }
            },
            catalogPopupStyle() {
                return {
                    width: '82vw',
                    maxWidth: '360px',
                    backgroundColor: this.themeTokens.background
                }
            },
            settingsPopupStyle() {
                return {
                    backgroundColor: this.themeTokens.background
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
                const source = this.progress != null
                    ? this.progress
                    : (this.localProgress || this.initialProgress)
                return normalizeProgress(source, this.currentChapter)
            }
        },
        watch: {
            currentChapter: {
                handler(chapter) {
                    if (
                        this.pendingChapter &&
                        chapter &&
                        chapter.id === this.pendingChapter.targetId
                    ) {
                        this.pendingChapter = null
                    }
                    this.prefetchedTargets = {}
                    this.refreshContent()
                },
                deep: true,
                immediate: true
            },
            mode() {
                this.refreshLayout()
                this.$emit('mode-change', this.resolvedMode)
            },
            settings: {
                handler() {
                    this.refreshLayout()
                    this.queuePersist()
                },
                deep: true
            },
            progress: {
                handler() {
                    this.syncProgress()
                    this.queuePersist()
                },
                deep: true
            },
            bookmarks: {
                handler() {
                    this.queuePersist()
                },
                deep: true
            },
            loading(value) {
                if (value) this.pauseReading()
            },
            error(value) {
                if (value) this.pauseReading()
            },
            bookId() {
                this.initializeReaderState()
            },
            storageKey() {
                this.initializeReaderState()
            }
        },
        mounted() {
            this.refreshLayout()
            if (typeof uni !== 'undefined' && typeof uni.onWindowResize === 'function') {
                uni.onWindowResize(this.handleWindowResize)
            }
        },
        beforeUnmount() {
            this.pauseReading()
            this.flushPersistence()
            this.clearControlsHideTimer()
            if (typeof uni !== 'undefined' && typeof uni.offWindowResize === 'function') {
                uni.offWindowResize(this.handleWindowResize)
            }
        },
        onHide() {
            this.pauseReading()
            this.flushPersistence()
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
                this.activateReading()
                this.scrollTop = Math.max(0, Number(event && event.detail && event.detail.scrollTop) || 0)
                this.scrollHeight = Math.max(
                    0,
                    Number(event && event.detail && event.detail.scrollHeight) || this.scrollHeight
                )
                this.emitProgress({
                    scrollTop: this.scrollTop
                })
            },
            handlePageChange(payload) {
                this.activateReading()
                this.pageIndex = Math.max(0, Number(payload && payload.pageIndex) || 0)
                this.emitProgress({
                    pageIndex: this.pageIndex,
                    charOffset: this.layout.pages[this.pageIndex]
                        ? this.layout.pages[this.pageIndex].startOffset
                        : 0
                })
            },
            handleTapZone(zone) {
                this.activateReading()
                if (zone === 'center') {
                    this.toggleControls('tap-center')
                    return
                }
                if (this.resolvedMode !== 'page') return
                this.movePage(zone === 'left' ? -1 : 1)
            },
            toggleControls(reason = 'manual') {
                this.controlsVisible = !this.controlsVisible
                this.$emit('toolbar-change', {
                    visible: this.controlsVisible,
                    reason
                })
                if (this.controlsVisible) this.scheduleControlsHide()
                else this.clearControlsHideTimer()
            },
            hideControls() {
                if (!this.controlsVisible) return
                this.controlsVisible = false
                this.clearControlsHideTimer()
                this.$emit('toolbar-change', {
                    visible: false,
                    reason: 'toolbar-action'
                })
            },
            scheduleControlsHide() {
                this.clearControlsHideTimer()
                if (!this.controlsAutoHide) return
                this.controlsHideTimer = setTimeout(() => {
                    this.hideControls()
                }, Math.max(0, Number(this.controlsAutoHide)))
            },
            clearControlsHideTimer() {
                if (this.controlsHideTimer) {
                    clearTimeout(this.controlsHideTimer)
                    this.controlsHideTimer = null
                }
            },
            handleBack() {
                this.$emit('back')
                if (
                    this.autoBack &&
                    typeof uni !== 'undefined' &&
                    typeof uni.navigateBack === 'function'
                ) {
                    uni.navigateBack()
                }
            },
            handleChapterSelect(chapter) {
                if (!chapter) return
                this.catalogVisible = false
                this.requestChapter('catalog', chapter.index)
            },
            handleBookmarkSelect(bookmark) {
                if (!bookmark) return
                this.catalogVisible = false
                if (
                    this.currentChapter &&
                    bookmark.chapterId === this.currentChapter.id
                ) {
                    this.pageIndex = Math.max(0, Number(bookmark.pageIndex) || 0)
                    this.scrollTop = Math.max(0, Number(bookmark.scrollTop) || 0)
                    this.emitProgress({
                        charOffset: Math.max(0, Number(bookmark.charOffset) || 0)
                    })
                    return
                }
                this.requestChapter('catalog', bookmark.chapterIndex)
            },
            handleSettingsUpdate(settings) {
                this.localSettings = { ...settings }
                this.settingsVisible = false
                this.$emit('settings-change', {
                    mode: this.resolvedMode,
                    ...mergeReaderSettings(settings)
                })
                this.queuePersist()
                this.refreshLayout()
            },
            toggleBookmark() {
                const chapterId = this.currentChapter && this.currentChapter.id
                if (!chapterId) return
                const bookmark = createBookmark({
                    chapterId,
                    chapterIndex: this.currentChapterIndex,
                    charOffset: this.currentProgress.charOffset || 0,
                    pageIndex: this.pageIndex,
                    scrollTop: this.scrollTop,
                    excerpt: this.getBookmarkExcerpt()
                })
                const list = this.isCurrentBookmarked
                    ? this.resolvedBookmarks.filter((item) => item.id !== bookmark.id)
                    : [...this.resolvedBookmarks, bookmark]
                if (!Array.isArray(this.bookmarks)) this.localBookmarks = list
                this.$emit('bookmark-change', list)
                this.queuePersist()
            },
            getBookmarkExcerpt() {
                const text = this.normalizedContent.text || ''
                const offset = Math.max(0, Number(this.currentProgress.charOffset) || 0)
                return text.slice(Math.max(0, offset - 12), offset + 28).trim()
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
                const target = this.resolveChapter(nextIndex)
                if (!target || target.isLocked) return false
                const payload = {
                    targetIndex: nextIndex,
                    targetId: target.id,
                    direction,
                    requestId: `${Date.now()}-${this.refreshToken}`
                }
                this.pendingChapter = payload
                this.flushPersistence()
                this.$emit('chapter-request', payload)
                return true
            },
            handleRetry() {
                const retryPayload = this.pendingChapter
                this.pendingChapter = null
                this.$emit('retry', retryPayload)
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
                const scrollProgress = this.resolveScrollProgress()
                const chapterProgress = pageCount
                    ? (this.pageIndex + 1) / pageCount
                    : scrollProgress
                const charOffset = page
                    ? page.startOffset
                    : Math.round(this.normalizedContent.length * scrollProgress)
                const progress = {
                    chapterId: this.currentChapter && this.currentChapter.id,
                    chapterIndex: this.currentChapterIndex,
                    pageIndex: this.pageIndex,
                    pageCount,
                    charOffset,
                    chapterProgress,
                    totalProgress: this.chapters.length
                        ? (this.currentChapterIndex + chapterProgress) / this.chapters.length
                        : 0,
                    scrollTop: this.scrollTop,
                    updatedAt: Date.now(),
                    ...extra
                }
                if (this.progress == null) this.localProgress = progress
                this.$emit('progress-change', progress)
                this.queuePersist()
                this.emitPrefetchIfNeeded()
            },
            initializeReaderState() {
                this.readerStorageKey = createStorageKey({
                    storageKey: this.storageKey,
                    bookId: this.bookId
                })
                this.persistedState = this.persist
                    ? readPersistedState(this.readerStorageKey)
                    : null
                if (this.progress == null) {
                    this.localProgress = this.initialProgress || (
                        this.persistedState && this.persistedState.progress
                    ) || null
                }
                if (!Array.isArray(this.bookmarks)) {
                    this.localBookmarks = (
                        this.initialBookmarks && this.initialBookmarks.length
                            ? this.initialBookmarks
                            : (this.persistedState && this.persistedState.bookmarks) || []
                    ).slice()
                }
                if (this.settings == null) {
                    this.localSettings = (
                        this.persistedState && this.persistedState.settings
                    ) || null
                }
                this.readingTime = this.persistedState
                    ? this.persistedState.readingTime
                    : 0
            },
            resolveChapter(index) {
                const numericIndex = Number(index)
                return this.chapters.find((chapter) => (
                    chapter && Number(chapter.index) === numericIndex
                )) || this.chapters[numericIndex]
            },
            resolveScrollProgress() {
                if (this.scrollHeight <= this.viewport.height) return 0
                const available = Math.max(1, this.scrollHeight - this.viewport.height)
                return Math.min(1, Math.max(0, this.scrollTop / available))
            },
            emitPrefetchIfNeeded() {
                if (
                    this.resolvedMode !== 'page' ||
                    !this.layout.pageCount ||
                    this.layout.pageCount - this.pageIndex > Math.max(0, this.preloadThreshold)
                ) {
                    return
                }
                const target = this.chapters.find((chapter) => (
                    chapter &&
                    Number(chapter.index) > this.currentChapterIndex &&
                    !chapter.isLocked
                ))
                if (!target || this.prefetchedTargets[target.id]) return
                this.prefetchedTargets[target.id] = true
                this.$emit('chapter-prefetch', {
                    targetIndex: Number(target.index),
                    targetId: target.id,
                    direction: 'next'
                })
            },
            queuePersist() {
                if (!this.persist || !this.readerStorageKey) return
                if (this.persistTimer) return
                this.persistTimer = setTimeout(() => {
                    this.persistTimer = null
                    this.flushPersistence()
                }, 180)
            },
            flushPersistence() {
                if (this.persistTimer) {
                    clearTimeout(this.persistTimer)
                    this.persistTimer = null
                }
                if (!this.persist || !this.readerStorageKey) return false
                return writePersistedState(this.readerStorageKey, {
                    progress: this.currentProgress,
                    settings: this.resolvedSettings,
                    bookmarks: this.resolvedBookmarks,
                    readingTime: this.readingTime
                })
            },
            activateReading() {
                if (this.loading || this.error || !this.currentChapter) return
                if (!this.readingActive) {
                    this.readingActive = true
                    this.readingLastActiveAt = Date.now()
                }
            },
            pauseReading() {
                if (!this.readingActive) return
                const now = Date.now()
                const delta = Math.max(0, now - this.readingLastActiveAt)
                this.readingTime += delta
                this.readingActive = false
                this.readingLastActiveAt = 0
                this.$emit('reading-time-change', {
                    readingTime: this.readingTime,
                    delta,
                    updatedAt: now
                })
                this.queuePersist()
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

    .up-novel-reader__controls,
    .up-novel-reader__top-toolbar,
    .up-novel-reader__bottom-toolbar {
        position: absolute;
        right: 0;
        left: 0;
        z-index: 10;
    }

    .up-novel-reader__controls {
        top: 0;
        bottom: 0;
        pointer-events: none;
    }

    .up-novel-reader__top-toolbar,
    .up-novel-reader__bottom-toolbar {
        pointer-events: auto;
    }

    .up-novel-reader__top-toolbar {
        top: 0;
    }

    .up-novel-reader__bottom-toolbar {
        bottom: 0;
    }

    .up-novel-reader__viewport {
        width: 100%;
        height: 100%;
    }
</style>
