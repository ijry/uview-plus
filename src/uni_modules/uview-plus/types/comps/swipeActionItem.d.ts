import { AllowedComponentProps, VNodeProps } from './_common'

declare interface SwipeActionItemProps {
  /**
   * 控制打开或者关闭
   * @default false
   */
  show?: boolean
  /**
   * 标识符，如果是v-for，可用index索引
   */
  index?: string | number
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * 是否自动关闭其他swipe按钮组
   * @default true
   */
  autoClose?: boolean
  /**
   * 滑动距离阈值，只有大于此值，才被认为是要打开菜单
   * @default 20
   */
  threshold?: number
  /**
   * 右侧按钮内容
   */
  options?: any[]
  /**
   * 动画过渡时间，单位ms
   * @default 300
   */
  duration?: string | number
  /**
   * 标识符，如果是v-for，可用index索引值
   */
  name?: string | number
  /**
   * 按钮被点击时触发
   * @param name props参数`name`的值
   * @param index 第几个按钮被点击
   */
  onClick?: (name: any, index: number) => any
}


declare interface _SwipeActionItem {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      SwipeActionItemProps
  }
}

export declare const SwipeActionItem: _SwipeActionItem
