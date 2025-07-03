import { AllowedComponentProps, VNodeProps } from './_common'

declare interface ReadMoreProps {
  /**
   * 内容超出此高度才会显示展开全文按钮，单位rpx
   * @default 400
   */
  showHeight?: string | number
  /**
   * 展开后是否显示收起按钮
   * @default false
   */
  toggle?: boolean
  /**
   * 关闭时的提示文字
   * @default "展开阅读全文"
   */
  closeText?: string
  /**
   * 展开时的提示文字
   * @default "收起"
   */
  openText?: string
  /**
   * 提示文字的颜色
   * @default "#2979ff"
   */
  color?: string
  /**
   * 提示文字的大小，默认单位px
   * @default 14
   */
  fontSize?: string | number
  /**
   * 对阴影的自定义处理
   */
  shadowStyle?: {
    backgroundImage?: string
    paddingTop?: string
    marginTop?: string
  }
  /**
   * 段落首行缩进的字符个数
   * @default "2em"
   */
  textIndent?: string
  /**
   * 用于在`open`和`close`事件中当作回调参数返回
   */
  name?: string | number
  /**
   * 内容被展开时触发
   * @param name props中传入的`name`参数值
   */
  onOpen?: (name: any) => any
  /**
   * 内容被收起时触发
   * @param name props中传入的`name`参数值
   */
  onClose?: (name: any) => any
}

declare interface _ReadMoreRef {
  /**
   * 重新初始化组件内部高度计算过程，如果内嵌u-parse组件时可能需要用到
   */
  init: () => void
}

declare interface _ReadMore {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      ReadMoreProps
  }
}

export declare const ReadMore: _ReadMore

export declare const ReadMoreRef: _ReadMoreRef
