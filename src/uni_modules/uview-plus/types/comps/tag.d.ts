import { AllowedComponentProps, VNodeProps } from './_common'

declare interface TagProps {
  /**
   * 主题类型
   * @default "primary"
   */
  type?: 'primary' | 'success' | 'info' | 'warning' | 'error'
  /**
   * 不可用
   * @default false
   */
  disabled?: boolean | string
  /**
   * 标签大小
   * @default "medium"
   */
  size?: 'medium' | 'large' | 'mini'
  /**
   * 标签形状
   * @default "square"
   */
  shape?: 'square' | 'circle'
  /**
   * 标签的文字内容
   */
  text?: string | number
  /**
   * 背景颜色，默认为空字符串，即不处理
   * @default "#C6C7CB"
   */
  bgColor?: string
  /**
   * 标签字体颜色，默认为空字符串，即不处理
   */
  color?: string
  /**
   * 标签的边框颜色
   */
  borderColor?: string
  /**
   * 关闭按钮图标的颜色
   */
  closeColor?: string
  /**
   * 点击时返回的索引值，用于区分例遍的数组哪个元素被点击了
   */
  name?: string | number
  /**
   * 镂空时是否填充背景色
   * @default false
   */
  plainFill?: boolean
  /**
   * 是否镂空
   * @default false
   */
  plain?: boolean
  /**
   * 是否可关闭，设置为`true`，文字右边会出现一个关闭图标
   * @default false
   */
  closable?: boolean
  /**
   * 标签显示与否
   * @default true
   */
  show?: boolean
  /**
   * 内置图标，或绝对路径的图片
   */
  icon?: string
  /**
   * 点击触发事件
   * @param index 传递的`index`参数值
   */
  onClick?: (index: number) => any
  /**
   * `closable`为`true`时，点击标签关闭按钮触发
   * @param index 传递的`index`参数值
   */
  onClose?: (index: number) => any
}

declare interface _Tag {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      TagProps
  }
}

export declare const Tag: _Tag
