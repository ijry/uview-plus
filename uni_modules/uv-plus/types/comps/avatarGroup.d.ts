import { AllowedComponentProps, VNodeProps } from './_common'
import { ImageMode } from './image'

declare interface AvatarGroupProps {
  /**
   * 头像图片组
   * @default []
   */
  urls?: string[]
  /**
   * 最多展示的头像数量
   * @default 5
   */
  maxCount?: string | number
  /**
   * 头像形状
   * @default "circle"
   */
  shape?: 'circle' | 'square'
  /**
   * 裁剪模式
   * @default "aspectFill"
   */
  mode?: ImageMode
  /**
   * 超出maxCount时是否显示查看更多的提示
   * @default true
   */
  showMore?: boolean
  /**
   * 头像大小
   * @default 40
   */
  size?: string | number
  /**
   * 指定从数组的对象元素中读取哪个属性作为图片地址
   */
  keyName?: string
  /**
   * 头像之间的遮挡比例（0.4代表遮挡40%）
   * @default 0.5
   */
  gap?: string | number
  /**
   * 需额外显示的值，如设置则优先于内部的`urls.length - maxCount`值
   */
  extraValue?: string | number
  /**
   * 头像组更多点击
   */
  onShowMore?: () => any
}

declare interface _AvatarGroup {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      AvatarGroupProps
  }
}

export declare const AvatarGroup: _AvatarGroup
