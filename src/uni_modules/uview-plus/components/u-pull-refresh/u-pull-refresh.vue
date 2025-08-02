<template>
  <view 
    class="u-pull-refresh"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <!-- 下拉刷新区域 -->
    <view 
      class="refresh-area" 
      :style="{ height: refreshDistance + 'px' }"
      :class="{ refreshing: isRefreshing }"
    >
      <!-- 不同状态的插槽 -->
      <slot 
        v-if="refreshStatus === 'pull'" 
        name="pull" 
        :distance="refreshDistance"
        :threshold="threshold"
      >
        <!-- 默认下拉状态 -->
        <view class="refresh-content">
          <view class="refresh-indicator">
            <view class="arrow"></view>
          </view>
          <text class="refresh-text">下拉刷新</text>
        </view>
      </slot>
      
      <slot 
        v-else-if="refreshStatus === 'release'" 
        name="release" 
        :distance="refreshDistance"
        :threshold="threshold"
      >
        <!-- 默认释放状态 -->
        <view class="refresh-content">
          <view class="refresh-indicator">
            <view class="arrow rotate"></view>
          </view>
          <text class="refresh-text">释放刷新</text>
        </view>
      </slot>
      
      <slot 
        v-else-if="refreshStatus === 'refreshing'" 
        name="refreshing"
      >
        <!-- 默认刷新中状态 -->
        <view class="refresh-content">
          <view class="refresh-indicator">
            <view class="spinner"></view>
          </view>
          <text class="refresh-text">正在刷新...</text>
        </view>
      </slot>
    </view>
    
    <!-- 内容区域 -->
    <view 
      class="refresh-content-wrapper"
      :style="{ transform: `translateY(${contentTranslateY}px)` }"
    >
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'u-pull-refresh',
  props: {
    // 是否正在刷新
    refreshing: {
      type: Boolean,
      default: false
    },
    // 下拉刷新阈值
    threshold: {
      type: Number,
      default: 50
    },
    // 阻尼系数
    damping: {
      type: Number,
      default: 0.4
    },
    // 最大下拉距离
    maxDistance: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      // 下拉刷新相关
      isRefreshing: false,
      refreshStatus: 'pull', // pull, release, refreshing
      refreshDistance: 0,
      startY: 0,
      currentY: 0,
      touching: false,
      
      // 动画相关
      contentTranslateY: 0
    }
  },
  watch: {
    refreshing: {
      handler(newVal) {
        if (!newVal) {
          this.finishRefresh()
        } else {
          this.startRefresh()
        }
      }
    }
  },
  methods: {
    // 触摸开始
    onTouchStart(e) {
      if (this.isRefreshing) return
      
      this.touching = true
      this.startY = e.touches[0].pageY
      this.currentY = this.startY
      this.refreshStatus = 'pull'
    },
    
    // 触摸移动
    onTouchMove(e) {
      if (!this.touching || this.isRefreshing) return
      
      this.currentY = e.touches[0].pageY
      const diff = this.currentY - this.startY
      
      // 只有在顶部且下拉时才触发下拉刷新
      if (diff > 0) {
        this.refreshDistance = Math.min(diff * this.damping, this.maxDistance)
        this.contentTranslateY = this.refreshDistance
        
        // 更新状态
        if (this.refreshDistance >= this.threshold) {
          this.refreshStatus = 'release'
        } else {
          this.refreshStatus = 'pull'
        }
      }
    },
    
    // 触摸结束
    onTouchEnd() {
      if (!this.touching) return
      
      this.touching = false
      
      if (this.refreshDistance >= this.threshold && !this.isRefreshing) {
        // 触发刷新
        this.startRefresh()
        this.$emit('refresh')
      } else {
        // 回弹
        this.resetRefresh()
      }
    },
    
    // 开始刷新
    startRefresh() {
      this.isRefreshing = true
      this.refreshStatus = 'refreshing'
      this.refreshDistance = this.threshold
      this.contentTranslateY = this.threshold
    },
    
    // 完成刷新
    finishRefresh() {
      this.isRefreshing = false
      this.refreshStatus = 'pull'
      this.resetRefresh()
    },
    
    // 重置刷新状态
    resetRefresh() {
      this.refreshDistance = 0
      this.contentTranslateY = 0
    }
  }
}
</script>

<style scoped lang="scss">
.u-pull-refresh {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.refresh-area {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  transition: height 0.2s ease-out;
}

.refresh-content-wrapper {
  height: 100%;
  transition: transform 0.2s ease-out;
}

.refresh-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 10px;
}

.refresh-indicator {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.arrow {
  width: 12px;
  height: 12px;
  border-left: 2px solid #666;
  border-bottom: 2px solid #666;
  transform: rotate(-45deg);
  transition: transform 0.2s;
}

.arrow.rotate {
  transform: rotate(135deg);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #666;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.refresh-text {
  font-size: 14px;
  color: #666;
}
</style>
