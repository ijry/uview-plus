import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const dragsortVue = read('src/uni_modules/uview-plus/components/u-dragsort/u-dragsort.vue')
const dragsortDemo = read('src/pages/componentsD/dragsort/dragsort.vue')
const packageJson = JSON.parse(read('package.json'))
const itemContentStyle = dragsortVue.match(/\.u-dragsort-item-content\s*\{([\s\S]*?)\n\s*\}/)?.[1] || ''

const scriptBlock = dragsortVue.match(/<script>([\s\S]*?)<\/script>/)?.[1]
assert.ok(scriptBlock, 'expected u-dragsort.vue to contain a script block')

const componentFactory = new Function(
    'guid',
    'sleep',
    `${scriptBlock
        .replace(/^import .*$/gm, '')
        .replace(/^\s*mixins:.*$/gm, '')
        .replace('export default', 'return')}`
)
const component = componentFactory(() => 'instance', () => Promise.resolve())

assert.equal(
    packageJson.scripts['verify:dragsort-stable-identity'],
    'node scripts/verify-dragsort-stable-identity.mjs',
    'expected package.json to expose verify:dragsort-stable-identity'
)

assert.match(
    dragsortVue,
    /<movable-view[\s\S]*:key="item\.id"[\s\S]*:id="`u-dragsort-item-\$\{instanceId\}-\$\{item\.id\}`"/,
    'movable-view id must combine the component instance and item ids'
)

assert.doesNotMatch(
    dragsortVue,
    /:id="`u-dragsort-item-\$\{index\}`"/,
    'movable-view id must not be based on the array index'
)

assert.match(
    dragsortVue,
    /@change="onChange\(item\.id, \$event\)"[\s\S]*@touchstart="onTouchStart\(item\.id, \$event\)"/,
    'movable-view events must pass the stable item id'
)

assert.match(
    dragsortVue,
    /onChange\(itemId, event\)\s*\{[\s\S]*const index = this\.getItemIndex\(itemId\)/,
    'change handling must resolve the current index from the item id'
)

assert.match(
    dragsortVue,
    /instanceId:\s*guid\(8\)/,
    'each dragsort instance must create a stable id prefix'
)

assert.match(
    dragsortVue,
    /orderIds:\s*\[\]/,
    'dragsort must track visual order separately from the rendered list'
)

assert.match(
    dragsortVue,
    /dragItemId:\s*null/,
    'dragsort must track the dragged item by id'
)

assert.doesNotMatch(
    dragsortVue,
    /reorderItems\(fromIndex, toIndex\)\s*\{[\s\S]*this\.list\.splice\(/,
    'reorderItems must not splice the rendered list during a native drag'
)

assert.match(
    dragsortVue,
    /const renderIds = \[[\s\S]*this\.list\.map\(item => item\.id\)[\s\S]*this\.orderIds\.filter/,
    'initialList updates must preserve existing native node order'
)

assert.match(
    dragsortVue,
    /hasHandler\(\)\s*\{[\s\S]*\$slots\.handler[\s\S]*\$slots\.\$handler/,
    'custom handlers must support both H5 and mini-program slot names'
)

assert.match(
    dragsortVue,
    /v-if="hasHandler"/,
    'handler wrapper visibility must use the cross-platform slot check'
)

assert.match(
    dragsortVue,
    /if \(this\.hasHandler && e\.currentTarget\.dataset\.action !== 'handler'\)/,
    'touch handling must use the same cross-platform slot check'
)

assert.match(
    dragsortDemo,
    /<template\s+#handler="\{\s*item\s*,\s*index\s*\}">/,
    'mini-program handler usage must declare slot scope so the compiler emits one dynamic slot per item'
)

assert.doesNotMatch(
    itemContentStyle,
    /(?:border(?:-radius)?|background(?:-color)?)\s*:/,
    'content wrapper must not impose a card background or border'
)

const emitted = []
const context = {
    ...component.data(),
    ...component.methods,
    initialList: [
        { id: 1, label: 'A' },
        { id: 2, label: 'B' },
        { id: 3, label: 'C' },
        { id: 4, label: 'D' }
    ],
    direction: 'vertical',
    columns: 3,
    vibrate: false,
    itemHeight: 40,
    itemWidth: 80,
    $emit(event, value) {
        emitted.push({ event, value })
    }
}

context.initList()
assert.deepEqual(context.list.map(item => item.id), [1, 2, 3, 4])

context.dragItemId = 1
context.reorderItems(0, 3)
assert.deepEqual(
    context.list.map(item => item.id),
    [1, 2, 3, 4],
    'rendered list order must remain stable during drag'
)
assert.deepEqual(context.orderIds, [2, 3, 4, 1], 'visual order must update independently')
assert.equal(context.list.find(item => item.id === 2).y, 0)
assert.equal(context.list.find(item => item.id === 3).y, 40)
assert.equal(context.list.find(item => item.id === 4).y, 80)

const originalSetTimeout = globalThis.setTimeout
globalThis.setTimeout = callback => {
    callback()
    return 1
}
try {
    context.currentPosition = { x: 0, y: 120 }
    context.onTouchEnd()
    await Promise.resolve()
    await Promise.resolve()
} finally {
    globalThis.setTimeout = originalSetTimeout
}

assert.deepEqual(
    emitted[0]?.value.map(item => item.id),
    [2, 3, 4, 1],
    'drag-end must emit the visual order'
)

console.log('dragsort stable identity assertions passed')
