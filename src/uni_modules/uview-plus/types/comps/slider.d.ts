import { AllowedComponentProps, VNodeProps } from './_common'


declare interface SliderProps {
  /**
   * 双向绑定滑块选择值
   * @default 0
   */
  value?: string | number
  /**
   * 滑块的大小
   * @default 18
   */
  blockSize?: string | number
  /**
   * 可选的最小值(0-100之间)
   * @default 1
   */
  min?: string | number
  /**
   * 可选的最大值(0-100之间)
   * @default 100
   */
  max?: string | number
  /**
   * 选择的步长
   * @default 1
   */
  step?: string | number
  /**
   * 进度条的激活部分颜色
   * @default "#2979ff"
   */
  activeColor?: string
  /**
   * 进度条的背景颜色
   * @default "#c0c4cc"
   */
  inactiveColor?: string
  /**
   * 滑块背景颜色
   * @default "#ffffff"
   */
  blockColor?: string
  /**
   * 是否显示当前 value
   * @default false
   */
  showValue?: boolean
  /**
   * 滑块按钮自定义样式
   */
  blockStyle?: unknown
  /**
   * 是否区间模式（双滑块）
   * @default false
   */
  isRange?: boolean
  /**
   * 区间模式下的取值，支持 v-model:rangeValue 双向绑定
   * @default [0, 0]
   */
  rangeValue?: (string | number)[]
  /**
   * 区间模式下更新 v-model:rangeValue
   * @param value 当前区间值
   */
  "onUpdate:rangeValue"?: (value: (string | number)[]) => any
  /**
   * 更新v-model的
   * @param value 当前值
   */
  onInput?: (value: any) => any
  /**
   * 触发事件（拖动过程中）
   * @param value 当前值
   */
  onChanging?: (value: any) => any
  /**
   * 触发事件
   * @param value 当前值
   */
  onChange?: (value: any) => any
}

declare interface _Slider {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      SliderProps
  }
}

export declare const Slider: _Slider
