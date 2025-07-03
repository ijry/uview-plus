import { AllowedComponentProps, VNodeProps } from './_common'

declare interface ScrollListProps {
  /**
   * 指示器的整体宽度
   * @default 50
   */
  indicatorWidth?: string | number
  /**
   * 滑块的宽度
   * @default 20
   */
  indicatorBarWidth?: string | number
  /**
   * 是否显示面板指示器
   * @default true
   */
  indicator?: boolean
  /**
   * 指示器非激活颜色
   * @default "#f2f2f2"
   */
  indicatorColor?: string
  /**
   * 指示器滑块颜色
   * @default "#3c9cff"
   */
  indicatorActiveColor?: string
  /**
   * 指示器样式，可通过bottom，left，right进行定位
   */
  indicatorStyle: string | Record<string, any>
  /**
   * 滑动到左边时触发
   */
  onLeft?: () => any
  /**
   * 滑动到右边时触发
   */
  onRight?: () => any
}

declare interface _ScrollList {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      ScrollListProps
  }
}

export declare const ScrollList: _ScrollList
