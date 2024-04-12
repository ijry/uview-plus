import { AllowedComponentProps, VNodeProps } from './_common'


declare interface SkeletonProps {
  /**
   * 是否显示骨架占位图，设置为`false`将会展示子组件内容
   * @default true
   */
  loading?: boolean
  /**
   * 是否开启动画效果
   * @default true
   */
  animate?: boolean
  /**
   * 段落占位图行数
   * @default 0
   */
  rows?: string | number
  /**
   * 段落占位图的宽度，可以为百分比，数值，带单位字符串等，可通过数组传入指定每个段落行的宽度
   * @default "100%"
   */
  rowsWidth?: string | number | any[]
  /**
   * 段落的高度
   * @default 18
   */
  rowsHeight?: string | number | any[]
  /**
   * 是否展示标题占位图
   * @default true
   */
  title?: boolean
  /**
   * 标题的宽度
   * @default "50%"
   */
  titleWidth?: string | number
  /**
   * 标题的高度
   * @default 18
   */
  titleHeight?: string | number
  /**
   * 是否展示头像占位图
   * @default false
   */
  avatar?: boolean
  /**
   * 头像占位图大小
   * @default 32
   */
  avatarSize?: string | number
  /**
   * 头像占位图的形状
   * @default "circle"
   */
  avatarShape?: 'circle' | 'square'
}

declare interface _Skeleton {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      SkeletonProps
  }
}

export declare const Skeleton: _Skeleton
