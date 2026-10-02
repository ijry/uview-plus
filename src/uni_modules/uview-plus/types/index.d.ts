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
		 * 是否由运行时主题同步原生导航栏、页面背景、tabBar等全局UI。
		 * 默认关闭，避免升级后覆盖项目已有 pages.json/theme.json 全局样式。
		 * @default false
		 */
		nativeThemeSync: boolean;
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
		},
		themeMode?: 'light' | 'dark'
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
		borderColor: string,
		bgColor?: string,
		disabledColor?: string
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
		theme: {
			preference: 'system' | 'light' | 'dark';
			mode: 'light' | 'dark';
			version: number;
			vars: Record<string, string>;
		};
		setTheme: (mode?: 'light' | 'dark') => void;
		setThemePreference: (mode?: 'system' | 'light' | 'dark') => void;
		getThemePreference: () => 'system' | 'light' | 'dark';
		getSystemTheme: () => 'light' | 'dark';
		getThemeVars: (mode?: 'light' | 'dark') => Record<string, string>;
		/**
		 * 调用Root根组件中的全局Toast（内部封装了up-toast）
		 * - 传字符串时等价于 { message: 'xxx' }
		 */
		rootToast: (options: string | {
			message?: string;
			title?: string;
			duration?: number;
			[key: string]: any;
		}) => void;
		/** @internal Root根组件用于注册全局Toast引用 */
		setRootToastRef: (ref?: any) => void;
		/**
		 * 调用Root根组件中的全局Notify（内部封装了up-notify）
		 * - 传字符串时等价于 { message: 'xxx' }
		 */
		rootNotify: (options: string | {
			message?: string;
			title?: string;
			duration?: number;
			type?: 'primary' | 'success' | 'warning' | 'error';
			[key: string]: any;
		}) => void;
		/** @internal Root根组件用于注册全局Notify引用 */
		setRootNotifyRef: (ref?: any) => void;
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
	export const upGetRect: $u['upGetRect']
	export const upCreateIntersectionObserver: $u['upCreateIntersectionObserver']
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

	// ---- 组件类型：与 types/comps/*.d.ts 同步，勿手工增删 ----
	export type ActionSheetProps = import('./comps/actionSheet')['ActionSheetProps']
	export type AlbumProps = import('./comps/album')['AlbumProps']
	export type AlertProps = import('./comps/alert')['AlertProps']
	export type AvatarProps = import('./comps/avatar')['AvatarProps']
	export type AvatarGroupProps = import('./comps/avatarGroup')['AvatarGroupProps']
	export type BackTopProps = import('./comps/backTop')['BackTopProps']
	export type BackTopSlots = import('./comps/backTop')['BackTopSlots']
	export type BadgeProps = import('./comps/badge')['BadgeProps']
	export type ButtonProps = import('./comps/button')['ButtonProps']
	export type CalendarProps = import('./comps/calendar')['CalendarProps']
	export type CalendarRef = typeof import('./comps/calendar')['CalendarRef']
	export type CalendarStripPayload = import('./comps/calendarStrip')['CalendarStripPayload']
	export type CalendarStripProps = import('./comps/calendarStrip')['CalendarStripProps']
	export type CalendarStripRef = typeof import('./comps/calendarStrip')['CalendarStripRef']
	export type CellProps = import('./comps/cell')['CellProps']
	export type CellSlots = import('./comps/cell')['CellSlots']
	export type CellGroupProps = import('./comps/cellGroup')['CellGroupProps']
	export type CheckboxProps = import('./comps/checkbox')['CheckboxProps']
	export type CheckboxSlots = import('./comps/checkbox')['CheckboxSlots']
	export type CheckboxGroupProps = import('./comps/checkboxGroup')['CheckboxGroupProps']
	export type CodeProps = import('./comps/code')['CodeProps']
	export type CodeRef = typeof import('./comps/code')['CodeRef']
	export type CodeInputProps = import('./comps/codeInput')['CodeInputProps']
	export type ColProps = import('./comps/col')['ColProps']
	export type CollapseProps = import('./comps/collapse')['CollapseProps']
	export type CollapseRef = typeof import('./comps/collapse')['CollapseRef']
	export type CollapseItemProps = import('./comps/collapseItem')['CollapseItemProps']
	export type CollapseItemSlots = import('./comps/collapseItem')['CollapseItemSlots']
	export type CountDownProps = import('./comps/countDown')['CountDownProps']
	export type CountDownRef = typeof import('./comps/countDown')['CountDownRef']
	export type CountToProps = import('./comps/countTo')['CountToProps']
	export type CountToRef = typeof import('./comps/countTo')['CountToRef']
	export type DatetimePickerProps = import('./comps/datetimePicker')['DatetimePickerProps']
	export type DatetimePickerRef = typeof import('./comps/datetimePicker')['DatetimePickerRef']
	export type DividerProps = import('./comps/divider')['DividerProps']
	export type EmptyProps = import('./comps/empty')['EmptyProps']
	export type EmptySlots = import('./comps/empty')['EmptySlots']
	export type FormProps = import('./comps/form')['FormProps']
	export type FormRef = typeof import('./comps/form')['FormRef']
	export type FormItemProps = import('./comps/formItem')['FormItemProps']
	export type FormItemSlots = import('./comps/formItem')['FormItemSlots']
	export type GapProps = import('./comps/gap')['GapProps']
	export type GridProps = import('./comps/grid')['GridProps']
	export type GridItemProps = import('./comps/gridItem')['GridItemProps']
	export type GuideItem = import('./comps/guide')['GuideItem']
	export type GuideProps = import('./comps/guide')['GuideProps']
	export type GuideRef = typeof import('./comps/guide')['GuideRef']
	export type IconProps = import('./comps/icon')['IconProps']
	export type ImageProps = import('./comps/image')['ImageProps']
	export type ImageSlots = import('./comps/image')['ImageSlots']
	export type IndexAnchorProps = import('./comps/indexAnchor')['IndexAnchorProps']
	export type IndexItemSlots = import('./comps/indexItem')['IndexItemSlots']
	export type IndexListProps = import('./comps/indexList')['IndexListProps']
	export type InputProps = import('./comps/input')['InputProps']
	export type InputSlots = import('./comps/input')['InputSlots']
	export type InputRef = typeof import('./comps/input')['InputRef']
	export type KeyboardProps = import('./comps/keyboard')['KeyboardProps']
	export type KeyboardSlots = import('./comps/keyboard')['KeyboardSlots']
	export type LineProps = import('./comps/line')['LineProps']
	export type LineProgressProps = import('./comps/lineProgress')['LineProgressProps']
	export type LineProgressSlots = import('./comps/lineProgress')['LineProgressSlots']
	export type LinkProps = import('./comps/link')['LinkProps']
	export type LinkSlots = import('./comps/link')['LinkSlots']
	export type ListProps = import('./comps/list')['ListProps']
	export type ListItemProps = import('./comps/listItem')['ListItemProps']
	export type LoadMoreProps = import('./comps/loadMore')['LoadMoreProps']
	export type LoadingIconProps = import('./comps/loadingIcon')['LoadingIconProps']
	export type LoadingPageProps = import('./comps/loadingPage')['LoadingPageProps']
	export type ModalProps = import('./comps/modal')['ModalProps']
	export type ModalSlots = import('./comps/modal')['ModalSlots']
	export type NavbarProps = import('./comps/navbar')['NavbarProps']
	export type NavbarSlots = import('./comps/navbar')['NavbarSlots']
	export type NoNetworkProps = import('./comps/noNetwork')['NoNetworkProps']
	export type NoticeBarProps = import('./comps/noticeBar')['NoticeBarProps']
	export type NotifyProps = import('./comps/notify')['NotifyProps']
	export type NotifySlots = import('./comps/notify')['NotifySlots']
	export type NotifyRef = typeof import('./comps/notify')['NotifyRef']
	export type NumberBoxProps = import('./comps/numberBox')['NumberBoxProps']
	export type NumberBoxSlots = import('./comps/numberBox')['NumberBoxSlots']
	export type OverlayProps = import('./comps/overlay')['OverlayProps']
	export type OverlaySlots = import('./comps/overlay')['OverlaySlots']
	export type ParseProps = import('./comps/parse')['ParseProps']
	export type PickerProps = import('./comps/picker')['PickerProps']
	export type PickerRef = typeof import('./comps/picker')['PickerRef']
	export type PopupProps = import('./comps/popup')['PopupProps']
	export type PopupSlots = import('./comps/popup')['PopupSlots']
	export type QrcodeProps = import('./comps/qrcode')['QrcodeProps']
	export type RadioProps = import('./comps/radio')['RadioProps']
	export type RadioSlots = import('./comps/radio')['RadioSlots']
	export type RadioGroupProps = import('./comps/radioGroup')['RadioGroupProps']
	export type RateProps = import('./comps/rate')['RateProps']
	export type ReadMoreProps = import('./comps/readMore')['ReadMoreProps']
	export type ReadMoreRef = typeof import('./comps/readMore')['ReadMoreRef']
	export type RowProps = import('./comps/row')['RowProps']
	export type SafeBottomProps = import('./comps/safeBottom')['SafeBottomProps']
	export type ScrollListProps = import('./comps/scrollList')['ScrollListProps']
	export type SearchProps = import('./comps/search')['SearchProps']
	export type SearchSlots = import('./comps/search')['SearchSlots']
	export type SkeletonProps = import('./comps/skeleton')['SkeletonProps']
	export type SliderProps = import('./comps/slider')['SliderProps']
	export type StatusBarProps = import('./comps/statusBar')['StatusBarProps']
	export type StepsProps = import('./comps/steps')['StepsProps']
	export type StepsItemProps = import('./comps/stepsItem')['StepsItemProps']
	export type StepsItemSlots = import('./comps/stepsItem')['StepsItemSlots']
	export type StickyProps = import('./comps/sticky')['StickyProps']
	export type StickySlots = import('./comps/sticky')['StickySlots']
	export type SubsectionProps = import('./comps/subsection')['SubsectionProps']
	export type SwipeActionProps = import('./comps/swipeAction')['SwipeActionProps']
	export type SwipeActionItemProps = import('./comps/swipeActionItem')['SwipeActionItemProps']
	export type SwiperProps = import('./comps/swiper')['SwiperProps']
	export type SwiperIndicatorProps = import('./comps/swiperIndicator')['SwiperIndicatorProps']
	export type SwitchProps = import('./comps/switch')['SwitchProps']
	export type TabbarProps = import('./comps/tabbar')['TabbarProps']
	export type TabbarItemProps = import('./comps/tabbarItem')['TabbarItemProps']
	export type TabsProps = import('./comps/tabs')['TabsProps']
	export type TagProps = import('./comps/tag')['TagProps']
	export type TextProps = import('./comps/text')['TextProps']
	export type TextareaProps = import('./comps/textarea')['TextareaProps']
	export type TextareaRef = typeof import('./comps/textarea')['TextareaRef']
	export type ToastProps = import('./comps/toast')['ToastProps']
	export type ToastRef = typeof import('./comps/toast')['ToastRef']
	export type TooltipProps = import('./comps/tooltip')['TooltipProps']
	export type TransitionProps = import('./comps/transition')['TransitionProps']
	export type UploadProps = import('./comps/upload')['UploadProps']
	export type UploadSlots = import('./comps/upload')['UploadSlots']
	export type UploadRef = typeof import('./comps/upload')['UploadRef']
	// ---- 组件类型结束 ----

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
declare type UniCalendarStripRef = typeof import('./comps/calendarStrip')['CalendarStripRef']
declare type UniTextareaRef = typeof import('./comps/textarea')['TextareaRef']
declare type UniFormRef = typeof import('./comps/form')['FormRef']
declare type UniGuideRef = typeof import('./comps/guide')['GuideRef']
