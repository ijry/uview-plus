import { AllowedComponentProps, VNodeProps } from './_common'

declare interface TransitionProps {
  /**
   * 是否展示组件
   * @default false
   */
  show?: boolean
  /**
   * 使用的动画模式
   * @default "fade"
   */
  mode?: 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom-in' | 'zoom-out'
  /**
   * 动画的执行时间，单位ms
   * @default 300
   */
  duration?: string | number
  /**
   * 使用的动画过渡函数
   */
  timingFunction?: string
  /**
   * 自定义样式
   */
  customStyle?: unknown
  /**
   * 进入前触发
   */
  onBeforeEnter?: () => any
  /**
   * 进入中触发
   */
  onEnter?: () => any
  /**
   * 进入后触发
   */
  onAfterEnter?: () => any
  /**
   * 离开前触发
   */
  onBeforeLeave?: () => any
  /**
   * 离开中触发
   */
  onLeave?: () => any
  /**
   * 离开后触发
   */
  onAfterLeave?: () => any
}

declare interface _Transition {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      TransitionProps
  }
}

export declare const Transition: _Transition
