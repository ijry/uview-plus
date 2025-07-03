import { AllowedComponentProps, VNodeProps } from './_common'

declare interface LineProps {
  /**
   * 线条的颜色
   * @default "#d6d7d9"
   */
  color?: string
  /**
   * 长度，竖向时表现为高度，横向时表现为长度，可以为百分比，带rpx单位的值等
   * @default 100%
   */
  length?: string | number
  /**
   * 线条的方向，`row`-横向，`col`-竖向
   * @default "row"
   */
  direction?: "row" | "col"
  /**
   * 是否显示细边框
   * @default true
   */
  hairline?: boolean
  /**
   * 线条与上下左右元素的间距，字符串形式，如"30rpx"、"20rpx 30rpx"，默认单位px
   * @default 0
   */
  margin?: string | number
  /**
   * 是否虚线，false-实线，true-虚线
   * @default false
   */
  dashed?: boolean
}

declare interface _Line {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      LineProps
  }
}

export declare const Line: _Line
