import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const cropper = readFileSync(
  resolve(root, 'src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue'),
  'utf8'
)
const demo = readFileSync(
  resolve(root, 'src/pages/componentsD/cropper/cropper.nvue'),
  'utf8'
)
const changelog = readFileSync(
  resolve(root, 'src/uni_modules/uview-plus/changelog.md'),
  'utf8'
)

assert.match(cropper, /inner:\s*false/, 'expected inner prop default false')
assert.match(
  cropper,
  /this\.letRotate\s*=\s*\(canRotate\s*===\s*false\s*\|\|\s*this\.isin\)\s*\?\s*0\s*:\s*1/,
  'expected chooseImage to disable rotate when inner/isin is active'
)
assert.match(
  cropper,
  /this\.letRotate\s*=\s*\(this\.canRotate\s*===\s*false\s*\|\|\s*this\.inner\s*===\s*true\)\s*\?\s*0\s*:\s*1/,
  'expected created() to disable rotate when inner is true'
)
assert.match(
  cropper,
  /if\s*\(\s*this\.isin\s*\)[\s\S]*imgL[\s\S]*imgR/,
  'expected resize path to clamp crop box inside image when isin'
)
assert.match(demo, /inner:\s*true/, 'expected demo to show inner usage via chooseImage params')
assert.match(changelog, /inner/, 'expected changelog to mention inner')

console.log('cropper inner assertions passed')
