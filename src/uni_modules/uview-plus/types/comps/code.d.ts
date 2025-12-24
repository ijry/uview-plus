import { AllowedComponentProps, VNodeProps } from './_common'

declare interface CodeProps {
  /**
   * 倒计时所需的秒数
   * @default 60
   */
  seconds?: string | number
  /**
   * 开始前的提示语，详细见[文档](https://www.uviewui.com/components/code.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8F%90%E7%A4%BA%E8%AF%AD)
   * @default "获取验证码"
   */
  startText?: string
  /**
   * 倒计时期间的提示语，必须带有字母"x"，详细见[文档](https://www.uviewui.com/components/code.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8F%90%E7%A4%BA%E8%AF%AD)
   * @default "X秒重新获取"
   */
  changeText?: string
  /**
   * 倒计结束的提示语，详细见[文档](https://www.uviewui.com/components/code.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8F%90%E7%A4%BA%E8%AF%AD)
   * @default "重新获取"
   */
  endText?: string
  /**
   * 是否在H5刷新或各端返回再进入时继续倒计时
   * @default false
   */
  keepRunning?: boolean
  /**
   * 多个组件之间继续倒计时的区分`key`，详细见[文档](https://www.uviewui.com/components/code.html#%E4%BF%9D%E6%8C%81%E5%80%92%E8%AE%A1%E6%97%B6)
   */
  uniqueKey?: string
  /**
   * 倒计时期间，每秒触发一次
   * @param text 当前剩余多少秒的状态
   */
  onChange?: (text: string) => any
  /**
   * 开始倒计时触发
   */
  onStart?: () => any
  /**
   * 结束倒计时触发
   */
  onEnd?: () => any
}

declare interface _Code {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      CodeProps
  }
}

declare interface _CodeRef {
  /**
   * 开始倒计时
   */
  start: () => void
  /**
   * 结束当前正在进行中的倒计时，设置组件为可以重新获取验证码的状态
   */
  reset: () => void
}

export declare const Code: _Code

export declare const CodeRef: _CodeRef
