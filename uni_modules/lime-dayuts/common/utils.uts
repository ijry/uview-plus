// @ts-nocheck
import { Dayuts } from './index'
import { M, Y, W, D, DATE, H, MIN, S, MS, Q } from './constant'
import {DayutsUnit} from '../utssdk/interface'
/**
 * 用指定字符串填充目标字符串的开头，以达到指定的总长度。
 *
 * @param {string} string - 需要填充的目标字符串。
 * @param {number} length - 填充后的总长度。
 * @param {string} pad - 用于填充的字符串。
 * @returns {string} 填充后的字符串。
 */
function padStart(string : string, length : number, pad : string) : string {
	const str = string//`${string}`
	if (str.length >= length) return str
	return str.padStart(length, pad) //`${Array((length + 1) - string.length).join(pad)}${string}`
}
export {
	padStart
}
function padZoneStr(instance : Dayuts) : string {
	const negMinutes = -instance.utcOffset()
	const minutes = Math.abs(negMinutes)
	const hourOffset = Math.floor(minutes / 60)
	const minuteOffset = minutes % 60
	return `${negMinutes <= 0 ? '+' : '-'}${padStart(hourOffset.toString(), 2, '0')}:${padStart(minuteOffset.toString(), 2, '0')}`
}
export {
	padZoneStr
}

// export function isNull(s): boolean{
// 	return s == null
// }

export function isNumber(value : any | null) : boolean {
	// #ifdef APP-ANDROID
	return ['Byte', 'UByte', 'Short', 'UShort', 'Int', 'UInt', 'Long', 'ULong', 'Float', 'Double', 'number'].includes(typeof value)
	// #endif
	// #ifdef APP-IOS
	return ['Int8', 'UInt8', 'Int16', 'UInt16', 'Int32', 'UInt32', 'Int64', 'UInt64', 'Int', 'UInt', 'Float', 'Float16', 'Float32', 'Float64', 'Double', 'number'].includes(typeof value)
	// #endif
	// #ifndef APP-ANDROID || APP-IOS
	return typeof value === 'number' && !isNaN(value);
	// #endif
}



/**
 * 将给定的时间单位转换为标准格式。
 *
 * @param {string} u - 要转换的时间单位。
 * @returns {string} 返回转换后的时间单位。
 */
export function prettyUnit(u : string) : DayutsUnit {
	const special = new Map<string, string>([
		['M', M],
		['y', Y],
		['w', W],
		['d', D],
		['D', DATE],
		['h', H],
		['m', MIN],
		['s', S],
		['ms', MS],
		['Q', Q]
	])
	return (special.get(u) ?? `${u}`.toLowerCase().replace(/s$/, '')) as DayutsUnit
}


/**
 * 计算两个日期之间的月份差值
 * @param {Dayjs} a - 第一个日期
 * @param {Dayjs} b - 第二个日期
 * @returns {number} 返回两个日期之间的月份差值
 */
export function monthDiff(a : Dayuts, b : Dayuts) : number {
	// 该函数来自 moment.js，以保持相同的结果
	if (a.date() < b.date()) return -monthDiff(b, a)
	const wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month())
	const anchor = a.clone().add(wholeMonthDiff, M).valueOf()
	const c = b.valueOf() - anchor < 0
	const anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), M).valueOf()
	// return +(-(wholeMonthDiff + ((b.valueOf() - anchor) / (c ? (anchor - anchor2) :
	// 	(anchor2 - anchor)))) || 0)
	
	const decimalMonthDiff = (b.valueOf() - anchor) / (c ? (anchor - anchor2) : (anchor2 - anchor));
	const result = wholeMonthDiff + decimalMonthDiff;
	const negatedResult = -result;
	const absResult = +negatedResult;
	const finalResult = !isNaN(absResult) ? absResult : 0;
	return finalResult;
}


/**
 * 返回向下取整的绝对值
 * @param {number} n - 输入的数字
 * @returns {number} 返回向下取整的绝对值
 */
export function absFloor(n : number):number {
	// return (n < 0 ? Math.ceil(n) || 0 : Math.floor(n))
	return (n < 0 ? Math.max(Math.ceil(n), 0) : Math.floor(n))
}