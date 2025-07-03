import { AllowedComponentProps, VNodeProps } from './_common'

declare interface NumberBoxProps {
  /**
   * 步进器标识符，在change回调返回
   */
  name?: string | number
  /**
   * 用于双向绑定的值，初始化时设置设为默认min值(最小值)
   * @default 1
   */
  value?: string | number
  /**
   * 用户可输入的最小值
   * @default 1
   */
  min?: string | number
  /**
   * 用户可输入的最大值
   * @default Number.MAX_SAFE_INTEGER
   */
  max?: string | number
  /**
   * 步长，每次加或减的值， 支持小数值，如需小数
   * @default 1
   */
  step?: string | number
  /**
   * 是否只能输入正整数
   * @default false
   */
  integer?: boolean
  /**
   * 是否禁用操作，包括输入框，加减按钮
   * @default false
   */
  disabled?: boolean
  /**
   * 是否禁止输入框
   * @default false
   */
  disabledInput?: boolean
  /**
   * 是否开启异步变更，开启后需要手动控制输入值
   * @default false
   */
  asyncChange?: boolean
  /**
   * 输入框宽度，单位px
   * @default 35
   */
  inputWidth?: string | number
  /**
   * 是否显示减少按钮
   * @default true
   */
  showMinus?: boolean
  /**
   * 是否显示增加按钮
   * @default true
   */
  showPlus?: boolean
  /**
   * 显示的小数位数
   */
  decimalLength?: string | number
  /**
   * 是否允许长按进行加减
   * @default true
   */
  longPress?: boolean
  /**
   * 输入框文字和加减按钮图标的颜色
   * @default "#323233"
   */
  color?: string
  /**
   * 按钮大小，宽高等于此值，单位px，输入框高度和此值保持一致
   * @default 30
   */
  buttonSize?: string | number
  /**
   * 输入框和按钮的背景颜色
   * @default "#EBECEE"
   */
  bgColor?: string
  /**
   * 指定光标于键盘的距离，避免键盘遮挡输入框，单位px
   * @default 100
   */
  cursorSpacing?: string | number
  /**
   * 是否禁用增加按钮
   * @default false
   */
  disablePlus?: boolean
  /**
   * 是否禁用减少按钮
   * @default false
   */
  disableMinus?: boolean
  /**
   * 加减按钮图标的样式
   */
  iconStyle?: string
  /**
   * 输入框得到焦点触发(按钮可点击情况下)
   * @param value 输入框当前值
   * @param value 步进器标识符
   */
  onFocus?: (value: any, name: any) => any
  /**
   * 输入框失去焦点时触发
   * @param value 输入框当前值
   * @param value 步进器标识符
   */
  onBlur?: (value: any, name: any) => any
  /**
   * 输入框内容发生变化时触发
   * @param value 输入框当前值
   * @param value 步进器标识符
   */
  onChange?: (value: any, name: any) => any
  /**
   * 超过范围阈值时触发
   * @type type 限制类型
   */
  onOverlimit?: (type: 'minus' | 'plus') => any
}

declare interface NumberBoxSlots {
  /**
   * 减少按钮
   */
  ['minus']?: () => any
  /**
   * 输入框
   */
  ['input']?: () => any
  /**
   * 增加按钮
   */
  ['plus']?: () => any
}

declare interface _NumberBox {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      NumberBoxProps
    $slots: NumberBoxSlots
  }
}

export declare const NumberBox: _NumberBox
