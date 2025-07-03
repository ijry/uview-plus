import { AllowedComponentProps, VNodeProps } from './_common'

declare interface GridItemProps {
  /**
   * 宫格的name
   */
  name?: string | number
  /**
   * 宫格的背景颜色
   * @default "transparent"
   */
  bgColor?: string
  /**
   * 点击宫格触发
   * @param name `grid-item` 的 `name`
   */
  onClick?: (name: any) => any
}

declare interface _GridItem {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      GridItemProps
  }
}

export declare const GridItem: _GridItem
