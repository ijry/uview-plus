import {
	number as testNumber,
	array as testArray,
	empty as testEmpty
} from './test'
import { round } from './digit.js'
import config from '../config/config';
/**
 * @description 如果value小于min，取min；如果value大于max，取max
 * @param {number} min 
 * @param {number} max 
 * @param {number} value
 */
export function range(min = 0, max = 0, value = 0) {
	return Math.max(min, Math.min(max, Number(value)))
}

/**
 * @description 用于获取用户传递值的px值  如果用户传递了"xxpx"或者"xxrpx"，取出其数值部分，如果是"xxxrpx"还需要用过uni.rpx2px进行转换
 * @param {number|string} value 用户传递值的px值
 * @param {boolean} unit 
 * @returns {number|string}
 */
export function getPx(value, unit = false) {
	if (testNumber(value)) {
		return unit ? `${value}px` : Number(value)
	}
	// 如果带有rpx，先取出其数值部分，再转为px值
	if (/(rpx|upx)$/.test(value)) {
		return unit ? `${uni.upx2px(parseInt(value))}px` : Number(uni.upx2px(parseInt(value)))
	}
	return unit ? `${parseInt(value)}px` : parseInt(value)
}

/**
 * @description 进行延时，以达到可以简写代码的目的 比如: await uni.$u.sleep(20)将会阻塞20ms
 * @param {number} value 堵塞时间 单位ms 毫秒
 * @returns {Promise} 返回promise
 */
export function sleep(value = 30) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve()
		}, value)
	})
}
/**
 * @description 运行期判断平台
 * @returns {string} 返回所在平台(小写) 
 * @link 运行期判断平台 https://uniapp.dcloud.io/frame?id=判断平台
 */
export function os() {
	// #ifdef APP || H5 || MP-WEIXIN
	return uni.getDeviceInfo().platform.toLowerCase()
	// #endif
	// #ifndef APP || H5 || MP-WEIXIN
	return uni.getSystemInfoSync().platform.toLowerCase()
	// #endif
}
/**
 * @description 获取系统信息同步接口
 * @link 获取系统信息同步接口 https://uniapp.dcloud.io/api/system/info?id=getsysteminfosync 
 */
export function sys() {
	return uni.getSystemInfoSync()
}
export function getWindowInfo() {
	let ret = {}
	// #ifdef APP || H5 || MP-WEIXIN
	ret = uni.getWindowInfo()
	// #endif
	// #ifndef APP || H5 || MP-WEIXIN
	ret = sys()
	// #endif
	return ret
}
export function getDeviceInfo() {
	let ret = {}
	// #ifdef APP || H5 || MP-WEIXIN
	ret = uni.getDeviceInfo()
	// #endif
	// #ifndef APP || H5 || MP-WEIXIN
	ret = sys()
	// #endif
	return ret
}

/**
 * @description 取一个区间数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
export function random(min, max) {
	if (min >= 0 && max > 0 && max >= min) {
		const gab = max - min + 1
		return Math.floor(Math.random() * gab + min)
	}
	return 0
}

/**
 * @param {Number} len uuid的长度
 * @param {Boolean} firstU 将返回的首字母置为"u"
 * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
 */
export function guid(len = 32, firstU = true, radix = null) {
	const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
	const uuid = []
	radix = radix || chars.length

	if (len) {
		// 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
		for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
	} else {
		let r
		// rfc4122标准要求返回的uuid中,某些位为固定的字符
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
		uuid[14] = '4'

		for (let i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
			}
		}
	}
	// 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
	if (firstU) {
		uuid.shift()
		return `u${uuid.join('')}`
	}
	return uuid.join('')
}

/**
* @description 获取父组件的参数，因为支付宝小程序不支持provide/inject的写法
   this.$parent在非H5中，可以准确获取到父组件，但是在H5中，需要多次this.$parent.$parent.xxx
   这里默认值等于undefined有它的含义，因为最顶层元素(组件)的$parent就是undefined，意味着不传name
   值(默认为undefined)，就是查找最顶层的$parent
*  @param {string|undefined} name 父组件的参数名
*/
export function $parent(name = undefined) {
	let parent = this.$parent
	// 通过while历遍，这里主要是为了H5需要多层解析的问题
	while (parent) {
		// 父组件
        name = name.replace(/up-([a-zA-Z0-9-_]+)/g, 'u-$1')        
		if (parent.$options && parent.$options.name !== name) {
			// 如果组件的name不相等，继续上一级寻找
			parent = parent.$parent
		} else {
			return parent
		}
	}
	return false
}

/**
 * @description 样式转换
 * 对象转字符串，或者字符串转对象
 * @param {object | string} customStyle 需要转换的目标
 * @param {String} target 转换的目的，object-转为对象，string-转为字符串
 * @returns {object|string}
 */
export function addStyle(customStyle, target = 'object') {
	// 字符串转字符串，对象转对象情形，直接返回
	if (testEmpty(customStyle) || typeof(customStyle) === 'object' && target === 'object' || target === 'string' &&
		typeof(customStyle) === 'string') {
		return customStyle
	}
	// 字符串转对象
	if (target === 'object') {
		// 去除字符串样式中的两端空格(中间的空格不能去掉，比如padding: 20px 0如果去掉了就错了)，空格是无用的
		customStyle = trim(customStyle)
		// 根据";"将字符串转为数组形式
		const styleArray = customStyle.split(';')
		const style = {}
		// 历遍数组，拼接成对象
		for (let i = 0; i < styleArray.length; i++) {
			// 'font-size:20px;color:red;'，如此最后字符串有";"的话，会导致styleArray最后一个元素为空字符串，这里需要过滤
			if (styleArray[i]) {
				const item = styleArray[i].split(':')
				style[trim(item[0])] = trim(item[1])
			}
		}
		return style
	}
	// 这里为对象转字符串形式
	let string = ''
	if (typeof customStyle === 'object') {
		customStyle.forEach((val, i) => {
			// 驼峰转为中划线的形式，否则css内联样式，无法识别驼峰样式属性名
			const key = i.replace(/([A-Z])/g, '-$1').toLowerCase()
			string += `${key}:${val};`
		})
	}
	// 去除两端空格
	return trim(string)
}

/**
 * @description 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
 * @param {string|number} value 需要添加单位的值
 * @param {string} unit 添加的单位名 比如px
 */
export function addUnit(value = 'auto', unit = '') {
	if (!unit) {
		unit = config.unit || 'px'
	}
	if (unit == 'rpx' && testNumber(String(value))) {
		value = value * 2
	}
	value = String(value)
	// 用内置验证规则中的number判断是否为数值
	return testNumber(value) ? `${value}${unit}` : value
}

/**
 * @description 深度克隆
 * @param {object} obj 需要深度克隆的对象
 * @returns {*} 克隆后的对象或者原值（不是对象）
 */
export function deepClone(obj) {
	// 对常见的“非”值，直接返回原来值
	if ([null, undefined, NaN, false].includes(obj)) return obj
	if (typeof obj !== 'object' && typeof obj !== 'function') {
		// 原始类型直接返回
		return obj
	}
	const o = testArray(obj) ? [] : {}
	for (const i in obj) {
		if (obj.hasOwnProperty(i)) {
			o[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i]
		}
	}
	return o
}

/**
 * @description JS对象深度合并
 * @param {object} target 需要拷贝的对象
 * @param {object} source 拷贝的来源对象
 * @returns {object|boolean} 深度合并后的对象或者false（入参有不是对象）
 */
export function deepMerge(targetOrigin = {}, source = {}) {
	let target = deepClone(targetOrigin)
	if (typeof target !== 'object' || typeof source !== 'object') return false
	for (const prop in source) {
		if (!source.hasOwnProperty(prop)) continue
		if (prop in target) {
			if (source[prop] == null) {
				target[prop] = source[prop]
			}else if (typeof target[prop] !== 'object') {
				target[prop] = source[prop]
			} else if (typeof source[prop] !== 'object') {
				target[prop] = source[prop]
			} else if (target[prop].concat && source[prop].concat) {
				target[prop] = target[prop].concat(source[prop])
			} else {
				target[prop] = deepMerge(target[prop], source[prop])
			}
		} else {
			target[prop] = source[prop]
		}
	}
	return target
}
/**
 * @description JS对象深度合并
 * @param {object} target 需要拷贝的对象
 * @param {object} source 拷贝的来源对象
 * @returns {object|boolean} 深度合并后的对象或者false（入参有不是对象）
 */
export function shallowMerge(target, source = {}) {
	if (typeof target !== 'object' || typeof source !== 'object') return false
	for (const prop in source) {
		if (!source.hasOwnProperty(prop)) continue
		if (prop in target) {
			if (source[prop] == null) {
				target[prop] = source[prop]
			}else if (typeof target[prop] !== 'object') {
				target[prop] = source[prop]
			} else if (typeof source[prop] !== 'object') {
				target[prop] = source[prop]
			} else if (target[prop].concat && source[prop].concat) {
				target[prop] = target[prop].concat(source[prop])
			} else {
				target[prop] = shallowMerge(target[prop], source[prop])
			}
		} else {
			target[prop] = source[prop]
		}
	}
	return target
}

/**
 * @description error提示
 * @param {*} err 错误内容
 */
export function error(err) {
	// 开发环境才提示，生产环境不会提示
	if (process.env.NODE_ENV === 'development') {
		console.error(`uView提示：${err}`)
	}
}

/**
 * @description 打乱数组
 * @param {array} array 需要打乱的数组
 * @returns {array} 打乱后的数组
 */
export function randomArray(array = []) {
	// 原理是sort排序,Math.random()产生0<= x < 1之间的数,会导致x-0.05大于或者小于0
	return array.sort(() => Math.random() - 0.5)
}

// padStart 的 polyfill，因为某些机型或情况，还无法支持es7的padStart，比如电脑版的微信小程序
// 所以这里做一个兼容polyfill的兼容处理
if (!String.prototype.padStart) {
	// 为了方便表示这里 fillString 用了ES6 的默认参数，不影响理解
	String.prototype.padStart = function(maxLength, fillString = ' ') {
		if (Object.prototype.toString.call(fillString) !== '[object String]') {
			throw new TypeError(
				'fillString must be String'
			)
		}
		const str = this
		// 返回 String(str) 这里是为了使返回的值是字符串字面量，在控制台中更符合直觉
		if (str.length >= maxLength) return String(str)

		const fillLength = maxLength - str.length
		let times = Math.ceil(fillLength / fillString.length)
		while (times >>= 1) {
			fillString += fillString
			if (times === 1) {
				fillString += fillString
			}
		}
		return fillString.slice(0, fillLength) + str
	}
}

/**
 * @description 格式化时间
 * @param {String|Number} dateTime 需要格式化的时间戳
 * @param {String} fmt 格式化规则 yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合 默认yyyy-mm-dd
 * @returns {string} 返回格式化后的字符串
 */
export function timeFormat(dateTime = null, formatStr = 'yyyy-mm-dd') {
  let date
	// 若传入时间为假值，则取当前时间
  if (!dateTime) {
    date = new Date()
  }
  // 若为unix秒时间戳，则转为毫秒时间戳（逻辑有点奇怪，但不敢改，以保证历史兼容）
  else if (/^\d{10}$/.test(dateTime.toString().trim())) {
    date = new Date(dateTime * 1000)
  }
  // 若用户传入字符串格式时间戳，new Date无法解析，需做兼容
  else if (typeof dateTime === 'string' && /^\d+$/.test(dateTime.trim())) {
    date = new Date(Number(dateTime))
  }
  // 其他都认为符合 RFC 2822 规范
  else {
    // 处理平台性差异，在Safari/Webkit中，new Date仅支持/作为分割符的字符串时间
    date = new Date(
      typeof dateTime === 'string'
        ? dateTime.replace(/-/g, '/')
        : dateTime
    )
  }

	const timeSource = {
		'y': date.getFullYear().toString(), // 年
		'm': (date.getMonth() + 1).toString().padStart(2, '0'), // 月
		'd': date.getDate().toString().padStart(2, '0'), // 日
		'h': date.getHours().toString().padStart(2, '0'), // 时
		'M': date.getMinutes().toString().padStart(2, '0'), // 分
		's': date.getSeconds().toString().padStart(2, '0') // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	}

  for (const key in timeSource) {
    const [ret] = new RegExp(`${key}+`).exec(formatStr) || []
    if (ret) {
      // 年可能只需展示两位
      const beginIndex = key === 'y' && ret.length === 2 ? 2 : 0
      formatStr = formatStr.replace(ret, timeSource[key].slice(beginIndex))
    }
  }

  return formatStr
}

/**
 * @description 时间戳转为多久之前
 * @param {String|Number} timestamp 时间戳
 * @param {String|Boolean} format 
 * 格式化规则如果为时间格式字符串，超出一定时间范围，返回固定的时间格式；
 * 如果为布尔值false，无论什么时间，都返回多久以前的格式
 * @returns {string} 转化后的内容
 */
export function timeFrom(timestamp = null, format = 'yyyy-mm-dd') {
	if (timestamp == null) timestamp = Number(new Date())
	timestamp = parseInt(timestamp)
	// 判断用户输入的时间戳是秒还是毫秒,一般前端js获取的时间戳是毫秒(13位),后端传过来的为秒(10位)
	if (timestamp.toString().length == 10) timestamp *= 1000
	let timer = (new Date()).getTime() - timestamp
	timer = parseInt(timer / 1000)
	// 如果小于5分钟,则返回"刚刚",其他以此类推
	let tips = ''
	switch (true) {
		case timer < 300:
			tips = '刚刚'
			break
		case timer >= 300 && timer < 3600:
			tips = `${parseInt(timer / 60)}分钟前`
			break
		case timer >= 3600 && timer < 86400:
			tips = `${parseInt(timer / 3600)}小时前`
			break
		case timer >= 86400 && timer < 2592000:
			tips = `${parseInt(timer / 86400)}天前`
			break
		default:
			// 如果format为false，则无论什么时间戳，都显示xx之前
			if (format === false) {
				if (timer >= 2592000 && timer < 365 * 86400) {
					tips = `${parseInt(timer / (86400 * 30))}个月前`
				} else {
					tips = `${parseInt(timer / (86400 * 365))}年前`
				}
			} else {
				tips = timeFormat(timestamp, format)
			}
	}
	return tips
}

/**
 * @description 去除空格
 * @param String str 需要去除空格的字符串
 * @param String pos both(左右)|left|right|all 默认both
 */
export function trim(str, pos = 'both') {
	str = String(str)
	if (pos == 'both') {
		return str.replace(/^\s+|\s+$/g, '')
	}
	if (pos == 'left') {
		return str.replace(/^\s*/, '')
	}
	if (pos == 'right') {
		return str.replace(/(\s*$)/g, '')
	}
	if (pos == 'all') {
		return str.replace(/\s+/g, '')
	}
	return str
}

/**
 * @description 对象转url参数
 * @param {object} data,对象
 * @param {Boolean} isPrefix,是否自动加上"?"
 * @param {string} arrayFormat 规则 indices|brackets|repeat|comma
 */
export function queryParams(data = {}, isPrefix = true, arrayFormat = 'brackets') {
	const prefix = isPrefix ? '?' : ''
	const _result = []
	if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1) arrayFormat = 'brackets'
	for (const key in data) {
		const value = data[key]
		// 去掉为空的参数
		if (['', undefined, null].indexOf(value) >= 0) {
			continue
		}
		// 如果值为数组，另行处理
		if (value.constructor === Array) {
			// e.g. {ids: [1, 2, 3]}
			switch (arrayFormat) {
				case 'indices':
					// 结果: ids[0]=1&ids[1]=2&ids[2]=3
					for (let i = 0; i < value.length; i++) {
						_result.push(`${key}[${i}]=${value[i]}`)
					}
					break
				case 'brackets':
					// 结果: ids[]=1&ids[]=2&ids[]=3
					value.forEach((_value) => {
						_result.push(`${key}[]=${_value}`)
					})
					break
				case 'repeat':
					// 结果: ids=1&ids=2&ids=3
					value.forEach((_value) => {
						_result.push(`${key}=${_value}`)
					})
					break
				case 'comma':
					// 结果: ids=1,2,3
					let commaStr = ''
					value.forEach((_value) => {
						commaStr += (commaStr ? ',' : '') + _value
					})
					_result.push(`${key}=${commaStr}`)
					break
				default:
					value.forEach((_value) => {
						_result.push(`${key}[]=${_value}`)
					})
			}
		} else {
			_result.push(`${key}=${value}`)
		}
	}
	return _result.length ? prefix + _result.join('&') : ''
}

/**
 * 显示消息提示框
 * @param {String} title 提示的内容，长度与 icon 取值有关。
 * @param {Number} duration 提示的延迟时间，单位毫秒，默认：2000
 */
export function toast(title, duration = 2000) {
	uni.showToast({
		title: String(title),
		icon: 'none',
		duration
	})
}

/**
 * @description 根据主题type值,获取对应的图标
 * @param {String} type 主题名称,primary|info|error|warning|success
 * @param {boolean} fill 是否使用fill填充实体的图标
 */
export function type2icon(type = 'success', fill = false) {
	// 如果非预置值,默认为success
	if (['primary', 'info', 'error', 'warning', 'success'].indexOf(type) == -1) type = 'success'
	let iconName = ''
	// 目前(2019-12-12),info和primary使用同一个图标
	switch (type) {
		case 'primary':
			iconName = 'info-circle'
			break
		case 'info':
			iconName = 'info-circle'
			break
		case 'error':
			iconName = 'close-circle'
			break
		case 'warning':
			iconName = 'error-circle'
			break
		case 'success':
			iconName = 'checkmark-circle'
			break
		default:
			iconName = 'checkmark-circle'
	}
	// 是否是实体类型,加上-fill,在icon组件库中,实体的类名是后面加-fill的
	if (fill) iconName += '-fill'
	return iconName
}

/**
 * @description 数字格式化
 * @param {number|string} number 要格式化的数字
 * @param {number} decimals 保留几位小数
 * @param {string} decimalPoint 小数点符号
 * @param {string} thousandsSeparator 千分位符号
 * @returns {string} 格式化后的数字
 */
export function priceFormat(number, decimals = 0, decimalPoint = '.', thousandsSeparator = ',') {
	number = (`${number}`).replace(/[^0-9+-Ee.]/g, '')
	const n = !isFinite(+number) ? 0 : +number
	const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
	const sep = (typeof thousandsSeparator === 'undefined') ? ',' : thousandsSeparator
	const dec = (typeof decimalPoint === 'undefined') ? '.' : decimalPoint
	let s = ''

	s = (prec ? round(n, prec) + '' : `${Math.round(n)}`).split('.')
	const re = /(-?\d+)(\d{3})/
	while (re.test(s[0])) {
		s[0] = s[0].replace(re, `$1${sep}$2`)
	}
	
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || ''
		s[1] += new Array(prec - s[1].length + 1).join('0')
	}
	return s.join(dec)
}

/**
 * @description 获取duration值
 * 如果带有ms或者s直接返回，如果大于一定值，认为是ms单位，小于一定值，认为是s单位
 * 比如以30位阈值，那么300大于30，可以理解为用户想要的是300ms，而不是想花300s去执行一个动画
 * @param {String|number} value 比如: "1s"|"100ms"|1|100
 * @param {boolean} unit  提示: 如果是false 默认返回number
 * @return {string|number} 
 */
export function getDuration(value, unit = true) {
	const valueNum = parseInt(value)
	if (unit) {
		if (/s$/.test(value)) return value
		return value > 30 ? `${value}ms` : `${value}s`
	}
	if (/ms$/.test(value)) return valueNum
	if (/s$/.test(value)) return valueNum > 30 ? valueNum : valueNum * 1000
	return valueNum
}

/**
 * @description 日期的月或日补零操作
 * @param {String} value 需要补零的值
 */
export function padZero(value) {
	return `00${value}`.slice(-2)
}

/**
 * @description 在u-form的子组件内容发生变化，或者失去焦点时，尝试通知u-form执行校验方法
 * @param {*} instance
 * @param {*} event
 */
export function formValidate(instance, event) {
	const formItem = $parent.call(instance, 'u-form-item')
	const form = $parent.call(instance, 'u-form')
	// 如果发生变化的input或者textarea等，其父组件中有u-form-item或者u-form等，就执行form的validate方法
	// 同时将form-item的pros传递给form，让其进行精确对象验证
	if (formItem && form) {
		form.validateField(formItem.prop, () => {}, event)
	}
}

/**
 * @description 获取某个对象下的属性，用于通过类似'a.b.c'的形式去获取一个对象的的属性的形式
 * @param {object} obj 对象
 * @param {string} key 需要获取的属性字段
 * @returns {*}
 */
export function getProperty(obj, key) {
	if (typeof obj !== 'object' || null == obj) {
        return ''
    }
	if (typeof key !== 'string' || key === '') {
		return ''
	}
	if (key.indexOf('.') !== -1) {
		const keys = key.split('.')
		let firstObj = obj[keys[0]] || {}

		for (let i = 1; i < keys.length; i++) {
			if (firstObj) {
				firstObj = firstObj[keys[i]]
			}
		}
		return firstObj
	}
	return obj[key]
}

/**
 * @description 设置对象的属性值，如果'a.b.c'的形式进行设置
 * @param {object} obj 对象
 * @param {string} key 需要设置的属性
 * @param {string} value 设置的值
 */
export function setProperty(obj, key, value) {
	if (typeof obj !== 'object' || null == obj) {
		return
	}
	// 递归赋值
	const inFn = function(_obj, keys, v) {
		// 最后一个属性key
		if (keys.length === 1) {
			_obj[keys[0]] = v
			return
		}
		// 0~length-1个key
		while (keys.length > 1) {
			const k = keys[0]
			if (!_obj[k] || (typeof _obj[k] !== 'object')) {
				_obj[k] = {}
			}
			const key = keys.shift()
			// 自调用判断是否存在属性，不存在则自动创建对象
			inFn(_obj[k], keys, v)
		}
	}

	if (typeof key !== 'string' || key === '') {

	} else if (key.indexOf('.') !== -1) { // 支持多层级赋值操作
		const keys = key.split('.')
		inFn(obj, keys, value)
	} else {
		obj[key] = value
	}
}

/**
 * @description 获取当前页面路径
 */
export function page() {
	const pages = getCurrentPages()
	// 某些特殊情况下(比如页面进行redirectTo时的一些时机)，pages可能为空数组
	return `/${pages[pages.length - 1].route || ''}`
}

/**
 * @description 获取当前路由栈实例数组
 */
export function pages() {
	const pages = getCurrentPages()
	return pages
}

export function getValueByPath(obj, path) {
    // 将路径字符串按 '.' 分割成数组
    const pathArr = path.split('.');
    // 使用 reduce 方法从 obj 开始，逐级访问嵌套属性
    return pathArr.reduce((acc, curr) => {
        // 如果当前累加器（acc）是对象且包含当前键（curr），则返回该键对应的值
        // 否则返回 undefined（表示路径不存在）
        return acc && acc[curr] !== undefined ? acc[curr] : undefined;
    }, obj);
}

/**
 * 生成同色系浅色背景色
 * @param {string} textColor - 支持 #RGB、#RRGGBB、rgb()、rgba() 格式
 * @param {number} [lightness=85] - 目标亮度百分比（默认85%）
 * @returns {string} 十六进制颜色值
 */
export function genLightColor(textColor, lightness = 95) {
	// 手动解析颜色值（避免使用document）
	const rgb = parseColorWithoutDOM(textColor);
	
	// RGB转HSL色域
	const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
	
	// 生成浅色背景
	const bgHsl = {
	  h: hsl.h,
	  s: hsl.s,
	  l: Math.min(lightness, 95)
	};
	
	return hslToHex(bgHsl.h, bgHsl.s, bgHsl.l);
  }
  
  /* 手动解析颜色字符串（兼容uni-app环境） */
  function parseColorWithoutDOM(colorStr) {
	// 统一转小写处理
	const str = colorStr.toLowerCase().trim();
	
	// 处理十六进制格式
	if (str.startsWith('#')) {
	  const hex = str.replace('#', '');
	  const fullHex = hex.length === 3 ? 
		hex.split('').map(c => c + c).join('') : hex;
		
	  return {
		r: parseInt(fullHex.substring(0,2), 16),
		g: parseInt(fullHex.substring(2,4), 16),
		b: parseInt(fullHex.substring(4,6), 16)
	  };
	}
	
	// 处理rgb/rgba格式
	const rgbMatch = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
	if (rgbMatch) {
	  return {
		r: +rgbMatch[1],
		g: +rgbMatch[2],
		b: +rgbMatch[3]
	  };
	}
	
	throw new Error('Invalid color format');
  }

// 辅助函数：RGB 转 HSL（色相、饱和度、亮度）
function rgbToHsl(r, g, b) {
 r /= 255, g /= 255, b /= 255;
 const max = Math.max(r, g, b), min = Math.min(r, g, b);
 let h, s, l = (max + min) / 2;

 if (max === min) {
   h = s = 0; // achromatic
 } else {
   const d = max - min;
   s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
   switch (max) {
	 case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	 case g: h = (b - r) / d + 2; break;
	 case b: h = (r - g) / d + 4; break;
   }
   h = (h * 60).toFixed(1);
 }
 return { h: +h, s: +(s * 100).toFixed(1), l: +(l * 100).toFixed(1) };
}

// 辅助函数：HSL 转十六进制
function hslToHex(h, s, l) {
 l /= 100;
 const a = s * Math.min(l, 1 - l) / 100;
 const f = n => {
   const k = (n + h / 30) % 12;
   const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
   return Math.round(255 * color).toString(16).padStart(2, '0');
 };
 return `#${f(0)}${f(8)}${f(4)}`;
}

export default {
	range,
	getPx,
	sleep,
	os,
	sys,
	getWindowInfo,
	random,
	guid,
	$parent,
	addStyle,
	addUnit,
	deepClone,
	deepMerge,
    shallowMerge,
	error,
	randomArray,
	timeFormat,
	timeFrom,
	trim,
	queryParams,
	toast,
	type2icon,
	priceFormat,
	getDuration,
	padZero,
	formValidate,
	getProperty,
	setProperty,
	page,
	pages,
	getValueByPath,
	genLightColor
}
