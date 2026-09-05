import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire, register } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// 组件库源码用无扩展名的相对导入和目录导入（uni-app 编译器会补全），Node 原生 ESM 不会，
// 注册解析钩子把 './x' 回退到 './x.js' 或 './x/index.js'，以便直接加载组件做真实挂载
register(
	'data:text/javascript,' +
		encodeURIComponent(`
import { existsSync } from 'node:fs'
export async function resolve(specifier, context, next) {
	try {
		return await next(specifier, context)
	} catch (err) {
		if (specifier.startsWith('.') && context.parentURL) {
			for (const suffix of ['.js', '/index.js']) {
				if (existsSync(new URL(specifier + suffix, context.parentURL))) {
					return next(specifier + suffix, context)
				}
			}
		}
		throw err
	}
}
`)
)

// issue #537：<up-datetime-picker format="yyyy-mm-dd"> 选完日期后并没有按 format 显示。
//
// 两处成因，本脚本各自守住：
// 1. format 直接交给 dayjs 格式化。dayjs 的 token 是大写的 YYYY-MM-DD，而 uview-plus
//    自己的 timeFormat($u.timeFormat) 用的是小写 yyyy-mm-dd（默认值就是 'yyyy-mm-dd'），
//    于是用户按库里的写法传 'yyyy-mm-dd' 时，dayjs 只认得其中的 mm(分钟) 和 dd(星期)，
//    结果是 'yyyy-00-Th' 这种字符串。
// 2. correctValue 用 dayjs.unix(value).isValid() 判断绑定值是否合法。dayjs.unix 只接受
//    秒级数字，日期字符串乘 1000 得到 NaN，因此文档里写明支持的 String 绑定值
//    ('2024-10-24') 会被判为非法并被替换成 minDate（默认当前年份-10），
//    issue 截图里两个日期都落在 2014 年（提 issue 时是 2024 年）正是这个回退的指纹。

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const read = filePath => readFileSync(resolve(repoRoot, filePath), 'utf8')
const sfcPath = resolve(repoRoot, 'src/uni_modules/uview-plus/components/u-datetime-picker/u-datetime-picker.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:datetime-picker-format'],
	'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-datetime-picker-format.mjs',
	'package.json should expose verify:datetime-picker-format'
)

globalThis.uni = {
	$on() {}, $off() {}, $once() {}, $emit() {},
	getStorageSync: () => '',
	setStorageSync() {},
	getSystemInfoSync: () => ({ windowWidth: 375, windowHeight: 667 }),
	getWindowInfo: () => ({ windowWidth: 375, windowHeight: 667 }),
	requireNativePlugin: () => ({}),
	createSelectorQuery() {
		const query = {
			in: () => query,
			select: () => query,
			selectAll: () => query,
			boundingClientRect: () => query,
			exec: () => query
		}
		return query
	}
}

const { parse, compileTemplate } = require('@vue/compiler-sfc')
const { descriptor, errors } = parse(read('src/uni_modules/uview-plus/components/u-datetime-picker/u-datetime-picker.vue'), { filename: sfcPath })
assert.deepEqual(errors, [], 'u-datetime-picker.vue should parse cleanly')

// 组件里 VUE2/VUE3 两套绑定值(value / modelValue)靠条件编译二选一，
// 直接按源码加载两条分支都会执行，先按真实构建那样做一次条件编译
const { initPreContext, preJs, preNVueJs } = require(
	resolve(repoRoot, 'node_modules/@dcloudio/uni-cli-shared/dist/preprocess/index.js')
)
initPreContext('h5')
const preprocessedScript = preJs(descriptor.script.content, sfcPath)
assert.match(preprocessedScript, /this\.correctValue\(this\.modelValue\)/, 'the VUE3 branch should survive preprocessing')

// SFC 的 script 走 data: 模块加载，data: URL 没有基准路径，相对导入先改写成绝对 file URL
const scriptModule = 'data:text/javascript,' + encodeURIComponent(
	preprocessedScript.replace(/(from\s+['"])(\.[^'"]+)(['"])/g, (match, head, specifier, tail) => {
		const base = resolve(dirname(sfcPath), specifier)
		const target = [base, `${base}.js`, resolve(base, 'index.js')].find(candidate => existsSync(candidate))
		assert.ok(target, `${specifier} should resolve to a real file`)
		return head + pathToFileURL(target).href + tail
	})
)
const componentOptions = (await import(scriptModule)).default
const { code: renderCode } = compileTemplate({ source: descriptor.template.content, filename: sfcPath, id: 'u-datetime-picker' })
const { render } = await import('data:text/javascript,' + encodeURIComponent(
	renderCode.replace(/from "vue"/, `from "${pathToFileURL(resolve(repoRoot, 'node_modules/vue/index.mjs')).href}"`)
))

const { createRenderer, h } = await import('vue')
const nodeOps = {
	createElement: tag => ({ tag, props: {}, children: [], parent: null }),
	createText: text => ({ tag: 'text', text, props: {} }),
	createComment: text => ({ tag: 'comment', text, props: {} }),
	setText(node, text) { node.text = text },
	setElementText(node, text) { node.text = text },
	insert(child, parent) { child.parent = parent; parent.children.push(child) },
	remove(child) {
		const parent = child.parent
		parent && parent.children.splice(parent.children.indexOf(child), 1)
	},
	parentNode: node => node.parent,
	nextSibling: () => null,
	querySelector: () => null,
	setScopeId() {},
	patchProp(node, key, prev, next) { node.props[key] = next }
}
const { createApp } = createRenderer(nodeOps)
const stub = { render: () => h('view') }

// 真实挂载组件，返回组件实例，直接读 inputValue / innerValue
function mountPicker(props) {
	let instance = null
	const Picker = { ...componentOptions, render }
	const app = createApp({ render: () => h(Picker, { ...props, ref: vm => { instance = vm || instance } }) })
	for (const name of ['u-picker', 'up-input', 'cover-view']) {
		app.component(name, stub)
	}
	app.config.warnHandler = () => {}
	app.mount(nodeOps.createElement('root'))
	assert.ok(instance, 'the datetime picker instance should be available')
	return { instance, unmount: () => app.unmount() }
}

function withPicker(props, callback) {
	const { instance, unmount } = mountPicker(props)
	try {
		callback(instance)
	} finally {
		unmount()
	}
}

const dateOnly = new Date(2024, 9, 24).getTime() // 2024-10-24 00:00
const dateTime = new Date(2024, 9, 24, 15, 8, 9).getTime() // 2024-10-24 15:08:09
const minDateDefault = new Date(new Date().getFullYear() - 10, 0, 1).getTime()
// minDate/maxDate 默认是当前年份±10，固定日期的断言显式给边界，免得脚本过几年自己失效
const bounds = { minDate: new Date(2000, 0, 1).getTime(), maxDate: new Date(2050, 0, 1).getTime() }

// --- 1. issue 里的原始写法：小写 yyyy-mm-dd 必须真的按 yyyy-mm-dd 显示
withPicker({ ...bounds, hasInput: true, mode: 'date', format: 'yyyy-mm-dd', modelValue: dateOnly }, instance => {
	assert.equal(instance.inputValue, '2024-10-24', "format='yyyy-mm-dd' should render 2024-10-24")
})

// --- 2. uview-plus timeFormat 规则的其他常见组合（mm 是月份、MM 是分钟）
const uviewPatterns = [
	['date', 'yyyy/mm/dd', dateOnly, '2024/10/24'],
	['date', 'yyyy年mm月dd日', dateOnly, '2024年10月24日'],
	['date', 'yy-mm-dd', dateOnly, '24-10-24'],
	['datetime', 'yyyy-mm-dd hh:MM', dateTime, '2024-10-24 15:08'],
	['datetimesecond', 'yyyy-mm-dd hh:MM:ss', dateTime, '2024-10-24 15:08:09']
]
for (const [mode, format, value, expected] of uviewPatterns) {
	withPicker({ ...bounds, hasInput: true, mode, format, modelValue: value }, instance => {
		assert.equal(instance.inputValue, expected, `format='${format}' should render ${expected}`)
	})
}

// --- 3. dayjs 规则（文档标注的默认值就是 'YYYY-MM-DD HH:mm'）不能被这次改动带偏
const dayjsPatterns = [
	['date', 'YYYY-MM-DD', dateOnly, '2024-10-24'],
	['datetime', 'YYYY-MM-DD HH:mm', dateTime, '2024-10-24 15:08'],
	['datetimesecond', 'YYYY/MM/DD HH:mm:ss', dateTime, '2024/10/24 15:08:09']
]
for (const [mode, format, value, expected] of dayjsPatterns) {
	withPicker({ ...bounds, hasInput: true, mode, format, modelValue: value }, instance => {
		assert.equal(instance.inputValue, expected, `format='${format}' should render ${expected}`)
	})
}

// --- 4. 不传 format 时仍走按 mode 推导的默认格式
const modeDefaults = [
	['date', dateOnly, '2024-10-24'],
	['year-month', dateOnly, '2024-10'],
	['datehour', dateTime, '2024-10-24 15'],
	['datetime', dateTime, '2024-10-24 15:08'],
	['datetimesecond', dateTime, '2024-10-24 15:08:09']
]
for (const [mode, value, expected] of modeDefaults) {
	withPicker({ ...bounds, hasInput: true, mode, modelValue: value }, instance => {
		assert.equal(instance.inputValue, expected, `mode='${mode}' without format should render ${expected}`)
	})
}

// --- 5. 文档写明 v-model 支持 String，日期字符串不能被替换成 minDate
const stringValues = [
	['date', '2024-10-24', new Date(2024, 9, 24).getTime()],
	['date', '2024/10/24', new Date(2024, 9, 24).getTime()],
	['datetime', '2024-10-24 15:08', new Date(2024, 9, 24, 15, 8).getTime()],
	['datetimesecond', '2024-10-24 15:08:09', dateTime],
	['date', String(dateOnly), dateOnly]
]
for (const [mode, value, expected] of stringValues) {
	withPicker({ ...bounds, hasInput: true, mode, format: 'yyyy-mm-dd hh:MM:ss', modelValue: value }, instance => {
		assert.equal(
			instance.innerValue,
			expected,
			`modelValue='${value}' should be kept instead of falling back to minDate`
		)
		assert.notEqual(instance.innerValue, bounds.minDate, `modelValue='${value}' should not land on minDate`)
	})
}

// --- 6. 2000 年以前的毫秒时间戳只有 12 位，013c8614e 修的就是这种值被判为非法，不能退回去
withPicker({ hasInput: true, mode: 'date', format: 'yyyy-mm-dd', minDate: new Date(1990, 0, 1).getTime(), modelValue: new Date(1999, 5, 1).getTime() }, instance => {
	assert.equal(instance.inputValue, '1999-06-01', 'pre-2000 timestamps must stay selectable')
})

// --- 7. 真正非法的值继续回退到 minDate
for (const value of ['', 'abc', '不是日期', null, undefined]) {
	withPicker({ hasInput: true, mode: 'date', format: 'yyyy-mm-dd', modelValue: value }, instance => {
		assert.equal(instance.innerValue, minDateDefault, `modelValue=${JSON.stringify(value)} should fall back to minDate`)
	})
}

// --- 8. 超出 minDate/maxDate 的字符串仍要被夹取到边界内
withPicker({
	hasInput: true,
	mode: 'date',
	format: 'yyyy-mm-dd',
	minDate: new Date(2024, 0, 1).getTime(),
	maxDate: new Date(2024, 11, 31).getTime(),
	modelValue: '2030-01-01'
}, instance => {
	assert.equal(instance.inputValue, '2024-12-31', 'values after maxDate should be clamped to maxDate')
})

// --- 9. time/timesecond 模式不受影响
withPicker({ hasInput: true, mode: 'time', modelValue: '12:24' }, instance => {
	assert.equal(instance.inputValue, '12:24', 'time mode should show the raw time string')
	assert.equal(instance.correctValue('99:99'), '23:59', 'time mode should clamp out of range values')
	assert.equal(instance.correctValue(''), '00:00', 'empty time value should fall back to minHour/minMinute')
})
withPicker({ hasInput: true, mode: 'timesecond', modelValue: '12:24:36' }, instance => {
	assert.equal(instance.inputValue, '12:24:36', 'timesecond mode should show the raw time string')
	assert.equal(instance.correctValue('1:2:3'), '01:02:03', 'timesecond mode should pad the time parts')
})

// --- 10. demo 页面给出一个 format 的示例，之前这个 prop 在 demo 里没有任何出场
const demoPage = read('src/pages/componentsC/datetimePicker/datetimePicker.nvue')
assert.match(demoPage, /format="yyyy-mm-dd hh:MM"/, 'the datetimePicker demo should show a uview-plus style format')

console.log('datetime picker format assertions passed')
