<template>
  <view class="u-dragsort" :class="direction == 'horizontal' ? 'u-dragsort--horizontal' : ''">
    <view
      v-for="(item, index) in list"
      :key="item.id"
      :id="`u-dragsort-item-${index}`"
      :ref="(el) => setItemRef(el, index)"
      class="u-dragsort-item"
      :class="{
        'dragging': dragIndex === index,
        'nearby': closestIndex === index
      }"
      :style="{
        transform: dragIndex === index ? `translateY(${dragY}px)` : 'none',
        zIndex: dragIndex === index ? 10 : 'auto'
      }"
      @touchstart="onTouchStart(index, $event)"
      @touchmove="onTouchMove($event)"
      @touchend="onTouchEnd"
    >
      <!-- 默认插槽，用户可自定义 item 渲染内容 -->
      <slot :item="item" :index="index">
        <!-- 默认内容 -->
        <view class="u-dragsort-item-content">
            {{ item.label }}
        </view>
      </slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'u-dragsort',
  props: {
    initialList: {
        type: Array,
        required: true,
        default: () => []
    },
    // 新增 draggable 属性
    draggable: {
        type: Boolean,
        default: true
    },
    direction: {
        type: String,
        default: 'vertical', // 可选值：'vertical' / 'horizontal'
        validator: value => ['vertical', 'horizontal'].includes(value)
    }
  },
  data() {
    return {
      list: [...this.initialList],
      itemRefs: [], // 存储每个 item 的 ref
      itemRects: [], // 缓存所有 item 的 rect
      dragIndex: -1,
      dragX: 0,
      dragY: 0,
      startX: 0,
      startY: 0,
      itemWidth: 0, // 横向拖动需要宽度
      itemHeight: 80,
      isDragging: false,
      closestIndex: -1, // 用于临时存储最接近的 index
      cumulativeOffsetY: 0, // 新增：累计拖动距离
      prevY: 0, // 新增：记录上一次的Y坐标
    };
  },
  emits: ['drag-end'],
  async mounted() {
    await this.$nextTick();
    const rect = await this.calculateItemSize(0);
    this.itemWidth = rect.width;
    this.itemHeight = rect.height;
  },
  methods: {
    setItemRef(el, index) {
        this.itemRefs[index] = el;
    },
    async calculateItemSize(index) {
      return new Promise((resolve) => {
        uni.createSelectorQuery()
          .in(this)
          .select(`#u-dragsort-item-${index}`)
          .boundingClientRect(res => {
            resolve(res || { width: 80, height: 80 });
          })
          .exec();
      });
    },
    async updateItemRects() {
        const rects = await this.getAllItemRects();
        this.itemRects = rects;
    },
    async getAllItemRects() {
        return new Promise(resolve => {
            uni.createSelectorQuery()
            .in(this)
            .selectAll('.u-dragsort-item')
            .boundingClientRect(res => {
                resolve(res || []);
            })
            .exec();
        });
    },
    onTouchStart(index, event) {
      // ⚠️ 如果禁止拖动，则直接返回
      if (!this.draggable || (this.list[index]?.draggable == false)) return;

      const touch = event.touches[0];
      this.dragIndex = index;
      this.startX = touch.clientX;
      this.startY = touch.clientY;
      this.prevY = touch.clientY; // 初始化prevY
      this.dragX = 0;
      this.dragY = 0;
      this.cumulativeOffsetY = 0; // 初始化累计偏移
      this.isDragging = true;

      this.updateItemRects(); // 更新缓存
    },
    // throttle(func, delay) {
    //     let lastCall = 0;
    //     return (...args) => {
    //     const now = new Date().getTime();
    //     if (now - lastCall >= delay) {
    //         lastCall = now;
    //         func.apply(this, args);
    //     }
    //     };
    // },
    handleDragMove(event) {
        if (this.dragIndex === -1 || !this.draggable) return;

        const touch = event.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;

        const deltaX = currentX - this.startX;
        const frameDeltaY = currentY - this.prevY; // 计算帧间偏移
        this.prevY = currentY; // 更新prevY
        
        // 更新累计偏移（用于视觉位置）
        this.cumulativeOffsetY += frameDeltaY;
        this.dragY = this.cumulativeOffsetY;

        if (this.direction === 'horizontal') {
            this.dragX = deltaX;

            // 只缓存 rect，不立即交换
            let closestIndex = this.dragIndex;
            let minDistance = Infinity;

            this.itemRects.forEach((rect, index) => {
            if (index === this.dragIndex) return;

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.hypot(currentX - centerX, currentY - centerY);

            if (dist < minDistance) {
                minDistance = dist;
                closestIndex = index;
            }
            });

            // 设置临时高亮/排序索引，并立即修改 list
            if (closestIndex !== this.closestIndex && closestIndex !== this.dragIndex) {
                const temp = this.list[this.dragIndex];
                this.list.splice(this.dragIndex, 1);
                this.list.splice(closestIndex, 0, temp);

                this.dragIndex = closestIndex;
                this.closestIndex = closestIndex;
            }
        } else {
            // 精准计算目标位置
            const targetIndex = this.calculateTargetPosition(currentY);
            
            // 如果找到合适位置且需要交换
            if (targetIndex !== -1 && targetIndex !== this.dragIndex) {
                this.swapItems(targetIndex);
            }
        }
    },
    // 新增：计算目标位置
    calculateTargetPosition(currentY) {
        let closestIndex = -1;
        let minDistance = Infinity;
        
        // 计算拖动项的中心Y坐标
        const dragCenterY = currentY;
        
        this.itemRects.forEach((rect, index) => {
            if (index === this.dragIndex) return;
            
            const rectCenterY = rect.top + rect.height / 2;
            const distance = Math.abs(dragCenterY - rectCenterY);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });
        
        // 动态阈值：使用元素高度的0.8倍作为触发距离
        return minDistance < this.itemHeight * 0.8 ? closestIndex : -1;
    },
    
    // 修改：修复向上拖动的补偿逻辑
    swapItems(targetIndex) {
        const temp = this.list[this.dragIndex];
        this.list.splice(this.dragIndex, 1);
        
        // 保存原始索引
        const originalIndex = this.dragIndex;
        
        // 确定插入位置
        const insertIndex = targetIndex;
        this.list.splice(insertIndex, 0, temp);
        
        this.dragIndex = insertIndex;
        this.closestIndex = insertIndex;
        
        // 关键：根据移动方向补偿位置偏移 - 修复向上拖动问题
        if (insertIndex > originalIndex) {
            // 向下移动：补偿下方元素的高度
            this.cumulativeOffsetY -= this.itemRects[originalIndex].height;
        } else {
            // 向上移动：补偿上方元素的高度（使用原始元素高度）
            this.cumulativeOffsetY += this.itemRects[originalIndex].height;
        }
        
        // 更新位置缓存
        this.updateItemRects();
    },
    
    onTouchMove(event) {
        // 使用requestAnimationFrame替代节流，确保流畅性
        if (!this.rafId) {
            this.rafId = requestAnimationFrame(() => {
                this.handleDragMove(event);
                this.rafId = null;
            });
        }
    },
    onTouchEnd() {
        // 取消动画帧
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        // if (this.isDragging && this.closestIndex !== -1 && this.closestIndex !== this.dragIndex) {
        //     const temp = this.list[this.dragIndex];
        //     this.list.splice(this.dragIndex, 1);
        //     this.list.splice(this.closestIndex, 0, temp);
        //     this.dragIndex = this.closestIndex;
        // }

        this.$emit('drag-end', this.list);
        this.dragIndex = -1;
        this.dragX = 0;
        this.dragY = 0;
        this.isDragging = false;
        this.closestIndex = -1;
    }
  }
};
</script>

<style scoped lang="scss">
.u-dragsort {
  width: 100%;

  .u-dragsort-item {
    transition: transform 0.15s ease, margin-top 0.15s ease;
    &.dragging {
        // 拖动时禁用过渡
        // transition: none;
        // 确保在最上层
        z-index: 1000;
        // transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    &.nearby {
        opacity: 95;
        transform: scale(1.02);
    }
    .u-dragsort-item-content {
        padding: 10px;
        text-align: center;
        background-color: #f5f5f5;
        border-radius: 8rpx;
        transition: all 0.3s ease;
    }
  }

  &.u-dragsort--horizontal { 
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: visible; // 取消滚动条，允许自然换行
    .u-dragsort-item {
        flex-shrink: 0;
        box-sizing: border-box;
        .u-dragsort-item-content {
            margin: 1px;
        }
    }
  }
}
</style>