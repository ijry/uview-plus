import { AllowedComponentProps, VNodeProps } from './_common'

declare interface ActionSheetProps {
  /**
   * 是否展示
   * @default false
   */
  show?: boolean
  /**
   * 设置标题
   */
  title?: string
  /**
   * 选项上方的描述信息
   */
  description?: string
  /**
   * 按钮的文字数组
   * @default []
   */
  actions?: any[]
  /**
   * 取消按钮的文字，不为空时显示按钮
   */
  cancelText?: string
  /**
   * 点击某个菜单项时是否关闭弹窗
   */
  closeOnClickAction?: string
  /**
   * 是否开启底部安全区适配
   * @default false
   */
  safeAreaInsetBottom?: boolean
  /**
   * 小程序的打开方式
   */
  openType?: string
  /**
   * 点击遮罩是否允许关闭
   */
  closeOnClickOverlay?: boolean
  /**
   * 圆角值，默认无圆角
   * @default 0
   */
  round?: string | number
  /**
   * 指定返回用户信息的语言
   * @default "en"
   */
  lang?: 'zh_CN' | 'zh_TW' | 'en'
  /**
   * 会话来源，open-type="contact"时有效。只微信小程序有效
   */
  sessionFrom?: string
  /**
   * 会话内消息卡片标题，openType="contact"时有效
   */
  sendMessageTitle?: string
  /**
   * 会话内消息卡片点击跳转小程序路径，openType="contact"时有效
   */
  sendMessagePath?: string
  /**
   * 会话内消息卡片图片，openType="contact"时有效
   */
  sendMessageImg?: string
  /**
   * 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，用户点击后可以快速发送小程序消息，openType="contact"时有效
   * @default false
   */
  showMessageCard?: boolean
  /**
   * 打开 APP 时，向 APP 传递的参数，openType=launchApp 时有效
   */
  appParameter?: string
  /**
   * 点击ActionSheet列表项时触发
   */
  onSelect?: () => any
  /**
   * 点击取消按钮时触发
   */
  onClose?: () => any
  /**
   * 获取用户信息回调，openType="getUserInfo"时有效
   * @param detail 用户信息
   */
  onGetuserinfo?: (detail: any) => any
  /**
   * 客服消息回调，openType="contact"时有效
   */
  onContact?: () => any
  /**
   * 获取用户手机号回调，openType="getPhoneNumber"时有效
   */
  onGetphonenumber?: () => any
  /**
   * 当使用开放能力时，发生错误的回调
   */
  onError?: (...args: any) => any
  /**
   * 在打开授权设置页并关闭后回调
   */
  onOpensetting?: (...args: any) => any
  /**
   * 打开 APP 成功的回调
   */
  onLaunchapp?: (...args: any) => any
}

declare interface _ActionSheet {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      ActionSheetProps
  }
}

export declare const ActionSheet: _ActionSheet
