import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const componentDir = resolve(root, 'src/uni_modules/uview-plus/components/u-novel-reader')
const source = readFileSync(resolve(componentDir, 'u-novel-reader.vue'), 'utf8')
const toolbar = readFileSync(resolve(componentDir, 'reader-toolbar.vue'), 'utf8')
const settings = readFileSync(resolve(componentDir, 'reader-settings.vue'), 'utf8')

for (const token of ['u-status-bar', 'u-safe-bottom', 'u-popup']) {
    assert.match(source, new RegExp(token))
}
for (const token of ['arrow-left', 'showBack', 'toggle-controls']) {
    assert.match(toolbar, new RegExp(token))
}
assert.match(settings, /u-slider/)
for (const theme of ['day', 'paper', 'green', 'night', 'dark']) {
    assert.match(source + settings, new RegExp(theme))
}
console.log('novel reader UI contract passed')
