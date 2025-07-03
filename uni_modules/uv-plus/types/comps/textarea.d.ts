import { AllowedComponentProps, VNodeProps } from './_common'

declare interface TextareaProps {
  /**
   * 输入框的内容
   */
  value?: string | number
  /**
   * 输入框为空时占位符
   */
  placeholder?: string | number
  /**
   * 输入框高度
   * @default 70
   */
  height?: string | number
  /**
   * 设置键盘右下角按钮的文字，仅微信小程序，App-vue和H5有效
   * @default "done"
   */
  confirmType?: string
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * 是否显示统计字数
   * @default false
   */
  count?: boolean
  /**
   * 是否自动获取焦点，nvue不支持，H5取决于浏览器的实现
   * @default false
   */
  focus?: boolean
  /**
   * 是否自动增加高度
   * @default false
   */
  autoHeight?: boolean
  /**
   * 是否忽略组件内对文本合成系统事件的处理。为 false 时将触发 compositionstart、compositionend、compositionupdate 事件，且在文本合成期间会触发 input 事件
   * @default true
   */
  ignoreCompositionEvent?: boolean
  /**
   * 如果textarea是在一个position:fixed的区域，需要显示指定属性fixed为true
   * @default false
   */
  fixed?: boolean
  /**
   * 指定光标与键盘的距离
   * @default 0
   */
  cursorSpacing?: number
  /**
   * 指定focus时的光标位置
   */
  cursor?: string | number
  /**
   * 是否显示键盘上方带有”完成“按钮那一栏
   * @default true
   */
  showConfirmBar?: boolean
  /**
   * 光标起始位置，自动聚焦时有效，需与selection-end搭配使用
   * @default -1
   */
  selectionStart?: number
  /**
   * 光标结束位置，自动聚焦时有效，需与selection-start搭配使用
   * @default -1
   */
  selectionEnd?: number
  /**
   * 键盘弹起时，是否自动上推页面
   * @default true
   */
  adjustPosition?: boolean
  /**
   * 是否去掉 iOS 下的默认内边距，只微信小程序有效
   * @default false
   */
  disableDefaultPadding?: boolean
  /**
   * focus时，点击页面的时候不收起键盘，只微信小程序有效
   * @default false
   */
  holdKeyboard?: boolean
  /**
   * 最大输入长度，设置为 -1 的时候不限制最大长度
   * @default 140
   */
  maxlength?: string | number
  /**
   * 边框类型，surround-四周边框，none-无边框，bottom-底部边框
   * @default "surround"
   */
  border?: 'surround' | 'none' | 'bottom'
  /**
   * 指定placeholder的样式类，注意页面或组件的style中写了scoped时，需要在类名前写/deep/
   * @default "textarea-placeholder"
   */
  placeholderClass?: string
  /**
   * 指定placeholder的样式
   * @default "color: #c0c4cc"
   */
  placeholderStyle?: unknown
  /**
   * 输入过滤或格式化函数(如需兼容微信小程序，则只能通过setFormatter方法)
   */
  formatter?: (...args: any) => any
  /**
   * 输入框聚焦时触发，event.detail = { value, height }，height 为键盘高度
   */
  onFocus?: (...args: any) => any
  /**
   * 输入框失去焦点时触发，event.detail = {value, cursor}
   */
  onBlur?: (...args: any) => any
  /**
   * 输入框行数变化时调用，event.detail = {height: 0, heightRpx: 0, lineCount: 0}
   */
  onLinechange?: (...args: any) => any
  /**
   * 当键盘输入时，触发 input 事件
   */
  onInput?: (...args: any) => any
  /**
   * 点击完成时， 触发 confirm 事件
   */
  onConfirm?: (...args: any) => any
  /**
   * 键盘高度发生变化的时候触发此事件
   */
  onKeyboardheightchange?: (...args: any) => any
}

declare interface _TextareaRef {
  /**
   * 为兼容微信小程序而暴露的内部方法，详细见[文档](https://www.uviewui.com/components/textarea.html#%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%A4%84%E7%90%86)
   */
  setFormatter: (...args: any) => any
}

declare interface _Textarea {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      TextareaProps
  }
}

export declare const Textarea: _Textarea

export declare const TextareaRef: _TextareaRef
