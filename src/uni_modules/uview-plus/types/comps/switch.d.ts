import { AllowedComponentProps, VNodeProps } from './_common'

declare interface SwitchProps {
  /**
   * 是否处于加载中
   * @default false
   */
  loading?: boolean
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * 开关尺寸，单位rpx
   */
  size?: string | number
  /**
   * 打开时的背景色
   * @default "#2979ff"
   */
  activeColor?: string
  /**
   * 关闭时的背景色
   * @default "#ffffff"
   */
  inactiveColor?: string
  /**
   * 通过v-model双向绑定的值
   * @default false
   */
  value?: string | number | boolean
  /**
   * switch打开时的值
   * @default true
   */
  activeValue?: string | number | boolean
  /**
   * switch关闭时的值
   * @default false
   */
  inactiveValue?: string | number | boolean
  /**
   * 是否开启异步变更，开启后需要手动控制输入值
   * @default false
   */
  asyncChange?: boolean
  /**
   * 圆点与外边框的距离
   * @default 0
   */
  space?: string | number
  /**
   * 在`switch`打开或关闭时触发
   * @param value 打开时为`activeValue`值，关闭时为`inactiveValue`值
   */
  onChange?: (value: any) => any
  /**
   * 在`switch`打开或关闭时触发（没开启异步）
   * @param value 打开时为`activeValue`值，关闭时为`inactiveValue`值
   */
  onInput?: (value: any) => any
}

declare interface _Switch {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      SwitchProps
  }
}

export declare const Switch: _Switch
