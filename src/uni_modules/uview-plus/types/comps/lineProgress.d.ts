import { AllowedComponentProps, VNodeProps } from './_common'

declare interface LineProgressProps {
  /**
   * 进度条激活部分的颜色
   * @default "#19be6b"
   */
  activeColor?: string
  /**
   * 进度条的底色，默认为灰色
   * @default "#ececec"
   */
  inactiveColor?: string
  /**
   * 进度百分比，数值
   * @default 0
   */
  percentage?: string | number
  /**
   * 是否在进度条内部显示百分比的值
   * @default true
   */
  showText?: boolean
  /**
   * 进度条的高度，默认单位px
   * @default 12
   */
  height?: string | number
  /**
   * 点击触发事件
   */
  onClick?: () => any
}

declare interface LineProgressSlots {
  /**
   * 传入自定义的显示内容，将会覆盖默认显示的百分比值
   */
  ['default']?: (arg: any) => any
}

declare interface _LineProgress {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      LineProgressProps
    $slots: LineProgressSlots
  }
}

export declare const LineProgress: _LineProgress
