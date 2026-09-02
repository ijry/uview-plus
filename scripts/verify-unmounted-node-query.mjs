import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire, register } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// 组件库源码用无扩展名的相对导入（uni-app 编译器会补全），Node 原生 ESM 不会，
// 注册解析钩子把 './x' 回退到 './x.js'，以便直接加载 mixin 做真实 Vue 生命周期测试
register(
    'data:text/javascript,' +
        encodeURIComponent(`
import { existsSync } from 'node:fs'
export async function resolve(specifier, context, next) {
	try {
		return await next(specifier, context)
	} catch (err) {
		if (specifier.startsWith('.') && context.parentURL
			&& existsSync(new URL(specifier + '.js', context.parentURL))) {
			return next(specifier + '.js', context)
		}
		throw err
	}
}
`)
)

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const read = filePath => readFileSync(resolve(repoRoot, filePath), 'utf8')
const functionPath = resolve(repoRoot, 'src/uni_modules/uview-plus/libs/function/index.js')
const mixinPath = resolve(repoRoot, 'src/uni_modules/uview-plus/libs/mixin/mixin.js')
const functionSource = read('src/uni_modules/uview-plus/libs/function/index.js')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:unmounted-node-query'],
    'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-unmounted-node-query.mjs',
    'package.json should expose verify:unmounted-node-query'
)
assert.ok(existsSync(functionPath) && existsSync(mixinPath), 'guarded sources should exist')

const EMPTY_RECT = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 }
const LIVE_RECT = { width: 100, height: 20, left: 0, right: 100, top: 0, bottom: 20 }

// --- 守卫必须在每个平台的预处理输出里都存在。
// 条件编译块在 app-harmony 上会整段消失，若守卫写进 #ifdef 就等于鸿蒙上没有守卫。
{
    const { initPreContext, preJs, preNVueJs } = require(
        resolve(repoRoot, 'node_modules/@dcloudio/uni-cli-shared/dist/preprocess/index.js')
    )
    const guardPattern = /if \(isCompUnmounted\(comp\)\) \{/g
    for (const platform of ['app', 'app-harmony', 'h5', 'mp-weixin']) {
        initPreContext(platform)
        const output = preJs(functionSource, functionPath)
        assert.equal(
            (output.match(guardPattern) || []).length,
            2,
            `${platform} should keep both unmount guards after preprocessing`
        )
        assert.match(output, /function isCompUnmounted\(comp\)/, `${platform} should keep the guard helper`)
    }
    initPreContext('app')
    const nvueOutput = preNVueJs(functionSource, functionPath)
    assert.equal(
        (nvueOutput.match(guardPattern) || []).length,
        2,
        'app-nvue should keep both unmount guards after preprocessing'
    )
    assert.doesNotMatch(nvueOutput, /createSelectorQuery\(\)/, 'nvue output should still drop selector-query code')
}

// --- 真实 Vue 生命周期下的行为验证。
// 只断言"卸载后不查询"是不够的：组件彻底不工作时也满足该断言。
// 因此每条用例都成对断言：挂载期间必须真的发起查询，卸载后必须完全不发起。
let execCount = 0
let observerCalls = 0
globalThis.uni = {
    $on() {},
    $off() {},
    $once() {},
    $emit() {},
    getStorageSync: () => '',
    setStorageSync() {},
    getSystemInfoSync: () => ({ windowWidth: 375, windowHeight: 667 }),
    getWindowInfo: () => ({ windowWidth: 375, windowHeight: 667 }),
    requireNativePlugin: () => ({ getComponentRect() {} }),
    createIntersectionObserver(...args) {
        observerCalls += 1
        return { source: 'global', args, relativeToViewport() { return this }, observe() {}, disconnect() {} }
    },
    createSelectorQuery() {
        let isAll = false
        let callback = null
        const query = {
            in() { return query },
            select() { return query },
            selectAll() { isAll = true; return query },
            boundingClientRect(cb) { callback = cb; return query },
            exec() {
                execCount += 1
                callback && callback(isAll ? [LIVE_RECT] : LIVE_RECT)
                return query
            }
        }
        return query
    }
}

const { upGetRect, upCreateIntersectionObserver } = await import(pathToFileURL(functionPath).href)
const { mixin } = await import(pathToFileURL(mixinPath).href)

assert.match(
    read('src/uni_modules/uview-plus/libs/mixin/mixin.js'),
    /beforeUnmount\(\)\s*\{[\s\S]{0,400}?this\.__upUnmounted = true/,
    'the shared mixin should flag unmount before the component own hook runs'
)

// 用 @vue/runtime-core 自建渲染器，无需浏览器即可跑真实挂载/卸载
const { createRenderer, h } = await import('vue')
const nodeOps = {
    createElement: tag => ({ tag, children: [], parent: null }),
    createText: text => ({ tag: 'text', text }),
    createComment: text => ({ tag: 'comment', text }),
    setText(node, text) { node.text = text },
    setElementText(node, text) { node.text = text },
    insert(child, parent) { child.parent = parent; parent.children.push(child) },
    remove(child) {
        const parent = child.parent
        parent && parent.children.splice(parent.children.indexOf(child), 1)
    },
    parentNode: node => node.parent,
    nextSibling: () => null,
    querySelector: () => null,
    setScopeId() {},
    patchProp() {}
}
const { createApp } = createRenderer(nodeOps)

function mountProbe(options) {
    let probe
    const Child = {
        mixins: [mixin, { created() { probe = this } }],
        render() { return h('div') },
        ...options
    }
    const app = createApp({ render() { return h(Child) } })
    app.mount(nodeOps.createElement('root'))
    return { app, get probe() { return probe } }
}

// 挂载期间：查询必须真的打到原生层，否则组件测不到尺寸，布局会坏掉
{
    const { app, probe } = mountProbe()
    execCount = 0
    assert.deepEqual(await probe.$uGetRect('.live'), LIVE_RECT, 'a mounted component must resolve the real rect')
    assert.equal(execCount, 1, 'a mounted component must actually issue the selector query')
    assert.deepEqual(
        await probe.$uGetRect('.live', true),
        [LIVE_RECT],
        'a mounted all=true query must resolve the real rects'
    )
    assert.equal(execCount, 2, 'a mounted all=true query must actually reach the native layer')
    app.unmount()
}

// 卸载后：一次查询都不许发出，否则 APP 端会拿失效 nodeId 去查已删除的视图节点
{
    const { app, probe } = mountProbe()
    app.unmount()
    execCount = 0
    assert.equal(probe.__upUnmounted, true, 'unmount should leave the guard flag set')
    assert.deepEqual(await probe.$uGetRect('.gone'), EMPTY_RECT, 'an unmounted single query should resolve an empty rect')
    assert.deepEqual(await probe.$uGetRect('.gone', true), [], 'an unmounted all=true query should resolve []')
    assert.equal(
        execCount,
        0,
        'an unmounted component must not issue any selector query; on APP these resolve removed components '
            + 'in uni-app-view.umd.js and throw "Cannot read properties of undefined (reading \'$\')"'
    )
}

// issue #1057 的真实形态：mounted 里排的异步测量在切页卸载后才跑到
{
    let pending
    const { app, probe } = mountProbe({
        mounted() {
            pending = new Promise(done => {
                setTimeout(() => { this.$uGetRect('.deferred').then(done) }, 10)
            })
        }
    })
    execCount = 0
    app.unmount()
    assert.deepEqual(await pending, EMPTY_RECT, 'a deferred query landing after unmount should resolve empty')
    assert.equal(execCount, 0, 'a deferred query landing after unmount must not reach the native layer')
    assert.ok(probe, 'the probe instance should have been captured')
}

// 交叉观察器走的是同一条 window.__$__(id).$ 查表路径
{
    const { app, probe } = mountProbe()
    observerCalls = 0
    const live = upCreateIntersectionObserver(probe, { thresholds: [1] })
    assert.equal(live.source, 'global', 'a mounted component must get a real observer')
    assert.equal(observerCalls, 1, 'a mounted component must actually create the observer')

    app.unmount()
    const dead = upCreateIntersectionObserver(probe, { thresholds: [1] })
    assert.equal(observerCalls, 1, 'an unmounted component must not create a native observer')
    assert.equal(dead.relativeToViewport({ bottom: 0 }), dead, 'the noop observer should stay chainable')
    assert.equal(dead.relativeTo('.x', {}), dead, 'the noop observer should stay chainable')
    assert.doesNotThrow(() => { dead.observe('.x', () => {}); dead.disconnect() }, 'the noop observer should absorb calls')
}

// 没套公共 mixin 的组件（u-lazy-load、u-cate-tab）退回 Vue 自身的 isUnmounted
{
    execCount = 0
    assert.deepEqual(await upGetRect('.x', false, { $: { isUnmounted: true } }), EMPTY_RECT)
    assert.deepEqual(await upGetRect('.x', false, { isUnmounted: true }), EMPTY_RECT)
    assert.equal(execCount, 0, 'the Vue-owned unmount flag should also block queries')

    assert.deepEqual(await upGetRect('.x', false, { $: { isUnmounted: false } }), LIVE_RECT)
    assert.equal(execCount, 1, 'a live instance must still query')
    assert.deepEqual(await upGetRect('.x'), LIVE_RECT, 'a query without component scope must still work')
    assert.equal(execCount, 2, 'a scopeless query must still reach the native layer')
}

console.log('unmounted node query assertions passed')
