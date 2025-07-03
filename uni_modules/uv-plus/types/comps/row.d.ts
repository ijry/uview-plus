import { AllowedComponentProps, VNodeProps } from './_common'


declare interface RowProps {
  /**
   * 栅格间隔，左右各为此值的一半，单位任意
   * @default 0
   */
  gutter?: string | number
  /**
   * 水平排列方式(微信小程序暂不支持)
   * @default "start"
   */
  justify?: 'start' | 'flex-start' | 'end' | 'flex-end' | 'center' | 'around' | 'space-around' | 'between' | 'space-between'
  /**
   * 垂直排列方式
   * @default "center"
   */
  align?: 'top' | 'center' | 'bottom'
  /**
   * 点击触发事件
   */
  onClick?: () => any
}

declare interface _Row {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      RowProps
  }
}

export declare const Row: _Row
