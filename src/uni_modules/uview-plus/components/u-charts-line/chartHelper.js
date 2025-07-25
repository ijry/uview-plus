// chartHelper.js
class ChartHelper {
  constructor() {
    this.defaultColors = [
      '#5470c6', '#91cc75', '#fac858', '#ee6666', 
      '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
    ];
  }

  /**
   * 计算数据范围
   * @param {Array} series - 系列数据
   * @returns {Object} 包含最小值和最大值的对象
   */
  calculateDataRange(series) {
    let minY = Number.MAX_VALUE;
    let maxY = Number.MIN_VALUE;
    
    if (!series || !Array.isArray(series)) {
      return { minY: 0, maxY: 1 };
    }
    
    let hasData = false;
    
    series.forEach(serie => {
      if (serie && serie.type === 'line' && serie.data && Array.isArray(serie.data)) {
        serie.data.forEach(value => {
          // 如果数据是对象形式 {value: 123}
          const actualValue = typeof value === 'object' && value !== null ? value.value : value;
          if (typeof actualValue === 'number' && !isNaN(actualValue)) {
            if (actualValue < minY) minY = actualValue;
            if (actualValue > maxY) maxY = actualValue;
            hasData = true;
          }
        });
      }
    });
    
    // 如果没有有效数据，设置默认值
    if (!hasData) {
      return { minY: 0, maxY: 1 };
    }
    
    // 添加边距
    const range = maxY - minY;
    if (range === 0) {
      minY -= 1;
      maxY += 1;
    } else {
      const padding = range * 0.1;
      minY -= padding;
      maxY += padding;
    }
    
    return { minY, maxY };
  }

  /**
   * 处理X轴数据
   * @param {Object} xAxis - X轴配置
   * @param {Array} series - 系列数据
   * @returns {Array} X轴数据数组
   */
  processXAxisData(xAxis, series) {
    let xAxisData = [];
    if (xAxis && xAxis.data && Array.isArray(xAxis.data)) {
      xAxisData = xAxis.data;
    } else if (series && series.length > 0 && series[0].data && Array.isArray(series[0].data)) {
      xAxisData = series[0].data.map((_, index) => index);
    }
    return xAxisData;
  }

  /**
   * 绘制网格
   * @param {CanvasRenderingContext2D} ctx - Canvas上下文
   * @param {Object} grid - 网格配置
   * @param {Number} canvasWidth - 画布宽度
   * @param {Number} canvasHeight - 画布高度
   * @param {Number} xAxisCount - X轴数据点数量
   * @param {Number} minY - Y轴最小值
   * @param {Number} maxY - Y轴最大值
   */
  drawGrid(ctx, grid, canvasWidth, canvasHeight, xAxisCount, minY, maxY) {
    // 参数检查
    if (!ctx || !grid) return;
    
    const chartWidth = canvasWidth - (grid.left || 0) - (grid.right || 0);
    const chartHeight = canvasHeight - (grid.top || 0) - (grid.bottom || 0);
    
    // 避免除以零的情况
    if (chartWidth <= 0 || chartHeight <= 0) return;
    
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;

   
    // 绘制水平网格线
    const yGridCount = 5;
    for (let i = 0; i <= yGridCount; i++) {
      const y = (grid.top || 0) + chartHeight - (i / yGridCount) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(grid.left || 0, y);
      ctx.lineTo((grid.left || 0) + chartWidth, y);
      ctx.stroke();
    }
    
    // 绘制垂直网格线
    const xGridCount = Math.min(Math.max(xAxisCount || 0, 1), 6);
    for (let i = 0; i < xGridCount; i++) {
      const index = Math.floor(i * ((xAxisCount || 1) - 1) / (xGridCount - 1));
      const x = (grid.left || 0) + (index / Math.max((xAxisCount || 1) - 1, 1)) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, grid.top || 0);
      ctx.lineTo(x, (grid.top || 0) + chartHeight);
      ctx.stroke();
    }
  }

  /**
   * 绘制坐标轴
   * @param {CanvasRenderingContext2D} ctx - Canvas上下文
   * @param {Object} grid - 网格配置
   * @param {Number} canvasWidth - 画布宽度
   * @param {Number} canvasHeight - 画布高度
   * @param {Array} xAxisData - X轴数据
   * @param {Number} minY - Y轴最小值
   * @param {Number} maxY - Y轴最大值
   * @param {Object} xAxisOpt - X轴配置
   * @param {Object} yAxisOpt - Y轴配置
   */
  drawAxis(ctx, grid, canvasWidth, canvasHeight, xAxisData, minY, maxY, xAxisOpt, yAxisOpt) {
    // 参数检查
    if (!ctx || !grid) return;
    
    const chartWidth = canvasWidth - (grid.left || 0) - (grid.right || 0);
    const chartHeight = canvasHeight - (grid.top || 0) - (grid.bottom || 0);
    
    // 避免除以零的情况
    if (chartWidth <= 0 || chartHeight <= 0) return;
    
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // X轴
    ctx.beginPath();
    ctx.moveTo(grid.left || 0, canvasHeight - (grid.bottom || 0));
    ctx.lineTo((grid.left || 0) + chartWidth, canvasHeight - (grid.bottom || 0));
    ctx.stroke();
    
    // Y轴
    ctx.beginPath();
    ctx.moveTo(grid.left || 0, grid.top || 0);
    ctx.lineTo(grid.left || 0, canvasHeight - (grid.bottom || 0));
    ctx.stroke();
    
    // 绘制X轴标签
    const xAxisLabelColor = (xAxisOpt && xAxisOpt.axisLabel && xAxisOpt.axisLabel.color) || '#666';
    const xAxisFontSize = (xAxisOpt && xAxisOpt.axisLabel && xAxisOpt.axisLabel.fontSize) || 12;
    ctx.fillStyle = xAxisLabelColor;
    ctx.font = `${xAxisFontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    if (xAxisData && Array.isArray(xAxisData) && xAxisData.length > 0) {
      const xLabelCount = Math.min(xAxisData.length, 6);
      for (let i = 0; i < xLabelCount; i++) {
        const index = Math.floor(i * (xAxisData.length - 1) / (xLabelCount - 1));
        const x = (grid.left || 0) + (index / (xAxisData.length - 1)) * chartWidth;
        const label = xAxisData[index] !== undefined ? xAxisData[index] : index;
        ctx.fillText(String(label), x, canvasHeight - (grid.bottom || 0) + 10);
      }
    }
    
    // 绘制Y轴标签
    const yAxisLabelColor = (yAxisOpt && yAxisOpt.axisLabel && yAxisOpt.axisLabel.color) || '#666';
    ctx.fillStyle = yAxisLabelColor;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    const yLabelCount = 5;
    for (let i = 0; i <= yLabelCount; i++) {
      const value = (minY || 0) + ((maxY || 1) - (minY || 0)) * (i / yLabelCount);
      const y = (grid.top || 0) + chartHeight - (i / yLabelCount) * chartHeight;
      ctx.fillText(value.toFixed(1), (grid.left || 0) - 10, y);
    }
  }

  /**
   * 绘制标题
   * @param {CanvasRenderingContext2D} ctx - Canvas上下文
   * @param {Object} titleOption - 标题配置
   * @param {Number} canvasWidth - 画布宽度
   * @returns {Number} 标题高度
   */
  drawTitle(ctx, titleOption, canvasWidth) {
    if (!ctx || !titleOption || !titleOption.text) return 0;
    
    const fontSize = (titleOption.textStyle && titleOption.textStyle.fontSize) || 16;
    const fontFamily = (titleOption.textStyle && titleOption.textStyle.fontFamily) || 'sans-serif';
    const color = (titleOption.textStyle && titleOption.textStyle.color) || '#333';
    
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const x = (canvasWidth || 0) / 2;
    const y = 10;
    
    ctx.fillText(titleOption.text, x, y);
    
    return 40; // 返回标题占用的高度
  }

  /**
   * 绘制图例
   * @param {CanvasRenderingContext2D} ctx - Canvas上下文
   * @param {Object} legendOption - 图例配置
   * @param {Object} grid - 网格配置
   * @param {Number} canvasWidth - 画布宽度
   * @param {Array} colors - 颜色数组
   */
  drawLegend(ctx, legendOption, grid, canvasWidth, colors) {
    if (!ctx || !legendOption || !legendOption.data || !Array.isArray(legendOption.data) || legendOption.data.length === 0) return;
    
    const legendTop = (grid.top || 0) - 25; // 在网格上方绘制图例
    const legendLeft = grid.left || 0;
    const itemHeight = 20;
    const itemWidth = 100;
    
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    legendOption.data.forEach((name, index) => {
      const color = colors[index % colors.length];
      const x = legendLeft + (index % 3) * itemWidth;
      const y = legendTop + Math.floor(index / 3) * itemHeight;
      
      // 绘制线条
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.moveTo(x, y);
      ctx.lineTo(x + 20, y);
      ctx.stroke();
      
      // 绘制图例名称
      const textColor = (legendOption.textStyle && legendOption.textStyle.color) || '#666';
      ctx.fillStyle = textColor;
      ctx.fillText(String(name), x + 25, y);
    });
  }

  /**
   * 获取颜色
   * @param {Number} index - 索引
   * @returns {String} 颜色值
   */
  getColor(index) {
    return this.defaultColors[index % this.defaultColors.length];
  }

  /**
   * 将屏幕坐标转换为数据坐标
   * @param {Number} x - 屏幕X坐标
   * @param {Number} y - 屏幕Y坐标
   * @param {Object} grid - 网格配置
   * @param {Number} canvasWidth - 画布宽度
   * @param {Number} canvasHeight - 画布高度
   * @param {Array} xAxisData - X轴数据
   * @param {Number} minY - Y轴最小值
   * @param {Number} maxY - Y轴最大值
   * @returns {Object} 数据坐标
   */
  screenToDataCoords(x, y, grid, canvasWidth, canvasHeight, xAxisData, minY, maxY) {
    if (!grid || !xAxisData) return { dataX: 0, dataY: 0 };
    
    const chartWidth = canvasWidth - (grid.left || 0) - (grid.right || 0);
    const chartHeight = canvasHeight - (grid.top || 0) - (grid.bottom || 0);
    
    // 计算相对于图表区域的坐标
    const chartX = x - (grid.left || 0);
    const chartY = y - (grid.top || 0);
    
    // 转换为数据坐标
    const dataX = (chartX / (chartWidth || 1)) * ((xAxisData.length || 1) - 1);
    const dataY = (maxY || 1) - (chartY / (chartHeight || 1)) * ((maxY || 1) - (minY || 0));
    
    return { dataX, dataY };
  }

  /**
   * 将数据坐标转换为屏幕坐标
   * @param {Number} dataX - 数据X坐标
   * @param {Number} dataY - 数据Y坐标
   * @param {Object} grid - 网格配置
   * @param {Number} canvasWidth - 画布宽度
   * @param {Number} canvasHeight - 画布高度
   * @param {Array} xAxisData - X轴数据
   * @param {Number} minY - Y轴最小值
   * @param {Number} maxY - Y轴最大值
   * @returns {Object} 屏幕坐标
   */
  dataToScreenCoords(dataX, dataY, grid, canvasWidth, canvasHeight, xAxisData, minY, maxY) {
    if (!grid || !xAxisData) return { x: 0, y: 0 };
    
    const chartWidth = canvasWidth - (grid.left || 0) - (grid.right || 0);
    const chartHeight = canvasHeight - (grid.top || 0) - (grid.bottom || 0);
    
    // 转换为屏幕坐标
    const x = (grid.left || 0) + (dataX / Math.max((xAxisData.length || 1) - 1, 1)) * chartWidth;
    const y = (grid.top || 0) + chartHeight - (((dataY || 0) - (minY || 0)) / Math.max((maxY || 1) - (minY || 0), 1)) * chartHeight;
    
    return { x, y };
  }
}

// 导出单例
export default new ChartHelper();