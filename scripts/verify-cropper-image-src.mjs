import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const cropper = read('src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue')
const demo = read('src/pages/componentsD/cropper/cropper.nvue')
const changelog = read('src/uni_modules/uview-plus/changelog.md')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
  packageJson.scripts['verify:cropper-image-src'],
  'node scripts/verify-cropper-image-src.mjs',
  'expected package.json to expose verify:cropper-image-src'
)
assert.match(
  cropper,
  /loadImage\(path\)\s*\{[\s\S]*uni\.getImageInfo\(\{[\s\S]*src:\s*path/,
  'expected a shared loadImage(path) method to own image info loading'
)
assert.match(
  cropper,
  /success:\s*\(r\)\s*=>\s*\{[\s\S]*this\.loadImage\(r\.tempFilePaths\[0\]\)/,
  'expected system picker success to reuse loadImage(path)'
)
assert.match(
  cropper,
  /const\s+imageSrc\s*=\s*typeof\s+params\?\.imageSrc\s*===\s*['"]string['"]\s*\?\s*params\.imageSrc\.trim\(\)\s*:\s*['"]['"]/,
  'expected chooseImage to accept only a trimmed string imageSrc'
)
assert.match(
  cropper,
  /if\s*\(imageSrc\)\s*\{[\s\S]*this\.loadImage\(imageSrc\)[\s\S]*return[\s\S]*\}[\s\S]*this\.select\(\)/,
  'expected a valid imageSrc to bypass select and invalid values to keep select'
)
assert.match(
  demo,
  /uni\.chooseImage\([\s\S]*tempFilePaths\[0\][\s\S]*chooseImage\([\s\S]*imageSrc:/,
  'expected demo to obtain a temp path before passing imageSrc to cropper'
)
assert.match(
  changelog,
  /cropper[\s\S]*imageSrc|imageSrc[\s\S]*cropper/,
  'expected changelog to mention cropper imageSrc support'
)

console.log('cropper external image source assertions passed')
