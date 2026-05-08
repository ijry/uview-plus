# Legacy uni.scss Theme Bridge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore legacy `uni.scss` `$u-*` light-theme overrides after the CSS-variable theme migration without regressing the current dark-mode runtime system.

**Architecture:** Add a compile-time light bridge that exports legacy `$u-*` values as `--up-light-*` tokens, then make the runtime theme layer reference those bridge tokens for light mode unless the app explicitly overrides colors through `setConfig({ color })`. Keep dark mode fully owned by the existing runtime/default dark variable system, and update docs to explain the new compatibility boundary.

**Tech Stack:** SCSS (`theme.scss`, `theme-vars-core.scss`), runtime theme JS (`theme.js`, `runtime.js`, `index.js`), Node verification scripts (`sass`, `node:assert`), VuePress docs in sibling repo `../uview-plus-doc`

---

## File Structure

**Files and responsibilities:**

- Create: `scripts/fixtures/legacy-theme-bridge.scss`
  Compile-time fixture that simulates an old project overriding `$u-*` in `uni.scss`.

- Create: `scripts/verify-legacy-theme-bridge.mjs`
  Regression script that compiles the fixture and asserts light bridge tokens and dark defaults are both present in the emitted CSS.

- Create: `scripts/verify-theme-runtime-bridge.mjs`
  Runtime regression script that asserts light theme vars resolve to `var(--up-light-*)` bridge tokens by default and still allow explicit `setConfig({ color })`-style overrides to win.

- Modify: `src/uni_modules/uview-plus/theme.scss`
  Export legacy `$u-*` values into bridge tokens (`--up-light-*`, `--u-light-*`) without altering the dark-mode API surface.

- Modify: `src/uni_modules/uview-plus/libs/css/theme-vars-core.scss`
  Make light-mode final vars read from bridge tokens while leaving dark-mode vars hardcoded to the framework defaults.

- Modify: `src/uni_modules/uview-plus/libs/theme/theme.js`
  Teach runtime light-mode CSS var generation to emit bridge references by default and only use literal colors when the app explicitly changes `config.color`.

- Modify: `src/uni_modules/uview-plus/libs/theme/runtime.js`
  Keep fallback light vars aligned with the bridge token strategy so `upThemeVar()` consumers get the same result as CSS consumers.

- Modify: `../uview-plus-doc/docs/guide/theme.md`
  Replace the outdated “download `uview.theme.scss` and delete built-in theme import” guidance with a compatibility note for legacy light-theme overrides.

- Modify: `../uview-plus-doc/docs/guide/darkMode.md`
  Clarify that legacy `$u-*` only bridge to light mode and do not define a custom dark theme.

## Task 1: Add Compile-Time Legacy Light Bridge

**Files:**
- Create: `scripts/fixtures/legacy-theme-bridge.scss`
- Create: `scripts/verify-legacy-theme-bridge.mjs`
- Modify: `src/uni_modules/uview-plus/theme.scss`
- Modify: `src/uni_modules/uview-plus/libs/css/theme-vars-core.scss`
- Test: `node scripts/verify-legacy-theme-bridge.mjs`

- [ ] **Step 1: Write the failing SCSS fixture and bridge regression script**

Create `scripts/fixtures/legacy-theme-bridge.scss`:

```scss
$u-primary: #123456;
$u-main-color: #112233;
$u-border-color: #445566;

@import "../../src/uni_modules/uview-plus/theme.scss";
@import "../../src/uni_modules/uview-plus/index.scss";

.legacy-bridge-probe {
  color: var(--up-primary, #000000);
  border-color: var(--up-border-color, #000000);
  background-color: var(--up-bg-color, #ffffff);
}
```

Create `scripts/verify-legacy-theme-bridge.mjs`:

```js
import assert from 'node:assert/strict'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sass from 'sass'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixturePath = resolve(__dirname, 'fixtures/legacy-theme-bridge.scss')
const { css } = sass.compile(fixturePath, {
  style: 'expanded',
  loadPaths: [resolve(__dirname, '..')],
})

assert.match(
  css,
  /--up-light-primary:\s*#123456;/,
  'expected legacy light primary bridge token to be emitted'
)
assert.match(
  css,
  /--up-light-main-color:\s*#112233;/,
  'expected legacy light main-color bridge token to be emitted'
)
assert.match(
  css,
  /--up-light-border-color:\s*#445566;/,
  'expected legacy light border-color bridge token to be emitted'
)
assert.match(
  css,
  /--up-primary:\s*var\(--up-light-primary,\s*#3c9cff\);/,
  'expected light final primary token to reference the bridge token'
)
assert.match(
  css,
  /\[data-up-theme='dark'\][\s\S]*--up-main-color:\s*#f5f5f5;/,
  'expected dark main-color to stay on framework default'
)

console.log('legacy theme bridge css assertions passed')
```

- [ ] **Step 2: Run the bridge script to verify it fails**

Run:

```bash
node scripts/verify-legacy-theme-bridge.mjs
```

Expected: FAIL because `theme.scss` does not emit any `--up-light-*` bridge tokens yet, and `theme-vars-core.scss` still assigns literal light defaults directly to `--up-*`.

- [ ] **Step 3: Implement the light bridge in `theme.scss` and consume it from `theme-vars-core.scss`**

Add this block near the end of `src/uni_modules/uview-plus/theme.scss` after the `$u-*` declarations:

```scss
$up-legacy-light-theme-map: (
  'main-color': $u-main-color,
  'content-color': $u-content-color,
  'tips-color': $u-tips-color,
  'light-color': $u-light-color,
  'border-color': $u-border-color,
  'bg-color': $u-bg-color,
  'disabled-color': $u-disabled-color,
  'primary': $u-primary,
  'primary-dark': $u-primary-dark,
  'primary-disabled': $u-primary-disabled,
  'primary-light': $u-primary-light,
  'warning': $u-warning,
  'warning-dark': $u-warning-dark,
  'warning-disabled': $u-warning-disabled,
  'warning-light': $u-warning-light,
  'success': $u-success,
  'success-dark': $u-success-dark,
  'success-disabled': $u-success-disabled,
  'success-light': $u-success-light,
  'error': $u-error,
  'error-dark': $u-error-dark,
  'error-disabled': $u-error-disabled,
  'error-light': $u-error-light,
  'info': $u-info,
  'info-dark': $u-info-dark,
  'info-disabled': $u-info-disabled,
  'info-light': $u-info-light
);

@mixin up-export-legacy-light-vars($selector) {
  #{$selector} {
    @each $name, $value in $up-legacy-light-theme-map {
      --up-light-#{$name}: #{$value};
      --u-light-#{$name}: #{$value};
    }
  }
}

@include up-export-legacy-light-vars(':root');
@include up-export-legacy-light-vars('page');
@include up-export-legacy-light-vars('body');
@include up-export-legacy-light-vars("[data-up-theme='light']");
```

Change the light sections in `src/uni_modules/uview-plus/libs/css/theme-vars-core.scss` from literal light assignments to bridge-backed assignments. Example pattern:

```scss
:root,
page,
body {
  --up-main-color: var(--up-light-main-color, #303133);
  --up-content-color: var(--up-light-content-color, #606266);
  --up-tips-color: var(--up-light-tips-color, #909193);
  --up-light-color: var(--up-light-light-color, #c0c4cc);
  --up-border-color: var(--up-light-border-color, #dadbde);
  --up-bg-color: var(--up-light-bg-color, #f3f4f6);
  --up-disabled-color: var(--up-light-disabled-color, #c8c9cc);

  --up-primary: var(--up-light-primary, #3c9cff);
  --up-primary-dark: var(--up-light-primary-dark, #398ade);
  --up-primary-disabled: var(--up-light-primary-disabled, #9acafc);
  --up-primary-light: var(--up-light-primary-light, #ecf5ff);
  --up-warning: var(--up-light-warning, #f9ae3d);
  --up-warning-dark: var(--up-light-warning-dark, #f1a532);
  --up-warning-disabled: var(--up-light-warning-disabled, #f9d39b);
  --up-warning-light: var(--up-light-warning-light, #fdf6ec);
  --up-success: var(--up-light-success, #5ac725);
  --up-success-dark: var(--up-light-success-dark, #53c21d);
  --up-success-disabled: var(--up-light-success-disabled, #a9e08f);
  --up-success-light: var(--up-light-success-light, #f5fff0);
  --up-error: var(--up-light-error, #f56c6c);
  --up-error-dark: var(--up-light-error-dark, #e45656);
  --up-error-disabled: var(--up-light-error-disabled, #f7b2b2);
  --up-error-light: var(--up-light-error-light, #fef0f0);
  --up-info: var(--up-light-info, #909399);
  --up-info-dark: var(--up-light-info-dark, #767a82);
  --up-info-disabled: var(--up-light-info-disabled, #c4c6c9);
  --up-info-light: var(--up-light-info-light, #f4f4f5);
}

[data-up-theme='light'] {
  --up-main-color: var(--up-light-main-color, #303133);
  --up-content-color: var(--up-light-content-color, #606266);
  --up-tips-color: var(--up-light-tips-color, #909193);
  --up-light-color: var(--up-light-light-color, #c0c4cc);
  --up-border-color: var(--up-light-border-color, #dadbde);
  --up-bg-color: var(--up-light-bg-color, #f3f4f6);
  --up-disabled-color: var(--up-light-disabled-color, #c8c9cc);

  --up-primary: var(--up-light-primary, #3c9cff);
  --up-primary-dark: var(--up-light-primary-dark, #398ade);
  --up-primary-disabled: var(--up-light-primary-disabled, #9acafc);
  --up-primary-light: var(--up-light-primary-light, #ecf5ff);
  --up-warning: var(--up-light-warning, #f9ae3d);
  --up-warning-dark: var(--up-light-warning-dark, #f1a532);
  --up-warning-disabled: var(--up-light-warning-disabled, #f9d39b);
  --up-warning-light: var(--up-light-warning-light, #fdf6ec);
  --up-success: var(--up-light-success, #5ac725);
  --up-success-dark: var(--up-light-success-dark, #53c21d);
  --up-success-disabled: var(--up-light-success-disabled, #a9e08f);
  --up-success-light: var(--up-light-success-light, #f5fff0);
  --up-error: var(--up-light-error, #f56c6c);
  --up-error-dark: var(--up-light-error-dark, #e45656);
  --up-error-disabled: var(--up-light-error-disabled, #f7b2b2);
  --up-error-light: var(--up-light-error-light, #fef0f0);
  --up-info: var(--up-light-info, #909399);
  --up-info-dark: var(--up-light-info-dark, #767a82);
  --up-info-disabled: var(--up-light-info-disabled, #c4c6c9);
  --up-info-light: var(--up-light-info-light, #f4f4f5);
}
```

Do not change the existing dark `@media (prefers-color-scheme: dark)` block or `[data-up-theme='dark']` block in this task.

- [ ] **Step 4: Run the bridge script to verify it passes**

Run:

```bash
node scripts/verify-legacy-theme-bridge.mjs
```

Expected: PASS with `legacy theme bridge css assertions passed`.

- [ ] **Step 5: Commit**

```bash
git add scripts/fixtures/legacy-theme-bridge.scss scripts/verify-legacy-theme-bridge.mjs src/uni_modules/uview-plus/theme.scss src/uni_modules/uview-plus/libs/css/theme-vars-core.scss
git commit -m "feat: 增加旧版uni.scss主题light桥接" -m "补充编译期bridge token导出，让旧项目在uni.scss中覆写u主题变量后仍能映射到新的up CSS变量体系。保留dark默认变量定义不变，避免旧浅色配置污染暗黑模式。"
```

### Task 2: Align Runtime Theme Vars With the Light Bridge

**Files:**
- Create: `scripts/verify-theme-runtime-bridge.mjs`
- Modify: `src/uni_modules/uview-plus/libs/theme/theme.js`
- Modify: `src/uni_modules/uview-plus/libs/theme/runtime.js`
- Test: `node scripts/verify-theme-runtime-bridge.mjs`

- [ ] **Step 1: Write the failing runtime regression script**

Create `scripts/verify-theme-runtime-bridge.mjs`:

```js
import assert from 'node:assert/strict'
import config from '../src/uni_modules/uview-plus/libs/config/config.js'
import { getThemeVars, refreshThemeFromConfig } from '../src/uni_modules/uview-plus/libs/theme/theme.js'

const baseline = { ...config.color }

try {
  config.color['u-primary'] = baseline['u-primary']
  config.color['up-primary'] = baseline['up-primary']
  config.color['u-main-color'] = baseline['u-main-color']
  config.color['up-main-color'] = baseline['up-main-color']
  refreshThemeFromConfig()

  let lightVars = getThemeVars('light')
  assert.equal(
    lightVars['--up-primary'],
    'var(--up-light-primary, #3c9cff)',
    'expected default light primary to resolve through bridge token'
  )
  assert.equal(
    lightVars['--up-main-color'],
    'var(--up-light-main-color, #303133)',
    'expected default light main-color to resolve through bridge token'
  )

  config.color['u-primary'] = '#654321'
  config.color['up-primary'] = '#654321'
  refreshThemeFromConfig()

  lightVars = getThemeVars('light')
  assert.equal(
    lightVars['--up-primary'],
    '#654321',
    'expected explicit runtime color override to win over bridge token'
  )

  const darkVars = getThemeVars('dark')
  assert.equal(
    darkVars['--up-main-color'],
    '#f5f5f5',
    'expected dark mode to keep framework default main-color'
  )

  console.log('runtime theme bridge assertions passed')
} finally {
  Object.assign(config.color, baseline)
  refreshThemeFromConfig()
}
```

- [ ] **Step 2: Run the runtime regression script to verify it fails**

Run:

```bash
node scripts/verify-theme-runtime-bridge.mjs
```

Expected: FAIL because `getThemeVars('light')` currently returns literal light colors such as `#3c9cff` instead of `var(--up-light-primary, #3c9cff)`.

- [ ] **Step 3: Make runtime light vars prefer bridge references unless `config.color` was explicitly changed**

In `src/uni_modules/uview-plus/libs/theme/theme.js`, add an immutable snapshot of the startup defaults and a helper that decides whether a light-mode token should emit a bridge reference or a literal override:

```js
const DEFAULT_CONFIG_COLORS = Object.freeze({
    ...(config.color || {})
})

function getLightBridgeVar(token, fallback) {
    return `var(--up-light-${token}, ${fallback})`
}

function hasExplicitRuntimeColor(token, runtimeColorMap = {}) {
    const upKey = `up-${token}`
    const uKey = `u-${token}`
    return runtimeColorMap[upKey] !== DEFAULT_CONFIG_COLORS[upKey]
        || runtimeColorMap[uKey] !== DEFAULT_CONFIG_COLORS[uKey]
}
```

Then update the light branch in `buildThemeCssVars()` so bridge-backed tokens are emitted by default:

```js
const runtimeColorMap = config.color || {}
const useBridge = !isDark

const resolvedMainColor = useBridge && !hasExplicitRuntimeColor('main-color', runtimeColorMap)
    ? getLightBridgeVar('main-color', themeColors.mainColor)
    : themeColors.mainColor
const resolvedContentColor = useBridge && !hasExplicitRuntimeColor('content-color', runtimeColorMap)
    ? getLightBridgeVar('content-color', themeColors.contentColor)
    : themeColors.contentColor
const resolvedBorderColor = useBridge && !hasExplicitRuntimeColor('border-color', runtimeColorMap)
    ? getLightBridgeVar('border-color', themeColors.borderColor)
    : themeColors.borderColor
const resolvedPrimary = useBridge && !hasExplicitRuntimeColor('primary', runtimeColorMap)
    ? getLightBridgeVar('primary', themeColors.primary)
    : themeColors.primary
```

Use the same pattern for the remaining light bridge tokens in the `coreVars` map:

```js
'--u-main-color': resolvedMainColor,
'--u-content-color': resolvedContentColor,
'--u-border-color': resolvedBorderColor,
'--u-primary': resolvedPrimary,
'--up-main-color': resolvedMainColor,
'--up-content-color': resolvedContentColor,
'--up-border-color': resolvedBorderColor,
'--up-primary': resolvedPrimary,
```

In `src/uni_modules/uview-plus/libs/theme/runtime.js`, update the light fallback entries so JS-side `upThemeVar()` consumers receive the same bridge syntax before runtime overrides are applied:

```js
light: {
    '--up-main-color': 'var(--up-light-main-color, #303133)',
    '--up-content-color': 'var(--up-light-content-color, #606266)',
    '--up-tips-color': 'var(--up-light-tips-color, #909193)',
    '--up-light-color': 'var(--up-light-light-color, #c0c4cc)',
    '--up-border-color': 'var(--up-light-border-color, #dadbde)',
    '--up-bg-color': 'var(--up-light-bg-color, #f3f4f6)',
    '--up-disabled-color': 'var(--up-light-disabled-color, #c8c9cc)',
    '--up-primary': 'var(--up-light-primary, #3c9cff)',
    '--up-primary-dark': 'var(--up-light-primary-dark, #398ade)',
    '--up-primary-disabled': 'var(--up-light-primary-disabled, #9acafc)',
    '--up-primary-light': 'var(--up-light-primary-light, #ecf5ff)',
    '--up-warning': 'var(--up-light-warning, #f9ae3d)',
    '--up-warning-dark': 'var(--up-light-warning-dark, #f1a532)',
    '--up-warning-disabled': 'var(--up-light-warning-disabled, #f9d39b)',
    '--up-warning-light': 'var(--up-light-warning-light, #fdf6ec)',
    '--up-success': 'var(--up-light-success, #5ac725)',
    '--up-success-dark': 'var(--up-light-success-dark, #53c21d)',
    '--up-success-disabled': 'var(--up-light-success-disabled, #a9e08f)',
    '--up-success-light': 'var(--up-light-success-light, #f5fff0)',
    '--up-error': 'var(--up-light-error, #f56c6c)',
    '--up-error-dark': 'var(--up-light-error-dark, #e45656)',
    '--up-error-disabled': 'var(--up-light-error-disabled, #f7b2b2)',
    '--up-error-light': 'var(--up-light-error-light, #fef0f0)',
    '--up-info': 'var(--up-light-info, #909399)',
    '--up-info-dark': 'var(--up-light-info-dark, #767a82)',
    '--up-info-disabled': 'var(--up-light-info-disabled, #c4c6c9)',
    '--up-info-light': 'var(--up-light-info-light, #f4f4f5)'
}
```

- [ ] **Step 4: Run the runtime regression script to verify it passes**

Run:

```bash
node scripts/verify-theme-runtime-bridge.mjs
```

Expected: PASS with `runtime theme bridge assertions passed`.

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-theme-runtime-bridge.mjs src/uni_modules/uview-plus/libs/theme/theme.js src/uni_modules/uview-plus/libs/theme/runtime.js
git commit -m "fix: 让运行时light主题优先读取旧桥接变量" -m "light模式默认输出改为bridge token引用，使upThemeVar和内联样式消费者也能命中旧uni.scss中的u主题变量覆盖。保留显式setConfig颜色配置优先级，并继续让dark模式使用框架默认暗色值。"
```

### Task 3: Update Migration Docs in `uview-plus-doc`

**Files:**
- Modify: `../uview-plus-doc/docs/guide/theme.md`
- Modify: `../uview-plus-doc/docs/guide/darkMode.md`
- Test: `../uview-plus-doc/docs/guide/theme.md`

- [ ] **Step 1: Replace the outdated legacy theme instructions with bridge-aware guidance**

Update `../uview-plus-doc/docs/guide/theme.md` so the opening tutorial no longer tells users to delete the built-in `theme.scss` import. Replace the top instructions with:

```md
### 教程

1. 老项目若已经在 `uni.scss` 中手写覆盖 `$u-primary`、`$u-main-color` 等变量，升级后无需先删除这些覆盖。
2. 新版本会把这些旧 `$u-*` 值桥接到 light 主题对应的 `--up-*` 变量。
3. 请继续保留 `@import 'uview-plus/theme.scss';`，不要再下载并替换整份内置主题文件。
4. 如果需要运行时切换深浅色，请配合暗黑模式文档中的 `setTheme` / `setThemePreference` 使用。
5. 如果需要一套完全自定义的 dark 主题，请不要只依赖旧 `$u-*` 变量文件，需额外按 CSS 变量方案定制。
```

Also delete or rewrite the current lines that say:

```md
3. 将文件复制到项目的公共目录(视情况而定)中，再在项目根目录的`uni.scss`中引入即可。
4. 删除`uni.scss`文件中原来引入的`@import 'uview-plus/theme.scss';`(旧的内置主题文件引入语句)。
```

- [ ] **Step 2: Clarify the dark-mode boundary in the dark mode guide**

Append this section to `../uview-plus-doc/docs/guide/darkMode.md`:

```md
### 8. 旧版 uni.scss 主题兼容边界

如果项目历史上在 `uni.scss` 中手写覆盖过 `$u-primary`、`$u-main-color`、`$u-border-color` 等变量，新版本会自动把这些旧值桥接到 **light 主题** 的 `--up-*` 变量。

请注意：

1. 这些旧 `$u-*` 只定义 light 主题，不会自动生成一套 dark 主题。
2. 当主题模式为 `dark` 或系统处于暗色模式时，框架仍使用内置的 dark 语义变量。
3. 如果业务需要品牌化 dark 主题，请直接按 `--up-*` / `upThemeVar()` 方案扩展，而不是继续只维护一份旧 `$u-*` 文件。
```

- [ ] **Step 3: Run a textual verification pass on the updated docs**

Run:

```bash
Get-Content ../uview-plus-doc/docs/guide/theme.md
Get-Content ../uview-plus-doc/docs/guide/darkMode.md
```

Expected: the theme guide no longer instructs users to remove the built-in `theme.scss` import, and the dark-mode guide explicitly states that legacy `$u-*` only bridge to light mode.

- [ ] **Step 4: Smoke-check the code and docs together**

Run:

```bash
node scripts/verify-legacy-theme-bridge.mjs
node scripts/verify-theme-runtime-bridge.mjs
```

Expected: both scripts PASS after the docs edits, proving the written migration guidance matches the implemented bridge behavior.

- [ ] **Step 5: Commit**

```bash
git -C ../uview-plus-doc add docs/guide/theme.md docs/guide/darkMode.md
git -C ../uview-plus-doc commit -m "docs: 补充旧版主题桥接迁移说明" -m "更新自定义主题与暗黑模式文档，说明旧uni.scss中的u主题变量只桥接light主题，并保留新的dark运行时主题体系。"
```

## Self-Review

**Spec coverage:**

- Legacy `uni.scss` light bridge: covered by Task 1.
- Light-only / dark-default boundary: covered by Task 1 and Task 3.
- Runtime `upThemeVar()` / inline style consumers: covered by Task 2.
- Migration docs in sibling repo: covered by Task 3.

**Placeholder scan:**

- No `TODO` / `TBD` / “similar to previous task” placeholders remain.
- Every code-changing step includes concrete code blocks and exact commands.

**Type consistency:**

- Bridge token names use the same `light-*` convention across SCSS and runtime JS.
- Verification scripts assert the exact same token naming convention.
- Docs wording matches the implementation boundary: legacy `$u-*` apply to light only.

## Known Risk

`nvue` pages still require manual smoke verification after implementation. The bridge restores compile-time and CSS-variable consumers directly, but any `nvue` path that depends on runtime-resolved literal colors should be checked on device/emulator before release.
