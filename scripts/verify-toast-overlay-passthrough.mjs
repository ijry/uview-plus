#!/usr/bin/env node

/**
 * Regression check for the toast "点击穿透" capability.
 *
 * u-toast renders its content inside u-overlay, and u-overlay is a
 * `position: fixed; top/left/right/bottom: 0` full-screen transparent mask. While a
 * toast is visible that mask swallows every tap / touchmove, so the page behind it
 * cannot be operated at all. `overlay: false` is the switch that turns the mask into
 * a pass-through layer, but it used to be invisible to users (no prop, no type, no
 * doc, no demo) and it relied solely on `pointer-events`, which nvue ignores.
 *
 * This script evaluates the real u-toast.vue script block and drives show() /
 * overlayStyle through every combination, so the contract below is checked end to end:
 *
 *   - overlay defaults to true -> mask stays full screen, page is blocked
 *   - overlay false (prop or show option) -> mask stops covering the page
 *   - show({ overlay }) always beats the component prop
 *   - the transparent background and flex centering never regress
 *
 * overlay 的文档在兄弟仓库 uview-plus-doc/docs/components/toast.md，这里不做跨仓库断言。
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'vue/compiler-sfc'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = p => readFileSync(resolve(root, p), 'utf8')

const TOAST_VUE = 'src/uni_modules/uview-plus/components/u-toast/u-toast.vue'
const TOAST_DTS = 'src/uni_modules/uview-plus/types/comps/toast.d.ts'
const TOAST_DEMO = 'src/pages/componentsB/toast/toast.nvue'

assert.equal(
    JSON.parse(read('package.json')).scripts['verify:toast-overlay-passthrough'],
    'node scripts/verify-toast-overlay-passthrough.mjs',
    'expected package.json to expose verify:toast-overlay-passthrough'
)

const toastSource = read(TOAST_VUE)

// ------------------------------------------------------------ real component
const { descriptor } = parse(toastSource, { filename: 'u-toast.vue' })
const scriptSrc = descriptor.script.content
    .split(/\r?\n/)
    .filter(line => !/^\s*import\b/.test(line))
    .join('\n')
    .replace(/export default/, 'return')

// show() 只需要 deepMerge 的“后者覆盖前者”语义，这里给一个等价实现
const deepMergeStub = (target, source) => Object.assign({}, target, source)

const UToast = new Function(
    'mpMixin', 'mixin', 'os', 'getWindowInfo', 'deepMerge', 'type2icon', 'color', 'hexToRgb',
    scriptSrc
)({}, {}, () => '', () => ({ windowHeight: 667 }), deepMergeStub, () => '', {}, () => '')

// u-overlay 的基线样式：遮罩铺满全屏，toast 的 customStyle 覆盖在它之上。
// 样式对象都是扁平的，浅合并与 u-overlay 里的 deepMerge 等价。
const OVERLAY_BASE = { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10090, bottom: 0 }
const mergedOverlayStyle = customStyle => Object.assign({}, OVERLAY_BASE, customStyle)

// 只在穿透分支才会出现的键；拦截分支一个都不该有
const PASSTHROUGH_ONLY_KEYS = ['pointerEvents', 'left', 'top', 'right', 'bottom', 'transform']
const isBlocking = style => PASSTHROUGH_ONLY_KEYS.every(key => !(key in style))
const coversWholeScreen = style => {
    const merged = mergedOverlayStyle(style)
    return merged.left === 0 && merged.right === 0 && merged.top === 0 && merged.bottom === 0
}

// 和 Vue 一样先套上 prop 默认值，否则 <up-toast> 不传 overlay 时会是 undefined 而不是 true
const propDefaults = () => {
    const out = {}
    for (const [name, def] of Object.entries(UToast.props)) {
        out[name] = typeof def.default === 'function' ? def.default() : def.default
    }
    return out
}

const makeCtx = (props = {}) => {
    const ctx = Object.assign(propDefaults(), UToast.data(), props)
    // 按 Vue 的方式挂 computed，overlayStyle 内部才能通过 this.overlayEnabled 取到值
    for (const [name, getter] of Object.entries(UToast.computed)) {
        Object.defineProperty(ctx, name, { get: getter, enumerable: true, configurable: true })
    }
    // show() 里的定时器在单测里没有意义，直接清掉
    ctx.clearTimer = () => { ctx.isShow = false; ctx.timer = null }
    return ctx
}

const drive = (props, options) => {
    const ctx = makeCtx(props)
    UToast.methods.show.call(ctx, options)
    const style = UToast.computed.overlayStyle.call(ctx)
    ctx.clearTimer()
    return { ctx, style }
}

// ------------------------------------------------ 1. overlay 是正式 prop，默认拦截
assert.match(
    toastSource,
    /props:\s*\{[\s\S]*?overlay:\s*\{\s*\n\s*type:\s*Boolean,\s*\n\s*default:\s*true/,
    'expected u-toast to declare an `overlay` Boolean prop defaulting to true'
)
assert.ok('overlay' in UToast.props, 'expected the evaluated component to expose the overlay prop')
assert.equal(UToast.props.overlay.default, true, 'overlay prop must default to true')

// --------------------------------------- 2. show() 把 prop 作为 overlay 的默认值
assert.match(
    toastSource,
    /deepMerge\(\{\s*\.\.\.this\.config,\s*overlay:\s*this\.overlay\s*\},\s*options\)/,
    'expected show() to fall back to the overlay prop when the caller passes none'
)

// ------------------------------------------------ 3. 默认拦截：遮罩必须依然铺满全屏
{
    const { style } = drive({}, { message: 'hello' })
    assert.ok(isBlocking(style), 'default toast must keep the blocking mask, got ' + JSON.stringify(style))
    assert.ok(coversWholeScreen(style), 'default toast must still cover the whole screen')
    // 透明背景 + flex 居中是历史行为，不能回归出灰底
    assert.equal(style.backgroundColor, 'rgba(0, 0, 0, 0)', 'mask must stay fully transparent')
    assert.equal(style.display, 'flex', 'mask must keep flex layout for centering')
    assert.equal(style.justifyContent, 'center')
    assert.equal(style.alignItems, 'center')
}

// ------------------------------------ 4. show({ overlay:false })：点击与滚动都能穿透
{
    const { style } = drive({}, { message: 'hello', overlay: false })
    assert.equal(style.pointerEvents, 'none', 'pass-through mask must not eat events')
    // 光靠 pointer-events 不够：nvue(Weex) 不认它，所以遮罩还要收缩到内容大小，
    // 从物理上不再遮挡页面
    assert.equal(style.left, '50%', 'pass-through mask must be centred, not stretched')
    assert.equal(style.top, '50%')
    assert.equal(style.right, 'auto', 'pass-through mask must drop the right:0 stretch')
    assert.equal(style.bottom, 'auto', 'pass-through mask must drop the bottom:0 stretch')
    assert.equal(style.transform, 'translate(-50%, -50%)')
    assert.ok(
        !coversWholeScreen(style),
        'pass-through mask must no longer cover the whole screen'
    )
    assert.equal(style.backgroundColor, 'rgba(0, 0, 0, 0)', 'mask must stay fully transparent')
    assert.equal(style.display, 'flex')
}

// ------------------------- 5. <up-toast :overlay="false"> 现在也能生效（曾经是静默失效）
{
    const { ctx, style } = drive({ overlay: false }, { message: 'hello' })
    assert.equal(ctx.overlayEnabled, false, 'the overlay prop must reach overlayEnabled')
    assert.equal(style.pointerEvents, 'none')
    assert.ok(!coversWholeScreen(style), 'the overlay prop must stop the mask covering the page')
}

// ------------------------------------------ 6. show({ overlay }) 永远压过组件 prop
{
    const blocking = drive({ overlay: false }, { message: 'hello', overlay: true })
    assert.equal(blocking.ctx.overlayEnabled, true, 'show({ overlay:true }) must beat the prop')
    assert.ok(isBlocking(blocking.style), 'show({ overlay:true }) must restore the blocking mask')

    const passing = drive({ overlay: true }, { message: 'hello', overlay: false })
    assert.equal(passing.ctx.overlayEnabled, false, 'show({ overlay:false }) must beat the prop')
    assert.equal(passing.style.pointerEvents, 'none')
}

// ------------------------- 7. 首次 show 之前 overlayStyle 不能把遮罩误判成穿透模式
{
    const ctx = makeCtx({ overlay: true })
    assert.equal(UToast.computed.overlayEnabled.call(ctx), true)
    assert.ok(isBlocking(UToast.computed.overlayStyle.call(ctx)))
}

// --------------------- 8. 收缩遮罩的写法必须留在非 nvue 分支（Weex 不支持百分比 transform）
assert.match(
    toastSource,
    /\/\/ #ifndef APP-NVUE[\s\S]*?style\.transform = 'translate\(-50%, -50%\)'[\s\S]*?\/\/ #endif/,
    'expected the shrink-to-content branch to stay guarded by #ifndef APP-NVUE'
)

// ------------------------------------------------------ 9. 类型定义与演示页面
assert.match(
    read(TOAST_DTS),
    /overlay\?: boolean/,
    'expected ToastProps to declare overlay so IDEs hint it'
)

const demo = read(TOAST_DEMO)
assert.match(demo, /overlay: false/, 'expected the toast demo page to show a pass-through case')
assert.ok(
    !/overlay: true,/.test(demo),
    'the toast demo page must not hardcode overlay: true, otherwise a demo entry cannot opt out'
)

console.log('toast overlay passthrough assertions passed')
