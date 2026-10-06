import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')
const navbar = read('src/uni_modules/uview-plus/components/u-navbar/u-navbar.vue')
const navbarProps = read('src/uni_modules/uview-plus/components/u-navbar/props.js')
const navbarDefaults = read('src/uni_modules/uview-plus/components/u-navbar/navbar.js')
const navbarTypes = read('src/uni_modules/uview-plus/types/comps/navbar.d.ts')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:navbar-avoid-capsule'],
    'node scripts/verify-navbar-avoid-capsule.mjs'
)
assert.match(
    navbar,
    /navbarRightStyle/,
    'expected u-navbar to compute a right style for capsule avoidance'
)
assert.match(
    navbar,
    /getMenuButtonBoundingClientRect/,
    'expected u-navbar to read the WeChat capsule rect'
)
assert.match(
    navbar,
    /navbarRightStyle[\s\S]*?#ifdef MP-WEIXIN/,
    'expected capsule avoidance to be compiled only for mp-weixin'
)
assert.match(
    navbar,
    /avoidCapsule/,
    'expected u-navbar to respect the avoidCapsule prop'
)
assert.match(
    navbarProps,
    /avoidCapsule:\s*\{[\s\S]*?default:\s*\(\)\s*=>\s*defProps\.navbar\.avoidCapsule/,
    'expected the avoidCapsule prop to be registered'
)
assert.match(
    navbarProps,
    /default:\s*\(\)\s*=>\s*defProps\.navbar\.scrollTop\s*\},/,
    'expected scrollTop prop to be comma-terminated before avoidCapsule'
)
assert.match(
    navbarDefaults,
    /avoidCapsule:\s*true/,
    'expected avoidCapsule to default to true'
)
assert.match(
    navbarTypes,
    /avoidCapsule\?:\s*boolean/,
    'expected NavbarProps to expose avoidCapsule'
)

console.log('navbar avoid-capsule assertions passed')
