import { AllowedComponentProps, VNodeProps } from './_common'

declare interface TabsProps {
  /**
   * 滑块移动一次所需的时间，单位ms
   * @default 300
   */
  duration?: string | number
  /**
   * 标签数组，元素为对象
   */
  list?: any[]
  /**
   * 滑块颜色
   * @default "#3c9cff"
   */
  lineColor?: string
  /**
   * 菜单选择中时的样式
   * @default "{ color: '#303133' }"
   */
  activeStyle?: unknown
  /**
   * 菜单非选中时的样式
   * @default "{ color: '#606266' }"
   */
  inactiveStyle?: unknown
  /**
   * 滑块长度
   * @default 20
   */
  lineWidth?: string | number
  /**
   * 滑块高度
   * @default 3
   */
  lineHeight?: string | number
  /**
   * 滑块背景显示大小
   * @default "cover"
   */
  lineBgSize?: string
  /**
   * 菜单item的样式
   * @default "{ height: '44px' }"
   */
  itemStyle?: unknown
  /**
   * 菜单是否可滚动
   * @default true
   */
  scrollable?: boolean
  /**
   * 当前选中标签的索引
   * @default 0
   */
  current?: string | number
  /**
   * 从`list`元素对象中读取的键名
   * @default "name"
   */
  keyName?: string
  /**
   * 点击标签时触发
   * @param item 传入的其他值
   * @param index 标签索引值
   */
  onClick?: (item: any, index: number) => any
  /**
   * 标签索引改变时触发(`disalbed`时不会触发)
   * @param item 传入的其他值
   * @param index 标签索引值
   */
  onChange?: (item: any, index: number) => any
}

declare interface _Tabs {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      TabsProps
  }
}

export declare const Tabs: _Tabs
