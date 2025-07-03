import { AllowedComponentProps, VNodeProps } from './_common'

declare interface BackTopProps {
  /**
   * 按钮形状
   * @default "circle"
   */
  mode?: 'circle' | 'square'
  /**
   * uView内置图标名称，或图片路径
   * @default "arrow-upward"
   */
  icon?: string
  /**
   * 返回顶部按钮的提示文字
   */
  text?: string
  /**
   * 返回顶部过程中的过渡时间，单位ms
   * @default 100
   */
  duration?: string | number
  /**
   * 页面的滚动距离，通过`onPageScroll`生命周期获取
   * @default 0
   */
  scrollTop?: string | number
  /**
   * 滚动条滑动多少距离时显示，单位rpx
   * @default 400
   */
  top?: string | number
  /**
   * 返回按钮位置到屏幕底部的距离，单位rpx
   * @default 100
   */
  bottom?: string | number
  /**
   * 返回按钮位置到屏幕右边的距离，单位rpx
   * @default 20
   */
  right?: string | number
  /**
   * 返回顶部按钮的层级
   * @default 9
   */
  zIndex?: string | number
  /**
   * 图标的样式
   */
  iconStyle?: unknown
  /**
   * 按钮外层的自定义样式
   */
  customStyle?: unknown
}

declare interface BackTopSlots {
  /**
   * 自定义返回按钮的所有内容
   */
  ['default']?: () => any
}

declare interface _BackTop {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      BackTopProps
    $slots: BackTopSlots
  }
}

export declare const BackTop: _BackTop
