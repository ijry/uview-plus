import { AllowedComponentProps, VNodeProps } from './_common'

declare interface CountToProps {
  /**
   * 开始值
   * @default 0
   */
  startVal?: string | number
  /**
   * 结束值
   * @default 0
   */
  endVal?: string | number
  /**
   * 滚动过程所需的时间，单位ms
   * @default 2000
   */
  duration?: string | number
  /**
   * 是否自动开始滚动
   * @default true
   */
  autoplay?: boolean
  /**
   * 要显示的小数位数，详细见[文档](https://www.uviewui.com/components/countTo.html#%E6%98%AF%E5%90%A6%E6%98%BE%E7%A4%BA%E5%B0%8F%E6%95%B0%E4%BD%8D)
   * @default 0
   */
  decimals?: string | number
  /**
   * 滚动结束时，是否缓动结尾，详细见[文档](https://www.uviewui.com/components/countTo.html#%E8%AE%BE%E7%BD%AE%E6%BB%9A%E5%8A%A8%E7%9B%B8%E5%85%B3%E5%8F%82%E6%95%B0)
   * @default true
   */
  useEasing?: boolean
  /**
   * 十进制分割
   */
  decimal?: string
  /**
   * 字体颜色
   * @default #606266
   */
  color?: string
  /**
   * 字体大小，单位px
   * @default 22
   */
  fontSize?: string | number
  /**
   * 字体是否加粗
   * @default false
   */
  bold?: boolean
  /**
   * 千位分隔符，详细见[文档](https://www.uviewui.com/components/countTo.html#%E5%8D%83%E5%88%86%E4%BD%8D%E5%88%86%E9%9A%94%E7%AC%A6)
   */
  separator?: string
  /**
   * 数值滚动到目标值时触发
   */
  onEnd?: () => any
}

declare interface _CountToRef {
  /**
   * `autoplay`为`false`时，通过此方法启动滚动
   */
  start: () => void
  /**
   * 暂停后重新开始滚动(从暂停前的值开始滚动)
   */
  reStart: () => void
  /**
   * 暂停滚动
   */
  paused: () => void
}

declare interface _CountTo {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      CountToProps
  }
}

export declare const CountTo: _CountTo

export declare const CountToRef: _CountToRef
