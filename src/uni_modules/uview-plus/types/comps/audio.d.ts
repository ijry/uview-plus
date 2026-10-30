import { AllowedComponentProps, VNodeProps } from './_common'

declare interface AudioProps {
  /**
   * 音频地址，支持单个地址或地址数组（多源，加载失败自动切换）
   * @default ""
   */
  src?: string | string[]
  /**
   * 标题，显示在音频条上
   * @default ""
   */
  title?: string
  /**
   * 是否循环播放
   * @default false
   */
  loop?: boolean
  /**
   * 是否显示倍速切换
   * @default true
   */
  showRate?: boolean
  /**
   * 可切换的倍速档位
   * @default [0.5, 0.75, 1, 1.25, 1.5, 2]
   */
  rateList?: number[]
  /**
   * 主题色（播放按钮、进度条选中色）
   * @default "#2979ff"
   */
  activeColor?: string
  /**
   * 是否显示标题
   * @default true
   */
  showTitle?: boolean
  /**
   * 开始播放时触发
   */
  onPlay?: (e: { source: string; src: string }) => any
  /**
   * 加载/播放出错时触发
   */
  onError?: (e: { source: string; errMsg: string }) => any
}

declare interface _Audio {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      AudioProps
  }
}

export declare const Audio: _Audio
