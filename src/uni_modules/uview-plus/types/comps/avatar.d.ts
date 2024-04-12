import { AllowedComponentProps, VNodeProps } from './_common'
import { ImageMode } from './image'

declare interface AvatarProps {
  /**
   * 头像路径，如加载失败，将会显示默认头像(不能为相对路径)
   */
  src?: string
  /**
   * 头像形状
   * @default "circle"
   */
  shape?: 'circle' | 'square'
  /**
   * 头像尺寸
   * @default 40
   */
  size?: 'large' | 'default' | 'mini' | number
  /**
   * 裁剪类型
   * @default "scaleToFill"
   */
  mode?: ImageMode
  /**
   * 用文字替代图片，级别优先于`src`
   */
  text?: string
  /**
   * 背景颜色
   * @default "#c0c4cc"
   */
  bgColor?: string
  /**
   * 文字颜色
   * @default "#fff"
   */
  color?: string
  /**
   * 文字大小
   * @default 18
   */
  fontSize?: string | number
  /**
   * 显示的图标
   */
  icon?: string
  /**
   * 显示小程序头像，只对百度，微信，QQ小程序有效
   * @default false
   */
  mpAvatar?: boolean
  /**
   * 是否使用随机背景色
   * @default false
   */
  randomBgColor?: boolean
  /**
   * 加载失败的默认头像(组件有内置默认图片)
   */
  defaultUrl?: string
  /**
   * 如果配置了randomBgColor为true，且配置了此值，则从默认的背景色数组中取出对应索引的颜色值，取值0-19之间
   */
  colorIndex?: string | number
  /**
   * 组件标识符
   * @default "level"
   */
  name?: string
  /**
   * 头像被点击
   * @param index 用户传递的标识符
   */
  onClick?: (index: any) => any
}

declare interface _Avatar {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      AvatarProps
  }
}

export declare const Avatar: _Avatar
