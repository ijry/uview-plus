/**
 * 禁用 iOS Safari 下拉刷新工具函数
 * 全局配置，防止页面下拉刷新
 */

class PullToRefreshDisabler {
  constructor() {
    this.isEnabled = false;
    this.touchStartY = 0;
    this.touchMoveY = 0;
    this.preventPullToRefresh = this.preventPullToRefresh.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  /**
   * 启用禁用下拉刷新功能
   */
  enable() {
    if (this.isEnabled) return;
    
    // #ifdef H5
    this.isEnabled = true;
    
    // 方法1: 设置 CSS 样式禁用下拉刷新
    this.setOverscrollBehavior();
    
    // 方法2: 添加事件监听器
    this.addEventListeners();
    
    // 方法3: 设置 viewport meta 标签
    this.setViewportMeta();
    
    console.log('iOS Safari 下拉刷新已禁用');
    // #endif
  }

  /**
   * 设置 CSS 样式禁用下拉刷新
   */
  setOverscrollBehavior() {
    const body = document.body;
    const html = document.documentElement;
    
    // 设置 overscroll-behavior
    body.style.overscrollBehavior = 'none';
    html.style.overscrollBehavior = 'none';
    body.style.webkitOverscrollBehavior = 'none';
    html.style.webkitOverscrollBehavior = 'none';
    
    // 设置 touch-action
    body.style.touchAction = 'pan-x pan-y';
    html.style.touchAction = 'pan-x pan-y';
  }

  /**
   * 添加事件监听器
   */
  addEventListeners() {
    document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    document.addEventListener('touchmove', this.preventPullToRefresh, { passive: false });
  }

  /**
   * 阻止下拉刷新的核心逻辑
   */
  preventPullToRefresh(e) {
    // 检查是否在页面顶部
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
    
    if (scrollTop === 0 && e.touches && e.touches.length === 1) {
      const touch = e.touches[0];
      const deltaY = touch.clientY - this.touchStartY;
      
      // 如果是向下滑动（下拉），阻止默认行为
      if (deltaY > 0) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }

  /**
   * 设置 viewport meta 标签
   */
  setViewportMeta() {
    // 查找现有的 viewport meta 标签
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    if (viewportMeta) {
      const content = viewportMeta.getAttribute('content');
      if (!content.includes('user-scalable=no')) {
        viewportMeta.setAttribute('content', content + ', user-scalable=no');
      }
    } else {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(viewportMeta);
    }
  }

  // ... 其他方法
}

// 创建全局实例
const pullToRefreshDisabler = new PullToRefreshDisabler();

export default {
  enable() {
    pullToRefreshDisabler.enable();
  },
  disable() {
    pullToRefreshDisabler.disable();
  },
  isEnabled() {
    return pullToRefreshDisabler.isEnabled;
  }
};
