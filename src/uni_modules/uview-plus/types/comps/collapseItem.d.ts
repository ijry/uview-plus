import { AllowedComponentProps, VNodeProps } from './_common'

declare interface CollapseItemProps {
  /**
   * 面板标题
   */
  title?: string
  /**
   * 标题右侧内容
   */
  value?: string
  /**
   * 标题下方的描述信息
   */
  label?: string
  /**
   * 面板是否可以打开或收起
   * @default false
   */
  disabled?: boolean
  /**
   * 是否展示右侧箭头并开启点击反馈
   * @default true
   */
  isLink?: boolean
  /**
   * 是否开启点击反馈
   * @default true
   */
  clickable?: boolean
  /**
   * 是否显示内边框
   * @default true
   */
  border?: boolean
  /**
   * 唯一标识符，如不设置，默认用当前`collapse-item`的索引值
   */
  name?: string | number
  /**
   * 标题左侧图片，可为绝对路径的图片或内置图标
   */
  icon?: string
  /**
   * 面板展开收起的过渡时间，单位`ms`
   * @default 300
   */
  duration?: number
}

declare interface CollapseItemSlots {
  /**
   * 主体部分的内容
   */
  ['default']?: () => any
  /**
   * 标题内容
   */
  ['title']?: () => any
  /**
   * icon
   */
  ['icon']?: () => any
  /**
   * 右侧value
   */
  ['value']?: () => any
  /**
   * 右侧icon
   */
  ['right-icon']?: () => any
}

declare interface _CollapseItem {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      CollapseItemProps
    $slots: CollapseItemSlots
  }
}

export declare const CollapseItem: _CollapseItem
