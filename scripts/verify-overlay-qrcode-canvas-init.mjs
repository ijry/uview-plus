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
        transform: null,
        setTransform(...args) {
            this.transform = args
        }
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

let pixelRatio = 1
let platform = 'android'
globalThis.uni = {
    getSystemInfoSync() {
        return { pixelRatio, platform }
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
assert.equal(instance._initPromise, null, 'completed initialization should release the shared promise')

assert.equal(await instance.initCanvas(true), true, 'forced initialization should still run after completion')
assert.equal(nodeLookupCount, 2, 'forced initialization should perform a fresh canvas node lookup')

pixelRatio = 2
const { instance: highDprInstance, canvasElement: highDprCanvas } = createCanvasInstance(options)
highDprInstance.getCanvasNode = async () => ({ node: highDprCanvas })
assert.equal(await highDprInstance.initCanvas(), true, 'mini-program initialization should support high DPR')
assert.equal(highDprCanvas.width, 360, 'mini-program high-DPR initialization should scale canvas width')
assert.equal(highDprCanvas.height, 360, 'mini-program high-DPR initialization should scale canvas height')
assert.deepEqual(
    highDprInstance.ctx.transform,
    [2, 0, 0, 2, 0, 0],
    'mini-program high-DPR initialization should apply one drawing transform'
)
pixelRatio = 1
platform = 'devtools'
const { instance: devtoolsInstance, canvasElement: devtoolsCanvas } = createCanvasInstance(options)
devtoolsInstance.getCanvasNode = async () => ({ node: devtoolsCanvas })
assert.equal(await devtoolsInstance.initCanvas(), true, 'developer-tools initialization should support the simulator fallback')
assert.equal(devtoolsCanvas.width, 360, 'developer-tools simulator should use at least a 2x backing store')
assert.equal(devtoolsCanvas.height, 360, 'developer-tools simulator should use at least a 2x backing store')
assert.deepEqual(
    devtoolsInstance.ctx.transform,
    [2, 0, 0, 2, 0, 0],
    'developer-tools simulator should apply the fallback drawing transform'
)
platform = 'android'

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
    canvasSource,
    /\/\/ #ifdef MP\s+if \(this\._canvasElement\) \{[\s\S]*?this\._canvasElement\.width = Math\.ceil\(this\.actualWidth \* this\.dpr\)[\s\S]*?\/\/ #endif/,
    'manual canvas backing-store scaling should remain limited to mini programs'
)
assert.match(
    canvasSource,
    /\/\/ #ifdef MP\s+if \(typeof this\.ctx\.setTransform === 'function'\) \{[\s\S]*?this\.ctx\.setTransform\(this\.dpr, 0, 0, this\.dpr, 0, 0\)[\s\S]*?\/\/ #endif/,
    'manual canvas transform scaling should remain limited to mini programs'
)
assert.match(
    canvasSource,
    /systemInfo\.platform === 'devtools'[\s\S]*?Math\.max\(pixelRatio, 2\)/,
    'developer-tools simulator should have a minimum 2x DPR fallback'
)
assert.doesNotMatch(
    canvasSource,
    /\/\/ #ifdef MP \|\| H5\s+if \(this\._canvasElement\) \{[\s\S]*?this\._canvasElement\.width = Math\.ceil\(this\.actualWidth \* this\.dpr\)/,
    'u-canvas should not manually apply HiDPI backing-store scaling on H5'
)
assert.doesNotMatch(
    canvasSource,
    /\/\/ #ifdef MP \|\| H5\s+if \(typeof this\.ctx\.setTransform === 'function'\) \{[\s\S]*?this\.ctx\.setTransform\(this\.dpr, 0, 0, this\.dpr, 0, 0\)/,
    'u-canvas should not manually apply HiDPI transforms on H5'
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
assert.match(
    overlaySource,
    /else if \(indexNum == 3\)[\s\S]*showQrcode\.value/,
    'overlay example should open the QR code scenario from the fourth list item'
)

console.log('overlay qrcode canvas initialization assertions passed')
