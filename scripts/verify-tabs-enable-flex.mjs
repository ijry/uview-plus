import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')
const tabs = read('src/uni_modules/uview-plus/components/u-tabs/u-tabs.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:tabs-enable-flex'],
    'node scripts/verify-tabs-enable-flex.mjs'
)
assert.match(
    tabs,
    /<scroll-view[^>]*enable-flex/,
    'expected the tabs scroll-view to enable flexbox for mp-weixin'
)
assert.match(
    tabs,
    /&__scroll-view\s*\{[^}]*align-items:\s*flex-start/s,
    'expected the tabs scroll-view style to keep align-items: flex-start to avoid height anomaly in enable-flex mode'
)

console.log('tabs enable-flex assertions passed')
