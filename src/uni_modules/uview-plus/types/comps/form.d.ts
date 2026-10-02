import { AllowedComponentProps, VNodeProps } from './_common'

/** 校验未通过时返回的错误项 */
declare interface FormValidateError {
  /** 校验未通过的提示信息 */
  message: string
  /** 对应 form-item 的 prop */
  prop: string
  /** async-validator 返回的字段名 */
  field?: string
  [key: string]: any
}

/** validate/validateField 的可选配置 */
declare interface FormValidateOptions {
  /**
   * 是否把错误信息显示到对应的 form-item 上
   * @default true
   */
  showErrorMsg?: boolean
}

declare interface FormProps {
  /**
   * 表单数据对象
   */
  model?: Record<string, any>
  /**
   * 通过ref设置，如果rules中有自定义方法等，需要使用setRules方法设置规则，详见[文档](https://www.uviewui.com/components/form.html#%E9%AA%8C%E8%AF%81%E8%A7%84%E5%88%99)
   */
  rules?: Record<string, any> | any[] | ((...args: any[]) => any)
  /**
   * 错误的提示方式
   * @default "message"
   */
  errorType?: 'message' | 'none' | 'toast' | 'border-bottom'
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
   * 对整个表单进行校验
   * - 校验通过时 resolve(true)，校验不通过时 reject(错误数组)
   * - 未设置 rules 时开发环境会给出提示并返回 undefined
   * @example
   * formRef.value.validate().then(valid => {
   *   // valid 为 true 表示校验通过
   * }).catch((errors) => {})
   */
  validate: (options?: FormValidateOptions) => Promise<boolean>
  /**
   * 如果`rules`中有自定义方法等，需要用此方法设置`rules`规则，否则微信小程序无效
   */
  setRules: (rules: Record<string, any> | any[] | ((...args: any[]) => any)) => void
  /**
   * 对部分表单字段进行校验
   * @param value 需要校验的 form-item 的 prop，可传数组批量校验
   * @param cb 校验完成后的回调，参数为错误数组，长度为0表示校验通过
   * @param event 触发校验的事件名，仅校验 trigger 包含该事件的规则
   * @param options 校验配置
   */
  validateField: (
    value: string | string[],
    cb?: (errorsRes: FormValidateError[]) => any,
    event?: string | null,
    options?: FormValidateOptions
  ) => Promise<void>
  /**
   * 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
   */
  resetFields: () => void
  /**
   * 清空校验结果
   * @param props 需要清空的 form-item 的 prop，不传则清空全部
   */
  clearValidate: (props?: string | string[]) => void
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
