<template>
	<view class="u-signature">
		<view class="u-signature__canvas-wrap" :style="{background: resolvedBgColor}">
			<up-canvas 
				ref="signatureCanvas"
				:canvas-id="canvasId"
				:width="canvasWidth"
				:height="canvasHeight"
				:bg-color="resolvedBgColor"
				@touchstart="touchStart" 
				@touchmove="touchMove" 
				@touchend="touchEnd"
				@ready="onCanvasReady"
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
					<up-icon name="arrow-left" size="22" :color="pathStack.length === 0 ? iconDisabledColor : iconDefaultColor"></up-icon>
				</view>
				<view class="u-signature__toolbar-icon" @click="clear">
					<up-icon name="trash" size="25" :color="iconDefaultColor"></up-icon>
				</view>
				<view class="u-signature__toolbar-icon" @click="toggleBrushSettings">
					<up-icon name="edit-pen" size="25" :color="iconDefaultColor"></up-icon>
				</view>
				<view class="u-signature__toolbar-icon" @click="toggleColorSettings">
					<up-icon name="grid" size="24" :color="iconDefaultColor"></up-icon>
				</view>
				<view class="u-signature__toolbar-icon" @click="exportSignature">
					<up-icon name="checkmark" size="25" :color="isEmpty ? iconDisabledColor : iconDefaultColor"></up-icon>
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
	import { upGetRect } from '../../libs/function/index.js'
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
				lineColor: '',
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
			canvasInstance: null, // 缓存canvas实例
			canvasReady: false, // up-canvas 是否已完成初始化（APP/NVUE 需异步）
			canvasRect: { left: 0, top: 0 } // 画布在视口中的位置，用于坐标换算
		}
		},
		computed: {
			resolvedBgColor() {
				return this.bgColor === '#ffffff'
					? (this.upThemeIsDark ? '#1c1c1e' : '#ffffff')
					: this.bgColor
			},
			iconDefaultColor() {
				return this.upThemeVar('--up-content-color', '#999999')
			},
			iconDisabledColor() {
				return this.upThemeVar('--up-disabled-color', '#c8c9cc')
			}
		},
		mounted() {
			// 等待 up-canvas 完成初始化（APP / NVUE 画布上下文需异步就绪）
			this.$nextTick(() => {
				this.initCanvasInstance();
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
					this.lineColor = this.resolveStrokeColor(newVal)
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
			resolveStrokeColor(color) {
				if (color === '#000000') {
					return this.upThemeIsDark ? '#f5f5f5' : '#000000'
				}
				return color
			},
			
			// 获取签名画布实例
		getCanvasInstance() {
			if (this.canvasInstance) {
				return this.canvasInstance;
			}
			
			const canvasRef = this.$refs.signatureCanvas;
			if (canvasRef) {
				this.canvasInstance = canvasRef;
				// 实例已就绪则同步标记，避免首笔被 touchStart 拦截
				if (canvasRef.ctx) {
					this.canvasReady = true;
				}
				return canvasRef;
			}
			return null;
		},

		// 主动等待 up-canvas 完成初始化（部分平台画布上下文为异步）
		async initCanvasInstance() {
			const ref = this.getCanvasInstance();
			if (!ref) return;
			if (typeof ref.initCanvas === 'function') {
				try {
					const ok = await ref.initCanvas(true);
					if (ok) {
						this.onCanvasReady();
						return;
					}
				} catch (e) {
					// 忽略，等待 @ready 兜底
				}
			}
			// 若 initCanvas 暂未就绪，up-canvas 的 @ready 事件会触发 onCanvasReady
		},

		// up-canvas 初始化完成回调（@ready 或 initCanvas 成功后触发）
		onCanvasReady() {
			if (this.canvasReady) return;
			this.canvasReady = true;
			this.getCanvasInstance();
			this.refreshCanvasRect();
			this.clearCanvas();
		},

		// 缓存画布在视口中的位置，用于将视口坐标换算为画布坐标
		refreshCanvasRect() {
			if (typeof upGetRect !== 'function') return;
			upGetRect('#' + this.canvasId, false, this)
				.then((rect) => {
					if (rect && (rect.left || rect.top || rect.width)) {
						this.canvasRect = {
							left: rect.left || 0,
							top: rect.top || 0
						};
					}
				})
				.catch(() => {});
		},
			
		touchStart(e) {
			if (!this.canvasReady || !this.canvasInstance || !this.canvasInstance.ctx) {
				// 画布尚未就绪：尝试初始化一次，待 @ready 后下一次触摸即可绘制
				this.getCanvasInstance();
				if (this.canvasInstance && typeof this.canvasInstance.initCanvas === 'function') {
					this.canvasInstance.initCanvas(true)
						.then(() => {
							this.canvasReady = true;
							this.refreshCanvasRect();
						})
						.catch(() => {});
				}
				return;
			}
			
			this.isDrawing = true;
			this.isEmpty = false;
			this.currentPath = [];
			
			const { x, y } = this.getCanvasPoint(e);
			
			// 设置线条样式（每次起笔确保样式生效，兼容旧版 canvas 的 draw 后状态重置）
			this.canvasInstance.setLineStyle(this.lineColor, this.lineWidth);
			
			// 仅记录起点，真正的绘制在 touchMove 中以“增量线段”方式完成
			this.lastPoint = { x, y };
			this.currentPath.push({
				x,
				y,
				type: 'start',
				color: this.lineColor,
				width: this.lineWidth
			});
			
			e.preventDefault();
		},
			
		touchMove(e) {
			if (!this.isDrawing || !this.canvasInstance || !this.canvasInstance.ctx) return;
			
			e.preventDefault();
			
			const { x, y } = this.getCanvasPoint(e);
			
			// 增量绘制：以上一个点为起点画到当前点。
			// 旧版 canvas（APP-PLUS）每次 draw 会刷新命令队列，必须以“单段”方式绘制；
			// 2D canvas 亦适用（draw 为 no-op，stroke 即时生效并保留已有像素）。
			this.canvasInstance.setLineStyle(this.lineColor, this.lineWidth);
			this.canvasInstance.beginPath();
			this.canvasInstance.moveTo(this.lastPoint.x, this.lastPoint.y);
			this.canvasInstance.lineTo(x, y);
			this.canvasInstance.stroke();
			this.canvasInstance.draw(true); // reserve：保留已绘制内容，避免笔迹闪退
			
			this.currentPath.push({
				x,
				y,
				type: 'move'
			});
			this.lastPoint = { x, y };
		},
		
		touchEnd(e) {
			if (!this.isDrawing || !this.canvasInstance || !this.canvasInstance.ctx) return;
			
			this.isDrawing = false;
			this.lastPoint = null;
			
			// 将当前路径加入栈中用于回退
			if (this.currentPath.length > 0) {
				this.pathStack.push([...this.currentPath]);
			}
			
			// 收尾绘制（保留已有内容）
			this.canvasInstance.draw(true);
		},
			
		// 同步获取canvas坐标点（兼容各平台）
		getCanvasPoint(e) {
			const touch =
				(e.touches && e.touches[0]) ||
				(e.changedTouches && e.changedTouches[0]) ||
				null;
			if (!touch) return { x: 0, y: 0 };

			// 2D canvas（MP/H5）与 NVUE webview 会在事件上直接挂载画布相对坐标
			if (typeof touch.x === 'number' && typeof touch.y === 'number') {
				return { x: touch.x, y: touch.y };
			}

			// 旧版 canvas（如 APP-PLUS）的 touch 仅提供视口坐标，需减去画布位置
			const rect = this.canvasRect || { left: 0, top: 0 };
			const clientX = touch.clientX !== undefined
				? touch.clientX
				: (touch.pageX !== undefined ? touch.pageX : 0);
			const clientY = touch.clientY !== undefined
				? touch.clientY
				: (touch.pageY !== undefined ? touch.pageY : 0);
			return {
				x: clientX - rect.left,
				y: clientY - rect.top
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

			// 对外暴露的清空方法（供工具栏与ref调用）
			clear() {
				this.pathStack = []
				this.currentPath = []
				this.lastPoint = null
				this.isDrawing = false
				this.isEmpty = true
				this.clearCanvas()
				this.$emit('clear')
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
			border: 1px solid var(--up-border-color, #e0e0e0);
			border-radius: 4px;
			overflow: hidden;
		}
		
		&__canvas {
			width: 100%;
			height: 100%;
		}
		
		&__toolbar {
			margin-top: 5px;
            background-color: var(--up-card-bg-color, #fff);
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
				color: var(--up-tips-color, #999);
			}
		}
		
		&__color-picker {
			margin-bottom: 10px;
		}
		
		&__color-label {
			display: block;
			margin-bottom: 10px;
			font-size: 14px;
			color: var(--up-tips-color, #999);
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
			border: 2px solid var(--up-border-color, #f0f0f0);
			cursor: pointer;
			
			&--active {
				border-color: var(--up-primary, #2979ff);
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
