<template>
	<view class="u-signature">
		<view class="u-signature__canvas-wrap">
			<!-- #ifdef MP || H5 -->
			<canvas class="u-signature__canvas" :id="canvasId" :canvas-id="canvasId" type="2d" :disable-scroll="true"
				@touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{
					width: canvasWidth + 'px',
					height: canvasHeight + 'px',
					background: bgColor
				}"></canvas>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<canvas class="u-signature__canvas" :id="canvasId" :canvas-id="canvasId" :disable-scroll="true"
				@touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{
					width: canvasWidth + 'px',
					height: canvasHeight + 'px',
					background: bgColor
				}"></canvas>
			<!-- #endif -->
		</view>
		
		<view v-if="showToolbar" class="u-signature__toolbar">
			<view class="u-signature__toolbar-icons u-flex u-flex-x">
				<view class="u-signature__toolbar-icon" @click="undo">
					<up-icon name="arrow-left" size="22" :color="pathStack.length === 0 ? '#ccc' : '#999'"></up-icon>
				</view>
				<view class="u-signature__toolbar-icon" @click="clear">
					<up-icon name="trash" size="25" color="#999"></up-icon>
				</view>
				<view class="u-signature__toolbar-icon" @click="toggleBrushSettings">
					<up-icon name="edit-pen" size="25" color="#999"></up-icon>
				</view>
				<view class="u-signature__toolbar-icon" @click="toggleColorSettings">
					<up-icon name="grid" size="24" color="#999"></up-icon>
				</view>
				<view class="u-signature__toolbar-icon" @click="exportSignature">
					<up-icon name="checkmark" size="25" :color="isEmpty ? '#ccc' : '#999'"></up-icon>
				</view>
			</view>
			
			<!-- 笔画设置 -->
			<view v-if="showBrushSettings" class="u-signature__brush-settings">
				<view class="u-signature__progress">
					<text class="u-signature__progress-label">{{ t("up.signature.penSize") }}:</text>
					<up-slider 
						v-model="lineWidth" 
						:min="1" 
						:max="20" 
						:step="1"
						@show-value="true"
						:value-show="(lineWidth)"
					></up-slider>
				</view>
			</view>
			
			<!-- 颜色设置 -->
			<view v-if="showColorSettings" class="u-signature__color-settings">
				<view class="u-signature__color-picker">
                    <text class="u-signature__color-label">{{ t("up.signature.penColor") }}:</text>
					<view class="u-signature__colors">
						<view 
							v-for="(color, index) in presetColors" 
							:key="index"
							class="u-signature__color-item"
							:class="{'u-signature__color-item--active': lineColor === color}"
							:style="{ backgroundColor: color }"
							@click="selectColor(color)"
						></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { t } from '../../libs/i18n'
	let canvas = null
	export default {
		name: 'u-signature',
		props: {
			// 画布宽度
			width: {
				type: [String, Number],
				default: 300
			},
			// 画布高度
			height: {
				type: [String, Number],
				default: 200
			},
			// 背景颜色
			bgColor: {
				type: String,
				default: '#ffffff'
			},
			// 默认笔画颜色
			color: {
				type: String,
				default: '#000000'
			},
			// 默认笔画粗细
			thickness: {
				type: [String, Number],
				default: 3
			},
			// 是否显示工具栏
			showToolbar: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				canvasId: 'u-signature-' + Math.random().toString(36).substr(2, 9),
				canvasWidth: 300,
				canvasHeight: 200,
				lineColor: '#000000',
				lineWidth: 3,
				isDrawing: false,
				pathStack: [], // 存储绘制路径用于回退
				currentPath: [], // 当前绘制路径
				ctx: null,
				isEmpty: true,
				presetColors: [
					'#000000', // 黑色
					'#ff0000', // 红色
					'#00ff00', // 绿色
					'#0000ff', // 蓝色
					'#ffff00', // 黄色
					'#00ffff', // 青色
					'#ff00ff', // 紫色
					'#ffffff'  // 白色
				],
				showBrushSettings: false,
				showColorSettings: false,
				lastPoint: null // 保存上一个点的坐标
			}
		},
		mounted() {
			this.initCanvas()
		},
		watch: {
			width: {
				handler(newVal) {
					this.canvasWidth = Number(newVal)
				},
				immediate: true
			},
			height: {
				handler(newVal) {
					this.canvasHeight = Number(newVal)
				},
				immediate: true
			},
			color: {
				handler(newVal) {
					this.lineColor = newVal
				},
				immediate: true
			},
			thickness: {
				handler(newVal) {
					this.lineWidth = Number(newVal)
				},
				immediate: true
			}
		},
		methods: {
			t,
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
				return uni.createCanvasContext(this.canvasId, this);
				// #endif
				// #ifdef APP-PLUS-NVUE || MP || H5
				return canvas.getContext('2d');
				// #endif
			},
			async initCanvas() {
				canvas = await this.getCanvasNode(this.canvasId)
				this.ctx = this.getUPCanvasContext('2d')
				
				// #ifdef MP-WEIXIN
				// 在微信小程序中，为了提高清晰度，需要考虑设备像素比
				const dpr = uni.getSystemInfoSync().pixelRatio
				if(canvas){
					// 设置canvas实际绘制尺寸为显示尺寸的dpr倍
					canvas.width = this.canvasWidth * dpr
					canvas.height = this.canvasHeight * dpr
					// 缩放上下文以匹配设备像素比
					this.ctx.scale(dpr, dpr)
				}
				// #endif
			},
			
			touchStart(e) {
				if (!this.ctx) return
				
				this.isDrawing = true
				this.isEmpty = false
				this.currentPath = []
				
				const { x, y } = this.getCanvasPoint(e)
				this.ctx.beginPath()
				this.ctx.moveTo(x, y)
				
				// #ifndef APP-PLUS-NVUE
				// 对于非nvue环境，尝试使用setLineCap/setLineJoin等方法
				if (this.ctx.setLineCap) {
					this.ctx.setLineCap('round')
				} else {
					this.ctx.lineCap = 'round'
				}
				if (this.ctx.setLineJoin) {
					this.ctx.setLineJoin('round')
				} else {
					this.ctx.lineJoin = 'round'
				}
				if (this.ctx.setStrokeStyle) {
					this.ctx.setStrokeStyle(this.lineColor)
				} else {
					this.ctx.strokeStyle = this.lineColor
				}
				if (this.ctx.setLineWidth) {
					this.ctx.setLineWidth(this.lineWidth)
				} else {
					this.ctx.lineWidth = this.lineWidth
				}
				// #endif
				// #ifdef APP-PLUS-NVUE
				this.ctx.setLineCap('round')
				this.ctx.setLineJoin('round')
				this.ctx.setStrokeStyle(this.lineColor)
				this.ctx.setLineWidth(this.lineWidth)
				// #endif
				
				// 记录起始点
				this.currentPath.push({
					x,
					y,
					type: 'start',
					color: this.lineColor,
					width: this.lineWidth
				})
				
				// 保存上一个点
				this.lastPoint = { x, y }
				
				// 阻止默认事件以提高性能
				e.preventDefault()
			},
			
			touchMove(e) {
				if (!this.isDrawing || !this.ctx) return
				
				// 阻止默认事件以提高性能
				e.preventDefault()
				
				const { x, y } = this.getCanvasPoint(e)
				
				// 从上一个点画线到当前点
				this.ctx.lineTo(x, y)
				this.ctx.stroke() // 实时绘制当前线段
				this.currentPath.push({
					x,
					y,
					type: 'move'
				})
				
				// #ifndef MP-WEIXIN
				// 在非微信小程序平台使用draw方法刷新画布
				if (typeof this.ctx.draw === 'function') {
					this.ctx.draw(false) // 使用false参数优化性能，延迟绘制
				}
				// #endif
				// #ifdef MP-WEIXIN
				// 微信小程序中不使用draw方法，因为2D Canvas上下文没有draw方法
				// 直接通过stroke方法绘制，不需要额外调用draw
				// #endif
			},
			
			touchEnd(e) {
				if (!this.isDrawing || !this.ctx) return
				
				this.isDrawing = false
				this.ctx.closePath()
				this.lastPoint = null
				
				// 将当前路径加入栈中用于回退
				if (this.currentPath.length > 0) {
					this.pathStack.push([...this.currentPath])
				}
				
				// #ifndef MP-WEIXIN
				// 最后统一执行一次绘制，仅在非微信小程序平台
				if (typeof this.ctx.draw === 'function') {
					this.ctx.draw(true)
				}
				// #endif
			},
			
			// 同步获取canvas坐标点（兼容处理）
			getCanvasPoint(e) {
				const touch = e.touches[0]
				const canvas = uni.createSelectorQuery().in(this).select('.u-signature__canvas')
				
				// 返回一个包含坐标的对象
				return {
					x: touch.x,
					y: touch.y
				}
			},
			
			// 选择颜色
			selectColor(color) {
				this.lineColor = color
			},
			
			// 回退操作
			undo() {
				if (this.pathStack.length === 0) return
				
				// 弹出最后一个路径
				this.pathStack.pop()
				
				// 重新绘制
				this.redraw()
			},
			
			// 重新绘制所有路径
			redraw() {
				this.clearCanvas()
				
				if (this.pathStack.length === 0) {
					this.isEmpty = true
					return
				}
				
				this.isEmpty = false
				
				// #ifndef APP-NVUE
				this.pathStack.forEach(path => {
					if (path.length === 0) return
					
					this.ctx.beginPath()
					// #ifndef APP-PLUS-NVUE
					if (this.ctx.setLineCap) {
						this.ctx.setLineCap('round')
					} else {
						this.ctx.lineCap = 'round'
					}
					if (this.ctx.setLineJoin) {
						this.ctx.setLineJoin('round')
					} else {
						this.ctx.lineJoin = 'round'
					}
					// #endif
					// #ifdef APP-PLUS-NVUE
					this.ctx.setLineCap('round')
					this.ctx.setLineJoin('round')
					// #endif
					
					let lastPoint = null
					path.forEach((point, index) => {
						if (index === 0 && point.type === 'start') {
							// 设置起始点样式
							// #ifndef APP-PLUS-NVUE
							if (this.ctx.setStrokeStyle) {
								this.ctx.setStrokeStyle(point.color)
							} else {
								this.ctx.strokeStyle = point.color
							}
							if (this.ctx.setLineWidth) {
								this.ctx.setLineWidth(point.width)
							} else {
								this.ctx.lineWidth = this.lineWidth
							}
							// #endif
							// #ifdef APP-PLUS-NVUE
							this.ctx.setStrokeStyle(point.color)
							this.ctx.setLineWidth(point.width)
							// #endif
							
							this.ctx.moveTo(point.x, point.y)
							lastPoint = { x: point.x, y: point.y }
						} else if (point.type === 'move') {
							this.ctx.lineTo(point.x, point.y)
							lastPoint = { x: point.x, y: point.y }
						}
					})
					
					// #ifndef MP-WEIXIN
					this.ctx.stroke()
					this.ctx.draw(true)
					// #endif
					// #ifdef MP-WEIXIN
					// 微信小程序中只需stroke，不需要draw
					this.ctx.stroke()
					// #endif
				})
				// #endif
			},
			
			// 清空画布
			clear() {
				this.pathStack = []
				this.currentPath = []
				this.isEmpty = true
				this.lastPoint = null
				this.clearCanvas()
			},
			
			// 清空画布内容
			clearCanvas() {
				if (!this.ctx) return
				
				// #ifndef APP-NVUE
				// 清除矩形区域并填充背景色
				this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
				
				// 使用rect和fill方法替代setFillStyle，以提高兼容性
				this.ctx.beginPath()
				this.ctx.rect(0, 0, this.canvasWidth, this.canvasHeight)
				
				// #ifdef MP-WEIXIN
				// 微信小程序使用fillStyle属性替代setFillStyle方法
				this.ctx.fillStyle = this.bgColor
				this.ctx.fill()
				// 微信小程序中不调用draw方法，因为2D Canvas上下文没有draw方法
				// #endif
				// #ifndef MP-WEIXIN
				// 其他平台继续使用setFillStyle方法
				if (this.ctx.setFillStyle) {
					this.ctx.setFillStyle(this.bgColor)
				} else {
					this.ctx.fillStyle = this.bgColor
				}
				this.ctx.fill()
				
				// 在非微信小程序平台使用draw方法刷新画布
				if (typeof this.ctx.draw === 'function') {
					this.ctx.draw()
				}
				// #endif
				// #endif
			},
			
			// 导出签名图片
			exportSignature() {
				if (this.isEmpty) return
				
				// #ifdef MP-WEIXIN
				// 微信小程序中需要先完成绘制，然后导出图片
				// 由于2D Canvas的特性，需要等待绘制完成后再导出
				this.redraw(); // 先重绘整个签名内容
				// 使用 setTimeout 确保绘制完成后导出
				setTimeout(() => {
					uni.canvasToTempFilePath({
						x: 0,
						y: 0,
						width: this.canvasWidth,
						height: this.canvasHeight,
						destWidth: this.canvasWidth * 2, // 使用双倍尺寸以提高清晰度
						destHeight: this.canvasHeight * 2,
						canvas: canvas, // 画布标识，传入 canvas 组件实例 （canvas type="2d" 时使用该属性）。
						canvasId: this.canvasId,
						fileType: 'png',
						quality: 1,
						success: (res) => {
							this.$emit('confirm', res.tempFilePath)
						},
						fail: (err) => {
							console.error('导出签名图片失败:', err)
							this.$emit('error', err)
						}
					}, this)
				}, 50) // 等待50毫秒确保绘制完成
				// #endif
				
				// #ifndef MP-WEIXIN
				uni.canvasToTempFilePath({
					canvas: canvas,
					canvasId: this.canvasId,
					fileType: 'png',
					quality: 1,
					success: (res) => {
						this.$emit('confirm', res.tempFilePath)
					},
					fail: (err) => {
						this.$emit('error', err)
					}
				}, this)
				// #endif
				
				// #ifdef APP-NVUE
				// NVUE环境下可能需要特殊处理
				// #endif
			},
			
			// 切换笔画设置显示
			toggleBrushSettings() {
				this.showBrushSettings = !this.showBrushSettings;
				if (this.showBrushSettings) {
					this.showColorSettings = false;
				}
			},
			
			// 切换颜色设置显示
			toggleColorSettings() {
				this.showColorSettings = !this.showColorSettings;
				if (this.showColorSettings) {
					this.showBrushSettings = false;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.u-signature {
		display: flex;
		flex-direction: column;
		
		&__canvas-wrap {
			border: 1px solid #e0e0e0;
			border-radius: 4px;
			overflow: hidden;
		}
		
		&__canvas {
			width: 100%;
			height: 100%;
		}
		
		&__toolbar {
			margin-top: 5px;
            background-color: #fff;
		}
		
		&__toolbar-icons {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 1px 0;
			// border: 1px solid #e0e0e0;
			border-radius: 4px;
		}
		
		&__toolbar-icon {
			padding: 5px;
		}
		
		&__brush-settings,
		&__color-settings {
			margin-top: 15px;
			padding: 1px;
			// border: 1px solid #e0e0e0;
			border-radius: 4px;
		}
		
		&__progress {
			&-label {
				display: block;
				margin-bottom: 10px;
				font-size: 14px;
				color: #999;
			}
		}
		
		&__color-picker {
			margin-bottom: 10px;
		}
		
		&__color-label {
			display: block;
			margin-bottom: 10px;
			font-size: 14px;
			color: #999;
		}
		
		&__colors {
			display: flex;
            flex-direction: row;
			flex-wrap: wrap;
			gap: 10px;
		}
		
		&__color-item {
			width: 30px;
			height: 30px;
			border-radius: 50%;
			border: 2px solid #f0f0f0;
			cursor: pointer;
			
			&--active {
				border-color: #2979ff;
				transform: scale(1.1);
			}
		}
		
		&__actions {
			display: flex;
            flex-direction: row;
			gap: 10px;
			justify-content: center;
		}
	}
</style>