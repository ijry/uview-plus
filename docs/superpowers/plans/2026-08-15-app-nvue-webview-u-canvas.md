# APP-NVUE WebView u-canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the APP-NVUE GCanvas backend with a WebView-backed Canvas 2D proxy while keeping `u-canvas` as the only public drawing API.

**Architecture:** `u-canvas` records APP-NVUE Canvas calls in a local proxy context and sends serialized batches to a generic HTML Canvas runtime. The runtime executes only whitelisted Canvas 2D operations, returns request-scoped acknowledgements and exports files through `plus.nativeObj.Bitmap`; H5, mini-program and APP-VUE continue using their existing Canvas implementations.

**Tech Stack:** Vue 3, uni-app APP-NVUE, HTML Canvas 2D, `<web-view>`, `evalJs`, `uni.postMessage`, HTML5+ Bitmap, Node.js static verification scripts.

## Global Constraints

- `u-canvas` is the only public Canvas API; callers must not communicate with `local.html` directly.
- APP-NVUE must not render or export through GCanvas after this work.
- H5, mini-program and APP-VUE behavior must remain unchanged.
- `u-qrcode` and `u-poster` keep their existing public props, events and return values.
- Do not add ECharts or another chart dependency.
- Do not execute arbitrary caller-provided JavaScript in the WebView.
- Preserve unrelated dirty-worktree changes and do not create a git commit.

---

### Task 1: Add failing WebView backend contracts

**Files:**
- Create: `scripts/verify-app-nvue-webview-canvas.mjs`
- Modify: `scripts/verify-app-nvue-qrcode-poster.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: source text for `u-canvas`, `u-qrcode`, `u-poster`, `local.html`, the new proxy helper and runtime.
- Produces: `npm run verify:app-nvue-webview-canvas` and updated poster/QR integration assertions.

- [ ] **Step 1: Add the core failing verifier**

Create a Node assertion script that reads the target files and locks the agreed architecture:

```js
import assert from 'node:assert/strict'
import fs from 'node:fs'

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
```

- [ ] **Step 2: Update QR and poster integration assertions**

Replace obsolete APP-NVUE GCanvas assertions with these contracts:

```js
assert.match(qrcodeSource, /#ifdef APP-NVUE[\s\S]*<up-canvas/)
assert.doesNotMatch(qrcodeSource, /<web-view|_makeWebViewCode|_saveWebViewImage/)
assert.match(posterSource, /await this\.flushPosterCanvas\(posterCanvas\)[\s\S]*toTempFilePath/)
assert.doesNotMatch(posterSource, /waitForNativeRender/)
```

- [ ] **Step 3: Register the verifier command**

Add the package script without changing unrelated scripts:

```json
"verify:app-nvue-webview-canvas": "node scripts/verify-app-nvue-webview-canvas.mjs"
```

- [ ] **Step 4: Run both verifiers and confirm failure**

Run:

```powershell
npm run verify:app-nvue-webview-canvas
npm run verify:app-nvue-qrcode-poster
```

Expected: both fail because `u-canvas` still contains APP-NVUE GCanvas and the generic runtime/proxy files do not exist.

### Task 2: Build the generic WebView Canvas runtime

**Files:**
- Create: `src/static/app-plus/up-canvas/js/canvas-runtime.js`
- Modify: `src/static/app-plus/up-canvas/local.html`

**Interfaces:**
- Consumes: chunked JSON requests sent through `webView.evalJs`.
- Produces: `window.__upCanvasRuntime.receiveChunk(requestId, index, total, chunk)` and post-message actions `canvasReady`, `canvasResponse`, `canvasTouch`, `canvasError`.

- [ ] **Step 1: Reduce `local.html` to a generic host**

Keep one Canvas element and load only the WebView bridge plus runtime:

```html
<canvas id="up-canvas"></canvas>
<script src="./js/uni.webview.min.js"></script>
<script src="./js/canvas-runtime.js"></script>
```

Remove `qrcode.min.js`, QR-specific state and `setContent()`.

- [ ] **Step 2: Implement the request and chunk protocol**

Define a single global runtime with request-scoped chunk storage:

```js
window.__upCanvasRuntime = {
  receiveChunk(requestId, index, total, chunk) {
    // Store exact string chunks by index and execute after all chunks arrive.
  },
  async executeRequest(request) {
    // Dispatch init, draw, export, measureText, getImageData and putImageData.
  }
}
```

Post all responses through:

```js
function postMessage(action, data) {
  uni.postMessage({
    data: Object.assign({ channel: 'u-canvas', action }, data || {})
  })
}
```

Use `requestId` on every `canvasResponse` and `canvasError`. Return request results through:

```js
postMessage('canvasResponse', { requestId, result })
```

Delete completed chunk buffers in `finally`.

- [ ] **Step 3: Implement the Canvas command executor**

Whitelist and execute these operation groups:

```js
const methodOperations = new Set([
  'rect', 'clearRect', 'fillRect', 'strokeRect', 'fill', 'stroke',
  'beginPath', 'closePath', 'moveTo', 'lineTo', 'arc', 'arcTo',
  'bezierCurveTo', 'quadraticCurveTo', 'ellipse', 'clip', 'save',
  'restore', 'translate', 'rotate', 'scale', 'setTransform',
  'transform', 'resetTransform', 'fillText', 'strokeText'
])

const writableProperties = new Set([
  'fillStyle', 'strokeStyle', 'lineWidth', 'lineCap', 'lineJoin',
  'miterLimit', 'globalAlpha', 'globalCompositeOperation', 'font',
  'textAlign', 'textBaseline', 'shadowOffsetX', 'shadowOffsetY',
  'shadowBlur', 'shadowColor', 'lineDashOffset'
])
```

Reject unknown operations instead of evaluating them. Resolve resource references for images, gradients and patterns before applying a method or property.

- [ ] **Step 4: Implement Canvas resources**

Support request-local resources with stable IDs:

```js
{
  type: 'gradient',
  id: 'gradient-1',
  kind: 'linear',
  args: [0, 0, 100, 0],
  stops: [[0, '#fff'], [1, '#000']]
}
```

Load image Data URLs asynchronously before executing `drawImage` or `createPattern`. Cache decoded images by source for the WebView session.

- [ ] **Step 5: Implement draw, export and pixel responses**

For `draw`, clear the previous bitmap before commands when `reserve === false`, execute commands in order, then post `canvasResponse` with an empty result object.

For export, crop and scale through a temporary HTML Canvas when requested, call `toDataURL`, then prefer:

```js
const bitmap = new plus.nativeObj.Bitmap(`u-canvas-${requestId}`)
bitmap.loadBase64Data(imageData, () => {
  bitmap.save(`_doc/u-canvas-${requestId}.png`, { overwrite: true }, event => {
    postMessage('canvasResponse', {
      requestId,
      result: { tempFilePath: event.target }
    })
  }, fail)
}, fail)
```

Fall back to returning `imageData` only when HTML5+ Bitmap is unavailable.

- [ ] **Step 6: Forward touch events**

Listen on the HTML Canvas and post `canvasTouch` with normalized coordinates for `touchstart`, `touchmove` and `touchend`. Include `canvasWidth`, `canvasHeight` and request-independent session identity in the event payload.

- [ ] **Step 7: Syntax-check the runtime**

Run:

```powershell
node --check src/static/app-plus/up-canvas/js/canvas-runtime.js
```

Expected: exit 0.

### Task 3: Add the APP-NVUE proxy context to u-canvas

**Files:**
- Create: `src/uni_modules/uview-plus/libs/util/app-nvue-webview-canvas.js`
- Modify: `src/uni_modules/uview-plus/components/u-canvas/u-canvas.vue`

**Interfaces:**
- Produces: `createWebViewCanvasContext(bridge)` and the existing `u-canvas` public methods backed by WebView on APP-NVUE.
- Consumes: runtime actions and `webView.evalJs`.

- [ ] **Step 1: Implement the bridge request manager**

Create a bridge that owns readiness, monotonically increasing request IDs, pending promises and 64 KiB string chunks:

```js
export function createWebViewCanvasBridge(options) {
  return {
    ready() {},
    request(type, payload, timeout = 15000) {},
    handleMessage(message) {},
    destroy() {}
  }
}
```

Serialize `{ requestId, type, payload }`, split the exact JSON string, and invoke:

```js
webView.evalJs(
  `window.__upCanvasRuntime.receiveChunk(${JSON.stringify(requestId)}, ${index}, ${total}, ${JSON.stringify(chunk)})`
)
```

Clear request timeouts on resolve, reject and destroy.

- [ ] **Step 2: Implement the synchronous proxy context**

Export `createWebViewCanvasContext({ bridge, resolveImage, measureText })`. Record commands locally and define Canvas properties with `Object.defineProperties`.

Method calls enqueue:

```js
{ type: 'call', method: 'arcTo', args: [x1, y1, x2, y2, radius] }
```

Property assignments enqueue:

```js
{ type: 'set', property: 'fillStyle', value: '#fff' }
```

Expose both standard properties and uni Canvas aliases such as `setFillStyle`, `setStrokeStyle`, `setLineWidth`, `setFontSize`, `setTextAlign`, `setTextBaseline`, `setGlobalAlpha`, `setMiterLimit` and `setShadow`.

- [ ] **Step 3: Implement proxy resources**

Return local gradient objects synchronously:

```js
const gradient = {
  __upCanvasResource: true,
  id,
  addColorStop(offset, color) {
    stops.push([Number(offset), String(color)])
  }
}
```

When a gradient or pattern is assigned to `fillStyle` or `strokeStyle`, serialize a resource reference rather than the object itself.

- [ ] **Step 4: Implement draw and async APIs**

`draw(reserve = false, callback)` snapshots the current command/resource queue, sends one `draw` request and invokes the callback after acknowledgement. It returns the same Promise.

Add exact remote APIs:

```js
context.measureTextAsync = text => bridge.request('measureText', { text, font: state.font })
context.getImageData = (...args) => bridge.request('getImageData', normalizeImageDataArgs(args))
context.putImageData = (...args) => bridge.request('putImageData', normalizePutImageDataArgs(args))
context.toTempFilePath = options => bridge.request('export', options)

function normalizeImageDataArgs(args) {
  if (args.length === 1 && args[0] && typeof args[0] === 'object') return args[0]
  return { x: args[0], y: args[1], width: args[2], height: args[3] }
}

function normalizePutImageDataArgs(args) {
  if (args.length === 1 && args[0] && typeof args[0] === 'object') return args[0]
  return { data: args[0], x: args[1], y: args[2], width: args[3], height: args[4] }
}
```

Keep synchronous `measureText()` using the existing deterministic width fallback.

- [ ] **Step 5: Replace APP-NVUE GCanvas in the template**

Render the generic host:

```vue
<!-- #ifdef APP-NVUE -->
<web-view
  ref="web"
  class="u-canvas__canvas"
  src="/static/app-plus/up-canvas/local.html"
  :style="{ width: actualWidth + unit, height: actualHeight + unit }"
  @onPostMessage="onWebViewMessage"
/>
<!-- #endif -->
```

Remove APP-NVUE imports from the GCanvas library. Keep all non-NVUE template branches unchanged.

- [ ] **Step 6: Initialize the proxy as the APP-NVUE context**

During `initCanvas()` create the bridge and proxy once, wait for `canvasReady`, send logical width, height and DPR, then emit the existing `ready` event. Repeated initialization must reuse the same bridge unless the component is destroyed.

`getRawContext()` and `getCanvasContext()` both return the proxy on APP-NVUE.

- [ ] **Step 7: Add missing u-canvas wrappers**

Add component methods for:

```text
arcTo, ellipse, setTransform, transform, resetTransform,
setMiterLimit, setLineDash, getLineDash, strokeText,
createPattern, setGlobalCompositeOperation, measureTextAsync
```

All wrappers use the same `callContext` or explicit property setter pattern as existing methods.

- [ ] **Step 8: Resolve APP-NVUE images as Data URLs**

For string image sources, call `uni.getImageInfo`, read the returned local path through `plus.io.FileReader.readAsDataURL`, cache by original source, and enqueue the Data URL. Reject image failures instead of silently drawing a placeholder inside `u-canvas`.

- [ ] **Step 9: Forward runtime messages and destroy cleanly**

Normalize `event.detail.data`, pass `channel === 'u-canvas'` messages to the bridge, emit touch events, and reject pending work from `beforeUnmount()`.

- [ ] **Step 10: Run the core verifier**

Run:

```powershell
npm run verify:app-nvue-webview-canvas
npm run verify:up-canvas-unification
npm run verify:app-canvas-hidpi
```

Expected: all pass.

### Task 4: Route u-qrcode through u-canvas

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-qrcode/u-qrcode.vue`
- Verify: `src/uni_modules/uview-plus/components/u-qrcode/qrcode.js`

**Interfaces:**
- Consumes: APP-NVUE `u-canvas` proxy context and existing QRCode drawing algorithm.
- Produces: the same `result`, `_makeCode()` and `toTempFilePath()` behavior without a QR-specific WebView.

- [ ] **Step 1: Use up-canvas on every supported platform**

Remove the APP-NVUE `<web-view>` and APP-NVUE result-only image generator branch. Render `up-canvas` for APP-NVUE as well as existing platforms, while keeping the result image used for preview where required.

- [ ] **Step 2: Remove the QR-specific bridge state**

Delete `_webViewReady`, request/timer fields and these methods:

```text
_onMessage, _makeWebViewCode, _dispatchWebViewRender,
_scheduleWebViewDispatch, _finishWebViewRender,
_resolveWebViewIcon, _readFileAsDataURL, _saveWebViewImage
```

- [ ] **Step 3: Initialize u-canvas uniformly**

`initCanvas(force)` always resolves `this.$refs.qrcodeCanvas`, calls `initCanvas(force)`, stores `canvasHost` and `ctx`, and returns whether the proxy/native context exists.

- [ ] **Step 4: Run the existing QR algorithm on APP-NVUE**

Remove the `_makeWebViewCode()` branch from `_makeCode()`. Continue constructing `new QRCode` with:

```js
{
  vuectx: this,
  ctx: this.ctx,
  canvasHost: this.canvasHost,
  isNvue: this.isNvue
}
```

The existing QR algorithm then queues rectangles, awaits `u-canvas.drawImage()` for a Logo, calls `draw(true)` and exports through `u-canvas.toTempFilePath()`.

- [ ] **Step 5: Preserve preview and export callbacks**

Keep `_result`, `preview`, `_saveCode`, `longpress` and public callback shapes unchanged. `toTempFilePath()` delegates to `canvasHost.toTempFilePath()` on every non-WebView-specific path.

- [ ] **Step 6: Run QR and overlay regressions**

Run:

```powershell
npm run verify:overlay-qrcode-canvas-init
npm run verify:app-nvue-qrcode-poster
```

Expected: both pass.

### Task 5: Simplify APP-NVUE poster export

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-poster/u-poster.vue`
- Modify: `docs/superpowers/specs/2026-08-14-app-nvue-poster-text-qrcode-design.md`
- Modify: `docs/superpowers/plans/2026-08-14-app-nvue-poster-text-qrcode.md`

**Interfaces:**
- Consumes: acknowledged `u-canvas.draw()` and WebView file export.
- Produces: unchanged `exportImage()` result `{ width, height, path, blob }`.

- [ ] **Step 1: Remove native GCanvas waiting**

Delete `waitForNativeRender()` and its call. Keep `flushPosterCanvas()` but resolve only after `posterCanvas.draw(false)` fulfils or invokes its callback.

- [ ] **Step 2: Export immediately after draw acknowledgement**

Use the existing dimensions and call:

```js
await this.flushPosterCanvas(posterCanvas)
const res = await posterCanvas.toTempFilePath({ width, height })
```

Keep the missing-path error and `finally` cleanup. Increase only the top-level poster timeout to 20 seconds because image conversion and WebView startup now share one bounded operation.

- [ ] **Step 3: Keep all drawing through u-canvas**

Do not add a poster renderer to `local.html`. Existing `drawItem`, rounded rectangle, text wrapping, gradients, images and QR composition must continue calling `u-canvas` methods.

- [ ] **Step 4: Supersede the old GCanvas design notes**

Add a short notice to the previous poster design and plan that APP-NVUE GCanvas timing/file-type workarounds are superseded by `2026-08-15-app-nvue-webview-u-canvas-design.md` and its implementation plan.

- [ ] **Step 5: Run the poster integration verifier**

Run:

```powershell
npm run verify:app-nvue-qrcode-poster
```

Expected: pass with no GCanvas timing assertion.

### Task 6: Validate build and compiled APP output

**Files:**
- Verify: all files changed in Tasks 1-5.

**Interfaces:**
- Produces: buildable APP-NVUE WebView Canvas backend ready for Android device testing.

- [ ] **Step 1: Run focused regressions**

Run:

```powershell
npm run verify:app-nvue-webview-canvas
npm run verify:app-nvue-qrcode-poster
npm run verify:up-canvas-unification
npm run verify:overlay-qrcode-canvas-init
npm run verify:app-canvas-hidpi
```

Expected: all pass.

- [ ] **Step 2: Check JavaScript and diff formatting**

Run:

```powershell
node --check src/static/app-plus/up-canvas/js/canvas-runtime.js
Get-Content -Raw 'src/uni_modules/uview-plus/libs/util/app-nvue-webview-canvas.js' | node --input-type=module --check
git diff --check -- package.json scripts/verify-app-nvue-webview-canvas.mjs scripts/verify-app-nvue-qrcode-poster.mjs src/static/app-plus/up-canvas/local.html src/static/app-plus/up-canvas/js/canvas-runtime.js src/uni_modules/uview-plus/libs/util/app-nvue-webview-canvas.js src/uni_modules/uview-plus/components/u-canvas/u-canvas.vue src/uni_modules/uview-plus/components/u-qrcode/u-qrcode.vue src/uni_modules/uview-plus/components/u-poster/u-poster.vue docs/superpowers/specs/2026-08-14-app-nvue-poster-text-qrcode-design.md docs/superpowers/plans/2026-08-14-app-nvue-poster-text-qrcode.md docs/superpowers/specs/2026-08-15-app-nvue-webview-u-canvas-design.md docs/superpowers/plans/2026-08-15-app-nvue-webview-u-canvas.md
```

Expected: exit 0.

- [ ] **Step 3: Build the APP target**

Run:

```powershell
npm run build:app
```

Expected: exit 0. Existing unrelated NVUE CSS compatibility warnings are allowed.

- [ ] **Step 4: Inspect the compiled poster page**

Run:

```powershell
rg -n -o "canvas-runtime|__upCanvasRuntime|receiveChunk|arcTo|canvasResponse" dist/build/app/pages/componentsD/poster/poster.js
```

Expected: the compiled APP poster bundle contains the WebView proxy/runtime protocol and no APP-NVUE GCanvas initialization for `u-canvas`.

- [ ] **Step 5: Hand off Android device verification**

Require a full APP rebuild and reinstall, not hot reload. Verify these cases on Android:

```text
1. Poster background, product image and all text are present.
2. Plain QR code is present and scannable.
3. QR code with a center Logo is present and scannable.
4. A custom arcTo/gradient/transform drawing displays correctly.
5. Poster export returns a file path before the 20-second timeout.
```
