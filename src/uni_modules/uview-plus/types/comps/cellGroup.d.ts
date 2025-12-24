import { AllowedComponentProps, VNodeProps } from './_common'

declare interface CellGroupProps {
  /**
   * 分组标题
   */
  title?: string
  /**
   * 是否显示外边框
   * @default true
   */
  border?: boolean
  /**
   * 用户自定义外部样式，对象形式
   */
  customStyle?: unknown
}

declare interface _CellGroup {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      CellGroupProps
  }
}

export declare const CellGroup: _CellGroup
