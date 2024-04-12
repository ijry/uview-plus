import { AllowedComponentProps, VNodeProps } from './_common'

declare interface CheckboxGroupProps {
  /**
   * 标识符
   */
  name?: string
  /**
   * 绑定的值
   * @default []
   */
  value?: string[]
  /**
   * 形状，square为方形，circle为圆型
   * @default "square"
   */
  shape?: 'square' | 'circle'
  /**
   * 是否禁用全部checkbox
   * @default false
   */
  disabled?: boolean
  /**
   * 选中状态下的颜色，如设置此值，将会覆盖parent的activeColor值
   * @default "#2979ff"
   */
  activeColor?: string
  /**
   * 未选中的颜色
   * @default "#c8c9cc"
   */
  inactiveColor?: string
  /**
   * 整体的大小
   * @default 18
   */
  size?: string
  /**
   * 布局方式，row-横向，column-纵向
   * @default "row"
   */
  placement?: 'row' | 'column'
   /**
   * label的字体大小，px单位
   * @default 14
   */
  labelSize?: string | number
  /**
   * label的颜色
   * @default "#303133"
   */
  labelColor?: string
  /**
   * 是否禁止点击文本操作
   * @default false
   */
  labelDisabled?: boolean
  /**
   * 图标的大小，单位px
   * @default 12
   */
  iconSize?: string | number
  /**
   * 图标颜色
   * @default "#fff"
   */
  iconColor?: string
  /**
   * 勾选图标的对齐方式，left-左边，right-右边
   * @default "left"
   */
  iconPlacement?: 'left' | 'right'
  /**
   * 竖向配列时，是否显示下划线
   * @default false
   */
  borderBottom?: boolean
  /**
   * 任一个`checkbox`状态发生变化时触发，回调为一个对象
   * @param detail 元素为被选中的`checkbox`的`name`数组
   */
  onChange?: (detail: any[]) => any
}

declare interface _CheckboxGroup {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      CheckboxGroupProps
  }
}

export declare const CheckboxGroup: _CheckboxGroup
