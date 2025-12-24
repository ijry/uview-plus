import { AllowedComponentProps, VNodeProps } from './_common'

declare interface FormProps {
  /**
   * 表单数据对象
   */
  model?: Record<string, any>
  /**
   * 通过ref设置，如果rules中有自定义方法等，需要使用setRules方法设置规则，详见[文档](https://www.uviewui.com/components/form.html#%E9%AA%8C%E8%AF%81%E8%A7%84%E5%88%99)
   */
  rules?: Record<string, any>
  /**
   * 错误的提示方式
   * @default "message"
   */
  errorType?: 'message' | 'none' | 'toast' | 'border-bottom' | 'none'
  /**
   * 是否显示表单域的下划线边框
   * @default true
   */
  borderBottom?: boolean
  /**
   * 表单域提示文字的位置，left-左侧，top-上方
   * @default "left"
   */
  labelPosition?: 'left' | 'top'
  /**
   * 提示文字的宽度，单位px
   * @default 45
   */
  labelWidth?: string | number
  /**
   * lable字体的对齐方式
   * @default "left"
   */
  labelAlign?: 'left' | 'center' | 'right'
  /**
   * lable的样式
   */
  labelStyle?: unknown
}

declare interface _FormRef {
  /**
   * 对整个表单进行校验的方法
   */
  validate: () => any
  /**
   * 如果`rules`中有自定义方法等，需要用此方法设置`rules`规则，否则微信小程序无效
   */
  setRules: (rules: any) => any
  /**
   * 对部分表单字段进行校验
   */
  validateField: (value, cb?: ((errorsRes) => any)) => any
  /**
   * 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
   */
  resetFields: () => any
  /**
   * 清空校验结果
   */
  clearValidate: (props: any) => any
}

declare interface _Form {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      FormProps
  }
}

export declare const Form: _Form

export declare const FormRef: _FormRef
