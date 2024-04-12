import { AllowedComponentProps, VNodeProps } from './_common'

declare interface NoticeBarProps {
  /**
   * 显示的内容，direction为column时要求为数组， 为row时要求为字符串
   */
  text?: string | string[]
  /**
   * 通告滚动模式，row-横向滚动，column-竖向滚动
   * @default "row"
   */
  direction?: 'row' | 'column'
  /**
   * direction = row时，是否使用步进形式滚动
   * @default false
   */
  step?: boolean
  /**
   * 是否显示左侧的音量图标
   * @default "volume"
   */
  icon?: string
  /**
   * 通告模式，link-显示右箭头，closable-显示右侧关闭图标
   */
  mode?: 'link' | 'closable'
  /**
   * 文字颜色
   * @default "#f9ae3d"
   */
  color?: string
  /**
   * 背景颜色
   * @default "#fdf6ec"
   */
  bgColor?: string
  /**
   * 水平滚动时的滚动速度，即每秒滚动多少px(rpx)，这有利于控制文字无论多少时，都能有一个恒定的速度
   * @default 80
   */
  speed?: string | number
  /**
   * 字体大小
   * @default 14
   */
  fontSize?: string | number
  /**
   * 滚动一个周期的时间长，单位ms
   * @default 2000
   */
  duration?: string | number
  /**
   * 是否禁止用手滑动切换（目前HX2.6.11，只支持App 2.5.5+、H5 2.5.5+、支付宝小程序、字节跳动小程序）
   * @default true
   */
  disableTouch?: boolean
  /**
   * 跳转的页面路径
   */
  url?: string
  /**
   * 页面跳转的类型
   * @default "navigateTo"
   */
  linkType?: string
  /**
   * 点击通告文字触发
   * @param index 点击的text的索引
   */
  onClick?: (index: number) => any
  /**
   * 点击右侧关闭图标触发
   */
  onClose?: () => any
}

declare interface _NoticeBar {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      NoticeBarProps
  }
}

export declare const NoticeBar: _NoticeBar
