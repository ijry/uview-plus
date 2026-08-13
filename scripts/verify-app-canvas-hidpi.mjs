import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const canvas = read('src/uni_modules/uview-plus/components/u-canvas/u-canvas.vue')
const poster = read('src/uni_modules/uview-plus/components/u-poster/u-poster.vue')
const qrcode = read('src/uni_modules/uview-plus/components/u-qrcode/u-qrcode.vue')
const barcode = read('src/uni_modules/uview-plus/components/u-barcode/u-barcode.vue')

assert.match(canvas, /const hasDestWidth = options\.destWidth !== undefined && options\.destWidth !== null/)
assert.match(canvas, /const hasDestHeight = options\.destHeight !== undefined && options\.destHeight !== null/)
assert.match(canvas, /\/\/ #ifdef APP-PLUS[\s\S]*?destWidth = Math\.round\(width \* this\.dpr\)/)
assert.match(canvas, /\/\/ #ifdef APP-PLUS[\s\S]*?destHeight = Math\.round\(height \* this\.dpr\)/)
assert.match(canvas, /destWidth,\s+destHeight,/, 'request should use the computed destination dimensions')
assert.doesNotMatch(canvas, /destWidth: this\.actualWidth/)
assert.doesNotMatch(canvas, /destHeight: this\.actualHeight/)

for (const [name, source] of Object.entries({ poster, qrcode, barcode })) {
  assert.doesNotMatch(source, /destWidth:\s*(?:width|this\.sizeLocal|this\.canvasWidth)/, name + ' should use up-canvas default DPR export')
  assert.doesNotMatch(source, /destHeight:\s*(?:height|this\.sizeLocal|this\.canvasHeight)/, name + ' should use up-canvas default DPR export')
}

console.log('APP-PLUS canvas HiDPI export assertions passed')
