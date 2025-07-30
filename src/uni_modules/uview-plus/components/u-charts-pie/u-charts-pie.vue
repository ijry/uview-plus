<template>
  <view class="u-charts-pie" :style="{width: width}">
    <!-- 标题 -->
    <view 
      v-if="options.title && options.title.show !== false" 
      class="chart-title"
      :style="{
        textAlign: options.title.left === 'center' ? 'center' : options.title.left === 'right' ? 'right' : 'left'
      }"
    >
      <text 
        class="main-title"
        :style="{ color: options.title.textStyle?.color || '#333', fontSize: options.title.textStyle?.fontSize || 18 }"
      >{{ options.title.text }}</text>
      <text 
        v-if="options.title.subtext"
        class="sub-title"
        :style="{ color: options.title.subtextStyle?.color || '#666', fontSize: options.title.subtextStyle?.fontSize || 14 }"
      >{{ options.title.subtext }}</text>
    </view>
    
    <canvas 
      :id="cid" 
      :canvas-id="cid" 
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
      @touchstart="tap"
      @touchmove="move"
      @touchend="touchEnd"
    ></canvas>
  </view>
</template>

<script>
// #ifdef APP-NVUE
const dom = weex.requireModule('dom');
// #endif

export default {
  name: 'u-charts-pie',
  props: {
    // 图表数据
    options: {
      type: Object,
      default: () => ({})
    },
    // 图表宽度
    width: {
      type: [String, Number],
      default: '100%'
    },
    // 图表高度
    height: {
      type: [String, Number],
      default: 300
    }
  },
  data() {
    return {
      cid: 'u-charts-pie-' + Math.random().toString(36).substr(2),
      // 修改:初始化时根据width类型处理默认值，支持rpx单位
      canvasWidth: typeof this.width === 'string' && this.width.indexOf('%') !== -1 ? 
        null : 
        (typeof this.width === 'number' ? this.width : this.parseUnit(this.width)),
      canvasHeight: typeof this.height === 'string' ? this.parseUnit(this.height) : this.height,
      chartInstance: null,
      isMount: false
    };
  },
  watch: {
    options: {
      handler(newVal) {
        if (this.isMount) {
          this.drawChart();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.isMount = true;
    // #ifndef APP-NVUE
    this.$nextTick(() => {
      this.init();
    });
    // #endif
    
    // #ifdef APP-NVUE
    this.initNvue();
    // #endif
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
  methods: {
    // 初始化
    init() {
      this.getCanvasSize().then(() => {
        this.drawChart();
      });
    },
    
    // 初始化nvue
    initNvue() {
      dom.getComponentRect(this.$refs.canvas, (res) => {
        if (res.result) {
          this.canvasWidth = res.size.width;
          this.canvasHeight = res.size.height;
          this.drawChart();
        }
      });
    },
    
    // 添加:解析单位的辅助函数，支持rpx、px和数字
    parseUnit(value) {
      if (typeof value === 'number') {
        return value;
      }
      
      if (typeof value === 'string') {
        if (value.endsWith('rpx')) {
          return uni.upx2px(parseInt(value));
        } else if (value.endsWith('px')) {
          return parseInt(value);
        } else if (value.endsWith('%')) {
          return value; // 百分比保持原样
        } else {
          return parseInt(value) || 0;
        }
      }
      
      return 0;
    },
    
    // 获取画布尺寸
    getCanvasSize() {
      return new Promise((resolve) => {
        // 修改:添加对canvasWidth是否已经为数字的判断
        if (typeof this.canvasWidth === 'number' && this.canvasWidth > 0) {
          resolve();
          return;
        }
        
        uni.createSelectorQuery()
          .in(this)
          .select('#' + this.cid)
          .boundingClientRect((res) => {
            if (res) {
              this.canvasWidth = res.width || this.width;
              this.canvasHeight = res.height || this.height;
            } else {
              // 修改:改进宽度计算逻辑，支持rpx单位
              this.canvasWidth = typeof this.width === 'string' && this.width.indexOf('%') !== -1 ? 
                (uni.upx2px(750) * parseInt(this.width) / 100) : 
                this.parseUnit(this.width);
              this.canvasHeight = this.parseUnit(this.height);
            }
            resolve();
          })
          .exec();
      });
    },
    
    // 绘制图表
    drawChart() {
      if (!this.options || !Object.keys(this.options).length) return;
      
      // 使用原生Canvas绘制饼图
      this.drawNativePie();
    },
    
    // 使用原生Canvas绘制饼图
    drawNativePie() {
      // #ifndef APP-NVUE
      const ctx = uni.createCanvasContext(this.cid, this);
      
      // 清空画布
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      
      // 获取数据
      const series = this.options.series && this.options.series[0] || {};
      const data = series.data || [];
      if (!data.length) return;
      
      // 计算总值
      const total = data.reduce((sum, item) => sum + item.value, 0);
      
      // 设置饼图参数
      let centerX = this.canvasWidth / 2;
      let centerY = this.canvasHeight / 2;
      
      // 处理legend位置对饼图中心的影响
      let leftLegendWidth = 0;
      let rightLegendWidth = 0;
      let topLegendHeight = 0;
      let bottomLegendHeight = 0;
      
      if (this.options.legend && this.options.legend.show !== false) {
        // 简单估算图例尺寸
        const legendItemWidth = 80; // 假设每个图例项宽度为80px
        const legendItemHeight = 20; // 假设每个图例项高度为20px
        
        // 遵循ECharts规范，使用top、bottom、left、right控制图例位置
        // 支持数字（像素值）、百分比字符串或关键字
        let legend = this.options.legend;
        const topValue = legend.top;
        const bottomValue = legend.bottom;
        const leftValue = legend.left;
        const rightValue = legend.right;
        
        const hasTop = topValue !== undefined && topValue !== 'auto';
        const hasBottom = bottomValue !== undefined && bottomValue !== 'auto';
        const hasLeft = leftValue !== undefined && leftValue !== 'auto';
        const hasRight = rightValue !== undefined && rightValue !== 'auto';
        
        // 如果没有设置top或bottom，则默认放在底部
        const isBottomDefault = !hasTop && !hasBottom;
        
        if (this.options.legend.orient === 'vertical') {
          const legendHeight = data.length * legendItemHeight;
          if (hasLeft) {
            leftLegendWidth = legendItemWidth;
            centerX = (this.canvasWidth + leftLegendWidth) / 2;
          } else if (hasRight) {
            rightLegendWidth = legendItemWidth;
            centerX = (this.canvasWidth - rightLegendWidth) / 2;
          }
        } else { // horizontal
          const legendWidth = data.length * legendItemWidth;
          if (hasTop) {
            // 计算top值（支持数字和百分比）
            let topPos = 10;
            if (typeof topValue === 'number') {
              topPos = topValue;
            } else if (typeof topValue === 'string' && topValue.endsWith('%')) {
              topPos = (parseInt(topValue) / 100) * this.canvasHeight;
            }
            topLegendHeight = legendItemHeight * 2; // 给图例更多空间
            centerY = (this.canvasHeight + topLegendHeight) / 2;
          } else if (hasBottom || isBottomDefault) {
            // 计算bottom值（支持数字和百分比）
            let bottomPos = 10;
            if (typeof bottomValue === 'number') {
              bottomPos = bottomValue;
            } else if (typeof bottomValue === 'string' && bottomValue.endsWith('%')) {
              bottomPos = (parseInt(bottomValue) / 100) * this.canvasHeight;
            } else if (isBottomDefault) {
              bottomPos = 10; // 默认底部距离
            }
            bottomLegendHeight = legendItemHeight * 2;
            centerY = (this.canvasHeight - bottomLegendHeight) / 2;
          }
        }
      }
      
      // 处理半径，考虑图例占用空间
      let radiusValue = series.radius || '65%'; // 增大默认半径到70%
      
      // 支持内外半径数组格式 ['40%', '70%']
      let innerRadius, outerRadius;
      if (Array.isArray(radiusValue)) {
        innerRadius = radiusValue[0];
        outerRadius = radiusValue[1];
      } else {
        innerRadius = 0;
        outerRadius = radiusValue;
      }
      
      // 处理百分比格式
      if (typeof outerRadius === 'string' && outerRadius.endsWith('%')) {
        outerRadius = parseFloat(outerRadius) / 100;
      } else if (typeof outerRadius === 'number') {
        outerRadius = outerRadius / Math.min(this.canvasWidth, this.canvasHeight);
      }
      
      if (typeof innerRadius === 'string' && innerRadius.endsWith('%')) {
        innerRadius = parseFloat(innerRadius) / 100;
      } else if (typeof innerRadius === 'number') {
        innerRadius = innerRadius / Math.min(this.canvasWidth, this.canvasHeight);
      }
      
      // 计算可用于饼图的尺寸
      const availableWidth = this.canvasWidth - leftLegendWidth - rightLegendWidth - 20; // 减去边距
      const availableHeight = this.canvasHeight - topLegendHeight - bottomLegendHeight - 20;
      const outerRadiusPx = Math.min(availableWidth, availableHeight) * (typeof outerRadius === 'number' ? outerRadius : 0.7) / 2;
      const innerRadiusPx = outerRadiusPx * (innerRadius || 0);
      
      // 默认颜色列表
      const defaultColors = [
        '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
        '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
      ];
      
      // 绘制饼图
      let startAngle = -Math.PI / 2; // 从顶部开始绘制
      const sectorAngles = []; // 保存每个扇形的角度信息
      
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const percent = item.value / total;
        const endAngle = startAngle + percent * 2 * Math.PI;
        
        // 保存扇形角度信息
        sectorAngles.push({
          startAngle,
          endAngle,
          middleAngle: (startAngle + endAngle) / 2,
          percent,
          data: item
        });
        
        // 设置扇形样式
        ctx.beginPath();
        
        // 如果是环形图，绘制内外弧
        if (innerRadiusPx > 0) {
          // 绘制外弧
          ctx.arc(centerX, centerY, outerRadiusPx, startAngle, endAngle);
          // 绘制内弧（反向绘制）
          ctx.arc(centerX, centerY, innerRadiusPx, endAngle, startAngle, true);
        } else {
          // 绘制实心饼图
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, outerRadiusPx, startAngle, endAngle);
          ctx.closePath();
        }
        
        ctx.setFillStyle(item.color || item.itemStyle?.color || defaultColors[i % defaultColors.length]);
        ctx.fill();
        
        // 绘制边框 (支持 itemStyle.borderWidth 和 itemStyle.borderColor)
        if (series.itemStyle?.borderWidth || item.itemStyle?.borderWidth) {
          const borderWidth = item.itemStyle?.borderWidth !== undefined ? 
            item.itemStyle.borderWidth : series.itemStyle.borderWidth;
          const borderColor = item.itemStyle?.borderColor || 
            series.itemStyle.borderColor || '#ffffff';
          
          ctx.setLineWidth(borderWidth);
          ctx.setStrokeStyle(borderColor);
          ctx.stroke();
        } else {
          // 默认边框
          ctx.setStrokeStyle('#ffffff');
          ctx.setLineWidth(2);
          ctx.stroke();
        }
        
        startAngle = endAngle;
      }
      
      // 绘制带引导线的标签
      this.drawLabelsWithLines(ctx, sectorAngles, centerX, centerY, outerRadiusPx, defaultColors, data);
      
      // 绘制legend
      if (this.options.legend && this.options.legend.show !== false) {
        this.drawLegend(ctx, data, defaultColors);
      }
      
      ctx.draw(false);
      
      // 保存图表实例信息
      this.chartInstance = {
        type: 'native-pie',
        data: data,
        centerX: centerX,
        centerY: centerY,
        radius: outerRadiusPx,
        innerRadius: innerRadiusPx,
        total: total,
        sectorAngles: sectorAngles, // 保存扇形角度信息用于点击判断
        destroy: () => {} // 空销毁函数
      };
      // #endif
    },
    
    // 绘制带引导线的标签
    drawLabelsWithLines(ctx, sectorAngles, centerX, centerY, radius, defaultColors, data) {
      // 标签和引导线相关参数
      const labelRadius = radius + 30; // 标签距离中心的距离
      const lineBreakRadius = radius + 15; // 引导线转折点距离中心的距离
      
      ctx.setFontSize(12);
      ctx.setTextBaseline('middle');
      
      for (let i = 0; i < sectorAngles.length; i++) {
        const sector = sectorAngles[i];
        const item = sector.data;
        const middleAngle = sector.middleAngle;
        
        // 计算扇形中点坐标（用于引导线起点）
        const startX = centerX + radius * Math.cos(middleAngle);
        const startY = centerY + radius * Math.sin(middleAngle);
        
        // 计算引导线转折点坐标
        const breakX = centerX + lineBreakRadius * Math.cos(middleAngle);
        const breakY = centerY + lineBreakRadius * Math.sin(middleAngle);
        
        // 计算标签位置（引导线终点）
        const endX = centerX + labelRadius * Math.cos(middleAngle);
        const endY = centerY + labelRadius * Math.sin(middleAngle);
        
        // 添加折弯效果 - 根据角度调整标签的x坐标
        let labelX = endX;
        let breakPointX = breakX;
        const horizontalOffset = 20; // 水平偏移量保持不变
        
        // 根据标签位置调整折弯方向
        if (Math.abs(middleAngle) < Math.PI / 2) {
          // 右侧标签 - 折弯向右
          labelX = endX + horizontalOffset;
          breakPointX = breakX + horizontalOffset;
        } else {
          // 左侧标签 - 折弯向左
          labelX = endX - horizontalOffset;
          breakPointX = breakX - horizontalOffset;
        }
        
        // 绘制引导线（带折弯）
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(breakX, breakY);
        ctx.lineTo(labelX, endY); // 现在末端是完全水平的
        ctx.setStrokeStyle('#666666');
        ctx.setLineWidth(1);
        ctx.stroke();
        
        // 绘制标签背景
        const text = item.name;
        ctx.setFontSize(12);
        const textWidth = ctx.measureText(text).width;
        
        // 根据标签位置调整对齐方式
        if (Math.abs(middleAngle) < Math.PI / 2) {
          // 右侧标签
          ctx.setFillStyle('#ffffff');
          ctx.fillRect(labelX, endY - 10, textWidth + 10, 20);
          ctx.setFillStyle('#333333');
          ctx.setTextAlign('left');
          ctx.fillText(text, labelX + 5, endY);
        } else {
          // 左侧标签
          ctx.setFillStyle('#ffffff');
          ctx.fillRect(labelX - textWidth - 10, endY - 10, textWidth + 10, 20);
          ctx.setFillStyle('#333333');
          ctx.setTextAlign('right');
          ctx.fillText(text, labelX - 5, endY);
        }
      }
    },
    
    // 绘制legend
    drawLegend(ctx, data, defaultColors) {
      const legend = this.options.legend;
      if (!legend || legend.show === false) return;
      
      const itemHeight = 14;
      const itemSpacing = 10;
      let startX, startY;
      
      // 遵循ECharts规范，使用top、bottom、left、right控制图例位置
      // 支持数字（像素值）、百分比字符串或关键字
      const topValue = legend.top;
      const bottomValue = legend.bottom;
      const leftValue = legend.left;
      const rightValue = legend.right;
      
      const hasTop = topValue !== undefined && topValue !== 'auto';
      const hasBottom = bottomValue !== undefined && bottomValue !== 'auto';
      const hasLeft = leftValue !== undefined && leftValue !== 'auto';
      const hasRight = rightValue !== undefined && rightValue !== 'auto';
      
      // 默认将图例放在底部
      const isBottomDefault = !hasTop && !hasBottom;
      
      if (legend.orient === 'vertical') {
        // 垂直排列
        const legendWidth = 80;
        const legendHeight = data.length * (itemHeight + itemSpacing);
        
        if (hasLeft) {
          // 计算left值（支持数字和百分比）
          if (typeof leftValue === 'number') {
            startX = leftValue;
          } else if (typeof leftValue === 'string' && leftValue.endsWith('%')) {
            startX = (parseInt(leftValue) / 100) * this.canvasWidth;
          } else {
            startX = 10;
          }
        } else if (hasRight) {
          // 计算right值（支持数字和百分比）
          let rightPos = 10;
          if (typeof rightValue === 'number') {
            rightPos = rightValue;
          } else if (typeof rightValue === 'string' && rightValue.endsWith('%')) {
            rightPos = (parseInt(rightValue) / 100) * this.canvasWidth;
          }
          startX = this.canvasWidth - legendWidth - rightPos;
        } else {
          startX = this.canvasWidth / 2 - legendWidth / 2;
        }
        
        if (hasTop) {
          // 计算top值（支持数字和百分比）
          if (typeof topValue === 'number') {
            startY = topValue;
          } else if (typeof topValue === 'string' && topValue.endsWith('%')) {
            startY = (parseInt(topValue) / 100) * this.canvasHeight;
          } else {
            startY = 10;
          }
        } else if (hasBottom || isBottomDefault) { // 默认在底部
          // 计算bottom值（支持数字和百分比）
          let bottomPos = 10;
          if (typeof bottomValue === 'number') {
            bottomPos = bottomValue;
          } else if (typeof bottomValue === 'string' && bottomValue.endsWith('%')) {
            bottomPos = (parseInt(bottomValue) / 100) * this.canvasHeight;
          } else if (isBottomDefault) {
            bottomPos = 10; // 默认底部距离
          }
          startY = this.canvasHeight - legendHeight - bottomPos;
        } else {
          startY = this.canvasHeight / 2 - legendHeight / 2;
        }
      } else {
        // 水平排列
        const legendWidth = data.length * 70; // 增加图例项宽度
        const legendHeight = itemHeight;
        
        if (hasLeft) {
          // 计算left值（支持数字和百分比）
          if (typeof leftValue === 'number') {
            startX = leftValue;
          } else if (typeof leftValue === 'string' && leftValue.endsWith('%')) {
            startX = (parseInt(leftValue) / 100) * this.canvasWidth;
          } else {
            startX = 10;
          }
        } else if (hasRight) {
          // 计算right值（支持数字和百分比）
          let rightPos = 10;
          if (typeof rightValue === 'number') {
            rightPos = rightValue;
          } else if (typeof rightValue === 'string' && rightValue.endsWith('%')) {
            rightPos = (parseInt(rightValue) / 100) * this.canvasWidth;
          }
          startX = this.canvasWidth - legendWidth - rightPos;
        } else {
          startX = this.canvasWidth / 2 - legendWidth / 2;
        }
        
        if (hasTop) {
          // 计算top值（支持数字和百分比）
          if (typeof topValue === 'number') {
            startY = topValue;
          } else if (typeof topValue === 'string' && topValue.endsWith('%')) {
            startY = (parseInt(topValue) / 100) * this.canvasHeight;
          } else {
            startY = 10;
          }
        } else if (hasBottom || isBottomDefault) { // 默认在底部
          // 计算bottom值（支持数字和百分比）
          let bottomPos = 10;
          if (typeof bottomValue === 'number') {
            bottomPos = bottomValue;
          } else if (typeof bottomValue === 'string' && bottomValue.endsWith('%')) {
            bottomPos = (parseInt(bottomValue) / 100) * this.canvasHeight;
          } else if (isBottomDefault) {
            bottomPos = 10; // 默认底部距离
          }
          startY = this.canvasHeight - legendHeight - bottomPos;
        } else {
          startY = 10; // 默认在顶部
        }
      }
      
      ctx.setFontSize(12);
      ctx.setTextBaseline('middle');
      
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        let x, y;
        
        if (legend.orient === 'vertical') {
          x = startX;
          y = startY + i * (itemHeight + itemSpacing);
        } else {
          x = startX + i * 70; // 增加图例项间距
          y = startY;
        }
        
        // 绘制颜色方块
        ctx.setFillStyle(item.color || defaultColors[i % defaultColors.length]);
        ctx.fillRect(x, y - 6, 12, 12);
        
        // 绘制文字
        ctx.setFillStyle('#333');
        ctx.setTextAlign('left');
        ctx.fillText(item.name, x + 18, y);
      }
    },
    
    // 点击事件
    tap(e) {
      if (this.chartInstance && this.chartInstance.type === 'native-pie') {
        // 原生饼图点击处理
        const { x, y } = e.touches[0];
        const dx = x - this.chartInstance.centerX;
        const dy = y - this.chartInstance.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 判断点击是否在饼图范围内
        if (distance <= this.chartInstance.radius) {
          const angle = (Math.atan2(dy, dx) + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
          let cumulativeAngle = 0;
          let clickedIndex = -1;
          
          // 查找点击的扇形
          for (let i = 0; i < this.chartInstance.data.length; i++) {
            const item = this.chartInstance.data[i];
            const sectorAngle = (item.value / this.chartInstance.total) * 2 * Math.PI;
            cumulativeAngle += sectorAngle;
            
            if (angle <= cumulativeAngle) {
              clickedIndex = i;
              break;
            }
          }
          
          if (clickedIndex !== -1) {
            const clickedData = this.chartInstance.data[clickedIndex];
            this.$emit('click', {
              name: clickedData.name,
              value: clickedData.value,
              dataIndex: clickedIndex,
              data: clickedData,
              event: e
            });
            
            // 触发tooltip事件
            if (this.options.tooltip && this.options.tooltip.trigger === 'item') {
              this.$emit('tooltipShow', {
                name: clickedData.name,
                value: clickedData.value,
                dataIndex: clickedIndex,
                data: clickedData
              });
            }
          }
        }
      }
    },
    
    // 移动事件
    move(e) {
      // 可以添加触摸移动逻辑
    },
    
    // 触摸结束事件
    touchEnd(e) {
      // 可以添加触摸结束逻辑
    },
    
    // 更新数据
    updateData(data) {
      if (this.chartInstance) {
        if (this.chartInstance.type === 'native-pie') {
          // 原生饼图更新数据
          this.options.series[0].data = data;
          this.drawNativePie();
        }
      }
    },
    
    // 获取图表实例
    getChartInstance() {
      return this.chartInstance;
    }
  }
};
</script>

<style scoped>
.u-charts-pie {
  position: relative;
  width: 100%;
}

.chart-title {
  padding: 10px 0;
}

.main-title {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.sub-title {
  display: block;
  opacity: 0.8;
}
</style>