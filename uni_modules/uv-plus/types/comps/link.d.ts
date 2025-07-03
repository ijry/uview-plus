import { AllowedComponentProps, VNodeProps } from './_common'

declare interface LinkProps {
  /**
   * 文字颜色
   * @default color['u-primary']
   */
  color?: string
  /**
   * 字体大小，默认单位px
   * @default 15
   */
  fontSize?: string | number
  /**
   * 是否显示下划线
   * @default false
   */
  underLine?: boolean
  /**
   * 跳转的链接，要带上http(s)
   */
  href?: string
  /**
   * 各个小程序平台把链接复制到粘贴板后的提示语
   * @default "链接已复制，请在浏览器打开"
   */
  mpTips?: string
  /**
   * 下划线颜色，默认同color参数颜色
   */
  lineColor?: string
  /**
   * 超链接的问题，不使用slot形式传入，是因为nvue下无法修改颜色
   */
  text?: string
}

declare interface LinkSlots {
  ['default']?: () => any
}

declare interface _Link {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      LinkProps
    $slots: LinkSlots
  }
}

export declare const Link: _Link
