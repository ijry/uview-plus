# lime-dayuts 日期库
- lime-dayuts 是dayjs的uts版，一个轻量的处理时间和日期的 UTS 库，几乎和dayjs保持一样的API


## 安装
- 导入插件即可


## 使用
```ts
import {dayuts} from '@/uni_modules/lime-dayuts';
dayuts().format() // 2024-03-25T02:10:16+08:00
```


## 解析
接受	`string`、`number`、`Date`、`Dayuts`等值传入，返回

### 当前时间
空值 `dayuts()` 将返回一个包含当前日期和时间的 `Dayuts` 对象。

```ts
dayuts()
```

### 字符串

```ts
dayuts('2024-03-04T16:00:00.000Z')
dayuts('2024-03-13 19:18:17.040+02:00')
dayuts('2024-03-13 19:18')
```

### 字符串+格式

```ts
dayuts('1970-00-00', 'YYYY-MM-DD')
```
#### 支持的解析占位符列表

| 输入  | 示例          | 描述                       |
| ------ | ---------------- | --------------------------------- |
| `YY`   | 01               | 两位数的年份                    |
| `YYYY` | 2001             | 四位数的年份                   |
| `M`    | 1-12             | 月份，从1开始计数             |
| `MM`   | 01-12            | 月份，两位数                   |
| `MMM`  | Jan-Dec         | 缩写的月份名称                  |
| `MMMM` | January-December       | 完整的月份名称                 |
| `D`    | 1-31             | 一个月的某一天                  |
| `DD`   | 01-31            | 一个月的某一天，两位数          |
| `H`    | 0-23             | 小时数                         |
| `HH`   | 00-23            | 小时数，两位数                   |
| `h`    | 1-12             | 12小时制的小时数                |
| `hh`   | 01-12            | 12小时制的小时数，两位数        |
| `m`    | 0-59             | 分钟数                         |
| `mm`   | 00-59            | 分钟数，两位数                 |
| `s`    | 0-59             | 秒数                           |
| `ss`   | 00-59            | 秒数，两位数                   |
| `S`    | 0-9              | 百毫秒数，一位数               |
| `SS`   | 00-99            | 十毫秒数，两位数               |
| `SSS`  | 000-999          | 毫秒数，三位数                  |
| `Z`    | -05:00           | 相对于UTC的偏移量               |
| `ZZ`   | -0500            | 相对UTC的紧凑偏移量，两位数     |
| `A`    | AM PM         | 上午或下午，大写字母           |
| `a`    | am pm         | 上午或下午，小写字母           |


### Unix 时间戳 (毫秒)

```ts
dayuts(1318781876406)
```

### Date 对象

```ts
dayuts(new Date(2018, 8, 18))
```

### 数组

```ts
dayuts([2010, 1, 14, 15, 25, 50, 125]);
```

## 取值/赋值
在设计上 Dayuts 的 getter 和 setter 使用了相同的 API，也就是说，不传参数调用方法即为 getter，调用并传入参数为 setter。


### 毫秒 Millisecond
获取或设置毫秒。传入0到999的数字。 如果超出这个范围，它会进位到秒。
```ts
dayuts().millisecond() // gets current millisecond
dayuts().millisecond(1) // returns new dayuts
```

### 秒 Second
获取或设置秒。传入0到59的数字。 如果超出这个范围，它会进位到分钟。
```ts
dayuts().second() // gets current second
dayuts().second(1) // returns new dayuts
```

### 分 Minute
获取或设置分钟。传入0到59的数字。 如果超出这个范围，它会进位到小时。
```ts
dayuts().minute() // gets current minute
dayuts().minute(1) // returns new dayuts
```

### 时 Hour
获取或设置小时。传入0到23的数字。 如果超出这个范围，它会进位到天数。
```ts
dayuts().hour() // gets current hour
dayuts().hour(12) // returns new dayuts
```

### 一个月中的第几天 Date of Month 
获取或设置一个月中的某一天。接受从1到31的数字。如果超出范围，它将溢出到月份
```ts
dayuts().date() // gets current date
dayuts().date(12) // returns new dayuts
```

### 一周中的第几天 Day of Week 
获取或设置一周中的某一天。接受从0（星期日）到6（星期六）的数字。如果超出范围，它将溢出到其他周
```ts
dayuts().day() // gets current day
dayuts().day(0) // returns new dayuts
```


### 一年的第几天 Day of Year 
获取或设置年份里第几天。传入1到366的数字。如果超出这个范围，它会进位到下一年。
```ts
dayuts().dayOfYear() 
dayuts().dayOfYear(365) // returns new dayuts
```

### 月 Month
获取或设置月份。传入0到11的 number。 如果超出这个范围，它会进位到年份。
```ts
dayuts().month() // gets current month
dayuts().month(0) // returns new dayuts
```

### 年 Year
获取或设置年份。
```ts
dayuts().year() // gets current year
dayuts().year(2000) // returns new dayuts
```

### Get/Set
获取和设置相应信息。
```ts
dayuts().get('year')
dayuts().get('month') // start 0
dayuts().get('date')
dayuts().get('hour')
dayuts().get('minute')
dayuts().get('second')
dayuts().get('millisecond')

dayuts().set('date', 1)
dayuts().set('month', 3) // 四月
dayuts().set('second', 30)
```

## 操作

### 增加 Add
返回增加一定时间的复制的 dayuts 对象。
```ts
dayuts().add(7, 'day')
```

### 减去 Subtract
返回增加一定时间的复制的 dayuts 对象。
```ts
dayuts().subtract(7, 'year')
```

#### 所有可用单位的列表

| 单位          | 缩写 | 描述                              |
| ------------- | --------- | ---------------------------------------- |
| `day`         | `d`       | 日                                      |
| `week`        | `w`       | 周                                     |
| `month`       | `M`       | 月                                    |
| `year`        | `y`       | 年                                     |
| `hour`        | `h`       | 小时                                     |
| `minute`      | `m`       | 分钟                                   |
| `second`      | `s`       | 秒                                   |
| `millisecond`      | `ms`      | 毫秒                              |


### 时间的开始 Start of Time 
设置到一个时间的开始。
```ts
dayuts().startOf('year')
```

### 时间的结束 End of Time 
设置到一个时间的末尾。
```ts
dayuts().endOf('month')
```

#### 所有可用单位的列表

| 单位          | 缩写 | 描述                               |
| ------------- | --------- | ----------------------------------------- |
| `year`        | `y`       | 当年1月1日 00:00                           |
| `quarter`     | `Q`       | 当前季度的开始，月份的第一天，00:00 @>>QuarterOfYear|
| `month`       | `M`       | 当月的第一天，00:00                     |
| `week`        | `w`       | 当周的第一天，00:00 (根据地区设置)      |
| `date`        | `D`       | 今天 00:00                            |
| `day`         | `d`       | 今天 00:00                            |
| `hour`        | `h`       | 现在，但是分钟、秒和毫秒都为0          |
| `minute`      | `m`       | 现在，但是秒和毫秒都为0                |
| `second`      | `s`       | 现在，但是毫秒为0                      |

## 显示

### 格式化 Format
根据传入的占位符返回格式化后的日期。
将字符放在方括号中，即可原样返回而不被格式化替换 (例如， [MM])
```ts
dayuts().format() // 默认返回的是 ISO8601 格式字符串 '2024-03-28T01:33:29+08:00'

// app 暂不支持
dayuts('2019-01-25').format('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]') 
// 'YYYYescape 2019-01-25T00:00:00-02:00Z'

dayuts('2019-01-25').format('DD/MM/YYYY') // '25/01/2019'
```

### 相对当前时间(前) Time from now 
返回现在到当前实例的相对时间。
```ts
dayuts('1999-01-01').fromNow() // 25 years ago
//如果传入 true，则可以获得不带后缀的值。
dayuts('1999-01-01').fromNow(true)  // 25 years
```

### 相对指定时间(前) Time from X 
返回 X 到当前实例的相对时间。
```ts
dayuts('1999-01-01').from(dayuts()) // 25 years ago
//如果传入 true，则可以获得不带后缀的值。
dayuts('1999-01-01').from(dayuts(), true)  // 25 years
```

### 相对当前时间(后) Time to now 
返回当前实例到现在的相对时间。
```ts
dayuts('1999-01-01').toNow() // in 25 years
//如果传入 true，则可以获得不带后缀的值。
dayuts('1999-01-01').toNow(true)  // 25 years
```

### 相对指定时间(后) Time to X 
返回当前实例到 X 的相对时间。
```ts
dayuts('1999-01-01').to(dayuts()) // in 25 years
//如果传入 true，则可以获得不带后缀的值。
dayuts('1999-01-01').to(true)  // 25 years
```

### 差异 Diff
返回指定单位下两个日期时间之间的差异。
```ts
dayuts('2019-01-25')
	.diff(dayuts('2018-06-05')) // 20214000000 默认单位是毫秒
	
// 要获取其他单位下的差异，则在第二个参数传入相应的单位。
dayuts('2019-01-25')
	.diff(dayuts('2018-06-05'), 'month') //  7

// 如果要得到一个浮点数，将 true 作为第三个参数传入。	
dayuts('2019-01-25')
	.diff(dayuts('2018-06-05'), 'month', true) //  7.645161290322581
```

### Unix 时间戳 (毫秒)
返回当前实例的 UNIX 时间戳，13位数字，毫秒
```ts
dayuts('2019-01-25').valueOf() //1548345600000
```

### Unix 时间戳
返回当前实例的 UNIX 时间戳，10位数字，秒。
```ts
dayuts('2019-01-25').unix() // 1548345600
```

### 月份的天数
获取当前月份包含的天数。
```ts
dayuts('2019-01-25').daysInMonth() //31
```

### 转Date
从 Dayuts 对象中获取原生的 Date 对象
```ts
dayuts().toDate() 
```

### 转Array 
返回一个包含各个时间信息的 Array 
```ts
dayuts().toArray() //[2024, 2, 29, 2, 57, 28, 775]
```

### 转JSON 
序列化为 `ISO 8601` 格式的字符串
```ts
dayuts('2019-01-25').toJSON() // '2019-01-25T02:00:00.000Z'
```

### 转Object 
返回包含时间信息的 Object
```ts
dayuts('2019-01-25').toObject() // { years: 2019, months: 0, date: 25, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
```

### 转字符串 
返回包含时间信息的 string 
```ts
dayuts('2019-01-25').toString() // Fri Mar 29 2024 03:20:40 GMT+0800
```


## 查询

### 是否在前 Is Before 
这表示 Dayuts 对象是否在另一个提供的日期时间之前。

```ts
// 默认使用毫秒比较
dayuts().isBefore(dayuts('2011-01-01')) // false

// 如果想使用除了毫秒以外的单位进行比较，则将单位作为第二个参数传入。 在这种情况下，会使用传入的单位以及比其范围大的单位进行比较。
dayuts().isBefore('2011-01-01', 'month') // false
```

### 是否在后 Is After 
这表示 Dayuts 对象是否在另一个提供的日期时间之后。

```ts
// 默认使用毫秒比较
dayuts().isAfter(dayuts('2011-01-01')) // true

// 如果想使用除了毫秒以外的单位进行比较，则将单位作为第二个参数传入。 在这种情况下，会使用传入的单位以及比其范围大的单位进行比较。
dayuts().isAfter('2011-01-01', 'month') // true
```


### 是否相同 Is Same 
这表示 Dayuts 对象是否和另一个提供的日期时间相同。

```ts
// 默认使用毫秒比较
dayuts().isSame(dayuts('2011-01-01')) // false

// 当使用第二个参数时，将会连同去比较更大的单位。 如传入 month 将会比较 month 和 year。 传入 day 将会比较 day、 month和 year。
dayuts().isSame('2011-01-01', 'year') // false
```

### 是否相同或在前 Is Same or Before 
这表示 Dayuts 对象是否在另一个提供的日期时间之前。

```ts
// 默认使用毫秒比较
dayuts().isSameOrBefore(dayuts('2011-01-01')) // false

// 如果想使用除了毫秒以外的单位进行比较，则将单位作为第二个参数传入。 在这种情况下，会使用传入的单位以及比其范围大的单位进行比较。
dayuts().isSameOrBefore('2011-01-01', 'month') // false
```

### 是否相同或在后 Is Same or After 
这表示 Dayuts 对象是否和另一个提供的日期时间相同或在其之后。

```ts
// 默认使用毫秒比较
dayuts().isSameOrAfter(dayuts('2011-01-01')) // true

// 如果想使用除了毫秒以外的单位进行比较，则将单位作为第二个参数传入。
dayuts().isSameOrAfter('2011-01-01', 'month') // true
```

### 区间 Is Between 
这表示 Dayuts 对象是否在其他两个的日期时间之间

```ts
// 默认使用毫秒比较
dayuts('2010-10-20').isBetween('2010-10-19', dayuts('2010-10-25'))// true

// 如果想使用除了毫秒以外的单位进行比较，则将单位作为第三个参数传入。 在这种情况下，会使用传入的单位以及比其范围大的单位进行比较。
dayuts().isBetween('2010-10-19', '2010-10-25', 'month') // false

// 第四个参数是设置包容性。 [ 表示包含。 ( 表示排除。
// 要使用包容性参数，必须同时传入两个指示符。
dayuts('2016-10-30').isBetween('2016-01-01', '2016-10-30', 'day', '[)')
```

### 是否闰年 Is Leap Year 
查询 Dayuts 对象的年份是否闰年

```ts
dayuts().isLeapYear()// true
```

### 今日 Is Today
查询 Dayuts 对象的日期是不是今日

```ts
dayuts().isToday()// true
```

## 国际化
目前内置了中英两种语言，欢迎提交 Pull Request 来增加新的语言

### 改变语言配置 (全局)
更改全局的语言配置并不会影响之前存在的实例
```ts
import {dayutsIntl} from '@/uni_modules/lime-dayuts'
dayutsIntl.locale = 'zh-cn' // 全局使用简体中文
dayutsIntl.locale = 'en' // 全局使用默认的英文
```

### 改变语言配置 (当前实例)
```
dayuts().locale('zh-cn').format()
```