<template>
  <view class="u-virtual-list" :style="{ height: addUnit(height) }" ref="container">
    <scroll-view
      class="virtual-scroll-container"
      :scroll-y="true"
      :scroll-top="scrollTop"
      :style="{ height: '100%' }"
      @scroll="handleScroll"
    >
    <!-- @touchmove.stop.prevent="handleTouchMove" -->
      <view class="scroll-content">
        <!-- 顶部占位 -->
        <view :style="{ height: topPlaceholderHeight + 'px' }"></view>
        
        <!-- 可见项 -->
        <view 
          v-for="item in visibleItems" 
          :key="getItemKey(item)"
          class="list-item"
          :style="{ height: itemHeight + 'px' }"
        >
          <slot :item="item" :index="item._virtualIndex"></slot>
        </view>
        
        <!-- 底部占位 -->
        <view :style="{ height: bottomPlaceholderHeight + 'px' }"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { addUnit } from '../../libs/function/index.js'

export default {
  name: 'u-virtual-list',
  props: {
    // 数据源
    listData: {
      type: Array,
      default: () => []
    },
    // 每项高度（固定高度模式）
    itemHeight: {
      type: Number,
      default: 50
    },
    // 容器高度
    height: {
      type: [String, Number],
      default: '100%'
    },
    // 缓冲区项数
    buffer: {
      type: Number,
      default: 4
    },
    // 索引键名
    keyField: {
      type: String,
      default: 'id'
    },
    // 当前滚动位置
    scrollTop: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 起始索引
      startIndex: 0,
      // 容器实际高度
      containerHeight: 0
    }
  },
  computed: {
    // 可视区域显示的项数（根据容器实际高度自动计算）
    remain() {
      if (this.containerHeight <= 0) {
        // 默认值，防止除以0
        return Math.ceil(500 / this.itemHeight) || 10
      }
      const calculated = Math.ceil(this.containerHeight / this.itemHeight)
      // 确保至少显示一些项
      return Math.max(1, calculated)
    },
    // 可视项数量
    visibleCount() {
      return this.remain + this.buffer
    },
    // 可视项
    visibleItems() {
      const start = Math.max(0, this.startIndex - Math.floor(this.buffer / 2))
      const end = Math.min(this.listData.length, start + this.visibleCount)
      
      return this.listData.slice(start, end).map((item, index) => {
        return {
          ...item,
          _virtualIndex: start + index
        }
      })
    },
    // 顶部占位高度
    topPlaceholderHeight() {
      const start = Math.max(0, this.startIndex - Math.floor(this.buffer / 2))
      return start * this.itemHeight
    },
    // 底部占位高度
    bottomPlaceholderHeight() {
      const start = Math.max(0, this.startIndex - Math.floor(this.buffer / 2))
      const end = Math.min(this.listData.length, start + this.visibleCount)
      return (this.listData.length - end) * this.itemHeight
    }
  },
  emits: ['update:scrollTop', 'scroll'],
  watch: {
    listData: {
      handler() {
        this.updateVisibleItems()
      },
      immediate: true
    },
    scrollTop: {
      handler(newVal) {
        this.updateVisibleItems()
      }
    }
  },
  mounted() {
    this.measureContainerHeight()
  },
  methods: {
    addUnit,
    
    // 测量容器高度
    measureContainerHeight() {
      // 使用 uni.createSelectorQuery 获取实际高度
      this.$nextTick(() => {
        // #ifdef H5
        if (this.$refs.container) {
          const element = this.$refs.container.$el || this.$refs.container
          this.containerHeight = element.offsetHeight || 500
        }
        // #endif
        
        // #ifndef H5
        const query = uni.createSelectorQuery().in(this)
        query.select('.u-virtual-list').boundingClientRect(rect => {
          if (rect) {
            this.containerHeight = rect.height || 500
          } else {
            // 如果无法获取实际高度，使用默认计算
            this.containerHeight = this.calculateDefaultHeight()
          }
        }).exec()
        // #endif
      })
    },
    
    // 计算默认高度
    calculateDefaultHeight() {
      const height = this.height
      if (typeof height === 'number') {
        return height
      }
      
      if (typeof height === 'string') {
        if (height.includes('px')) {
          return parseInt(height) || 500
        } else if (height.includes('vh')) {
          // 处理视口高度单位
          const vh = parseInt(height)
          return isNaN(vh) ? 500 : (vh / 100) * this.getViewportHeight()
        } else if (height.includes('%')) {
          // 百分比高度，使用默认值
          return 500
        } else {
          const num = parseInt(height)
          return isNaN(num) ? 500 : num
        }
      }
      
      return 500
    },
    
    // 获取视口高度
    getViewportHeight() {
      // #ifdef H5
      return window.innerHeight
      // #endif
      
      // #ifndef H5
      try {
        const res = uni.getSystemInfoSync()
        return res.windowHeight
      } catch (e) {
        return 600 // 默认值
      }
      // #endif
    },
    
    getItemKey(item) {
      return item[this.keyField] !== undefined ? item[this.keyField] : item._virtualIndex
    },
    
    // 更新可视项
    updateVisibleItems() {
      const index = Math.floor(this.scrollTop / this.itemHeight)
      this.startIndex = Math.max(0, index)
    },
    
    // 处理滚动
    handleScroll(e) {
      const scrollTop = e.detail.scrollTop
      this.$emit('update:scrollTop', scrollTop)
      this.$emit('scroll', scrollTop)
    },
    
    // 处理触摸移动，阻止事件冒泡
    handleTouchMove(e) {
      // 阻止触摸移动事件冒泡到父级，防止触发页面滚动
      e.stopPropagation()
    },
    
    // 获取可见项范围
    getVisibleRange() {
      const start = Math.max(0, this.startIndex - Math.floor(this.buffer / 2))
      const end = Math.min(this.listData.length, start + this.visibleCount)
      return { start, end }
    }
  }
}
</script>

<style scoped lang="scss">
.u-virtual-list {
  position: relative;
  overflow: hidden;
}

.virtual-scroll-container {
  height: 100%;
}

.scroll-content {
  position: relative;
}

.list-item {
  will-change: transform;
}
</style>