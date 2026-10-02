import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { setImmediate } from 'node:timers/promises'

const source = readFileSync(new URL('../src/uni_modules/uview-plus/components/u-barcode/u-barcode.vue', import.meta.url), 'utf8')
const scriptBlock = source.match(/<script>([\s\S]*?)<\/script>/)
assert.ok(scriptBlock, 'u-barcode should contain a script block')

const executableScript = scriptBlock[1]
    .replace(/import[\s\S]*?from\s+['"][^'"]+['"];?/g, '')
    .replace(/export default\s*\{/, 'return {')

// 模拟全局队列已经清空、组件宿主视图仍在提交的情况。
const globalNextTick = () => Promise.resolve()
const options = new Function('nextTick', executableScript)(globalNextTick)
const { getCanvasRef } = options.methods

function createGate() {
    let release
    const promise = new Promise(resolve => {
        release = resolve
    })
    return { promise, release }
}

for (const refName of ['barcodeCanvas', 'barcodeImageCanvas']) {
    const viewUpdate = createGate()
    const canvasInitialization = createGate()
    const events = []
    const refs = {}
    const canvas = {
        async initCanvas(force) {
            assert.equal(this, canvas, 'canvas initialization should retain its receiver')
            assert.equal(force, true, 'canvas dimensions should be refreshed')
            events.push('init:start')
            await canvasInitialization.promise
            events.push('init:end')
        }
    }
    const instance = {
        async $nextTick() {
            assert.equal(this, instance, 'view updates should use the barcode instance')
            events.push('update:start')
            await viewUpdate.promise
            refs[refName] = canvas
            events.push('update:end')
        },
        get $refs() {
            events.push('refs:read')
            return refs
        }
    }

    let settled = false
    const lookup = getCanvasRef.call(instance, refName)
    // 立即观察拒绝，避免旧实现的预期失败成为未处理的 Promise 拒绝。
    lookup.then(() => { settled = true }, () => { settled = true })
    await setImmediate()
    assert.deepEqual(events, ['update:start'], `${refName} must wait before reading refs`)
    assert.equal(settled, false, 'lookup should remain pending during the view update')

    viewUpdate.release()
    await setImmediate()
    assert.deepEqual(events, ['update:start', 'update:end', 'refs:read', 'init:start'])
    assert.equal(settled, false, 'lookup should also wait for canvas initialization')

    canvasInitialization.release()
    assert.equal(await lookup, canvas, 'lookup should return the initialized canvas')
    assert.equal(events.at(-1), 'init:end')

    await assert.rejects(
        getCanvasRef.call({ $nextTick: globalNextTick, $refs: {} }, refName),
        { message: `Canvas ref not found: ${refName}` },
        'a genuinely missing ref should still reject after the view update'
    )

    const initializationError = new Error('canvas initialization failed')
    await assert.rejects(
        getCanvasRef.call({
            $nextTick: globalNextTick,
            $refs: {
                [refName]: {
                    async initCanvas() {
                        throw initializationError
                    }
                }
            }
        }, refName),
        error => error === initializationError,
        'canvas initialization failures should propagate to the rendering caller'
    )
}

console.log('barcode canvas ref assertions passed')
