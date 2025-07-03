import { AllowedComponentProps, VNodeProps } from './_common'

declare interface CheckboxProps {
  /**
   * checkbox的名称
   */
  name?: string | number | boolean
  /**
   * 形状，square为方形，circle为圆型
   * @default "square"
   */
  shape?: 'square' | 'circle'
  /**
   * 整体的大小
   */
  size?: string | number
  /**
   * 是否默认选中
   * @default false
   */
  checked?: boolean
  /**
   * 是否禁用
   * @default false
   */
  disabled?: string | boolean
  /**
   * 选中状态下的颜色，如设置此值，将会覆盖parent的activeColor值
   */
  activeColor?: string
  /**
   * 未选中的颜色
   */
  inactiveColor?: string
  /**
   * 图标的大小，单位px
   */
  iconSize?: string | number
  /**
   * 图标颜色
   */
  iconColor?: string
  /**
   * label提示文字，因为nvue下，直接slot进来的文字，由于特殊的结构，无法修改样式
   */
  label?: string | number
  /**
   * label的字体大小，px单位
   */
  labelSize?: string | number
  /**
   * label的颜色
   */
  labelColor?: string
  /**
   * 是否禁止点击提示语选中复选框
   */
  labelDisabled?: string | boolean
}

declare interface _Checkbox {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      CheckboxProps
  }
}

export declare const Checkbox: _Checkbox
