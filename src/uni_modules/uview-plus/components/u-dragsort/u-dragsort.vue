<template>
    <view class="u-dragsort" :class="direction == 'horizontal' ? 'u-dragsort--horizontal' : ''">
      <movable-area class="u-dragsort-area" :style="{ height: direction === 'vertical' ? `${list.length * itemHeight}px` : 'auto' }">
        <movable-view
          v-for="(item, index) in list"
          :key="item.id"
          :id="`u-dragsort-item-${index}`"
          class="u-dragsort-item"
          :class="{ 'dragging': dragIndex === index }"
          :direction="direction"
          :x="item.x"
          :y="item.y"
          :inertia="false"
          :disabled="!draggable || (item.draggable === false)"
          @change="onChange(index, $event)"
          @touchstart="onTouchStart(index)"
          @touchend="onTouchEnd"
          @touchcancel="onTouchEnd"
        >
          <view class="u-dragsort-item-content">
            <slot :item="item" :index="index">
              {{ item.label }}
            </slot>
          </view>
        </movable-view>
      </movable-area>
    </view>
  </template>
  
  <script>
import { addStyle, addUnit, sleep } from '../../libs/function/index';
  export default {
    name: 'u-dragsort',
    props: {
      initialList: {
        type: Array,
        required: true,
        default: () => []
      },
      draggable: {
        type: Boolean,
        default: true
      },
      direction: {
        type: String,
        default: 'vertical',
        validator: value => ['vertical', 'horizontal'].includes(value)
      }
    },
    data() {
      return {
        list: [],
        dragIndex: -1,
        itemHeight: 80,
        itemWidth: 80,
        originalPositions: [], // 保存原始位置
        currentPosition: {
            x: 0,
            y: 0
        }
      };
    },
    emits: ['drag-end'],
    async mounted() {
      await this.$nextTick();
      this.initList();
      this.calculateItemSize();
    },
    methods: {
      initList() {
        // 初始化列表项的位置
        this.list = this.initialList.map((item, index) => ({
          ...item,
          x: 0,
          y: this.direction === 'vertical' ? index * this.itemHeight : 0
        }));
        // 保存初始位置
        this.saveOriginalPositions();
      },
      saveOriginalPositions() {
        // 保存当前位置作为原始位置
        this.originalPositions = this.list.map(item => ({
          x: item.x,
          y: item.y
        }));
      },
      async calculateItemSize() {
        // 计算项目尺寸
        return new Promise((resolve) => {
          uni.createSelectorQuery()
            .in(this)
            .select('.u-dragsort-item')
            .boundingClientRect(res => {
              if (res) {
                this.itemHeight = res.height || 80;
                this.itemWidth = res.width || 80;
                
                // 更新所有项目的位置
                this.updatePositions();
                // 保存原始位置
                this.saveOriginalPositions();
              }
              resolve(res);
            })
            .exec();
        });
      },
      updatePositions() {
        // 更新所有项目的位置
        this.list.forEach((item, index) => {
          if (this.direction === 'vertical') {
            item.y = index * this.itemHeight;
            item.x = 0;
          } else {
            item.x = index * this.itemWidth;
            item.y = 0;
          }
        });
      },
      onTouchStart(index) {
        this.dragIndex = index;
        // 保存当前位置作为原始位置
        this.saveOriginalPositions();
      },
      onChange(index, event) {
        // console.log(index)
        if (!event.detail.source || event.detail.source !== 'touch') return;
        
        if (this.direction === 'horizontal') {
          this.currentPosition.x = event.detail.x;
        } else if (this.direction === 'vertical') {
          this.currentPosition.y = event.detail.y;
        }
        
        // 计算目标索引
        let itemSize = 0;
        let targetIndex = -1;
        if (this.direction === 'vertical') {
            itemSize = this.itemHeight;
            targetIndex = Math.max(0, Math.min(
            Math.round(this.currentPosition.y / itemSize),
                this.list.length - 1
            ));
        } else if (this.direction === 'horizontal') {
            itemSize = this.itemWidth;
            targetIndex = Math.max(0, Math.min(
            Math.round(this.currentPosition.x / itemSize),
                this.list.length - 1
            ));
        }
        
        // 如果位置发生变化，则重新排序
        if (targetIndex !== index) {
          const movedItem = this.list.splice(index, 1)[0];
          this.list.splice(targetIndex, 0, movedItem);

          // 震动反馈
          if (uni.vibrateShort) {
            uni.vibrateShort();
          }

          // 更新当前拖拽项目的新索引
          this.dragIndex = targetIndex;
          
          // 更新所有项目的位置
          this.updatePositions();

          // 保存当前位置作为原始位置
          this.saveOriginalPositions();
        } else {
        }
      },
      onTouchEnd() {
        // 0.001是为了解决拖动过快等某些极限场景下位置还原不生效问题
        this.list[this.dragIndex].y = this.currentPosition.y + 0.001;
        // console.log(this.list[this.dragIndex].y)

        // 重置到位置，需要延迟触发动，否则无效。
        sleep(50).then(() => {
            this.list.forEach((item, index) => {
                item.x = this.originalPositions[index].x;
                item.y = this.originalPositions[index].y;
            });
            // console.log(this.list[this.dragIndex].y)
            this.dragIndex = -1;
            this.$emit('drag-end', [...this.list]);
        });
      }
    },
    watch: {
      initialList: {
        handler() {
          this.$nextTick(() => {
            this.initList();
          });
        },
        deep: true
      }
    }
  };
  </script>
  
  <style scoped lang="scss">
  .u-dragsort {
    width: 100%;
    
    .u-dragsort-area {
      width: 100%;
    }
  
    .u-dragsort-item {
      position: absolute;
      width: 100%;
      
      &.dragging {
        z-index: 1000;
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
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
      .u-dragsort-area {
        display: flex;
        flex-direction: row;
        white-space: nowrap;
      }
      
      .u-dragsort-item {
        display: inline-block;
        width: auto;
        height: 100%;
      }
    }
  }
  </style>
