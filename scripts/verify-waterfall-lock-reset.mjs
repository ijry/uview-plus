import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const waterfallSource = readFileSync(
    resolve(__dirname, '../src/uni_modules/uview-plus/components/u-waterfall/u-waterfall.vue'),
    'utf8'
)

function loadWaterfallOptions(sleep) {
    const scriptBlock = waterfallSource.match(/<script>([\s\S]*?)<\/script>/)
    assert.ok(scriptBlock, 'u-waterfall should contain a script block')
    const executableScript = scriptBlock[1]
        .replace(/^\s*import\s+.*?;\s*$/gm, '')
        .replace(/export default\s*\{/, 'return {')
    return new Function('mpMixin', 'mixin', 'sleep', executableScript)({}, {}, sleep)
}

function createWaterfallInstance(options) {
    const instance = {
        ...options.data(),
        columns: 2,
        columnsMin: 2,
        minColumnWidth: 230,
        addTime: 200,
        copyFlowList: [],
        $emit() {},
        async $nextTick() {},
        async $uGetRect(selector) {
            const columnIndex = Number(selector.match(/(\d+)$/)?.[1] || 0)
            const height = instance.columnList[columnIndex].reduce(
                (total, item) => total + (item.height || 1),
                0
            )
            return { height }
        }
    }
    for (const [name, method] of Object.entries(options.methods)) {
        instance[name] = method.bind(instance)
    }
    return instance
}

async function flushMicrotasks(times = 20) {
    for (let index = 0; index < times; index++) {
        await Promise.resolve()
    }
}

globalThis.uni = {
    getSystemInfoSync() {
        return { windowWidth: 375 }
    }
}

// 测试 1: clear() 应该重置 distributionRunning 锁状态
{
    let sleepResolve
    const options = loadWaterfallOptions(() => {
        return new Promise(resolve => {
            sleepResolve = resolve
        })
    })
    const instance = createWaterfallInstance(options)

    // 开始分配数据，会在 sleep 处挂起
    const task = instance.handleData([{ id: 'item-1' }, { id: 'item-2' }])
    await flushMicrotasks()

    // 此时 distributionRunning 应该为 true
    assert.equal(instance.distributionRunning, true, 'distributionRunning should be true during distribution')

    // 模拟页面切换，调用 clear()
    instance.clear(false)

    // clear() 后锁状态应该被重置
    assert.equal(instance.distributionRunning, false, 'clear() should reset distributionRunning to false')
    assert.equal(instance.distributionPromise, null, 'clear() should reset distributionPromise to null')
    assert.equal(instance.distributionQueue.length, 0, 'clear() should empty the queue')

    // 释放被挂起的 sleep，旧任务应该不会继续写入数据
    sleepResolve()
    await task

    assert.deepEqual(
        instance.columnList.flat(),
        [],
        'items from old generation should not be written after clear()'
    )
}

// 测试 2: clear() 后应该能正常开始新的分配任务
{
    const options = loadWaterfallOptions(() => Promise.resolve())
    const instance = createWaterfallInstance(options)

    // 开始第一次分配并完成
    await instance.handleData([{ id: 'old-1' }])

    // 调用 clear() 清空
    instance.clear(false)
    assert.equal(instance.columnList.flat().length, 0, 'clear() should empty columns')

    // 新任务应该能正常开始（因为 clear 已解锁）
    await instance.handleData([{ id: 'new-1' }, { id: 'new-2' }])

    const items = instance.columnList.flat()
    assert.equal(items.length, 2, 'new items should be distributed after clear()')
    assert.equal(items[0].id, 'new-1', 'first new item should be distributed')
    assert.equal(items[1].id, 'new-2', 'second new item should be distributed')
}

// 测试 3: redistributeData() 应该强制解锁并重新分配
{
    let sleepResolve
    const options = loadWaterfallOptions(() => {
        return new Promise(resolve => {
            sleepResolve = resolve
        })
    })
    const instance = createWaterfallInstance(options)

    // 开始分配，会挂起
    const oldTask = instance.handleData([{ id: 'item-1' }])
    await flushMicrotasks()

    assert.equal(instance.distributionRunning, true, 'lock should be set during distribution')

    // 调用 redistributeData() - 这会在内部调用 clear，应该解锁
    const newData = [{ id: 'new-1', height: 100 }, { id: 'new-2', height: 100 }, { id: 'new-3', height: 100 }]

    // 释放旧任务的 sleep
    if (sleepResolve) sleepResolve()
    await oldTask

    // 重新配置 sleep 为立即 resolve
    const options2 = loadWaterfallOptions(() => Promise.resolve())
    Object.assign(instance, {
        handleData: options2.methods.handleData.bind(instance),
        runDistributionQueue: options2.methods.runDistributionQueue.bind(instance),
        distributeData: options2.methods.distributeData.bind(instance),
        redistributeData: options2.methods.redistributeData.bind(instance)
    })

    // 现在执行 redistributeData
    await instance.redistributeData(newData)

    const items = instance.columnList.flat()
    assert.equal(items.length, 3, 'redistributeData() should distribute all new items')
    assert.deepEqual(
        items.map(i => i.id).sort(),
        ['new-1', 'new-2', 'new-3'],
        'redistributeData() should distribute the correct items'
    )
}

// 测试 4: 验证源码中包含锁重置代码
assert.match(
    waterfallSource,
    /clear\(bak = true\)[\s\S]*this\.distributionRunning = false/,
    'clear() method should reset distributionRunning to false'
)

assert.match(
    waterfallSource,
    /clear\(bak = true\)[\s\S]*this\.distributionPromise = null/,
    'clear() method should reset distributionPromise to null'
)

assert.match(
    waterfallSource,
    /redistributeData\([\s\S]*\)[\s\S]*this\.distributionRunning = false/,
    'redistributeData() method should reset distributionRunning to false'
)

assert.match(
    waterfallSource,
    /redistributeData\([\s\S]*\)[\s\S]*this\.distributionPromise = null/,
    'redistributeData() method should reset distributionPromise to null'
)

console.log('waterfall lock reset assertions passed')
