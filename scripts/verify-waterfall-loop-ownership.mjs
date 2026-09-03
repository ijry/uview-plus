import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const waterfallSource = readFileSync(
    resolve(__dirname, '../src/uni_modules/uview-plus/components/u-waterfall/u-waterfall.vue'),
    'utf8'
)

globalThis.uni = {
    getSystemInfoSync() {
        return { windowWidth: 375 }
    }
}

function loadWaterfallOptions(sleep) {
    const scriptBlock = waterfallSource.match(/<script>([\s\S]*?)<\/script>/)
    assert.ok(scriptBlock, 'u-waterfall should contain a script block')
    const executableScript = scriptBlock[1]
        .replace(/^\s*import\s+.*?;\s*$/gm, '')
        .replace(/export default\s*\{/, 'return {')
    return new Function('mpMixin', 'mixin', 'sleep', executableScript)({}, {}, sleep)
}

// 用真实组件方法建实例；$uGetRect 立即 resolve，把唯一的挂起点留给 sleep，
// 以复现 App 端隐藏页面挂起 setTimeout 的时序
function createWaterfallInstance(options) {
    const instance = {
        ...options.data(),
        columns: 2,
        columnsMin: 2,
        minColumnWidth: 230,
        addTime: 200,
        copyFlowList: [],
        emitted: [],
        $emit(name) {
            instance.emitted.push(name)
        },
        async $nextTick() {},
        async $uGetRect(selector) {
            const columnIndex = Number(selector.match(/(\d+)$/)?.[1] || 0)
            const column = instance.columnList[columnIndex] || []
            return { height: column.reduce((total, item) => total + (item.height || 10), 0) }
        }
    }
    for (const [name, method] of Object.entries(options.methods)) {
        instance[name] = method.bind(instance)
    }
    return instance
}

async function flushMicrotasks(times = 50) {
    for (let index = 0; index < times; index++) {
        await Promise.resolve()
    }
}

// 复现时序：旧分配循环挂在 sleep 上时锁被强制重置，新循环接管；
// 旧循环随后恢复，其 finally 不得释放接管者持有的锁
{
    const pendingSleeps = []
    const options = loadWaterfallOptions(() => new Promise((resolveSleep) => {
        pendingSleeps.push(resolveSleep)
    }))
    const instance = createWaterfallInstance(options)

    // 1. 旧循环 L1 起跑，推入首项后挂在 sleep 上（模拟页面被切走、定时器被挂起）
    const oldTask = instance.handleData([{ id: 'old-1' }, { id: 'old-2' }])
    await flushMicrotasks()
    assert.equal(instance.distributionRunning, true, 'L1 应持有分配锁')
    assert.equal(pendingSleeps.length, 1, 'L1 应恰好挂在第一个 sleep 上')

    // 2. 切回页面并整体刷新：redistributeData 强制解锁并让新循环 L2 接管
    const newTask = instance.redistributeData([{ id: 'new-1' }, { id: 'new-2' }])
    await flushMicrotasks()
    assert.equal(pendingSleeps.length, 2, 'L2 应已起跑并挂在自己的 sleep 上')
    assert.equal(instance.distributionRunning, true, 'L2 接管后锁应仍被持有')

    // 3. 旧循环恢复：代数与令牌都已变，应安静退出，既不写入也不释放 L2 的锁
    const writtenBeforeResume = instance.columnList.flat().length
    pendingSleeps[0]()
    await oldTask
    await flushMicrotasks()

    assert.equal(
        instance.columnList.flat().length,
        writtenBeforeResume,
        '被接管的旧循环恢复后不得再写入 columnList'
    )
    assert.equal(
        instance.distributionRunning,
        true,
        '旧循环退出时不得释放 L2 持有的锁，否则后续 handleData 会并发起第二个循环'
    )

    // 4. 追加数据：锁被正确持有时只能入队，不得另起一个并发循环
    const runTokenBeforeAppend = instance.distributionRunToken
    instance.handleData([{ id: 'new-3' }])
    await flushMicrotasks()
    assert.equal(
        instance.distributionRunToken,
        runTokenBeforeAppend,
        '锁被持有时 handleData 不应起新的分配循环'
    )

    // 5. 放行剩余 sleep，L2 应完整分配且不掺入旧代数据
    while (pendingSleeps.length > 0) {
        pendingSleeps.shift()()
        await flushMicrotasks()
    }
    await newTask
    await flushMicrotasks()

    const distributed = instance.columnList.flat().map((item) => item.id).sort()
    assert.deepEqual(
        distributed,
        ['new-1', 'new-2', 'new-3'],
        '最终只应包含新代数据，旧代数据不得残留或重复写入'
    )
}

console.log('waterfall loop ownership assertions passed')

