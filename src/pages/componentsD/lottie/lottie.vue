<template>
    <view class="u-page">
        <view class="u-page__item">
            <text class="u-page__item__title">Lottie 动画</text>
            <view class="u-page__item__content">
                <view
                    class="lottie-stage"
                    :style="{ width: stageSize + 'px', height: stageSize + 'px' }"
                >
                    <up-lottie
                        ref="lottieRef"
                        class="lottie-stage__canvas"
                        :animation-data="animationData"
                        :content-model="contentModel"
                        :loop="loop"
                        @statechange="onStateChange"
                    />
                </view>

                <view class="lottie-group">
                    <text class="lottie-group__title">填充模式</text>
                    <view class="lottie-group__actions">
                        <up-button
                            v-for="model in contentModels"
                            :key="model"
                            size="small"
                            :type="contentModel === model ? 'primary' : 'info'"
                            :plain="contentModel !== model"
                            :text="model"
                            @click="changeContentModel(model)"
                        ></up-button>
                    </view>
                </view>

                <view class="lottie-group">
                    <text class="lottie-group__title">播放控制</text>
                    <view class="lottie-group__actions">
                        <up-button size="small" type="primary" text="播放" @click="play"></up-button>
                        <up-button size="small" text="暂停" @click="pause"></up-button>
                        <up-button size="small" text="恢复" @click="resume"></up-button>
                        <up-button size="small" type="error" text="取消" @click="cancel"></up-button>
                        <up-button
                            size="small"
                            :type="loop ? 'success' : 'info'"
                            :text="loop ? '循环：开' : '循环：关'"
                            @click="toggleLoop"
                        ></up-button>
                    </view>
                </view>

                <view class="lottie-group">
                    <text class="lottie-group__title">舞台尺寸</text>
                    <view class="lottie-group__actions">
                        <up-button
                            v-for="size in stageSizes"
                            :key="size"
                            size="small"
                            :type="stageSize === size ? 'primary' : 'info'"
                            :plain="stageSize !== size"
                            :text="size + 'px'"
                            @click="stageSize = size"
                        ></up-button>
                    </view>
                </view>

                <view class="lottie-group">
                    <text class="lottie-group__title">状态日志</text>
                    <view class="lottie-log">
                        <text
                            v-for="(item, index) in stateLog"
                            :key="index"
                            class="lottie-log__item"
                        >{{ item }}</text>
                        <text v-if="stateLog.length === 0" class="lottie-log__empty">暂无状态</text>
                    </view>
                </view>

                <text class="lottie-note">
                    H5 / App-Vue 使用 SVG 渲染；微信小程序与鸿蒙使用 canvas 渲染，同一页面仅支持一个实例。
                    网络加载示例：&lt;up-lottie file-path="https://example.com/anim.json" /&gt;，
                    小程序需配置合法域名，H5 需服务端允许 CORS。
                </text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import loadingData from '@/static/lottie/loading.json'

const lottieRef = ref(null)
const animationData = loadingData
const contentModels = ['ScaleToFill', 'AspectFill', 'Center']
const contentModel = ref('AspectFill')
const stageSizes = [200, 300, 360]
const stageSize = ref(300)
const loop = ref(true)
const stateLog = ref([])

function onStateChange(event) {
    const detail = event && event.detail ? event.detail : event
    if (!detail || !detail.type) return
    const time = new Date().toLocaleTimeString()
    const message = detail.message ? ` - ${detail.message}` : ''
    stateLog.value.unshift(`${time}  ${detail.type}${message}`)
    if (stateLog.value.length > 6) {
        stateLog.value.pop()
    }
}

function changeContentModel(model) {
    contentModel.value = model
}

function play() {
    if (lottieRef.value) lottieRef.value.playAnimation()
}

function pause() {
    if (lottieRef.value) lottieRef.value.pauseAnimation()
}

function resume() {
    if (lottieRef.value) lottieRef.value.resumeAnimation()
}

function cancel() {
    if (lottieRef.value) lottieRef.value.cancelAnimation()
}

function toggleLoop() {
    loop.value = !loop.value
}
</script>

<style lang="scss" scoped>
.lottie-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    overflow: hidden;
    border: 1px dashed #dcdfe6;
    background-color: #f8f8f8;
    transition: width 0.2s, height 0.2s;
}

.lottie-stage__canvas {
    width: 100%;
    height: 100%;
}

.lottie-group {
    margin-top: 20px;
}

.lottie-group__title {
    display: block;
    margin-bottom: 10px;
    font-size: 14px;
    color: #303133;
}

.lottie-group__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.lottie-log {
    min-height: 120px;
    padding: 12px;
    border-radius: 8px;
    background-color: #f5f6f7;
}

.lottie-log__item {
    display: block;
    padding: 2px 0;
    font-size: 12px;
    color: #606266;
}

.lottie-log__empty {
    font-size: 12px;
    color: #909399;
}

.lottie-note {
    display: block;
    margin-top: 20px;
    font-size: 12px;
    line-height: 1.6;
    color: #909399;
}
</style>
