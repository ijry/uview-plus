import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const popup = read('src/uni_modules/uview-plus/components/u-popup/u-popup.vue')
const transitionMixin = read('src/uni_modules/uview-plus/components/u-transition/transitionMixin.js')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:popup-close-events'],
	'node scripts/verify-popup-close-events.mjs',
	'expected package.json to expose verify:popup-close-events'
)

// —— close 在任意关闭方式下都要发出（issue #902 主诉）——
assert.match(
	popup,
	/show\(newValue, oldValue\)\s*\{[\s\S]*else if \(oldValue === true\)\s*\{[\s\S]*if \(this\.closeEmitted\)\s*\{[\s\S]*this\.closeEmitted = false[\s\S]*\}\s*else\s*\{[\s\S]*this\.\$emit\('close'\)/,
	'expected the show watcher to emit close when show is set to false externally'
)
assert.match(
	popup,
	/emitClose\(\)\s*\{[\s\S]*this\.closeEmitted = true[\s\S]*this\.\$emit\('close'\)[\s\S]*this\.\$nextTick\(\(\) => \{[\s\S]*this\.closeEmitted = false/,
	'expected emitClose to clear its dedupe flag on nextTick so later closes still emit'
)
// closeEmitted 必须先同步置位、再发出 close：u-picker/u-datetime-picker/u-color-picker 会在
// close 的同步 handler 里修改喂给 popup 的 show 数据源，若置位晚于 emit 或改为异步，
// 那次 prop 变化会让 watcher 误判为外部关闭并补发第二个 close。
{
	const emitCloseBody = popup.match(/emitClose\(\)\s*\{([\s\S]*?)\n\t\t\t\},/)
	assert.ok(emitCloseBody, 'expected to locate the emitClose body')
	const flagAt = emitCloseBody[1].indexOf('this.closeEmitted = true')
	const emitAt = emitCloseBody[1].indexOf("this.$emit('close')")
	assert.ok(flagAt !== -1 && emitAt !== -1, 'expected emitClose to set the flag and emit close')
	assert.ok(
		flagAt < emitAt,
		'expected closeEmitted to be set synchronously BEFORE close is emitted, so a downstream handler that mutates the show source in the same tick does not trigger a duplicate close'
	)
}

// —— closed 事件：离场动画结束后发出 ——
assert.match(
	transitionMixin,
	/this\.\$emit\(this\.status === 'leave' \? 'afterLeave' : 'afterEnter'\)/,
	'expected u-transition to emit afterLeave when a leave animation finishes'
)
assert.match(
	popup,
	/@afterLeave="afterLeave"/,
	'expected u-popup to listen for the transition afterLeave event'
)
assert.match(
	popup,
	/afterLeave\(\)\s*\{[\s\S]*this\.\$emit\('closed'\)/,
	'expected afterLeave to emit the closed event'
)
assert.match(
	popup,
	/if \(this\.pageInline\)\s*\{[\s\S]*this\.\$emit\('closed'\)/,
	'expected pageInline mode to emit closed from the watcher, since no leave animation runs there'
)
assert.match(
	popup,
	/emits:\s*\["open", "close", "closed", "click", "update:show"\]/,
	'expected closed to be declared in emits'
)

// —— 兼容性：组件必须保持纯受控，渲染只依赖 show prop ——
// 曾经引入过 beforeClose + show 内部副本(innerShow/displayShow)，
// 由于 Function 类型 prop 的 default 是值本身而非取值工厂，拦截被意外恒定启用，
// 导致所有弹窗（含 u-picker）再也关不掉。这里锁住"不再有内部副本"。
for (const forbidden of [/displayShow/, /innerShow/, /interceptEnabled/, /beforeClose/]) {
	assert.doesNotMatch(
		popup,
		forbidden,
		`u-popup must stay purely controlled by the show prop; found reintroduced state: ${forbidden}`
	)
}
for (const snippet of [
	/width: show == false \? '0px' : ''/,
	/:show="show && pageInline == false"/,
	/:show="pageInline \? true : show"/,
]) {
	assert.match(popup, snippet, `expected template to render straight from the show prop: ${snippet}`)
}

// —— 两条内部关闭路径都走 emitClose，避免绕过去重 ——
assert.match(
	popup,
	/overlayClick\(\)\s*\{[\s\S]*if \(this\.closeOnClickOverlay\)\s*\{[\s\S]*this\.\$emit\('update:show', false\)[\s\S]*this\.emitClose\(\)/,
	'expected the overlay path to emit update:show and go through emitClose'
)
assert.match(
	popup,
	/close\(e\)\s*\{[\s\S]*this\.\$emit\('update:show', false\)[\s\S]*this\.emitClose\(\)/,
	'expected the close-icon path to emit update:show and go through emitClose'
)

// —— 下游组件把 closed 透传出去 ——
// [组件, 它在模板里包裹的根标签]。u-datetime-picker / u-picker-data 包的是 u-picker，
// 属于二级透传：closed 要先从 u-popup 到 u-picker，再到最外层，链上任一环缺失都收不到。
// 不含 u-upload：它的 popup 是内部视频预览，对外没有关闭语义（emits 里连 close 都没有）。
const FORWARDERS = [
	['u-picker', 'u-popup'],
	['u-action-sheet', 'u-popup'],
	['u-keyboard', 'u-popup'],
	['u-calendar', 'u-popup'],
	['u-color-picker', 'up-popup'],
	['u-goods-sku', 'up-popup'],
	['u-datetime-picker', 'u-picker'],
	['u-picker-data', 'up-picker'],
]
for (const [name, childTag] of FORWARDERS) {
	const src = read(`src/uni_modules/uview-plus/components/${name}/${name}.vue`)
	const openTag = src.match(new RegExp(`<${childTag}(?:\\s[\\s\\S]*?)?>`))
	assert.ok(openTag, `${name}: expected to find the wrapped <${childTag}> root tag`)
	assert.match(
		openTag[0],
		/@closed="\$emit\('closed'\)"/,
		`${name}: expected @closed to be forwarded on the <${childTag}> it wraps`
	)
	const emitsLine = src.match(/emits:\s*(\[[^\]]*\])/)
	assert.ok(emitsLine, `${name}: expected an emits declaration`)
	assert.ok(
		emitsLine[1].includes("'closed'") || emitsLine[1].includes('"closed"'),
		`${name}: expected closed to be declared in emits, otherwise Vue treats it as a fallthrough attr`
	)
}

// u-calendar 有两个 popup：主体 + 内部时间选择器。closed 只能来自主体，
// 否则关掉内部时间选择器也会对外报告"日历已关闭"。
{
	const calendar = read('src/uni_modules/uview-plus/components/u-calendar/u-calendar.vue')
	const forwards = calendar.match(/@closed="\$emit\('closed'\)"/g) || []
	assert.equal(
		forwards.length,
		1,
		'u-calendar must forward closed from its main popup only, not from the inner time-picker popup'
	)
}

// —— 类型定义要跟上，否则 TS 用户写 @closed 会报错 ——
for (const typeFile of ['popup', 'picker', 'datetimePicker', 'actionSheet', 'keyboard', 'calendar']) {
	const dts = read(`src/uni_modules/uview-plus/types/comps/${typeFile}.d.ts`)
	assert.match(
		dts,
		/onClosed\?: \(\) => any/,
		`${typeFile}.d.ts: expected onClosed to be declared alongside onClose`
	)
}

console.log('popup close/closed assertions passed')
