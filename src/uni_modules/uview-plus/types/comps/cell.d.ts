import { AllowedComponentProps, VNodeProps } from './_common'

declare interface CellProps {
  /**
   * 左侧标题
   */
  title?: string | number
  /**
   * 标题下方的描述信息
   */
  label?: string | number
  /**
   * 右侧的内容
   */
  value?: string | number
  /**
   * 左侧图标名称，或者图片链接(本地文件建议使用绝对地址)
   */
  icon?: string
  /**
   * 是否禁用cell
   * @default false
   */
  disabled?: boolean
  /**
   * 是否显示下边框
   * @default true
   */
  border?: boolean
  /**
   * 内容是否垂直居中(主要是针对右侧的value部分)
   * @default false
   */
  center?: boolean
  /**
   * 点击后跳转的URL地址
   */
  url?: string
  /**
   * 链接跳转的方式，内部使用的是uView封装的route方法，可能会进行拦截操作
   * @default "navigateTo"
   */
  linkType?: string
  /**
   * 是否开启点击反馈(表现为点击时加上灰色背景)
   * @default false
   */
  clickable?: boolean
  /**
   * 是否展示右侧箭头并开启点击反馈
   * @default false
   */
  isLink?: boolean
  /**
   * 是否显示表单状态下的必填星号(此组件可能会内嵌入input组件)
   * @default false
   */
  required?: boolean
  /**
   * 右侧的图标箭头
   * @default "arrow-right"
   */
  rightIcon?: string
  /**
   * 右侧箭头的方向
   * @default "right"
   */
  arrowDirection?: 'left' | 'right' | 'up' | 'down'
  /**
   * 左侧图标样式
   */
  iconStyle?: unknown
  /**
   * 右侧箭头图标的样式
   */
  rightIconStyle?: unknown
  /**
   * 标题的样式
   */
  titleStyle?: unknown
  /**
   * 单位元的大小，可选值为large
   */
  size?: string
  /**
   * 点击cell是否阻止事件传播
   * @default true
   */
  stop?: boolean
  /**
   * 标识符，用于在`click`事件中进行返回
   */
  name?: string | number
  /**
   * 点击cell列表时触发
   * @param name `props`的`name`参数标识符
   */
  onClick?: (name: any) => any
}

declare interface CellSlots {
  /**
   * 自定义左侧标题部分的内容，如需使用，请勿定义`title`参数，或赋值`null`即可
   */
  ['title']?: () => any
  /**
   * 自定义右侧标题部分的内容，如需使用，请勿定义`value`参数，或赋值`null`即可
   */
  ['value']?: () => any
  /**
   * 自定义左侧的图标
   */
  ['icon']?: () => any
  /**
   * 自定义右侧图标内容，需设置`arrow`为`false`才起作用
   */
  ['right-icon']?: () => any
  /**
   * 自定义label内容
   */
  ['label']?: () => any
}

declare interface _Cell {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      CellProps
    $slots: CellSlots
  }
}

export declare const Cell: _Cell
