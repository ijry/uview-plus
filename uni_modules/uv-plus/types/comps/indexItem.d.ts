import { AllowedComponentProps, VNodeProps } from './_common'

declare interface IndexItemSlots {
  /**
   * 自定义列表内容
   */
  ['default']?: () => any
}

declare interface _IndexItem {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps
    $slots: IndexItemSlots
  }
}

export declare const IndexItem: _IndexItem
