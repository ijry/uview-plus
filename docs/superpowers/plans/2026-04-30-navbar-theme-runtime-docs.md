# Navbar Theme Runtime And Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the runtime navbar sync path consistently read the `--up-navbar-bg-color` theme token, and document the relationship between `theme.json`, CSS variables, runtime theme APIs, and legacy `uni.scss` overrides.

**Architecture:** Keep the current theme system intact and only tighten one seam: `theme.js` should consume the same navbar token model already used by the runtime layer, while `theme-vars-core.scss` should expose a first-class `--up-navbar-bg-color` token for light and dark. Update guide docs with the full source-of-truth explanation, then keep install docs limited to a short migration summary and links.

**Tech Stack:** SCSS (`theme-vars-core.scss`), runtime theme JS (`theme.js`, `runtime.js`), Node verification script (`sass`, `node:assert`), VuePress docs in sibling repo `../uview-plus-doc`

---

## File Structure

**Files and responsibilities:**

- Create: `scripts/verify-navbar-theme-runtime.mjs`
  Verifies the code path and emitted CSS for navbar theme token alignment.

- Modify: `src/uni_modules/uview-plus/libs/css/theme-vars-core.scss`
  Add `--up-navbar-bg-color` defaults to light/dark CSS-variable layers.

- Modify: `src/uni_modules/uview-plus/libs/theme/theme.js`
  Forward `themeVars` into native UI sync and make navbar sync prefer `--up-navbar-bg-color`.

- Modify: `../uview-plus-doc/docs/guide/theme.md`
  Explain theme source hierarchy, runtime priority, navbar token entry, and 3.8+ migration/compatibility boundaries.

- Modify: `../uview-plus-doc/docs/guide/darkMode.md`
  Clarify how uni-app darkmode and uview-plus runtime theme work together, and where legacy `uni.scss` compatibility stops.

- Modify: `../uview-plus-doc/docs/components/npmSetting.md`
  Add a short summary after `theme.scss` import that points users to the guide docs.

- Modify: `../uview-plus-doc/docs/components/downloadSetting.md`
  Add the same short summary for the download-install entry.

## Task 1: Align Navbar Runtime Token Source

**Files:**
- Create: `scripts/verify-navbar-theme-runtime.mjs`
- Modify: `src/uni_modules/uview-plus/libs/css/theme-vars-core.scss`
- Modify: `src/uni_modules/uview-plus/libs/theme/theme.js`
- Test: `node scripts/verify-navbar-theme-runtime.mjs`

- [ ] **Step 1: Write the failing regression script**

Create `scripts/verify-navbar-theme-runtime.mjs`:

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sass from 'sass'
import config from '../src/uni_modules/uview-plus/libs/config/config.js'
import { setTheme, themeState } from '../src/uni_modules/uview-plus/libs/theme/theme.js'
import { applyNativeThemeUI as applyRuntimeNativeThemeUI } from '../src/uni_modules/uview-plus/libs/theme/runtime.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const themeSource = readFileSync(
  resolve(__dirname, '../src/uni_modules/uview-plus/libs/theme/theme.js'),
  'utf8'
)

assert.match(
  themeSource,
  /applyNativeThemeUI\(themeMode,\s*themeColors,\s*themeVars\)/,
  'expected applyTheme() to forward themeVars into applyNativeThemeUI'
)
assert.match(
  themeSource,
  /const navBg = themeVars\?\.\['--up-navbar-bg-color'\]/,
  'expected theme applyNativeThemeUI() to prefer --up-navbar-bg-color'
)

const { css } = sass.compile(
  resolve(__dirname, '../src/uni_modules/uview-plus/libs/css/theme-vars-core.scss'),
  { style: 'expanded' }
)

assert.match(
  css,
  /--up-navbar-bg-color:\s*#ffffff;/,
  'expected light navbar token in theme-vars-core.scss'
)
assert.match(
  css,
  /\[data-up-theme='dark'\][\s\S]*--up-navbar-bg-color:\s*#1c1c1e;/,
  'expected dark navbar token in theme-vars-core.scss'
)

const originalColorMap = { ...config.color }
const navCalls = []

global.getCurrentPages = () => [{}]
global.uni = {
  setNavigationBarColor(options) {
    navCalls.push(options)
    return Promise.resolve()
  },
  setBackgroundColor() {},
  setTabBarStyle() {},
  getStorageSync() {
    return 'light'
  },
  setStorageSync() {},
  getSystemInfoSync() {
    return { theme: 'light' }
  },
  getAppBaseInfo() {
    return { theme: 'light' }
  },
  $emit() {},
  $u: null,
}

try {
  Object.keys(config.color).forEach((key) => delete config.color[key])
  config.color['up-navbar-bg-color'] = '#123456'

  setTheme('light')
  assert.equal(themeState.vars['--up-navbar-bg-color'], '#123456')
  assert.equal(navCalls.at(-1)?.backgroundColor, '#123456')

  navCalls.length = 0
  applyRuntimeNativeThemeUI({
    theme: {
      mode: 'light',
      vars: { ...themeState.vars },
    },
    config: {
      color: { ...config.color },
    },
  })
  assert.equal(navCalls.at(-1)?.backgroundColor, '#123456')
} finally {
  Object.keys(config.color).forEach((key) => delete config.color[key])
  Object.assign(config.color, originalColorMap)
  delete global.uni
  delete global.getCurrentPages
}

console.log('navbar theme runtime assertions passed')
```

- [ ] **Step 2: Run the regression script to verify it fails**

Run:

```bash
node scripts/verify-navbar-theme-runtime.mjs
```

Expected: FAIL because `theme.js` still calls `applyNativeThemeUI(themeMode, themeColors)` without forwarding `themeVars`, and `theme-vars-core.scss` does not yet define `--up-navbar-bg-color`.

- [ ] **Step 3: Implement the navbar token alignment**

In `src/uni_modules/uview-plus/libs/theme/theme.js`, change the native theme sync signature and navbar color selection:

```js
function applyNativeThemeUI(mode, themeColors, themeVars = {}) {
    if (typeof uni === 'undefined') return
    const isDark = normalizeThemeMode(mode) === 'dark'
    const pageBg = themeColors?.bgColor || (isDark ? '#1f1f1f' : '#f3f4f6')
    const navBg = themeVars?.['--up-navbar-bg-color']
        || themeVars?.['--u-navbar-bg-color']
        || config.color?.['up-navbar-bg-color']
        || config.color?.['u-navbar-bg-color']
        || (isDark ? '#1c1c1e' : '#ffffff')
    trySetNavigationBarColor({
        frontColor: isDark ? '#ffffff' : '#000000',
        backgroundColor: navBg,
        animation: {
            duration: 0,
            timingFunc: 'linear'
        }
    })
    if (typeof uni.setBackgroundColor === 'function') {
        uni.setBackgroundColor({
            backgroundColor: pageBg,
            backgroundColorTop: pageBg,
            backgroundColorBottom: pageBg
        })
    }
}
```

Also update the `applyTheme()` call site in the same file:

```js
    themeState.vars = { ...themeVars }
    themeState.version = Number(themeState.version || 0) + 1
    syncThemeToH5(themeMode)
    applyNativeThemeUI(themeMode, themeColors, themeVars)
```

In `src/uni_modules/uview-plus/libs/css/theme-vars-core.scss`, add `--up-navbar-bg-color` to the light and dark blocks:

```scss
:root,
page,
body {
	--up-page-bg-color: #f3f4f6;
	--up-card-bg-color: #ffffff;
	--up-navbar-bg-color: #ffffff;
	--up-disabled-color: var(--up-light-disabled-color, #c8c9cc);
}

@media (prefers-color-scheme: dark) {
	:root,
	page,
	body {
		--up-page-bg-color: #1f1f1f;
		--up-card-bg-color: #1c1c1e;
		--up-navbar-bg-color: #1c1c1e;
		--up-disabled-color: #4b5563;
	}
}

[data-up-theme='light'] {
	--up-page-bg-color: #f3f4f6;
	--up-card-bg-color: #ffffff;
	--up-navbar-bg-color: #ffffff;
	--up-disabled-color: var(--up-light-disabled-color, #c8c9cc);
}

[data-up-theme='dark'] {
	--up-page-bg-color: #1f1f1f;
	--up-card-bg-color: #1c1c1e;
	--up-navbar-bg-color: #1c1c1e;
	--up-disabled-color: #4b5563;
}
```

- [ ] **Step 4: Run the regression and syntax checks**

Run:

```bash
node scripts/verify-navbar-theme-runtime.mjs
node --check src/uni_modules/uview-plus/libs/theme/theme.js
git diff --check -- scripts/verify-navbar-theme-runtime.mjs src/uni_modules/uview-plus/libs/css/theme-vars-core.scss src/uni_modules/uview-plus/libs/theme/theme.js
```

Expected:

- `navbar theme runtime assertions passed`
- no syntax errors
- no whitespace or patch formatting errors

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-navbar-theme-runtime.mjs src/uni_modules/uview-plus/libs/css/theme-vars-core.scss src/uni_modules/uview-plus/libs/theme/theme.js
git commit -m "统一导航栏主题色运行时来源" -m "为主题系统补充 --up-navbar-bg-color 默认变量，并让 theme.js 的原生导航栏同步优先读取运行时主题变量。这样导航栏主题来源与 runtime.js 保持一致，同时保留现有兜底逻辑。"
```

## Task 2: Clarify Guide Docs For Theme Sources And 3.8+ Migration

**Files:**
- Modify: `../uview-plus-doc/docs/guide/theme.md`
- Modify: `../uview-plus-doc/docs/guide/darkMode.md`
- Test: `Select-String` checks for the new headings and phrases

- [ ] **Step 1: Expand `theme.md` with source hierarchy, navbar token guidance, and legacy compatibility**

Insert a new section near the top of `../uview-plus-doc/docs/guide/theme.md` after the intro/tutorial summary:

```md
### 主题来源与优先级

从 `3.8+` 开始，uview-plus 的主题能力需要按三层来理解：

1. `theme.json`
   这是 uni-app 的声明式默认主题入口，主要通过 `pages.json` 里的 `@变量名` 参与页面配置。

2. `--up-*` / `--u-*` CSS变量
   这是组件样式、页面背景、语义色的核心主题变量层。

3. `uni.$u.setTheme()` / `uni.$u.setThemePreference()` / `setConfig({ color })`
   这是 uview-plus 的运行时主题系统，用于跟随系统、手动切换、记忆偏好，以及同步原生 UI。

请注意：

- 页面初始默认值可以来自 `theme.json`
- 一旦 uview-plus 运行时主题开始同步，导航栏、背景色、tabBar 的最终效果以当前运行时主题结果为准
- 导航栏推荐定制入口是 `up-navbar-bg-color` / `--up-navbar-bg-color`
```

Append a separate migration block in the same file:

```md
### 3.8+ 升级提醒

如果你是旧项目升级，请先记住下面几条：

1. 新版本主题体系已经迁移到 CSS变量为主，不再等同于旧版“下载整份 SCSS 主题文件后整体替换”的心智。
2. 旧 `uni.scss` 中手写的 `$u-*` 仍兼容，但只桥接到 light 主题。
3. dark 主题不会从旧 `$u-*` 自动生成。
4. 如果业务又调用了 `setConfig({ color })`，显式运行时改色优先级高于旧 bridge。
5. 旧项目必须继续保留 `@import 'uview-plus/theme.scss';`，并且要把 `$u-*` 变量写在它之前。
```

- [ ] **Step 2: Expand `darkMode.md` with the runtime/uni-app boundary**

Insert this section into `../uview-plus-doc/docs/guide/darkMode.md` after the architecture overview:

```md
### 1.1 uni-app 暗黑模式与 uview-plus 运行时主题的关系

uni-app 原生暗黑模式和 uview-plus 运行时主题不是二选一，而是分工不同：

1. `theme.json` / `pages.json`
   负责 uni-app 声明式默认主题，适合页面配置层面的默认值。

2. uview-plus 运行时主题系统
   负责应用运行过程中的主动同步，包括：
   - 系统跟随
   - 手动切换 `light / dark / system`
   - 本地记忆主题偏好
   - 同步导航栏、页面背景、tabBar、组件变量

因此，当运行时主题系统已经介入时，导航栏最终颜色不是单独从 `theme.json` 读取，而是以当前运行时主题结果为准。默认推荐通过 `--up-navbar-bg-color` 或对应运行时颜色配置统一管理导航栏背景色。
```

Append this compatibility note near the migration section:

```md
#### 旧版 `uni.scss` 兼容边界

- 旧 `$u-*` 兼容桥只作用于 light 主题
- 它不会自动生成品牌化 dark 主题
- 如果你需要完整 dark 定制，请直接扩展 `--up-*` CSS变量和运行时主题方案
```

- [ ] **Step 3: Run doc phrase checks**

Run:

```bash
Select-String -Path ..\uview-plus-doc\docs\guide\theme.md -Pattern "主题来源与优先级","3.8+ 升级提醒","--up-navbar-bg-color"
Select-String -Path ..\uview-plus-doc\docs\guide\darkMode.md -Pattern "uni-app 暗黑模式与 uview-plus 运行时主题的关系","theme.json","旧版 `uni.scss` 兼容边界"
git diff --check -- ..\uview-plus-doc\docs\guide\theme.md ..\uview-plus-doc\docs\guide\darkMode.md
```

Expected:

- all phrases are found
- no diff formatting errors

- [ ] **Step 4: Commit**

```bash
git -C ..\uview-plus-doc add docs/guide/theme.md docs/guide/darkMode.md
git -C ..\uview-plus-doc commit -m "完善主题与暗黑模式主文档说明" -m "补充 theme.json、CSS变量、运行时主题 API 的职责边界，明确导航栏推荐定制入口和 3.8+ 旧版 uni.scss 兼容提醒，减少升级用户对主题来源的误解。"
```

## Task 3: Add Short Migration Summary To Install Entry Docs

**Files:**
- Modify: `../uview-plus-doc/docs/components/npmSetting.md`
- Modify: `../uview-plus-doc/docs/components/downloadSetting.md`
- Test: `Select-String` checks for the summary block and guide links

- [ ] **Step 1: Update the install docs with a short runtime-theme summary**

Replace the existing short `3.8+` note in both install docs with this compact summary block:

```md
::: tip 3.8+ 主题说明
`theme.scss` 仍然需要保留，它负责承接旧版 `uni.scss` 变量兼容和基础主题变量导出。  

但从 `3.8+` 开始，uview-plus 的主题系统已经逐步迁移到 `--up-*` CSS变量 + 运行时主题方案：

- `theme.json` 负责 uni-app 声明式默认主题
- `uview-plus` 运行时主题会继续同步导航栏、背景色、tabBar
- 旧 `uni.scss` 里的 `$u-*` 只桥接 light，不会自动生成 dark

请优先阅读：

- [自定义主题 / CSS变量迁移说明](/guide/theme.html)
- [暗黑模式与运行时主题说明](/guide/darkMode.html)
:::
```

- [ ] **Step 2: Run doc phrase checks**

Run:

```bash
Select-String -Path ..\uview-plus-doc\docs\components\npmSetting.md -Pattern "3.8+ 主题说明","theme.json","旧 `uni.scss` 里的 `$u-*` 只桥接 light"
Select-String -Path ..\uview-plus-doc\docs\components\downloadSetting.md -Pattern "3.8+ 主题说明","theme.json","旧 `uni.scss` 里的 `$u-*` 只桥接 light"
git diff --check -- ..\uview-plus-doc\docs\components\npmSetting.md ..\uview-plus-doc\docs\components\downloadSetting.md
```

Expected:

- all phrases are found
- no diff formatting errors

- [ ] **Step 3: Commit**

```bash
git -C ..\uview-plus-doc add docs/components/npmSetting.md docs/components/downloadSetting.md
git -C ..\uview-plus-doc commit -m "统一安装文档中的主题迁移摘要" -m "在 npm 和下载安装入口补充 3.8+ 主题说明，明确 theme.json 只负责声明式默认主题，并提示旧 uni.scss 变量只桥接 light，统一引导用户阅读主题与暗黑模式主文档。"
```
