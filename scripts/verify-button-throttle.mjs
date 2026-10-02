import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { throttle } from '../src/uni_modules/uview-plus/libs/function/throttle.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))

assert.equal(
    packageJson.scripts['verify:button-throttle'],
    'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-button-throttle.mjs'
)

const originalSetTimeout = globalThis.setTimeout
let scheduledTimer = 0
globalThis.setTimeout = () => {
    scheduledTimer += 1
    return scheduledTimer
}

try {
    let callCount = 0
    throttle(() => {
        callCount += 1
    }, 0)
    throttle(() => {
        callCount += 1
    }, 0)

    assert.equal(scheduledTimer, 0, 'zero-delay throttle must not depend on a timer')
    assert.equal(callCount, 2, 'zero-delay throttle must not lock subsequent calls')
} finally {
    globalThis.setTimeout = originalSetTimeout
}

console.log('button throttle assertions passed')
