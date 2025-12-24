import { AllowedComponentProps, VNodeProps } from './_common'

declare interface ParseProps {
  /**
   * 背景颜色，只适用与APP-PLUS-NVUE
   */
  bgColor?: string
  /**
   * 要显示的富文本字符串
   */
  content?: string
  /**
   * 是否允许外部链接被点击时自动复制
   */
  copyLink?: string
  /**
   * 主域名，设置后将给链接自动拼接上主域名或协议名
   */
  domain?: string
  /**
   * 图片出错时的占位图链接
   */
  errorImg?: string
  /**
   * 是否开启图片懒加载，nvue不支持此属性
   * @default true
   */
  lazyLoad?: boolean
  /**
   * 图片加载完成前的占位图
   */
  loadingImg?: string
  /**
   * 是否在播放一个视频时自动暂停其它视频
   */
  pauseVideo?: boolean
  /**
   * 是否开启图片被点击时自动预览
   * @default true
   */
  previewImg?: boolean
  /**
   * 是否自动给 table 添加一个滚动层（使表格可以单独横向滚动）
   * @default false
   */
  scrollTable?: boolean
  /**
   * 是否开启长按复制内容
   * @default false
   */
  selectable?: boolean
  /**
   * 是否自动将 title 标签的内容设置到页面标题
   * @default true
   */
  setTitle?: boolean
  /**
   * 是否开启图片被长按时显示菜单
   * @default true
   */
  showImgMenu?: boolean
  /**
   * 设置标签的默认样式
   */
  tagStyle?: unknown
  /**
   * 是否使用页面内锚点
   * @default false
   */
  useAnchor?: boolean | number
  /**
   * dom 加载完成时触发
   */
  onLoad?: () => any
  /**
   * 渲染完成时触发
   */
  onReady?: (...args: any) => any
  /**
   * 出错时触发
   */
  onError?: (...args: any) => any
  /**
   * 图片被点击时触发
   */
  onImgTap?: (...args: any) => any
  /**
   * 在链接被点击时触发
   */
  onLinkTap?: (...args: any) => any
}

declare interface _Parse {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      ParseProps
  }
}

export declare const Parse: _Parse
