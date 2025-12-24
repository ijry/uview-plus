import { AllowedComponentProps, VNodeProps } from './_common'


declare interface SubsectionProps {
  /**
   * 选项的数组
   */
  list?: any[]
  /**
   * 初始化时默认选中的选项索引值
   * @default 0
   */
  current?: string | number
  /**
   * 激活时的颜色
   * @default "#3c9cff"
   */
  activeColor?: string
  /**
   * 未激活时的颜色
   * @default "#303133"
   */
  inactiveColor?: string
  /**
   * 模式选择
   * @default "button"
   */
  mode?: 'button' | 'subsection'
  /**
   * 字体大小，单位px
   * @default 12
   */
  fontSize?: string | number
  /**
   * 激活选项的字体是否加粗
   * @default true
   */
  bold?: boolean
  /**
   * 组件背景颜色，`mode`为`button`时有效
   * @default "#eeeeef"
   */
  bgColor?: string
  /**
   * 从`list`元素对象中读取的键名
   * @default "name"
   */
  keyName?: string

  /**
   * 从`list`元素对象中读取激活时的颜色  如果存在字段 优先级大于 activeColor
   * @default activeColorKey
   */
  activeColorKeyName?: string
  /**
   * 从`list`元素对象中读取未激活时的颜色 如果存在字段 优先级大于 inactiveColor
   * @default inactiveColorKey
   */
  inactiveColorKeyName?: string
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * 分段器选项发生改变时触发
   * @param index 选项的index索引值，从0开始
   */
  onChange?: (index: number) => any
}

declare interface _Subsection {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      SubsectionProps
  }
}

export declare const Subsection: _Subsection
