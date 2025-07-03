import { AllowedComponentProps, VNodeProps } from './_common'

declare interface FormItemProps {
  /**
   * 左侧提示文字
   */
  label?: string
  /**
   * 表单域`model`对象的属性名，在使用 validate、resetFields 方法的情况下，该属性是必填的
   */
  prop?: string
  /**
   * 是否显示下边框，如不需要下边框，需同时将u-form的同名参数设置为false
   * @default true
   */
  borderBottom?: boolean
  /**
   * 提示文字的宽度，单位rpx，如设置，将覆盖`u-form`的同名参数
   */
  labelWidth?: string | number
  /**
   * label的位置
   */
  labelPosition?: 'left' | 'top'
  /**
   * 右侧自定义字体图标(限uView内置图标)或图片地址
   */
  rightIcon?: string
  /**
   * 左侧自定义字体图标(限uView内置图标)或图片地址
   */
  leftIcon?: string
  /**
   * 左侧自定义字体图标的样式
   */
  leftIconStyle?: unknown
  /**
   * 是否显示左边的"*"号，这里仅起展示作用，如需校验必填，请通过rules配置必填规则，如需在swiper标签内显示星号，需要给予swiper-item内第一个根节点一定的margin样式
   * @default false
   */
  required?: boolean
  /**
   * 点击时触发
   */
  onClick?: () => any
}

declare interface FormItemSlots {
  /**
   * Form Item 的内容
   */
  ['default']?: () => any
  /**
   * 右侧自定义内容，可以在此传入一个按钮，用于获取验证码等场景
   */
  ['right']?: () => any
}

declare interface _FormItem {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      FormItemProps
    $slots: FormItemSlots
  }
}

export declare const FormItem: _FormItem
