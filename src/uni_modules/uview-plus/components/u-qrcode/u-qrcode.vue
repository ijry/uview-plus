<template>
    <view class="u-qrcode"
          :id="rootId"
          :style="{
              width: useRootHeightAndWidth ? '100%' : 'auto',
              height: useRootHeightAndWidth ? '100%' : 'auto',
        }"
          @longpress="longpress">
        <view
            class="u-qrcode__content"
            :style="{ width: sizeLocal + unit, height: sizeLocal + unit }"
            @click="preview">
            <!-- #ifdef APP-NVUE -->
            <up-canvas
                ref="qrcodeCanvas"
                class="u-qrcode__canvas"
                :canvas-id="cid"
                :width="sizeLocal"
                :height="sizeLocal"
                :unit="unit"
                bg-color="transparent"
                :style="{ width: sizeLocal + unit, height: sizeLocal + unit }" />
            <!-- #endif -->
            <!-- #ifndef APP-NVUE -->
            <up-canvas
                ref="qrcodeCanvas"
                class="u-qrcode__canvas"
                :canvas-id="cid"
                :width="sizeLocal"
                :height="sizeLocal"
                :unit="unit"
                bg-color="transparent"
                :style="{ width: sizeLocal + unit, height: sizeLocal + unit }" />
            <!-- #endif -->
            <view v-if="showLoading && loading" class="u-qrcode__loading"
                  :style="{ width: sizeLocal + unit, height: sizeLocal + unit }">
                <up-loading-icon vertical :text="loadingText" textSize="14px"></up-loading-icon>
            </view>
        </view>

    </view>
</template>

<script>
import QRCode from "./qrcode.js"
export default {
    name: "u-qrcode",
    props: {
        cid: {
            type: String,
            default: () => {
				return `u-qrcode-canvas${Math.floor(Math.random() * 1000000)}`
			}
        },
        size: {
            type: Number,
            default: 200
        },
        unit: {
            type: String,
            default: 'px'
        },
        show: {
            type: Boolean,
            default: true
        },
        val: {
            type: String,
            default: ''
        },
        background: {
            type: String,
            default: '#ffffff'
        },
        foreground: {
            type: String,
            default: '#000000'
        },
        pdground: {
            type: String,
            default: '#000000'
        },
        icon: {
            type: String,
            default: ''
        },
        iconSize: {
            type: Number,
            default: 40
        },
        lv: {
            type: Number,
            default: 3
        },
        quietZone: {
            type: Number,
            default: 0
        },
        onval: {
            type: Boolean,
            default: true
        },
        loadMake: {
            type: Boolean,
            default: true
        },
        usingComponents: {
            type: Boolean,
            default: true
        },
        showLoading: {
            type: Boolean,
            default: true
        },
        loadingText: {
            type: String,
            default: '生成中'
        },
        allowPreview: {
            type: Boolean,
            default: false
        },
        // 是否使用根节点宽高
        useRootHeightAndWidth: {
            type: Boolean,
            default: () => false
        },
    },
    emits: ['preview', 'result', 'longpressCallback'],
    data() {
        return {
            loading: false,
            result: '',
            popupShow: false,
            list: [
                {
                    name: '保存二维码',
                }
            ],
            rootId: `rootId${Number(Math.random() * 100).toFixed(0)}`,
            canvasObj: {},
            sizeLocal: this.size,
            ctx: null,
            isNvue: false,
            canvasHost: null
        }
    },
    created() {
        this._qrcode = null
    },
    async mounted(){
        // 如果使用根节点的宽高 则 重新设置 size
        if(this.useRootHeightAndWidth){
            await this.setNewSize()
        }
        // #ifdef APP-NVUE
		this.isNvue = true
		// #endif
		await this.initCanvas()

        if (this.loadMake) {
            if (!this._empty(this.val)) {
                setTimeout(() => {
                    setTimeout(()=>{
                        this._makeCode().catch(error => {
                            console.error('二维码生成失败', error)
                        })
                    })
                }, 0);
            }
        }
    },
    methods: {
        async _makeCode() {
            let that = this
			if (this._empty(this.val)) {
                uni.showToast({
                    title: '二维码内容不能为空',
                    icon: 'none',
                    duration: 2000
                });
                return ''
            }
			if (!this.ctx) {
                await this.initCanvas(true)
            }
			if (!this.ctx) throw new Error('无法获取二维码画布实例')
            return new Promise((resolve, reject) => {
                this.loading = true
                try {
                    this._qrcode = new QRCode({
                        vuectx: that, // 上下文环境
                        canvasId: that.cid, // canvas-id
                        ctx: that.ctx,
                        canvasHost: that.canvasHost,
                        isNvue: that.isNvue,
                        usingComponents: that.usingComponents, // 是否是自定义组件
                        showLoading: false, // 是否显示loading
                        loadingText: that.loadingText, // loading文字
                        text: that.val, // 生成内容
                        size: that.sizeLocal, // 二维码大小
                        width: that.sizeLocal,
                        height: that.sizeLocal,
                        background: that.background, // 背景色
                        foreground: that.foreground, // 前景色
                        pdground: that.pdground, // 定位角点颜色
                        quietZone: that.quietZone, // 静区宽度
                        correctLevel: that.lv, // 容错级别
                        image: that.icon, // 二维码图标
                        imageSize: that.iconSize,// 二维码图标大小
                        cbResult: function (res) { // 生成二维码的回调
                            if (typeof res === 'string') {
                                that._result(res)
                                resolve(res)
                            } else {
                                that.loading = false
                                reject(res instanceof Error ? res : new Error(`二维码生成失败: ${JSON.stringify(res)}`))
                            }
                        },
                    });
                } catch (error) {
                    that.loading = false
                    reject(error)
                }
            })
        },
        _clearCode() {
            this._result('')
            if (this._qrcode) this._qrcode.clear()
        },
        _saveCode() {
            let that = this;
            if (this.result != "") {
                uni.saveImageToPhotosAlbum({
                    filePath: that.result,
                    success: function () {
                        uni.showToast({
                            title: '二维码保存成功',
                            icon: 'success',
                            duration: 2000
                        });
                    }
                });
            } else {
				this.toTempFilePath({
				    success: res => {
						that.result = res.tempFilePath
						uni.saveImageToPhotosAlbum({
						    filePath: that.result,
						    success: function () {
						        uni.showToast({
						            title: '二维码保存成功',
						            icon: 'success',
						            duration: 2000
						        });
						    }
						});
				    },
				    fail: err => {
				    }
				})
			}
        },
        preview(e) {
            // 预览图片
            // console.log(this.result)
            if (this.allowPreview) {
                uni.previewImage({
                    urls: [this.result],
                    longPressActions: {
                        itemList: ['保存二维码图片'],
                        success: function(data) {
                            // console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
                            switch (data.tapIndex) {
                                case 0:
                                    that._saveCode();
                                    break;
                            }
                        },
                        fail: function(err) {
                            console.log(err.errMsg);
                        }
                    }
                });
            }
            this.$emit('preview', {
                url: this.result
            }, e)
        },
        async toTempFilePath({success, fail} = {}) {
            try {
                if (!this.canvasHost) {
                    await this.initCanvas(true)
                }
                if (!this.canvasHost) {
                    throw new Error('无法获取二维码画布实例')
                }
                const res = await this.canvasHost.toTempFilePath({
                    width: this.sizeLocal,
                    height: this.sizeLocal
                })
                if (success) success(res)
                return res
            } catch (error) {
                if (fail) {
                    fail(error)
                    return false
                }
                throw error
            }
        },
        async longpress() {
            this.toTempFilePath({
                success: res => {
                    this.$emit('longpressCallback', res.tempFilePath)
                },
                fail: err => {
                }
            })
        },

        /**
         * 使用根节点宽高 设置新的size
         * @return {Promise<void>}
         */
        async setNewSize(){
            const rootNode = await this.getRootNode();
            if (!rootNode) return
            const { width , height } = rootNode;
            // 将最短的设置为二维码 的size
            if(width > height){
                this.sizeLocal = height
            }
            else{
                this.sizeLocal = width
            }
        },

        async getRootNode() {
            return new Promise((resolve, reject) => {
                try {
                    const query = uni.createSelectorQuery().in(this).select(`#${this.rootId}`);
                    query.fields({
                            size: true
                        })
                        .exec((res) => {
                            resolve(res[0] || false)
                        })
                } catch (e) {
                    console.error("获取二维码根节点失败", e)
                    resolve(false)
                }
            })
        },
        async initCanvas(force = false) {
            await this.$nextTick()
            const canvasRef = this.$refs.qrcodeCanvas
            if (!canvasRef) return false
            const initialized = await canvasRef.initCanvas(force)
            if (!initialized) {
                this.canvasHost = null
                this.ctx = null
                return false
            }
            this.canvasHost = canvasRef
            this.ctx = canvasRef.getRawContext()
            return !!this.ctx
        },
        async refreshCanvas(force = false) {
            await this.$nextTick()
            return this.initCanvas(force)
        },
		getUPCanvasContext() {
            return this.canvasHost ? this.canvasHost.getRawContext() : null
		},
        async drawImage(url, x, y, w, h) {
            try {
                if (!this.canvasHost) {
                    const initialized = await this.initCanvas(true)
                    if (!initialized) {
                        throw new Error('无法初始化二维码画布')
                    }
                }
                if (!this.canvasHost || !this.ctx) {
                    throw new Error('无法获取二维码画布实例')
                }
                await this.canvasHost.drawImage(url, x, y, w, h)
            } catch (error) {
                console.error('drawImage绘制出错', error)
                throw error
			}
		},
        _queueMakeCode(delay = 0) {
            if (this._empty(this.val)) return
            setTimeout(() => {
                this._makeCode().catch(error => {
                    console.error('二维码生成失败', error)
                })
            }, delay)
        },

        selectClick(index) {
            switch (index) {
                case 0:
                    alert('保存二维码')
                    this._saveCode();
                    break;
            }
        },
        _result(res) {
            this.loading = false;
            this.result = res;
            this.$emit('result', res);
        },
        _empty(v) {
            let tp = typeof v,
                rt = false;
            if (tp == "number" && String(v) == "") {
                rt = true
            } else if (tp == "undefined") {
                rt = true
            } else if (tp == "object") {
                if (JSON.stringify(v) == "{}" || JSON.stringify(v) == "[]" || v == null) rt = true
            } else if (tp == "string") {
                if (v == "" || v == "undefined" || v == "null" || v == "{}" || v == "[]") rt = true
            } else if (tp == "function") {
                rt = false
            }
            return rt
        },
    },
    watch: {
        size: function (n, o) {
            if (n != o && !this._empty(n)) {
                this.sizeLocal = n
                if (this.onval) {
                    this._queueMakeCode(100)
                }
            }
        },
        val: function (n, o) {
            if (this.onval) {
                if (n != o && !this._empty(n)) {
                    this._queueMakeCode()
                }
            }
        },
        icon: function (n, o) {
            if (n === o) return
            this._queueMakeCode(100)
        },
        background: function () {
            this._queueMakeCode()
        },
        foreground: function () {
            this._queueMakeCode()
        },
        iconSize: function () {
            this._queueMakeCode()
        },
        quietZone: function () {
            this._queueMakeCode()
        },
        lv: function () {
            this._queueMakeCode()
        }
    },
    computed: {
    }
}
</script>
<style lang="scss" scoped>
.u-qrcode {
    &__loading {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f7f7f7;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    /* #ifdef MP-TOUTIAO */
    /**字节小程序在编译时会出现一个 [hidde]:{ display: none !important; } 这个样式
     * 会导致canvas 隐藏掉 没有找到具体原因先这样处理
     */
    &__canvas {
        display: block !important;
    }
    /* #endif */

    &__content {
        position: relative;

        &__canvas {
            position: fixed;
            top: -99999rpx;
            left: -99999rpx;
            z-index: -99999;
        }
    }
}
</style>
