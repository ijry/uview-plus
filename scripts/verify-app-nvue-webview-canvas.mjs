import assert from 'node:assert/strict'
import fs from 'node:fs'
import { Buffer } from 'node:buffer'

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const canvasSource = read('src/uni_modules/uview-plus/components/u-canvas/u-canvas.vue')
const proxySource = read('src/uni_modules/uview-plus/libs/util/app-nvue-webview-canvas.js')
const hostSource = read('src/static/app-plus/up-canvas/local.html')
const runtimeSource = read('src/static/app-plus/up-canvas/js/canvas-runtime.js')

assert.match(canvasSource, /#ifdef APP-NVUE[\s\S]*<web-view/)
assert.doesNotMatch(canvasSource, /#ifdef APP-NVUE[\s\S]*<gcanvas/)
assert.match(proxySource, /export function createWebViewCanvasContext/)
assert.match(proxySource, /arcTo[\s\S]*setTransform[\s\S]*resetTransform/)
assert.match(proxySource, /Object\.defineProperties[\s\S]*fillStyle[\s\S]*globalCompositeOperation/)
assert.match(runtimeSource, /receiveChunk[\s\S]*executeBatch[\s\S]*exportCanvas/)
assert.match(hostSource, /js\/canvas-runtime\.js/)
assert.doesNotMatch(hostSource, /qrcode\.min\.js|setContent\s*=/)
assert.match(
    canvasSource,
    /arcTo[\s\S]*ellipse[\s\S]*setTransform[\s\S]*resetTransform[\s\S]*setLineDash[\s\S]*strokeText[\s\S]*(?:createPattern[\s\S]*measureTextAsync|measureTextAsync[\s\S]*createPattern)/
)

const proxyModule = await import(
    `data:text/javascript;base64,${Buffer.from(proxySource).toString('base64')}`
)
const requests = []
const bridge = {
    request: async (type, payload) => {
        requests.push({ type, payload })
        if (type === 'export') return { tempFilePath: '_doc/u-canvas-test.png' }
        return {}
    }
}
const context = proxyModule.createWebViewCanvasContext({ bridge })
const gradient = context.createLinearGradient(0, 0, 100, 0)
gradient.addColorStop(0, '#fff')
gradient.addColorStop(1, '#000')
context.fillStyle = gradient
context.fillRect(0, 0, 100, 100)
context.drawImage('data:image/png;base64,AA==', 5, 5, 10, 10)
await context.draw(false)

assert.equal(requests[0].type, 'draw')
assert.equal(requests[0].payload.resources.length, 2)
assert.equal(requests[0].payload.commands.at(-1).method, 'drawImage')
assert.deepEqual(
    await context.toTempFilePath({ width: 100, height: 100 }),
    { tempFilePath: '_doc/u-canvas-test.png' }
)

console.log('APP-NVUE WebView canvas assertions passed')
