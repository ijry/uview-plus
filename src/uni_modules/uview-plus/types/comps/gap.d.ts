import { AllowedComponentProps, VNodeProps } from './_common'

declare interface GapProps {
  /**
   * 背景颜色
   * @default "transparent"
   */
  bgColor?: string
  /**
   * 间隔槽高度，单位px
   * @default 20
   */
  height?: string | number
  /**
   * 与前一个元素的距离，单位px
   * @default 0
   */
  marginTop?: string | number
  /**
   * 与后一个元素的距离，单位px
   * @default 0
   */
  marginBottom?: string | number
}

declare interface _Gap {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      GapProps
  }
}

export declare const Gap: _Gap

