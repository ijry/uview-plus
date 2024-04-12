import { AllowedComponentProps, VNodeProps } from './_common'

declare interface NoNetworkProps {
  /**
   * 没有网络时的提示语
   * @default "哎呀，网络信号丢失"
   */
  tips?: string
  /**
   * 组件的`z-index`值
   * @default 10080
   */
  zIndex?: string | number
  /**
   * 无网络的图片提示，可用的src地址或base64图片
   */
  image?: string
  /**
   * 用户点击页面的"重试"按钮时触发
   */
  onRetry?: () => any
  /**
   * "重试"后，有网络触发
   */
  onConnected?: () => any
  /**
   * "重试"后，无网络触发
   */
  onDisconnected?: () => any
}

declare interface _NoNetwork {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      NoNetworkProps
  }
}

export declare const NoNetwork: _NoNetwork
