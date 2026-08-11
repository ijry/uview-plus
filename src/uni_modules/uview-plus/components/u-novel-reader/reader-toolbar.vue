<template>
    <view
        class="up-novel-reader__toolbar"
        :class="[
            `up-novel-reader__toolbar--${position}`,
            { 'is-dark': isDark }
        ]"
        :style="toolbarStyle"
        @tap.stop="handleToggleControls"
    >
        <view v-if="position === 'top'" class="up-novel-reader__toolbar-row">
            <view class="up-novel-reader__toolbar-group">
                <view
                    v-if="showBack"
                    class="up-novel-reader__toolbar-button"
                    hover-class="up-novel-reader__toolbar-button--hover"
                    @tap.stop="handleBack"
                >
                    <u-icon :name="backIcon" size="21" :color="textColor"></u-icon>
                </view>
                <text class="up-novel-reader__toolbar-title">{{ title || '小说阅读' }}</text>
            </view>
            <view class="up-novel-reader__toolbar-group">
                <slot name="top"></slot>
                <view
                    class="up-novel-reader__toolbar-button"
                    hover-class="up-novel-reader__toolbar-button--hover"
                    @tap.stop="handleToggleCatalog"
                >
                    <u-icon name="list" size="20" :color="textColor"></u-icon>
                </view>
                <view
                    class="up-novel-reader__toolbar-button"
                    hover-class="up-novel-reader__toolbar-button--hover"
                    @tap.stop="handleToggleBookmark"
                >
                    <u-icon
                        name="bookmark"
                        size="20"
                        :color="isBookmarked ? activeColor : textColor"
                        :bold="isBookmarked"
                    ></u-icon>
                </view>
                <slot name="toolbar-extra"></slot>
                <view
                    class="up-novel-reader__toolbar-button"
                    hover-class="up-novel-reader__toolbar-button--hover"
                    @tap.stop="handleToggleControls"
                >
                    <u-icon name="close" size="19" :color="textColor"></u-icon>
                </view>
            </view>
        </view>
        <view v-else class="up-novel-reader__toolbar-row up-novel-reader__toolbar-row--bottom">
            <view class="up-novel-reader__progress">
                <text class="up-novel-reader__progress-label">{{ progressLabel }}</text>
                <view class="up-novel-reader__progress-track">
                    <view class="up-novel-reader__progress-value" :style="{ width: `${progressPercent}%` }"></view>
                </view>
            </view>
            <view class="up-novel-reader__toolbar-group">
                <slot name="bottom"></slot>
                <view
                    class="up-novel-reader__toolbar-button"
                    :class="{ 'is-disabled': previousDisabled }"
                    hover-class="up-novel-reader__toolbar-button--hover"
                    @tap.stop="handlePrevious"
                >
                    <u-icon name="arrow-left" size="18" :color="previousDisabled ? disabledColor : textColor"></u-icon>
                </view>
                <view
                    class="up-novel-reader__toolbar-button"
                    :class="{ 'is-disabled': nextDisabled }"
                    hover-class="up-novel-reader__toolbar-button--hover"
                    @tap.stop="handleNext"
                >
                    <u-icon name="arrow-right" size="18" :color="nextDisabled ? disabledColor : textColor"></u-icon>
                </view>
                <view
                    class="up-novel-reader__toolbar-button"
                    hover-class="up-novel-reader__toolbar-button--hover"
                    @tap.stop="handleToggleSettings"
                >
                    <u-icon name="setting" size="20" :color="textColor"></u-icon>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'NovelReaderToolbar',
        props: {
            position: {
                type: String,
                default: 'top'
            },
            title: {
                type: String,
                default: ''
            },
            showBack: {
                type: Boolean,
                default: true
            },
            backIcon: {
                type: String,
                default: 'arrow-left'
            },
            isBookmarked: {
                type: Boolean,
                default: false
            },
            progress: {
                type: Object,
                default: () => ({})
            },
            pageCount: {
                type: Number,
                default: 0
            },
            currentChapterIndex: {
                type: Number,
                default: -1
            },
            chapterCount: {
                type: Number,
                default: 0
            },
            hasPrevious: {
                type: Boolean,
                default: false
            },
            hasNext: {
                type: Boolean,
                default: false
            },
            themeTokens: {
                type: Object,
                default: () => ({})
            }
        },
        emits: [
            'back',
            'toggle-catalog',
            'toggle-settings',
            'toggle-bookmark',
            'previous',
            'next',
            'toggle-controls'
        ],
        computed: {
            isDark() {
                return ['night', 'dark'].includes(this.themeTokens.theme)
            },
            textColor() {
                return this.themeTokens.text || '#303133'
            },
            activeColor() {
                return this.themeTokens.active || '#2979ff'
            },
            disabledColor() {
                return this.themeTokens.disabled || '#c8c9cc'
            },
            toolbarStyle() {
                return {
                    backgroundColor: this.themeTokens.toolbar || '#ffffff',
                    borderColor: this.themeTokens.border || 'rgba(48, 49, 51, 0.12)'
                }
            },
            progressPercent() {
                if (this.progress.chapterProgress != null) {
                    return Math.min(100, Math.max(0, Number(this.progress.chapterProgress) * 100 || 0))
                }
                if (this.pageCount > 0) {
                    return Math.min(100, Math.max(0, ((this.progress.pageIndex || 0) + 1) / this.pageCount * 100))
                }
                return 0
            },
            progressLabel() {
                const current = this.currentChapterIndex >= 0 ? this.currentChapterIndex + 1 : 0
                const chapterText = this.chapterCount ? `${current}/${this.chapterCount}` : '阅读进度'
                const percentText = `${Math.round(this.progressPercent)}%`
                return `${chapterText} · ${percentText}`
            },
            previousDisabled() {
                return !this.hasPrevious
            },
            nextDisabled() {
                return !this.hasNext
            }
        },
        methods: {
            handleBack() {
                this.$emit('back')
            },
            handleToggleCatalog() {
                this.$emit('toggle-catalog')
            },
            handleToggleSettings() {
                this.$emit('toggle-settings')
            },
            handleToggleBookmark() {
                this.$emit('toggle-bookmark')
            },
            handlePrevious() {
                if (!this.previousDisabled) this.$emit('previous')
            },
            handleNext() {
                if (!this.nextDisabled) this.$emit('next')
            },
            handleToggleControls() {
                this.$emit('toggle-controls')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .up-novel-reader__toolbar {
        box-sizing: border-box;
        width: 100%;
        padding: 10px 14px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
    }

    .up-novel-reader__toolbar--bottom {
        border-top-width: 1px;
        border-top-style: solid;
        border-bottom: 0;
        padding-top: 8px;
        padding-bottom: 8px;
    }

    .up-novel-reader__toolbar-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 36px;
    }

    .up-novel-reader__toolbar-row--bottom {
        gap: 12px;
    }

    .up-novel-reader__toolbar-group {
        display: flex;
        align-items: center;
        min-width: 0;
        gap: 6px;
    }

    .up-novel-reader__toolbar-title {
        max-width: 44vw;
        overflow: hidden;
        color: inherit;
        font-size: 16px;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .up-novel-reader__toolbar-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 18px;
    }

    .up-novel-reader__toolbar-button--hover {
        opacity: 0.55;
        background-color: rgba(127, 127, 127, 0.12);
    }

    .up-novel-reader__toolbar-button.is-disabled {
        opacity: 0.5;
    }

    .up-novel-reader__progress {
        flex: 1;
        min-width: 0;
    }

    .up-novel-reader__progress-label {
        display: block;
        margin-bottom: 5px;
        color: inherit;
        font-size: 11px;
        line-height: 16px;
        opacity: 0.78;
    }

    .up-novel-reader__progress-track {
        width: 100%;
        height: 3px;
        overflow: hidden;
        border-radius: 3px;
        background-color: rgba(127, 127, 127, 0.22);
    }

    .up-novel-reader__progress-value {
        height: 100%;
        border-radius: inherit;
        background-color: var(--up-novel-reader-active, #2979ff);
    }
</style>
