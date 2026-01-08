export interface RouteParam {
  type: "navigateTo" | "redirect" | "switchTab" | "reLaunch" | "navigateBack";
  /** 路由地址 */
  url: string;
  /** navigateBack页面后退时,回退的层数 */
  delta?: number;
  /** 传递的参数 */
  params?: {};
  /** 窗口动画,只在APP有效 */
  animationType?: string;
  /** 窗口动画持续时间,单位毫秒,只在APP有效 */
  animationDuration?: number;
  /** 是否需要拦截 */
  intercept?: boolean;
}

export interface test {
  /** 邮箱格式校验 */
  email(email: string): boolean;
  /** 手机号校验 */
  mobile(phone: number): boolean;
  /** url路径验证 */
  url(value: string): boolean;
  /** 验证日期格式 */
  date(value: string | number): boolean;
  /** 验证ISO类型的日期格式 YYYY-MM-DD | YYYY/MM/DD */
  dateISO(value: string): boolean;
  /** 验证十进制数字 */
  number(value: number): boolean;
  /** 验证字符串 */
  string(value: string): boolean;
  /** 验证整数 */
  digits(value: number): boolean;
  /** 验证身份证号码 */
  idCard(value: string | number): boolean;
  /** 是否车牌号 */
  carNo(value: string): boolean;
  /** 金额,只允许2位小数 */
  amount(value: string | number): boolean;
  /** 校验是否是中文 */
  chinese(value: any): boolean;
  /** 校验是否是字母 */
  letter(value: any): boolean;
  /** 校验字母或者数字 */
  enOrNum(value: any): boolean;
  /** 验证是否包含某个值 */
  contains(source: string, value: string): boolean;
  /** 验证一个值范围[min, max] */
  range(value: string, between: number[]): boolean;
  /** 验证一个长度范围[min, max] */
  rangeLength(value: string, between: number[]): boolean;
  /** 是否固定电话 */
  landline(value: string | number): boolean;
  /** 判断是否为空 */
  empty(value: string | number | undefined | boolean | object | null): boolean;
  /** 是否json字符串 */
  jsonString(value: string): boolean;
  /** 是否数组 */
  array(value: any): boolean;
  /** 是否对象 */
  object(value: any): boolean;
  /** 是否短信验证码 */
  code(value: any, len: number): boolean;
  /** 是否函数方法 */
  func(value: any): boolean;
  /** 是否promise对象 */
  promise(value: any): boolean;
  /** 是否图片格式 */
  image(value: string): boolean;
  /** 是否视频格式 */
  video(value: string): boolean;
  /** 是否为正则对象 */
  regExp(value: any): boolean;
}

export interface Func {
  /**
   * 此方法用于限制value的大小
   * - 如果其在min和max之间，则不变；
   * - 如果其小于min，则取min值；
   * - 如果其大于max，则取max值。
   * @param min 最小值，默认 0
   * @param max 最大值，默认 0
   * @param value 当前值，默认 0
   */
  range(min?: number, max?: number, value?: number): number;

  /**
   * 用于获取用户传递值的px值
   * - 如果用户传递了number，直接返回
   * - 如果用户传递了"xxpx"或者"xxrpx"，取出其数值部分
   * - 如果是"xxxrpx"还需要用过uni.rpx2px进行转换
   * @param value 数值或带单位的字符串
   * @param unit 是否返回带 px 的字符串
   */
  getPx(value: number | string, unit?: boolean): number | string;

  /**
   * 用于统一rpx2px方法，因uni-app现有API未统一。
   * @param value rpx 值
   */
  rpx2px(value: number): number;

  /**
   * 进行延时，以达到可以简写代码的目的 比如: await uni.$u.sleep(20)将会阻塞20ms
   * @param value 延时时间（ms），默认 30
   */
  sleep(value?: number): Promise<void>;

  /**
   * 运行期判断平台
   * @returns 平台名称（小写）
   * @link 运行期判断平台 https://uniapp.dcloud.io/frame?id=判断平台
   */
  os(): string;

  /**
   * 获取系统信息（同步）
   * @link 获取系统信息同步接口 https://uniapp.dcloud.io/api/system/info?id=getsysteminfosync
   */
  sys(): UniApp.GetSystemInfoResult;

  /**
   * 获取一个区间内的随机整数
   * @param min 最小值
   * @param max 最大值
   */
  random(min: number, max: number): number;

  /**
   * 生成 uuid
   * @param len uuid 长度，默认 32
   * @param firstU 是否以 u 开头，默认 true
   * @param radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
   */
  guid(len?: number, firstU?: boolean, radix?: number | null): string;

  /**
   * 获取父组件的参数，因为支付宝小程序不支持provide/inject的写法
   *  this.$parent在非H5中，可以准确获取到父组件，但是在H5中，需要多次this.$parent.$parent.xxx
   * 这里默认值等于undefined有它的含义，因为最顶层元素(组件)的$parent就是undefined，意味着不传name
   * 值(默认为undefined)，就是查找最顶层的$parent
   * @param name 父组件 name
   */
  $parent(this: any, name?: string): any | false;

  /**
   * 样式转换
   * - string → object
   * - object → string
   * @param customStyle 样式字符串或对象
   * @param target 转换的目的，object-转为对象，string-转为字符串
   */
  addStyle(
    customStyle: Record<string, any> | string,
    target?: "object" | "string"
  ): Record<string, any> | string;

  /**
   * 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
   * @param value 值（数字 / auto / 字符串）
   * @param unit 单位，默认使用 config.unit
   */
  addUnit(value?: string | number, unit?: string): string;

  /**
   * 深度克隆
   * @param obj 需要深度克隆的对象
   */
  deepClone<T extends object>(obj: T): T;

  /**
   * 深度合并对象
   * @param target 需要拷贝的对象
   * @param source 拷贝的来源对象
   * @returns {object|boolean} 深度合并后的对象或者false（入参有不是对象）
   */
  deepMerge<T extends object, U extends object>(
    target: T,
    source: U
  ): (T & U) | false;

  /**
   * JS对象深度合并
   * @param {object} target 需要拷贝的对象
   * @param {object} source 拷贝的来源对象
   * @returns {object|boolean} 深度合并后的对象或者false（入参有不是对象）
   */
  shallowMerge<T extends object, U extends object>(
    target: T,
    source: U
  ): (T & U) | false;

  /**
   * 打乱数组
   * @param array 原数组
   */
  randomArray<T>(array: T[]): T[];

  /**
   * 时间格式化
   * @param dateTime 时间戳 / 字符串
   * @param formatStr fmt 格式化规则 yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合 默认yyyy-mm-dd
   */
  timeFormat(dateTime?: string | number | null, formatStr?: string): string;

  /**
   * 时间转“多久之前”
   * @param timestamp 时间戳
   * @param format 格式化规则如果为时间格式字符串，超出一定时间范围，返回固定的时间格式；如果为布尔值false，无论什么时间，都返回多久以前的格式
   */
  timeFrom(timestamp?: string | number | null, format?: string | false): string;

  /**
   * 去除空格
   * @param str 原字符串
   * @param pos 去除位置
   */
  trim(str: string, pos?: "both" | "left" | "right" | "all"): string;

  /**
   * 对象转 URL 参数
   * @param data 参数对象
   * @param isPrefix 是否自动加上"?"
   * @param arrayFormat 数组格式
   */
  queryParams(
    data?: Record<string, any>,
    isPrefix?: boolean,
    arrayFormat?: "indices" | "brackets" | "repeat" | "comma"
  ): string;

  /**
   * 显示消息提示框
   * @param title 提示内容
   * @param duration 持续时间
   */
  toast(title: string, duration?: number): void;

  /**
   * 数字格式化
   * @param number 要格式化的数字
   * @param decimals 保留几位小数
   * @param decimalPoint 小数点符号
   * @param thousandsSeparator 千分位符号
   * @returns 格式化后的数字
   */
  priceFormat(
    number: string | number,
    decimals?: number,
    decimalPoint?: string,
    thousandsSeparator?: string
  ): string;

  /**
   * 生成同色系浅色背景
   * @param textColor 文本颜色
   * @param lightness 亮度百分比
   */
  genLightColor(textColor: string, lightness?: number): string;

  /**
   * 防抖函数
   * @param func 触发回调执行的函数
   * @param wait 时间间隔，单位ms
   * @param immediate 在开始还是结束处触发，如非特殊情况，一般默认为false即可
   */
  debounce(
    func: (...rest: any[]) => any,
    wait?: number,
    immediate?: boolean
  ): void;

  /**
   * 节流函数
   * @param func 触发回调执行的函数
   * @param wait 时间间隔，单位ms
   * @param immediate 在开始还是结束处触发，如非特殊情况，一般默认为false即可
   */
  throttle(
    func: (...rest: any[]) => any,
    wait?: number,
    immediate?: boolean
  ): void;

  /**
   * 求两个颜色之间的渐变值
   * @param {string} startColor 开始的颜色
   * @param {string} endColor 结束的颜色
   * @param {number} step 颜色等分的份额
   */
  colorGradient(startColor: string, endColor: string, step: number): any[];

  /**
   * 将hex表示方式转换为rgb
   * @param color "#000000"-> "rgb(0,0,0)" | "rgb(0,0,0)" -> "#000000"
   * @param str 是否返回颜色数组 true -> 不返回
   * @returns
   */
  hexToRgb(color: string, str?: boolean): any[];

  /**
   * 将rgb表示方式转换为hex
   */
  rgbToHex(color: string): string;

  /**
   * 十六进制转换为rgb或rgba
   * @param color
   * @param alpha 透明度
   * @returns  rgba（255，255，255，0.5）字符串
   */
  colorToRgba(color: string, alpha: number): string;

  /** 路由跳转 */
  route(url: string | RouteParam): void;
}
