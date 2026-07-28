import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')
const button = read('src/uni_modules/uview-plus/components/u-button/u-button.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:button-plain-background'],
    'node scripts/verify-button-plain-background.mjs'
)

assert.match(
    button,
    /\$u-button-plain-background-color:\s*var\(--up-button-plain-background-color,\s*transparent\)\s*!default;/,
    'expected Vue plain button background to default to transparent'
)
assert.doesNotMatch(
    button,
    /\$u-button-plain-background-color:\s*var\(--up-button-plain-background-color,\s*var\(--up-card-bg-color,\s*#fff\)\)\s*!default;/,
    'expected Vue plain button background not to fall back to card background'
)
assert.match(
    button,
    /&--plain\s*\{[\s\S]*background-color:\s*\$u-button-plain-background-color;/,
    'expected plain class to keep using the configurable plain background variable'
)

const nvuePlainBackgroundColor = button.match(
    /nvuePlainBackgroundColor\(\) \{([\s\S]*?)\n        \},/
)?.[1] || ''

assert.ok(nvuePlainBackgroundColor, 'expected nvuePlainBackgroundColor computed property')
assert.match(
    nvuePlainBackgroundColor,
    /this\.upThemeVar\(\s*'--up-button-plain-background-color',\s*'transparent'\s*\)/,
    'expected nvue plain button background to default to transparent'
)
assert.doesNotMatch(
    nvuePlainBackgroundColor,
    /--up-card-bg-color|#ffffff|#1c1c1e/,
    'expected nvue plain button background not to fall back to card background'
)

console.log('button plain background assertions passed')
