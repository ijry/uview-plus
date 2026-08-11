import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const normalizer = readFileSync(resolve(root, 'src/uni_modules/uview-plus/components/u-novel-reader/content-normalizer.js'), 'utf8')
const core = readFileSync(resolve(root, 'src/uni_modules/uview-plus/components/u-novel-reader/reader-core.js'), 'utf8')
const persistence = readFileSync(resolve(root, 'src/uni_modules/uview-plus/components/u-novel-reader/persistence.js'), 'utf8')
const component = readFileSync(resolve(root, 'src/uni_modules/uview-plus/components/u-novel-reader/u-novel-reader.vue'), 'utf8')

for (const name of ['normalizeContent', 'normalizeProgress']) {
    assert.match(normalizer, new RegExp(name))
}
for (const name of ['toggleControls', 'setMode', 'setSettings', 'setProgress', 'toggleBookmark']) {
    assert.match(core, new RegExp(name))
}
assert.match(persistence, /STORAGE_VERSION\s*=\s*1/)
assert.match(persistence, /version:\s*STORAGE_VERSION/)
assert.match(persistence, /setStorageSync/)
assert.match(persistence, /JSON\.parse/)
for (const token of [
    'readPersistedState',
    'writePersistedState',
    'chapter-prefetch',
    'reading-time-change',
    'retry',
    'storageKey',
    'bookId'
]) {
    assert.match(component, new RegExp(token))
}

console.log('novel reader data contract passed')
