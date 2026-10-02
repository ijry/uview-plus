import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')
const cell = read('src/uni_modules/uview-plus/components/u-cell/u-cell.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:cell-required-asterisk'],
    'node scripts/verify-cell-required-asterisk.mjs'
)

// issue #831：required 星号原先是 .u-cell--required:before 伪元素，且 position: absolute
// 而 u-cell 内部没有任何定位祖先，包含块退化成 .u-cell-group__wrapper 或页面本身，
// left: -8px 直接把星号推到屏幕外（通栏 cell 场景），nvue 与小程序下伪元素本身也不渲染。
assert.doesNotMatch(
    cell,
    /u-cell--required/,
    'expected the absolutely positioned required pseudo-element class to be gone'
)
assert.doesNotMatch(
    cell,
    /content:\s*'\*'/,
    'expected the required asterisk not to be rendered through a CSS pseudo-element'
)

// 星号必须是真实节点，且排在 .u-cell__title 之前、与标题同处 row 容器 .u-cell__body__content 内
const content = cell.match(
    /<view class="u-cell__body__content">([\s\S]*?)<view class="u-cell__title">/
)?.[1] || ''

assert.ok(content, 'expected .u-cell__body__content to still wrap the title in a row container')
assert.match(
    content,
    /<text\s+v-if="required"\s+class="u-cell__required"\s+:style="\[cellRequiredDynamicStyle\]"\s*>\*<\/text>/,
    'expected a real <text>*</text> node rendered before the title when required is set'
)

const requiredStyle = cell.match(/&__required \{([\s\S]*?)\n\t\t\}/)?.[1] || ''

assert.ok(requiredStyle, 'expected a .u-cell__required style rule')
assert.doesNotMatch(
    requiredStyle,
    /position:\s*absolute|left:\s*-/,
    'expected the required asterisk to stay in flow so it cannot land outside the visible area'
)
assert.match(
    requiredStyle,
    /color:\s*\$u-cell-required-color;/,
    'expected the required asterisk to use the themeable required color variable'
)
assert.match(
    cell,
    /\$u-cell-required-color:\s*\$u-error\s*!default;/,
    'expected $u-cell-required-color to default to the error color'
)

// nvue 不支持 css 变量，颜色需要和其它文字一样走 upThemeVar 运行时取值
assert.match(
    cell,
    /cellRequiredDynamicStyle\(\) \{\s*return \{\s*color: this\.upThemeVar\('--up-error', '#f56c6c'\)\s*\}\s*\},/,
    'expected cellRequiredDynamicStyle to resolve the error color through upThemeVar'
)

console.log('cell required asterisk assertions passed')
