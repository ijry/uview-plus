import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const calendarVueSource = read('src/uni_modules/uview-plus/components/u-calendar/u-calendar.vue')
const calendarPropsSource = read('src/uni_modules/uview-plus/components/u-calendar/props.js')
const calendarDefaultsSource = read('src/uni_modules/uview-plus/components/u-calendar/calendar.js')
const calendarTypesSource = read('src/uni_modules/uview-plus/types/comps/calendar.d.ts')

const popupProps = [
    'overlay',
    'duration',
    'overlayStyle',
    'overlayOpacity',
    'zIndex',
    'safeAreaInsetBottom',
    'safeAreaInsetTop',
    'bgColor'
]

const mainPopupMatch = calendarVueSource.match(/<u-popup\s+([\s\S]*?)>\s*<view class="u-calendar">/)
assert.ok(mainPopupMatch, 'expected u-calendar main popup wrapping .u-calendar')
const mainPopupAttrs = mainPopupMatch[1]

for (const prop of popupProps) {
    assert.match(
        mainPopupAttrs,
        new RegExp(`:${prop}="${prop}"`),
        `expected main u-popup to bind :${prop}="${prop}"`
    )
    assert.match(
        calendarPropsSource,
        new RegExp(`${prop}:\\s*\\{[\\s\\S]*default:\\s*\\(\\)\\s*=>\\s*defProps\\.calendar\\.${prop}`),
        `expected props.js to define ${prop} from defProps.calendar.${prop}`
    )
    assert.match(
        calendarDefaultsSource,
        new RegExp(`${prop}:\\s*`),
        `expected calendar default props to include ${prop}`
    )
    assert.match(
        calendarTypesSource,
        new RegExp(`${prop}\\?:`),
        `expected calendar.d.ts to expose ${prop}`
    )
}

assert.match(calendarDefaultsSource, /overlay:\s*true/, 'expected overlay default to match u-popup')
assert.match(calendarDefaultsSource, /duration:\s*300/, 'expected duration default to match u-popup')
assert.match(calendarDefaultsSource, /overlayStyle:\s*\{\}/, 'expected overlayStyle default to match u-popup')
assert.match(calendarDefaultsSource, /overlayOpacity:\s*0\.5/, 'expected overlayOpacity default to match u-popup')
assert.match(calendarDefaultsSource, /zIndex:\s*10075/, 'expected zIndex default to match u-popup')
assert.match(calendarDefaultsSource, /safeAreaInsetBottom:\s*true/, 'expected safeAreaInsetBottom default to match u-popup')
assert.match(calendarDefaultsSource, /safeAreaInsetTop:\s*false/, 'expected safeAreaInsetTop default to match u-popup')
assert.match(calendarDefaultsSource, /bgColor:\s*''/, 'expected bgColor default to match u-popup')

assert.match(
    mainPopupAttrs,
    /mode="bottom"/,
    'expected u-calendar main popup mode to remain fixed to bottom'
)
assert.match(
    mainPopupAttrs,
    /:closeable="!pageInline"/,
    'expected u-calendar to keep closeable controlled by pageInline'
)
assert.doesNotMatch(
    calendarPropsSource,
    /popupProps|closeable:\s*\{/,
    'u-calendar must not expose popupProps or closeable'
)

console.log('calendar popup props assertions passed')
