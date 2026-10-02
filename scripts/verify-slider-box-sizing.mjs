import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const sliderVue = read('src/uni_modules/uview-plus/components/u-slider/u-slider.vue')
const sliderDefaults = read('src/uni_modules/uview-plus/components/u-slider/slider.js')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:slider-box-sizing'],
    'node scripts/verify-slider-box-sizing.mjs',
    'expected package.json to expose verify:slider-box-sizing'
)

// 按大括号配对取出源码块，避免正则跨块误匹配
const readBlock = (source, header) => {
    const start = source.indexOf(header)
    assert.notEqual(start, -1, `expected to find "${header}" in u-slider.vue`)
    let depth = 0
    for (let i = source.indexOf('{', start); i < source.length; i++) {
        if (source[i] === '{') depth++
        else if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1)
    }
    throw new Error(`unbalanced braces after "${header}"`)
}

const innerBlock = readBlock(sliderVue, '&-inner {')

// 应用层写 view { box-sizing: border-box } 时，类选择器声明优先级更高，组件以自己声明的盒模型为准
const declaredBoxSizing = innerBlock.match(/box-sizing:\s*([\w-]+);/)?.[1]

// nvue 只支持 border-box，声明必须放在非 nvue 分支里
if (declaredBoxSizing) {
    assert.match(
        innerBlock,
        /\/\* #ifndef APP-NVUE \*\/[\s\S]*box-sizing:[\s\S]*\/\* #endif \*\//,
        'expected the box-sizing declaration to sit inside an #ifndef APP-NVUE guard'
    )
}

const paddingValues = innerBlock.match(/padding:\s*([^;]+);/)?.[1].trim().split(/\s+/).map(Number.parseFloat)
assert.ok(paddingValues?.every(Number.isFinite), 'expected .u-slider-inner to keep a numeric padding declaration')
const paddingY = paddingValues[0] + (paddingValues.length >= 3 ? paddingValues[2] : paddingValues[0])
assert.ok(paddingY > 0, 'expected .u-slider-inner to keep vertical padding')

// 用组件真实的 innerStyleCpu 计算内联高度
const computedSource = readBlock(sliderVue, 'innerStyleCpu() {')
const innerStyleCpu = new Function(
    'getPx',
    `return function () {${computedSource.slice(computedSource.indexOf('{') + 1, computedSource.lastIndexOf('}'))}}`
)(value => (typeof value === 'number' ? value : Number.parseInt(value, 10)))

const blockSize = Number.parseFloat(sliderDefaults.match(/blockSize:\s*([\d.]+)/)[1])
assert.ok(blockSize > 0, 'expected a numeric blockSize default in slider.js')

// 内容盒高度即滑块（绝对定位）的对齐基准，必须与应用层的 box-sizing 无关
const usedContentHeight = (specified, boxSizing) =>
    boxSizing === 'border-box' ? Math.max(0, specified - paddingY) : specified

for (const [label, context, expectedHeight] of [
    ['horizontal', { isRange: false, showValue: false }, blockSize],
    ['range with value', { isRange: true, showValue: true }, blockSize + 24]
]) {
    const style = innerStyleCpu.call({ innerStyle: {}, vertical: false, blockSize, ...context })
    assert.equal(style.height, `${expectedHeight}px`, `unexpected inner height for the ${label} slider`)
    const heights = ['content-box', 'border-box'].map(ambient =>
        usedContentHeight(Number.parseFloat(style.height), declaredBoxSizing ?? ambient)
    )
    assert.deepEqual(
        heights,
        [expectedHeight, expectedHeight],
        `the ${label} slider inner content height must stay ${expectedHeight}px under any app-level view box-sizing`
    )
}

// 纵向模式把 padding 内联清零，本身就与 box-sizing 无关
const verticalStyle = innerStyleCpu.call({
    innerStyle: {}, vertical: true, isRange: false, showValue: false, blockSize, length: 'auto'
})
assert.equal(verticalStyle.padding, '0', 'expected vertical mode to keep zeroing the inner padding')

console.log('slider box-sizing assertions passed')
