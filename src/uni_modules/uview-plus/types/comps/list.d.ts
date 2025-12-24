import { AllowedComponentProps, VNodeProps } from './_common'

declare interface ListProps {
  /**
   * 控制是否出现滚动条，仅nvue有效
   * @default false
   */
  showScrollbar?: boolean
  /**
   * 距底部多少时触发scrolltolower事件
   * @default 50
   */
  lowerThreshold?: string | number
  /**
   * 距顶部多少时触发scrolltoupper事件，非nvue有效
   * @default 0
   */
  upperThreshold?: string | number
  /**
   * 设置竖向滚动条位置
   * @default 0
   */
  scrollTop?: string | number
  /**
   * 控制 onscroll 事件触发的频率，仅nvue有效
   * @default 10
   */
  offsetAccuracy?: string | number
  /**
   * 启用 flexbox 布局。开启后，当前节点声明了display: flex就会成为flex container，并作用于其孩子节点，仅微信小程序有效
   * @default false
   */
  enableFlex?: boolean
  /**
   * 是否按分页模式显示List
   * @default false
   */
  pagingEnabled?: boolean
  /**
   * 是否允许List滚动
   * @default true
   */
  scrollable?: boolean
  /**
   * 值应为某子元素id（id不能以数字开头）
   */
  scrollIntoView?: string
  /**
   * 在设置滚动条位置时使用动画过渡
   * @default false
   */
  scrollWithAnimation?: boolean
  /**
   * iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只对微信小程序有效
   * @default false
   */
  enableBackToTop?: boolean
  /**
   * 列表的高度
   * @default 0
   */
  height?: string | number
  /**
   * 列表宽度
   * @default 0
   */
  width?: string | number
  /**
   * 列表前后预渲染的屏数，1代表一个屏幕的高度，1.5代表1个半屏幕高度
   * @default 1
   */
  preLoadScreen?: string | number
  /**
   * 滚动条滚动触发事件
   * @param scrollTop 滚动条位置
   */
  onScroll?: (scrollTop: number) => any
  /**
   * 滚动到底部触发事件
   */
  onScrolltolower?: () => any
}

declare interface _List {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      ListProps
  }
}

export declare const List: _List
