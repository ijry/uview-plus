import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const navbarSource = readFileSync(
    resolve(__dirname, '../src/uni_modules/uview-plus/components/u-navbar/u-navbar.vue'),
    'utf8'
)

assert.match(
    navbarSource,
    /class="u-navbar__inner"[\s\S]*:style="\[\s*navbarInnerStyle\s*\]"/,
    'expected u-navbar to bind continuous background styles on u-navbar__inner'
)

assert.match(
    navbarSource,
    /<u-status-bar\s+v-if="safeAreaInsetTop"\s*><\/u-status-bar>/,
    'expected u-status-bar to remain as a transparent safe-area placeholder'
)

assert.doesNotMatch(
    navbarSource,
    /<u-status-bar[\s\S]*:bgColor=/,
    'u-navbar must not pass a separate background color into u-status-bar'
)

assert.match(
    navbarSource,
    /backgroundColor:\s*'transparent'/,
    'expected navbar content background to be transparent'
)

assert.match(
    navbarSource,
    /navbarInnerStyle\(\)[\s\S]*style\.background\s*=\s*this\.navbarBgColor/,
    'expected navbarInnerStyle to use CSS background instead of only backgroundColor'
)

console.log('navbar safe-area background assertions passed')
