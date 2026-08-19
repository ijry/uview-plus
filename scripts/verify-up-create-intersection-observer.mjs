import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = filePath => readFileSync(resolve(repoRoot, filePath), 'utf8')
const functionPath = resolve(repoRoot, 'src/uni_modules/uview-plus/libs/function/index.js')
const functionSource = read('src/uni_modules/uview-plus/libs/function/index.js')
const lazyLoadSource = read('src/uni_modules/uview-plus/components/u-lazy-load/u-lazy-load.vue')
const stickySource = read('src/uni_modules/uview-plus/components/u-sticky/u-sticky.vue')
const cateTabSource = read('src/uni_modules/uview-plus/components/u-cate-tab/u-cate-tab.vue')
const nodeSource = read('src/uni_modules/uview-plus/components/u-parse/node/node.vue')
const funcTypes = read('src/uni_modules/uview-plus/types/func.d.ts')
const indexTypes = read('src/uni_modules/uview-plus/types/index.d.ts')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:up-create-intersection-observer'],
    'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-up-create-intersection-observer.mjs',
    'package.json should expose verify:up-create-intersection-observer'
)

const globalCalls = []
globalThis.uni = {
    createIntersectionObserver(...args) {
        globalCalls.push(args)
        return { source: 'global', args }
    }
}

const functionModule = await import(`${pathToFileURL(functionPath).href}?verify=${Date.now()}`)
const { upCreateIntersectionObserver } = functionModule

assert.equal(typeof upCreateIntersectionObserver, 'function', 'function module should export upCreateIntersectionObserver')
assert.equal(
    functionModule.default.upCreateIntersectionObserver,
    upCreateIntersectionObserver,
    'default function collection should expose upCreateIntersectionObserver'
)

// --- MP / H5: the instance method exists, so the Vue proxy must never reach the global API.
// This is the actual issue #864 fix: uni only unwraps $scope for createSelectorQuery,
// so passing the proxy to uni.createIntersectionObserver triggers Vue's ownKeys dev warning.
{
    const instanceCalls = []
    const vm = {
        createIntersectionObserver(...args) {
            instanceCalls.push(args)
            return { source: 'instance', args }
        }
    }
    const before = globalCalls.length

    const noOptions = upCreateIntersectionObserver(vm)
    assert.equal(noOptions.source, 'instance', 'MP should use the component instance method')
    assert.deepEqual(instanceCalls.at(-1), [], 'no options should call the instance method with no arguments')

    const options = { thresholds: [0.95, 0.98, 1] }
    const withOptions = upCreateIntersectionObserver(vm, options)
    assert.equal(withOptions.source, 'instance', 'MP should use the instance method when options are supplied')
    assert.deepEqual(instanceCalls.at(-1), [options], 'options should be forwarded as the sole instance argument')

    assert.equal(globalCalls.length, before, 'MP path must not touch uni.createIntersectionObserver')
}

// --- APP: no instance method, so fall back to the global API with the instance intact.
// Guards the trap found while fixing this: passing comp.$scope instead of comp would let
// the global API mistake APP's `{ $getAppWebview }` scope for the options argument and
// silently drop u-sticky's real thresholds.
{
    const scope = { $getAppWebview() {} }
    const vm = { $scope: scope }

    const noOptions = upCreateIntersectionObserver(vm)
    assert.equal(noOptions.source, 'global', 'APP should fall back to the global API')
    assert.deepEqual(globalCalls.at(-1), [vm], 'fallback should pass the component instance, never $scope')

    const options = { thresholds: [0.95, 0.98, 1] }
    upCreateIntersectionObserver(vm, options)
    assert.deepEqual(globalCalls.at(-1), [vm, options], 'fallback must preserve the caller options')
    assert.notEqual(globalCalls.at(-1)[0], scope, '$scope must not be forwarded as the component argument')
}

// --- Degenerate inputs should still produce an observer rather than throwing.
{
    upCreateIntersectionObserver()
    assert.deepEqual(globalCalls.at(-1), [undefined], 'missing instance should still reach the global API')

    upCreateIntersectionObserver({ createIntersectionObserver: 'not-a-function' })
    assert.equal(
        typeof globalCalls.at(-1)[0],
        'object',
        'a non-callable instance member must fall back instead of being invoked'
    )
}

// --- Call sites: every MP-reachable component must go through the helper.
for (const [name, source] of [
    ['u-lazy-load', lazyLoadSource],
    ['u-sticky', stickySource],
    ['u-cate-tab', cateTabSource]
]) {
    assert.match(
        source,
        /import \{[\s\S]*?upCreateIntersectionObserver[\s\S]*?\} from ['"]\.\.\/\.\.\/libs\/function\/index(?:\.js)?['"]/,
        `${name} should import upCreateIntersectionObserver`
    )
    assert.match(source, /upCreateIntersectionObserver\(this/, `${name} should create observers via the helper`)
    assert.doesNotMatch(
        source.replace(/^\s*\/\/.*$/gm, ''),
        /uni\.createIntersectionObserver\(/,
        `${name} should not call uni.createIntersectionObserver directly`
    )
}

assert.match(
    stickySource,
    /upCreateIntersectionObserver\(this,\s*\{[\s\S]*?thresholds:\s*\[0\.95,\s*0\.98,\s*1\]/,
    'u-sticky should keep passing its thresholds through the helper'
)

// u-parse/node is intentionally left alone: its observer is compiled only for H5/APP-PLUS,
// so it never runs on the MP platforms where the warning occurs.
assert.match(
    nodeSource,
    /#ifdef H5 \|\| APP-PLUS[\s\S]*?uni\.createIntersectionObserver\(this\)/,
    'u-parse/node observer should remain inside the H5/APP-PLUS conditional block'
)

assert.match(
    functionSource,
    /export function upCreateIntersectionObserver\(comp,\s*options\)/,
    'helper should accept the component instance and options'
)

assert.match(
    funcTypes,
    /upCreateIntersectionObserver\([\s\S]*?comp\?:[\s\S]*?options\?:\s*UniNamespace\.CreateIntersectionObserverOptions[\s\S]*?\):\s*UniNamespace\.IntersectionObserver/,
    'func types should declare upCreateIntersectionObserver'
)
assert.match(
    indexTypes,
    /export const upCreateIntersectionObserver:\s*\$u\['upCreateIntersectionObserver'\]/,
    'root declaration should export upCreateIntersectionObserver'
)

console.log('upCreateIntersectionObserver assertions passed')
