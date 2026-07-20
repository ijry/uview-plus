# up-canvas Unified Canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move direct canvas consumers to `up-canvas` and make `up-canvas` the shared cross-platform canvas host.

**Architecture:** `up-canvas` owns native `<canvas>` and APP-NVUE `gcanvas` platform branches, exposes raw context/node access and compatibility wrappers, and emits `ready`. Business components use `ref` to call `up-canvas` APIs instead of declaring native canvas nodes.

**Tech Stack:** Vue 3 SFC, uni-app conditional compilation, existing gcanvas utility, Node verification scripts.

## Global Constraints

- Do not introduce new runtime dependencies.
- Do not change public props or emitted events unless needed for preserving behavior.
- Do not touch unrelated dirty files already present in the working tree.
- Commit messages must use Chinese with head and body if committing implementation work.
- Preserve APP-NVUE support by keeping `gcanvas` encapsulated inside `up-canvas`.

---

### Task 1: Add Static Verification

**Files:**
- Create: `scripts/verify-up-canvas-unification.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm run verify:up-canvas-unification`
- Consumes: component source files as text.

- [ ] **Step 1: Create a verifier script**

Create `scripts/verify-up-canvas-unification.mjs` that checks:

```js
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repoRoot = resolve(new URL('..', import.meta.url).pathname)
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
```

- [ ] **Step 2: Add package script**

Add this script in `package.json`:

```json
"verify:up-canvas-unification": "node scripts/verify-up-canvas-unification.mjs"
```

- [ ] **Step 3: Run verifier and expect failure**

Run: `npm run verify:up-canvas-unification`

Expected: fails because current components still declare native canvas and `up-canvas` lacks required methods.

### Task 2: Complete up-canvas

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-canvas/u-canvas.vue`

**Interfaces:**
- Produces: `ready` event with `{ width, height }`.
- Produces methods: `initCanvas(force = false)`, `refresh()`, `getCanvasNode()`, `getCanvasElement()`, `getRawContext()`, `toTempFilePath(options = {})`, `exportImage(fileType, quality)`, `getImageData(options)`, `putImageData(options)`, drawing wrappers.

- [ ] **Step 1: Replace node lifecycle**

Use the `ly-canvas` pattern for MP/H5 selector query results, APP-PLUS legacy context, and APP-NVUE `gcanvas`.

- [ ] **Step 2: Add compatibility wrappers**

Add wrappers for drawing, style, text, transforms, clip, image, gradients, alpha, export, and pixel read/write.

- [ ] **Step 3: Preserve signature behavior**

Keep `setLineStyle()`, `clearCanvas()`, `draw(isLastDraw)`, and `exportImage()` signatures used by `u-signature`.

### Task 3: Migrate u-barcode, u-poster, and u-upload

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-barcode/u-barcode.vue`
- Modify: `src/uni_modules/uview-plus/components/u-poster/u-poster.vue`
- Modify: `src/uni_modules/uview-plus/components/u-upload/u-upload.vue`

**Interfaces:**
- Consumes: `up-canvas` ref methods from Task 2.
- Produces: same public component props/events as before.

- [ ] **Step 1: Replace direct canvas tags**

Replace each native `<canvas>` with `<up-canvas>` and a stable `ref`.

- [ ] **Step 2: Replace context creation**

Replace `uni.createCanvasContext()` and direct selector query canvas lookup with `this.$refs.<canvasRef>.getRawContext()` or `initCanvas(true)`.

- [ ] **Step 3: Replace export calls**

Replace direct `uni.canvasToTempFilePath()` or `wx.canvasToTempFilePath()` with `up-canvas.toTempFilePath()`.

### Task 4: Migrate u-qrcode

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-qrcode/u-qrcode.vue`
- Modify: `src/uni_modules/uview-plus/components/u-qrcode/qrcode.js`

**Interfaces:**
- Consumes: `up-canvas` ref methods from Task 2.
- Produces: same qrcode generation and result callbacks as before.

- [ ] **Step 1: Replace platform canvas branches**

Use one `<up-canvas>` in the template for MP, H5, APP-PLUS, and APP-NVUE instead of native `<canvas>`, `gcanvas`, and qrcode-local web-view canvas branches.

- [ ] **Step 2: Move context ownership to up-canvas**

Make `getUPCanvasContext()` return `up-canvas.getRawContext()`.

- [ ] **Step 3: Replace export and clear paths**

Use `up-canvas.toTempFilePath()` and `up-canvas.clearCanvas()` where the qrcode component or helper needs export/clear behavior.

### Task 5: Migrate u-cropper

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue`

**Interfaces:**
- Consumes: `up-canvas` ref methods from Task 2.
- Produces: existing cropper user behavior and events.

- [ ] **Step 1: Replace three canvas layers**

Use three `<up-canvas>` layers with the existing canvas ids and CSS classes.

- [ ] **Step 2: Initialize contexts from refs**

Replace the three `uni.createCanvasContext()` calls with a helper that initializes the three `up-canvas` refs and stores raw contexts.

- [ ] **Step 3: Replace image export and pixel APIs**

Replace direct `uni.canvasToTempFilePath()`, `uni.canvasGetImageData()`, and `uni.canvasPutImageData()` calls with the corresponding `up-canvas` methods.

### Task 6: Verify

**Files:**
- Test: `scripts/verify-up-canvas-unification.mjs`

**Interfaces:**
- Consumes: all modified files.
- Produces: verification command output.

- [ ] **Step 1: Run static verifier**

Run: `npm run verify:up-canvas-unification`

Expected: passes.

- [ ] **Step 2: Run existing focused verifiers**

Run: `npm run verify:pagination`, `npm run verify:navbar-safe-area-background`, `npm run verify:calendar-popup-props`, `npm run verify:waterfall-distribution`

Expected: pass unless unrelated repository baseline has changed.

- [ ] **Step 3: Run a build**

Run: `npm run build:h5`

Expected: build completes or only fails with existing unrelated baseline issues. Any new canvas-related template or script errors must be fixed.
