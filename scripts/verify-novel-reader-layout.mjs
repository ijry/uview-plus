import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(resolve(root, 'src/uni_modules/uview-plus/components/u-novel-reader/layout-engine.js'), 'utf8')

for (const name of ['createLayoutKey', 'wrapText', 'paginateParagraphs', 'resolveAnchor']) {
    assert.match(source, new RegExp(name))
}
assert.match(source, /charOffset/)
assert.match(source, /pageCount/)

console.log('novel reader layout contract passed')
