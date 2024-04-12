import { AllowedComponentProps, VNodeProps } from './_common'

declare interface LoadMoreProps {
  /**
   * 组件状态
   * @default "loadmore"
   */
  status?: 'loadmore' | 'loading' | 'nomore'
  /**
   * 组件背景颜色，在页面是非白色时会用到
   * @default "transparent"
   */
  bgColor?: string
  /**
   * 加载中时是否显示图标
   * @default true
   */
  icon?: boolean
  /**
   * 字体大小，单位rpx
   * @default 14
   */
  fontSize?: string | number
  /**
   * 图标大小，单位px
   * @default 17
   */
  iconSize?: string | number
  /**
   * 字体颜色
   * @default "#606266"
   */
  color?: string
  /**
   * 加载中状态的图标
   * @default "circle"
   */
  loadingIcon?: 'circle' | 'spinner' | 'semicircle'
  /**
   * 加载前的提示语
   * @default "加载更多"
   */
  loadmoreText?: string
  /**
   * 加载中提示语
   * @default "正在加载..."
   */
  loadingText?: string
  /**
   * 没有更多的提示语
   * @default "没有更多了"
   */
  nomoreText?: string
  /**
   * `status`为`nomore`时，内容显示为一个"●"
   * @default false
   */
  isDot?: boolean
  /**
   * 加载中的动画图标的颜色
   * @default "#b7b7b7"
   */
  iconColor?: string
  /**
   * 线条颜色
   * @default "#E6E8EB"
   */
  lineColor?: string
  /**
   * 是否虚线，false-实线，true-虚线
   * @default false
   */
  dashed?: boolean
  /**
   * 与前一个元素的距离，单位rpx
   * @default 10
   */
  marginTop?: string | number
  /**
   * 与后一个元素的距离，单位rpx
   * @default 10
   */
  marginBottom?: string | number
  /**
   * 高度
   * @default "auto"
   */
  height?: string | number
  /**
   * 是否显示左边分割线
   * @default false
   */
  line?: boolean
  /**
   * `status`为`loadmore`时，点击组件会发出此事件
   */
  onLoadmore?: () => any
}

declare interface _LoadMore {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      LoadMoreProps
  }
}

export declare const LoadMore: _LoadMore
