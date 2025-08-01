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
        const { minY, maxY } = this.calculateStackedDataRange(series);
        
        // 获取X轴padding配置，默认为10px
        const xAxisPadding = option.xAxisPadding !== undefined ? option.xAxisPadding : 10;

        // 绘制图例（在网格调整之前）
        let legendHeight = 0;
        // console.log(this.grid);
        if (option.legend && option.legend.data) {
          const legendOption = { 
            ...option.legend, 
          };
          // 为图例生成与系列一致的颜色列表
          const legendColors = series.map((serie, index) => 
            serie.color || serie.itemStyle?.color || chartHelper.getColor(index)
          );
          legendHeight = chartHelper.drawLegend(
            this.ctx, 
            legendOption, 
            this.grid, 
            this.canvasWidth, 
            legendColors, // 使用与系列一致的颜色
            this.canvasHeight,
            titleHeight
          );
        //   console.log('Legend height: ', legendHeight);
        }
        
        // 绘制网格
        if (option.grid !== false) {
          chartHelper.drawGrid(this.ctx, this.grid, this.canvasWidth, this.canvasHeight, xAxisData.length, minY, maxY, false, xAxisPadding);
        }
        
        // 绘制坐标轴
        chartHelper.drawAxis(this.ctx, this.grid, this.canvasWidth, this.canvasHeight, xAxisData, minY, maxY, xAxis, yAxis, 'bar', xAxisPadding);
        
        // 绘制柱状图
        this.drawBars(series, xAxisData, minY, maxY, chartHelper.adjustedYMin, chartHelper.adjustedYMax, xAxisPadding);
        
        // 绘制到画布
        this.ctx.draw();
      } catch (error) {
        console.error('绘制图表失败:', error);
      }
    },
    
    // 绘制山峰形状的柱子 (三角形)
    drawMountainBar(ctx, x, y, width, height, color, borderColor, borderWidth) {
      ctx.beginPath();
      ctx.setFillStyle(color);
      
      // 三角形山峰图，底部更宽，占满整个柱子宽度
      // 修改: 使用grid总宽度除以列数作为底部宽度参考
      const chartWidth = this.canvasWidth - this.grid.left - this.grid.right;
      const columnCount = this.option.xAxis?.data?.length || 1;
      const bottomWidth = chartWidth / columnCount; // 占满整个列宽
      const topWidth = width * 0.3;   // 顶部宽度减少到30%，使顶部更尖
      
      const bottomX = x - (bottomWidth - width) / 2; // 底部居中
      const topX = x + (width - topWidth) / 2;       // 顶部居中
      
      ctx.moveTo(topX + topWidth / 2, y);           // 顶部中心点
      ctx.lineTo(bottomX, y + height);              // 左下角
      ctx.lineTo(bottomX + bottomWidth, y + height); // 右下角
      ctx.lineTo(topX + topWidth / 2, y);           // 回到顶部
      
      ctx.closePath();
      ctx.fill();
      
      // 绘制边框
      if (borderWidth > 0 && borderColor) {
        ctx.setLineWidth(borderWidth);
        ctx.setStrokeStyle(borderColor);
        ctx.stroke();
      }
    },
    
    // 绘制圆角山峰形状的柱子
    drawRoundedMountainBar(ctx, x, y, width, height, color, borderColor, borderWidth) {
      ctx.beginPath();
      ctx.setFillStyle(color);
      
      // 底部更宽，顶部更圆润，形成S形曲线
      const bottomWidth = width * 4.0; // 底部宽度增加到400% (原来是200%)
      const topWidth = width * 5.0;    // 顶部宽度为原始宽度，使顶部更尖
      
      const bottomX = x - (bottomWidth - width) / 2; // 底部居中
      const topX = x + (width - topWidth) / 2;       // 顶部居中
      
      // 使用更平滑的贝塞尔曲线绘制圆润的山峰形状
      const bottomY = y + height;
      const topY = y;
      
      // 起始点在左侧底部
      ctx.moveTo(bottomX, bottomY);
      
      // 左侧S形曲线：从底部到顶部
      // 调整控制点使顶部更尖锐
      ctx.bezierCurveTo(
        bottomX + bottomWidth * 0.4, bottomY - height * 0.2,    // 左侧底部控制点
        topX + topWidth * 0.3, topY + height * 0.2,             // 左侧腰部控制点
        topX + topWidth * 0.5, topY + height * 0.2              // 顶部中心点
      );
      
      // 右侧S形曲线：从顶部到底部
      ctx.bezierCurveTo(
        topX + topWidth * 0.7, topY + height * 0.2,             // 右侧腰部控制点
        bottomX + bottomWidth * 0.6, bottomY - height * 0.2,    // 右侧底部控制点
        bottomX + bottomWidth, bottomY                          // 右侧底部终点
      );
      
      // 闭合路径回到起始点
      ctx.closePath();
      ctx.fill();
      
      // 绘制边框
      if (borderWidth > 0 && borderColor) {
        ctx.setLineWidth(borderWidth);
        ctx.setStrokeStyle(borderColor);
        ctx.stroke();
      }
    },
    
    // 绘制尖角山峰形状的柱子
    drawSharpMountainBar(ctx, x, y, width, height, color, borderColor, borderWidth) {
      ctx.beginPath();
      ctx.setFillStyle(color);
      
      // 底部更宽，顶部更圆润，形成S形曲线
      const bottomWidth = width * 4.0; // 底部宽度增加到400% (原来是200%)
      const topWidth = width * 0.1;    // 顶部宽度为原始宽度，使顶部更尖
      
      const bottomX = x - (bottomWidth - width) / 2; // 底部居中
      const topX = x + (width - topWidth) / 2;       // 顶部居中
      
      // 使用更平滑的贝塞尔曲线绘制圆润的山峰形状
      const bottomY = y + height;
      const topY = y;
      
      // 起始点在左侧底部
      ctx.moveTo(bottomX, bottomY);
      
      // 左侧S形曲线：从底部到顶部
      // 调整控制点使顶部更尖锐
      ctx.bezierCurveTo(
        bottomX + bottomWidth * 0.4, bottomY - height * 0.2,    // 左侧底部控制点
        topX + topWidth * 0.3, topY + height * 0.2,             // 左侧腰部控制点
        topX + topWidth * 0.5, topY                                 // 顶部中心点，使顶部更尖
      );
      
      // 右侧S形曲线：从顶部到底部
      ctx.bezierCurveTo(
        topX + topWidth * 0.7, topY + height * 0.2,             // 右侧腰部控制点
        bottomX + bottomWidth * 0.6, bottomY - height * 0.2,    // 右侧底部控制点
        bottomX + bottomWidth, bottomY                          // 右侧底部终点
      );
      
      // 闭合路径回到起始点
      ctx.closePath();
      ctx.fill();
      
      // 绘制边框
      if (borderWidth > 0 && borderColor) {
        ctx.setLineWidth(borderWidth);
        ctx.setStrokeStyle(borderColor);
        ctx.stroke();
      }
    },

    // 绘制自然山峰形状的柱子 (重叠样式，后一个遮挡前一个一点点)
    drawRealMountainBar(ctx, x, y, width, height, color, borderColor, borderWidth) {
      ctx.beginPath();
      ctx.setFillStyle(color);
      
      // 实现更接近圆珠笔头形状的 roundedMountain 样式
      // 底部更宽，顶部更圆润，形成S形曲线
      const bottomWidth = width * 4.0; // 底部宽度增加到400% (原来是200%)
      const topWidth = width * 2.0;    // 顶部宽度增加到200%，使顶部更圆润像帽子
      
      const bottomX = x - (bottomWidth - width) / 2; // 底部居中
      const topX = x + (width - topWidth) / 2;       // 顶部居中
      
      // 使用更平滑的贝塞尔曲线绘制圆润的山峰形状
      const bottomY = y + height;
      const topY = y;
      
      // 起始点在左侧底部
      ctx.moveTo(bottomX, bottomY);
      
      // 左侧S形曲线：从底部到顶部
      // 调整控制点使顶部更圆润，更像帽子
      ctx.bezierCurveTo(
        bottomX + bottomWidth * 0.3, bottomY - height * 0.3,    // 左侧底部控制点
        topX + topWidth * 0.2, topY + height * 0.3,             // 左侧腰部控制点
        topX + topWidth * 0.4, topY + height * 0.1              // 左侧接近顶部控制点
      );
      
      // 顶部圆润部分，添加额外控制点使顶部更像帽子
      ctx.bezierCurveTo(
        topX + topWidth * 0.5, topY,                            // 顶部中心点
        topX + topWidth * 0.6, topY + height * 0.1,             // 右侧接近顶部控制点
        topX + topWidth * 0.8, topY + height * 0.3              // 右侧腰部控制点
      );
      
      // 右侧S形曲线：从顶部到底部
      ctx.bezierCurveTo(
        topX + topWidth * 0.9, topY + height * 0.4,             // 右侧腰部控制点
        bottomX + bottomWidth * 0.7, bottomY - height * 0.3,    // 右侧底部控制点
        bottomX + bottomWidth, bottomY                          // 右侧底部终点
      );
      
      // 闭合路径回到起始点
      ctx.closePath();
      ctx.fill();
      
      // 绘制边框
      if (borderWidth > 0 && borderColor) {
        ctx.setLineWidth(borderWidth);
        ctx.setStrokeStyle(borderColor);
        ctx.stroke();
      }
    },
    
    // 绘制圆角柱状形状的柱子
    drawRoundedBar(ctx, x, y, width, height, color, borderColor, borderWidth, borderRadius) {
      const radius = borderRadius ? borderRadius : Math.min(width / 2, height / 2);
      ctx.beginPath();
      ctx.setFillStyle(color);
      
      // 绘制圆角矩形
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.arcTo(x + width, y, x + width, y + radius, radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
      ctx.lineTo(x + radius, y + height);
      ctx.arcTo(x, y + height, x, y + height - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      
      ctx.closePath();
      ctx.fill();
      
      // 绘制边框
      if (borderWidth > 0 && borderColor) {
        ctx.setLineWidth(borderWidth);
        ctx.setStrokeStyle(borderColor);
        ctx.stroke();
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
      
      // 处理堆叠逻辑 - 构建stack映射
      const stackMap = new Map(); // 用于存储每个stack分组的数据
      
      // 预处理数据，构建堆叠结构
      series.forEach((serie, index) => {
        if (serie.type !== 'bar') return;
        
        if (serie.stack) {
          if (!stackMap.has(serie.stack)) {
            stackMap.set(serie.stack, []);
          }
          stackMap.get(serie.stack).push({ serie, index });
        }
      });
      
      // 计算柱子的宽度和间隔
      const barCategoryGap = 20; // 柱子之间的间隔
      
      // 计算分组数量：堆叠组数量 + 非堆叠系列数量
      const stackGroups = stackMap.size; // 堆叠分组数量
      const nonStackedBars = series.filter(s => s.type === 'bar' && !s.stack).length; // 非堆叠柱子数量
      const groupCount = stackGroups + nonStackedBars; // 总的分组数量
      
      const totalBarWidth = paddedChartWidth - (xAxisData.length - 1) * barCategoryGap;
      const groupWidth = groupCount > 0 ? Math.max(1, totalBarWidth / xAxisData.length) : 0; // 每组的宽度
      
      // 为每个系列分配位置
      const seriesPositions = new Map();
      let groupIndex = 0;
      
      // 先处理堆叠分组
      stackMap.forEach((stackSeries, stackName) => {
        seriesPositions.set(stackName, {
          groupIndex: groupIndex++,
          isStack: true,
          seriesList: stackSeries
        });
      });
      
      // 再处理非堆叠系列
      series.forEach((serie, index) => {
        if (serie.type !== 'bar') return;
        
        if (!serie.stack) {
          seriesPositions.set(index, {
            groupIndex: groupIndex++,
            isStack: false,
            seriesList: [{ serie, index }]
          });
        }
      });
      
      // 保存每个x轴位置上各个系列的基准值，用于堆叠计算
      const stackBaseValues = new Map();
      
      series.forEach((serie, index) => {
        if (serie.type !== 'bar') return;
        
        const color = serie.color || serie.itemStyle?.color || chartHelper.getColor(index);
        const barWidth = serie.barWidth || Math.min(20, groupWidth / (groupCount || 1));
        const symbol = serie.symbol || 'rect'; // 默认为矩形
        
        // 获取该系列的位置信息
        let positionInfo;
        if (serie.stack) {
          positionInfo = seriesPositions.get(serie.stack);
        } else {
          positionInfo = seriesPositions.get(index);
        }
        
        // 初始化stackBaseValues
        if (!stackBaseValues.has(positionInfo.groupIndex)) {
          stackBaseValues.set(positionInfo.groupIndex, new Array(xAxisData.length).fill(0));
        }
        
        // 计算柱状图位置
        const points = [];
        serie.data.forEach((value, i) => {
          // 支持 ECharts 规范的数据点格式 {value: ..., itemStyle: {color: ...}}
          const actualValue = typeof value === 'object' && value !== null ? (value.value !== undefined ? value.value : value) : value;
          
          // 计算基准X位置
          let x;
          const groupSlotWidth = paddedChartWidth / Math.max(xAxisData.length, 1);
          const groupStartX = this.grid.left + xAxisPadding + i * groupSlotWidth;
          
          if (positionInfo.isStack) {
            // 堆叠柱状图，所有同组柱子在同一位置
            x = groupStartX + (groupSlotWidth - barWidth) / 2;
          } else {
            // 并列柱状图，需要根据分组位置计算
            const groupCountForPosition = groupCount || 1;
            const barSpacing = barWidth * 0.1; // 柱子之间的间距比例
            const totalGroupWidth = barWidth * groupCountForPosition + barSpacing * (groupCountForPosition - 1);
            const groupStart = groupStartX + (groupSlotWidth - totalGroupWidth) / 2;
            x = groupStart + positionInfo.groupIndex * (barWidth + barSpacing);
          }
          
          // 计算基准线位置（0值位置）
          const zeroY = this.grid.top + chartHeight - ((0 - barMinY) / (actualMaxY - barMinY || 1)) * chartHeight;
          
          // 处理堆叠逻辑
          let y, barHeight;
          if (positionInfo.isStack) {
            // 堆叠柱状图逻辑
            const baseValues = stackBaseValues.get(positionInfo.groupIndex);
            const stackBase = baseValues[i];
            
            // 正值堆叠在上方，负值堆叠在下方
            const baseY = this.grid.top + chartHeight - ((stackBase - barMinY) / (actualMaxY - barMinY || 1)) * chartHeight;
            const topY = this.grid.top + chartHeight - ((stackBase + actualValue - barMinY) / (actualMaxY - barMinY || 1)) * chartHeight;
            
            y = topY;
            barHeight = Math.abs(baseY - topY);
            
            // 更新基准值
            baseValues[i] = stackBase + actualValue;
          } else {
            // 非堆叠柱状图逻辑
            y = this.grid.top + chartHeight - ((actualValue - barMinY) / (actualMaxY - barMinY || 1)) * chartHeight;
            barHeight = Math.abs(y - zeroY);
          }
          
          // 支持为单个数据点设置颜色 (ECharts 规范)
          const pointColor = typeof value === 'object' && value !== null && value.itemStyle?.color ? 
                             value.itemStyle.color : 
                             (typeof value === 'object' && value !== null && value.color ? value.color : color);
          
          // 获取边框样式 - 修复borderColor和borderWidth获取逻辑
          let borderColor = serie.itemStyle?.borderColor || null;
          let borderWidth = serie.itemStyle?.borderWidth || 0;
          // 获取圆角配置
          let borderRadius = serie.itemStyle?.borderRadius || 0;
          
          // 如果是对象格式的数据点，获取其边框样式
          if (typeof value === 'object' && value !== null) {
            borderColor = value.itemStyle?.borderColor || value.borderColor || borderColor;
            borderWidth = value.itemStyle?.borderWidth || value.borderWidth || borderWidth;
            borderRadius = value.itemStyle?.borderRadius || value.borderRadius || borderRadius;
          }
          
          points.push({ 
            x, 
            y: actualValue >= 0 ? y : (positionInfo.isStack ? y : zeroY), 
            value: actualValue, 
            name: xAxisData[i],
            seriesName: serie.name,
            barHeight,
            zeroY, // 保存0值的Y坐标用于绘制负值柱子
            barWidth, // 保存柱子宽度
            symbol, // 保存柱子形状
            color: pointColor, // 保存柱子颜色
            borderColor, // 保存边框颜色
            borderWidth, // 保存边框宽度
            borderRadius  // 保存圆角配置
          });
        });
        
        // 保存系列数据用于事件处理
        this.seriesData.push({
          name: serie.name,
          points,
          color
        });
        
        // 绘制柱状图
        points.forEach((point, pointIndex) => {
          // 根据symbol属性选择绘制方式
          // 当是山峰图时如果没有指定颜色，则从defaultColors中获取颜色
          let drawColor = point.color;
          if (!drawColor || (drawColor === color
            && (point.symbol === 'mountain' || point.symbol === 'realMountain' || point.symbol === 'roundedMountain' || point.symbol === 'sharpMountain'))) {
            drawColor = chartHelper.defaultColors[pointIndex % chartHelper.defaultColors.length];
          }
          
          switch (point.symbol) {
            case 'mountain':
              // 山峰图 (三角形)
              this.drawMountainBar(
                this.ctx, 
                point.x, 
                point.value >= 0 ? point.y : (positionInfo.isStack ? point.y : point.zeroY), 
                point.barWidth, 
                point.barHeight, 
                drawColor || point.color, // 使用数据点颜色或默认颜色
                point.borderColor, // 使用数据点边框颜色
                point.borderWidth  // 使用数据点边框宽度
              );
              break;
              
            case 'roundedMountain':
              // 圆角山峰图 (重叠样式)
              this.drawRoundedMountainBar(
                this.ctx, 
                point.x, 
                point.value >= 0 ? point.y : (positionInfo.isStack ? point.y : point.zeroY), 
                point.barWidth, 
                point.barHeight, 
                drawColor || point.color, // 使用数据点颜色或默认颜色
                point.borderColor, // 使用数据点边框颜色
                point.borderWidth  // 使用数据点边框宽度
              );
              break;

            case 'realMountain':
              // 圆角山峰图 (重叠样式)
              this.drawRealMountainBar(
                this.ctx, 
                point.x, 
                point.value >= 0 ? point.y : (positionInfo.isStack ? point.y : point.zeroY), 
                point.barWidth, 
                point.barHeight, 
                drawColor || point.color, // 使用数据点颜色或默认颜色
                point.borderColor, // 使用数据点边框颜色
                point.borderWidth  // 使用数据点边框宽度
              );
              break;
              
            case 'sharpMountain':
              // 尖角山峰图 (明显内凹曲线，底部更宽以实现重叠效果)
              this.drawSharpMountainBar(
                this.ctx, 
                point.x, 
                point.value >= 0 ? point.y : (positionInfo.isStack ? point.y : point.zeroY), 
                point.barWidth, 
                point.barHeight, 
                drawColor || point.color, // 使用数据点颜色或默认颜色
                point.borderColor, // 使用数据点边框颜色
                point.borderWidth  // 使用数据点边框宽度
              );
              break;
              
            case 'rounded':
              // 圆角柱状图
              this.drawRoundedBar(
                this.ctx, 
                point.x, 
                point.value >= 0 ? point.y : (positionInfo.isStack ? point.y : point.zeroY), 
                point.barWidth, 
                point.barHeight, 
                drawColor || point.color, // 使用数据点颜色或默认颜色
                point.borderColor, // 使用数据点边框颜色
                point.borderWidth  // 使用数据点边框宽度
              );
              break;
              
            default:
              // 默认柱状图 - 支持borderRadius配置
              if (point.borderRadius && point.borderRadius > 0) {
                // 如果配置了borderRadius，则使用圆角矩形绘制
                this.drawRoundedBar(
                  this.ctx,
                  point.x,
                  point.value >= 0 ? point.y : (positionInfo.isStack ? point.y : point.zeroY),
                  point.barWidth,
                  point.barHeight,
                  drawColor || point.color,
                  point.borderColor,
                  point.borderWidth,
                  point.borderRadius
                );
              } else {
                // 否则使用普通矩形绘制
                this.ctx.setFillStyle(drawColor || point.color); // 使用数据点颜色或默认颜色
                // 根据值的正负确定绘制方向
                const drawY = point.value >= 0 ? point.y : (positionInfo.isStack ? point.y : point.zeroY);
                this.ctx.fillRect(
                  point.x, 
                  drawY, 
                  point.barWidth, 
                  point.barHeight
                );
                
                // 绘制边框 (仅对非堆叠柱状图绘制边框)
                if (!positionInfo.isStack && point.borderWidth > 0 && point.borderColor) {
                  this.ctx.setLineWidth(point.borderWidth);
                  this.ctx.setStrokeStyle(point.borderColor);
                  this.ctx.strokeRect(
                    point.x, 
                    drawY, 
                    point.barWidth, 
                    point.barHeight
                  );
                }
              }
          }
        });
      });
      
      // 处理堆叠柱状图的整体边框样式
      stackMap.forEach((stackSeries) => {
        // 获取堆叠组的边框样式（从第一个系列获取）
        if (stackSeries.length > 0) {
          const firstSeries = stackSeries[0].serie;
          const stackBorderColor = firstSeries.itemStyle?.borderColor || null;
          const stackBorderWidth = firstSeries.itemStyle?.borderWidth || 0;
          
          // 如果设置了堆叠组的边框样式，则绘制整体边框
          if (stackBorderWidth > 0 && stackBorderColor) {
            stackSeries.forEach(({ serie, index }) => {
              const positionInfo = seriesPositions.get(serie.stack);
              serie.data.forEach((value, i) => {
                const points = this.seriesData[index].points;
                if (points && points[i]) {
                  const point = points[i];
                  // 只有堆叠组中的最后一个系列才绘制整体边框
                  const isLastInStack = index === stackSeries[stackSeries.length - 1].index;
                  
                  if (isLastInStack) {
                    // 计算整个堆叠组的总高度
                    const baseValues = stackBaseValues.get(positionInfo.groupIndex);
                    const totalValue = baseValues[i];
                    const totalHeight = Math.abs((totalValue / (actualMaxY - barMinY || 1)) * chartHeight);
                    
                    // 确定堆叠组的起始Y坐标
                    const stackStartY = this.grid.top + chartHeight - ((totalValue - barMinY) / (actualMaxY - barMinY || 1)) * chartHeight;
                    
                    this.ctx.setLineWidth(stackBorderWidth);
                    this.ctx.setStrokeStyle(stackBorderColor);
                    this.ctx.strokeRect(
                      point.x, 
                      stackStartY, 
                      point.barWidth, 
                      totalHeight
                    );
                  }
                }
              });
            });
          }
        }
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
    },
    
    // 计算堆叠数据范围
    calculateStackedDataRange(series) {
      let minY = 0;
      let maxY = 0;
      
      // 处理堆叠逻辑 - 构建stack映射
      const stackMap = new Map();
      const nonStackedSeries = [];
      
      // 分类堆叠和非堆叠系列
      series.forEach((serie) => {
        if (serie.type !== 'bar') return;
        
        if (serie.stack) {
          if (!stackMap.has(serie.stack)) {
            stackMap.set(serie.stack, []);
          }
          stackMap.get(serie.stack).push(serie);
        } else {
          nonStackedSeries.push(serie);
        }
      });
      
      // 计算非堆叠系列的极值
      nonStackedSeries.forEach((serie) => {
        serie.data.forEach((value) => {
          const actualValue = typeof value === 'object' ? value.value : value;
          minY = Math.min(minY, actualValue);
          maxY = Math.max(maxY, actualValue);
        });
      });
      
      // 计算堆叠系列的极值
      stackMap.forEach((stackSeries) => {
        // 为每个x位置计算堆叠值
        const stackValues = new Map();
        
        stackSeries.forEach((serie) => {
          serie.data.forEach((value, index) => {
            const actualValue = typeof value === 'object' ? value.value : value;
            if (!stackValues.has(index)) {
              stackValues.set(index, 0);
            }
            stackValues.set(index, stackValues.get(index) + actualValue);
          });
        });
        
        // 更新minY和maxY
        stackValues.forEach((value) => {
          minY = Math.min(minY, value);
          maxY = Math.max(maxY, value);
        });
      });
      
      // 确保Y轴范围包含0值
      minY = Math.min(minY, 0);
      maxY = Math.max(maxY, 0);
      
      return { minY, maxY };
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