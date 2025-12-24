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
            <up-icon name="arrow-downward" size="26px"></up-icon>
          </view>
          <text class="refresh-text">{{ t("up.pullRefresh.pull") }}</text>
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
            <up-icon name="arrow-upward" size="26px"></up-icon>
          </view>
          <text class="refresh-text">{{ t("up.pullRefresh.release") }}</text>
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
          <text class="refresh-text">{{ t("up.pullRefresh.refreshing") }}...</text>
        </view>
      </slot>
    </view>
    
    <!-- 内容区域 -->
    <view 
      class="refresh-content-wrapper"
      :style="{ transform: `translateY(${contentTranslateY}px)` }"
    >
      <scroll-view
        v-if="useScrollView"
        class="scroll-wrapper"
        :scroll-y="true"
        :enable-back-to-top="enableBackToTop"
        :scroll-top="scrollTop"
        :lower-threshold="lowerThreshold"
        @scroll="handleScroll"
        @scrolltolower="handleScrollToLower"
      >
        <slot></slot>
        
        <!-- 使用 u-loadmore 组件实现上拉加载更多 -->
        <u-loadmore
          v-if="showLoadmore"
          v-bind="loadmoreProps"
        />
      </scroll-view>
      
      <view v-else>
        <slot></slot>
        
        <!-- 使用 u-loadmore 组件实现上拉加载更多 -->
        <u-loadmore
          v-if="showLoadmore"
          v-bind="loadmoreProps"
        />
      </view>
    </view>
  </view>
</template>

<script>
import { t } from '../../libs/i18n'
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
      default: 80
    },
    // 阻尼系数
    damping: {
      type: Number,
      default: 0.4
    },
    // 最大下拉距离
    maxDistance: {
      type: Number,
      default: 120
    },
    // 是否显示加载更多
    showLoadmore: {
      type: Boolean,
      default: false
    },
    // u-loadmore 组件的 props 配置
    loadmoreProps: {
      type: Object,
      default: () => ({
        status: 'loadmore',
        // loadmoreText: '加载更多',
        // loadingText: '正在加载...',
        // nomoreText: '没有更多了'
      })
    },
    // 是否使用 scroll-view 包装内容
    useScrollView: {
      type: Boolean,
      default: true
    },
    // scroll-view 相关属性
    enableBackToTop: {
      type: Boolean,
      default: false
    },
    lowerThreshold: {
      type: [Number, String],
      default: 50
    },
    scrollTop: {
      type: [Number, String],
      default: 0
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
  emits: ['refresh', 'loadmore', 'scroll'],
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
    t,
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
      if (diff > 0 && this.isScrollViewAtTop()) {
        this.refreshDistance = Math.min(diff * this.damping, this.maxDistance)
        this.contentTranslateY = this.refreshDistance
        
        // 更新状态
        if (this.refreshDistance >= this.threshold) {
          this.refreshStatus = 'release'
        } else {
          this.refreshStatus = 'pull'
        }

        // 阻止默认滚动行为，防止触发页面级滚动
        e.preventDefault()
        e.stopPropagation()
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
    },
    
    // 检查 scroll-view 是否在顶部
    isScrollViewAtTop() {
      // 这里可以更精确地判断，但简单起见直接返回 true
      // 实际项目中可能需要通过 scroll 事件获取 scrollTop 判断
      return true
    },
    
    // 处理滚动事件
    handleScroll(e) {
      this.$emit('scroll', e)
    },
    
    // 处理滚动到底部事件
    handleScrollToLower(e) {
      // 只有当 loadmore 状态为 loadmore 时才触发
      if (this.showLoadmore && this.loadmoreProps.status === 'loadmore') {
        this.$emit('loadmore')
      }
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

.scroll-wrapper {
  height: 100%;
}

.refresh-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 10px;
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