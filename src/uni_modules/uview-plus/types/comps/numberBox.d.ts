import { AllowedComponentProps, VNodeProps } from './_common'

/**
 * focus/blur 的回调载荷（对象形式）
 * - 除下列字段外，还会带上平台原生 event.detail 中的其他字段
 */
declare interface NumberBoxFocusPayload {
  /** 输入框当前值 */
  value: string | number
  /** 步进器标识符，即 name 属性 */
  name: string | number
  [key: string]: any
}

/** change 的回调载荷（对象形式） */
declare interface NumberBoxChangePayload {
  /** 输入框当前值 */
  value: string | number
  /** 步进器标识符，即 name 属性 */
  name: string | number
  /** 本次变更来源：plus-点击加号，minus-点击减号，手动输入时为空字符串 */
  type: 'plus' | 'minus' | ''
}

declare interface NumberBoxProps {
  /**
   * 步进器标识符，在change回调返回
   */
  name?: string | number
  /**
   * 用于双向绑定的值（v-model），初始化时会被格式化到 min~max 之间
   * @default 0
   */
  modelValue?: string | number
  /**
   * 用于双向绑定的值
   * @deprecated 仅 Vue2 可用，Vue3 请使用 modelValue（即 v-model）
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
   * @default null
   */
  decimalLength?: string | number | null
  /**
   * 是否允许长按进行加减
   * @default true
   */
  longPress?: boolean
  /**
   * 输入框文字和加减按钮图标的颜色，留空则跟随主题变量
   * @default ""
   */
  color?: string
  /**
   * 按钮宽度，单位px
   * @default 30
   */
  buttonWidth?: string | number
  /**
   * 按钮大小，宽高等于此值，单位px，输入框高度和此值保持一致
   * @default 30
   */
  buttonSize?: string | number
  /**
   * 按钮圆角
   * @default "0px"
   */
  buttonRadius?: string
  /**
   * 输入框和按钮的背景颜色，留空则跟随主题变量
   * @default ""
   */
  bgColor?: string
  /**
   * 按钮禁用时的背景颜色，留空则跟随主题变量
   * @version 3.4.57
   * @default ""
   */
  disabledBgColor?: string
  /**
   * 输入框独立背景颜色，留空则跟随 bgColor
   * @default ""
   */
  inputBgColor?: string
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
  iconStyle?: string | Record<string, any>
  /**
   * 迷你模式，常用于外卖场景，值为0时只显示加号按钮
   * @default false
   */
  miniMode?: boolean
  /**
   * modelValue 变化时触发（v-model 内部使用）
   * @param value 格式化后的最新值
   */
  ['onUpdate:modelValue']?: (value: string | number) => any
  /**
   * 输入框得到焦点触发(按钮可点击情况下)，回调参数为对象
   * @param event 对象形式，包含 value(输入框当前值)、name(步进器标识符)
   */
  onFocus?: (event: NumberBoxFocusPayload) => any
  /**
   * 输入框失去焦点时触发，回调参数为对象
   * @param event 对象形式，包含 value(输入框当前值)、name(步进器标识符)
   */
  onBlur?: (event: NumberBoxFocusPayload) => any
  /**
   * 输入框内容发生变化时触发，回调参数为对象
   * @param event 对象形式，包含 value(输入框当前值)、name(步进器标识符)、type(变更来源)
   */
  onChange?: (event: NumberBoxChangePayload) => any
  /**
   * 超过范围阈值时触发
   * @param type 限制类型，minus-已达最小值，plus-已达最大值
   */
  onOverlimit?: (type: 'minus' | 'plus') => any
  /**
   * 点击增加按钮时触发（未超过阈值时）
   */
  onPlus?: () => any
  /**
   * 点击减少按钮时触发（未超过阈值时）
   */
  onMinus?: () => any
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
