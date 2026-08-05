import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const read = filePath => readFileSync(resolve(repoRoot, filePath), 'utf8')
const functionPath = resolve(repoRoot, 'src/uni_modules/uview-plus/libs/function/index.js')
const functionSource = read('src/uni_modules/uview-plus/libs/function/index.js')
const mixinSource = read('src/uni_modules/uview-plus/libs/mixin/mixin.js')
const rootSource = read('src/uni_modules/uview-plus/index.js')
const funcTypes = read('src/uni_modules/uview-plus/types/func.d.ts')
const indexTypes = read('src/uni_modules/uview-plus/types/index.d.ts')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:up-get-rect'],
    'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-up-get-rect.mjs',
    'package.json should expose verify:up-get-rect'
)

const queryResults = []
const queryCalls = []
const skipSelectorResult = Symbol('skipSelectorResult')

const { initPreContext, preJs, preNVueJs } = require(resolve(
    repoRoot,
    'node_modules/@dcloudio/uni-cli-shared/dist/preprocess/index.js'
))
initPreContext('app')
const vueFunctionSource = preJs(functionSource, functionPath)
const nvueFunctionSource = preNVueJs(functionSource, functionPath)

assert.match(vueFunctionSource, /createSelectorQuery\(\)/, 'Vue output should retain selector-query code')
assert.doesNotMatch(vueFunctionSource, /requireNativePlugin\(['"]dom['"]\)|getNvueRect/, 'Vue output should remove APP-NVUE code')
assert.match(nvueFunctionSource, /requireNativePlugin\(['"]dom['"]\)/, 'NVUE output should retain native dom code')
assert.doesNotMatch(nvueFunctionSource, /createSelectorQuery\(\)/, 'NVUE output should remove selector-query code')

globalThis.uni = {
    createSelectorQuery() {
        const call = {
            comp: undefined,
            inCalled: false,
            method: '',
            selector: '',
            callback: null
        }
        queryCalls.push(call)
        const query = {
            in(comp) {
                call.comp = comp
                call.inCalled = true
                return query
            },
            select(selector) {
                call.method = 'select'
                call.selector = selector
                return query
            },
            selectAll(selector) {
                call.method = 'selectAll'
                call.selector = selector
                return query
            },
            boundingClientRect(callback) {
                call.callback = callback
                return query
            },
            exec() {
                const result = queryResults.shift()
                if (result !== skipSelectorResult) {
                    call.callback(result)
                }
                return query
            }
        }
        return query
    },
    requireNativePlugin(name) {
        assert.equal(name, 'dom')
        return {
            getComponentRect(ref, callback) {
                callback({ size: ref.rect })
            }
        }
    }
}

const functionModule = await import(`${pathToFileURL(functionPath).href}?verify=${Date.now()}`)
const { upGetRect } = functionModule

assert.equal(typeof upGetRect, 'function', 'function module should export upGetRect')
assert.equal(functionModule.default.upGetRect, upGetRect, 'default function collection should expose upGetRect')
assert.match(rootSource, /export \* from ['"]\.\/libs\/function\/index\.js['"]/, 'root entry should re-export public functions')
assert.match(
    mixinSource,
    /\$uGetRect\(selector,\s*all(?:\s*=\s*false)?\)\s*\{\s*return upGetRect\(selector,\s*all,\s*this\)\s*\}/,
    '$uGetRect should delegate to upGetRect with the component instance'
)

const comp = {
    $refs: {
        item: [
            { rect: { width: 10, height: 20 } },
            { rect: { width: 30, height: 40 } }
        ]
    }
}
const singleRect = { width: 10, height: 20 }
queryResults.push(singleRect)
assert.deepEqual(await upGetRect('.item', false, comp), singleRect)
assert.deepEqual(
    queryCalls.at(-1),
    {
        comp,
        inCalled: true,
        method: 'select',
        selector: '.item',
        callback: queryCalls.at(-1).callback
    },
    'single query should use select in the supplied component scope'
)

queryResults.push(singleRect)
assert.deepEqual(await upGetRect('.item'), singleRect)
assert.equal(queryCalls.at(-1).inCalled, false, 'missing component scope should not call in(null)')

const allRects = [singleRect, { width: 30, height: 40 }]
queryResults.push(allRects)
assert.deepEqual(await upGetRect('.item', true, comp), allRects)
assert.equal(queryCalls.at(-1).method, 'selectAll', 'all=true should use selectAll')
assert.equal(queryCalls.at(-1).comp, comp, 'all=true should retain component scope')

queryResults.push(null)
assert.deepEqual(
    await upGetRect('.missing', false, { $refs: {} }),
    { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 },
    'missing single node should resolve a zero-sized node'
)

queryResults.push([])
assert.deepEqual(await upGetRect('.missing', true, { $refs: {} }), [], 'missing multi-node query should resolve []')

queryResults.push(skipSelectorResult)
assert.deepEqual(
    await upGetRect('.item', true, comp),
    [{ width: 10, height: 20 }, { width: 30, height: 40 }],
    'APP-NVUE all=true should resolve every matching ref'
)

queryResults.push(skipSelectorResult)
assert.deepEqual(
    await upGetRect('.item', false, comp),
    { width: 10, height: 20 },
    'APP-NVUE single query should resolve the first matching ref'
)

queryResults.push(skipSelectorResult)
assert.deepEqual(
    await upGetRect('.missing', false, { $refs: {} }),
    { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 },
    'APP-NVUE missing ref should resolve a zero-sized node'
)

queryResults.push(skipSelectorResult)
assert.deepEqual(
    await upGetRect('.item'),
    { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 },
    'APP-NVUE query without a component scope should resolve a zero-sized node'
)

assert.match(funcTypes, /import type \{ ComponentInternalInstance, ComponentPublicInstance \} from ['"]vue['"]/, 'func types should import Vue component instance types')
assert.match(funcTypes, /upGetRect\([\s\S]*?all:\s*true[\s\S]*?Promise<UniNamespace\.NodeInfo\[\]>/, 'all=true should return NodeInfo[]')
assert.match(funcTypes, /upGetRect\([\s\S]*?all\?:\s*false[\s\S]*?Promise<UniNamespace\.NodeInfo>/, 'all=false should return NodeInfo')
assert.match(indexTypes, /export const upGetRect:\s*\$u\['upGetRect'\]/, 'root declaration should export upGetRect')

console.log('upGetRect assertions passed')
