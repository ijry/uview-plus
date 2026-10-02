import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// 复现并回归 issue #606：外部拿到 u-collapse 的 ref 后调用 init()，
// 期望"重新初始化内部高度计算"，实际面板被强行收起、高度归零。

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const read = filePath => readFileSync(resolve(repoRoot, filePath), 'utf8')

const collapsePath = 'src/uni_modules/uview-plus/components/u-collapse/u-collapse.vue'
const collapseItemPath = 'src/uni_modules/uview-plus/components/u-collapse-item/u-collapse-item.vue'

assert.equal(
    JSON.parse(read('package.json')).scripts['verify:collapse-init'],
    'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-collapse-init.mjs',
    'package.json should expose verify:collapse-init'
)

// 组件里有 APP-NVUE 条件编译（nvue 分支和非 nvue 分支都声明了 animation），
// 直接 new Function 原文会撞 TDZ，必须先跑一遍 uni 的条件编译取 h5 产物
const { initPreContext, preJs } = require(
    resolve(repoRoot, 'node_modules/@dcloudio/uni-cli-shared/dist/preprocess/index.js')
)
initPreContext('h5')

function loadOptions(filePath, scope) {
    const source = read(filePath)
    const scriptBlock = source.match(/<script>([\s\S]*?)<\/script>/)
    assert.ok(scriptBlock, `${filePath} should contain a script block`)
    const compiled = preJs(scriptBlock[1], resolve(repoRoot, filePath))
        .replace(/^\s*import\s+[\s\S]*?from\s+.*?$/gm, '')
        .replace(/export default\s*\{/, 'return {')
    const names = Object.keys(scope)
    return new Function(...names, compiled)(...names.map(name => scope[name]))
}

const errors = []
const sharedScope = {
    props: {},
    mpMixin: {},
    mixin: {},
    nextTick: () => Promise.resolve(),
    guid: (() => {
        let seed = 0
        return () => `u-test-${++seed}`
    })(),
    sleep: () => Promise.resolve(),
    error: message => errors.push(message),
    test: { array: Array.isArray }
}

const collapseOptions = loadOptions(collapsePath, sharedScope)
const collapseItemOptions = loadOptions(collapseItemPath, sharedScope)

assert.equal(collapseOptions.name, 'u-collapse')
assert.equal(collapseItemOptions.name, 'u-collapse-item')

function bindMethods(instance, options) {
    for (const [name, method] of Object.entries(options.methods || {})) {
        instance[name] = method.bind(instance)
    }
}

function createCollapse({ value = null, accordion = false } = {}) {
    const instance = {
        value,
        accordion,
        border: true,
        emitted: [],
        $emit(event, ...args) {
            this.emitted.push({ event, args })
        }
    }
    collapseOptions.created.call(instance)
    bindMethods(instance, collapseOptions)
    return instance
}

// 复刻公共 mixin 里 getParentData 的语义：认亲 + 把自己塞进 parent.children + 同步 parentData
function attachParent(child, parent) {
    child.parent = parent
    if (parent.children && parent.children.indexOf(child) === -1) {
        parent.children.push(child)
    }
    Object.keys(child.parentData).forEach(key => {
        child.parentData[key] = parent[key]
    })
}

// 每次 uni.createAnimation() 的目标高度会经由 animationData 落到调用它的实例上，
// 所以直接读 instance.animationData.height 就是这个面板最后一次动画的目标高度
global.uni = {
    createAnimation: () => {
        let target
        const chain = {
            height(value) {
                target = value
                return chain
            },
            step: () => chain,
            export: () => ({ height: target, actions: [{ animates: [{ type: 'style', args: ['height', target] }] }] })
        }
        return chain
    }
}

function createCollapseItem(parent, { name, contentHeight }) {
    const instance = {
        ...collapseItemOptions.data(),
        name,
        duration: 300,
        // 内容自然高度，模拟异步内容加载后变高
        contentHeight,
        rectQueries: 0,
        $refs: {},
        async $uGetRect() {
            instance.rectQueries++
            return { height: instance.contentHeight }
        }
    }
    bindMethods(instance, collapseItemOptions)
    instance.getParentData = () => attachParent(instance, parent)
    return instance
}

const lastHeight = item => item.animationData.height
// init() -> nextTick -> setContentAnimate -> queryRect 层层 await，需要放干微任务队列
const flush = () => new Promise(resolve => setTimeout(resolve, 0))

// ── 场景：不使用 value（默认 null），用户点开面板后异步内容变高，再调 init() 重算高度 ──
const collapse = createCollapse()
const first = createCollapseItem(collapse, { name: 'a', contentHeight: 100 })
const second = createCollapseItem(collapse, { name: 'b', contentHeight: 100 })

for (const item of [first, second]) {
    await item.init()
}
await flush()
assert.deepEqual(collapse.children, [first, second], 'both items should register on the parent')
assert.equal(first.expanded, false, 'panels start collapsed when value is not provided')
assert.equal(lastHeight(first), 0, 'a collapsed panel animates to height 0')

// 用户点开第一个面板
collapse.onChange(first)
await flush()
assert.equal(first.expanded, true, 'clicking the head expands the panel')
assert.equal(lastHeight(first), 100, 'the expanded panel animates to the measured content height')

// 内容异步变高，外部调用 collapseRef.init() 想重新计算高度
first.contentHeight = 260
const rectQueriesBefore = first.rectQueries
collapse.init()
await flush()

assert.ok(first.rectQueries > rectQueriesBefore, 'init() should re-measure the content')
assert.equal(
    first.expanded,
    true,
    'init() must not silently collapse a panel the user opened by clicking'
)
assert.equal(
    lastHeight(first),
    260,
    'init() should re-apply the new content height to the open panel'
)

// ── 场景：value 受控时，init() 仍然必须服从 value ──
const controlled = createCollapse({ value: ['b'] })
const cFirst = createCollapseItem(controlled, { name: 'a', contentHeight: 100 })
const cSecond = createCollapseItem(controlled, { name: 'b', contentHeight: 100 })
for (const item of [cFirst, cSecond]) {
    await item.init()
}
await flush()
assert.equal(cFirst.expanded, false, 'value should drive the initial state')
assert.equal(cSecond.expanded, true, 'value should drive the initial state')

// 受控场景下 value 变化经由 needInit watcher 走 init()，必须重新按 value 求值
controlled.value = ['a']
controlled.init()
await flush()
assert.equal(cFirst.expanded, true, 'a value change must still re-derive expanded from value')
assert.equal(cSecond.expanded, false, 'a value change must still re-derive expanded from value')

// ── 场景：手风琴模式下点开一个面板后调 init()，不应把它关掉 ──
const accordion = createCollapse({ accordion: true })
const aFirst = createCollapseItem(accordion, { name: 'a', contentHeight: 100 })
const aSecond = createCollapseItem(accordion, { name: 'b', contentHeight: 100 })
for (const item of [aFirst, aSecond]) {
    await item.init()
}
await flush()
accordion.onChange(aSecond)
await flush()
assert.equal(aSecond.expanded, true, 'accordion mode expands the clicked panel')
aSecond.contentHeight = 180
accordion.init()
await flush()
assert.equal(aSecond.expanded, true, 'accordion init() should keep the open panel open')
assert.equal(lastHeight(aSecond), 180, 'accordion init() should re-apply the new height')

assert.deepEqual(errors, [], 'no component errors should be reported')

// ── value 类型不合法时，原有的校验提示仍要照常发出 ──
const wrongNonAccordion = createCollapse({ value: 'a' })
const wrongItem = createCollapseItem(wrongNonAccordion, { name: 'a', contentHeight: 100 })
await wrongItem.init()
await flush()
assert.deepEqual(
    errors,
    ['非手风琴模式下，u-collapse组件的value参数必须为数组'],
    'a non-array value in non-accordion mode should still be reported'
)

errors.length = 0
const wrongAccordion = createCollapse({ value: ['a'], accordion: true })
const wrongAccordionItem = createCollapseItem(wrongAccordion, { name: 'a', contentHeight: 100 })
await wrongAccordionItem.init()
await flush()
assert.deepEqual(
    errors,
    ['手风琴模式下，u-collapse组件的value参数不能为数组'],
    'an array value in accordion mode should still be reported'
)

console.log('collapse init assertions passed')
