import { AllowedComponentProps, VNodeProps } from './_common'

declare interface CalendarStripPayload {
  date: string
  month: string
  scene: string
}

declare interface CalendarStripProps {
  /**
   * 当前选中日期
   */
  modelValue?: string | number | Date | null
  /**
   * 最小可选日期
   * @default 0
   */
  minDate?: string | number
  /**
   * 最大可选日期
   * @default 0
   */
  maxDate?: string | number
  /**
   * 主题色
   * @default "#3c9cff"
   */
  color?: string
  /**
   * 星期文案（周一到周日）
   */
  weekText?: string[]
  /**
   * 是否支持下拉展开完整月历
   * @default true
   */
  fullCalendar?: boolean
  /**
   * 透传给内嵌 up-calendar 的额外参数
   */
  fullCalendarProps?: Record<string, any>
  /**
   * 完整月历可浏览月份数（仅在未传 minDate/maxDate 时生效）
   * @default 24
   */
  fullMonthNum?: string | number
  /**
   * 下拉/上拉手势触发阈值，单位 px
   * @default 40
   */
  pullDownThreshold?: string | number
  /**
   * 在完整月历中选择日期后是否自动收起
   * @default true
   */
  collapseAfterSelect?: boolean
  /**
   * 是否只读
   * @default false
   */
  readonly?: boolean
  /**
   * 是否高亮今天
   * @default true
   */
  showToday?: boolean
  /**
   * 顶部月份格式化模板，遵循 dayjs 格式
   */
  monthFormat?: string
  /**
   * 收起状态提示文案
   * @default "下拉展开月历"
   */
  expandHint?: string
  /**
   * 展开状态提示文案
   * @default "上拉收起月历"
   */
  collapseHint?: string
  /**
   * 日期变更时触发
   */
  onChange?: (payload: CalendarStripPayload) => any
  /**
   * 日期确认时触发
   */
  onConfirm?: (payload: CalendarStripPayload) => any
  /**
   * 月份变更时触发
   */
  onMonthChange?: (payload: { month: string; scene: string }) => any
  /**
   * 展开/收起完整月历时触发
   */
  onToggleFull?: (payload: { show: boolean; source: string }) => any
}

declare interface _CalendarStrip {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      CalendarStripProps
  }
}

declare interface _CalendarStripRef {
  prevMonth: () => void
  nextMonth: () => void
  toggleFull: () => void
}

export declare const CalendarStrip: _CalendarStrip

export declare const CalendarStripRef: _CalendarStripRef

