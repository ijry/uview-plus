import { AllowedComponentProps, VNodeProps } from './_common'


declare interface StickyProps {
  /**
   * 吸顶时与顶部的距离，单位rpx
   * @default 0
   */
  offsetTop?: string | number
  /**
   * 导航栏高度，自定义导航栏时，需要传入此值
   * @default 0
   */
  customNavHeight?: string | number
  /**
   * 是否禁用吸顶功能
   * @default false
   */
  disabled?: boolean
  /**
   * 组件背景颜色
   * @default #ffffff
   */
  bgColor?: string
  /**
   * 吸顶时的z-index值，NVUE无效
   */
  zIndex?: string | number
  /**
   * 自定义标识，用于区分是哪一个组件
   */
  index?: string | number
}

declare interface StickySlots {
  ['default']?: () => any
}

declare interface _Sticky {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      StickyProps
    $slots: StickySlots
  }
}

export declare const Sticky: _Sticky
