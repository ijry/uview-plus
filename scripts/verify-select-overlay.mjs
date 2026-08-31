import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const select = read('src/uni_modules/uview-plus/components/u-select/u-select.vue')
const overlayDefaults = read('src/uni_modules/uview-plus/components/u-overlay/overlay.js')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:select-overlay'],
	'node scripts/verify-select-overlay.mjs',
	'expected package.json to expose verify:select-overlay'
)

// —— 遮罩必须真的可见，且比 up-overlay 自身默认更浅 ——
const opacityDefault = select.match(/overlayOpacity:\s*\{[\s\S]*?default:\s*([0-9.]+)/)
assert.ok(opacityDefault, 'expected u-select to declare an overlayOpacity default')
const selectOpacity = Number(opacityDefault[1])
const overlayOpacity = Number((overlayDefaults.match(/opacity:\s*([0-9.]+)/) || [])[1])
assert.ok(
	selectOpacity > 0.05,
	`u-select overlay must be visible, got opacity ${selectOpacity}`
)
assert.ok(
	selectOpacity < overlayOpacity,
	`u-select overlay must stay lighter than the up-overlay default ${overlayOpacity}, got ${selectOpacity}`
)
assert.match(
	select,
	/overlayOpacity:\s*\{\s*\n\s*type:\s*\[String,\s*Number\]/,
	'expected overlayOpacity to accept String|Number like up-overlay does'
)

// —— 触发区在遮罩之上，否则下拉面板亮着而它的锚点被压暗 ——
assert.match(
	select,
	/selectLabelStyle\(\)\s*\{[\s\S]*?if \(this\.isOpen && this\.overlay\)\s*\{[\s\S]*?style\.position = 'relative'[\s\S]*?style\.zIndex = this\.zIndex \+ 1/,
	'expected the trigger area to be lifted above the overlay while open'
)
// 抬起后遮罩收不到这次点击，收起只能由触发区自己负责
assert.match(
	select,
	/@click="labelClick"/,
	'expected the trigger area to go through labelClick'
)
assert.match(
	select,
	/labelClick\(\)\s*\{[\s\S]*?if \(this\.isOpen\)\s*\{[\s\S]*?this\.closeSelect\(\)[\s\S]*?return[\s\S]*?\}[\s\S]*?this\.openSelect\(\)/,
	'expected labelClick to toggle instead of only opening'
)
// 下拉面板必须严格高于遮罩，两者同为 zIndex 会让面板被压暗
const wrapZIndex = select.match(/optionsWrapStyle\(\)\s*\{[\s\S]*?zIndex:\s*this\.zIndex \+ 1/)
assert.ok(wrapZIndex, 'expected the options panel to sit above the overlay')

// —— 点击遮罩关闭必须默认开启，且可以关掉，命名与 u-popup 对齐 ——
assert.match(
	select,
	/closeOnClickOverlay:\s*\{\s*\n\s*type:\s*Boolean,\s*\n\s*default:\s*true/,
	'expected u-select to expose closeOnClickOverlay defaulting to true'
)
assert.match(
	select,
	/overlayClick\(\)\s*\{[\s\S]*?if \(!this\.closeOnClickOverlay\) return;[\s\S]*?this\.closeSelect\(\)/,
	'expected overlayClick to honour closeOnClickOverlay'
)

console.log('select overlay assertions passed')
