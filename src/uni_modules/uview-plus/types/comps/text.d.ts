import { AllowedComponentProps, VNodeProps } from './_common'

declare interface TextProps {
  /**
   * 主题颜色
   */
  type?: string
  /**
   * 是否显示
   * @default true
   */
  show?: boolean
  /**
   * 显示的值
   */
  text?: string | number
  /**
   * 前置图标
   */
  prefixIcon?: string
  /**
   * 后置图标
   */
  suffixIcon?: string
  /**
   * 文本处理的匹配模式text-普通文本，price-价格，phone-手机号，name-姓名，date-日期，link-超链接
   */
  mode?: 'text' | 'price' | 'phone' | 'name' | 'date' | 'link'
  /**
   * mode=link下，配置的链接
   */
  href?: string
  /**
   * 格式化规则
   */
  format?: string | ((value: any) => any)
  /**
   * mode=phone时，点击文本是否拨打电话
   * @default false
   */
  call?: boolean
  /**
   * 小程序的打开方式
   */
  openType?: string
  /**
   * 是否粗体，默认normal
   * @default false
   */
  bold?: boolean
  /**
   * 是否块状
   */
  block?: boolean
  /**
   * 文本显示的行数，如果设置，超出此行数，将会显示省略号
   */
  lines?: string | number
  /**
   * 文本颜色
   * @default "#303133"
   */
  color?: string
  /**
   * 字体大小
   * @default 15
   */
  size?: string | number
  /**
   * 图标的样式
   */
  iconStyle?: Record<string, any> | string
  /**
   * 文字装饰，下划线，中划线等
   * @default "none"
   */
  decoration?: 'none' | 'underline' | 'line-through'
  /**
   * 外边距，对象、字符串，数值形式均可
   */
  margin?: Record<string, any> | string | number
  /**
   * 文本行高
   */
  lineHeight?: number | string
  /**
   * 文本对齐方式
   * @default "left"
   */
  align?: 'left' | 'center' | 'right'
  /**
   * 文字换行
   * @default "normal"
   */
  wordWrap?: 'normal' | 'break-word' | 'any-where'
  /**
   * 点击触发事件
   */
  onClick?: () => any
}

declare interface _Text {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      TextProps
  }
}

export declare const Text: _Text
