<template>
	<view class="u-signature">
		<view class="u-signature__canvas-wrap">
			<canvas 
				class="u-signature__canvas" 
				:canvas-id="canvasId" 
				:disable-scroll="true"
				@touchstart="touchStart"
				@touchmove="touchMove"
				@touchend="touchEnd"
				:style="{
					width: canvasWidth + 'px',
					height: canvasHeight + 'px',
					background: bgColor
				}"
			></canvas>
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
			initCanvas() {
				// #ifndef APP-NVUE
				const ctx = uni.createCanvasContext(this.canvasId, this)
				this.ctx = ctx
				this.clearCanvas()
				// #endif
				
				// #ifdef APP-NVUE
				// NVUE环境下的处理
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
				this.ctx.setLineCap('round')
				this.ctx.setLineJoin('round')
				this.ctx.setStrokeStyle(this.lineColor)
				this.ctx.setLineWidth(this.lineWidth)
				
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
				
				// 使用更密集的点采样确保线条连贯性
				if (this.lastPoint) {
					// 计算两点间距离
					const distance = Math.sqrt(Math.pow(x - this.lastPoint.x, 2) + Math.pow(y - this.lastPoint.y, 2))
					// 根据距离确定插值点数量，确保点间距不超过1像素以获得更平滑的线条
					const steps = Math.max(1, Math.floor(distance / 1))
					
					// 在两点间插入插值点
					for (let i = 1; i <= steps; i++) {
						const t = i / steps
						const midX = this.lastPoint.x + (x - this.lastPoint.x) * t
						const midY = this.lastPoint.y + (y - this.lastPoint.y) * t
						
						this.ctx.lineTo(midX, midY)
						this.ctx.stroke()
						this.currentPath.push({
							x: midX,
							y: midY,
							type: 'move'
						})
					}
				} else {
					this.ctx.lineTo(x, y)
					this.ctx.stroke()
					this.currentPath.push({
						x,
						y,
						type: 'move'
					})
				}
				
				this.ctx.draw(true)
				
				// 更新上一个点
				this.lastPoint = { x, y }
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
					this.ctx.setLineCap('round')
					this.ctx.setLineJoin('round')
					
					let lastPoint = null
					path.forEach((point, index) => {
						if (index === 0 && point.type === 'start') {
							// 设置起始点样式
							this.ctx.setStrokeStyle(point.color)
							this.ctx.setLineWidth(point.width)
							this.ctx.moveTo(point.x, point.y)
							lastPoint = { x: point.x, y: point.y }
						} else if (point.type === 'move') {
							this.ctx.lineTo(point.x, point.y)
							lastPoint = { x: point.x, y: point.y }
						}
					})
					
					this.ctx.stroke()
					this.ctx.draw(true)
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
				this.ctx.setFillStyle(this.bgColor)
				this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
				this.ctx.draw()
				// #endif
			},
			
			// 导出签名图片
			exportSignature() {
				if (this.isEmpty) return
				
				// #ifndef APP-NVUE
				uni.canvasToTempFilePath({
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