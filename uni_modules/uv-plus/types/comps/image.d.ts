import { AllowedComponentProps, VNodeProps } from './_common'

export declare type ImageMode = 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix' | 'top' | 'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right'

declare interface ImageProps {
  /**
   * 图片地址，强烈建议使用绝对或者网络路径
   */
  src?: string
  /**
   * 裁剪模式
   * @default "aspectFill"
   */
  mode?: ImageMode
  /**
   * 宽度，单位任意，如果为数值，默认单位px
   * @default 300
   */
  width?: string | number
  /**
   * 高度，单位任意，如果为数值，默认单位px
   * @default 225
   */
  height?: string | number
  /**
   * 图片形状
   * @default "square"
   */
  shape?: 'circle' | 'square'
  /**
   * 圆角，默认单位px
   * @default 0
   */
  radius?: string | number
  /**
   * 是否懒加载，仅微信小程序、App、百度小程序、字节跳动小程序有效
   * @default true
   */
  lazyLoad?: boolean
  /**
   * 是否开启长按图片显示识别小程序码菜单，仅微信小程序有效
   */
  showMenuByLongpress?: boolean
  /**
   * 加载中的图标，或者小图片
   * @default "photo"
   */
  loadingIcon?: string
  /**
   * 加载失败的图标，或者小图片
   * @default "error-circle"
   */
  errorIcon?: string
  /**
   * 是否显示加载中的图标或者自定义的slot
   * @default true
   */
  showLoading?: boolean
  /**
   * 是否显示加载错误的图标或者自定义的slot
   * @default true
   */
  showError?: boolean
  /**
   * 是否需要淡入效果
   * @default true
   */
  fade?: boolean
  /**
   * 只支持网络资源，只对微信小程序有效
   * @default false
   */
  webp?: boolean
  /**
   * 搭配`fade`参数的过渡时间，单位ms
   * @default 500
   */
  duration?: string | number
  /**
   * 背景颜色，用于深色页面加载图片时，为了和背景色融合
   * @default "#f3f4f6"
   */
  bgColor?: string
  /**
   * 点击图片时触发
   */
  onClick?: () => any
  /**
   * 图片加载失败时触发
   * @param err 错误信息
   */
  onError?: (err: any) => any
  /**
   * 图片加载成功时触发
   */
  onLoad?: () => any
}

declare interface ImageSlots {
  /**
   * 自定义加载中的提示内容
   */
  ['loading']?: () => any
  /**
   * 自定义失败的提示内容
   */
  ['error']?: () => any
}

declare interface _Image {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      ImageProps
    $slots: ImageSlots
  }
}

export declare const Image: _Image
