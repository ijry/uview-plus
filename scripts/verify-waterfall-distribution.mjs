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
        addTime: 0,
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

function chooseColumn(columnHeights, columnList) {
    let minIndex = 0
    for (let i = 1; i < columnHeights.length; i++) {
        const currentHeight = Number(columnHeights[i]) || 0
        const minHeight = Number(columnHeights[minIndex]) || 0
        if (currentHeight < minHeight) {
            minIndex = i
        } else if (currentHeight === minHeight) {
            const currentLength = columnList[i] ? columnList[i].length : 0
            const minLength = columnList[minIndex] ? columnList[minIndex].length : 0
            if (currentLength < minLength) {
                minIndex = i
            }
        }
    }
    return minIndex
}

const columns = [[], []]
const heights = [0, 0]
for (let i = 0; i < 6; i++) {
    const index = chooseColumn(heights, columns)
    columns[index].push({ id: i })
}

assert.deepEqual(
    columns.map(column => column.length),
    [3, 3],
    'waterfall must distribute items by column length when measured heights are all zero'
)

assert.match(
    waterfallSource,
    /getMinHeightColumnIndex\(columnHeights\)[\s\S]*currentHeight === minHeight[\s\S]*currentLength < minLength/,
    'u-waterfall should break equal-height ties by current column item count'
)

assert.match(
    waterfallSource,
    /const minHeightIndex = this\.getMinHeightColumnIndex\(columnHeights\);/,
    'u-waterfall should use the tie-aware shortest-column selector'
)

assert.doesNotMatch(
    waterfallSource,
    /const\s+minHeightIndex\s*=\s*columnHeights\.indexOf\(Math\.min\(\.\.\.columnHeights\)\)/,
    'u-waterfall must not always pick the first column when heights are equal'
)

assert.match(
    waterfallSource,
    /await this\.\$nextTick\(\);[\s\S]*const rect = await this\.\$uGetRect\(`#u-column-\$\{minHeightIndex\}`\);/,
    'u-waterfall should wait for nextTick before measuring the updated column'
)

assert.doesNotMatch(
    waterfallSource,
    /\$nextTick\(async/,
    'u-waterfall should not use async callback form for nextTick measurement'
)

{
    const sleepResolvers = []
    const options = loadWaterfallOptions(() => new Promise(resolve => sleepResolvers.push(resolve)))
    const instance = createWaterfallInstance(options)
    const firstTask = instance.handleData([{ id: 'a' }])
    const secondTask = instance.handleData([{ id: 'b' }])

    await flushMicrotasks()
    assert.equal(
        sleepResolvers.length,
        1,
        'multiple handleData calls should share one serial distribution loop'
    )

    sleepResolvers.shift()()
    await flushMicrotasks()
    assert.equal(sleepResolvers.length, 1, 'the queued batch should start after the active batch')
    sleepResolvers.shift()()
    await Promise.all([firstTask, secondTask])
}

{
    let firstSleepResolve
    let sleepCount = 0
    const options = loadWaterfallOptions(() => {
        sleepCount += 1
        if (sleepCount === 1) {
            return new Promise(resolve => {
                firstSleepResolve = resolve
            })
        }
        return Promise.resolve()
    })
    const instance = createWaterfallInstance(options)
    const task = instance.handleData([{ id: 'old-1' }, { id: 'old-2' }])

    await flushMicrotasks()
    assert.equal(typeof firstSleepResolve, 'function', 'the first item should enter its render wait')
    instance.clear(false)
    firstSleepResolve()
    await task

    assert.deepEqual(
        instance.columnList.flat(),
        [],
        'clear() should prevent an active distribution loop from writing stale items'
    )
}

{
    const options = loadWaterfallOptions(() => Promise.resolve())
    const instance = createWaterfallInstance(options)
    const handled = []
    const redistributed = []
    instance.handleData = data => handled.push(data)
    instance.redistributeData = data => redistributed.push(data)

    const oldList = [{ id: 'a' }, { id: 'b' }]
    const insertedList = [{ id: 'a' }, { id: 'ad' }, { id: 'b' }]
    options.watch.copyFlowList.handler.call(instance, insertedList, oldList)

    assert.deepEqual(handled, [], 'middle insertion should not be treated as a tail append')
    assert.deepEqual(
        redistributed,
        [insertedList],
        'middle insertion should trigger full redistribution with the latest list'
    )

    handled.length = 0
    redistributed.length = 0
    const appendedList = [...oldList, { id: 'c' }]
    options.watch.copyFlowList.handler.call(instance, appendedList, oldList)
    assert.deepEqual(handled, [[{ id: 'c' }]], 'pure append should only enqueue the appended items')
    assert.deepEqual(redistributed, [], 'pure append should not reset existing columns')
}

{
    const options = loadWaterfallOptions(() => Promise.resolve())
    const instance = createWaterfallInstance(options)
    const initialList = [
        { id: 'a1', height: 300 },
        { id: 'a2', height: 200 },
        { id: 'a3', height: 250 },
        { id: 'a4', height: 180 }
    ]
    await instance.handleData(initialList)

    const insertedList = [
        initialList[0],
        { id: 'ad', height: 200 },
        ...initialList.slice(1)
    ]
    options.watch.copyFlowList.handler.call(instance, insertedList, initialList)
    await instance.distributionPromise

    assert.equal(
        instance.columnList[1][0].id,
        'ad',
        'full redistribution should keep the inserted AD item first in the right column'
    )
    assert.deepEqual(
        instance.columnList.flat().map(item => item.id).sort(),
        insertedList.map(item => item.id).sort(),
        'full redistribution should not duplicate or drop items after a middle insertion'
    )
}

console.log('waterfall distribution assertions passed')
