import { AllowedComponentProps, VNodeProps } from './_common'
import { ImageMode } from './image'

declare interface IconProps {
  /**
   * 图标名称，如名称带有`/`，会被认为是图片图标
   */
  name?: string
  /**
   * 图标颜色
   * @default "color['u-content-color']"
   */
  color?: string
  /**
   * 图标字体大小，单位默认px
   * @default "16px"
   */
  size?: string | number
  /**
   * 是否显示粗体
   * @default false
   */
  bold?: boolean
  /**
   * 一个用于区分多个图标的值，点击图标时通过`click`事件传出
   */
  index?: string | number
  /**
   * 图标按下去的样式类，用法同uni的`view`组件的`hover-class`参数，详见：[hover-class](https://uniapp.dcloud.io/component/view)
   */
  hoverClass?: string
  /**
   * 图标右侧/下方的label文字
   */
  label?: string | number
  /**
   * `label`相对于图标的位置
   * @default "right"
   */
  labelPos?: 'right' | 'bottom' | 'top' | 'left'
  /**
   * `label`字体大小，单位默认px
   * @default "15px"
   */
  labelSize?: string | number
  /**
   * `label`字体颜色
   * @default "color['u-content-color']"
   */
  labelColor?: string
  /**
   * `label`与图标的距离，单位默认px
   * @default "3px"
   */
  space?: string | number
  /**
   * 裁剪模式
   */
  imgMode?: ImageMode
  /**
   * `name`为图片路径时图片的宽度，单位默认px
   */
  width?: string | number
  /**
   * `name`为图片路径时图片的高度，单位默认px
   */
  height?: string | number
  /**
   * 图标到顶部的距离，如果某些场景，如果图标没有垂直居中，可以调整此参数，单位默认px
   * @default 0
   */
  top?: string | number
  /**
   * 是否阻止事件传播
   * @default false
   */
  stop?: boolean
  /**
   * 点击图标时触发
   * @param index 通过`props`传递的`index`值
   */
  onClick?: (index: any) => any
}

declare interface _Icon {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      IconProps
  }
}

export declare const Icon: _Icon
