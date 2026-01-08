/// <reference path="./comps.d.ts" />
type Func = import('./func').Func
declare module 'uview-plus' {
  export function install(
    vm: import('vue').App,
    upuiParams?: () => {
      httpIns?: (http: HttpRequest) => void;
      options?: Partial<GlobalConfig>;
    }
  ): void; //必要
	type test = import('./func').test
	type RouteParam = import('./func').RouteParam
	type HttpRequest = InstanceType<typeof import('../libs/luch-request')['default']>
	interface Config {
		v: string;
		version: string;
		color: Partial<Color>;
		/**
		 * - 修改默认单位，相当于执行 uni.$u.config.unit = 'rpx'
		 * - 组件的很多单位仍然为px并非配置不生效，而是rpx配置目前无法做到修改Vue单文件组件中的Css/Sass中写死的px单位。
		 * - 这个配置主要用于prop传参时的单位修改，比如<up-image width="80"></up-image>中的80会是rpx单位。
		 * - 如果需要全局组件样式变为rpx，可以尝试使用postcss等第三方插件转换。
		 * @default 'px'
		 */
		unit: 'px' | 'rpx';
		/** 
		 * 只加载一次字体图标
		 * @default false
		 */
		loadFontOnce: boolean;
		/** 
		 * 扩充自定义字体图标
		 * @version 3.4.14
		 */
		customIcon: {
			/** 字体族名称 */
			family: string;
			/** ttf文件远程链接 */
			url: string;
		};
		/** 
		 * unicode映射表，为了更直观书写，语义更明确
		 * - 如'light-mode': '\ue66c'
		 * - <up-icon customPrefix="xyicon" name="light-mode"></up-icon>
		 */
		customIcons: {
			[key: string]: string
		}
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
	interface $u extends Func {
		test: test;
		type: {},
		http: HttpRequest,
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
		mixin: {},
		mpMixin: {},
		props: {},
		color: Color;
		platform: string;
	}

	export function setConfig(config: Partial<GlobalConfig>): void;
	// 可单独导入使用,也可以在 uni.$u 中使用
	export const test: $u['test']
	export const http: $u['http']
	export const config: $u['config']
	export const platform: $u['platform']
	export const range: $u['range']
	export const getPx: $u['getPx']
	export const rpx2px: $u['rpx2px']
	export const sleep: $u['sleep']
	export const os: $u['os']
	export const sys: $u['sys']
	export const random: $u['random']
	export const guid: $u['guid']
	export const addStyle: $u['addStyle']
	export const addUnit: $u['addUnit']
	export const timeFormat: $u['timeFormat']
	export const timeFrom: $u['timeFrom']
	export const trim: $u['trim']
	export const queryParams: $u['queryParams']
	export const toast: $u['toast']
	export const priceFormat: $u['priceFormat']
	export const genLightColor: $u['genLightColor']
	export const debounce: $u['debounce']
	export const throttle: $u['throttle']
	export const colorGradient: $u['colorGradient']
	export const hexToRgb: $u['hexToRgb']
	export const rgbToHex: $u['rgbToHex']
	export const colorToRgba: $u['colorToRgba']
	export const route: $u['route']

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
