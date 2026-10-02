import { AllowedComponentProps, VNodeProps } from './_common'

/** 每页条目数选择器的可选项 */
declare type PaginationPageSize =
  | number
  | string
  | {
      /** 显示文案，默认为 `${value}条/页` */
      label?: string
      /** 每页条目数 */
      value: number | string
    }

declare interface PaginationProps {
  /**
   * 当前页码，支持 v-model:currentPage 双向绑定
   * @default 1
   */
  currentPage?: number
  /**
   * 每页条目数，支持 v-model:pageSize 双向绑定
   * @default 10
   */
  pageSize?: number
  /**
   * 总数据条目数
   * @default 0
   */
  total?: number
  /**
   * 上一页按钮自定义文本，留空时显示左箭头图标
   * @default ""
   */
  prevText?: string
  /**
   * 下一页按钮自定义文本，留空时显示右箭头图标
   * @default ""
   */
  nextText?: string
  /**
   * 分页按钮的背景颜色
   * @default "#f5f7fa"
   */
  buttonBgColor?: string
  /**
   * 分页按钮的边框颜色
   * @default "#dcdfe6"
   */
  buttonBorderColor?: string
  /**
   * 每页显示条目个数选择器的选项
   * @default [10, 20, 30, 40, 50]
   */
  pageSizes?: PaginationPageSize[]
  /**
   * 组件布局，子组件名用逗号分隔
   * - prev-上一页，pager-页码列表，next-下一页，total-总条数，sizes-每页条数选择器
   * @default "prev, pager, next"
   */
  layout?: string
  /**
   * 是否在只有一页时隐藏分页器
   * @default false
   */
  hideOnSinglePage?: boolean
  /**
   * 页码改变时触发（v-model:currentPage 内部使用）
   * @param page 最新页码
   */
  ['onUpdate:currentPage']?: (page: number) => any
  /**
   * 每页条目数改变时触发（v-model:pageSize 内部使用）
   * @param size 最新的每页条目数
   */
  ['onUpdate:pageSize']?: (size: number) => any
  /**
   * 页码改变时触发
   * @param page 最新页码
   */
  onCurrentChange?: (page: number) => any
  /**
   * 每页条目数改变时触发
   * @param size 最新的每页条目数
   */
  onSizeChange?: (size: number) => any
}

declare interface _Pagination {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      PaginationProps
  }
}

export declare const Pagination: _Pagination
