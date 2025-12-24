import { AllowedComponentProps, VNodeProps } from './_common'

declare interface GridProps {
  /**
   * 宫格的列数
   * @default 3
   */
  col?: string | number
  /**
   * 是否显示宫格的边框
   * @default true
   */
  border?: boolean
  /**
   * 宫格的对齐方式，用于控制只有一两个宫格时的对齐场景
   * @default "left"
   */
  align?: 'left' | 'center' | 'right'
  /**
   * 点击宫格触发
   * @param name `grid-item` 的 `name`
   */
  onClick?: (name: any) => any
}

declare interface _Grid {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      GridProps
  }
}

export declare const Grid: _Grid
