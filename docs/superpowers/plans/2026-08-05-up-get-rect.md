# upGetRect Public Method Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shared `upGetRect` public function for Composition API callers while preserving every existing Options API entry and uview-plus multi-node behavior.

**Architecture:** Move node-query ownership into `libs/function/index.js`, then make the global mixin delegate `$uGetRect` to that shared function with its component instance. The existing root re-export and `$u` object spread expose the new function through both named imports and `uni.$u`, while focused Node assertions cover query selection, component scope, empty results, compatibility wiring, and declarations.

**Tech Stack:** Vue 3, uni-app selector queries, APP-NVUE native dom plugin, JavaScript ES modules, TypeScript declarations, Node.js assertions, Markdown/VitePress documentation.

## Global Constraints

- `all=true` must return the complete node array, not only the first item.
- Keep `$uGetRect(selector, all)` and `uni.$u.getRect` working.
- Add no runtime dependency and change no component call site.
- Support standard uni-app builds and APP-NVUE.
- Resolve missing single nodes with a zero-sized node and missing multi-node queries with `[]`.
- Omit `.in()` when `comp` is missing so page-level queries still honor `selector`.
- Require `comp` for APP-NVUE ref queries; a missing scope resolves the documented empty result.
- Do not bump versions, publish packages, push, or create Git commits.
- Preserve unrelated workspace changes, including the existing untracked `.claude/` directory.

## File Structure

- `scripts/verify-up-get-rect.mjs`: owns deterministic runtime and source-contract assertions.
- `package.json`: exposes the focused verifier as `verify:up-get-rect`.
- `src/uni_modules/uview-plus/libs/function/index.js`: owns the shared cross-platform `upGetRect` implementation and public default export.
- `src/uni_modules/uview-plus/libs/mixin/mixin.js`: retains legacy instance APIs by delegating to the shared function.
- `src/uni_modules/uview-plus/types/func.d.ts`: defines the public overloads and component-scope types.
- `src/uni_modules/uview-plus/types/index.d.ts`: exposes the root named-import declaration.
- `../uview-plus-doc/docs/js/getRect.md`: documents Composition API usage without replacing Options API guidance.

---

### Task 1: Add the Failing Public API Verifier

**Files:**
- Create: `scripts/verify-up-get-rect.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: the public function module, root entry source, and mixin source.
- Produces: `npm run verify:up-get-rect`, initially failing because `upGetRect` is not exported.

- [ ] **Step 1: Create the runtime and export verifier**

Create `scripts/verify-up-get-rect.mjs` with this content:

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = filePath => readFileSync(resolve(repoRoot, filePath), 'utf8')
const functionPath = resolve(repoRoot, 'src/uni_modules/uview-plus/libs/function/index.js')
const mixinSource = read('src/uni_modules/uview-plus/libs/mixin/mixin.js')
const rootSource = read('src/uni_modules/uview-plus/index.js')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:up-get-rect'],
    'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-up-get-rect.mjs',
    'package.json should expose verify:up-get-rect'
)

const queryResults = []
const queryCalls = []

globalThis.uni = {
    createSelectorQuery() {
        const call = {
            comp: undefined,
            method: '',
            selector: '',
            callback: null
        }
        queryCalls.push(call)
        const query = {
            in(comp) {
                call.comp = comp
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
                call.callback(queryResults.shift())
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
        method: 'select',
        selector: '.item',
        callback: queryCalls.at(-1).callback
    },
    'single query should use select in the supplied component scope'
)

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

console.log('upGetRect assertions passed')
```

- [ ] **Step 2: Expose the verifier command**

Add this entry next to the other `verify:*` scripts in `package.json`:

```json
"verify:up-get-rect": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-up-get-rect.mjs"
```

- [ ] **Step 3: Run the verifier and confirm the expected failure**

Run:

```powershell
npm run verify:up-get-rect
```

Expected: FAIL at `function module should export upGetRect` or the mixin delegation assertion because production code has not been changed yet.

---

### Task 2: Implement the Shared Cross-Platform Function

**Files:**
- Modify: `src/uni_modules/uview-plus/libs/function/index.js`
- Modify: `src/uni_modules/uview-plus/libs/mixin/mixin.js`

**Interfaces:**
- Consumes: `uni.createSelectorQuery`, `uni.requireNativePlugin('dom')`, `sleep`, and a Vue component instance.
- Produces: `upGetRect(selector, all = false, comp = null)` and the legacy `$uGetRect(selector, all)` adapter.

- [ ] **Step 1: Add the common query implementation**

Near the top of `libs/function/index.js`, after imports, add the empty-node helper and APP-NVUE dom helper:

```js
function emptyNodeInfo() {
    return {
        width: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }
}

// #ifdef APP-NVUE
const dom = (typeof uni !== 'undefined' && uni && typeof uni.requireNativePlugin === 'function')
    ? uni.requireNativePlugin('dom')
    : null

function getNvueRect(ref) {
    return new Promise((resolve) => {
        if (!dom || !ref) {
            resolve(emptyNodeInfo())
            return
        }
        dom.getComponentRect(ref, (res) => {
            resolve(res && res.size ? res.size : emptyNodeInfo())
        })
    })
}
// #endif
```

Add the exported function before `range`:

```js
export function upGetRect(selector, all = false, comp = null) {
    return new Promise((resolve) => {
        // #ifndef APP-NVUE
        const query = uni.createSelectorQuery()
        const scopedQuery = comp ? query.in(comp) : query
        scopedQuery[all ? 'selectAll' : 'select'](selector)
            .boundingClientRect((rect) => {
                if (all) {
                    resolve(Array.isArray(rect) ? rect : [])
                    return
                }
                resolve(rect || emptyNodeInfo())
            })
            .exec()
        // #endif

        // #ifdef APP-NVUE
        sleep(30).then(async () => {
            const refs = comp?.$refs || comp?.proxy?.$refs || comp?.refs || {}
            const selectorRef = refs[selector.substring(1)]
            if (all) {
                const selectorRefs = Array.isArray(selectorRef)
                    ? selectorRef
                    : selectorRef ? [selectorRef] : []
                resolve(await Promise.all(selectorRefs.map(ref => getNvueRect(ref))))
                return
            }
            const ref = Array.isArray(selectorRef) ? selectorRef[0] : selectorRef
            resolve(await getNvueRect(ref))
        })
        // #endif
    })
}
```

Add `upGetRect` to the default export object before `range`:

```js
export default {
    upGetRect,
    range,
```

- [ ] **Step 2: Replace the mixin implementation with delegation**

Change the function import to:

```js
import { deepMerge, $parent, upGetRect } from '../function/index'
```

Remove the APP-NVUE `dom` constant from the mixin, update the outdated `onLoad` comment to state that `uni.$u.getRect` is retained for compatibility, and replace the existing method body with:

```js
$uGetRect(selector, all = false) {
    return upGetRect(selector, all, this)
},
```

Keep `upBindGetRect` unchanged so `uni.$u.getRect` continues pointing to the instance-bound mixin method.

- [ ] **Step 3: Run the focused verifier**

Run:

```powershell
npm run verify:up-get-rect
```

Expected: PASS with `upGetRect assertions passed`.

---

### Task 3: Add TypeScript Public Contracts

**Files:**
- Modify: `scripts/verify-up-get-rect.mjs`
- Modify: `src/uni_modules/uview-plus/types/func.d.ts`
- Modify: `src/uni_modules/uview-plus/types/index.d.ts`

**Interfaces:**
- Consumes: Vue `ComponentPublicInstance`, Vue `ComponentInternalInstance`, and `UniNamespace.NodeInfo`.
- Produces: precise return inference for `all=false`, `all=true`, and a dynamic boolean.

- [ ] **Step 1: Extend the verifier with failing declaration assertions**

After the existing source reads in `verify-up-get-rect.mjs`, add:

```js
const funcTypes = read('src/uni_modules/uview-plus/types/func.d.ts')
const indexTypes = read('src/uni_modules/uview-plus/types/index.d.ts')
```

Before the final log, add:

```js
assert.match(funcTypes, /import type \{ ComponentInternalInstance, ComponentPublicInstance \} from ['"]vue['"]/, 'func types should import Vue component instance types')
assert.match(funcTypes, /upGetRect\([\s\S]*?all:\s*true[\s\S]*?Promise<UniNamespace\.NodeInfo\[\]>/, 'all=true should return NodeInfo[]')
assert.match(funcTypes, /upGetRect\([\s\S]*?all\?:\s*false[\s\S]*?Promise<UniNamespace\.NodeInfo>/, 'all=false should return NodeInfo')
assert.match(indexTypes, /export const upGetRect:\s*\$u\['upGetRect'\]/, 'root declaration should export upGetRect')
```

Run `npm run verify:up-get-rect` and expect a declaration assertion failure.

- [ ] **Step 2: Define overloads in `Func`**

Add this import to the top of `types/func.d.ts`:

```ts
import type { ComponentInternalInstance, ComponentPublicInstance } from 'vue';
```

Add these overloads after `rpx2px` and before `sleep`:

```ts
  /** 查询当前组件作用域内的单个节点信息 */
  upGetRect(
    selector: string,
    all?: false,
    comp?: ComponentPublicInstance | ComponentInternalInstance | null
  ): Promise<UniNamespace.NodeInfo>;

  /** 查询当前组件作用域内的全部匹配节点信息 */
  upGetRect(
    selector: string,
    all: true,
    comp?: ComponentPublicInstance | ComponentInternalInstance | null
  ): Promise<UniNamespace.NodeInfo[]>;

  /** 使用动态布尔值查询节点信息 */
  upGetRect(
    selector: string,
    all?: boolean,
    comp?: ComponentPublicInstance | ComponentInternalInstance | null
  ): Promise<UniNamespace.NodeInfo | UniNamespace.NodeInfo[]>;
```

- [ ] **Step 3: Expose the root named declaration**

Add this declaration next to `sleep` in `types/index.d.ts`:

```ts
export const upGetRect: $u['upGetRect']
```

- [ ] **Step 4: Re-run declaration verification**

Run:

```powershell
npm run verify:up-get-rect
```

Expected: PASS with all runtime and declaration assertions.

---

### Task 4: Document Composition API Usage

**Files:**
- Modify: `../uview-plus-doc/docs/js/getRect.md`

**Interfaces:**
- Consumes: `getCurrentInstance`, `nextTick`, and the named `upGetRect` export.
- Produces: a Composition API example alongside the retained Options API examples.

- [ ] **Step 1: Add the public method signature**

After the existing `getRect(selector, all = false)` parameter description, add a short `upGetRect(selector, all = false, comp = null)` section explaining that `comp` is the component query scope and that `all=true` still returns a complete array.

- [ ] **Step 2: Add a Composition API example**

Insert this section before the existing asynchronous Options API example:

````markdown
#### 组合式 API 使用方法

组合式 API 中可直接导入 `upGetRect`，并将当前组件代理作为第三个参数传入：

```vue
<script setup>
import { getCurrentInstance, nextTick } from 'vue'
import { upGetRect } from '@/uni_modules/uview-plus'

const instance = getCurrentInstance()

async function getElInfo() {
    await nextTick()
    const rect = await upGetRect('.user-avatar', false, instance?.proxy)
    console.log(rect)
}
</script>
```
````

- [ ] **Step 3: Verify the documentation references**

Run:

```powershell
rg -n "upGetRect|getCurrentInstance|instance\?\.proxy" ..\uview-plus-doc\docs\js\getRect.md
```

Expected: the method signature and Composition API example are both present.

---

### Task 5: Run Final Validation

**Files:**
- Verify all files listed above.

**Interfaces:**
- Consumes: completed implementation, declarations, verifier, and documentation.
- Produces: a clean focused verification result and an explicit report of any unrelated repository failures.

- [ ] **Step 1: Run focused regression verification**

```powershell
npm run verify:up-get-rect
```

Expected: PASS.

- [ ] **Step 2: Run repository type checking**

```powershell
npm run type-check
```

Expected: PASS. If pre-existing errors appear outside the changed API, record them without modifying unrelated files.

- [ ] **Step 3: Check both repositories for whitespace errors**

```powershell
git diff --check
git -C ..\uview-plus-doc diff --check
```

Expected: no output and exit code `0` from both commands.

- [ ] **Step 4: Review scoped diffs and workspace state**

```powershell
git status --short
git diff -- src/uni_modules/uview-plus/libs/function/index.js src/uni_modules/uview-plus/libs/mixin/mixin.js src/uni_modules/uview-plus/types/func.d.ts src/uni_modules/uview-plus/types/index.d.ts scripts/verify-up-get-rect.mjs package.json docs/superpowers/specs/2026-08-05-up-get-rect-design.md docs/superpowers/plans/2026-08-05-up-get-rect.md
git -C ..\uview-plus-doc status --short
git -C ..\uview-plus-doc diff -- docs/js/getRect.md
```

Expected: only the intended files plus previously existing unrelated changes are reported; no version or release file is changed.
