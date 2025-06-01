<template>
	<view class="u-qrcode" @longpress="longpress">
		<view class="u-qrcode__content" @click="preview">
			<!-- #ifndef APP-NVUE -->
			<canvas
                class="u-qrcode__canvas"
				:id="cid"
                :canvas-id="cid"
                type="2d"
                :style="{ width: size + unit, height: size + unit }" />
			<!-- #endif -->
			<!-- #ifdef APP-NVUE -->
			<gcanvas class="u-qrcode__canvas" ref="gcanvess"
				:style="{ width: size + unit, height: size + unit }">
			</gcanvas>
			<!-- #endif -->
			<view v-if="showLoading && loading" class="u-qrcode__loading"
				:style="{ width: size + unit, height: size + unit }">
				<up-loading-icon vertical :text="loadingText" textSize="14px"></up-loading-icon>
			</view>
		</view>

	</view>
</template>

<script>
import QRCode from "./qrcode.js"
// #ifdef APP-NVUE
// https://github.com/dcloudio/NvueCanvasDemo/blob/master/README.md
import {
	enable,
	WeexBridge
} from '../../libs/util/gcanvas/index.js';
// #endif
let qrcode
export default {
	name: "u-qrcode",
	props: {
		cid: {
			type: String,
			default: 'u-qrcode-canvas' + Math.random().toString()
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
	},
	emits: ['result', 'longpress'],
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
			ganvas: null,
			context: '',
			canvasObj: {}
		}
	},
    mounted(){
		// #ifdef APP-NVUE
		/*获取元素引用*/
		this.ganvas = this.$refs["gcanvess"]
		/*通过元素引用获取canvas对象*/
		this.canvasObj = enable(this.ganvas, {
			bridge: WeexBridge
		})
		/*获取绘图所需的上下文，目前不支持3d*/
		this.context = this.canvasObj.getContext('2d')
		// #endif

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
		_makeCode() {
			let that = this
			if (!this._empty(this.val)) {
				// #ifndef APP-NVUE
				this.loading = true
				// #endif
				qrcode = new QRCode({
					context: that, // 上下文环境
					canvasId: that.cid, // canvas-id
					nvueContext: that.context,
					usingComponents: that.usingComponents, // 是否是自定义组件
					showLoading: false, // 是否显示loading
					loadingText: that.loadingText, // loading文字
					text: that.val, // 生成内容
					size: that.size, // 二维码大小
					background: that.background, // 背景色
					foreground: that.foreground, // 前景色
					pdground: that.pdground, // 定位角点颜色
					correctLevel: that.lv, // 容错级别
					image: that.icon, // 二维码图标
					imageSize: that.iconSize,// 二维码图标大小
                    that,
					cbResult: function (res) { // 生成二维码的回调
						that._result(res)
					},
				});
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
		longpress() {
			this.$emit('longpress', this.result)
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
