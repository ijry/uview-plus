import { AllowedComponentProps, VNodeProps } from './_common'


declare interface RadioGroupProps {
  /**
   * 绑定的值
   */
  value?: string | number | boolean
  /**
   * 是否禁用全部checkbox
   * @default false
   */
  disabled?: boolean
  /**
   * 形状，circle-圆形，square-方形
   * @default "circle"
   */
  shape?: 'circle' | 'square'
  /**
   * 选中状态下的颜色，如子`Checkbox`组件设置此值，将会覆盖本值
   * @default "#2979ff"
   */
  activeColor?: string
  /**
   * 未选中的颜色
   * @default "#c8c9cc"
   */
  inactiveColor?: string
  /**
   * 标识符
   */
  name?: string
  /**
   * 整个组件的尺寸，默认px
   * @default 18
   */
  size?: string | number
  /**
   * 布局方式，row-横向，column-纵向
   * @default "row"
   */
  placement?: 'row' | 'column'
  /**
   * 文本
   */
  label?: string
  /**
   * label的字体颜色
   * @default "#303133"
   */
  labelColor?: string
  /**
   * label的字体大小，px单位
   * @default 14
   */
  labelSize?: string | number
  /**
   * 是否禁止点击文本操作
   * @default false
   */
  labelDisabled?: boolean
  /**
   * 图标颜色
   * @default "#fff"
   */
  iconColor?: string
  /**
   * 图标的大小，单位px
   * @default 12
   */
  iconSize?: string | number
  /**
   * 竖向配列时，是否显示下划线
   * @default false
   */
  borderBottom?: boolean
  /**
   * 勾选图标的对齐方式，left-左边，right-右边
   * @default "left"
   */
  iconPlacement?: 'left' | 'right'
  /**
   * 任一个`radio`状态发生变化时触发
   * @param name 值为`radio`通过`props`传递的`name`值
   */
  onChange?: (name: string) => any
}

declare interface _RadioGroup {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      RadioGroupProps
  }
}

export declare const RadioGroup: _RadioGroup
