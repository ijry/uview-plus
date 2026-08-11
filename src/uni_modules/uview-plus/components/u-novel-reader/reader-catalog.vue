<template>
    <view class="up-novel-reader__catalog" :style="catalogStyle">
            <view class="up-novel-reader__catalog-header">
                <text class="up-novel-reader__catalog-title">目录</text>
                <text class="up-novel-reader__catalog-count">{{ chapters.length }} 章</text>
            </view>
            <slot v-if="$slots.default"></slot>
            <scroll-view v-else class="up-novel-reader__catalog-scroll" scroll-y>
                <view
                    v-for="chapter in chapters"
                    :key="chapter.id || chapter.index"
                    class="up-novel-reader__catalog-item"
                    :class="{
                        'is-current': isCurrent(chapter),
                        'is-locked': chapter.isLocked
                    }"
                    :aria-disabled="chapter.isLocked ? 'true' : 'false'"
                    @tap="selectChapter(chapter)"
                >
                    <view class="up-novel-reader__catalog-index">
                        <u-icon
                            v-if="chapter.isLocked"
                            name="lock"
                            size="14"
                            :color="mutedColor"
                        ></u-icon>
                        <text v-else>{{ displayIndex(chapter) }}</text>
                    </view>
                    <text class="up-novel-reader__catalog-item-title">{{ chapter.title || `第${displayIndex(chapter)}章` }}</text>
                    <u-icon
                        v-if="isCurrent(chapter)"
                        name="checkmark"
                        size="16"
                        :color="activeColor"
                    ></u-icon>
                </view>
                <view v-if="!chapters.length" class="up-novel-reader__catalog-empty">暂无目录</view>
                <view v-if="bookmarks.length" class="up-novel-reader__bookmark-section">
                    <view class="up-novel-reader__bookmark-heading">
                        <u-icon name="bookmark" size="15" :color="activeColor"></u-icon>
                        <text>书签</text>
                    </view>
                    <view
                        v-for="bookmark in bookmarks"
                        :key="bookmark.id"
                        class="up-novel-reader__bookmark-item"
                        @tap="selectBookmark(bookmark)"
                    >
                        <text class="up-novel-reader__bookmark-excerpt">{{ bookmark.excerpt || '书签位置' }}</text>
                        <text class="up-novel-reader__bookmark-progress">{{ bookmark.chapterIndex + 1 }} 章</text>
                    </view>
                </view>
            </scroll-view>
    </view>
</template>

<script>
    export default {
        name: 'NovelReaderCatalog',
        props: {
            chapters: {
                type: Array,
                default: () => []
            },
            currentChapter: {
                type: Object,
                default: null
            },
            bookmarks: {
                type: Array,
                default: () => []
            },
            progress: {
                type: Object,
                default: () => ({})
            },
            themeTokens: {
                type: Object,
                default: () => ({})
            },
        },
        emits: ['chapter-select', 'bookmark-select'],
        computed: {
            catalogStyle() {
                return {
                    color: this.themeTokens.text || '#303133',
                    backgroundColor: this.themeTokens.background || '#ffffff'
                }
            },
            activeColor() {
                return this.themeTokens.active || '#2979ff'
            },
            mutedColor() {
                return this.themeTokens.muted || '#909399'
            }
        },
        methods: {
            displayIndex(chapter) {
                const index = Number(chapter && chapter.index)
                return Number.isFinite(index) ? index + 1 : ''
            },
            isCurrent(chapter) {
                return Boolean(
                    chapter &&
                    this.currentChapter &&
                    chapter.id === this.currentChapter.id
                )
            },
            selectChapter(chapter) {
                if (!chapter || chapter.isLocked) return
                this.$emit('chapter-select', chapter)
            },
            selectBookmark(bookmark) {
                if (!bookmark) return
                this.$emit('bookmark-select', bookmark)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .up-novel-reader__catalog {
        display: flex;
        flex-direction: column;
        width: 82vw;
        max-width: 360px;
        height: 100vh;
        box-sizing: border-box;
    }

    .up-novel-reader__catalog-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        padding: 20px 18px 14px;
        border-bottom: 1px solid var(--up-novel-reader-border, rgba(48, 49, 51, 0.12));
    }

    .up-novel-reader__catalog-title {
        font-size: 19px;
        font-weight: 600;
    }

    .up-novel-reader__catalog-count {
        color: var(--up-novel-reader-muted, #909399);
        font-size: 12px;
    }

    .up-novel-reader__catalog-scroll {
        flex: 1;
        min-height: 0;
    }

    .up-novel-reader__catalog-item {
        display: flex;
        align-items: center;
        min-height: 48px;
        padding: 0 18px;
        gap: 10px;
    }

    .up-novel-reader__catalog-item.is-current {
        color: var(--up-novel-reader-active, #2979ff);
        background-color: rgba(41, 121, 255, 0.08);
    }

    .up-novel-reader__catalog-item.is-locked {
        opacity: 0.45;
    }

    .up-novel-reader__catalog-index {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        color: var(--up-novel-reader-muted, #909399);
        font-size: 12px;
    }

    .up-novel-reader__catalog-item-title {
        flex: 1;
        overflow: hidden;
        font-size: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .up-novel-reader__catalog-empty {
        padding: 36px 18px;
        color: var(--up-novel-reader-muted, #909399);
        text-align: center;
        font-size: 14px;
    }

    .up-novel-reader__bookmark-section {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--up-novel-reader-border, rgba(48, 49, 51, 0.12));
    }

    .up-novel-reader__bookmark-heading {
        display: flex;
        align-items: center;
        padding: 0 18px 8px;
        gap: 6px;
        color: var(--up-novel-reader-muted, #909399);
        font-size: 12px;
    }

    .up-novel-reader__bookmark-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 18px;
        gap: 12px;
    }

    .up-novel-reader__bookmark-excerpt {
        flex: 1;
        overflow: hidden;
        font-size: 13px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .up-novel-reader__bookmark-progress {
        color: var(--up-novel-reader-muted, #909399);
        font-size: 11px;
    }
</style>
