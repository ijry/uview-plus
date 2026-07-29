import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const swipeVue = read('src/uni_modules/uview-plus/components/u-swipe-action-item/u-swipe-action-item.vue')
const swipeProps = read('src/uni_modules/uview-plus/components/u-swipe-action-item/props.js')
const swipeDefaults = read('src/uni_modules/uview-plus/components/u-swipe-action-item/swipeActionItem.js')
const swipeWxs = read('src/uni_modules/uview-plus/components/u-swipe-action-item/index.wxs')
const swipeOther = read('src/uni_modules/uview-plus/components/u-swipe-action-item/other.js')
const swipeNvue = read('src/uni_modules/uview-plus/components/u-swipe-action-item/nvue.js')
const swipeTypes = read('src/uni_modules/uview-plus/types/comps/swipeActionItem.d.ts')
const swipeDemo = read('src/pages/componentsA/swipeAction/swipeAction.nvue')
const changelog = read('src/uni_modules/uview-plus/changelog.md')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:swipe-action-scrolling'],
	'node scripts/verify-swipe-action-scrolling.mjs',
	'expected package.json to expose verify:swipe-action-scrolling'
)

assert.match(
	swipeDefaults,
	/scrolling\s*:\s*false/,
	'expected swipeActionItem default config to include scrolling: false'
)
assert.match(
	swipeProps,
	/scrolling\s*:\s*\{[\s\S]*type:\s*Boolean/,
	'expected swipeActionItem props to declare scrolling Boolean prop'
)
assert.match(
	swipeVue,
	/emits:\s*\[[\s\S]*['"]update:scrolling['"][\s\S]*['"]scrolling['"][\s\S]*\]/,
	'expected swipeActionItem emits to include update:scrolling and scrolling'
)
assert.match(
	swipeVue,
	/setScrolling\(value\)\s*\{[\s\S]*\$emit\(['"]update:scrolling['"][\s\S]*\$emit\(['"]scrolling['"]/,
	'expected swipeActionItem to expose setScrolling and emit both model and event updates'
)
assert.match(
	swipeVue,
	/@touchcancel="wxs\.touchcancel"/,
	'expected WXS template branch to bind touchcancel'
)
assert.match(
	swipeVue,
	/@touchcancel="touchcancel"/,
	'expected normal JS template branch to bind touchcancel'
)

assert.match(
	swipeWxs,
	/callMethod\(['"]setScrolling['"],\s*true\)/,
	'expected WXS branch to set scrolling true during horizontal swipe'
)
assert.match(
	swipeWxs,
	/callMethod\(['"]setScrolling['"],\s*false\)/,
	'expected WXS branch to release scrolling'
)
assert.match(
	swipeWxs,
	/function touchcancel/,
	'expected WXS branch to define touchcancel'
)

assert.match(
	swipeOther,
	/this\.setScrolling\(true\)/,
	'expected other JS branch to set scrolling true during horizontal swipe'
)
assert.match(
	swipeOther,
	/this\.setScrolling\(false\)/,
	'expected other JS branch to release scrolling'
)
assert.match(
	swipeOther,
	/touchcancel\(event\)/,
	'expected other JS branch to define touchcancel'
)

assert.match(
	swipeNvue,
	/this\.setScrolling\(true\)/,
	'expected nvue branch to set scrolling true'
)
assert.match(
	swipeNvue,
	/this\.setScrolling\(false\)/,
	'expected nvue branch to release scrolling'
)

assert.match(
	swipeTypes,
	/scrolling\?\s*:\s*boolean/,
	'expected TypeScript definition to include scrolling?: boolean'
)
assert.match(
	swipeTypes,
	/\['onUpdate:scrolling'\]\?\s*:\s*\(value:\s*boolean\)\s*=>\s*any/,
	'expected TypeScript definition to include onUpdate:scrolling'
)
assert.match(
	swipeTypes,
	/onScrolling\?\s*:\s*\(value:\s*boolean\)\s*=>\s*any/,
	'expected TypeScript definition to include onScrolling'
)
assert.match(
	swipeDemo,
	/v-model:scrolling="swipeScrolling"/,
	'expected demo page to bind v-model:scrolling'
)
assert.match(
	changelog,
	/swipe-action-item[\s\S]*(v-model:scrolling|scrolling)|scrolling[\s\S]*swipe-action-item/,
	'expected changelog to mention swipe-action-item scrolling support'
)

console.log('swipe action scrolling assertions passed')
