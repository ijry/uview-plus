<template>
    <view class="up-novel-reader__settings" :style="settingsStyle">
            <view class="up-novel-reader__settings-header">
                <text class="up-novel-reader__settings-title">阅读设置</text>
                <view
                    class="up-novel-reader__settings-close"
                    @tap="close"
                >
                    <u-icon name="close" size="18" :color="textColor"></u-icon>
                </view>
            </view>
            <slot v-if="$slots.default"></slot>
            <scroll-view v-else class="up-novel-reader__settings-scroll" scroll-y>
                <view class="up-novel-reader__settings-section">
                    <text class="up-novel-reader__settings-label">主题</text>
                    <view class="up-novel-reader__theme-list">
                        <view
                            v-for="theme in themes"
                            :key="theme.value"
                            class="up-novel-reader__theme-option"
                            :class="{ 'is-active': draftSettings.theme === theme.value }"
                            :style="themeOptionStyle(theme)"
                            @tap="setTheme(theme.value)"
                        >
                            <text>{{ theme.label }}</text>
                        </view>
                    </view>
                </view>
                <view class="up-novel-reader__settings-section">
                    <view class="up-novel-reader__settings-row">
                        <text class="up-novel-reader__settings-label">字号</text>
                        <text class="up-novel-reader__settings-value">{{ draftSettings.fontSize }}px</text>
                    </view>
                    <u-slider
                        v-model="draftSettings.fontSize"
                        min="12"
                        max="32"
                        step="1"
                        active-color="#2979ff"
                        @change="emitSettings"
                    ></u-slider>
                </view>
                <view class="up-novel-reader__settings-section">
                    <view class="up-novel-reader__settings-row">
                        <text class="up-novel-reader__settings-label">行高</text>
                        <text class="up-novel-reader__settings-value">{{ Number(draftSettings.lineHeight).toFixed(1) }}</text>
                    </view>
                    <u-slider
                        v-model="draftSettings.lineHeight"
                        min="1.2"
                        max="2.6"
                        step="0.1"
                        active-color="#2979ff"
                        @change="emitSettings"
                    ></u-slider>
                </view>
                <view class="up-novel-reader__settings-section">
                    <view class="up-novel-reader__settings-row">
                        <text class="up-novel-reader__settings-label">段距</text>
                        <text class="up-novel-reader__settings-value">{{ draftSettings.paragraphSpacing }}px</text>
                    </view>
                    <u-slider
                        v-model="draftSettings.paragraphSpacing"
                        min="0"
                        max="36"
                        step="2"
                        active-color="#2979ff"
                        @change="emitSettings"
                    ></u-slider>
                </view>
                <view class="up-novel-reader__settings-section">
                    <view class="up-novel-reader__settings-row">
                        <text class="up-novel-reader__settings-label">正文宽度</text>
                        <text class="up-novel-reader__settings-value">{{ contentWidthPercent }}%</text>
                    </view>
                    <u-slider
                        v-model="contentWidthValue"
                        min="60"
                        max="100"
                        step="2"
                        active-color="#2979ff"
                        @change="emitContentWidth"
                    ></u-slider>
                </view>
                <view class="up-novel-reader__settings-section up-novel-reader__settings-options">
                    <view class="up-novel-reader__settings-option" @tap="toggleWeight">
                        <view>
                            <text class="up-novel-reader__settings-label">粗体正文</text>
                            <text class="up-novel-reader__settings-hint">增强低亮度主题下的可读性</text>
                        </view>
                        <u-icon
                            :name="draftSettings.fontWeight >= 600 ? 'checkmark-circle-fill' : 'circle'"
                            size="22"
                            :color="draftSettings.fontWeight >= 600 ? '#2979ff' : mutedColor"
                        ></u-icon>
                    </view>
                    <view class="up-novel-reader__settings-option" @tap="toggleAnimation">
                        <view>
                            <text class="up-novel-reader__settings-label">翻页动画</text>
                            <text class="up-novel-reader__settings-hint">关闭后立即切换页面</text>
                        </view>
                        <u-icon
                            :name="draftSettings.animation ? 'checkmark-circle-fill' : 'circle'"
                            size="22"
                            :color="draftSettings.animation ? '#2979ff' : mutedColor"
                        ></u-icon>
                    </view>
                </view>
                <view class="up-novel-reader__settings-footer">
                    <view class="up-novel-reader__settings-done" @tap="close">完成</view>
                </view>
            </scroll-view>
    </view>
</template>

<script>
    import { mergeReaderSettings } from './reader-core'

    export default {
        name: 'NovelReaderSettings',
        props: {
            settings: {
                type: Object,
                default: () => ({})
            },
            themeTokens: {
                type: Object,
                default: () => ({})
            },
        },
        emits: ['update-settings', 'close'],
        data() {
            return {
                draftSettings: mergeReaderSettings(this.settings),
                themes: [
                    { value: 'day', label: '日间', background: '#f7f8fa', text: '#303133' },
                    { value: 'paper', label: '护眼', background: '#f3ead7', text: '#51483d' },
                    { value: 'green', label: '豆沙', background: '#e7f1e4', text: '#3f5140' },
                    { value: 'night', label: '夜间', background: '#202124', text: '#d6d7da' },
                    { value: 'dark', label: '深色', background: '#111214', text: '#e5e7eb' }
                ]
            }
        },
        computed: {
            settingsStyle() {
                return {
                    color: this.textColor,
                    backgroundColor: this.themeTokens.background || '#ffffff'
                }
            },
            textColor() {
                return this.themeTokens.text || '#303133'
            },
            mutedColor() {
                return this.themeTokens.muted || '#909399'
            },
            contentWidthValue: {
                get() {
                    const value = Number.parseFloat(this.draftSettings.contentWidth)
                    return Number.isFinite(value) ? value : 92
                },
                set(value) {
                    this.draftSettings.contentWidth = `${value}%`
                }
            },
            contentWidthPercent() {
                return Math.round(this.contentWidthValue)
            }
        },
        watch: {
            settings: {
                handler(value) {
                    this.draftSettings = mergeReaderSettings(value)
                },
                deep: true
            },
        },
        methods: {
            themeOptionStyle(theme) {
                return {
                    backgroundColor: theme.background,
                    color: theme.text
                }
            },
            setTheme(theme) {
                this.draftSettings.theme = theme
                this.emitSettings()
            },
            toggleWeight() {
                this.draftSettings.fontWeight = this.draftSettings.fontWeight >= 600 ? 400 : 600
                this.emitSettings()
            },
            toggleAnimation() {
                this.draftSettings.animation = !this.draftSettings.animation
                this.emitSettings()
            },
            emitContentWidth() {
                this.emitSettings()
            },
            emitSettings() {
                this.draftSettings = mergeReaderSettings(this.draftSettings)
                this.$emit('update-settings', { ...this.draftSettings })
            },
            close() {
                this.$emit('close')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .up-novel-reader__settings {
        max-height: 78vh;
        overflow: hidden;
    }

    .up-novel-reader__settings-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 18px 10px;
    }

    .up-novel-reader__settings-title {
        font-size: 18px;
        font-weight: 600;
    }

    .up-novel-reader__settings-close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
    }

    .up-novel-reader__settings-scroll {
        max-height: calc(78vh - 64px);
        padding: 0 18px;
        box-sizing: border-box;
    }

    .up-novel-reader__settings-section {
        padding: 12px 0;
    }

    .up-novel-reader__settings-row,
    .up-novel-reader__settings-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .up-novel-reader__settings-label {
        font-size: 14px;
    }

    .up-novel-reader__settings-value,
    .up-novel-reader__settings-hint {
        color: var(--up-novel-reader-muted, #909399);
        font-size: 12px;
    }

    .up-novel-reader__theme-list {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        gap: 8px;
    }

    .up-novel-reader__theme-option {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 54px;
        height: 34px;
        padding: 0 10px;
        border: 1px solid transparent;
        border-radius: 17px;
        font-size: 12px;
    }

    .up-novel-reader__theme-option.is-active {
        border-color: #2979ff;
        box-shadow: 0 0 0 2px rgba(41, 121, 255, 0.16);
    }

    .up-novel-reader__settings-option {
        padding: 10px 0;
    }

    .up-novel-reader__settings-hint {
        display: block;
        margin-top: 3px;
    }

    .up-novel-reader__settings-footer {
        padding: 10px 0 18px;
    }

    .up-novel-reader__settings-done {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 42px;
        border-radius: 21px;
        color: #ffffff;
        background-color: #2979ff;
        font-size: 14px;
    }
</style>
