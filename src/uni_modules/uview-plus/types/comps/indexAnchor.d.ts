import { AllowedComponentProps, VNodeProps } from './_common'

declare interface IndexAnchorProps {
  /**
   * 列表锚点文本内容
   */
  text?: string | number
  /**
   * 列表锚点文字颜色
   * @default "#606266"
   */
  color?: string
  /**
   * 列表锚点文字大小，单位默认px
   * @default 14
   */
  size?: string | number
  /**
   * 列表锚点背景颜色
   * @default "#dedede"
   */
  bgColor?: string
  /**
   * 列表锚点高度，单位默认px
   * @default 32
   */
  height?: string | number
}

declare interface _IndexAnchor {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      IndexAnchorProps
  }
}

export declare const IndexAnchor: _IndexAnchor
