# App nvue 按 Vue 编译实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with verification checkpoints.

**Goal:** 增加一个默认关闭的项目级编译开关，开启后仅在 App 编译中将普通 `.nvue` 页面按 Vue 页面处理。

**Architecture:** 在 `uni()` 初始化前注册项目级 Vite 插件。插件仅在 `UNI_PLATFORM=app` 且配置或环境变量开关开启时，包装 `@dcloudio/uni-cli-shared/dist/json/pages.js` 的页面解析导出，将普通页面的 `style.isNVue` 设为 `false`，保留 `isSubNVue` 页面。App Vue builder 继续通过原有 `.nvue` 后缀解析源文件，nvue builder 因页面标记关闭而不再注册这些页面。

**Tech Stack:** Vite 5、uni-app Vite plugin、Node.js ESM 验证脚本、PowerShell。

## Global Constraints

- 不修改页面文件扩展名，不复制页面文件，不增加重复路由。
- 仅影响 `UNI_PLATFORM === 'app'`；H5 和小程序行为保持不变。
- 开关默认关闭；环境变量只接受 `true`、`1`、`yes`（忽略大小写）作为开启值。
- 不修改 `node_modules` 中的 uni-app 源码。
- 保留 `subNVue` 虚拟页面的 `isNVue` 标记。
- git commit 信息必须使用中文，并包含 head 和 body 两部分。

---

### Task 1: 编写页面分类验证脚本

**Files:**
- Create: `scripts/verify-app-nvue-as-vue.mjs`
- Modify: `package.json:43-66`，增加 `verify:app-nvue-as-vue` 脚本

**Interfaces:**
- Consumes: `vite-plugins/app-nvue-as-vue.mjs` 导出的默认插件工厂。
- Produces: 可直接执行的 `node scripts/verify-app-nvue-as-vue.mjs` 验证命令。

- [ ] **Step 1: 写入失败验证脚本**

验证脚本需要使用子进程隔离每个平台和每个开关场景，避免 `parsePagesJsonOnce` 的一次性缓存污染场景。每个子进程执行以下逻辑：

```js
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const repoRoot = path.resolve(new URL('.', import.meta.url).pathname, '..')
const pluginPath = path.resolve(repoRoot, 'vite-plugins/app-nvue-as-vue.mjs')
const sharedPath = path.resolve(repoRoot, 'node_modules/@dcloudio/uni-cli-shared/dist/json/pages.js')

function runCase(platform, enabled) {
  const source = `
    process.env.UNI_PLATFORM = ${JSON.stringify(platform)}
    process.env.UNI_INPUT_DIR = ${JSON.stringify(path.resolve(repoRoot, 'src'))}
    const pagesModule = require(${JSON.stringify(sharedPath)})
    const plugin = (await import(${JSON.stringify(pluginPath)})).default
    plugin(${JSON.stringify(enabled)}).configResolved?.({})
    const pages = pagesModule.parsePagesJsonOnce(process.env.UNI_INPUT_DIR, process.env.UNI_PLATFORM)
    const page = pages.pages.find((item) => item.path === 'pages/componentsD/poster/poster')
    process.stdout.write(JSON.stringify({ isNVue: page?.style?.isNVue }))
  `
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', source], {
    cwd: repoRoot,
    encoding: 'utf8',
  })
  if (result.status !== 0) throw new Error(result.stderr)
  return JSON.parse(result.stdout)
}
```

脚本同时直接验证页面注册代码：

```js
import {
  normalizeAppPagesJson,
  normalizeAppNVuePagesJson,
} from '@dcloudio/uni-cli-shared'

const pages = { pages: [{ path: 'pages/componentsD/poster/poster', style: { isNVue: false } }] }
const vueCode = normalizeAppPagesJson(pages, 'app')
const nvueCode = normalizeAppNVuePagesJson(pages)

if (!vueCode.includes("import PosterPoster from './pages/componentsD/poster/poster.nvue'")) {
  throw new Error('App Vue registration should keep the .nvue source extension')
}
if (nvueCode.trim()) {
  throw new Error('converted pages should not be registered by the nvue builder')
}
```

脚本还要检查默认配置和开关环境变量的行为，以及插件顺序：

```js
const configSource = readFileSync(resolve(repoRoot, 'vite.config.ts'), 'utf8')
if (!/const\s+APP_NVUE_AS_VUE\s*=\s*false/.test(configSource)) {
  throw new Error('vite.config.ts should keep the switch disabled by default')
}
if (configSource.indexOf('appNvueAsVue(') > configSource.indexOf('uni()')) {
  throw new Error('appNvueAsVue must be registered before uni()')
}
```

- [ ] **Step 2: 运行验证脚本确认失败**

Run: `node scripts/verify-app-nvue-as-vue.mjs`

Expected: FAIL because `vite-plugins/app-nvue-as-vue.mjs` does not exist and the Vite config has no switch.

- [ ] **Step 3: 提交验证脚本骨架**

```powershell
git add scripts/verify-app-nvue-as-vue.mjs package.json
git commit -m "增加App nvue按Vue编译验证脚本" -m "先固定开关、平台隔离、页面注册和源文件后缀的预期行为，为编译插件实现提供可重复验证。"
```

### Task 2: 实现 App nvue 页面分类插件

**Files:**
- Create: `vite-plugins/app-nvue-as-vue.mjs`

**Interfaces:**
- Consumes: `enabled` 布尔配置参数、`process.env.APP_NVUE_AS_VUE`、`process.env.UNI_PLATFORM`。
- Produces: 默认导出 `appNvueAsVue(enabled)`，返回 Vite plugin 对象。

- [ ] **Step 1: 实现开关解析和页面转换函数**

文件使用 ESM，并提供以下函数：

```js
const TRUE_VALUES = new Set(['true', '1', 'yes'])

function isTruthy(value) {
  return typeof value === 'string' && TRUE_VALUES.has(value.trim().toLowerCase())
}

function isEnabled(configured) {
  return configured === true || isTruthy(process.env.APP_NVUE_AS_VUE)
}

function convertNVuePages(pagesJson) {
  if (!pagesJson?.pages) return pagesJson
  pagesJson.pages.forEach((page) => {
    if (page.style?.isNVue && !page.style.isSubNVue) {
      page.style.isNVue = false
    }
  })
  return pagesJson
}
```

不要把 `parsePagesJsonOnce` 结果深拷贝；uni-app 依赖其页面缓存和对象引用。只修改普通 nvue 页面已有的 `isNVue` 标记。

- [ ] **Step 2: 包装 pages.js 的两个可写导出**

插件工厂执行时：

```js
export default function appNvueAsVue(configured = false) {
  const enabled = isEnabled(configured)
  if (!enabled || process.env.UNI_PLATFORM !== 'app') {
    return { name: 'app-nvue-as-vue', apply: 'build' }
  }

  const pagesModule = requirePagesModule()
  installWrapper(pagesModule, 'normalizePagesJson', (result, args) => {
    return args[1] === 'app' ? convertNVuePages(result) : result
  })
  installWrapper(pagesModule, 'parsePagesJsonOnce', (result, args) => {
    return args[1] === 'app' ? convertNVuePages(result) : result
  })

  return {
    name: 'app-nvue-as-vue',
    apply: 'build',
  }
}
```

`installWrapper` 必须使用模块属性直接替换，而不是替换顶层 `@dcloudio/uni-cli-shared` 对象；顶层导出是动态 getter，直接替换顶层属性不能覆盖内部闭包。实现幂等保护：

```js
const WRAPPED = Symbol('app-nvue-as-vue')

function installWrapper(module, name, transform) {
  const original = module[name]
  if (typeof original !== 'function' || original[WRAPPED]) return
  const wrapped = (...args) => transform(original(...args), args)
  wrapped[WRAPPED] = true
  module[name] = wrapped
}
```

如果页面模块无法加载或导出不是函数，抛出带模块路径和导出名的错误，不静默降级。

- [ ] **Step 3: 运行验证脚本确认插件行为通过**

Run: `node scripts/verify-app-nvue-as-vue.mjs`

Expected: PASS，默认关闭时页面为 nvue，App 开启时普通页面为 Vue，H5/小程序不改变，页面注册代码保留 `.nvue` 且 nvue 注册为空。

- [ ] **Step 4: 提交插件实现**

```powershell
git add vite-plugins/app-nvue-as-vue.mjs
git commit -m "实现App nvue按Vue编译插件" -m "在App编译期统一调整普通nvue页面分类，保留原始nvue文件和subNVue行为，并对uni-app页面解析包装提供幂等保护。"
```

### Task 3: 接入 Vite 配置并补充完整验证

**Files:**
- Modify: `vite.config.ts:1-25`
- Modify: `scripts/verify-app-nvue-as-vue.mjs`
- Modify: `package.json:43-66`

**Interfaces:**
- Consumes: `appNvueAsVue(enabled)`。
- Produces: 项目级默认关闭配置和可用的 `APP_NVUE_AS_VUE=true` 临时开关。

- [ ] **Step 1: 在 vite.config.ts 增加默认关闭开关**

按现有插件顺序增加导入和配置：

```ts
import appNvueAsVue from "./vite-plugins/app-nvue-as-vue.mjs";

const APP_NVUE_AS_VUE = false;

export default defineConfig({
  plugins: [
    appNvueAsVue(APP_NVUE_AS_VUE),
    UniUpRoot({
      rootFileName: "App.up",
    }),
    uni(),
    visualizer(),
  ],
});
```

插件必须在 `uni()` 之前；其余插件顺序保持不变。环境变量无需写入 `define`，由插件在配置加载时直接读取。

- [ ] **Step 2: 补充配置和环境变量验证**

在验证脚本中启动带有 `APP_NVUE_AS_VUE=true` 的子进程，检查 App 页面为 Vue；启动带有 `APP_NVUE_AS_VUE=false` 的子进程，检查仍为 nvue。确认 `APP_NVUE_AS_VUE=maybe` 不开启。

- [ ] **Step 3: 运行静态验证和类型检查**

Run:

```powershell
node scripts/verify-app-nvue-as-vue.mjs
npm run type-check
git diff --check
```

Expected: 验证脚本 PASS；类型检查 PASS；diff 无空白错误。

- [ ] **Step 4: 运行 App 构建**

先运行默认行为：

```powershell
npm run build:app
```

再运行开关行为：

```powershell
$env:APP_NVUE_AS_VUE = "true"
npm run build:app
Remove-Item Env:APP_NVUE_AS_VUE
```

检查 `dist/build/app-service.js` 或对应 App 输出中：

- 转换页面出现在 Vue 页面注册入口；
- 不出现在 `.nvue` 页面入口；
- 页面导入路径仍为 `poster.nvue`。

如果 App 构建受 Android/iOS 原生工具链限制失败，保留错误信息，并至少完成 Vite 页面入口级验证。

- [ ] **Step 5: 提交配置接入和最终验证**

```powershell
git add vite.config.ts package.json scripts/verify-app-nvue-as-vue.mjs
git commit -m "接入App nvue按Vue编译开关" -m "在项目Vite配置中提供默认关闭的全局开关，并补充环境变量切换、类型检查和App构建验证流程。"
```

## Plan Self-Review

- 规格中的 App-only 范围由 Task 2 的平台判断和 Task 1/3 的 H5、小程序场景验证覆盖。
- 默认关闭、环境变量覆盖和非法值处理由 Task 2/3 覆盖。
- 不改扩展名和不复制文件由页面注册代码验证覆盖。
- `subNVue` 保留由 `convertNVuePages` 的 `isSubNVue` 判断和验证脚本覆盖。
- 解析包装幂等性和 uni-app 动态 getter 约束由 Task 2 明确实现。
- 没有引入依赖或修改 `node_modules`。
