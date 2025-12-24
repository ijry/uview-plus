import { AllowedComponentProps, VNodeProps } from './_common'

declare interface LoadingPageProps {
  /**
   * 提示内容
   * @default "正在加载"
   */
  loadingText?: string | number
  /**
   * 文字上方用于替换loading动画的图片
   */
  image?: string
  /**
   * 加载动画的模式
   * @default "circle"
   */
  loadingMode?: 'circle' | 'spinner' | 'semicircle'
  /**
   * 是否加载中
   * @default false
   */
  loading?: boolean
  /**
   * 背景颜色
   * @default "#ffffff"
   */
  bgColor?: string
  /**
   * 文字颜色
   * @default "#C8C8C8"
   */
  color?: string
  /**
   * 文字大小
   * @default 19
   */
  fontSize?: string | number
  /**
   * 图标大小
   * @default 28
   */
  iconSize?: string | number
  /**
   * 加载中图标的颜色
   * @default "#C8C8C8"
   */
  loadingColor?: string
}

declare interface _LoadingPage {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      LoadingPageProps
  }
}

export declare const LoadingPage: _LoadingPage
