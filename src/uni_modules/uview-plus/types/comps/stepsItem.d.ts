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
  // 自定步骤整体内容
  ['content']?: () => any,
  // 自定步骤图标
  ['icon']?: () => any,
  // 自定步骤标题
  ['title']?: () => any,
  // 自定步骤描述
  ['desc']?: () => any,
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
