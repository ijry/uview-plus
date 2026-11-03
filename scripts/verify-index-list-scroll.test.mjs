import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import test from 'node:test'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const isPlus = fs.existsSync(path.join(root, 'src/uni_modules/uview-plus/components/u-index-list/u-index-list.vue'))
const modulePath = isPlus ? 'src/uni_modules/uview-plus' : 'uni_modules/uview-ultra'
const component = isPlus ? 'u-index-list/u-index-list.vue' : 'up-index-list/up-index-list.vue'
const relativeFile = `${modulePath}/components/${component}`
const source = process.env.INDEX_SCROLL_REF
    ? execFileSync('git', ['-C', root, 'show', `${process.env.INDEX_SCROLL_REF}:${relativeFile}`], { encoding: 'utf8' })
    : fs.readFileSync(path.join(root, relativeFile), 'utf8')
const pattern = isPlus
    ? /async scrollHandler\(e\) \{\r?\n([\s\S]*?)\r?\n\t{3}\},/
    : /async function scrollHandler\(e\) \{\r?\n([\s\S]*?)\r?\n\t\}/
const match = source.match(pattern)
assert.ok(match, 'production scroll handler must be found')
const { getPx } = await import(pathToFileURL(path.join(root, modulePath, 'libs/function/index.js')))
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

function platformBody(nvue) {
    const active = [true]
    return match[1].split(/\r?\n/).filter(line => {
        const start = line.match(/^\s*\/\/ #(ifdef|ifndef) APP-NVUE\s*$/)
        if (start) {
            active.push(active.at(-1) && (start[1] === 'ifdef' ? nvue : !nvue))
            return false
        }
        if (/^\s*\/\/ #endif\s*$/.test(line)) {
            active.pop()
            return false
        }
        return active.at(-1)
    }).join('\n')
}

function harness(nvue, options = {}) {
    const state = {
        touching: false,
        scrolling: false,
        children: [{ height: 100 }, { height: 60 }, { height: 140 }],
        anchors: [{ height: 20 }, { height: 30 }, { height: 15 }],
        itemMargin: '10px',
        customNavHeight: 0,
        activeIndex: -77,
        sys: { windowHeight: 800, windowWidth: 390 },
        ...options,
    }
    const calls = { system: 0, header: 0, delays: [] }
    const timers = []
    const sleep = delay => {
        calls.delays.push(delay)
        return new Promise(resolve => timers.push(resolve))
    }
    const query = () => { calls.system++; return state.sys }
    const header = async () => { calls.header++; return { width: 390, height: options.headerHeight ?? 40 } }
    state.getHeaderRect = header
    const dependencies = { sleep, getWindowInfo: query, getPx, getHeaderRect: header, props: state }
    for (const key of isPlus ? [] : ['touching', 'scrolling', 'children', 'anchors', 'activeIndex']) {
        dependencies[key] = {
            get value() { return state[key] },
            set value(value) { state[key] = value },
        }
    }
    const execute = new AsyncFunction('e', ...Object.keys(dependencies), platformBody(nvue))
    return {
        state,
        calls,
        run(offset) {
            const event = nvue ? { contentOffset: { y: offset } } : { detail: { scrollTop: offset } }
            return execute.call(state, event, ...Object.values(dependencies))
        },
        async releaseTimers() {
            for (const resolve of timers.splice(0)) resolve()
            await Promise.resolve()
        },
    }
}

for (const nvue of [true, false]) {
    const platform = nvue ? 'APP-NVUE' : 'non-nvue'
    test(`${platform}: scroll positions preserve section highlighting and boundaries`, async () => {
        const cases = nvue
            ? [[0, -1], [-400, -1], [-410, 0], [-1690, 0], [-1700, 2], [-1710, 1], [-2690, 1], [-2700, 2], [-2710, 2], [-4190, 2], [-4200, -1]]
            : [[0, -1], [40, -1], [41, 0], [149, 0], [150, 2], [151, 1], [219, 1], [220, 2], [221, 2], [369, 2], [370, -1]]
        for (const [offset, expected] of cases) {
            const h = harness(nvue)
            const children = structuredClone(h.state.children)
            const anchors = structuredClone(h.state.anchors)
            await h.run(offset)
            assert.equal(h.state.activeIndex, expected, `offset=${offset}`)
            assert.deepEqual(h.state.children, children, 'scroll must not mutate child measurements')
            assert.deepEqual(h.state.anchors, anchors, 'scroll must not mutate anchors')
            assert.equal(h.calls.header, 1)
            assert.deepEqual(h.calls.delays, [10])
        }
    })

    test(`${platform}: custom navigation offset, empty list and single section remain supported`, async () => {
        const shifted = harness(nvue, { customNavHeight: '5px' })
        await shifted.run(nvue ? -360 : 36)
        assert.equal(shifted.state.activeIndex, 0)
        const empty = harness(nvue, { children: [], anchors: [] })
        await empty.run(0)
        assert.equal(empty.state.activeIndex, -77)
        const single = harness(nvue, { children: [{ height: 100 }], anchors: [{ height: 20 }] })
        await single.run(nvue ? -410 : 41)
        assert.equal(single.state.activeIndex, 0)
    })

    test(`${platform}: touch guard and 10ms sampling guard still suppress duplicate work`, async () => {
        const touching = harness(nvue, { touching: true })
        await touching.run(nvue ? -410 : 41)
        assert.equal(touching.calls.header, 0)
        assert.deepEqual(touching.calls.delays, [])
        assert.equal(touching.calls.system, 0)
        const h = harness(nvue)
        await h.run(nvue ? -410 : 41)
        await h.run(nvue ? -2710 : 221)
        assert.equal(h.state.activeIndex, 0)
        assert.equal(h.calls.header, 1)
        await h.releaseTimers()
        assert.equal(h.state.scrolling, false)
        await h.run(nvue ? -2710 : 221)
        assert.equal(h.state.activeIndex, 2)
        assert.equal(h.calls.header, 2)
    })

    test(`${platform}: scrolling performs no redundant system-information query`, async () => {
        const h = harness(nvue)
        for (const offset of nvue ? [-410, -1710, -2710] : [41, 151, 221]) {
            await h.run(offset)
            await h.releaseTimers()
        }
        assert.equal(h.calls.system, 0, 'scroll sampling must not call getWindowInfo')
        assert.equal(h.state.activeIndex, 2)
        assert.equal(h.calls.header, 3, 'existing live header measurement must be retained')
    })
}
