export interface LottieProps {
  /**
   * 动画 JSON 路径，支持 http(s)；H5 / App-Vue 额外支持本地静态路径
   * @default ""
   */
  filePath?: string
  /**
   * 直接传入 Lottie JSON 对象，优先级高于 filePath
   * @default null
   */
  animationData?: Record<string, any> | null
  /**
   * 内容填充模式
   * @default "AspectFill"
   */
  contentModel?: 'ScaleToFill' | 'AspectFill' | 'Center'
  /**
   * 是否循环播放
   * @default false
   */
  loop?: boolean
  /**
   * 数据与引擎就绪后是否自动播放
   * @default true
   */
  autoplay?: boolean
}

/** u-lottie 播放器；帧控制在 ready 后调用。 */
export interface LottieNativeMethods {
  reload(): Promise<void>
  playAnimation(): void
  pauseAnimation(): void
  resumeAnimation(): void
  cancelAnimation(): void
  getTotalFrames(): number
  setDirection(direction: number): void
  setSpeed(speed: number): void
  goToAndStop(value: number, isFrame?: boolean): void
  goToAndPlay(value: number, isFrame?: boolean): void
}

export interface LottieStateChangeDetail {
  /** 状态类型 */
  type: 'ready' | 'play' | 'pause' | 'resume' | 'stop' | 'complete' | 'error'
  /** 仅 type 为 error 时存在 */
  message?: string
}
