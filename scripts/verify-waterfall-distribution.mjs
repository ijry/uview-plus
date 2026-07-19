import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const waterfallSource = readFileSync(
    resolve(__dirname, '../src/uni_modules/uview-plus/components/u-waterfall/u-waterfall.vue'),
    'utf8'
)

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

console.log('waterfall distribution assertions passed')
