import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = path => readFileSync(resolve(repoRoot, path), 'utf8')

const canvasSource = read('src/uni_modules/uview-plus/components/u-canvas/u-canvas.vue')
const qrcodeSource = read('src/uni_modules/uview-plus/components/u-qrcode/u-qrcode.vue')
const posterSource = read('src/uni_modules/uview-plus/components/u-poster/u-poster.vue')
const demoPosterSource = read('src/pages/componentsD/poster/poster.nvue')
const appNvuePosterStyle = posterSource.match(/\/\* #ifdef APP-NVUE \*\/([\s\S]*?)\/\* #endif \*\//)?.[1] || ''

assert.match(
    qrcodeSource,
    /#ifdef APP-NVUE[\s\S]*<up-canvas/,
    'APP-NVUE QR codes should render through up-canvas'
)
assert.doesNotMatch(
    qrcodeSource,
    /<web-view|_makeWebViewCode|_saveWebViewImage/,
    'u-qrcode should not own an APP-NVUE WebView bridge'
)
assert.match(
    posterSource,
    /const generatedPath = await qrCode\._makeCode\(\)[\s\S]*if \(!tempFilePath\)[\s\S]*qrCode\.toTempFilePath/,
    'poster QR generation should wait for drawing and only export when no path was returned'
)
assert.match(
    posterSource,
    /async generateQRCode\([\s\S]*catch \(error\)[\s\S]*throw new Error/,
    'poster QR generation should reject failures instead of leaving a pending promise'
)
assert.match(
    qrcodeSource,
    /async refreshCanvas\(force\s*=\s*false\)[\s\S]*initCanvas\(force\)/,
    'QR code refresh should reuse the existing renderer by default'
)
assert.match(
    posterSource,
    /await qrCode\.refreshCanvas\(\)[\s\S]*await qrCode\._makeCode\(\)/,
    'poster QR generation should reuse the prepared QR renderer before drawing'
)
assert.match(
    posterSource,
    /async getPosterCanvas\([\s\S]*await posterCanvas\.initCanvas\(\)/,
    'poster should initialize the shared up-canvas renderer'
)
assert.match(
    posterSource,
    /await this\.flushPosterCanvas\(posterCanvas\)[\s\S]*toTempFilePath/,
    'poster export should wait for the draw acknowledgement before export'
)
assert.doesNotMatch(
    posterSource,
    /waitForNativeRender/,
    'poster export should not depend on a native render delay'
)
assert.match(
    posterSource,
    /#ifdef APP-NVUE[\s\S]*&__renderer[\s\S]*width:\s*1px[\s\S]*height:\s*1px[\s\S]*overflow:\s*hidden/,
    'APP-NVUE poster renderers should stay renderable inside a clipped native wrapper'
)
assert.match(
    posterSource,
    /<view\s+v-if="showCanvas"\s+class="up-poster__renderer">[\s\S]*?<up-canvas/,
    'the poster canvas should be clipped by a native wrapper instead of styled through the child component'
)
assert.match(
    posterSource,
    /<view\s+class="up-poster__renderer">[\s\S]*?<up-qrcode/,
    'the hidden QR generator should be clipped by a native wrapper'
)
assert.doesNotMatch(
    appNvuePosterStyle,
    /display:\s*none/,
    'active APP-NVUE QR canvas should not be removed from native layout'
)
assert.match(
    posterSource,
    /const drawn = await ctx\.drawImage\(qrCodeImageUrl/,
    'poster should draw the generated local QR image directly through up-canvas'
)
assert.match(
    posterSource,
    /case ['"]text['"]:[\s\S]*setFillStyle\(css\.color\s*\|\|\s*['"]#000000['"]\)/,
    'poster text should use a visible default color instead of inheriting the background fill'
)
assert.match(
    posterSource,
    /case ['"]text['"]:[\s\S]*await this\.drawTextWithLineClamp/,
    'poster text layout should wait for accurate Canvas measurements'
)
assert.match(
    posterSource,
    /async drawTextWithLineClamp[\s\S]*measureTextAsync[\s\S]*findTextFitLength/,
    'poster text wrapping should use asynchronous measurement with bounded fitting'
)
assert.doesNotMatch(
    qrcodeSource,
    /^let qrcode$/m,
    'QR code renderer state should not be shared across component instances'
)
assert.match(
    qrcodeSource,
    /this\._qrcode\s*=\s*new QRCode/,
    'each QR code component should own its renderer instance'
)
assert.match(
    demoPosterSource,
    /posterPreviewWidth[\s\S]*posterPreviewHeight/,
    'APP-NVUE poster preview should track explicit pixel dimensions'
)
assert.match(
    demoPosterSource,
    /updatePosterPreviewSize\(result\.width, result\.height\)/,
    'poster preview should derive its display size from the exported dimensions'
)
assert.doesNotMatch(
    demoPosterSource,
    /\.poster-preview\s*\{[\s\S]*width:\s*100%|\.poster-image\s*\{[\s\S]*width:\s*100%/,
    'APP-NVUE poster preview should not rely on percentage width styles'
)

console.log('APP-NVUE QR code and poster assertions passed')
