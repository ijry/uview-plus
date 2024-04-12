import { AllowedComponentProps, VNodeProps } from './_common'

declare interface ButtonProps {
  /**
   * 是否显示按钮的细边框
   * @default true
   */
  hairline?: boolean
  /**
   * 按钮的样式类型
   * @default "info"
   */
  type?: 'info' | 'primary' | 'error' | 'warning' | 'success'
  /**
   * 按钮的大小
   * @default "normal"
   */
  size?: 'normal' | 'large' | 'mini'
  /**
   * 按钮外观形状
   * @default "square"
   */
  shape?: 'square' | 'circle'
  /**
   * 按钮是否镂空
   * @default false
   */
  plain?: boolean
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * 按钮名称前是否带 loading 图标
   * @default false
   */
  loading?: boolean
  /**
   * 加载中提示文字
   */
  loadingText?: string
  /**
   * 加载状态图标类型
   * @default "spinner"
   */
  loadingMode?: string
  /**
   * 加载图标大小
   * @default 15
   */
  loadingSize?: string | number
  /**
   * 开放能力，具体请看 [button](https://uniapp.dcloud.net.cn/component/button.html#open-type-%E6%9C%89%E6%95%88%E5%80%BC)
   */
  openType?: string
  /**
   * 用于 <form> 组件
   */
  formType?: 'submit' | 'reset'
  /**
   * 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效 （注：只微信小程序、QQ小程序有效）
   */
  appParameter?: string
  /**
   * 指定是否阻止本节点的祖先节点出现点击态，微信小程序有效
   * @default true
   */
  hoverStopPropagation?: boolean
  /**
   * 指定返回用户信息的语言
   * @default "en"
   */
  lang?: 'en' | 'zh_CN' | 'zh_TW'
  /**
   * 会话来源，openType="contact"时有效
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
   */
  showMessageCard?: string
  /**
   * 额外传参参数，用于小程序的data-xxx属性，通过target.dataset.name获取
   */
  dataName?: string
  /**
   * 节流，一定时间内只能触发一次，单位毫秒
   * @default 0
   */
  throttleTime?: string | number
  /**
   * 按住后多久出现点击态，单位毫秒
   * @default 0
   */
  hoverStartTime?: string | number
  /**
   * 手指松开后点击态保留时间，单位毫秒
   * @default 200
   */
  hoverStayTime?: string | number
  /**
   * 	按钮文字，之所以通过props传入，是因为slot传入的话（注：nvue中无法控制文字的样式）
   */
  text?: string | number
  /**
   * 按钮图标
   */
  icon?: string
  /**
   * 按钮颜色
   */
  iconColor?: string
  /**
   * 按钮颜色，支持传入linear-gradient渐变色
   */
  color?: string
  /**
   * 定义需要用到的外部样式
   */
  customStyle?: unknown
  /**
   * 按钮点击，请勿使用@tap点击事件，微信小程序无效，返回值为点击事件及参数
   */
  onClick?: (...args: any) => any
  /**
   * open-type="getPhoneNumber"时有效
   */
  onGetphonenumber?: (...args: any) => any
  /**
   * 获取用户信息回调，openType="getUserInfo"时有效
   * @param detail 用户信息
   */
  onGetuserinfo?: (detail: any) => any
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

declare interface _Button {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      ButtonProps
  }
}

export declare const Button: _Button
