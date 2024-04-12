import { AllowedComponentProps, VNodeProps } from './_common'

declare interface BadgeProps {
  /**
   * 不展示数字，只有一个小点
   * @default false
   */
  isDot?: boolean
  /**
   * 展示的数字，大于`overflowCount`时显示为`${overflowCount}+`，为`0`且`show-zero`为`false`时隐藏
   */
  value?: string | number
  /**
   * 组件是否显示
   * @default true
   */
  show?: boolean
  /**
   * 最大值，超过最大值会显示 '{max}+'
   * @default 99
   */
  max?: string | number
  /**
   * 主题类型
   * @default "error"
   */
  type?: 'error' | 'warning' | 'success' | 'primary' | 'info'
  /**
   * 当数值为 0 时，是否展示 Badge
   * @default false
   */
  showZero?: boolean
  /**
   * 背景颜色，优先级比`type`高，如设置，`type`参数会失效
   */
  bgColor?: string
  /**
   * 字体颜色
   * @default "#fff"
   */
  color?: string
  /**
   * 徽标形状，circle-四角均为圆角，horn-左下角为直角
   * @default "circle"
   */
  shape?: 'circle' | 'horn'
  /**
   * 置数字的显示方式，详细见[文档](https://www.uviewui.com/components/badge.html#%E8%AE%BE%E7%BD%AE%E6%95%B0%E5%AD%97%E7%9A%84%E6%98%BE%E7%A4%BA%E6%96%B9%E5%BC%8F-overflow-ellipsis-limit)
   * @default "overflow"
   */
  numberType?: 'overflow' | 'ellipsis' | 'limit'
  /**
   * 设置badge的位置偏移，格式为 [x, y]，也即设置的为`top`和`right`的值，`absolute`为`true`时有效
   */
  offset?: string[]
  /**
   * 是否反转背景和字体颜色
   * @default false
   */
  inverted?: boolean
  /**
   * 组件是否绝对定位，为`true`时，`offset`参数才有效
   * @default false
   */
  absolute?: boolean
}

declare interface _Badge {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      BadgeProps
  }
}

export declare const Badge: _Badge
