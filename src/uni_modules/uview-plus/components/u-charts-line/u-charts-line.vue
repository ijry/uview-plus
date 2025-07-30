<!-- components/u-charts-line/u-charts-line.vue -->
<template>
  <view class="u-charts-line" :style="{ width: containerWidth, height: containerHeight }">
    <canvas 
      class="chart-canvas" 
      :id="canvasId" 
      :canvas-id="canvasId"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    ></canvas>
  </view>
</template>

<script>
import chartHelper from './chartHelper.js';

export default {
  name: 'u-charts-line',
  props: {
    // ECharts 风格的配置项
    option: {
      type: Object,
      default: () => ({})
    },
    // 容器高度
    height: {
      type: [String, Number],
      default: 400
    },
    // 容器宽度
    width: {
      type: [String, Number],
      default: '100%'
    }
  },
  data() {
    return {
      canvasId: 'line-chart-' + Date.now(),
      ctx: null,
      canvasWidth: 0,
      canvasHeight: 0,
      grid: { top: 10, right: 20, bottom: 25, left: 50 },
      // 存储系列数据用于事件处理
      seriesData: [],
      // 触摸相关信息
      touchInfo: {
        startX: 0,
        startY: 0
      }
    };
  },
  computed: {
    containerHeight() {
      return typeof this.height === 'number' ? this.height + 'px' : this.height;
    },
    containerWidth() {
      return typeof this.width === 'number' ? this.width + 'px' : this.width;
    }
  },
  watch: {
    option: {
      handler(newOption) {
        this.drawChart(newOption);
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCanvas();
    });
  },
  methods: {
    initCanvas() {
      try {
        const query = uni.createSelectorQuery().in(this);
        query.select('#' + this.canvasId).boundingClientRect((res) => {
          if (res) {
            this.canvasWidth = res.width;
            this.canvasHeight = res.height;
            
            // 创建canvas上下文
            this.ctx = uni.createCanvasContext(this.canvasId, this);
            if (!this.ctx) {
              console.error('无法获取canvas绘图上下文');
              return;
            }
            
            this.drawChart(this.option);
          } else {
            console.error('无法获取canvas信息');
          }
        }).exec();
      } catch (error) {
        console.error('初始化canvas失败:', error);
      }
    },
    
    drawChart(option) {
      if (!this.ctx || !option) return;
      
      try {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // 设置背景色
        if (option.backgroundColor) {
          this.ctx.setFillStyle(option.backgroundColor);
          this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
        
        // 绘制标题
        let titleHeight = 0;
        if (option.title && option.title.text) {
          titleHeight = chartHelper.drawTitle(this.ctx, option.title, this.canvasWidth);
        }
        
        // 如果有标题，调整网格顶部边距
        if (titleHeight > 0) {
          this.grid.top = Math.max(this.grid.top, titleHeight + 10);
        }
        
        // 提取系列数据
        const series = option.series || [];
        const xAxis = option.xAxis || {};
        const yAxis = option.yAxis || {};
        
        // 处理x轴数据
        const xAxisData = chartHelper.processXAxisData(xAxis, series);
        
        // 计算数据范围
        const { minY, maxY } = chartHelper.calculateDataRange(series);
        
        // 获取X轴padding配置，默认为0
        const xAxisPadding = option.xAxisPadding || 0;

        // 绘制图例（在网格调整之前）
        let legendHeight = 0;
        if (option.legend && option.legend.data) {
          const legendOption = { 
            ...option.legend, 
          };
          legendHeight = chartHelper.drawLegend(
            this.ctx, 
            legendOption, 
            this.grid, 
            this.canvasWidth, 
            chartHelper.defaultColors,
            this.canvasHeight,
            titleHeight
          );
        }
        
        // 绘制网格
        if (option.grid !== false) {
          chartHelper.drawGrid(this.ctx, this.grid, this.canvasWidth, this.canvasHeight, xAxisData.length, minY, maxY, true, xAxisPadding);
        }
        
        // 绘制坐标轴
        chartHelper.drawAxis(this.ctx, this.grid, this.canvasWidth, this.canvasHeight, xAxisData, minY, maxY, xAxis, yAxis, 'line', xAxisPadding);
        
        // 绘制折线
        this.drawSeries(series, xAxisData, minY, maxY, chartHelper.adjustedYMin, chartHelper.adjustedYMax, xAxisPadding);
        
        // 绘制到画布
        this.ctx.draw();
      } catch (error) {
        console.error('绘制图表失败:', error);
      }
    },
    
    drawSeries(series, xAxisData, minY, maxY, adjustedYMin, adjustedYMax, xAxisPadding = 0) {
      if (!series || series.length === 0) return;
      
      const chartWidth = this.canvasWidth - this.grid.left - this.grid.right;
      
      // 应用X轴padding
      const paddedChartWidth = chartWidth - 2 * xAxisPadding;
      
      const chartHeight = this.canvasHeight - this.grid.top - this.grid.bottom;
      
      this.seriesData = []; // 重置系列数据
      
      // 使用调整后的Y轴范围
      const useAdjustedY = adjustedYMin !== undefined && adjustedYMax !== undefined;
      const actualMinY = useAdjustedY ? adjustedYMin : minY;
      const actualMaxY = useAdjustedY ? adjustedYMax : maxY;
      
      // 首先绘制所有系列的填充区域（如果需要）
      series.forEach((serie, index) => {
        if (serie.type !== 'line') return;
        
        const color = serie.color || serie.itemStyle?.color || chartHelper.getColor(index);
        const fillArea = serie?.areaStyle || serie.fillArea;
        const smooth = serie.smooth === true;
        
        // 转换数据点为坐标
        const points = [];
        if (serie.data && Array.isArray(serie.data)) {
          serie.data.forEach((value, i) => {
            const actualValue = typeof value === 'object' && value !== null ? value.value : value;
            // 确保不会除以零，并应用X轴padding
            const x = this.grid.left + xAxisPadding + (xAxisData.length > 1 ? (i / (xAxisData.length - 1)) * paddedChartWidth : 0);
            // 使用调整后的Y轴范围计算Y坐标
            const y = this.grid.top + chartHeight - ((actualValue - actualMinY) / (actualMaxY - actualMinY || 1)) * chartHeight;
            points.push({ 
              x, 
              y, 
              value: actualValue, 
              name: xAxisData[i] || i,
              seriesName: serie.name || `Series ${index}`
            });
          });
        }
        
        // 绘制填充区域
        if (fillArea && points.length > 0) {
          this.drawFillArea(points, color, smooth, this.grid.top + chartHeight);
        }
      });
      
      // 然后绘制所有系列的线条和点
      series.forEach((serie, index) => {
        if (serie.type !== 'line') return;
        
        const color = serie.color || serie.itemStyle?.color || chartHelper.getColor(index);
        const showSymbol = serie.showSymbol !== false;
        const smooth = serie.smooth === true;
        const lineWidth = serie.lineStyle?.width || 2;
        
        // 转换数据点为坐标
        const points = [];
        if (serie.data && Array.isArray(serie.data)) {
          serie.data.forEach((value, i) => {
            const actualValue = typeof value === 'object' && value !== null ? value.value : value;
            // 确保不会除以零，并应用X轴padding
            const x = this.grid.left + xAxisPadding + (xAxisData.length > 1 ? (i / (xAxisData.length - 1)) * paddedChartWidth : 0);
            // 使用调整后的Y轴范围计算Y坐标
            const y = this.grid.top + chartHeight - ((actualValue - actualMinY) / (actualMaxY - actualMinY || 1)) * chartHeight;
            points.push({ 
              x, 
              y, 
              value: actualValue, 
              name: xAxisData[i] || i,
              seriesName: serie.name || `Series ${index}`
            });
          });
        }
        
        // 保存系列数据用于事件处理
        this.seriesData.push({
          name: serie.name || `Series ${index}`,
          points,
          color
        });
        
        // 绘制线条
        if (points.length > 0) {
          this.ctx.setLineWidth(lineWidth);
          this.ctx.setStrokeStyle(color);
          this.ctx.setLineJoin('round');
          this.ctx.setLineCap('round');
          
          if (smooth && points.length > 1) {
            // 绘制平滑曲线
            this.drawSmoothLine(points);
          } else {
            // 绘制直线
            this.drawStraightLine(points);
          }
          
          this.ctx.stroke();
          
          // 绘制数据点
          if (showSymbol) {
            this.ctx.setFillStyle(color);
            points.forEach(point => {
              this.ctx.beginPath();
              this.ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
              this.ctx.fill();
              
              this.ctx.beginPath();
              this.ctx.setFillStyle('#ffffff');
              this.ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
              this.ctx.fill();
              
              this.ctx.setFillStyle(color);
            });
          }
        }
      });
    },
    
    drawFillArea(points, color, smooth, chartBottom) {
      if (!points || points.length === 0) return;
      
      this.ctx.beginPath();
      
      // 移动到起始点
      this.ctx.moveTo(points[0].x, chartBottom);
      this.ctx.lineTo(points[0].x, points[0].y);
      
      if (smooth && points.length > 1) {
        // 平滑填充区域
        for (let i = 0; i < points.length - 1; i++) {
          const p0 = i === 0 ? points[0] : points[i - 1];
          const p1 = points[i];
          const p2 = points[i + 1];
          const p3 = i === points.length - 2 ? points[i + 1] : points[i + 2];
          
          // 计算控制点
          const cp1x = p1.x + (p2.x - p0.x) / 6;
          const cp1y = p1.y + (p2.y - p0.y) / 6;
          const cp2x = p2.x - (p3.x - p1.x) / 6;
          const cp2y = p2.y - (p3.y - p1.y) / 6;
          
          this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
      } else {
        // 直线填充区域
        for (let i = 1; i < points.length; i++) {
          this.ctx.lineTo(points[i].x, points[i].y);
        }
      }
      
      // 闭合路径到结束点
      this.ctx.lineTo(points[points.length - 1].x, chartBottom);
      this.ctx.closePath();
      
      // 设置填充样式
      if (typeof color === 'string' && color.startsWith('#')) {
        // 如果是十六进制颜色，转换为带透明度的颜色
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        this.ctx.setFillStyle(`rgba(${r}, ${g}, ${b}, 0.3)`);
      } else if (typeof color === 'string' && color.startsWith('rgb')) {
        // 如果是rgb颜色，转换为rgba颜色
        const rgb = color.replace('rgb(', '').replace(')', '');
        this.ctx.setFillStyle(`rgba(${rgb}, 0.3)`);
      } else {
        // 其他情况使用默认透明度
        this.ctx.setFillStyle('rgba(84, 112, 198, 0.3)');
      }
      
      this.ctx.fill();
    },
    
    drawStraightLine(points) {
      if (!points || points.length === 0) return;
      
      this.ctx.beginPath();
      points.forEach((point, i) => {
        if (i === 0) {
          this.ctx.moveTo(point.x, point.y);
        } else {
          this.ctx.lineTo(point.x, point.y);
        }
      });
    },
    
    drawSmoothLine(points) {
      if (!points || points.length < 2) return;
      
      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);
      
      // 对于只有两个点的情况，使用简单的二次贝塞尔曲线
      if (points.length === 2) {
        const controlX = (points[0].x + points[1].x) / 2;
        const controlY = (points[0].y + points[1].y) / 2;
        this.ctx.quadraticCurveTo(controlX, controlY, points[1].x, points[1].y);
        return;
      }
      
      // 对于多个点的情况，使用 Catmull-Rom 样条转贝塞尔曲线的方法
      // 这样可以确保所有点都在曲线上
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = i === 0 ? points[0] : points[i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = i === points.length - 2 ? points[i + 1] : points[i + 2];
        
        // 计算控制点 (使用 Catmull-Rom 转贝塞尔)
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }
    },
    
    // 触摸事件处理
    handleTouchStart(e) {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        this.touchInfo.startX = touch.x || 0;
        this.touchInfo.startY = touch.y || 0;
      }
    },
    
    handleTouchMove(e) {
      // 阻止默认行为，避免页面滚动
      e.preventDefault && e.preventDefault();
    },
    
    handleTouchEnd(e) {
      if (e.changedTouches && e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const endX = touch.x || 0;
        const endY = touch.y || 0;
        
        // 判断是否为点击事件
        const deltaX = Math.abs(endX - this.touchInfo.startX);
        const deltaY = Math.abs(endY - this.touchInfo.startY);
        
        if (deltaX < 5 && deltaY < 5) {
          this.handleChartClick(endX, endY);
        }
      }
    },
    
    handleChartClick(x, y) {
      // 查找最近的数据点
      let minDistance = Infinity;
      let closestPoint = null;
      
      if (this.seriesData && this.seriesData.length > 0) {
        this.seriesData.forEach(series => {
          if (series.points && series.points.length > 0) {
            series.points.forEach(point => {
              const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
              if (distance < minDistance && distance < 20) { // 20px 的点击范围
                minDistance = distance;
                closestPoint = {
                  seriesName: series.name,
                  name: point.name,
                  value: point.value,
                  color: series.color,
                  x: point.x,
                  y: point.y
                };
              }
            });
          }
        });
      }
      
      if (closestPoint) {
        // 触发点击事件
        this.$emit('click', {
          componentType: 'series',
          seriesType: 'line',
          seriesName: closestPoint.seriesName,
          name: closestPoint.name,
          value: closestPoint.value,
          color: closestPoint.color,
          event: {
            offsetX: closestPoint.x,
            offsetY: closestPoint.y
          }
        });
      }
    },
    
    // 提供类似 ECharts 的 setOption 方法
    setOption(option, notMerge = false) {
      if (notMerge) {
        this.drawChart(option);
      } else {
        // 简单合并配置
        try {
          const newOption = JSON.parse(JSON.stringify(this.option));
          Object.assign(newOption, option);
          this.drawChart(newOption);
        } catch (error) {
          console.error('合并配置失败:', error);
          this.drawChart(option);
        }
      }
    },
    
    // 提供类似 ECharts 的 resize 方法
    resize() {
      this.initCanvas();
    }
  }
};
</script>

<style scoped>
.u-charts-line {
  position: relative;
}

.chart-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>