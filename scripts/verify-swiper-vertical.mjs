import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const swiperVue = read('src/uni_modules/uview-plus/components/u-swiper/u-swiper.vue')
const swiperProps = read('src/uni_modules/uview-plus/components/u-swiper/props.js')
const swiperDefaults = read('src/uni_modules/uview-plus/components/u-swiper/swiper.js')
const swiperTypes = read('src/uni_modules/uview-plus/types/comps/swiper.d.ts')
const swiperDemo = read('src/pages/componentsC/swiper/swiper.nvue')
const changelog = read('src/uni_modules/uview-plus/changelog.md')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:swiper-vertical'],
	'node scripts/verify-swiper-vertical.mjs',
	'expected package.json to expose verify:swiper-vertical'
)

assert.match(
	swiperDefaults,
	/vertical\s*:\s*false/,
	'expected swiper default config to include vertical: false'
)
assert.match(
	swiperProps,
	/vertical\s*:\s*\{[\s\S]*type:\s*Boolean/,
	'expected swiper props to declare vertical Boolean prop'
)
assert.match(
	swiperVue,
	/:vertical="vertical"/,
	'expected u-swiper to pass vertical to native swiper'
)
assert.match(
	swiperVue,
	/@property \{Boolean\}\s+vertical/,
	'expected u-swiper docs comment to mention vertical'
)
assert.match(
	swiperTypes,
	/vertical\?\s*:\s*boolean/,
	'expected TypeScript definition to include vertical?: boolean'
)
assert.match(
	swiperDemo,
	/vertical/,
	'expected demo page to include a vertical example'
)
assert.match(
	changelog,
	/swiper[\s\S]*vertical|vertical[\s\S]*swiper|纵向/,
	'expected changelog to mention swiper vertical support'
)

console.log('swiper vertical assertions passed')
