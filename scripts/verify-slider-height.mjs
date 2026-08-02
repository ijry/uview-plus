import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const sliderVue = read('src/uni_modules/uview-plus/components/u-slider/u-slider.vue')
const sliderDemo = read('src/pages/componentsB/slider/slider.nvue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:slider-height'],
    'node scripts/verify-slider-height.mjs',
    'expected package.json to expose verify:slider-height'
)

const sizeInitialization = sliderVue.match(
    /if\s*\(this\.height\s*!=\s*''\)\s*\{\s*this\.sizeLocal\s*=\s*[^\r\n]+\s*\}\s*else\s*\{\s*this\.sizeLocal\s*=\s*this\.size\s*\}/
)
assert.ok(sizeInitialization, 'expected mounted to initialize sizeLocal from height or size')

const initializeSliderSize = new Function(sizeInitialization[0])
const heightContext = { height: '4px', size: '2px', sizeLocal: '2px' }
assert.doesNotThrow(
    () => initializeSliderSize.call(heightContext),
    'non-empty height must not reference an undeclared variable'
)
assert.equal(heightContext.sizeLocal, '4px', 'height must override size')

const sizeContext = { height: '', size: '6px', sizeLocal: '2px' }
initializeSliderSize.call(sizeContext)
assert.equal(sizeContext.sizeLocal, '6px', 'empty height must fall back to size')

assert.doesNotMatch(
    sliderVue,
    /this\.sizeLocal\s*=\s*val\b/,
    'slider mounted logic must not assign undeclared val'
)

for (const height of ['20px', '4px', '2px']) {
    assert.match(sliderDemo, new RegExp(`height="${height}"`), `expected slider demo height=${height}`)
}

console.log('slider height assertions passed')
