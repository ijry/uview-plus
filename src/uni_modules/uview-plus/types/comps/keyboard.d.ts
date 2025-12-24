import { AllowedComponentProps, VNodeProps } from './_common'

declare interface KeyboardProps {
  /**
   * 键盘的类型，number-数字键盘，card-身份证键盘，car-车牌号键盘
   * @default "car"
   */
  mode?: 'car' | 'number' | 'card'
  /**
   * 是否显示"."按键，只在mode=number时有效
   * @default false
   */
  dotDisabled?: boolean
  /**
   * 是否显示键盘顶部工具条
   * @default true
   */
  tooltip?: boolean
  /**
   * 是否显示工具条中间的提示
   * @default true
   */
  showTips?: boolean
  /**
   * 工具条中间的提示文字，详见[文档](https://www.uviewui.com/components/keyboard.html#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8)
   */
  tips?: string
  /**
   * 是否显示工具条左边的"取消"按钮
   * @default true
   */
  showCancel?: boolean
  /**
   * 是否显示工具条右边的"完成"按钮
   * @default true
   */
  showConfirm?: boolean
  /**
   * 是否打乱键盘按键的顺序
   * @default false
   */
  random?: boolean
  /**
   * 是否开启底部安全区适配
   * @default false
   */
  safeAreaInsetBottom?: boolean
  /**
   * 是否允许点击遮罩收起键盘（注意：关闭事件需要自行处理，只会在开启closeOnClickOverlay后点击遮罩层执行close回调）
   * @default true
   */
  closeOnClickOverlay?: boolean
  /**
   * 控制键盘的弹出与收起
   * @default true
   */
  show?: boolean
  /**
   * 是否显示遮罩
   * @default true
   */
  overlay?: boolean
  /**
   * 弹出键盘的`z-index`值
   * @default 1075
   */
  zIndex?: string | number
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
   * 自定义样式
   */
  customStyle?: unknown
  /**
   * `mode`为`car`下，输入文字后，是否自动切换为字母模式
   * @default false
   */
  autoChange?: boolean
  /**
   * 按键被点击(不包含退格键被点击)
   */
  onChange?: () => any
  /**
   * 键盘关闭
   */
  onClose?: () => any
  /**
   * 键盘顶部工具条右边的"完成"按钮被点击
   */
  onConfirm?: () => any
  /**
   * 键盘顶部工具条左边的"取消"按钮被点击
   */
  onCancel?: () => any
  /**
   * 键盘退格键被点击
   */
  onBackspace?: () => any
}

declare interface KeyboardSlots {
  /**
   * 内容将会显示键盘的工具条上面，可以结合MessageInput 验证码输入组件实现类似支付宝输入密码时，上方显示输入内容的功能
   */
  ['default']: () => any
}

declare interface _Keyboard {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      KeyboardProps
    $slots: KeyboardSlots
  }
}

export declare const Keyboard: _Keyboard
