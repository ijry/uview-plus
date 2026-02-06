<template>
	<view class="u-signature">
		<view class="u-signature__canvas-wrap" :style="{background: bgColor}">
			<up-canvas 
				ref="signatureCanvas"
				:canvas-id="canvasId"
				:width="canvasWidth"
				:height="canvasHeight"
				:bg-color="bgColor"
				@touchstart="touchStart" 
				@touchmove="touchMove" 
				@touchend="touchEnd"
				:disable-scroll="true"
				class="u-signature__canvas"
				:style="{
					width: canvasWidth + 'px',
					height: canvasHeight + 'px',
				}">
			</up-canvas>
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
				lastPoint: null, // 保存上一个点的坐标
				canvasInstance: null // 缓存canvas实例
			}
		},
		mounted() {
			// 初始化时获取canvas实例
			this.$nextTick(() => {
				this.getCanvasInstance();
				this.clearCanvas();
			});
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
			
			// 获取签名画布实例
			getCanvasInstance() {
				if (this.canvasInstance) {
					return this.canvasInstance;
				}
				
				const canvasRef = this.$refs.signatureCanvas;
				if (canvasRef) {
					this.canvasInstance = canvasRef;
					return canvasRef;
				}
				return null;
			},
			
			touchStart(e) {
				if (!this.canvasInstance || !this.canvasInstance.ctx) {
					this.getCanvasInstance();
				}
				
				if (!this.canvasInstance || !this.canvasInstance.ctx) return;
				
				this.isDrawing = true;
				this.isEmpty = false;
				this.currentPath = [];
				
				const { x, y } = this.getCanvasPoint(e);
				
				// 设置线条样式
				this.canvasInstance.setLineStyle(this.lineColor, this.lineWidth);
				
				// 开始路径
				this.canvasInstance.beginPath();
				this.canvasInstance.moveTo(x, y);
				
				// 记录起始点
				this.currentPath.push({
					x,
					y,
					type: 'start',
					color: this.lineColor,
					width: this.lineWidth
				});
				
				// 保存上一个点
				this.lastPoint = { x, y };
				
				// 阻止默认事件以提高性能
				e.preventDefault();
			},
			
			touchMove(e) {
				if (!this.isDrawing || !this.canvasInstance || !this.canvasInstance.ctx) return;
				
				// 阻止默认事件以提高性能
				e.preventDefault();
				
				const { x, y } = this.getCanvasPoint(e);
				
				// 从上一个点画线到当前点
				this.canvasInstance.lineTo(x, y);
				this.canvasInstance.stroke(); // 实时绘制当前线段
				this.currentPath.push({
					x,
					y,
					type: 'move'
				});
				this.canvasInstance.draw(false);
				
				// 更新上一个点
				this.lastPoint = { x, y };
			},
			
			touchEnd(e) {
				if (!this.isDrawing || !this.canvasInstance || !this.canvasInstance.ctx) return;
				
				this.isDrawing = false;
				this.canvasInstance.closePath();
				this.lastPoint = null;
				
				// 将当前路径加入栈中用于回退
				if (this.currentPath.length > 0) {
					this.pathStack.push([...this.currentPath]);
				}
				
				// 最后统一执行一次绘制
				this.canvasInstance.draw(true);
			},
			
			// 同步获取canvas坐标点（兼容处理）
			getCanvasPoint(e) {
				// #ifdef MP-WEIXIN
				const touch = e.touches && e.touches[0] ? e.touches[0] : e.mp.touches[0];
				// #endif
				// #ifndef MP-WEIXIN
				const touch = e.touches[0];
				// #endif
				
				// 计算相对于canvas的坐标
				// 由于无法直接获取canvas位置，这里简化处理
				// 实际应用中可能需要通过uni.createSelectorQuery获取canvas位置
				return {
					x: touch.x,
					y: touch.y
				};
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
				if (!this.canvasInstance) {
					this.getCanvasInstance();
				}
				
				if (!this.canvasInstance) return;
				
				// 先清空画布
				this.canvasInstance.clearCanvas();
				
				if (this.pathStack.length === 0) {
					this.isEmpty = true;
					return;
				}
				
				this.isEmpty = false;
				
				// 逐个绘制路径
				this.pathStack.forEach(path => {
					if (path.length === 0) return;
					
					this.canvasInstance.beginPath();
					
					let lastPoint = null;
					path.forEach((point, index) => {
						if (index === 0 && point.type === 'start') {
							// 设置线条样式
							this.canvasInstance.setLineStyle(point.color, point.width);
							this.canvasInstance.moveTo(point.x, point.y);
							lastPoint = { x: point.x, y: point.y };
						} else if (point.type === 'move') {
							this.canvasInstance.lineTo(point.x, point.y);
							lastPoint = { x: point.x, y: point.y };
						}
					});
					this.canvasInstance.stroke();
					this.canvasInstance.draw(true);
				});
			},
			
			// 清空画布内容
			clearCanvas() {
				if (!this.canvasInstance) {
					this.getCanvasInstance();
				}
				
				if (!this.canvasInstance) return;
				
				this.canvasInstance.clearCanvas();
			},
			
			// 导出签名图片
			async exportSignature() {
				if (this.isEmpty) {
					console.warn('签名为空，无法导出');
					return;
				}
				
				if (!this.canvasInstance) {
					this.getCanvasInstance();
				}
				
				if (!this.canvasInstance) {
					console.error('无法获取画布实例');
					return;
				}
				
				try {
					// 先重绘整个签名内容
					this.redraw();
					
					// 导出图片
					const imagePath = await this.canvasInstance.exportImage('png', 1);
					this.$emit('confirm', imagePath);
				} catch (error) {
					console.error('导出签名图片失败:', error);
					this.$emit('error', error);
				}
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