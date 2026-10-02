import { AllowedComponentProps, VNodeProps } from './_common'

declare interface ListItemProps {
  /**
   * item的锚点，将u-list的scroll-into-view设置为该值即可滚动到此item
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
