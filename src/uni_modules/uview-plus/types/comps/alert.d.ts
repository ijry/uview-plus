import { AllowedComponentProps, VNodeProps } from './_common'

declare interface AlertProps {
  /**
   * 显示的文字
   */
  title?: string
  /**
   * 使用预设的颜色
   * @default "warning"
   */
  type?: 'warning' | 'success' | 'primary' | 'error' | 'info'
  /**
   * 辅助性文字，颜色比`title`浅一点，字号也小一点，可选
   */
  description?: string
  /**
   * 关闭按钮(默认为叉号icon图标)
   * @default false
   */
  closable?: boolean
  /**
   * 是否显示左边的辅助图标
   * @default false
   */
  showIcon?: boolean
  /**
   * 多图时，图片缩放裁剪的模式
   */
  effect?: 'light' | 'dark'
  /**
   * 文字是否居中
   * @default false
   */
  center?: boolean
  /**
   * 字体大小
   * @default 14
   */
  fontSize?: string | number
  /**
   * 点击组件时触发
   */
  onClick?: () => any
}

declare interface _Alert {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      AlertProps
  }
}

export declare const Alert: _Alert
