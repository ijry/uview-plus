import { AllowedComponentProps, VNodeProps } from './_common'


declare interface StepsItemProps {
  /**
   * 标题文字
   */
  title?: string
  /**
   * 描述文本
   */
  current?: string
  /**
   * 图标大小
   * @default 17
   */
  iconSize?: string | number
  /**
   * 当前步骤是否处于失败状态
   * @default false
   */
  error?: boolean
}

declare interface StepsItemSlots {
  /**
   * 自定步骤状态内容
   */
  ['default']?: () => any
}

declare interface _StepsItem {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      StepsItemProps
    $slots: StepsItemSlots
  }
}

export declare const StepsItem: _StepsItem
