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
      lastSwapTime: 0, // 新增：记录上次交换时间
      initialTouchY: 0, // 新增：记录初始触摸位置
      minDragDistance: 15, // 新增：最小拖动距离阈值
      dragStartY: 0, // 新增：记录拖动开始位置
      confirmedDirection: null, // 新增：确认的拖动方向
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
      // 记录初始触摸位置
      this.initialTouchY = touch.clientY;
      this.dragX = 0;
      this.dragY = 0;
      this.isDragging = true;

      // 记录拖动开始位置
      this.dragStartY = touch.clientY;
      this.confirmedDirection = null;

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
        
        // 1. 计算总拖动距离
        const totalDragDistance = Math.abs(currentY - this.dragStartY);
        
        // 2. 如果拖动距离小于阈值，不进行位置检测
        if (totalDragDistance < this.minDragDistance) {
            // 只更新位置，不检测交换
            this.dragY = currentY - this.initialTouchY;
            return;
        }
        
        // 3. 确认拖动方向（只做一次）
        if (!this.confirmedDirection) {
            this.confirmedDirection = currentY > this.dragStartY ? 'down' : 'up';
        }
        
        this.dragY = currentY - this.initialTouchY;

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
            // 4. 添加更严格的防抖
            const now = Date.now();
            if (now - this.lastSwapTime < 200) return; // 延长防抖时间
            
            // 5. 使用方向感知的目标位置计算
            const targetIndex = this.calculateTargetPosition(currentY);
            
            if (targetIndex !== -1 && targetIndex !== this.dragIndex) {
                this.lastSwapTime = now;
                this.swapItems(targetIndex, event);
            }
        }
    },
    // 优化：更精准的方向感知位置计算
    calculateTargetPosition(currentY) {
        // 获取拖动项的中心Y坐标
        const dragCenterY = currentY;
        let closestIndex = -1;
        let minDistance = Infinity;
        
        // 获取拖动项的高度
        const dragHeight = this.itemRects[this.dragIndex]?.height || this.itemHeight;
        
        for (let i = 0; i < this.itemRects.length; i++) {
            if (i === this.dragIndex) continue;
            
            const rect = this.itemRects[i];
            if (!rect) continue;
            
            const rectCenterY = rect.top + rect.height / 2;
            const distance = Math.abs(dragCenterY - rectCenterY);
            
            // 6. 方向过滤：只考虑当前拖动方向上的元素
            const isDirectionMatch = 
                (this.confirmedDirection === 'down' && i > this.dragIndex) ||
                (this.confirmedDirection === 'up' && i < this.dragIndex);
                
            if (!isDirectionMatch) continue;
            
            // 7. 使用更大的阈值（元素高度的1.2倍）
            const threshold = dragHeight * 1.2;
            
            if (distance < minDistance && distance < threshold) {
                minDistance = distance;
                closestIndex = i;
            }
        }
        
        return closestIndex;
    },
    
    // 优化：添加平滑交换
    swapItems(targetIndex, event) {
        const originalIndex = this.dragIndex;
        
        // 6. 执行交换前保存当前样式
        const originalTransform = this.$refs[`u-dragsort-item-${originalIndex}`]?.style.transform;
        
        // 执行交换
        const temp = this.list[originalIndex];
        this.list.splice(originalIndex, 1);
        this.list.splice(targetIndex, 0, temp);
        
        // 更新索引
        this.dragIndex = targetIndex;
        this.closestIndex = targetIndex;
        
        // 7. 使用当前触摸位置更新初始位置
        if (event && event.touches && event.touches[0]) {
            this.initialTouchY = event.touches[0].clientY;
            this.dragY = 0;
        }
        
        // 8. 添加位置平滑过渡
        this.$nextTick(() => {
            const dragItem = this.$refs[`u-dragsort-item-${targetIndex}`];
            if (dragItem) {
                // 保存当前位置
                const currentTransform = dragItem.style.transform;
                
                // 临时添加过渡效果
                dragItem.style.transition = 'transform 0.15s ease';
                dragItem.style.transform = currentTransform;
                
                // 过渡结束后移除效果
                setTimeout(() => {
                    dragItem.style.transition = '';
                }, 150);
            }
        });
        
        // 更新位置缓存
        this.updateItemRects();
    },
    
    onTouchMove(event) {
        // 记录当前Y坐标用于方向判断
        if (event.touches && event.touches[0]) {
            this.prevY = event.touches[0].clientY;
        }
        
        // 使用requestAnimationFrame确保流畅性
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
    // transition: transform 0.15s ease, margin-top 0.15s ease;
    transition: transform 0.25s cubic-bezier(0.33, 1, 0.68, 1);
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