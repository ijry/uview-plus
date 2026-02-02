<template>
    <view class="u-qrcode"
          :id="rootId"
          :style="{
              width: useRootHeightAndWidth ? '100%' : 'auto',
              height: useRootHeightAndWidth ? '100%' : 'auto',
          }"
          @longpress="longpress">
        <view class="u-qrcode__content" @click="preview">
            <!-- #ifdef MP || H5 -->
            <canvas
                class="u-qrcode__canvas"
                :id="cid"
                :canvas-id="cid"
                type="2d"
                :style="{ width: sizeLocal + unit, height: sizeLocal + unit }" />
            <!-- #endif -->

            <!-- #ifdef APP-PLUS -->
            <canvas
                class="u-qrcode__canvas"
                :id="cid"
                :canvas-id="cid"
                :style="{ width: sizeLocal + unit, height: sizeLocal + unit }" />
            <!-- #endif -->

            <!-- #ifdef APP-NVUE -->
			<web-view v-if="icon != ''" ref="web" src="/static/app-plus/up-canvas/local.html"
				:style="'width:' + sizeLocal + 'px;height:' + sizeLocal + 'px'"
				@onPostMessage="_onMessage" />
            <gcanvas v-else class="u-qrcode__canvas" ref="gcanvess"
                :style="{ width: sizeLocal + unit, height: sizeLocal + unit }">
            </gcanvas>
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
import { sleep } from '../../libs/function/index';
// #ifdef APP-NVUE
// https://github.com/dcloudio/NvueCanvasDemo/blob/master/README.md
import {
    enable,
    WeexBridge,
	Image as GImage
} from '../../libs/util/gcanvas/index.js';
import { nextTick } from "vue";
// #endif
let qrcode
// 20260201不能在data中存储canvas，否则会导致在微信小程序getContext获取不到canvas对象报错Cannot read property 'type'
let canvas = null
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
            ganvas: null,
            canvasObj: {},
            sizeLocal: this.size,
            ctx: null,
			_ready: false
        }
    },
    async mounted(){
        // 如果使用根节点的宽高 则 重新设置 size
        if(this.useRootHeightAndWidth){
            await this.setNewSize()
        }
		canvas = await this.getCanvasNode(this.cid)

		if (!canvas) return
		// #ifdef MP
		// 不清楚是小程序的bug还是什么原因，canvas的node节点宽高和设置的宽高不一致 重新设置下
		canvas.width = this.sizeLocal
		canvas.height = this.sizeLocal
		// #endif
        // #ifdef APP-PLUS-NVUE
		this.isNvue = true
		// #endif
		this.ctx = this.getUPCanvasContext('2d')

        if (this.loadMake) {
            if (!this._empty(this.val)) {
                setTimeout(() => {
                    setTimeout(()=>{
                        this._makeCode()
                    })
                }, 0);
            }
        }
    },
    methods: {
		_onMessage(e) {
			// console.log('post message', e)
			const message = e.detail.data[0]
			switch (message.action) {
				// web-view 初始化完毕
				case 'onJSBridgeReady':
					this._ready = true
					this.$refs.web.evalJs('setContent('+JSON.stringify(this.$props) +')')
					break
				// qrcodeOk
				case 'qrcodeOk':
					this._result(message.imageData)
					// this.$emit('load')
					break
			}
		},
        _makeCode() {
            let that = this
			if (!canvas) return
            if (!this._empty(this.val)) {
                // #ifndef APP-NVUE
                this.loading = true
				// #endif
				// nvue下时因为gcanvas的GImage不生效，因此icon模式会采用webview
				if ((this.icon == '' && that.isNvue) || !that.isNvue) {
					qrcode = new QRCode({
						vuectx: that, // 上下文环境
						canvasId: that.cid, // canvas-id
						ctx: that.ctx,
						isNvue: that.isNvue,
						usingComponents: that.usingComponents, // 是否是自定义组件
						showLoading: false, // 是否显示loading
						loadingText: that.loadingText, // loading文字
						text: that.val, // 生成内容
						size: that.sizeLocal, // 二维码大小
						background: that.background, // 背景色
						foreground: that.foreground, // 前景色
						pdground: that.pdground, // 定位角点颜色
						correctLevel: that.lv, // 容错级别
						image: that.icon, // 二维码图标
						imageSize: that.iconSize,// 二维码图标大小
						cbResult: function (res) { // 生成二维码的回调
							that._result(res)
						},
					});
				}
            } else {
                uni.showToast({
                    title: '二维码内容不能为空',
                    icon: 'none',
                    duration: 2000
                });
            }
        },
        _clearCode() {
            this._result('')
            qrcode.clear()
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
        async toTempFilePath({success, fail}) {
            if (this.ct) {
                this.ctx.toTempFilePath(
                    0,
                    0,
                    this.sizeLocal,
                    this.sizeLocal,
                    this.sizeLocal,
                    this.sizeLocal,
                    "",
                    1,
                    res => {
                        success(res)
                    }
                );
            }
            else {
                // #ifdef H5
                success({
                    tempFilePath: this.ctx.canvas.toDataURL("image/png", 1)
                })
                // #endif

                // #ifndef H5
                uni.canvasToTempFilePath(
                    {
                        canvasId: this.cid,
                        success :res => {
                            success(res)
                        },
                        fail: fail
                    },
                    this)
                // #endif
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
            const rootNode = await this.getCanvasNode(this.rootId, false);
            const { width , height } = rootNode;
            // 将最短的设置为二维码 的size
            if(width > height){
                this.sizeLocal = height
            }
            else{
                this.sizeLocal = width
            }
        },

        /**
         * 获取节点
         * @param id 节点id
         * @param isCanvas 是否为Canvas节点
         * @return {Promise<unknown>}
         */
        async getCanvasNode(id, isCanvas = true) {
			let that = this
        	return new Promise((resolve, reject) => {
        		try {
        			// #ifdef APP-NVUE
        			setTimeout(() => {
        				/*获取元素引用*/
        				this.ganvas = this.$refs["gcanvess"]
        				/*通过元素引用获取canvas对象*/
        				let canvasNode = enable(this.ganvas, {
        				    bridge: WeexBridge
        				})
        				resolve(canvasNode)
        			}, 200)
        			// #endif
        			// #ifndef APP-PLUS-NVUE
                    const query = uni.createSelectorQuery().in(that).select(`#${id}`);
                    query.fields({
                            node: true,
                            size: true
                        })
                        .exec((res) => {
                            if (isCanvas) {
                                if (res[0]?.node) {
                                    resolve(res[0].node)
                                } else {
                                    resolve(false)
                                    console.error("获取节点出错", res)
                                }
                            } else {
                                resolve(res[0])
                            }
                        })
        			// #endif
        		} catch (e) {
        			console.error("获取节点失败", e)
        		}
        	})
        },
		getUPCanvasContext() {
			// #ifdef APP-PLUS
			return uni.createCanvasContext(this.cid, this);
			// #endif
			// #ifdef APP-PLUS-NVUE || MP || H5
			return canvas.getContext('2d');
			// #endif
		},
		drawImage(url, x, y, w, h) {
			try {
				let img = {}
				// #ifdef APP-NVUE
				img = new GImage();
				// #endif
				
				// #ifdef H5
				// APP下不支持会一直卡住
				img = new Image();
				// #endif
				
				// #ifdef MP
				// 小程序2d
				// https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.createImage.html
				img = canvas.createImage();
				// #endif
				// #ifdef APP-NVUE
				let that = this
				// console.log(img)
				img.onload = function(){
					if (process.env.NODE_ENV === 'development') {
						console.log('drawImage绘制2...')
					}
					that.cxt.drawImage(img, x, y, w, h);
				}
				// #endif
				// #ifdef H5 || MP
				img.onload = () => {
					this.ctx.drawImage(img, x, y, w, h);
				};
				// #endif
				img.src = url;
				// #ifdef APP-VUE
				this.ctx.drawImage(url, x, y, w, h);
				// #endif
			} catch (error) {
				console.log('drawImage绘制出错', error)
			}
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
                this.cSize = n
                if (!this._empty(this.val)) {
                    setTimeout(() => {
                        this._makeCode()
                    }, 100);
                }
            }
        },
        val: function (n, o) {
            if (this.onval) {
                if (n != o && !this._empty(n)) {
                    setTimeout(() => {
                        this._makeCode()
                    }, 0);
                }
            }
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
