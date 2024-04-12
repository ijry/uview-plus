import { AllowedComponentProps, VNodeProps } from './_common'

declare interface ListItemProps {
  /**
   * 用于滚动到指定item
   */
  anchor?: string | number
}

declare interface _ListItem {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      ListItemProps
  }
}

export declare const ListItem: _ListItem
