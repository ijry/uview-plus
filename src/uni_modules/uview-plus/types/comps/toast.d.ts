import { AllowedComponentProps, VNodeProps } from './_common'

declare interface ToastProps {
  /**
   * 是否加载中
   * @default false
   */
  loading?: boolean
  /**
   * 显示的文本
   */
  message?: string | number
  /**
   * 图标，或者绝对路径的图片
   */
  icon?: string
  /**
   * toast出现的位置
   * @default "center"
   */
  position?: 'top' | 'center' | 'bottom'
  /**
   * 主题类型
   * @default "default"
   */
  type?: 'default' | 'error' | 'success' | 'loading'
  /**
   * 跳转的参数
   */
  params?: Record<string, any>
  /**
   * 展示时间，单位ms
   * @default 2000
   */
  duration?: string | number
  /**
   * 执行完后的回调函数
   */
  complete?: () => any
}

declare interface _ToastRef {
  /**
   * 显示toast，如需一进入页面就显示toast，请在onReady生命周期调用
   */
  show: () => void
}

declare interface _Toast {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      ToastProps
  }
}

export declare const Toast: _Toast

export declare const ToastRef: _ToastRef
