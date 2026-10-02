import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import dayjs from '../src/uni_modules/uview-plus/components/u-datetime-picker/dayjs.esm.min.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const monthSource = read('src/uni_modules/uview-plus/components/u-calendar/month.vue')
const calendarSource = read('src/uni_modules/uview-plus/components/u-calendar/u-calendar.vue')
const mixinSource = read('src/uni_modules/uview-plus/libs/mixin/mixin.js')

// 取出marker之后第一个大括号包裹的代码块（模板字符串里的${}成对，不影响计数），
// 并去掉行注释，避免注释里出现的关键字影响断言
const blockAfter = (source, marker) => {
    const start = typeof marker === 'string' ? source.indexOf(marker) : source.search(marker)
    assert.notEqual(start, -1, `expected to find ${marker}`)
    const open = source.indexOf('{', start)
    assert.notEqual(open, -1, `expected a block after ${marker}`)
    let depth = 0
    for (let i = open; i < source.length; i++) {
        if (source[i] === '{') depth++
        else if (source[i] === '}') {
            depth--
            if (depth === 0) {
                return source.slice(open, i + 1).replace(/^[ \t]*\/\/.*$/gm, '')
            }
        }
    }
    throw new Error(`unbalanced block after ${marker}`)
}
// 函数/计算属性声明的起始位置
const declOf = name => new RegExp(`^\\s*${name}\\s*\\([^)]*\\)\\s*\\{`, 'm')

// 1. month.vue中按“日期格子”粒度执行的函数，不能再解析日期或做颜色渐变，
//    否则monthNum一大（monthNum=50约1500个格子）就会长时间阻塞主线程
for (const fn of ['dayStyle', 'daySelectStyle', 'textStyle', 'getBottomInfo', 'isForbid']) {
    const body = blockAfter(monthSource, declOf(fn))
    assert.doesNotMatch(
        body,
        /dayjs\(/,
        `${fn} 每个日期格子都会执行，不能在其中调用dayjs解析日期`
    )
    assert.doesNotMatch(
        body,
        /colorGradient\(/,
        `${fn} 每个日期格子都会执行，不能在其中做颜色渐变计算`
    )
    assert.doesNotMatch(
        body,
        /this\.selected\b/,
        `${fn} 不能直接遍历/索引未归一化的selected，应使用归一化后的缓存`
    )
}

// 2. 归一化缓存与区间底色缓存必须存在，且按selected变化重算而不是按格子重算
for (const cached of ['selectedDates()', 'selectedDateMap()', 'selectedStart()', 'selectedEnd()',
    'normalizedTodayDate()', 'rangeMiddleColor()']) {
    assert.ok(
        monthSource.includes(cached),
        `expected month.vue computed ${cached} to cache per-render values`
    )
}
assert.match(
    blockAfter(monthSource, '\t\t\tselectedDates()'),
    /this\.selected\.map\(/,
    'selectedDates 应基于selected一次性归一化'
)
assert.match(
    blockAfter(monthSource, '\t\t\tdateOf(item)'),
    /item\.dateStr \|\| dayjs\(item\.date\)/,
    'dateOf 应优先使用父组件预计算的dateStr，并保留自定义formatter的兜底'
)

// 3. setMonth的“按天”循环里不能再构造dayjs：每个月只allowed一个dayjs对象
const setMonthBody = blockAfter(calendarSource, declOf('setMonth'))
const dayMapper = blockAfter(setMonthBody, '.map((item, index) =>')
assert.doesNotMatch(
    dayMapper,
    /dayjs\(/,
    'setMonth按天生成数据时不能再调用dayjs，应从当月的monthStart派生'
)
assert.match(setMonthBody, /const monthStart = dayjs\(minDate\)\.add\(i, 'month'\)/, 'expected per-month dayjs object')
assert.match(setMonthBody, /dateStr: date/, 'expected setMonth to hand the formatted date string to month.vue')
assert.match(
    setMonthBody,
    /disabled:\s*\n?\s*date < minDateStr \|\| date > maxDateStr/,
    'expected disabled to be decided by string comparison'
)

// 4. 全局mixin的$u不能再深拷贝uni.$u：mixin是Vue.mixin全局注册的，
//    深拷贝开销会随组件实例数线性放大
const uBody = blockAfter(mixinSource, declOf('\\$u'))
assert.doesNotMatch(uBody, /deepMerge|deepClone/, '$u 不能深拷贝uni.$u')
assert.match(uBody, /Object\.assign\(\{\}, globalU\)/, '$u 应只做浅拷贝')
for (const key of ['props', 'http', 'mixin']) {
    assert.match(uBody, new RegExp(`mergeU\\.${key} = undefined`), `$u 仍需移除${key}以控制小程序setData体积`)
}
assert.match(uBody, /if \(!globalU \|\| typeof globalU !== 'object'\) return false/,
    'uni.$u未初始化时应与原deepMerge一致返回false，交由upBindGetRect兜底')
assert.doesNotMatch(mixinSource, /import \{[^}]*deepMerge[^}]*\} from '\.\.\/function\/index'/,
    '不再使用deepMerge后应移除该导入')

// 5. 上面几处把dayjs比较换成了YYYY-MM-DD字符串比较，这里验证两者等价
const dates = ['2021-12-31', '2022-01-01', '2022-01-09', '2022-01-10', '2022-02-01', '2022-10-01', '2023-01-01']
for (const a of dates) {
    for (const b of dates) {
        assert.equal(a < b, dayjs(a).isBefore(dayjs(b)), `字符串比较应与dayjs一致: ${a} < ${b}`)
        assert.equal(a > b, dayjs(a).isAfter(dayjs(b)), `字符串比较应与dayjs一致: ${a} > ${b}`)
        assert.equal(a === b, dayjs(a).isSame(dayjs(b)), `字符串比较应与dayjs一致: ${a} === ${b}`)
    }
}

// 6. 归一化正则只放行严格的YYYY-MM-DD，其余（未补零、带时间、时间戳）仍交给dayjs
const regMatch = monthSource.match(/const DATE_STR_REG = (\/.+\/)\n/)
assert.ok(regMatch, 'expected DATE_STR_REG in month.vue')
const dateStrReg = new RegExp(regMatch[1].slice(1, -1))
assert.ok(dateStrReg.test('2022-01-06'), 'YYYY-MM-DD 应命中快路径')
for (const raw of ['2022-1-6', '2022-01-06 10:30', '2022/01/06', '', '20220106']) {
    assert.ok(!dateStrReg.test(raw), `${raw} 不应命中快路径`)
}

console.log('calendar render perf assertions passed')
