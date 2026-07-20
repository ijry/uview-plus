import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path) => readFileSync(resolve(repoRoot, path), 'utf8')

const migratedComponents = [
  'src/uni_modules/uview-plus/components/u-barcode/u-barcode.vue',
  'src/uni_modules/uview-plus/components/u-qrcode/u-qrcode.vue',
  'src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue',
  'src/uni_modules/uview-plus/components/u-poster/u-poster.vue',
  'src/uni_modules/uview-plus/components/u-upload/u-upload.vue'
]

const requiredCanvasMethods = [
  'getCanvasElement',
  'getRawContext',
  'toTempFilePath',
  'exportImage',
  'getImageData',
  'putImageData',
  'drawImage',
  'fillRect',
  'strokeRect',
  'measureText',
  'createLinearGradient',
  'createRadialGradient',
  'clip',
  'setGlobalAlpha'
]

for (const file of migratedComponents) {
  const source = read(file)
  if (/<canvas\b/.test(source)) {
    throw new Error(`${file} still declares a native canvas`)
  }
  if (!/<up-canvas\b/.test(source)) {
    throw new Error(`${file} does not use up-canvas`)
  }
}

const upCanvas = read('src/uni_modules/uview-plus/components/u-canvas/u-canvas.vue')
for (const method of requiredCanvasMethods) {
  if (!new RegExp(`${method}\\s*\\(`).test(upCanvas)) {
    throw new Error(`up-canvas is missing ${method}()`)
  }
}

console.log('up-canvas unification checks passed')
