// 浮点数加法
import { divide } from './digit.js'
export function add (arg1, arg2) {
	var r1, r2, m
		try {
			r1 = arg1.toString().split('.')[1].length
		} catch (e) {
			r1 = 0
		}
		try {
			r2 = arg2.toString().split('.')[1].length
		} catch (e) {
			r2 = 0
		}
		m = Math.pow(10, Math.max(r1, r2))
	return (arg1 * m + arg2 * m) / m
}
// 浮点数减法
export function sub (arg1, arg2) {
	var r1, r2, m, n
		try {
		  r1 = arg1.toString().split('.')[1].length
		} catch (e) {
		  r1 = 0
		}
		try {
		  r2 = arg2.toString().split('.')[1].length
		} catch (e) {
		  r2 = 0
		}
		m = Math.pow(10, Math.max(r1, r2))
		n = (r1 >= r2) ? r1 : r2
	return Math.abs(((arg1 * m - arg2 * m) / m).toFixed(n))
}
//浮点乘法
export function mul (a, b) {
	var c = 0,
		d = a.toString(),
		e = b.toString();
	try {
		c += d.split(".")[1].length;
	} catch (f) {}
	try {
		c += e.split(".")[1].length;
	} catch (f) {}
	return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
// 浮点除法
export function div (a, b) {
	return divide(a, b);
}
export default {
	add,
	sub,
	mul,
	div
}
