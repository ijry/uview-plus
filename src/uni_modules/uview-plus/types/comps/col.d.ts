import { AllowedComponentProps, VNodeProps } from './_common'

declare interface ColProps {
  /**
   * 栅格占据的列数，总12等分
   * @default 0
   */
  span?: string | number
  /**
   * 分栏左边偏移，计算方式与span相同
   * @default 0
   */
  offset?: string | number
  /**
   * 水平排列方式(微信小程序暂不支持)
   * @default "start"
   */
  justify?: 'start' | 'flex-start' | 'end' | 'flex-end' | 'center' | 'around' | 'space-around' | 'between' | 'space-between'
  /**
   * 垂直排列方式
   * @default "stretch"
   */
  align?: 'top' | 'center' | 'bottom' | 'stretch'
  /**
   * 文字水平对齐方式
   * @default 'left
   */
  textAlign?: 'left' | 'center' | 'right'
  /**
   * 点击触发事件
   */
  onClick?: () => any
}

declare interface _Col {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      ColProps
  }
}

export declare const Col: _Col
