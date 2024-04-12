import { AllowedComponentProps, VNodeProps } from './_common'

declare interface InputProps {
  /**
   * 输入的值
   */
  value?: string | number
  /**
   * 输入框类型，详见[文档](https://www.uviewui.com/components/input.html#%E8%BE%93%E5%85%A5%E6%A1%86%E7%9A%84%E7%B1%BB%E5%9E%8B)
   * @default "text"
   */
  type?: 'text' | 'number' | 'idcard' | 'digit' | 'password'
  /**
   * 是否禁用输入框
   * @default false
   */
  disabled?: boolean
  /**
   * 禁用状态时的背景色
   * @default "#f5f7fa"
   */
  disabledColor?: string
  /**
   * 是否显示清除控件
   * @default false
   */
  clearable?: boolean
  /**
   * 是否密码类型
   * @default false
   */
  password?: boolean
  /**
   * 最大输入长度，设置为 -1 的时候不限制最大长度
   * @default -1
   */
  maxlength?: string | number
  /**
   * 输入框为空时的占位符
   */
  placeholder?: string
  /**
   * 指定placeholder的样式类，注意页面或组件的style中写了scoped时，需要在类名前写/deep/
   * @default "input-placeholder"
   */
  placeholderClass?: string
  /**
   * 指定placeholder的样式
   * @default "color: #c0c4cc"
   */
  placeholderStyle?: unknown
  /**
   * 是否显示输入字数统计，只在 type ="text"或type ="textarea"时有效
   * @default false
   */
  showWordLimit?: boolean
  /**
   * 设置右下角按钮的文字
   * @default "done"
   */
  confirmType?: 'send' | 'search' | 'next' | 'go' | 'done'
  /**
   * 点击键盘右下角按钮时是否保持键盘不收起，H5无效
   * @default false
   */
  confirmHold?: boolean
  /**
   * focus时，点击页面的时候不收起键盘，微信小程序有效
   * @default false
   */
  holdKeyboard?: boolean
  /**
   * 自动获取焦点，在 H5 平台能否聚焦以及软键盘是否跟随弹出，取决于当前浏览器本身的实现。nvue 页面不支持，需使用组件的 focus()、blur() 方法控制焦点
   * @default false
   */
  focus?: boolean
  /**
   * 键盘收起时，是否自动失去焦点，目前仅App3.0.0+有效
   * @default false
   */
  autoBlur?: boolean
  /**
   * 是否忽略组件内对文本合成系统事件的处理。为 false 时将触发 compositionstart、compositionend、compositionupdate 事件，且在文本合成期间会触发 input 事件
   * @default true
   */
  ignoreCompositionEvent?: boolean
  /**
   * 是否去掉 iOS 下的默认内边距，仅微信小程序，且type=textarea时有效
   * @default false
   */
  disableDefaultPadding?: boolean
  /**
   * 指定focus时光标的位置
   * @default -1
   */
  cursor?: string | number
  /**
   * 输入框聚焦时底部与键盘的距离
   * @default 30
   */
  cursorSpacing?: string | number
  /**
   * 光标起始位置，自动聚集时有效，需与selection-end搭配使用
   * @default -1
   */
  selectionStart?: string | number
  /**
   * 光标结束位置，自动聚集时有效，需与selection-start搭配使用
   * @default -1
   */
  selectionEnd?: string | number
  /**
   * 键盘弹起时，是否自动上推页面
   * @default true
   */
  adjustPosition?: boolean
  /**
   * 输入框内容对齐方式
   * @default "left"
   */
  inputAlign?: 'left' | 'center' | 'right'
  /**
   * 输入框字体的大小
   * @default "15px"
   */
  fontSize?: string | number
  /**
   * 输入框字体颜色
   * @default "#303133"
   */
  color?: string
  /**
   * 输入框前置图标
   */
  prefixIcon?: string
  /**
   * 前置图标样式
   */
  prefixIconStyle?: unknown
  /**
   * 输入框后置图标
   */
  suffixIcon?: string
  /**
   * 后置图标样式
   */
  suffixIconStyle?: unknown
  /**
   * 边框类型，surround-四周边框，bottom-底部边框，none-无边框
   * @default "surround"
   */
  border?: 'surround' | 'bottom' | 'none'
  /**
   * 是否只读，与disabled不同之处在于disabled会置灰组件，而readonly则不会
   * @default false
   */
  readonly?: boolean
  /**
   * 输入框形状，circle-圆形，square-方形
   * @default "square"
   */
  shape?: 'square' | 'circle'
  /**
   * 输入过滤或格式化函数(如需兼容微信小程序，则只能通过`setFormatter`方法)
   */
  formatter?: (...args: any) => any
  /**
   * 定义需要用到的外部样式
   */
  customStyle?: unknown
  /**
   * 输入框失去焦点时触发
   * @param value 内容值
   */
  onBlur?: (value: any) => any
  /**
   * 输入框聚焦时触发
   */
  onFocus?: () => any
  /**
   * 点击完成按钮时触发
   * @param value 内容值
   */
  onConfirm?: (value: any) => any
  /**
   * 键盘高度发生变化的时候触发此事件
   */
  onKeyboardheightchange?: () => any
  /**
   * 内容发生变化触发此事件
   * @param value 内容值
   */
  onInput?: (value: any) => any
  /**
   * 内容发生变化触发此事件
   * @param value 内容值
   */
  onChange?: (value: any) => any
  /**
   * 点击清空内容
   */
  onClear?: () => any
}

declare interface InputSlots {
  /**
   * 输入框前置内容，`nuve`环境需`u--input`有效，非`nvue`环境需`u-input`才有效
   */
  ['prefix']?: () => any
  /**
   * 输入框后置内容，`nuve`环境需`u--input`有效，非`nvue`环境需`u-input`才有效
   */
  ['suffix']?: () => any
}

declare interface _Input {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      InputProps
    $slots: InputSlots
  }
}

declare interface _InputRef {
  /**
   * 为兼容微信小程序而暴露的内部方法
   */
  setFormatter: () => void
}

export declare const Input: _Input

export declare const InputRef: _InputRef
