import { AllowedComponentProps, VNodeProps } from './_common'

declare interface DividerProps {
  /**
   * 是否虚线
   * @default false
   */
  dashed?: boolean
  /**
   * 是否细线
   * @default true
   */
  hairline?: boolean
  /**
   * 是否以点替代文字，优先于text字段起作用
   * @default false
   */
  dot?: boolean
  /**
   * 内容文本的位置
   * @default "center"
   */
  textPosition?: 'left' | 'center' | 'right'
  /**
   * 文本内容
   */
  text?: string | number
  /**
   * 文本大小
   * @default 14
   */
  textSize?: string | number
  /**
   * 文本颜色
   * @default #909399
   */
  textColor?: string
  /**
   * 线条颜色
   * @default #dcdfe6
   */
  lineColor?: string
  /**
   * divider组件被点击时触发
   */
  onClick?: () => any
}

declare interface _Divider {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      DividerProps
  }
}

export declare const Divider: _Divider

