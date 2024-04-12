import { AllowedComponentProps, VNodeProps } from './_common'

declare interface CalendarProps {
  /**
   * 标题内容
   * @default "日期选择"
   */
  title?: string
  /**
   * 是否显示标题
   * @default true
   */
  showTitle?: boolean
  /**
   * 是否显示副标题
   * @default true
   */
  showSubtitle?: boolean
  /**
   * 日期类型选择
   * @default 'single
   */
  mode?: 'single' | 'multiple' | 'range'
  /**
   * mode=range时，第一个日期底部的提示文字
   * @default "开始"
   */
  startText?: string
  /**
   * mode=range时，最后一个日期底部的提示文字
   * @default "结束"
   */
  endText?: string
  /**
   * 自定义列表
   */
  customList?: any[]
  /**
   * 主题色，对底部按钮和选中日期有效
   * @default "#3c9cff"
   */
  color?: string
  /**
   * 最小的可选日期
   * @default 0
   */
  minDate?: string | number
  /**
   * 最大可选日期
   * @default 0
   */
  maxDate?: string | number
  /**
   * 默认选中的日期，mode为multiple或range是必须为数组格式
   * @default null
   */
  defaultDate?: string | Date | any[]
  /**
   * mode=multiple时，最多可选多少个日期
   * @default Number.MAX_SAFE_INTEGER
   */
  maxCount?: string | number
  /**
   * 日期行高
   * @default 56
   */
  rowHeight?: string | number
  /**
   * 日期格式化函数(如需兼容微信小程序，则只能通过setFormatter方法)
   */
  formatter?: (...args: any) => any
  /**
   * 是否显示农历
   * @default false
   */
  showLunar?: boolean
  /**
   * 是否显示月份背景色
   * @default true
   */
  showMark?: boolean
  /**
   * 确定按钮的文字
   * @default "确定"
   */
  confirmText?: string
  /**
   * 确认按钮处于禁用状态时的文字
   * @default "确定"
   */
  confirmDisabledText?: string
  /**
   * 是否显示日历弹窗
   * @default false
   */
  show?: boolean
  /**
   * 是否允许点击遮罩关闭日历 （注意：关闭事件需要自行处理，只会在开启closeOnClickOverlay后点击遮罩层执行close回调）
   * @default false
   */
  closeOnClickOverlay?: boolean
  /**
   * 是否为只读状态，只读状态下禁止选择日期
   * @default false
   */
  readonly?: boolean
  /**
   * 日期区间最多可选天数，默认无限制，mode = range时有效
   * @default 无限制
   */
  maxRange?: string | number
  /**
   * 范围选择超过最多可选天数时的提示文案，mode = range时有效
   * @default "选择天数不能超过 xx 天"
   */
  rangePrompt?: string | null
  /**
   * 范围选择超过最多可选天数时，是否展示提示文案，mode = range时有效
   * @default true
   */
  showRangePrompt?: boolean
  /**
   * 是否允许日期范围的起止时间为同一天，mode = range时有效
   * @default false
   */
  allowSameDay?: boolean
  /**
   * 圆角值，默认无圆角
   * @default 0
   */
  round?: string | number
  /**
   * 最大展示的月份数量
   * @default 3
   */
  monthNum?: string | number
  /**
   * 日期选择完成后触发，若`show-confirm`为`true`，则点击确认按钮后触发
   */
  onConfirm?: (...args: any) => any
  /**
   * 日历关闭时触发
   */
  onClose?: () => any
}

declare interface _Calendar {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      CalendarProps
  }
}

declare interface _CalendarRef {
  /**
   * 为兼容微信小程序而暴露的内部方法，详见[文档](https://www.uviewui.com/components/calendar.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%96%87%E6%A1%88)
   */
  setFormatter: (type, value) => any
}

export declare const Calendar: _Calendar

export declare const CalendarRef: _CalendarRef
