/// <reference path="./comps.d.ts" />
declare module 'uview-plus' {
	export function install(): void  //必要
	interface test {
		/** 邮箱格式校验 */
		email(email: string): boolean
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
	interface RouteParam {
		type: 'navigateTo' | 'redirect' | 'switchTab' | 'reLaunch' | 'navigateBack';
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
	interface Config {
		v: string;
		version: string;
		color: Partial<Color>;
		unit: 'px' | 'rpx'
	}
	interface Color {
		primary: string,
		info: string,
		default: string,
		warning: string,
		error: string,
		success: string,
		mainColor: string,
		contentColor: string,
		tipsColor: string,
		lightColor: string,
		borderColor: string
	}
	interface GlobalConfig {
		config: Partial<Config>;
		props: {};
	}
	interface $u {
		route: (url: string | RouteParam) => void;
		/**
		  * 求两个颜色之间的渐变值
		  * @param {string} startColor 开始的颜色
		  * @param {string} endColor 结束的颜色
		  * @param {number} step 颜色等分的份额
		  */
		colorGradient: (startColor: string, endColor: string, step: number) => any[];
		/**
		 * 将hex表示方式转换为rgb
		 * @param color "#000000"-> "rgb(0,0,0)" | "rgb(0,0,0)" -> "#000000"
		 * @param str 是否返回颜色数组 true -> 不返回
		 * @returns 
		 */
		hexToRgb: (color: string, str?: boolean) => any[];
		/**
		 * 将rgb表示方式转换为hex
		 */
		rgbToHex: (color: string) => string;
		/**
		 * 十六进制转换为rgb或rgba
		 * @param color 
		 * @param alpha 透明度
		 * @returns  rgba（255，255，255，0.5）字符串
		 */
		colorToRgba: (color: string, alpha: number) => string;
		test: test;
		type: {},
		http: {},
		config: Config;
		zIndex: {
			toast: number;
			noNetwork: number;
			// popup包含popup，actionsheet，keyboard，picker的值
			popup: number;
			mask: number;
			navbar: number;
			topTips: number;
			sticky: number;
			indexListSticky: number;
		},
		debounce: (func, wait, immediate) => void;
		throttle: (func, wait, immediate) => void;
		mixin: {},
		mpMixin: {},
		props: {},
		color: Color;
		platform: string;
	}

	export function setConfig(config: Partial<GlobalConfig>): void;

	global {
		interface Uni {
			$u: $u
		}
	}
}
declare type UniCountDownRef = typeof import('./comps/countDown')['CountDownRef']
declare type UniCountToRef = typeof import('./comps/countTo')['CountToRef']
declare type UniReadMoreRef = typeof import('./comps/readMore')['ReadMoreRef']
declare type UniToastRef = typeof import('./comps/toast')['ToastRef']
declare type UniCollapseRef = typeof import('./comps/collapse')['CollapseRef']
declare type UniNotifyRef = typeof import('./comps/notify')['NotifyRef']
declare type UniCodeRef = typeof import('./comps/code')['CodeRef']
declare type UniInputRef = typeof import('./comps/input')['InputRef']
declare type UniUploadRef = typeof import('./comps/upload')['UploadRef']
declare type UniDatetimePickerRef = typeof import('./comps/datetimePicker')['DatetimePickerRef']
declare type UniPickerRef = typeof import('./comps/picker')['PickerRef']
declare type UniCalendarRef = typeof import('./comps/calendar')['CalendarRef']
declare type UniTextareaRef = typeof import('./comps/textarea')['TextareaRef']
declare type UniFormRef = typeof import('./comps/form')['FormRef']
