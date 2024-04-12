import { AllowedComponentProps, VNodeProps } from './_common'

declare interface RadioProps {
  /**
   * checkbox的名称
   */
  name?: string | number
  /**
   * 形状，square为方形，circle为圆型
   * @default "square"
   */
  shape?: 'square' | 'circle'
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * 是否禁止点击提示语选中复选框
   */
  labelDisabled?: string | boolean
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
   * label的字体大小，px单位
   */
  labelSize?: string | number
  /**
   * label提示文字，因为nvue下，直接slot进来的文字，由于特殊的结构，无法修改样式
   */
  label?: string | number
  /**
   * 整体的大小
   */
  size?: string | number
  /**
   * 图标颜色
   */
  iconColor?: string
  /**
   * label的颜色
   */
  labelColor?: string
  /**
   * 某个`radio`状态发生变化时触发(选中状态)
   * @param name 通过`props`传递的`name`值
   */
  onChange?: (name: string) => any
}

declare interface RadioSlots {
  /**
   * 自定义修改label内容
   */
  ['default']?: () => any
}

declare interface _Radio {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      RadioProps
    $slots: RadioSlots
  }
}

export declare const Radio: _Radio
