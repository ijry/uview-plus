import { AllowedComponentProps, VNodeProps } from './_common'


declare interface RateProps {
  /**
   * 双向绑定选择星星的数量
   * @default 1
   */
  value?: string | number
  /**
   * 最多可选的星星数量
   * @default 5
   */
  count?: string | number
  /**
   * 是否禁止用户操作
   * @default false
   */
  disabled?: boolean
  /**
   * 是否只读
   * @default false
   */
  readonly?: boolean
  /**
   * 星星的大小，单位rpx
   * @default 18
   */
  size?: string | number
  /**
   * 未选中星星的颜色
   * @default "#b2b2b2"
   */
  inactiveColor?: string
  /**
   * 选中的星星颜色
   * @default "#FA3534"
   */
  activeColor?: string
  /**
   * 星星之间的距离
   * @default 4
   */
  gutter?: string | number
  /**
   * 最少选中星星的个数
   * @default 1
   */
  minCount?: string | number
  /**
   * 是否允许半星选择
   * @default false
   */
  allowHalf?: boolean
  /**
   * 选中时的图标名，只能为uView的内置图标
   * @default "star-fill"
   */
  activeIcon?: string
  /**
   * 未选中时的图标名，只能为uView的内置图标
   * @default "star"
   */
  inactiveIcon?: string
  /**
   * 是否可以通过滑动手势选择评分
   * @default true
   */
  touchable?: boolean
  /**
   * 选中的星星发生变化时触发
   * @param value 当前选中的星星的数量
   */
  onChange?: (value: number) => any
}

declare interface _Rate {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      RateProps
  }
}

export declare const Rate: _Rate
