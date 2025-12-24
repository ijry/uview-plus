import { AllowedComponentProps, VNodeProps } from './_common'

declare interface DatetimePickerProps {
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
   * 绑定值
   */
  ['v-model']?: string | number
  /**
   * 顶部标题
   */
  title?: string
  /**
   * 展示格式
   * @default "datetime"
   */
  mode?: 'datetime' | 'date' | 'time' | 'year-month'
  /**
   * 可选的最大时间（时间戳毫秒）
   * @default 最大默认值为后10年
   */
  maxDate?: number
  /**
   * 可选的最小时间（时间戳毫秒）
   * @default 最小默认值为前10年
   */
  minDate?: number
  /**
   * 可选的最小小时，仅mode=time有效
   * @default 0
   */
  minHour?: number
  /**
   * 可选的最大小时，仅mode=time有效
   * @default 23
   */
  maxHour?: number
  /**
   * 可选的最小分钟，仅mode=time有效
   * @default 0
   */
  minMinute?: number
  /**
   * 可选的最大分钟，仅mode=time有效
   * @default 59
   */
  maxMinute?: number
  /**
   * 选项过滤函数
   * @default null
   */
  filter?: (...args: any) => any
  /**
   * 输入过滤或格式化函数(如需兼容微信小程序，则只能通过`setFormatter`方法)
   * @default null
   */
  formatter?: (...args: any) => any
  /**
   * 是否显示加载中状态
   * @default false
   */
  loading?: boolean
  /**
   * 各列中，单个选项的高度
   * @default 44
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
   * 是否允许点击遮罩关闭选择器（注意：关闭事件需要自行处理，只会在开启closeOnClickOverlay后点击遮罩层执行close回调）
   * @default false
   */
  closeOnClickOverlay?: boolean
  /**
   * 各列的默认索引
   */
  defaultIndex?: any[]
  /**
   * 关闭选择器时触发
   */
  onClose?: () => any
  /**
   * 点击确定按钮，返回当前选择的值
   */
  onConfirm?: () => any
  /**
   * 当选择值变化时触发
   */
  onChange?: () => any
  /**
   * 点击取消按钮
   */
  onCancel?: () => any
}

declare interface _DatetimePickerRef {
  /**
   * 为兼容微信小程序而暴露的内部方法，详见[文档](https://www.uviewui.com/components/datetimePicker.html#%E6%A0%BC%E5%BC%8F%E5%8C%96)
   */
  setFormatter: (type, value) => any
}

declare interface _DatetimePicker {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      DatetimePickerProps
  }
}

export declare const DatetimePicker: _DatetimePicker

export declare const DatetimePickerRef: _DatetimePickerRef
