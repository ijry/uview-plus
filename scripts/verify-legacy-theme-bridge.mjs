import assert from 'node:assert/strict'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as sass from 'sass'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixturePath = resolve(__dirname, 'fixtures/legacy-theme-bridge.scss')
const { css } = sass.compile(fixturePath, {
  style: 'expanded',
  loadPaths: [resolve(__dirname, '..')],
})

assert.match(
  css,
  /--up-light-primary:\s*#123456;/,
  'expected legacy light primary bridge token to be emitted'
)
assert.match(
  css,
  /--up-light-main-color:\s*#112233;/,
  'expected legacy light main-color bridge token to be emitted'
)
assert.match(
  css,
  /--up-light-border-color:\s*#445566;/,
  'expected legacy light border-color bridge token to be emitted'
)
assert.match(
  css,
  /--up-primary:\s*var\(--up-light-primary,\s*#3c9cff\);/,
  'expected light final primary token to reference the bridge token'
)
assert.match(
  css,
  /\[data-up-theme=(?:'dark'|"dark"|dark)\][\s\S]*--up-main-color:\s*#f5f5f5;/,
  'expected dark main-color to stay on framework default'
)

console.log('legacy theme bridge css assertions passed')
