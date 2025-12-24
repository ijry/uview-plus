import { AllowedComponentProps, VNodeProps } from './_common'

declare interface TabbarProps {
  /**
   * 当前匹配项的name
   * @default null
   */
  value?: string | number
  /**
   * 是否为iPhoneX留出底部安全距离
   * @default true
   */
  safeAreaInsetBottom?: boolean
  /**
   * 是否显示上方边框
   * @default true
   */
  border?: boolean
  /**
   * 元素层级z-index
   * @default 1
   */
  zIndex?: string | number
  /**
   * 选中标签的颜色
   * @default "#1989fa"
   */
  activeColor?: string
  /**
   * 未选中标签的颜色
   * @default "#7d7e80"
   */
  inactiveColor?: string
  /**
   * 是否固定在底部
   * @default true
   */
  fixed?: boolean
  /**
   * fixed定位固定在底部时，是否生成一个等高元素防止塌陷
   * @default true
   */
  placeholder?: boolean
}

declare interface _Tabbar {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      TabbarProps
  }
}

export declare const Tabbar: _Tabbar
