import { AllowedComponentProps, VNodeProps } from './_common'

declare interface LoadingIconProps {
  /**
   * 是否显示动画
   * @default true
   */
  show?: boolean
  /**
   * 图标颜色
   * @default "color['u-tips-color']"
   */
  color?: string
  /**
   * 提示文本颜色
   * @default "color['u-tips-color']"
   */
  textColor?: string
  /**
   * 图标和文字是否垂直排列
   * @default false
   */
  vertical?: boolean
  /**
   * 模式选
   * @default "circle"
   */
  mode?: 'circle' | 'semicircle'
  /**
   * 加载图标的大小，单位px
   * @default 24
   */
  size?: string | number
  /**
   * 加载文字的大小，单位px
   * @default 15
   */
  textSize?: string | number
  /**
   * 文字内容
   */
  text?: string
  /**
   * 指定`animation-timing-function`的css属性，但只支持`mode`为`circle`或`semicircle`才有效
   * @default "ease-in-out"
   */
  timingFunction?: string
  /**
   * 动画执行周期时间，单位ms
   * @default 1200
   */
  duration?: string | number
  /**
   * 图标的暗边颜色, `mode`为`circle` 模式有效
   * @default "transparent"
   */
  inactiveColor?: string
}

declare interface _LoadingIcon {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      LoadingIconProps
  }
}

export declare const LoadingIcon: _LoadingIcon
