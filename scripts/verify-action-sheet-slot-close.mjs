import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const actionSheet = read('src/uni_modules/uview-plus/components/u-action-sheet/u-action-sheet.vue')
const cell = read('src/uni_modules/uview-plus/components/u-cell/u-cell.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:action-sheet-slot-close'],
	'node scripts/verify-action-sheet-slot-close.mjs',
	'expected package.json to expose verify:action-sheet-slot-close'
)

assert.match(
	actionSheet,
	/<view[\s\S]*class="u-action-sheet__slot"[\s\S]*@tap="slotClickHandler"[\s\S]*>\s*<slot>\s*<\/slot>\s*<\/view>/,
	'expected custom default slot content to be wrapped by slotClickHandler'
)
assert.match(
	actionSheet,
	/<view[\s\S]*class="u-action-sheet__slot"[\s\S]*v-if="\$slots\.default"/,
	'expected slot click handling to apply only when a default slot is provided'
)
assert.match(
	actionSheet,
	/<template v-else>[\s\S]*<scroll-view scroll-y class="u-action-sheet__item-wrap"/,
	'expected built-in actions renderer to remain the fallback content'
)
assert.match(
	actionSheet,
	/slotClickHandler\(\)\s*\{[\s\S]*if\s*\(this\.closeOnClickAction\)\s*\{[\s\S]*this\.\$emit\('update:show', false\)[\s\S]*this\.\$emit\('close'\)[\s\S]*\}/,
	'expected slotClickHandler to honor closeOnClickAction and emit close updates'
)
assert.match(
	actionSheet,
	/selectHandler\(index\)[\s\S]*this\.\$emit\('select', item\)[\s\S]*if\s*\(this\.closeOnClickAction\)/,
	'expected built-in action selection behavior to remain unchanged'
)
assert.match(
	cell,
	/inject:\s*\{[\s\S]*uActionSheet:\s*\{[\s\S]*default:\s*null[\s\S]*\}/,
	'expected u-cell to optionally inject uActionSheet'
)
assert.match(
	cell,
	/this\.\$emit\('click',[\s\S]*if\s*\(this\.stop && typeof this\.uActionSheet\?\.slotClickHandler === 'function'\)\s*\{[\s\S]*this\.uActionSheet\.slotClickHandler\(\)/,
	'expected u-cell to close an ancestor action-sheet slot before stopping tap propagation'
)

console.log('action-sheet slot close assertions passed')