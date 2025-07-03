import { AllowedComponentProps, VNodeProps } from './_common'

declare interface OverlayProps {
  /**
   * 是否显示遮罩
   * @default false
   */
  show?: boolean
  /**
   * z-index 层级
   * @default 10070
   */
  zIndex?: string | number
  /**
   * 动画时长，单位毫秒
   * @default 300
   */
  duration?: string | number
  /**
   * 不透明度值，当做rgba的第四个参数
   * @default 0.5
   */
  opacity?: string | number
  /**
   * 点击遮罩发送此事件
   */
  onClick?: () => any
}

declare interface OverlaySlots {
  /**
   * 默认插槽，用于在遮罩层上方嵌入内容
   */
  ['default']?: () => any
}

declare interface _Overlay {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      OverlayProps
    $slots: OverlaySlots
  }
}

export declare const Overlay: _Overlay
