import { AllowedComponentProps, VNodeProps } from './_common'

declare interface CodeInputProps {
  /**
   * 键盘弹起时，是否自动上推页面
   * @default true
   */
  adjustPosition?: boolean
  /**
   * 输入字符个数
   * @default 6
   */
  maxlength?: string | number
  /**
   * 是否用圆点填充
   * @default false
   */
  dot?: boolean
  /**
   * 模式选择
   * @default "box"
   */
  mode?: 'box' | 'bottomLine' | 'middleLine'
  /**
   * 是否细边框
   * @default false
   */
  hairline?: boolean
  /**
   * 字符间的距离
   * @default 10
   */
  space?: string | number
  /**
   * 预置值
   */
  value?: string | number
  /**
   * 是否自动获取焦点
   * @default false
   */
  focus?: boolean
  /**
   * 字体和输入横线是否加粗
   * @default false
   */
  bold?: boolean
  /**
   * 字体颜色
   * @default "#606266"
   */
  color?: string
  /**
   * 字体大小，单位rpx
   * @default 18
   */
  fontSize?: string | number
  /**
   * 输入框的大小，宽等于高
   * @default 35
   */
  size?: string | number
  /**
   * 禁止点击输入框唤起系统键盘
   * @default false
   */
  disabledKeyboard?: boolean
  /**
   * 边框和线条颜色
   * @default "#c9cacc"
   */
  borderColor?: string
  /**
   * 是否禁止输入"."符号
   * @default true
   */
  disabledDot?: boolean
  /**
   * 输入内容发生改变时触发
   * @param value 当前输入的值
   */
  onChange?: (value: any) => any
  /**
   * 输入字符个数达`maxlength`值时触发
   * @param value 当前输入的值
   */
  onFinish?: (value: any) => any
}

declare interface _CodeInput {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      CodeInputProps
  }
}

export declare const CodeInput: _CodeInput
