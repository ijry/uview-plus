<template>
    <view class="u-canvas"
        :id="rootId"
        :style="{
            width: useRootHeightAndWidth ? '100%' : 'auto',
            height: useRootHeightAndWidth ? '100%' : 'auto',
        }">
        <!-- #ifdef MP || H5 -->
        <canvas
            class="u-canvas__canvas"
            :id="canvasId"
            :canvas-id="canvasId"
            type="2d"
            :style="{ width: width + unit, height: height + unit }"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"/>
        <!-- #endif -->

        <!-- #ifdef APP-PLUS -->
        <canvas
            class="u-canvas__canvas"
            :id="canvasId"
            :canvas-id="canvasId"
            :style="{ width: width + unit, height: height + unit }" 
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"/>
        <!-- #endif -->

        <!-- #ifdef APP-NVUE -->
        <gcanvas class="u-canvas__canvas" ref="gcanvess"
            :style="{ width: width + unit, height: height + unit }"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd">
        </gcanvas>
        <!-- #endif -->
    </view>
</template>

<script>
// #ifdef APP-NVUE
// https://github.com/dcloudio/NvueCanvasDemo/blob/master/README.md
import {
    enable,
    WeexBridge,
	Image as GImage
} from '../../libs/util/gcanvas/index.js';
// #endif
let canvasNode = null;
export default {
    name: "u-canvas",
    props: {
        canvasId: {
            type: String,
            default: () => {
				return `u-canvas${Math.floor(Math.random() * 1000000)}`
			}
        },
        width: {
            type: [String, Number],
            default: 300
        },
        height: {
            type: [String, Number],
            default: 300
        },
        unit: {
            type: String,
            default: 'px'
        },
        useRootHeightAndWidth: {
            type: Boolean,
            default: false
        },
        // 背景色
        bgColor: {
            type: String,
            default: '#ffffff'
        }
    },
    data() {
        return {
            rootId: `rootId${Number(Math.random() * 100).toFixed(0)}`,
            ganvas: null,
            canvasContext: null,
            widthLocal: this.width,
            heightLocal: this.height,
            ctx: null
        };
    },
    computed: {
        // 计算实际画布尺寸
        actualWidth() {
            return this.useRootHeightAndWidth ? this.widthLocal : Number(this.width);
        },
        actualHeight() {
            return this.useRootHeightAndWidth ? this.heightLocal : Number(this.height);
        }
    },
    methods: {
        // 添加触摸事件处理方法
        onTouchStart(e) {
            this.$emit('touchstart', e);
        },
        onTouchMove(e) {
            this.$emit('touchmove', e);
        },
        onTouchEnd(e) {
            this.$emit('touchend', e);
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
		
        /**
         * 获取Canvas上下文
         */
        getCanvasContext() {
            // #ifdef APP-PLUS
            return uni.createCanvasContext(this.canvasId, this);
            // #endif
            // #ifdef APP-PLUS-NVUE || MP || H5
            return canvasNode.getContext('2d');
            // #endif
        },

        /**
         * 初始化Canvas
         */
        async initCanvas() {
            try {
                canvasNode = await this.getCanvasNode(this.canvasId);
                
                // #ifdef MP-WEIXIN
                // 在微信小程序中，为了提高清晰度，需要考虑设备像素比
                const dpr = uni.getSystemInfoSync().pixelRatio;
                if(canvasNode) {
                    // 设置canvas实际绘制尺寸为显示尺寸的dpr倍
                    canvasNode.width = this.actualWidth * dpr;
                    canvasNode.height = this.actualHeight * dpr;
                }
                // #endif
                
                this.ctx = this.getCanvasContext();
                
                // #ifdef MP-WEIXIN
                if(this.ctx) {
                    this.ctx.scale(dpr, dpr);
                }
                // #endif
                
                // 初始化背景，但不在微信小程序中调用draw
                this.clearCanvas();
            } catch (error) {
                console.error("初始化Canvas失败:", error);
            }
        },

        /**
         * 清空画布
         */
        clearCanvas() {
            if (!this.ctx) return;

            this.clearRect(0, 0, this.actualWidth, this.actualHeight);

            // 填充背景色
            this.beginPath();
            this.rect(0, 0, this.actualWidth, this.actualHeight);

            this.setFillStyle(this.bgColor);
            this.fill();
            
            this.draw();
        },
        rect(x, y, width, height) {
            if (!this.ctx) return;
            this.ctx.rect(x, y, width, height);
        },
        clearRect(x, y, width, height) {
            if (!this.ctx) return;
            this.ctx.clearRect(x, y, width, height);
        },
        fill() {
            if (!this.ctx) return;
            this.ctx.fill();
        },
        setFillStyle(color) {
            if (!this.ctx) return;

            // #ifndef APP-PLUS-NVUE
            if (this.ctx.setFillStyle) {
                this.ctx.setFillStyle(color);
            } else {
                this.ctx.fillStyle = color;
            }
            // #endif
            // #ifdef APP-PLUS-NVUE
            this.ctx.setFillStyle(color);
            // #endif
        },

        /**
         * 设置线条样式
         */
        setLineStyle(lineColor, lineWidth) {
            if (!this.ctx) return;
            this.setLineCap('round');
            this.setLineJoin('round');
            this.setStrokeStyle(lineColor);
            this.setLineWidth(lineWidth);
        },
        setLineCap(lineCap = 'round') {
            if (!this.ctx) return;
            if (this.ctx.setLineCap) {
                this.ctx.setLineCap(lineCap);
            } else {
                this.ctx.lineCap = lineCap;
            }
        },
        setLineJoin(lineJoin = 'round') {
            if (!this.ctx) return;
            if (this.ctx.setLineJoin) {
                this.ctx.setLineJoin(lineJoin);
            } else {
                this.ctx.lineJoin = lineJoin;
            }
        },
        setStrokeStyle(color) {
            if (!this.ctx) return;
            if (this.ctx.setStrokeStyle) {
                this.ctx.setStrokeStyle(color);
            } else {
                this.ctx.strokeStyle = color;
            }
        },
        setLineWidth(width) {
            if (!this.ctx) return;
            if (this.ctx.setLineWidth) {
                this.ctx.setLineWidth(width);
            } else {
                this.ctx.lineWidth = width;
            }
        },

        /**
         * 开始路径
         */
        beginPath() {
            if (!this.ctx) return;
            this.ctx.beginPath();
        },

        /**
         * 移动到某点
         */
        moveTo(x, y) {
            if (!this.ctx) return;
            this.ctx.moveTo(x, y);
        },

        /**
         * 画线到某点
         */
        lineTo(x, y) {
            if (!this.ctx) return;
            this.ctx.lineTo(x, y);
        },

        /**
         * 描边
         */
        stroke() {
            if (!this.ctx) return;
            this.ctx.stroke();
        },

        /**
         * 关闭路径
         */
        closePath() {
            if (!this.ctx) return;
            this.ctx.closePath();
        },

        /**
         * 绘制操作
         */
        draw(isLastDraw = false) {
            // #ifndef MP-WEIXIN
            if (this.ctx && typeof this.ctx.draw === 'function') {
                this.ctx.draw(isLastDraw);
            }
            // #endif
        },

        /**
         * 导出图片
         */
        exportImage(fileType = 'png', quality = 1) {
            return new Promise((resolve, reject) => {
                // #ifdef MP-WEIXIN
                // 微信小程序中需要先完成绘制，然后导出图片
                setTimeout(() => {
                    uni.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width: this.actualWidth,
                        height: this.actualHeight,
                        destWidth: this.actualWidth * 2, // 使用双倍尺寸以提高清晰度
                        destHeight: this.actualHeight * 2,
                        canvas: canvasNode, // 2d必须
                        canvasId: this.canvasId,
                        fileType: fileType,
                        quality: quality,
                        success: (res) => {
                            resolve(res.tempFilePath);
                        },
                        fail: (err) => {
                            console.error('导出图片失败:', err);
                            reject(err);
                        }
                    }, this);
                }, 50); // 等待50毫秒确保绘制完成
                // #endif

                // #ifndef MP-WEIXIN
                uni.canvasToTempFilePath({
                    canvas: canvasNode, // 2d必须
                    canvasId: this.canvasId,
                    fileType: fileType,
                    quality: quality,
                    success: (res) => {
                        resolve(res.tempFilePath);
                    },
                    fail: (err) => {
                        console.error('导出图片失败:', err);
                        reject(err);
                    }
                }, this);
                // #endif
            });
        },

        /**
         * 使用根节点宽高 设置新的size
         * @return {Promise<void>}
         */
        async setNewSize(){
            const rootNode = await this.getCanvasNode(this.rootId, false);
            const { width , height } = rootNode;
            this.widthLocal = height;
            this.heightLocal = width;
        }
    },
    
    async mounted() {
        // 如果使用根节点的宽高 则 重新设置 size
        if(this.useRootHeightAndWidth){
            await this.setNewSize();
        }
        
        // 初始化Canvas
        await this.initCanvas();
    }
};
</script>

<style lang="scss" scoped>
    .u-canvas {
        position: relative;
        overflow: hidden;
    }

    .u-canvas__canvas {
        display: block;
    }
</style>