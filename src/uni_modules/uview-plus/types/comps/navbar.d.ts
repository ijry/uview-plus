import { AllowedComponentProps, VNodeProps } from './_common'

declare interface NavbarProps {
  /**
   * 是否开启顶部安全区适配
   * @default true
   */
  safeAreaInsetTop?: boolean
  /**
   * 固定在顶部时，是否生成一个等高元素，以防止塌陷
   * @default false
   */
  placeholder?: boolean
  /**
   * 导航栏是否固定在顶部
   * @default true
   */
  fixed?: boolean
  /**
   * 导航栏底部是否显示下边框
   * @default false
   */
  border?: boolean
  /**
   * 左边返回图标的名称，只能为uView自带的图标
   * @default "arrow-left"
   */
  leftIcon?: string
  /**
   * 左边的提示文字
   */
  leftText?: string
  /**
   * 右边的提示文字
   */
  rightText?: string
  /**
   * 右边返回图标的名称，只能为uView自带的图标
   */
  rightIcon?: string
  /**
   * 导航栏标题，如设置为空字符，将会隐藏标题占位区域
   */
  title?: string
  /**
   * 导航栏背景设置，支持颜色、渐变或背景图
   * @default "#fff"
   */
  bgColor?: string
  /**
   * 状态栏背景颜色，保留兼容；导航栏内部统一使用 bgColor 作为整体背景
   * @default bgColor
   */
  statusBarBgColor?: string
  /**
   * 导航栏标题的最大宽度，内容超出会以省略号隐藏，单位rpx
   * @default "400rpx"
   */
  titleWidth?: string | number
  /**
   * 导航栏高度(不包括状态栏高度在内，内部自动加上)，单位px
   * @default "44px"
   */
  height?: string | number
  /**
   * 左侧返回图标的大小
   * @default "20px"
   */
  leftIconSize?: string | number
  /**
   * 左侧返回图标的颜色
   * @default "#303133"
   */
  leftIconColor?: string
  /**
   * 点击左侧区域(返回图标)，是否自动返回上一页
   * @default false
   */
  autoBack?: boolean
  /**
   * 标题的样式
   */
  titleStyle?: unknown
  /**
   * 导航栏模式。ios 模式下初始背景透明、标题左对齐大字号显示，
   * 下滑压缩后过渡为居中标题并呈现磨砂背景。
   * ios 模式下 fixed 与 placeholder 被忽略。nvue 端降级为 default。
   * @default "default"
   */
  mode?: 'default' | 'ios'
  /**
   * 页面滚动距离，仅 ios 模式使用，需由页面 onPageScroll 传入。
   * 不传时导航栏停留在大标题展开态。
   * @default 0
   */
  scrollTop?: string | number
  /**
   * 点击左侧区域
   */
  onLeftClick?: () => any
  /**
   * 点击右侧区域
   */
  onRightClick?: () => any
}

declare interface NavbarSlots {
  /**
   * 自定义左侧部分内容
   */
  ['left']?: () => any
  /**
   * 自定义右侧部分内容
   */
  ['right']?: () => any
  /**
   * 自定义中部内容
   */
  ['center']?: () => any
}

declare interface _Navbar {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      NavbarProps
    $slots: NavbarSlots
  }
}

export declare const Navbar: _Navbar
