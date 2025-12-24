import { AllowedComponentProps, VNodeProps } from './_common'

declare interface ModalProps {
  /**
   * 是否显示模态框，请赋值给`show`
   * @default false
   */
  show?: boolean
  /**
   * 标题内容
   */
  title?: string
  /**
   * 模态框内容，如传入`slot`内容，则此参数无效
   */
  content?: string
  /**
   * 确认按钮的文字
   * @default "确认"
   */
  confirmText?: string
  /**
   * 取消按钮的文字
   * @default "取消"
   */
  cancelText?: string
  /**
   * 是否显示确认按钮
   * @default true
   */
  showConfirmButton?: boolean
  /**
   * 是否显示取消按钮
   * @default false
   */
  showCancelButton?: boolean
  /**
   * 确认按钮的颜色
   * @default "#2979ff"
   */
  confirmColor?: string
  /**
   * 取消按钮的颜色
   * @default "#606266"
   */
  cancelColor?: string
  /**
   * 对调确认和取消的位置
   * @default false
   */
  buttonReverse?: boolean
  /**
   * 是否开启缩放模式
   * @default true
   */
  zoom?: boolean
  /**
   * 是否异步关闭，只对确定按钮有效
   * @default false
   */
  asyncClose?: boolean
  /**
   * 是否允许点击遮罩关闭Modal（注意：关闭事件需要自行处理，只会在开启closeOnClickOverlay后点击遮罩层执行close回调）
   * @default false
   */
  closeOnClickOverlay?: boolean
  /**
   * 往上偏移的值，给一个负的margin-top，往上偏移，避免和键盘重合的情况，单位任意，数值则默认为rpx单位
   * @default 0
   */
  negativeTop?: string | number
  /**
   * modal宽度，不支持百分比，可以数值，px，rpx单位
   * @default "650rpx"
   */
  width?: string | number
  /**
   * 确认按钮的样式,如设置，将不会显示取消按钮
   */
  confirmButtonShape?: 'circle' | 'square'
  /**
   * 点击确认按钮时触发
   */
  onConfirm?: () => any
  /**
   * 点击取消按钮时触发
   */
  onCancel?: () => any
  /**
   * 点击遮罩关闭出发，closeOnClickOverlay为true有效
   */
  onClose?: () => any
}

declare interface ModalSlots {
  /**
   * 传入自定义内容，一般为富文本
   */
  ['default']?: () => any
  /**
   * 传入自定义按钮，用于在微信小程序弹窗通过按钮授权的场景
   */
  ['confirmButton']?: () => any
}

declare interface _Modal {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      ModalProps
    $slots: ModalSlots
  }
}

export declare const Modal: _Modal
