import { AllowedComponentProps, VNodeProps } from './_common'

declare interface PickerProps {
  /**
   * 用于控制选择器的弹出与收起
   * @default false
   */
  show?: boolean
  /**
   * 是否显示顶部的操作栏
   * @default true
   */
  showToolbar?: boolean
  /**
   * 顶部中间的标题
   */
  title?: string
  /**
   * 设置每一列的数据，详见[文档](https://www.uviewui.com/components/picker.html#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8)
   */
  columns?: any[]
  /**
   * 加载状态
   * @default false
   */
  loading?: boolean
  /**
   * 各列中，单个选项的高度
   * @default 14
   */
  itemHeight?: string | number
  /**
   * 取消按钮的文字
   * @default "取消"
   */
  cancelText?: string
  /**
   * 确认按钮的文字
   * @default "确认"
   */
  confirmText?: string
  /**
   * 取消按钮的颜色
   * @default "#909193"
   */
  cancelColor?: string
  /**
   * 确认按钮的颜色
   * @default "#3c9cff"
   */
  confirmColor?: string
  /**
   * 每列中可见选项的数量
   * @default 5
   */
  visibleItemCount?: string | number
  /**
   * 自定义需要展示的`text`属性键名
   * @default "text"
   */
  keyName?: string
  /**
   * 是否允许点击遮罩关闭选择器（注意：关闭事件需要自行处理，只会在开启closeOnClickOverlay后点击遮罩层执行close回调）
   * @default false
   */
  closeOnClickOverlay?: boolean
  /**
   * 各列的默认索引
   */
  defaultIndex?: any[]
  /**
   * 是否在手指松开时立即触发`change`事件。若不开启则会在滚动动画结束后触发`change`事件，只在微信`2.21.1`及以上有效
   * @default false
   */
  immediateChange?: boolean
  /**
   * 关闭选择器时触发
   */
  onClose?: () => any
  /**
   * 点击确定按钮，返回当前选择的值
   */
  onConfirm?: (...args: any) => any
  /**
   * 当选择值变化时触发
   */
  onChange?: (...args: any) => any
  /**
   * 点击取消按钮
   */
  onCancel?: () => any
}

declare interface _PickerRef {
  /**
   * 设置对应列的选择值
   */
  setIndexs: (index, setLastIndex) => any
  /**
   * 多列联动时需要用到，详见[文档](https://www.uviewui.com/components/picker.html#%E5%A4%9A%E5%88%97%E6%A8%A1%E5%BC%8F%E4%B8%8E%E5%A4%9A%E5%88%97%E8%81%94%E5%8A%A8)
   */
  setColumnValues: (...args: any) => any
}

declare interface _Picker {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      PickerProps
  }
}

export declare const Picker: _Picker

export declare const PickerRef: _PickerRef
