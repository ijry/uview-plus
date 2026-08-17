# Root App.up.vue nvue 复用 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with review checkpoints.

**Goal:** 让 Root 处理的原生 App nvue 页面逐页实例化项目 `App.up.vue`，并在 App-Vue/App-nvue 中显示对应的 `VUE`/`NVUE` 渲染标识。

**Architecture:** Root 插件把项目根文件路径传给 nvue 页面转换器，转换器为每个 nvue 页面本地注册 `App.up.vue` 并包裹页面模板。`App.up.vue` 保留 Vue 端全局样式，同时提供 nvue 安全的根尺寸、主题刷新和渲染标识；Root View 的 Toast/Notify 宿主由重建阶段注入为本地组件，避免依赖 App Service 全局注册。

**Tech Stack:** Vite plugin、Vue 3 SFC、`MagicString`、uni-app 条件编译、Node.js assertion scripts。

## Global Constraints

- nvue 页面继续使用原生 nvue 编译器，不转换成 WebView Vue。
- 每个 nvue 页面拥有独立的 `App.up.vue` 实例，不跨 WebView 共享 Vue 实例。
- 非 App 平台和现有 APP-VUE 页面行为保持不变。
- `App.up.vue` 的 WebView 全局样式不得进入 nvue 样式编译器。
- Root 自动创建根文件、页面 Root ref、nvue `page-meta` 导航栏和主题辅助注入必须继续有效。

---

### Task 1: Add transform regression coverage

**Files:**
- Create: `scripts/verify-root-app-up-nvue.mjs`
- Modify: `package.json:53-66`

**Interfaces:**
- Consumes: `transformNvuePage(code, appRootImportPath, runtimeImportPath, enabledGlobalRef)` and `rebuildUpApp(code, enabledVirtualHost, options)`.
- Produces: `npm run verify:root-app-up-nvue` coverage for all generated SFC shapes and App.up marker/style conditions.

- [ ] **Step 1: Write the failing assertions**

Create a Node assertion script that imports the Root transform helpers and checks:

```js
const setupResult = (await transformNvuePage(
  '<template><view /></template><script setup>const value = 1</script>',
  './App.up.vue',
  './runtime.js'
)).toString()
assert.match(setupResult, /import AppUpRoot from ['"]\.\/App\.up\.vue['"]/
assert.match(setupResult, /<AppUpRoot\b/)
assert.match(setupResult, /<\/AppUpRoot>/)

const optionsResult = (await transformNvuePage(
  '<template><view /></template><script>export default {}</script>',
  './App.up.vue',
  './runtime.js'
)).toString()
assert.match(optionsResult, /import AppUpRoot from ['"]\.\/App\.up\.vue['"]/
assert.match(optionsResult, /components:\s*\{\s*AppUpRoot\s*[,}]/)

const noScriptResult = (await transformNvuePage(
  '<template><view /></template>',
  './App.up.vue',
  './runtime.js'
)).toString()
assert.match(noScriptResult, /components:\s*\{\s*AppUpRoot\s*\}/)

const rebuiltRoot = await rebuildUpApp(
  '<template><UpRootView /></template><script setup>const ready = true</script>',
  false,
  { rootToastHostImportPath: './root-toast-host.vue' }
)
assert.match(rebuiltRoot.toString(), /<slot \/>/)
assert.match(rebuiltRoot.toString(), /<UpRootToastHost \/>/)
assert.match(rebuiltRoot.toString(), /import UpRootToastHost from ['"]\.\/root-toast-host\.vue['"]/
```

Read `src/App.up.vue` and assert it contains both `APP-VUE`/`APP-NVUE` labels and an `APP-NVUE` conditional around the nvue branch while the existing global style imports remain under `#ifndef APP-NVUE`.

- [ ] **Step 2: Run the new script and verify it fails**

Run: `node scripts/verify-root-app-up-nvue.mjs`

Expected: FAIL because nvue transforms still import `UpNvueRoot`, `rebuildUpApp` does not inject a local Toast host, and the App.up marker is absent.

- [ ] **Step 3: Register the verification command**

Add the following script beside the existing Root checks:

```json
"verify:root-app-up-nvue": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-root-app-up-nvue.mjs"
```

- [ ] **Step 4: Run the script again after implementation tasks**

Run: `npm run verify:root-app-up-nvue`

Expected: PASS for script setup, Options API, no-script pages, root-host rebuilding, and App.up condition checks.

---

### Task 2: Make nvue pages use the project App.up.vue

**Files:**
- Modify: `src/uni_modules/uview-plus/libs/root/index.js:64-68,194-207`
- Modify: `src/uni_modules/uview-plus/libs/root/page.js:55-268`
- Test: `scripts/verify-root-app-up-nvue.mjs`

**Interfaces:**
- Consumes: the absolute `appUpPath` already calculated by `UniUpRoot` and the existing theme runtime import path.
- Produces: nvue transforms that import `AppUpRoot` and wrap page content with it while retaining current navigation-bar and theme helper injections.

- [ ] **Step 1: Pass the App.up path to the nvue transform**

In `index.js`, keep `appUpPath` as the source of truth and call:

```js
ms = await transformNvuePage(
  code,
  getRelativeImportPath(cleanId, appUpPath),
  getRelativeImportPath(cleanId, themeRuntimePath),
  rootOptions.enabledGlobalRef
)
```

Remove the default nvue wrapper path from this call; keep `nvue-root.vue` on disk for compatibility with direct consumers.

- [ ] **Step 2: Rename the injected nvue root component**

In `page.js`, change the nvue-only generated component from `UpNvueRoot` to `AppUpRoot` in all three script forms:

```js
import AppUpRoot from './App.up.vue'
```

Use `<AppUpRoot>` in `wrapTemplate`, add `AppUpRoot` to Options API `components`, and generate it for pages without a script. Leave the existing `__upNvueThemeMixin` and script-setup theme helpers unchanged so page code keeps its current API.

- [ ] **Step 3: Run transform assertions**

Run: `node scripts/verify-root-app-up-nvue.mjs`

Expected: the page-shape assertions pass; root-host assertions may still fail until Task 3 is complete.

---

### Task 3: Register Root Toast/Notify locally in App.up.vue

**Files:**
- Modify: `src/uni_modules/uview-plus/libs/root/root.js:20-39`
- Modify: `src/uni_modules/uview-plus/libs/root/index.js:184-195`
- Test: `scripts/verify-root-app-up-nvue.mjs`

**Interfaces:**
- Consumes: `rootToastHostPath` calculated by `UniUpRoot`.
- Produces: `rebuildUpApp(code, enabledVirtualHost, { rootToastHostImportPath })` that emits `<UpRootToastHost />` and registers the imported component for script setup, Options API, and no-script roots.

- [ ] **Step 1: Extend rebuildUpApp with a local host option**

Change the function signature to:

```js
export async function rebuildUpApp(
  code,
  enabledVirtualHost = false,
  { rootToastHostImportPath = '' } = {}
)
```

Replace the generated root body with `<slot />` and `<UpRootToastHost />` when an import path is supplied. Inject:

```js
import UpRootToastHost from './uni_modules/uview-plus/libs/root/root-toast-host.vue'
```

at the script-setup start, add the import plus `components: { UpRootToastHost }` for Options API, or append a script exporting that component for a root with no script. Do not duplicate an import or registration if the source already contains `UpRootToastHost`.

- [ ] **Step 2: Pass the relative host path from the plugin**

When transforming `App.up.vue`, call:

```js
ms = await rebuildUpApp(code, rootOptions.enabledVirtualHost, {
  rootToastHostImportPath: getRelativeImportPath(cleanId, rootToastHostPath)
})
```

Keep `registerUpApp`'s existing global registration for compatibility; the local import is required by nvue page apps.

- [ ] **Step 3: Run root rebuild assertions**

Run: `node scripts/verify-root-app-up-nvue.mjs`

Expected: all page transform and Toast/Notify host assertions pass.

---

### Task 4: Make App.up.vue nvue-safe and add the render marker

**Files:**
- Modify: `src/App.up.vue:1-80`
- Test: `scripts/verify-root-app-up-nvue.mjs`

**Interfaces:**
- Consumes: the existing `uni.$u` theme runtime and Root View slot replacement.
- Produces: an App-only `VUE`/`NVUE` marker, nvue-safe root dimensions, and unchanged Vue global style behavior.

- [ ] **Step 1: Add compile-time render labels**

Place these siblings inside the root view so each page instance displays exactly one label:

```vue
<!-- #ifdef APP-VUE -->
<text class="up-render-mode">VUE</text>
<!-- #endif -->
<!-- #ifdef APP-NVUE -->
<text class="up-render-mode">NVUE</text>
<!-- #endif -->
```

Do not render either node on H5 or mini-program platforms.

- [ ] **Step 2: Add the nvue root dimensions**

In the `APP-NVUE` branch of `buildRootStyle`, calculate the window height using `uni.getWindowInfo()` with `uni.getSystemInfoSync()` fallback, then return the existing theme vars plus:

```js
minHeight: `${windowHeight || 0}px`,
width: '750rpx',
backgroundColor: getThemePageBgColor()
```

Keep the WebView branch using CSS variable fallbacks and `100vh`.

- [ ] **Step 3: Isolate WebView global styles**

Wrap the current `uview-plus/index.scss`, `:root/page/body` variables, and `common/demo.scss` imports in `/* #ifndef APP-NVUE */ ... /* #endif */`. Add only simple App-Vue/App-Nvue `.up-render-mode` rules; use fixed positioning, high z-index, compact padding, and `pointer-events: none` so the marker never blocks page interaction. Keep the nvue rule free of WebView-only selectors.

- [ ] **Step 4: Run App.up source assertions**

Run: `npm run verify:root-app-up-nvue`

Expected: marker, platform conditions, and nvue dimension assertions pass.

---

### Task 5: Run focused regression checks and App build

**Files:**
- Modify: none
- Test: `scripts/verify-root-app-up-nvue.mjs`, existing verification scripts, generated build output

**Interfaces:**
- Consumes: completed Root and App.up changes.
- Produces: verified transforms and an App build that resolves `App.up.vue` from nvue page entries.

- [ ] **Step 1: Run the new focused verification**

Run: `npm run verify:root-app-up-nvue`

Expected: PASS.

- [ ] **Step 2: Run existing Root-related checks**

Run: `npm run verify:root-nvue-entry-signatures; npm run verify:app-nvue-as-vue; npm run verify:app-local-icon-font`

Expected: all three existing checks pass without changing their assertions.

- [ ] **Step 3: Build the App target**

Run: `npm run build:app`

Expected: Vite completes the App Service and nvue sub-build without unresolved `AppUpRoot` or `UpRootToastHost` imports. If the local environment lacks an App native SDK, record that limitation and retain the focused transform checks as validation.

- [ ] **Step 4: Check the final diff**

Run: `git diff --check; git status --short`

Expected: no whitespace errors, only the planned Root/App/test files changed, and no generated build artifacts are staged.

