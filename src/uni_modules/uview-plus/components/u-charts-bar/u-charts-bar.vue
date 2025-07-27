<!-- components/u-charts-bar/u-charts-bar.vue -->
<template>
  <view class="u-charts-bar" :style="{ width: containerWidth, height: containerHeight }">
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
import chartHelper from '../u-charts-line/chartHelper.js';

export default {
  name: 'BarChart',
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
      canvasId: 'bar-chart-' + Date.now(),
      ctx: null,
      canvasWidth: 0,
      canvasHeight: 0,
      grid: { top: 60, right: 20, bottom: 60, left: 50 },
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
        const titleHeight = chartHelper.drawTitle(this.ctx, option.title, this.canvasWidth);
        if (titleHeight > 0) {
          this.grid.top = 60; // 如果有标题，调整网格顶部边距
        }
        
        // 提取系列数据
        const series = option.series || [];
        const xAxis = option.xAxis || {};
        const yAxis = option.yAxis || {};
        
        // 处理x轴数据
        const xAxisData = chartHelper.processXAxisData(xAxis, series);
        
        // 计算数据范围
        const { minY, maxY } = chartHelper.calculateDataRange(series);
        
        // 获取X轴padding配置，默认为10px
        const xAxisPadding = option.xAxisPadding !== undefined ? option.xAxisPadding : 10;
        
        // 绘制网格
        if (option.grid !== false) {
          chartHelper.drawGrid(this.ctx, this.grid, this.canvasWidth, this.canvasHeight, xAxisData.length, minY, maxY, false, xAxisPadding);
        }
        
        // 绘制坐标轴
        chartHelper.drawAxis(this.ctx, this.grid, this.canvasWidth, this.canvasHeight, xAxisData, minY, maxY, xAxis, yAxis, 'bar', xAxisPadding);
        
        // 绘制柱状图
        this.drawBars(series, xAxisData, minY, maxY, chartHelper.adjustedYMin, chartHelper.adjustedYMax, xAxisPadding);
        
        // 绘制图例
        if (option.legend && option.legend.data) {
          chartHelper.drawLegend(this.ctx, option.legend, this.grid, this.canvasWidth, chartHelper.defaultColors);
        }
        
        // 绘制到画布
        this.ctx.draw();
      } catch (error) {
        console.error('绘制图表失败:', error);
      }
    },
    
    drawBars(series, xAxisData, minY, maxY, adjustedYMin, adjustedYMax, xAxisPadding = 10) {
      const chartWidth = this.canvasWidth - this.grid.left - this.grid.right;
      
      // 应用X轴padding
      const paddedChartWidth = chartWidth - 2 * xAxisPadding;
      
      const chartHeight = this.canvasHeight - this.grid.top - this.grid.bottom;
      
      this.seriesData = []; // 重置系列数据
      
      // 使用调整后的Y轴范围
      const useAdjustedY = adjustedYMin !== undefined && adjustedYMax !== undefined;
      const actualMinY = useAdjustedY ? adjustedYMin : minY;
      const actualMaxY = useAdjustedY ? adjustedYMax : maxY;
      
      // 确保最小值为0，这样柱状图才会从底部开始
      const barMinY = actualMinY < 0 ? actualMinY : 0;
      
      // 计算柱子的宽度和间隔
      const barCategoryGap = 20; // 柱子之间的间隔
      const totalBarWidth = paddedChartWidth - (xAxisData.length - 1) * barCategoryGap;
      const singleBarWidth = Math.max(1, totalBarWidth / xAxisData.length); // 单个柱子的宽度
      
      series.forEach((serie, index) => {
        if (serie.type !== 'bar') return;
        
        const color = serie.color || serie.itemStyle?.color || chartHelper.getColor(index);
        const barWidth = serie.barWidth || Math.min(20, singleBarWidth / series.length);
        
        // 计算柱状图位置
        const points = [];
        serie.data.forEach((value, i) => {
          const actualValue = typeof value === 'object' ? value.value : value;
          // 修改: 确保柱子居中于X轴节点
          const x = this.grid.left + xAxisPadding + (i + 0.5) * (paddedChartWidth / xAxisData.length) - barWidth/2;
          
          // 计算基准线位置（0值位置）
          const zeroY = this.grid.top + chartHeight - ((0 - barMinY) / (actualMaxY - barMinY || 1)) * chartHeight;
          
          // 计算当前值的Y位置
          const y = this.grid.top + chartHeight - ((actualValue - barMinY) / (actualMaxY - barMinY || 1)) * chartHeight;
          
          // 计算柱子高度（从0值到当前值的距离）
          const barHeight = Math.abs(y - zeroY);
          
          points.push({ 
            x, 
            y: actualValue >= 0 ? y : zeroY, // 正值从底部向上绘制，负值从0值向下绘制
            value: actualValue, 
            name: xAxisData[i],
            seriesName: serie.name,
            barHeight,
            zeroY, // 保存0值的Y坐标用于绘制负值柱子
            barWidth // 保存柱子宽度
          });
        });
        
        // 保存系列数据用于事件处理
        this.seriesData.push({
          name: serie.name,
          points,
          color
        });
        
        // 绘制柱状图
        points.forEach(point => {
          this.ctx.setFillStyle(color);
          // 根据值的正负确定绘制方向
          const drawY = point.value >= 0 ? point.y : point.zeroY;
          this.ctx.fillRect(
            point.x, 
            drawY, 
            point.barWidth || barWidth, 
            point.barHeight
          );
        });
      });
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
      
      this.seriesData.forEach(series => {
        series.points.forEach(point => {
          // 修改: 使用实际的柱子宽度进行点击检测
          const barWidth = point.barWidth || 20;
          if (x >= point.x && x <= point.x + barWidth && 
              y >= Math.min(point.y, point.zeroY) && y <= Math.min(point.y, point.zeroY) + point.barHeight) {
            const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
            if (distance < minDistance) {
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
          }
        });
      });
      
      if (closestPoint) {
        // 触发点击事件
        this.$emit('click', {
          componentType: 'series',
          seriesType: 'bar',
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
        const newOption = JSON.parse(JSON.stringify(this.option));
        Object.assign(newOption, option);
        this.drawChart(newOption);
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
.u-charts-bar {
  position: relative;
}

.chart-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>