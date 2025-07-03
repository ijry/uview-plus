import { AllowedComponentProps, VNodeProps } from './_common'

declare interface SwipeActionProps {
  /**
   * 是否自动关闭其他swipe按钮组
   * @default true
   */
  autoClose?: boolean
  /**
   * 点击组件时触发
   * @param index 索引
   */
  onClick?: (index: number) => any
}

declare interface _SwipeAction {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      SwipeActionProps
  }
}

export declare const SwipeAction: _SwipeAction
