import { AllowedComponentProps, VNodeProps } from './_common'

declare interface NotifyProps {
  /**
   * 到顶部的距离
   * @default 0
   */
  top?: string | number
  /**
   * 主题
   * @default "primary"
   */
  type?: 'primary' | 'success' | 'warning' | 'error'
  /**
   * 字体颜色
   * @default "#fff"
   */
  color?: string
  /**
   * 背景颜色
   */
  bgColor?: string
  /**
   * 展示的文字内容
   */
  message?: string
  /**
   * 展示时长，为0时不消失，单位ms
   * @default 3000
   */
  duration?: string | number
  /**
   * 字体大小，单位rpx
   * @default 15
   */
  fontSize?: string | number
  /**
   * 是否留出顶部安全距离（状态栏高度）
   * @default false
   */
  safeAreaInsetTop?: boolean
}

declare interface NotifySlots {
  /**
   * 通知内容
   */
  ['icon']?: () => any
}

declare interface _NotifyRef {
  /**
   * 显示并加载配置
   */
  show: (options: NotifyProps) => void
  /**
   * 关闭消息提示
   */
  close: () => void
}

declare interface _Notify {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      NotifyProps
    $slots: NotifySlots
  }
}

export declare const Notify: _Notify

export declare const NotifyRef: _NotifyRef
