import { AllowedComponentProps, VNodeProps } from './_common'

declare interface CountDownProps {
  /**
   * 倒计时时长，单位ms
   * @default 0
   */
  time?: string | number
  /**
   * 时间格式，DD-日，HH-时，mm-分，ss-秒，SSS-毫秒
   * @default "HH:mm:ss"
   */
  format?: string
  /**
   * 是否自动开始倒计时
   * @default true
   */
  autoStart?: boolean
  /**
   * 是否展示毫秒倒计时
   * @default false
   */
  millisecond?: boolean
  /**
   * 过程中，倒计时变化时触发
   * @param time 剩余的时间
   */
  onChange?: (time: any) => any
  /**
   * 倒计时结束
   */
  onFinish?: () => any
}

declare interface _CountDownRef {
  /**
   * 开始倒计时
   */
  start: () => void
  /**
   * 暂停倒计时
   */
  pause: () => void
  /**
   * 重置倒计时
   */
  reset: () => void
}

declare interface _CountDown {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      CountDownProps
  }
}

export declare const CountDown: _CountDown

export declare const CountDownRef: _CountDownRef
