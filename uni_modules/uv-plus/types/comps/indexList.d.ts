import { AllowedComponentProps, VNodeProps } from './_common'

declare interface IndexListProps {
  /**
   * 右边锚点状态非激活时的颜色
   * @default "#606266"
   */
  inactiveColor?: string
  /**
   * 右边锚点状态激活时的颜色
   * @default "#5677fc"
   */
  activeColor?: string
  /**
   * 索引字符列表，数组
   * @default "A-Z"
   */
  indexList?: (string | number)[]
  /**
   * 是否开启锚点自动吸顶
   * @default true
   */
  sticky?: boolean
  /**
   * 自定义导航栏的高度，单位默认px
   * @default 0
   */
  customNavHeight?: string | number
}

declare interface _IndexList {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      IndexListProps
  }
}

export declare const IndexList: _IndexList
