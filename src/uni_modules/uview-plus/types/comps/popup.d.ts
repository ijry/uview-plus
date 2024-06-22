import { AllowedComponentProps, VNodeProps } from './_common'

declare interface PopupProps {
  /**
   * 是否展示弹窗
   * @default false
   */
  show?: boolean
  /**
   * 是否显示遮罩
   * @default true
   */
  overlay?: boolean
  /**
   * 弹出方向
   * @default 'bottom'
   */
  mode?: 'top' | 'right' | 'left'| 'bottom' | 'center'
  /**
   * 遮罩打开或收起的动画过渡时间，单位ms
   * @default 300
   */
  duration?: number
  /**
   * 是否显示关闭图标
   * @default false
   */
  closeable?: boolean
  /**
   * 遮罩自定义样式，一般用于修改遮罩颜色，如：{background: 'rgba(3, 100, 219, 0.5)'}
   */
  overlayStyle?: unknown
  /**
   * 遮罩透明度，0-1之间，勿与overlayStyle共用
   * @default 0.5
   */
  overlayOpacity?: number | string
  /**
   * 点击遮罩是否关闭弹窗（注意：关闭事件需要自行处理，只会在开启closeOnClickOverlay后点击遮罩层执行close回调）
   * @default true
   */
  closeOnClickOverlay?: boolean
  /**
   * 弹出层的z-index值
   * @default 10075
   */
  zIndex?: number | string
  /**
   * 是否为留出底部安全距离
   * @default true
   */
  safeAreaInsetBottom?: boolean
  /**
   * 是否留出顶部安全距离（状态栏高度）
   * @default false
   */
  safeAreaInsetTop?: boolean
  /**
   * 自定义关闭图标位置，top-left为左上角，top-right为右上角，bottom-left为左下角，bottom-right为右下角
   */
  closeIconPos?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /**
   * 设置圆角值，仅对mode = top | bottom | center有效
   * @default 0
   */
  round?: number | string
  /**
   * 当mode=center时 是否开启缩放
   * @default true
   */
  zoom?: boolean
  /**
   * 背景色，一般用于特殊弹窗内容场景，设置为transparent可去除默认的白色背景
   */
  bgColor?: string
  /**
   * 用户自定义样式
   */
  customStyle?: unknown
  /**
   * 弹出层打开
   */
  onOpen?: () => any
  /**
   * 弹出层收起
   */
  onClose?: () => any
}

declare interface PopupSlots {
  ['default']?: () => any
}

declare interface _Popup {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      PopupProps
    $slots: PopupSlots
  }
}

export declare const Popup: _Popup
