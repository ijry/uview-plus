import { AllowedComponentProps, VNodeProps } from './_common'


declare interface StepsProps {
  /**
   * 方向
   * @default "row"
   */
  direction?: 'row' | 'column'
  /**
   * 设置当前处于第几步
   * @default 0
   */
  current?: number | string
  /**
   * 激活状态颜色
   * @default "#3c9cff"
   */
  activeColor?: string
  /**
   * 未激活状态颜色
   * @default "#969799"
   */
  inactiveColor?: string
  /**
   * 激活状态的图标
   */
  activeIcon?: string
  /**
   * 未激活状态图标
   */
  inactiveIcon?: string
  /**
   * 是否显示点类型
   * @default false
   */
  dot?: boolean
}

declare interface _Steps {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      StepsProps
  }
}

export declare const Steps: _Steps
