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
      if (serie && (serie.type === 'line' || serie.type === 'bar') && serie.data && Array.isArray(serie.data)) {
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
   * 计算适合的Y轴刻度值
   * @param {Number} min - 最小值
   * @param {Number} max - 最大值
   * @param {Number} tickCount - 刻度数量
   * @returns {Object} 包含调整后最小值、最大值和刻度间隔的对象
   */
  calculateYAxisTicks(min, max, tickCount = 5) {
    // 当最小值和最大值相等时的处理
    if (min === max) {
      if (min === 0) {
        // 如果值为0，设置合理的显示范围
        return {
          min: 0,
          max: 4,
          step: 1,
          tickCount: 4
        };
      } else {
        // 如果值不为0，以该值为中心设置显示范围
        const padding = Math.abs(min) * 0.1 || 1;
        return {
          min: min - padding,
          max: max + padding,
          step: padding * 2 / 4,
          tickCount: 4
        };
      }
    }
    
    // 计算近似的步长
    const range = max - min;
    const approxStep = range / tickCount;
    
    // 计算步长的量级
    const magnitude = Math.pow(10, Math.floor(Math.log10(approxStep)));
    
    // 标准步长值
    const stdSteps = [1, 2, 5, 10];
    let step = stdSteps[0] * magnitude;
    
    // 选择最合适的步长
    for (const stdStep of stdSteps) {
      const tempStep = stdStep * magnitude;
      if (tempStep >= approxStep) {
        step = tempStep;
        break;
      }
    }
    
    // 调整最小值和最大值到步长的倍数
    const adjustedMin = Math.floor(min / step) * step;
    const adjustedMax = Math.ceil(max / step) * step;
    
    // 重新计算实际的刻度数量
    const actualTickCount = Math.round((adjustedMax - adjustedMin) / step);
    
    // 确保至少有2个刻度
    if (actualTickCount === 0) {
      return {
        min: min,
        max: max + 1,
        step: 1,
        tickCount: 1
      };
    }
    
    return {
      min: adjustedMin,
      max: adjustedMax,
      step: step,
      tickCount: actualTickCount
    };
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
   * @param {Boolean} drawVerticalLines - 是否绘制垂直线
   * @param {Number} xAxisPadding - X轴左右padding
   */
  drawGrid(ctx, grid, canvasWidth, canvasHeight, xAxisCount, minY, maxY, drawVerticalLines = true, xAxisPadding = 0) {
    // 参数检查
    if (!ctx || !grid) return;
    
    const chartWidth = canvasWidth - (grid.left || 0) - (grid.right || 0);
    const chartHeight = canvasHeight - (grid.top || 0) - (grid.bottom || 0);
    
    // 避免除以零的情况
    if (chartWidth <= 0 || chartHeight <= 0) return;
    
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;

    // 计算Y轴刻度
    const yAxisTicks = this.calculateYAxisTicks(minY, maxY, 5);
   
    // 绘制水平网格线 (使用调整后的Y轴范围)
    for (let i = 0; i <= yAxisTicks.tickCount; i++) {
      const value = yAxisTicks.min + i * yAxisTicks.step;
      const ratio = (value - yAxisTicks.min) / (yAxisTicks.max - yAxisTicks.min);
      const y = (grid.top || 0) + chartHeight - ratio * chartHeight;
      ctx.beginPath();
      ctx.moveTo(grid.left || 0, y);
      ctx.lineTo((grid.left || 0) + chartWidth, y);
      ctx.stroke();
    }
    
    // 绘制垂直网格线 (每个数据点一条线)
    if (drawVerticalLines && xAxisCount > 0) {
      for (let i = 0; i < xAxisCount; i++) {
        const x = (grid.left || 0) + xAxisPadding + (i / (xAxisCount - 1)) * (chartWidth - 2 * xAxisPadding);
        ctx.beginPath();
        ctx.moveTo(x, grid.top || 0);
        ctx.lineTo(x, (grid.top || 0) + chartHeight);
        ctx.stroke();
      }
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
   * @param {String} chartType - 图表类型
   * @param {Number} xAxisPadding - X轴左右padding
   */
  drawAxis(ctx, grid, canvasWidth, canvasHeight, xAxisData, minY, maxY, xAxisOpt, yAxisOpt, chartType = 'line', xAxisPadding = 0) {
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
      // 对于柱状图，需要调整X轴标签位置，避免顶边
      if (chartType === 'bar') {
        this.drawBarXAxisLabels(ctx, xAxisData, grid, chartWidth, canvasHeight, xAxisFontSize, xAxisPadding);
      } else {
        // 折线图保持原来的标签绘制方式
        // 对于少量标签，全部显示
        if (xAxisData.length <= 5) {
          xAxisData.forEach((label, i) => {
            const x = (grid.left || 0) + xAxisPadding + (i / Math.max(xAxisData.length - 1, 1)) * (chartWidth - 2 * xAxisPadding);
            ctx.fillText(String(label), x, canvasHeight - (grid.bottom || 0) + 10);
          });
        } else {
          // 对于较多标签，采用优化的显示策略
          this.drawXAxisLabels(ctx, xAxisData, grid, chartWidth, canvasHeight, xAxisFontSize, xAxisPadding);
        }
      }
    }
    
    // 绘制Y轴标签
    const yAxisLabelColor = (yAxisOpt && yAxisOpt.axisLabel && yAxisOpt.axisLabel.color) || '#666';
    ctx.fillStyle = yAxisLabelColor;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    // 计算Y轴刻度值
    const yAxisTicks = this.calculateYAxisTicks(minY, maxY, 5);
    
    // 保存调整后的Y轴范围，供其他地方使用
    this.adjustedYMin = yAxisTicks.min;
    this.adjustedYMax = yAxisTicks.max;
    
    // 绘制Y轴标签 (使用调整后的Y轴范围)
    for (let i = 0; i <= yAxisTicks.tickCount; i++) {
      const value = yAxisTicks.min + i * yAxisTicks.step;
      const ratio = (value - yAxisTicks.min) / (yAxisTicks.max - yAxisTicks.min);
      const y = (grid.top || 0) + chartHeight - ratio * chartHeight;
      ctx.fillText(Math.round(value).toString(), (grid.left || 0) - 10, y);
    }
  }

  /**
   * 绘制柱状图X轴标签（避免顶边）
   * @param {CanvasRenderingContext2D} ctx - Canvas上下文
   * @param {Array} xAxisData - X轴数据
   * @param {Object} grid - 网格配置
   * @param {Number} chartWidth - 图表宽度
   * @param {Number} canvasHeight - 画布高度
   * @param {Number} fontSize - 字体大小
   * @param {Number} xAxisPadding - X轴左右padding
   */
  drawBarXAxisLabels(ctx, xAxisData, grid, chartWidth, canvasHeight, fontSize, xAxisPadding = 0) {
    const labelCount = xAxisData.length;
    
    if (labelCount <= 0) return;
    
    // 对于柱状图，需要在每个柱子的中心位置显示标签
    xAxisData.forEach((label, i) => {
      // 计算标签位置，使其居中显示在柱子下方，并确保不超出边界
      const x = (grid.left || 0) + xAxisPadding + ((i + 0.5) / labelCount) * (chartWidth - 2 * xAxisPadding);
      ctx.fillText(String(label), x, canvasHeight - (grid.bottom || 0) + 10);
    });
  }

  /**
   * 绘制X轴标签（优化版本）
   * @param {CanvasRenderingContext2D} ctx - Canvas上下文
   * @param {Array} xAxisData - X轴数据
   * @param {Object} grid - 网格配置
   * @param {Number} chartWidth - 图表宽度
   * @param {Number} canvasHeight - 画布高度
   * @param {Number} fontSize - 字体大小
   * @param {Number} xAxisPadding - X轴左右padding
   */
  drawXAxisLabels(ctx, xAxisData, grid, chartWidth, canvasHeight, fontSize, xAxisPadding = 0) {
    const labelCount = xAxisData.length;
    
    // 根据标签数量和图表宽度动态计算每个标签的估计宽度
    // 假设每个字符大约占用 fontSize*0.6 的宽度，加上一些边距
    let totalLabelLength = 0;
    xAxisData.forEach(label => {
      totalLabelLength += String(label).length;
    });
    
    // 平均每个标签的字符数
    const avgLabelLength = totalLabelLength / labelCount;
    // 估算每个标签的宽度 (字符数 * 每个字符的宽度 + 边距)
    const estimatedLabelWidth = Math.ceil(avgLabelLength * fontSize * 0.6 + 10);
    
    // 计算最多可以显示多少个标签
    const maxLabels = Math.max(Math.min(labelCount, Math.floor((chartWidth - 2 * xAxisPadding) / estimatedLabelWidth)), 2);
    
    // 确定需要显示的标签索引
    const indicesToShow = [];
    
    // 总是显示第一个和最后一个标签
    if (labelCount > 0) {
      indicesToShow.push(0);
      if (labelCount > 1) {
        indicesToShow.push(labelCount - 1);
      }
    }
    
    // 如果可以显示更多标签
    if (maxLabels >= 3 && labelCount > 2) {
      // 计算中间需要显示的标签数量
      const middleLabels = Math.min(maxLabels - 2, labelCount - 2);
      
      if (middleLabels > 0) {
        // 均匀分布中间标签
        const step = (labelCount - 1) / (middleLabels + 1);
        for (let i = 1; i <= middleLabels; i++) {
          const index = Math.round(i * step);
          // 确保索引在有效范围内且不重复
          if (index > 0 && index < labelCount - 1 && !indicesToShow.includes(index)) {
            indicesToShow.push(index);
          }
        }
      }
    }
    
    // 按索引顺序排序
    indicesToShow.sort((a, b) => a - b);
    
    // 显示选定的标签
    indicesToShow.forEach(index => {
      if (index >= 0 && index < labelCount) {
        const x = (grid.left || 0) + xAxisPadding + (index / Math.max(labelCount - 1, 1)) * (chartWidth - 2 * xAxisPadding);
        const label = xAxisData[index] !== undefined ? xAxisData[index] : index;
        ctx.fillText(String(label), x, canvasHeight - (grid.bottom || 0) + 10);
      }
    });
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
    
    // 计算标题实际占用的高度（包括上下边距）
    return fontSize + 20;
  }

  /**
   * 绘制图例
   * @param {CanvasRenderingContext2D} ctx - Canvas上下文
   * @param {Object} legendOption - 图例配置
   * @param {Object} grid - 网格配置
   * @param {Number} canvasWidth - 画布宽度
   * @param {Array} colors - 颜色数组
   */
  drawLegend(ctx, legendOption, grid, canvasWidth, colors, canvasHeight, titleHeight = 0) {
    if (!ctx || !legendOption || !legendOption.data || !Array.isArray(legendOption.data) || legendOption.data.length === 0) return 0; // 返回图例高度
    
    // 遵循ECharts规范，使用top、bottom、left、right控制图例位置
    // 支持数字（像素值）、百分比字符串或关键字
    const topValue = legendOption.top;
    const bottomValue = legendOption.bottom;
    const leftValue = legendOption.left;
    const rightValue = legendOption.right;
    
    const hasTop = topValue !== undefined && topValue !== 'auto';
    const hasBottom = bottomValue !== undefined && bottomValue !== 'auto';
    const hasLeft = leftValue !== undefined && leftValue !== 'auto';
    const hasRight = rightValue !== undefined && rightValue !== 'auto';
    
    // 默认将图例放在底部
    const isBottomDefault = !hasTop && !hasBottom;
    
    // 图例项基本尺寸
    const itemHeight = 14;
    const itemSpacing = 8;
    const verticalPadding = 4;
    const symbolWidth = 20; // 图例符号宽度
    const textSpacing = 5;  // 符号与文本间距
    
    // 计算每行能放置的图例项数（默认每行最多4个）
    let maxRowItems = Math.min(4, legendOption.data.length);
    const availableWidth = (canvasWidth || 300) - (grid.left || 0) - 20; // 可用宽度
    
    // 动态计算每行能放置的图例项数
    let currentRowWidth = 0;
    let itemsInRow = 0;
    
    for (let i = 0; i < legendOption.data.length; i++) {
      const name = legendOption.data[i];
      ctx.font = '12px sans-serif';
      const textWidth = ctx.measureText(name).width;
      const itemWidth = symbolWidth + textSpacing + textWidth + itemSpacing;
      
      if (currentRowWidth + itemWidth > availableWidth && itemsInRow > 0) {
        // 当前行已满，换行
        maxRowItems = itemsInRow;
        break;
      }
      
      currentRowWidth += itemWidth;
      itemsInRow++;
    }
    
    // 确保至少每行显示一个图例项
    maxRowItems = Math.max(1, Math.min(4, maxRowItems)); // 最多每行4个
    
    // 计算图例总高度
    const rows = Math.ceil(legendOption.data.length / maxRowItems);
    const legendHeight = rows * itemHeight + Math.max(0, rows - 1) * itemSpacing + verticalPadding * 2;
    
    let legendTop;
    let totalLegendHeight = legendHeight; // 包含位置偏移的总高度
    
    if (hasTop) {
      // 计算top值（支持数字和百分比）
      let topPos = 0;
      if (typeof topValue === 'number') {
        topPos = topValue;
      } else if (typeof topValue === 'string' && topValue.endsWith('%')) {
        topPos = (parseInt(topValue) / 100) * canvasHeight;
      }
      
      legendTop = topPos + titleHeight; // 加上标题高度
      totalLegendHeight = legendHeight + topPos + 5; // 总高度包括top偏移
      
      // 调整网格顶部边距
      if (grid.top !== undefined) {
        grid.top = Math.max(grid.top, legendTop + legendHeight + 15);
      }
    } else if (hasBottom || isBottomDefault) {
      // 计算bottom值（支持数字和百分比）
      let bottomPos = 0;
      if (typeof bottomValue === 'number') {
        bottomPos = bottomValue;
      } else if (typeof bottomValue === 'string' && bottomValue.endsWith('%')) {
        bottomPos = (parseInt(bottomValue) / 100) * canvasHeight;
      } else if (isBottomDefault) {
        bottomPos = 5; // 默认底部距离
      }
      
      // 在画布底部绘制图例
      legendTop = canvasHeight - legendHeight - bottomPos;
      totalLegendHeight = legendHeight + bottomPos + 10; // 总高度包括bottom偏移
      
      // 调整网格底部边距
      if (grid.bottom !== undefined) {
        grid.bottom += totalLegendHeight;
      }
    } else {
      // 默认在顶部
      legendTop = (grid.top || 0) - 18 + titleHeight; // 加上标题高度
      totalLegendHeight = legendHeight + 18 + 5; // 总高度包括默认偏移
      
      // 调整网格顶部边距
      if (grid.top !== undefined) {
        grid.top = Math.max(grid.top, legendTop + legendHeight + 5);
      }
    }
    
    // 计算图例左边位置（默认与grid.left对齐）
    let legendLeft = grid.left || 0;
    if (hasLeft) {
      if (typeof leftValue === 'number') {
        legendLeft = leftValue;
      } else if (typeof leftValue === 'string' && leftValue.endsWith('%')) {
        legendLeft = (parseInt(leftValue) / 100) * canvasWidth;
      } else if (leftValue === 'center') {
        // 居中对齐
        let maxWidthInRow = 0;
        for (let r = 0; r < rows; r++) {
          let rowWidth = 0;
          const startIdx = r * maxRowItems;
          const endIdx = Math.min(startIdx + maxRowItems, legendOption.data.length);
          
          for (let i = startIdx; i < endIdx; i++) {
            const name = legendOption.data[i];
            ctx.font = '12px sans-serif';
            const textWidth = ctx.measureText(name).width;
            rowWidth += symbolWidth + textSpacing + textWidth + itemSpacing;
          }
          maxWidthInRow = Math.max(maxWidthInRow, rowWidth);
        }
        legendLeft = (canvasWidth - maxWidthInRow) / 2;
      } else if (leftValue === 'right') {
        // 右对齐
        let maxWidthInRow = 0;
        for (let r = 0; r < rows; r++) {
          let rowWidth = 0;
          const startIdx = r * maxRowItems;
          const endIdx = Math.min(startIdx + maxRowItems, legendOption.data.length);
          
          for (let i = startIdx; i < endIdx; i++) {
            const name = legendOption.data[i];
            ctx.font = '12px sans-serif';
            const textWidth = ctx.measureText(name).width;
            rowWidth += symbolWidth + textSpacing + textWidth + itemSpacing;
          }
          maxWidthInRow = Math.max(maxWidthInRow, rowWidth);
        }
        legendLeft = canvasWidth - maxWidthInRow - (grid.right || 0);
      }
    } else if (hasRight) {
      // 计算实际图例宽度
      let maxWidthInRow = 0;
      for (let r = 0; r < rows; r++) {
        let rowWidth = 0;
        const startIdx = r * maxRowItems;
        const endIdx = Math.min(startIdx + maxRowItems, legendOption.data.length);
        
        for (let i = startIdx; i < endIdx; i++) {
          const name = legendOption.data[i];
          ctx.font = '12px sans-serif';
          const textWidth = ctx.measureText(name).width;
          rowWidth += symbolWidth + textSpacing + textWidth + itemSpacing;
        }
        maxWidthInRow = Math.max(maxWidthInRow, rowWidth);
      }
      
      if (typeof rightValue === 'number') {
        legendLeft = canvasWidth - maxWidthInRow - rightValue;
      } else if (typeof rightValue === 'string' && rightValue.endsWith('%')) {
        legendLeft = canvasWidth - maxWidthInRow - (parseInt(rightValue) / 100) * canvasWidth;
      }
    }
    
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // 绘制图例项
    for (let i = 0; i < legendOption.data.length; i++) {
      const name = legendOption.data[i];
      const color = colors[i % colors.length];
      
      const row = Math.floor(i / maxRowItems);
      const col = i % maxRowItems;
      
      // 计算当前行的宽度，以实现不同的对齐方式
      let currentRowWidth = 0;
      const startIdx = row * maxRowItems;
      const endIdx = Math.min(startIdx + maxRowItems, legendOption.data.length);
      
      for (let j = startIdx; j < endIdx; j++) {
        const itemName = legendOption.data[j];
        const textWidth = ctx.measureText(itemName).width;
        currentRowWidth += symbolWidth + textSpacing + textWidth + itemSpacing;
      }
      
      // 根据对齐方式计算当前项在行中的位置
      let rowLeft = legendLeft;
      
      // 如果设置了left为'center'或'right'，则进行相应的对齐
      if (hasLeft && leftValue === 'center') {
        rowLeft = legendLeft + ((canvasWidth - legendLeft * 2) - currentRowWidth) / 2;
      } else if (hasLeft && leftValue === 'right') {
        rowLeft = legendLeft + (canvasWidth - legendLeft * 2) - currentRowWidth;
      }
      
      // 计算当前项在行中的具体位置
      let itemX = 0;
      for (let j = startIdx; j < startIdx + col; j++) {
        const itemName = legendOption.data[j];
        const textWidth = ctx.measureText(itemName).width;
        itemX += symbolWidth + textSpacing + textWidth + itemSpacing;
      }
      
      const x = rowLeft + itemX;
      const y = legendTop + verticalPadding + row * (itemHeight + itemSpacing) + itemHeight / 2;
      
      // 绘制线条
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.moveTo(x, y);
      ctx.lineTo(x + symbolWidth, y);
      ctx.stroke();
      
      // 绘制图例名称
      const textColor = (legendOption.textStyle && legendOption.textStyle.color) || '#666';
      ctx.fillStyle = textColor;
      ctx.fillText(String(name), x + symbolWidth + textSpacing, y);
    }
    
    // 返回图例占用的总高度（包含位置偏移）
    return totalLegendHeight;
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