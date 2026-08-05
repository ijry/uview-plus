# Overlay QR Code Canvas Initialization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent concurrent `up-canvas` initialization from clearing an `up-qrcode` mounted inside `up-overlay`, and add an H5 regression example.

**Architecture:** Add an instance-scoped in-flight Promise to `up-canvas` so concurrent `initCanvas()` callers share one node query and one canvas reset. Keep `up-qrcode` and Overlay lifecycle APIs unchanged, then cover the failure with a deterministic Node verifier and a dynamic Overlay demo.

**Tech Stack:** Vue 3, uni-app, uview-plus components, Node.js assertions, H5 build.

## Global Constraints

- Primary reproduction and acceptance platform is H5.
- Do not change QR encoding or drawing algorithms.
- Do not change Overlay or Transition lifecycle behavior.
- Do not add dependencies or public component props/events.
- Do not bump versions, publish packages, push, or create Git commits.
- Preserve existing unrelated workspace changes, including `.claude/`.

## File Structure

- `src/uni_modules/uview-plus/components/u-canvas/u-canvas.vue`: owns initialization serialization for every canvas consumer.
- `src/pages/componentsA/overlay/overlay.nvue`: exposes the dynamic Overlay plus QR code regression scenario.
- `scripts/verify-overlay-qrcode-canvas-init.mjs`: executes the initialization race regression and checks the example wiring.
- `package.json`: exposes the focused verifier through an npm script.

---

### Task 1: Add Failing Initialization Regression

**Files:**
- Create: `scripts/verify-overlay-qrcode-canvas-init.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `u-canvas.vue` component options and `overlay.nvue` source.
- Produces: `npm run verify:overlay-qrcode-canvas-init` with deterministic assertions.

- [ ] **Step 1: Create the verifier**

Create `scripts/verify-overlay-qrcode-canvas-init.mjs` with this content:

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = path => readFileSync(resolve(repoRoot, path), 'utf8')

const canvasSource = read('src/uni_modules/uview-plus/components/u-canvas/u-canvas.vue')
const overlaySource = read('src/pages/componentsA/overlay/overlay.nvue')

function loadCanvasOptions() {
    const scriptBlock = canvasSource.match(/<script>([\s\S]*?)<\/script>/)
    assert.ok(scriptBlock, 'u-canvas should contain a script block')

    const executableScript = scriptBlock[1]
        .replace(/import[\s\S]*?from\s+['"][^'"]+['"];?/g, '')
        .replace(/export default\s*\{/, 'return {')

    return new Function(executableScript)()
}

function createCanvasInstance(options) {
    const context = {
        setTransform() {}
    }
    const canvasElement = {
        width: 0,
        height: 0
    }
    const instance = {
        useRootHeightAndWidth: false,
        canvasId: 'overlay-qrcode-race',
        ctx: null,
        actualWidth: 180,
        actualHeight: 180,
        dpr: 1,
        bgColor: 'transparent',
        $emit() {}
    }

    for (const [name, method] of Object.entries(options.methods)) {
        instance[name] = method.bind(instance)
    }

    options.created.call(instance)
    instance.getCanvasContext = () => context
    instance.applyFont = () => {}
    instance.clearCanvas = () => {}

    return { instance, canvasElement }
}

globalThis.uni = {
    getSystemInfoSync() {
        return { pixelRatio: 1 }
    },
    upx2px(value) {
        return Number(value)
    }
}

const options = loadCanvasOptions()
const { instance, canvasElement } = createCanvasInstance(options)
let nodeLookupCount = 0
let releaseNodeLookup
const nodeLookupGate = new Promise(resolveGate => {
    releaseNodeLookup = resolveGate
})

instance.getCanvasNode = async () => {
    nodeLookupCount += 1
    await nodeLookupGate
    return { node: canvasElement }
}

const firstInitialization = instance.initCanvas()
const secondInitialization = instance.initCanvas()
await Promise.resolve()

assert.equal(
    nodeLookupCount,
    1,
    'concurrent initCanvas calls should share one canvas node lookup'
)

releaseNodeLookup()
assert.deepEqual(
    await Promise.all([firstInitialization, secondInitialization]),
    [true, true],
    'all concurrent initCanvas callers should receive the shared initialization result'
)
assert.equal(canvasElement.width, 180, 'shared initialization should set canvas width once')
assert.equal(canvasElement.height, 180, 'shared initialization should set canvas height once')

assert.match(
    canvasSource,
    /this\._initPromise\s*=\s*null/,
    'u-canvas should store an instance-scoped initialization promise'
)
assert.match(
    canvasSource,
    /if\s*\(this\._initPromise\)\s*\{[\s\S]*return this\._initPromise/,
    'u-canvas should reuse an in-flight initialization'
)
assert.match(
    overlaySource,
    /const showQrcode = ref\(false\)/,
    'overlay example should expose an independent QR code state'
)
assert.match(
    overlaySource,
    /title:\s*'嵌入二维码'/,
    'overlay example should list the QR code scenario'
)
assert.match(
    overlaySource,
    /<up-qrcode[\s\S]*cid="overlay-qrcode"/,
    'overlay example should mount a uniquely identified QR code inside an overlay'
)

console.log('overlay qrcode canvas initialization assertions passed')
```

- [ ] **Step 2: Add the npm script**

Add this entry beside the other `verify:*` scripts in `package.json`:

```json
"verify:overlay-qrcode-canvas-init": "node scripts/verify-overlay-qrcode-canvas-init.mjs"
```

- [ ] **Step 3: Run the verifier and confirm the race**

Run:

```powershell
npm run verify:overlay-qrcode-canvas-init
```

Expected: FAIL with `concurrent initCanvas calls should share one canvas node lookup`, because the current implementation performs two node lookups.

---

### Task 2: Serialize up-canvas Initialization

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-canvas/u-canvas.vue`
- Test: `scripts/verify-overlay-qrcode-canvas-init.mjs`

**Interfaces:**
- Consumes: existing `initCanvas(force = false)` callers.
- Produces: the same `Promise<boolean>` contract with one shared in-flight initialization per component instance.

- [ ] **Step 1: Initialize private state**

Add the Promise field to `created()` after `_isNvue`:

```js
this._initPromise = null;
```

- [ ] **Step 2: Wrap the existing initialization body**

Keep `initCanvas(force = false)` as the public method and move its current body into `_initializeCanvas(force = false)`:

```js
async initCanvas(force = false) {
    if (this._initPromise) {
        return this._initPromise;
    }

    const initPromise = this._initializeCanvas(force);
    this._initPromise = initPromise;

    try {
        return await initPromise;
    } finally {
        if (this._initPromise === initPromise) {
            this._initPromise = null;
        }
    }
},
async _initializeCanvas(force = false) {
    try {
        if (this.useRootHeightAndWidth) {
            await this.setNewSize();
        }
        if (this.ctx && !force) {
            this.$emit('ready', {
                width: this.actualWidth,
                height: this.actualHeight
            });
            return true;
        }

        this._canvasNode = await this.getCanvasNode(this.canvasId);
        if (!this._canvasNode) {
            return false;
        }

        this._selectorResult = this._canvasNode;
        this._canvasElement = this._canvasNode.node || this._canvasNode;
        this.dpr = uni.getSystemInfoSync().pixelRatio || 1;

        // #ifdef MP || H5
        if (this._canvasElement) {
            this._canvasElement.width = Math.ceil(this.actualWidth * this.dpr);
            this._canvasElement.height = Math.ceil(this.actualHeight * this.dpr);
        }
        // #endif

        this.ctx = this.getCanvasContext();
        if (!this.ctx) {
            return false;
        }

        // #ifdef MP || H5
        if (typeof this.ctx.setTransform === 'function') {
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        } else if (typeof this.ctx.scale === 'function') {
            this.ctx.scale(this.dpr, this.dpr);
        }
        // #endif

        this.applyFont();
        this.clearCanvas();
        this.$emit('ready', {
            width: this.actualWidth,
            height: this.actualHeight
        });
        return true;
    } catch (error) {
        console.error('初始化Canvas失败:', error);
        return false;
    }
},
```

- [ ] **Step 3: Run the focused verifier**

Run:

```powershell
npm run verify:overlay-qrcode-canvas-init
```

Expected: the concurrency assertions pass, then FAIL with `overlay example should expose an independent QR code state` because the example is not added yet.

---

### Task 3: Add Overlay QR Code Example

**Files:**
- Modify: `src/pages/componentsA/overlay/overlay.nvue`
- Test: `scripts/verify-overlay-qrcode-canvas-init.mjs`

**Interfaces:**
- Consumes: existing Overlay example list and `openMask(indexNum)` dispatcher.
- Produces: a fourth example that dynamically mounts `up-qrcode` inside `up-overlay`.

- [ ] **Step 1: Add the QR code overlay block**

Add this block after the opacity Overlay:

```vue
<up-overlay
    :show="showQrcode"
    @click="showQrcode = false"
>
    <view class="overlay-wrap">
        <view class="overlay-wrap__qrcode">
            <up-qrcode
                cid="overlay-qrcode"
                :size="180"
                :showLoading="false"
                val="https://click.meituan.com/t?t=1&c=2&p=WhaD2b5zGU-h"
            ></up-qrcode>
        </view>
    </view>
</up-overlay>
```

- [ ] **Step 2: Add state and list entry**

Add the state beside the existing Overlay refs:

```js
const showQrcode = ref(false);
```

Append this item to `list`:

```js
{
    title: '嵌入二维码',
    iconUrl: 'https://uview-plus.jiangruyi.com/uview/demo/qrcode.png'
}
```

- [ ] **Step 3: Extend the dispatcher**

Add the fourth branch without changing indexes 0-2:

```js
} else if (indexNum == 3) {
    showQrcode.value = !showQrcode.value
}
```

- [ ] **Step 4: Style the QR code surface**

Add this nested style under `.overlay-wrap`:

```scss
&__qrcode {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 4px;
}
```

- [ ] **Step 5: Run the focused verifier**

Run:

```powershell
npm run verify:overlay-qrcode-canvas-init
```

Expected: PASS with `overlay qrcode canvas initialization assertions passed`.

---

### Task 4: Run H5 Regression Verification

**Files:**
- Verify: `src/uni_modules/uview-plus/components/u-canvas/u-canvas.vue`
- Verify: `src/pages/componentsA/overlay/overlay.nvue`

**Interfaces:**
- Consumes: the completed implementation and example.
- Produces: build and browser evidence that the regression is resolved without breaking the canvas migration contract.

- [ ] **Step 1: Run the existing canvas contract verifier**

Run:

```powershell
npm run verify:up-canvas-unification
```

Expected: PASS with `up-canvas unification checks passed`.

- [ ] **Step 2: Build H5**

Run:

```powershell
npm run build:h5
```

Expected: exit code 0 with no template or conditional-compilation error from the changed files.

- [ ] **Step 3: Exercise the example in H5**

Run the H5 dev server, open `#/pages/componentsA/overlay/overlay`, select `嵌入二维码`, and repeat close/open at least three times.

Expected on every open:

```text
The QR canvas is 180 x 180 CSS pixels.
All four outer QR bounds are populated.
The three finder patterns are complete.
The canvas is neither blank nor partially cleared.
```

- [ ] **Step 4: Review the final diff**

Run:

```powershell
git diff --check
git diff -- src/uni_modules/uview-plus/components/u-canvas/u-canvas.vue src/pages/componentsA/overlay/overlay.nvue scripts/verify-overlay-qrcode-canvas-init.mjs package.json docs/superpowers/specs/2026-08-05-overlay-qrcode-canvas-init-design.md docs/superpowers/plans/2026-08-05-overlay-qrcode-canvas-init.md
```

Expected: no whitespace errors and no unrelated file changes.
