import { AllowedComponentProps, VNodeProps } from './_common'

declare interface CollapseProps {
  /**
   * 当前展开面板的name，非手风琴模式：[<String | Number>]，手风琴模式：String | Number
   */
  value: string | number | (string | number)[]
  /**
   * 是否手风琴模式
   * @default false
   */
  accordion?: boolean
  /**
   * 是否显示外边框
   * @default true
   */
  border?: boolean
  /**
   * 当前激活面板展开时触发(如果是手风琴模式，参数activeNames类型为String，否则为Array)
   * @param activeNames 活动项
   */
  onChange?: (activeNames: string | any[]) => any
  /**
   * 当前激活面板展开时触发(如果是手风琴模式，参数activeNames类型为String，否则为Array)
   * @param activeNames 活动项
   */
  onOpen?: (activeNames: string | any[]) => any
  /**
   * 当前激活面板关闭时触发(如果是手风琴模式，参数activeNames类型为String，否则为Array)
   * @param activeNames 活动项
   */
  onClose?: (activeNames: string | any[]) => any
}

declare interface _Collapse {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      CollapseProps
  }
}

declare interface _CollapseRef {
  /**
   * 重新初始化内部高度计算，用于异步获取内容的情形，请结合`this.$nextTick()`使用
   */
  init: () => void
}

export declare const Collapse: _Collapse

export declare const CollapseRef: _CollapseRef
