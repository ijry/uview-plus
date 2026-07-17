import { AllowedComponentProps, VNodeProps } from './_common'

declare interface TooltipProps {
  /**
   * 需要显示的提示文字
   */
  text?: string | number
  /**
   * 点击复制按钮时，复制的文本，为空则使用text值
   */
  copyText?: string | number
  /**
   * 文本大小
   * @default 14
   */
  size?: string | number
  /**
   * 字体颜色
   * @default "#606266"
   */
  color?: string
  /**
   * 弹出提示框时，文本的背景色
   * @default "transparent"
   */
  bgColor?: string
  /**
   * 弹出提示框的背景色
   */
  popupBgColor?: string
  /**
   * 弹出提示的方向
   * @default "top"
   */
  direction?: 'top' | 'bottom' | 'left' | 'right'
  /**
   * 弹出提示的z-index，nvue无效
   * @default 10071
   */
  zIndex?: string | number
  /**
   * 是否显示复制按钮
   * @default true
   */
  showCopy?: boolean
  /**
   * 扩展的按钮组
   */
  buttons?: any[]
  /**
   * 是否显示透明遮罩以防止触摸穿透
   * @default true
   */
  overlay?: boolean
  /**
   * 是否显示复制成功或者失败的`toast`
   * @default true
   */
  showToast?: boolean
  /**
   * 触发方式
   * @default "longpress"
   */
  triggerMode?: 'longpress' | 'click' | 'manual'
  /**
   * 强制定位
   */
  forcePosition?: Record<string, string | number>
  /**
   * 是否显示，triggerMode为manual时使用
   * @default false
   */
  show?: boolean
  /**
   * 是否开启单例模式，开启该属性的tooltip同一页面同时只显示一个
   * @default false
   */
  singleton?: boolean
  /**
   * 点击触发事件
   * @param index 被点击按钮的索引
   */
  onClick?: (index: number) => any
  /**
   * 显示状态变化时触发
   */
  ['onUpdate:show']?: (value: boolean) => any
  /**
   * 打开时触发
   */
  onOpen?: () => any
  /**
   * 关闭时触发
   */
  onClose?: () => any
}

declare interface _Tooltip {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      TooltipProps
  }
}

export declare const Tooltip: _Tooltip
