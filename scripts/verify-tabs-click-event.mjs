import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')
const tabs = read('src/uni_modules/uview-plus/components/u-tabs/u-tabs.vue')
const tabsTypes = read('src/uni_modules/uview-plus/types/comps/tabs.d.ts')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:tabs-click-event'],
    'node scripts/verify-tabs-click-event.mjs'
)
assert.match(
    tabs,
    /@tap="clickHandler\(item,\s*index,\s*\$event\)"/,
    'expected the tabs item to pass the original tap event'
)
assert.match(
    tabs,
    /clickHandler\(item,\s*index,\s*event\)\s*\{/,
    'expected clickHandler to accept the original event'
)
assert.match(
    tabs,
    /this\.\$emit\('click',\s*\{[\s\S]*?\.\.\.item,[\s\S]*?index[\s\S]*?\},\s*index,\s*event\)/,
    'expected click to append the original event after item and index'
)
assert.match(
    tabsTypes,
    /onClick\?:\s*\(item:\s*any,\s*index:\s*number,\s*event:\s*any\)\s*=>\s*any/,
    'expected TabsProps.onClick to expose the third event argument'
)

console.log('tabs click event assertions passed')
