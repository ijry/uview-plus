import { AllowedComponentProps, VNodeProps } from './_common'

declare interface SwiperIndicatorProps {
  /**
   * 轮播的长度
   * @default 0
   */
  length?: string | number
  /**
   * 当前处于活动状态的轮播的索引
   * @default 0
   */
  current?: string | number
  /**
   * 指示器非激活颜色
   */
  indicatorActiveColor?: string
  /**
   * 指示器的激活颜色
   */
  indicatorInactiveColor?: string
  /**
   * 指示器的形式
   * @default "line"
   */
  indicatorStyle?: 'line' | 'dot'
}

declare interface _SwiperIndicator {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      SwiperIndicatorProps
  }
}

export declare const SwiperIndicator: _SwiperIndicator
