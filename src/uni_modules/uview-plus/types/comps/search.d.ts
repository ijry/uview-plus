import { AllowedComponentProps, VNodeProps } from './_common'


declare interface SearchProps {
  /**
   * 双向绑定输入框搜索值
   */
  ['v-model']?: string
  /**
   * 搜索框形状，round-圆形，square-方形
   * @default "round"
   */
  shape?: 'round' | 'square'
  /**
   * 搜索框背景颜色
   * @default "#f2f2f2"
   */
  bgColor?: string
  /**
   * 占位文字内容
   * @default "请输入关键字"
   */
  placeholder?: string
  /**
   * 是否启用清除控件
   * @default true
   */
  clearabled?: boolean
  /**
   * 是否自动获得焦点
   * @default false
   */
  focus?: boolean
  /**
   * 是否显示右侧控件(右侧的"搜索"按钮)
   * @default true
   */
  showAction?: boolean
  /**
   * 右侧控件的样式，对象形式
   */
  actionStyle?: unknown
  /**
   * 右侧控件文字
   * @default "搜索"
   */
  actionText?: string
  /**
   * 输入框内容水平对齐方式
   * @default "left"
   */
  inputAlign?: 'left' | 'center'  |'right'
  /**
   * 自定义输入框样式，对象形式
   */
  inputStyle?: unknown
  /**
   * 是否启用输入框
   * @default false
   */
  disabled?: boolean
  /**
   * 边框颜色，配置了颜色，才会有边框
   * @default "transparent"
   */
  borderColor?: string
  /**
   * 搜索图标的颜色，默认同输入框字体颜色
   * @default "#909399"
   */
  searchIconColor?: string
  /**
   * 搜索图标的大小
   * @default 22
   */
  searchIconSize?: number
  /**
   * 输入框字体颜色
   * @default "#606266"
   */
  color?: string
  /**
   * placeholder的颜色
   * @default "#909399"
   */
  placeholderColor?: string
  /**
   * 输入框左边的图标，可以为uView图标名称或图片路径
   * @default "search"
   */
  searchIcon?: string
  /**
   * 输入框图标位置，left-左边，right-右边
   * @default "left"
   */
  iconPosition?: 'left' | 'right'
  /**
   * 组件与其他上下左右元素之间的距离，带单位的字符串形式，如"30rpx"、"30rpx 20rpx"等写法
   * @default "0"
   */
  margin?: string
  /**
   * 是否开启动画，详见[文档](https://www.uviewui.com/components/search.html#%E6%98%AF%E5%90%A6%E5%BC%80%E5%90%AF%E5%8F%B3%E8%BE%B9%E6%8E%A7%E4%BB%B6)
   * @default false
   */
  animation?: boolean
  /**
   * 输入框初始值
   */
  value?: string
  /**
   * 输入框最大能输入的长度，-1为不限制长度
   * @default -1
   */
  maxlength?: string | number
  /**
   * 输入框高度，单位rpx
   * @default 64
   */
  height?: string | number
  /**
   * 搜索左侧文本信息
   */
  label?: string | number
  /**
   * 输入框内容发生变化时触发
   * @param value 输入框的值
   */
  onChange?: (value: any) => any
  /**
   * 用户确定搜索时触发，用户按回车键，或者手机键盘右下角的"搜索"键时触发
   * @param value 输入框的值
   */
  onSearch?: (value: any) => any
  /**
   * 用户点击右侧控件时触发
   * @param value 输入框的值
   */
  onCustom?: (value: any) => any
  /**
   * 输入框失去焦点时触发
   * @param value 输入框的值
   */
  onBlur?: (value: any) => any
  /**
   * 输入框获得焦点时触发
   * @param value 输入框的值
   */
  onFocus?: (value: any) => any
  /**
   * 配置了`clearabled`后，清空内容时会发出此事件
   */
  onClear?: () => any
  /**
   * `disabled`为`true`时，点击输入框，发出此事件，用于跳转搜索页
   */
  onClick?: () => any
  /**
   * 左侧icon点击时候时触发
   */
  onClickIcon?: () => any
}

declare interface SearchSlots {
    /**
     * 修改输入框区域内部右侧内容 类似于左侧图标区域
     */
    ['inputRight']?: () => any
}

declare interface _Search {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      SearchProps
    $slots: SearchSlots
  }
}

export declare const Search: _Search
