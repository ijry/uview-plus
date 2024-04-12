import { AllowedComponentProps, VNodeProps } from './_common'

declare interface TabbarItemProps {
  /**
   * item标签的名称，作为与u-tabbar的value参数匹配的标识符
   * @default null
   */
  name?: string | number
  /**
   * uView内置图标或者绝对路径的图片
   */
  icon?: string
  /**
   * 右上角的角标提示信息
   * @default null
   */
  badge?: string | number
  /**
   * 是否显示圆点，将会覆盖badge参数
   * @default false
   */
  dot?: boolean
  /**
   * 描述文本
   */
  text?: string
  /**
   * 控制徽标的位置
   * @default "top: 6px;right:2px;"
   */
  badgeStyle?: Record<string, any> | string
  /**
   * 切换选项时触发
   * @param index 当前要切换项的name
   */
  onChange?: (index: any) => any
  /**
   * 切换选项时触发
   * @param index 当前要切换项的name
   */
  onClick?: (index: any) => any
}

declare interface _TabbarItem {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      TabbarItemProps
  }
}

export declare const TabbarItem: _TabbarItem
