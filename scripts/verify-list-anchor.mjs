// 验证 #721：up-list-item 的 anchor 能否配合 up-list 的 scroll-into-view 滚动到指定 item
// 直接取组件真实的 options 建实例跑 scrollIntoViewById，因为条件编译注释在这里不生效，
// 非 nvue 分支（innerScrollIntoView）与 nvue 分支（dom.scrollToElement）会同时执行，正好一次覆盖两端。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const read = (file) => readFileSync(resolve(__dirname, '..', file), 'utf8')
const listSource = read('src/uni_modules/uview-plus/components/u-list/u-list.vue')
const listItemSource = read('src/uni_modules/uview-plus/components/u-list-item/u-list-item.vue')

// nvue 的 dom 模块桩，记录 scrollToElement 调用
const domCalls = []
globalThis.uni = {
    requireNativePlugin: () => ({
        scrollToElement(ref, options) {
            domCalls.push({ ref, options })
        }
    })
}

const STUBS = {
    mpMixin: {},
    mixin: {},
    props: {},
    getWindowInfo: () => ({ windowHeight: 800, windowWidth: 375 }),
    addUnit: (v) => `${v}px`,
    addStyle: (v) => v || {},
    deepMerge: (a, b) => ({ ...a, ...b }),
    sleep: () => Promise.resolve()
}

function loadOptions(source) {
    const script = source.match(/<script>([\s\S]*?)<\/script>/)
    assert.ok(script, '组件应该有 script 块')
    const code = script[1]
        .replace(/^\s*import\s+.*$/gm, '')
        .replace(/export default\s*\{/, 'return {')
    const names = Object.keys(STUBS)
    return new Function(...names, code)(...names.map((n) => STUBS[n]))
}

const listOptions = loadOptions(listSource)
const listItemOptions = loadOptions(listItemSource)

function createList() {
    const instance = {
        ...listOptions.data(),
        scrollIntoView: '',
        scrollWithAnimation: false,
        nextTicks: [],
        $nextTick(fn) {
            instance.nextTicks.push(fn)
        },
        $emit() {}
    }
    for (const [name, method] of Object.entries(listOptions.methods)) {
        instance[name] = method.bind(instance)
    }
    listOptions.created.call(instance)
    return instance
}

// 模拟一个已挂载的 u-list-item：注册进 parent.children 并带上 nvue 需要的 ref
function mountItem(list, anchor) {
    const item = {
        anchor,
        $refs: {}
    }
    for (const [name, getter] of Object.entries(listItemOptions.computed)) {
        Object.defineProperty(item, name, { get: getter.bind(item), enumerable: true })
    }
    if (item.anchorId) item.$refs[item.anchorId] = { ref: item.anchorId }
    list.children.push(item)
    return item
}

const cases = []
const check = (name, fn) => cases.push([name, fn])

check('u-list-item 模板给根节点绑定了 id（非 nvue 下 scroll-into-view 靠 id 命中）', () => {
    assert.ok(listItemSource.includes(':id="anchorId"'), 'u-list-item 应该绑定 :id="anchorId"')
    assert.ok(/anchorId\(\)\s*\{/.test(listItemSource), 'u-list-item 应该有 anchorId 计算属性')
})

check('anchorId 由 anchor 加前缀生成，anchor 为空时不生成 id', () => {
    const list = createList()
    assert.equal(mountItem(list, 'item-5').anchorId, 'u-list-item-item-5')
    // 数字 anchor 也能得到合法 id（id 不能以数字开头）
    assert.equal(mountItem(list, 19).anchorId, 'u-list-item-19')
    // 空 anchor 不能生成 id，否则整个列表都是重复 id
    assert.equal(mountItem(list, '').anchorId, '')
    assert.equal(mountItem(list, null).anchorId, '')
    assert.equal(mountItem(list, undefined).anchorId, '')
})

check('scroll-view 绑定的是内部值 innerScrollIntoView', () => {
    assert.ok(listSource.includes(':scroll-into-view="innerScrollIntoView"'),
        'u-list 的 scroll-view 应该绑定 innerScrollIntoView')
    assert.ok(!/this\.refs/.test(listSource), 'u-list 不应再依赖从未被填充的 this.refs')
})

check('getAnchorChild 同时支持 anchor 与 u-list-item-${anchor} 两种写法', () => {
    const list = createList()
    mountItem(list, 'foo')
    mountItem(list, 19)
    mountItem(list, '')

    assert.equal(list.getAnchorChild('foo').anchor, 'foo')
    assert.equal(list.getAnchorChild('u-list-item-foo').anchor, 'foo')
    assert.equal(list.getAnchorChild(19).anchor, 19)
    assert.equal(list.getAnchorChild('u-list-item-19').anchor, 19)
    assert.equal(list.getAnchorChild('u-list-item-'), undefined, '空 anchor 的 item 不应被命中')
    assert.equal(list.getAnchorChild('other-id'), undefined)
})

check('命中 anchor 时非 nvue 转成 item 的 id、nvue 调用 dom.scrollToElement', () => {
    const list = createList()
    mountItem(list, 'item-19')
    domCalls.length = 0

    list.scrollIntoViewById('item-19')
    assert.equal(list.innerScrollIntoView, 'u-list-item-item-19', '非 nvue 应转换为 item 的 id')
    assert.equal(list.nextTicks.length, 0, '命中时不需要重试')
    assert.equal(domCalls.length, 1, 'nvue 应调用一次 dom.scrollToElement')
    assert.deepEqual(domCalls[0].ref, { ref: 'u-list-item-item-19' }, '应传入该 item 的 ref')
    assert.equal(domCalls[0].options.animated, false, '应带上 scrollWithAnimation')

    list.scrollIntoViewById('u-list-item-item-19')
    assert.equal(list.innerScrollIntoView, 'u-list-item-item-19', '带前缀的写法结果一致')
})

check('#721 回归：没有匹配的 item 时不再抛异常（旧代码读空 this.refs 会 TypeError）', () => {
    const list = createList()
    domCalls.length = 0
    // 列表里一个 item 都没有
    assert.doesNotThrow(() => list.scrollIntoViewById('item-19'))
    list.nextTicks.forEach((fn) => fn())
    assert.equal(domCalls.length, 0, '没找到目标时不应调用 dom.scrollToElement')
})

check('未命中 anchor 的 id 仍按原有约定当作使用者自己的子元素 id 透传', () => {
    const list = createList()
    mountItem(list, 'item-1')

    list.scrollIntoViewById('my-own-id')
    list.nextTicks.forEach((fn) => fn())
    assert.equal(list.innerScrollIntoView, 'my-own-id', '不该给使用者自己的 id 加前缀')
})

check('置空 scroll-into-view 会清掉内部值', () => {
    const list = createList()
    mountItem(list, 'item-1')
    list.scrollIntoViewById('item-1')
    assert.equal(list.innerScrollIntoView, 'u-list-item-item-1')

    list.scrollIntoViewById('')
    assert.equal(list.innerScrollIntoView, '', '置空后应清掉，便于重复滚动到同一个 item')
})

check('数据与 scroll-into-view 同一帧赋值时，下一帧重试仍能命中', () => {
    const list = createList()
    // item 还没挂载
    list.scrollIntoViewById('item-20')
    assert.equal(list.innerScrollIntoView, '', '首次匹配不到时不应立即透传')
    assert.equal(list.nextTicks.length, 1, '应安排一次 $nextTick 重试')

    mountItem(list, 'item-20')
    list.nextTicks.shift()()
    assert.equal(list.innerScrollIntoView, 'u-list-item-item-20', '重试应命中已挂载的 item')
})

check('过期的重试不会覆盖新的目标', () => {
    const list = createList()
    list.scrollIntoViewById('old')
    list.scrollIntoViewById('new')
    assert.equal(list.scrollIntoViewTarget, 'new')

    mountItem(list, 'old')
    mountItem(list, 'new')
    const [staleRetry, freshRetry] = list.nextTicks
    staleRetry()
    assert.equal(list.innerScrollIntoView, '', '过期重试应被丢弃')
    freshRetry()
    assert.equal(list.innerScrollIntoView, 'u-list-item-new')
})

check('初始就设置了 scroll-into-view 时，mounted 里会处理一次', () => {
    const list = createList()
    mountItem(list, 'item-0')
    list.scrollIntoView = 'item-0'

    listOptions.mounted.call(list)
    assert.equal(list.innerScrollIntoView, 'u-list-item-item-0')
})

let failed = 0
for (const [name, fn] of cases) {
    try {
        fn()
        console.log(`  ✓ ${name}`)
    } catch (error) {
        failed++
        console.log(`  ✗ ${name}\n      ${error.message}`)
    }
}

if (failed) {
    console.log(`\n${failed} 项校验失败`)
    process.exit(1)
}
console.log('\n全部校验通过：up-list-item 的 anchor 可用于滚动到指定 item')
