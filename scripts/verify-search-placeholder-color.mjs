import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')
const search = read('src/uni_modules/uview-plus/components/u-search/u-search.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:search-placeholder-color'],
    'node scripts/verify-search-placeholder-color.mjs'
)

const placeholderClass = 'u-search__content__input--placeholder'
const styleBlocks = [...search.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)].map(match => ({
    scoped: /\bscoped\b/.test(match[1]),
    content: match[2]
}))
const scopedBlocks = styleBlocks.filter(block => block.scoped)
const globalBlocks = styleBlocks.filter(block => !block.scoped)

assert.equal(scopedBlocks.length, 1, 'expected exactly one scoped style block')
assert.equal(globalBlocks.length, 1, 'expected exactly one global style block for placeholder-class')

// placeholder 节点由 input 内部渲染，拿不到 scoped 生成的 data-v- 类，
// 规则一旦写在 scoped 里，小程序端就永远匹配不到
assert.doesNotMatch(
    scopedBlocks[0].content,
    /--placeholder/,
    'expected placeholder-class styles to stay out of the scoped style block'
)
assert.match(
    globalBlocks[0].content,
    new RegExp(`\\.${placeholderClass}\\s*\\{[^}]*color:\\s*var\\(--up-search-placeholder-color,`),
    'expected the global placeholder rule to read --up-search-placeholder-color'
)
assert.match(
    globalBlocks[0].content,
    /\$u-search-input-placeholder-color:\s*\$u-tips-color\s*!default;/,
    'expected the scss customization variable to move with the rule'
)
assert.match(
    globalBlocks[0].content,
    /var\(--up-search-placeholder-color,\s*#\{\$u-search-input-placeholder-color\}\)/,
    'expected the scss variable to stay the fallback of --up-search-placeholder-color'
)

// placeholderColor 必须同时走两条通路：内联 placeholder-style（部分真机首屏不生效）
// 和 placeholder-class + 自定义属性，且两者取同一个计算属性
assert.match(
    search,
    new RegExp(`placeholder-class="${placeholderClass}"`),
    'expected the input to keep pointing placeholder-class at the global class'
)
assert.match(
    search,
    /:placeholder-style="`color: \$\{resolvedPlaceholderColor\}`"/,
    'expected the inline placeholder-style channel to stay in place'
)
assert.match(
    search,
    /'--up-search-placeholder-color':\s*resolvedPlaceholderColor,/,
    'expected the wrapper style to publish placeholderColor as --up-search-placeholder-color'
)

const resolvedPlaceholderColor = search.match(
    /resolvedPlaceholderColor\(\) \{([\s\S]*?)\n\t\t\t\},/
)?.[1] || ''

assert.ok(resolvedPlaceholderColor, 'expected resolvedPlaceholderColor computed property')
assert.match(
    resolvedPlaceholderColor,
    /this\.placeholderColor \|\| this\.upThemeVar\('--up-tips-color'/,
    'expected resolvedPlaceholderColor to prefer the placeholderColor prop'
)

console.log('search placeholder color assertions passed')
