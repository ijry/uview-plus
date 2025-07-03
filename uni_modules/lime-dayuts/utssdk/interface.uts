// @ts-nocheck
export type DayutsConfig = {
	date: any|null
	format : string|null
	locale : string|null
}

export type DayutsUnit = 'year' | 'month' | 'day' | 'week' | 'date' | 'hour' | 'minute' | 'second' | 'millisecond' | 'quarter'

export type DayutsFormats = {
	/**
	 * 小时和分钟的格式化字符串。
	 */
	LT : string;

	/**
	 * 小时、分钟和秒的格式化字符串。
	 */
	LTS : string;

	/**
	 * 年份、月份和日期的格式化字符串。
	 */
	L : string;

	/**
	 * 年份、月份、日期和星期的格式化字符串。
	 */
	LL : string;

	/**
	 * 年份、月份、日期、星期和小时的格式化字符串。
	 */
	LLL : string;

	/**
	 * 年份、月份、日期、星期、小时和分钟的格式化字符串。
	 */
	LLLL : string;

	/**
	 * 缩小的年份、月份和日期的格式化字符串。
	 */
	l : string;

	/**
	 * 缩小的年份、月份、日期和星期的格式化字符串。
	 */
	ll : string;

	/**
	 * 缩小的年份、月份、日期、星期和小时的格式化字符串。
	 */
	lll : string;

	/**
	 * 缩小的年份、月份、日期、星期、小时和分钟的格式化字符串。
	 */
	llll : string;
}
export type DayutsRelativeTime = {
	/**
	 * 时间单位之后的格式化字符串。
	 */
	future : string;

	/**
	 * 时间单位之前的格式化字符串。
	 */
	past : string;

	/**
	 * 秒的格式化字符串。
	 */
	s : string;

	/**
	 * 分钟的格式化字符串。
	 */
	m : string;

	/**
	 * 分钟（带前缀）的格式化字符串。
	 */
	mm : string;

	/**
	 * 小时的格式化字符串。
	 */
	h : string;

	/**
	 * 小时（带前缀）的格式化字符串。
	 */
	hh : string;

	/**
	 * 天的格式化字符串。
	 */
	d : string;

	/**
	 * 天（带前缀）的格式化字符串。
	 */
	dd : string;

	/**
	 * 月的格式化字符串。
	 */
	M : string;

	/**
	 * 月（带前缀）的格式化字符串。
	 */
	MM : string;

	/**
	 * 年的格式化字符串。
	 */
	y : string;

	/**
	 * 年（带前缀）的格式化字符串。
	 */
	yy : string;
}

/**
 * 本地化对象接口。
 */
export type DayutsLocale = {
	/**
	 * 区域设置名称。
	 */
	name : string;

	/**
	 * 一周中每天的完整名称。
	 */
	weekdays : string[];

	/**
	 * 一周中每天的缩写名称。
	 */
	weekdaysShort ?: string[];

	/**
	 * 一周中每天的最小缩写名称。
	 */
	weekdaysMin ?: string[];

	/**
	 * 一年中的每个月份的名称。
	 */
	months : string[];

	/**
	 * 一年中的每个月份的缩写名称。
	 */
	monthsShort ?: string[];

	/**
	 * 返回序数词的函数。
	 *
	 * @param number - 要格式化的数字。
	 * @param period - 周期类型（如 "W" 表示周）。
	 * @returns 返回格式化后的序数词字符串。
	 */
	// ordinal : (number : number) => string;
	ordinal : (number : number, period : string) => string;

	/**
	 * 一周的开始日期（星期几）。
	 */
	weekStart ?: number;

	/**
	 * 年的开始月份。
	 */
	yearStart ?: number;

	/**
	 * 日期和时间格式化选项。
	 */
	formats ?: DayutsFormats;

	/**
	 * 相对时间格式化选项。
	 */
	relativeTime ?: DayutsRelativeTime;

	/**
	 * 根据小时和分钟返回上午或下午的函数。
	 *
	 * @param hour - 小时数（0-23）。
	 * @param minute - 分钟数（0-59）。
	 * @returns 返回上午或下午的字符串。
	 */
	meridiem ?: (hour : number, minute : number, isLowercase : boolean) => string;
}


export type DayutsObject = {
	years : number;
	months : number;
	date : number;
	hours : number;
	minutes : number;
	seconds : number;
	milliseconds : number;
}


// 主 Dayuts 类类型定义
// export interface Dayuts {
//     // 公共属性
//     $L: string;

//     // 私有属性
//     $d: Date;
//     $y: number;
//     $M: number;
//     $D: number;
//     $W: number;
//     $H: number;
//     $m: number;
//     $s: number;
//     $ms: number;
//     $u: boolean;

//     // 构造函数
//     // constructor(cfg: DayutsConfig);

//     // 解析配置并初始化日期
//     // private parse(cfg: DayutsConfig): void;

//     // 初始化日期的各个部分
//     // private init(): void;

//     // 检查日期是否有效
//     isValid(): boolean;

//     // 判断当前日期是否与给定日期在指定时间单位内相同
//     // isSame(input: string, units?: DayutsUnit): boolean;
//     // isSame(input: number, units?: DayutsUnit): boolean;
//     // isSame(input: Date, units?: DayutsUnit): boolean;
//     // isSame(input: Dayuts, units?: DayutsUnit): boolean;
//     // isSame(input: UTSJSONObject, units?: DayutsUnit): boolean;
// 	// isSame(input : string) : boolean
// 	// isSame(input : number) : boolean
// 	// isSame(input : Date) : boolean
// 	// isSame(input : Dayuts) : boolean
// 	// isSame(input : UTSJSONObject) : boolean
	
// 	// isSame(input : string, units : DayutsUnit) : boolean
// 	// isSame(input : number, units : DayutsUnit) : boolean
// 	// isSame(input : Date, units : DayutsUnit) : boolean
// 	// isSame(input : Dayuts, units : DayutsUnit) : boolean
// 	// isSame(input : UTSJSONObject, units : DayutsUnit) : boolean
// 	// isSame(input : any, units : DayutsUnit) : boolean
	
//     // 判断给定日期是否在当前日期指定时间单位之后
//     // isAfter(input: string, units?: DayutsUnit): boolean;
//     // isAfter(input: number, units?: DayutsUnit): boolean;
//     // isAfter(input: Date, units?: DayutsUnit): boolean;
//     // isAfter(input: Dayuts, units?: DayutsUnit): boolean;
//     // isAfter(input: UTSJSONObject, units?: DayutsUnit): boolean;
// 	// isAfter(input : string) : boolean
// 	// isAfter(input : number) : boolean
// 	// isAfter(input : Date) : boolean
// 	// isAfter(input : Dayuts) : boolean
// 	// isAfter(input : UTSJSONObject) : boolean
	
// 	// isAfter(input : string, units : DayutsUnit) : boolean
// 	// isAfter(input : number, units : DayutsUnit) : boolean
// 	// isAfter(input : Date, units : DayutsUnit) : boolean
// 	// isAfter(input : Dayuts, units : DayutsUnit) : boolean
// 	// isAfter(input : UTSJSONObject, units : DayutsUnit) : boolean
// 	// isAfter(input : any, units : DayutsUnit) : boolean

//     // 判断给定日期是否在当前日期指定时间单位之前
//     // isBefore(input: string, units?: DayutsUnit): boolean;
//     // isBefore(input: number, units?: DayutsUnit): boolean;
//     // isBefore(input: Date, units?: DayutsUnit): boolean;
//     // isBefore(input: Dayuts, units?: DayutsUnit): boolean;
//     // isBefore(input: UTSJSONObject, units?: DayutsUnit): boolean;

//     // 判断当前日期是否与给定日期在指定时间单位内相同或之前
//     // isSameOrBefore(input: string, units?: DayutsUnit): boolean;
//     // isSameOrBefore(input: number, units?: DayutsUnit): boolean;
//     // isSameOrBefore(input: Date, units?: DayutsUnit): boolean;
//     // isSameOrBefore(input: Dayuts, units?: DayutsUnit): boolean;
//     // isSameOrBefore(input: UTSJSONObject, units?: DayutsUnit): boolean;

//     // 判断当前日期是否与给定日期在指定时间单位内相同或之后
//     // isSameOrAfter(input: string, units?: DayutsUnit): boolean;
//     // isSameOrAfter(input: number, units?: DayutsUnit): boolean;
//     // isSameOrAfter(input: Date, units?: DayutsUnit): boolean;
//     // isSameOrAfter(input: Dayuts, units?: DayutsUnit): boolean;
//     // isSameOrAfter(input: UTSJSONObject, units?: DayutsUnit): boolean;

//     // 判断当前日期是否在两个给定日期之间
//     // isBetween(input: any, input2: any): boolean;
//     // isBetween(input: any, input2: any, units?: DayutsUnit, interval?: string): boolean;

//     // 判断当前年份是否为闰年
//     isLeapYear(): boolean;

//     // 判断当前日期是否为今天
//     isToday(): boolean;

//     // 获取 Unix 时间戳（秒）
//     unix(): number;

//     // 设置为指定时间单位的开始或结束
//     // startOf(units: DayutsUnit): Dayuts;
//     // startOf(units: DayutsUnit, startOf?: boolean): Dayuts;
//     endOf(units: DayutsUnit): Dayuts;

//     // 设置指定时间单位的值
//     set(units: DayutsUnit, int: number): Dayuts;

//     // 获取指定时间单位的值
//     get(units: DayutsUnit): number;

//     // 年、月、日、时、分、秒、毫秒的 getter 和 setter 方法
//     year(): number;
//     year(input?: number): Dayuts;
//     month(): number
//     month(input?: number): Dayuts;
//     // day(): number;
//     day(input?: number): Dayuts;
//     date(): number;
//     date(input?: number): Dayuts;
//     // hour(): number;
//     hour(input?: number): Dayuts;
//     // minute(): number;
//     minute(input?: number): Dayuts;
//     // second(): number;
//     second(input?: number): Dayuts;
//     // millisecond(): number;
//     millisecond(input?: number): Dayuts;

//     // 添加时间
//     add(number: number, units: DayutsUnit): Dayuts;

//     // 减去时间
//     subtract(number: number, units: DayutsUnit): Dayuts;

//     // 格式化日期
//     format(formatStr?: string): string;

//     // 获取 UTC 偏移量（分钟）
//     utcOffset(): number;

//     // 计算两个日期之间的差值
//     diff(input: string, units?: DayutsUnit, float?: boolean): number;
//     diff(input: number, units?: DayutsUnit, float?: boolean): number;
//     diff(input: Date, units?: DayutsUnit, float?: boolean): number;
//     diff(input: Dayuts, units?: DayutsUnit, float?: boolean): number;
//     diff(input: UTSJSONObject, units?: DayutsUnit, float?: boolean): number;

//     // 转换为原生 Date 对象
//     toDate(): Date;

//     // 转换为 ISO 8601 字符串
//     toJSON(): string | null;
//     toISOString(): string;

//     // 转换为对象
//     toObject(): DayutsObject;

//     // 转换为数组
//     toArray(): number[];

//     // 获取时间戳（毫秒）
//     valueOf(): number;

//     // 获取月份的天数
//     daysInMonth(): number;

//     // 获取本地化对象
//     // private $locale(): DayutsLocale;

//     // 设置或获取本地化配置
//     locale(preset: string, object?: DayutsLocale): Dayuts;
//     locale(preset: DayutsLocale, object?: DayutsLocale): Dayuts;

//     // 克隆当前实例
//     clone(): Dayuts;

//     // 转换为字符串
//     // toString(): string;

//     // 获取或设置一年中的第几天
//     dayOfYear(): number;
//     dayOfYear(input?: number): Dayuts;

//     // 相对时间方法
//     fromToBase(input: any, withoutSuffix: boolean, instance: Dayuts, isFrom: boolean): string;
//     to(input: any, withoutSuffix?: boolean): string;
//     from(input: any, withoutSuffix?: boolean): string;
//     toNow(withoutSuffix?: boolean): string;
//     fromNow(withoutSuffix?: boolean): string;
// }