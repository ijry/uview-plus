<template>
	<view class="u-charts-gauge">
		<canvas 
			:id="canvasId" 
			:canvas-id="canvasId" 
			:style="{width: canvasWidth + 'px', height: canvasHeight + 'px'}"
			@tap="tap"
		></canvas>
	</view>
</template>

<script>
	export default {
		name: "u-charts-gauge",
		props: {
			// 图表宽度
			width: {
				type: [String, Number],
				default: 300
			},
			// 图表高度
			height: {
				type: [String, Number],
				default: 300
			},
			// 图表配置选项
			option: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				// 图表实例ID，多个图表同时存在时需指定不同的ID
				canvasId: 'chart-gauge' + Date.now(),
				canvasWidth: 300,
				canvasHeight: 300,
				progressValue: 0,
				// 添加动画相关数据
				animationTimer: null,
				targetValue: 0,
				// 添加一个标志位，标识是否已初始化
				isInited: false
			}
		},
		watch: {
			option: {
				handler(newVal) {
					// 使用uview-plus自己的实现方式更新图表
					this.updateChart(newVal);
				},
				deep: true
			}
		},
		mounted() {
			// #ifdef H5
			this.$nextTick(() => {
				this.init();
			});
			// #endif
			// #ifndef H5
			this.init();
			// #endif
		},
		methods: {
			init() {
				// 获取容器尺寸
				this.canvasWidth = Number(this.width);
				this.canvasHeight = Number(this.height);
				
				// 延迟确保DOM渲染完成
				setTimeout(() => {
					this.drawChart();
				}, 100);
			},
			
			drawChart() {
				const ctx = uni.createCanvasContext(this.canvasId, this);
				
				// 使用uview-plus自己的实现方式绘制仪表盘
				this.drawGauge(ctx);
			},
			
			// 角度360转弧度2PI的辅助函数
			angleToRadBase(angle) {
				if (angle >= 0) {
					let normalizedAngle = angle / 360 * 2;
					return  (2 - normalizedAngle) * Math.PI;
				} else {
					let normalizedAngle = Math.abs(angle / 360 * 2);
					return normalizedAngle * Math.PI;
				}
			},
			
			drawGauge(ctx) {
				const { width, height } = this;
				const centerX = width / 2;
				const centerY = height / 2;
				const series = this.option.series && this.option.series.length > 0 ? this.option.series[0] : {};
				const data = series.data && series.data.length > 0 ? series.data[0] : { value: 0 };
				// 修改: 只有在初始化后才使用动画值，否则使用真实值
				const value = (this.isInited && this.progressValue !== undefined) ? this.progressValue : (data.value || 0);
				
				// 获取配置参数，设置默认值
				const progress = series.progress || { show: false, width: 12 };
				const axisLine = series.axisLine || { lineStyle: { width: 12 } };
				const axisTick = series.axisTick || { show: true };
				const splitLine = series.splitLine || { length: 10, lineStyle: { width: 2, color: '#999' } };
				const axisLabel = series.axisLabel || { distance: 10, color: '#999', fontSize: 12 };
				const anchor = series.anchor || { show: false, size: 1, itemStyle: { borderWidth: 1 } };
				const detail = series.detail || { show: true, fontSize: 20, offsetCenter: [0, 0] };
				
				// 获取itemStyle配置
				const itemStyle = data.itemStyle || {};
				
				// 新增支持 startAngle 和 endAngle 参数
				const startAngle = series.startAngle !== undefined ? series.startAngle : 225;
				const endAngle = series.endAngle !== undefined ? series.endAngle : -45;
				
				// 支持 min 和 max 参数
				const min = series.min !== undefined ? series.min : 0;
				const max = series.max !== undefined ? series.max : 100;
				
				// 分别获取分割线和刻度线的splitNumber参数，默认值均为10
				const splitNumber = splitLine.splitNumber !== undefined ? splitLine.splitNumber : 10;
				const axisTickNumber = axisTick.splitNumber !== undefined ? axisTick.splitNumber : 5;
				
				// 使用新的角度转弧度函数
				let startRad = this.angleToRadBase(startAngle);
				// console.log('startRad', startRad)
				let endRad = this.angleToRadBase(endAngle);
				// console.log('endAngle', endRad)
				// 修复角度计算逻辑，确保按顺时针方向计算
				let totalAngle = endAngle - startAngle;
				if (totalAngle < 0) {
					totalAngle = Math.abs(totalAngle);
				}
				
				const radius = Math.min(width, height) / 2 * 0.8;
				const lineWidth = axisLine.lineStyle.width || 12;
				const progressWidth = progress.width || lineWidth;
				
				// 清空画布
				ctx.clearRect(0, 0, width, height);
				
				// 绘制背景圆环
				ctx.beginPath();
				ctx.arc(centerX, centerY, radius, startRad, endRad, false);
				// 支持axisLine.lineStyle.color为数组的情况
				const lineStyleColor = axisLine.lineStyle.color;
				if (Array.isArray(lineStyleColor) && lineStyleColor.length > 0) {
					// 如果是颜色数组，绘制渐变色圆环
					for (let i = 0; i < lineStyleColor.length; i++) {
						const [percent, color] = lineStyleColor[i];
						const startPercent = i === 0 ? 0 : lineStyleColor[i - 1][0];
						const segmentStartAngle = this.angleToRadBase(startAngle - startPercent * totalAngle);
						const segmentEndAngle = this.angleToRadBase(startAngle - percent * totalAngle);
						
						ctx.beginPath();
						ctx.arc(centerX, centerY, radius, segmentStartAngle, segmentEndAngle, false);
						ctx.setStrokeStyle(color);
						ctx.setLineWidth(lineWidth);
						ctx.setLineCap('butt');
						ctx.stroke();
					}
				} else {
					// 兼容原有的单色设置
					ctx.setStrokeStyle(lineStyleColor || '#E6EBF8');
					ctx.setLineWidth(lineWidth);
					ctx.setLineCap('butt');
					ctx.stroke();
				}
				
				// 绘制进度圆环
				if (progress.show !== false) {
					// 根据起始角度和总角度计算当前进度结束角度，考虑min和max值
					const progressPercent = (value - min) / (max - min);
					const clampedProgress = Math.max(0, Math.min(1, progressPercent)); // 限制在0-1之间
					const progressEndAngle = this.angleToRadBase(startAngle - clampedProgress * totalAngle);
					ctx.beginPath();
					ctx.arc(centerX, centerY, radius, startRad, progressEndAngle);
					// 支持itemStyle中的color设置进度颜色
					ctx.setStrokeStyle(itemStyle.color || (progress.lineStyle ? progress.lineStyle.color : '#007AFF'));
					// 支持阴影效果
					if (itemStyle.shadowColor) {
						ctx.setShadow(itemStyle.shadowOffsetX || 0, itemStyle.shadowOffsetY || 0, itemStyle.shadowBlur || 0, itemStyle.shadowColor);
					}
					ctx.setLineWidth(progressWidth);
					ctx.setLineCap('round');
					ctx.stroke();
					// 清除阴影效果
					if (itemStyle.shadowColor) {
						ctx.setShadow(0, 0, 0, 'rgba(0,0,0,0)');
					}
				}
				
				// 绘制刻度线
				if (axisTick.show !== false) {
					// 根据startAngle和endAngle计算刻度线位置，只在指定角度范围内绘制
					// 使用 axisTickNumber 参数控制刻度线数量
					// 刻度线应该画在每两个分割线中间
					for (let i = 0; i <= splitNumber; i++) {
						// 在每两个分割线之间绘制axisTickNumber个刻度线
						if (i < splitNumber) { // 不在最后一个分割线后绘制刻度线
							for (let j = 1; j <= axisTickNumber; j++) {
								// 计算每个刻度线的角度位置
								const angle = this.angleToRadBase(startAngle - (i + j / (axisTickNumber + 1)) / splitNumber * totalAngle);
								// 支持axisTick.distance属性，允许负值
								const axisTickDistance = axisTick.distance || 10;
								// 统一刻度线长度为5
								const tickLength = 5;
								const innerRadius = radius - tickLength - axisTickDistance;
								const outerRadius = radius - axisTickDistance;
								
								const startX = centerX + innerRadius * Math.cos(angle);
								const startY = centerY + innerRadius * Math.sin(angle);
								const endX = centerX + outerRadius * Math.cos(angle);
								const endY = centerY + outerRadius * Math.sin(angle);
								
								ctx.beginPath();
								ctx.moveTo(startX, startY);
								ctx.lineTo(endX, endY);
								ctx.setStrokeStyle(axisTick.lineStyle ? axisTick.lineStyle.color : '#999');
								ctx.setLineWidth(axisTick.lineStyle ? axisTick.lineStyle.width : 1);
								ctx.stroke();
							}
						}
					}
				}
				
				// 绘制分割线和标签
				if (splitLine.show !== false) {
					// 根据startAngle和endAngle计算分割线和标签位置
					// 使用 splitNumber 参数控制分割线数量
					for (let i = 0; i <= splitNumber; i++) {
						// 确保分割线按照从startAngle到endAngle的顺时针方向绘制
						const angle = this.angleToRadBase(startAngle - (i / splitNumber) * totalAngle);
						// 支持splitLine.distance属性，允许负值
						const splitLineDistance = splitLine.distance || 10;
						const innerRadius = radius - splitLine.length - splitLineDistance;
						const outerRadius = radius - splitLineDistance;
						
						const startX = centerX + innerRadius * Math.cos(angle);
						const startY = centerY + innerRadius * Math.sin(angle);
						const endX = centerX + outerRadius * Math.cos(angle);
						const endY = centerY + outerRadius * Math.sin(angle);
						
						ctx.beginPath();
						ctx.moveTo(startX, startY);
						ctx.lineTo(endX, endY);
						ctx.setStrokeStyle(splitLine.lineStyle ? splitLine.lineStyle.color : '#999');
						ctx.setLineWidth(splitLine.lineStyle ? splitLine.lineStyle.width : 2);
						ctx.stroke();
						
						// 绘制标签
						if (axisLabel.show !== false) {
							// 标签位置也考虑splitLine.distance的影响
							const labelDistance = axisLabel.distance || 10;
							const labelRadius = radius - splitLine.length - splitLineDistance - labelDistance;
							const labelX = centerX + labelRadius * Math.cos(angle);
							const labelY = centerY + labelRadius * Math.sin(angle);
							ctx.setFontSize(axisLabel.fontSize || 12);
							ctx.setFillStyle(axisLabel.color || '#999');
							ctx.setTextAlign('center');
							ctx.setTextBaseline('middle');
							// 根据min和max值计算实际显示的标签值
							const labelValue = min + (i / splitNumber) * (max - min);
							ctx.fillText(labelValue.toString(), labelX, labelY);
						}
					}
				}
				
				// 绘制指针
				// 修正指针角度计算，考虑min和max值
				const progressPercent = (value - min) / (max - min);
				const clampedProgress = Math.max(0, Math.min(1, progressPercent)); // 限制在0-1之间
				const pointerAngle = this.angleToRadBase(startAngle - clampedProgress * totalAngle);
				
				// 支持pointer的length和width参数，默认长度为圆的半径
				const pointer = series.pointer || {};
				const pointerLength = pointer.length !== undefined ? pointer.length : radius;
				// 将指针默认宽度从3增加到6，使其更粗一些
				const pointerWidth = pointer.width !== undefined ? pointer.width : 6;
				
				// 创建三角形指针样式，两端尖细，指向数据的一端更细长
				const pointerHeadLength = pointerLength * 0.7; // 指针前端长度占比
				const pointerTailLength = pointerLength * 0.3; // 指针尾端长度占比
				
				// 计算指针前端顶点坐标（细长部分）
				const pointerHeadX = centerX + pointerHeadLength * Math.cos(pointerAngle);
				const pointerHeadY = centerY + pointerHeadLength * Math.sin(pointerAngle);
				
				// 计算指针尾端顶点坐标（较粗部分）
				// 指针尾部应该在圆心
				const pointerTailX = centerX;
				const pointerTailY = centerY;
				
				// 计算垂直于指针方向的向量，用于构建三角形
				const perpAngle = pointerAngle + Math.PI / 2;
				const halfWidth = pointerWidth / 2;
				
				// 前端三角形的底边两个点
				const headBaseX1 = centerX + halfWidth * Math.cos(perpAngle);
				const headBaseY1 = centerY + halfWidth * Math.sin(perpAngle);
				const headBaseX2 = centerX - halfWidth * Math.cos(perpAngle);
				const headBaseY2 = centerY - halfWidth * Math.sin(perpAngle);
				
				// 尾端三角形的底边两个点（更宽）
				const tailWidth = pointerWidth * 1.5;
				const halfTailWidth = tailWidth / 2;
				const tailBaseX1 = centerX + halfTailWidth * Math.cos(perpAngle);
				const tailBaseY1 = centerY + halfTailWidth * Math.sin(perpAngle);
				const tailBaseX2 = centerX - halfTailWidth * Math.cos(perpAngle);
				const tailBaseY2 = centerY - halfTailWidth * Math.sin(perpAngle);
				
				// 绘制前端三角形（细长部分）
				ctx.beginPath();
				ctx.moveTo(pointerHeadX, pointerHeadY);
				ctx.lineTo(headBaseX1, headBaseY1);
				ctx.lineTo(headBaseX2, headBaseY2);
				ctx.closePath();
				ctx.setFillStyle(itemStyle.color || '#5572CA');
				if (itemStyle.shadowColor) {
					ctx.setShadow(itemStyle.shadowOffsetX || 0, itemStyle.shadowOffsetY || 0, itemStyle.shadowBlur || 0, itemStyle.shadowColor);
				}
				ctx.fill();
				
				// 绘制尾端三角形（较粗部分）
				ctx.beginPath();
				ctx.moveTo(pointerTailX, pointerTailY);
				ctx.lineTo(tailBaseX1, tailBaseY1);
				ctx.lineTo(tailBaseX2, tailBaseY2);
				ctx.closePath();
				ctx.setFillStyle(itemStyle.color || '#5572CA');
				ctx.fill();
				
				// 清除阴影效果
				if (itemStyle.shadowColor) {
					ctx.setShadow(0, 0, 0, 'rgba(0,0,0,0)');
				}
				
				// 绘制锚点
				if (anchor.show !== false) {
					ctx.beginPath();
					ctx.arc(centerX, centerY, anchor.size || 5, 0, 2 * Math.PI);
					ctx.setFillStyle(anchor.itemStyle ? (anchor.itemStyle.color || '#fff') : '#fff');
					ctx.fill();
					
					ctx.beginPath();
					ctx.arc(centerX, centerY, (anchor.size || 5) + (anchor.itemStyle.borderWidth || 2), 0, 2 * Math.PI);
					ctx.setFillStyle(anchor.itemStyle ? (anchor.itemStyle.borderColor || '#333') : '#333');
					ctx.fill();
				}
				
				// 绘制中心文本
				if (detail.show !== false) {
					// 使用实际值而不是百分比
					// 修改: 使用动画值
					let text = value.toString();
					if (detail.formatter) {
						text = detail.formatter.replace('{value}', Math.round(value));
					}
					// 修改: 更好地兼容 ECharts 的 offsetCenter 行为
					const offsetX = detail.offsetCenter && Array.isArray(detail.offsetCenter) && detail.offsetCenter.length > 0 ? detail.offsetCenter[0] : 0;
					const offsetY = detail.offsetCenter && Array.isArray(detail.offsetCenter) && detail.offsetCenter.length > 1 ? detail.offsetCenter[1] : 0;
					
					ctx.setFontSize(detail.fontSize || 30);
					ctx.setFillStyle(detail.color || '#333');
					ctx.setTextAlign('center');
					ctx.setTextBaseline('middle');
					ctx.fillText(text, centerX + offsetX, centerY + 50 + offsetY);
				}
				
				ctx.draw();
			},
			
			// 添加动画方法
			startAnimation(targetValue, duration = 1000) {
				// 清除之前的动画
				if (this.animationTimer) {
					clearInterval(this.animationTimer);
				}
				
				const startTime = Date.now();
				const startValue = this.progressValue;
				const diff = targetValue - startValue;
				
				this.animationTimer = setInterval(() => {
					const elapsed = Date.now() - startTime;
					const progress = Math.min(elapsed / duration, 1);
					
					// 使用缓动函数使动画更自然
					const easeOutQuart = 1 - Math.pow(1 - progress, 4);
					this.progressValue = startValue + diff * easeOutQuart;
					
					// 更新图表
					this.drawChart();
					
					if (progress >= 1) {
						clearInterval(this.animationTimer);
						this.animationTimer = null;
					}
				}, 16); // 约60fps
			},
			
			updateChart(option) {
				// 使用uview-plus自己的实现方式更新图表
				this.option = option;
				
				const series = option.series && option.series.length > 0 ? option.series[0] : {};
				const data = series.data && series.data.length > 0 ? series.data[0] : { value: 0 };
				const value = data.value || 0;
				const detail = series.detail || { show: true, fontSize: 20, offsetCenter: [0, 0] };
				
				// 标记已初始化
				this.isInited = true;
				
				// 检查是否启用动画
				if (detail.valueAnimation) {
					this.startAnimation(value);
				} else {
					this.progressValue = value;
					// 直接调用drawChart触发更新而不是直接调用drawGauge
					this.drawChart();
				}
			},
			
			tap(e) {
				// 触发点击事件
				this.$emit('click', e);
			},
			
			// 获取图表实例
			getChartInstance() {
				return null;
			},
			
			// 重新绘制图表
			refresh() {
				this.drawChart();
			}
		},
		beforeDestroy() {
			// 清除动画定时器
			if (this.animationTimer) {
				clearInterval(this.animationTimer);
			}
		}
	}
</script>

<style scoped>
	.u-charts-gauge {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>