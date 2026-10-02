#!/usr/bin/env node

/**
 * Verification script for issue #737 —— u-cate-tab 在图片很多时非常卡顿。
 *
 * 两个原因：
 * 1. follow 模式下 tabList 的每个分类块（连同其中的全部图片）在挂载时一次性渲染，
 *    100~200 张图片时首屏会长时间卡住（小程序白屏、H5 卡顿）。
 * 2. rightScroll 的节流定时器从未赋值给 this.timer，`if (this.timer) return` 永远
 *    不成立，于是每个滚动事件都会跑一遍联动、写一次响应式数据并重复 emit
 *    update:current。
 *
 * 这里既做静态断言，也把组件真实的 props/computed/methods 取出来跑一遍滚动与切换
 * 流程，只有两个 DOM 测量方法（getMenuItemTop / getElRect）被换成合成布局。
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = filePath => readFileSync(resolve(repoRoot, filePath), 'utf8')
const source = read('src/uni_modules/uview-plus/components/u-cate-tab/u-cate-tab.vue')
const packageJson = JSON.parse(read('package.json'))
const sleep = ms => new Promise(done => setTimeout(done, ms))

assert.equal(
    packageJson.scripts['verify:cate-tab-lazy-render'],
    'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-cate-tab-lazy-render.mjs',
    'package.json should expose verify:cate-tab-lazy-render'
)

// --- 静态断言 -------------------------------------------------------------
assert.match(
    source,
    /v-if="\(mode == 'follow' && index < renderLimit\)/,
    'follow 模式的分类块必须受 renderLimit 约束，不能再无条件渲染整个 tabList'
)
assert.match(source, /this\.timer = setTimeout\(/, 'rightScroll 的节流定时器必须赋值给 this.timer')
assert.doesNotMatch(source, /^\s*setTimeout\(\(\) => \{ \/\/ 节流/m, '不应再保留未赋值的节流定时器')

// --- 取出组件真实的选项对象 ----------------------------------------------
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
const stubbed = script.replace(/import \{[^}]*\} from '\.\.\/\.\.\/libs\/function\/index';/, `
const addUnit = value => value
const sleep = ms => new Promise(r => setTimeout(r, ms))
const upCreateIntersectionObserver = () => ({
    relativeTo() { return this }, relativeToViewport() { return this },
    observe() {}, disconnect() {}
})
`)
assert.notEqual(stubbed, script, 'libs/function 的 import 替换失败，本脚本需要跟随组件调整')
const options = (await import(`data:text/javascript;base64,${Buffer.from(stubbed).toString('base64')}`)).default

// --- 组件实例的最小替身 ---------------------------------------------------
const BLOCK_HEIGHT = 600 // 合成布局：每个已渲染的分类块高 600px
const categories = count => Array.from({ length: count }, (_, i) => ({ name: 'c' + i, children: [] }))

function mount(props = {}) {
    const vm = { ...options.data() }
    for (const [key, define] of Object.entries(options.props)) {
        const fallback = typeof define.default === 'function' ? define.default() : define.default
        vm[key] = key in props ? props[key] : fallback
    }
    vm.innerCurrent = vm.current // mounted() 的行为
    for (const [key, fn] of Object.entries(options.methods)) vm[key] = fn.bind(vm)
    for (const [key, fn] of Object.entries(options.computed)) {
        Object.defineProperty(vm, key, { get: fn.bind(vm), configurable: true })
    }
    vm.emits = []
    vm.$emit = (...args) => vm.emits.push(args)
    vm.$nextTick = cb => { if (cb) cb.call(vm); return Promise.resolve() }
    // 只有这两个方法查询真实节点，换成合成布局；其余都是组件自己的代码
    vm.measures = 0
    vm.getMenuItemTop = async () => {
        vm.measures++
        vm.arr = Array.from({ length: vm.renderLimit }, (_, i) => i * BLOCK_HEIGHT)
    }
    vm.getElRect = async (elClass, dataVal) => { vm[dataVal] = dataVal === 'menuHeight' ? 500 : 55 }
    vm.linkageRuns = 0
    const leftMenuStatus = vm.leftMenuStatus
    vm.leftMenuStatus = index => { vm.linkageRuns++; return leftMenuStatus(index) }
    return vm
}

const updateCurrent = vm => vm.emits.filter(([name]) => name === 'update:current')

// --- 渲染范围 -------------------------------------------------------------
{
    const vm = mount({ tabList: categories(200) })
    assert.equal(vm.lazyRender, true, 'lazyRender 默认开启')
    assert.equal(vm.lazyRenderCount, 8, 'lazyRenderCount 默认 8')
    assert.equal(vm.renderLimit, 8, '200 个分类首屏只渲染第一批，而不是全部')

    const optOut = mount({ tabList: categories(200), lazyRender: false })
    assert.equal(optOut.renderLimit, 200, 'lazyRender=false 时保持旧的一次性渲染行为')

    const small = mount({ tabList: categories(4) })
    assert.equal(small.renderLimit, 4, '分类数不足一批时全部渲染，小列表行为不变')

    const deepLink = mount({ tabList: categories(200), current: 20 })
    assert.equal(deepLink.renderLimit, 21, '初始 current 指向的分类必须在渲染范围内')

    const tabMode = mount({ tabList: categories(200), mode: 'tab' })
    assert.equal(tabMode.renderLimit, 200, 'tab 模式本来就只渲染当前项，不受渐进渲染影响')
}

// --- 滚动：节流生效，且选中项没变就不再通知父组件 -------------------------
{
    const vm = mount({ tabList: categories(200) })
    await vm.getMenuItemTop()
    const EVENTS = 60
    for (let i = 0; i < EVENTS; i++) {
        // 3 * 600 ~ 4 * 600 之间，始终落在第 4 个分类内
        vm.rightScroll({ detail: { scrollTop: 1801 + i * 4 } })
        await sleep(16)
    }
    await sleep(300)
    assert.ok(
        vm.linkageRuns <= 20,
        `节流后联动次数应远小于滚动事件数，实际 ${vm.linkageRuns}/${EVENTS}`
    )
    assert.ok(vm.linkageRuns >= 1, '节流不能把联动完全挡掉')
    assert.equal(updateCurrent(vm).length, 1, `选中项只变化一次，实际 emit ${updateCurrent(vm).length} 次`)
    assert.equal(vm.innerCurrent, 3, '左侧菜单应停在第 4 个分类')
    assert.equal(vm.renderLimit, 8, '没滚到渲染边界时不应追加')
}

// --- 滚到渲染边界时追加下一批并重新测量 -----------------------------------
{
    const vm = mount({ tabList: categories(200) })
    await vm.getMenuItemTop()
    // 下标 6 已经是首批 8 个里的倒数第二个
    vm.rightScroll({ detail: { scrollTop: 6 * BLOCK_HEIGHT + 10 } })
    await sleep(400)
    assert.equal(vm.innerCurrent, 6)
    assert.equal(vm.renderLimit, 16, '接近渲染边界时应再放开一批')
    assert.equal(vm.arr.length, 16, '追加后必须重新测量各分类位置，否则联动会错位')
}

// --- 点击左侧未渲染的分类 -------------------------------------------------
{
    const vm = mount({ tabList: categories(200) })
    await vm.swichMenu(30)
    assert.equal(vm.renderLimit, 31, '点击尚未渲染的分类要先补齐渲染范围')
    assert.equal(vm.scrollIntoView, 'item30', 'scroll-into-view 的目标节点必须已经渲染')
    assert.equal(vm.arr.length, 31, '补齐渲染后要重新测量')
}

// --- 数据整体替换 vs 仅内容变化 -------------------------------------------
{
    const vm = mount({ tabList: categories(200) })
    await vm.swichMenu(30)
    const oldList = vm.tabList
    vm.tabList = categories(200)
    vm.innerCurrent = 0
    options.watch.tabList.handler.call(vm, vm.tabList, oldList)
    assert.equal(vm.renderCount, 0, '换了一份数据要重新从首屏开始渐进渲染')
    assert.equal(vm.renderLimit, 8)

    const kept = mount({ tabList: categories(200) })
    await kept.swichMenu(30)
    options.watch.tabList.handler.call(kept, kept.tabList, kept.tabList)
    assert.equal(kept.renderCount, 31, '仅内容变化时不应回收已渲染的分类，否则滚动位置会跳')
}

// --- 全部渲染完之后不再重复测量 -------------------------------------------
{
    const vm = mount({ tabList: categories(10) })
    await vm.swichMenu(9)
    assert.equal(vm.renderLimit, 10, '10 个分类全部渲染完')
    const measures = vm.measures
    assert.equal(await vm.growRender(18), false, '已经渲染完就不应再触发测量')
    assert.equal(vm.measures, measures, '滚到列表末尾时不能每次节流都重新查询节点位置')
}

console.log('u-cate-tab lazy render assertions passed')
