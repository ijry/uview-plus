import { AllowedComponentProps, VNodeProps } from './_common'

declare interface EmptyProps {
  /**
   * 内置图标名称，或图片路径，建议绝对路径
   */
  icon?: string
  /**
   * 文字提示
   */
  text?: string
  /**
   * 文字颜色
   * @default "#c0c4cc"
   */
  textColor?: string
  /**
   * 文字大小
   * @default 14
   */
  textSize?: string | number
  /**
   * 图标的颜色
   * @default "#c0c4cc"
   */
  iconColor?: string
  /**
   * 图标的大小
   * @default 90
   */
  iconSize?: string | number
  /**
   * 内置的图标，详细见[文档](https://www.uviewui.com/components/empty.html#%E5%86%85%E7%BD%AE%E5%9B%BE%E6%A0%87)
   * @default "data"
   */
  mode?: string
  /**
   * 图标的宽度，单位px
   * @default 160
   */
  width?: string | number
  /**
   * 图标的高度，单位px
   * @default 160
   */
  height?: string | number
  /**
   * 是否显示组件
   * @default true
   */
  show?: boolean
  /**
   * 组件到上一个元素的间距,单位px
   * @default 0
   */
  marginTop?: string | number
}

declare interface EmptySlots {
  ['default']?: () => any
}

declare interface _Empty {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      EmptyProps
    $slots: EmptySlots
  }
}

export declare const Empty: _Empty
