#!/usr/bin/env node

/**
 * Regression check for issue #554 — `v-model:rangeValue` on u-slider.
 *
 * `v-model:rangeValue="x"` compiles to `:rangeValue="x"` + `@update:rangeValue`.
 * u-slider used to emit `update:modelValue` for the range case, so that listener
 * was never fired and the binding only appeared to work because updateValue()
 * mutates the prop array in place — which silently breaks as soon as the parent's
 * bound value is not the very same array object.
 *
 * This script mounts the real u-slider.vue in jsdom (uni-app conditional
 * compilation resolved for VUE3/H5) and asserts the two-way contract end to end.
 * It fails on the unfixed component.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'
import { parse, compileTemplate } from 'vue/compiler-sfc'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = p => readFileSync(resolve(root, p), 'utf8')

const SLIDER = 'src/uni_modules/uview-plus/components/u-slider/u-slider.vue'
const PROPS = 'src/uni_modules/uview-plus/components/u-slider/props.js'

const sliderSource = read(SLIDER)

// ------------------------------------------------------------------- jsdom env
const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true })
globalThis.window = dom.window
globalThis.document = dom.window.document
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
for (const k of ['Element', 'SVGElement', 'Node', 'HTMLElement']) globalThis[k] = dom.window[k]
globalThis.uni = { upx2px: v => Number(v) / 2 }

const vueRuntime = await import('vue')
const { createApp, ref, computed, nextTick } = vueRuntime

// uni-app conditional compilation: keep the VUE3 / H5 branches
function preprocess(src) {
    const TRUE = new Set(['VUE3', 'H5', 'WEB'])
    const out = []
    const stack = []
    for (const line of src.split(/\r?\n/)) {
        const m = line.match(/^\s*(?:\/\/|<!--)\s*#(ifdef|ifndef|endif)\s*([^\s>-]*)/)
        if (m) {
            const [, kind, flagExpr] = m
            if (kind === 'endif') stack.pop()
            else {
                const hit = flagExpr.split('||').map(s => s.trim()).filter(Boolean).some(f => TRUE.has(f))
                stack.push({ emit: kind === 'ifdef' ? hit : !hit })
            }
            out.push('')
            continue
        }
        out.push(stack.every(s => s.emit) ? line : '')
    }
    return out.join('\n')
}

const compileToRender = (source, extra = {}) => {
    const { code } = compileTemplate({
        id: 'x',
        filename: 'x.vue',
        source,
        compilerOptions: { mode: 'function', hoistStatic: false, prefixIdentifiers: true, ...extra }
    })
    return new Function('Vue', code)(vueRuntime)
}

const fileUrl = p => 'file:///' + resolve(root, p).replace(/\\/g, '/')

// --------------------------------------------------- build the real component
const { descriptor } = parse(preprocess(sliderSource), { filename: 'u-slider.vue' })

const script = descriptor.script.content
    .replace(/^\s*import[\s\S]*?from\s*['"][^'"]+['"]\s*;?\s*$/gm, '')
    .replace(/const dom = uni\.requireNativePlugin\('dom'\)/g, '')
    .replace(/export default/, 'return')

const helpers = await import(fileUrl('src/uni_modules/uview-plus/libs/function/index.js'))
const digit = await import(fileUrl('src/uni_modules/uview-plus/libs/function/digit.js'))
const sliderDefaults = (await import(fileUrl('src/uni_modules/uview-plus/components/u-slider/slider.js'))).default

// props.js has an extensionless import; evaluate it with stubs instead
const propsSrc = preprocess(read(PROPS))
    .replace(/^\s*import[\s\S]*?from\s*['"][^'"]+['"]\s*;?\s*$/gm, '')
    .replace(/^\s*const defProps[\s\S]*?$/m, 'const defProps = SliderDefaultProps;')
    .replace(/export const props =/, 'return')
const sliderProps = new Function('defineMixin', 'SliderDefaultProps', propsSrc)(o => o, sliderDefaults)

const USlider = new Function(
    'addUnit', 'addStyle', 'getPx', 'sleep', 'digitLength', 'strip', 'props', 'mpMixin', 'mixin', script
)(helpers.addUnit, helpers.addStyle, helpers.getPx, helpers.sleep, digit.digitLength, digit.strip, sliderProps, {}, {})

USlider.render = compileToRender(descriptor.template.content, { isCustomElement: t => t === 'slider' })

const TRACK = 300 // deterministic track width, stands in for $uGetRect
USlider.mixins = [...(USlider.mixins || []), {
    methods: { $uGetRect: () => Promise.resolve({ left: 0, top: 0, width: TRACK, height: 2 }) }
}]

// ------------------------------------------------------------------- harness
const MIN = 0
const MAX = 500
const STEP = 10
const widthFor = value => `${(value - MIN) / (MAX - MIN) * TRACK}px`
const touch = x => ({ touches: [{ clientX: x, clientY: 1 }] })

async function mount(template, setup) {
    const refs = {}
    const warnings = []
    const app = createApp({
        components: { USlider },
        setup: () => ({
            min: MIN,
            max: MAX,
            step: STEP,
            setRef: el => { if (el) refs.slider = el },
            setRefB: el => { if (el) refs.sliderB = el },
            ...(setup ? setup() : {})
        }),
        render: compileToRender(template, { isCustomElement: t => t === 'view' })
    })
    app.config.warnHandler = msg => { if (!/customStyle/.test(msg)) warnings.push(msg) }
    const host = dom.window.document.createElement('div')
    dom.window.document.body.appendChild(host)
    app.mount(host)
    await settle()
    return { ...refs, warnings, host, app }
}

async function settle(ms = 20) {
    await nextTick()
    await new Promise(r => setTimeout(r, ms))
    await nextTick()
}

// drag a handle from the left edge to `x` and release
async function drag(slider, x, index) {
    slider.onTouchStart(touch(0), index)
    slider.onTouchMove(touch(x), index)
    slider.onTouchEnd(touch(x), index)
    await settle()
}

const RANGE_TPL = extra => `<u-slider :ref="setRef" isRange showValue
    :min="min" :max="max" :step="step" ${extra} />`

// 1. v-model:rangeValue must produce update:rangeValue, and the parent must follow
{
    const priceValue = ref([0, 100])
    const seen = []
    const { slider } = await mount(
        RANGE_TPL('v-model:rangeValue="priceValue" @update:rangeValue="onRange"'),
        () => ({ priceValue, onRange: v => seen.push([...v]) })
    )
    assert.equal(slider.barStyle.width, widthFor(100), 'initial high bar must reflect rangeValue[1]')

    await drag(slider, 180) // 180/300 of 0..500 => 300
    assert.ok(seen.length > 0, 'v-model:rangeValue installs @update:rangeValue; the component never fired it')
    assert.deepEqual(priceValue.value, [0, 300], 'parent value must follow the drag through v-model:rangeValue')
    assert.equal(slider.barStyle.width, widthFor(300), 'high bar must follow the drag')
}

// 2. a parent that does not share the array object must still be updated:
//    the in-place prop mutation cannot reach a copy / computed / store getter
{
    const priceValue = ref([0, 100])
    const { slider } = await mount(
        RANGE_TPL(':rangeValue="copy" @update:rangeValue="onRange"'),
        () => ({
            copy: [priceValue.value[0], priceValue.value[1]],
            onRange: v => { priceValue.value = [v[0], v[1]] }
        })
    )
    await drag(slider, 180)
    assert.deepEqual(
        priceValue.value, [0, 300],
        'the drag must reach a parent that keeps its own array; in-place prop mutation is not a writeback path'
    )
}

// 3. loop safety: a parent that normalises through a computed and writes back a
//    fresh array must converge, not thrash on array identity
{
    const priceValue = ref([0, 100])
    const { slider, warnings } = await mount(
        RANGE_TPL(':rangeValue="normalized" @update:rangeValue="onRange"'),
        () => ({
            normalized: computed(() => [priceValue.value[0], priceValue.value[1]]),
            onRange: v => { priceValue.value = [v[0], v[1]] }
        })
    )
    await drag(slider, 180)
    await settle(30)
    assert.deepEqual(priceValue.value, [0, 300], 'normalising parent must end up with the dragged value')
    assert.deepEqual(
        warnings.filter(w => /recursive/i.test(w)), [],
        'echoing every updateValue back out creates an infinite update cycle for a copying parent'
    )
}

// 4. clamping caused by an external change must be reported, not applied silently
{
    const priceValue = ref([0, 100])
    const seen = []
    await mount(
        RANGE_TPL('v-model:rangeValue="priceValue" @update:rangeValue="onRange"'),
        () => ({ priceValue, onRange: v => seen.push([...v]) })
    )
    seen.length = 0
    priceValue.value = [500, 500] // low handle cannot reach max, it is clamped to max - step
    await settle()
    assert.deepEqual(priceValue.value, [490, 500], 'low handle must be clamped one step below the high handle')
    assert.deepEqual(seen, [[490, 500]], 'the clamped value must be reported through update:rangeValue')
}

// 5. external replacement of the whole array still drives the bars (issue #554's
//    literal complaint, fixed by the rangeValue watcher in 64c582c31 / 3.3.60)
{
    const priceValue = ref([0, 100])
    const { slider } = await mount(RANGE_TPL('v-model:rangeValue="priceValue"'), () => ({ priceValue }))
    priceValue.value = [400, 500]
    await settle()
    assert.equal(slider.barStyle0.width, widthFor(400), 'low bar must follow an external change')
    assert.equal(slider.barStyle.width, widthFor(500), 'high bar must follow an external change')
}

// 6. instances that omit rangeValue must not share one array
{
    const { slider, sliderB } = await mount(
        `<view><u-slider :ref="setRef" isRange :min="min" :max="max" :step="step" />` +
        `<u-slider :ref="setRefB" isRange :min="min" :max="max" :step="step" /></view>`
    )
    assert.notEqual(slider.rangeValue, sliderB.rangeValue, 'two sliders must not share the default array')
    await drag(slider, 180)
    assert.deepEqual(sliderB.rangeValue, [0, STEP], 'dragging one slider must not move another instance')
}

// 7. the single-value path must be untouched
{
    const value = ref(30)
    const stray = []
    const { slider } = await mount(
        `<u-slider :ref="setRef" showValue :min="min" :max="max" :step="step"
            v-model="value" @update:rangeValue="onRange" />`,
        () => ({ value, onRange: v => stray.push(v) })
    )
    assert.equal(slider.barStyle.width, widthFor(30), 'scalar value must position the bar on mount')
    await drag(slider, 150)
    assert.equal(value.value, 250, 'scalar v-model must still follow the drag')
    assert.equal(slider.barStyle.width, widthFor(250), 'scalar bar must follow the drag')
    assert.deepEqual(stray, [], 'the single-value path must not emit update:rangeValue')
}

// ---------------------------------------------------------------- source guards
// last on purpose: a behavioural failure is far more informative than a regex miss
assert.match(
    sliderSource,
    /emits:\s*\[[^\]]*["']update:rangeValue["'][^\]]*\]/,
    'u-slider must declare update:rangeValue in emits'
)
assert.match(
    sliderSource,
    /\$emit\(\s*["']update:rangeValue["']/,
    'u-slider must emit update:rangeValue so v-model:rangeValue has a writeback path'
)
assert.match(
    read(PROPS),
    /rangeValue:\s*\{[^}]*default:\s*\(\)\s*=>\s*\[/,
    'rangeValue default must be a factory, otherwise every instance shares one array'
)

console.log('slider v-model:rangeValue assertions passed')
