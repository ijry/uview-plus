# Navbar Safe Area Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `u-navbar` render the status-bar safe area and content area over one continuous background while preserving existing slots, layout, and compatibility props.

**Architecture:** Keep `u-status-bar` as the safe-area placeholder inside `u-navbar`. Move the visual background to a single navbar inner wrapper, make both `u-status-bar` and `u-navbar__content` transparent, and add a static verification script to guard the structure.

**Tech Stack:** Vue single-file component, uni-app APIs through the existing `getWindowInfo()` helper, Node.js static assertion script using `node:assert/strict`.

## Global Constraints

- `u-status-bar` remains responsible for status-bar placeholder height inside `u-navbar`.
- `u-navbar` must not add a new public prop.
- `statusBarBgColor` remains accepted for compatibility, but `u-navbar` no longer uses it to color the status-bar area separately.
- `bgColor` must support CSS `background` expressions such as `#ffffff`, `linear-gradient(...)`, and `url(...)`.
- Existing `fixed`, `placeholder`, `safeAreaInsetTop`, title, slots, and click event behavior must remain unchanged.
- Git commit messages must be Chinese and include both head and body.

---

### Task 1: Navbar Background Static Verification

**Files:**
- Create: `scripts/verify-navbar-safe-area-background.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `src/uni_modules/uview-plus/components/u-navbar/u-navbar.vue` as source text.
- Produces: `npm run verify:navbar-safe-area-background`, a static assertion command that exits with status `0` when navbar background ownership is correct.

- [ ] **Step 1: Create the failing verification script**

Add `scripts/verify-navbar-safe-area-background.mjs` with this exact content:

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const navbarSource = readFileSync(
    resolve(__dirname, '../src/uni_modules/uview-plus/components/u-navbar/u-navbar.vue'),
    'utf8'
)

assert.match(
    navbarSource,
    /class="u-navbar__inner"[\s\S]*:style="\[\s*navbarInnerStyle\s*\]"/,
    'expected u-navbar to bind continuous background styles on u-navbar__inner'
)

assert.match(
    navbarSource,
    /<u-status-bar\s+v-if="safeAreaInsetTop"\s*><\/u-status-bar>/,
    'expected u-status-bar to remain as a transparent safe-area placeholder'
)

assert.doesNotMatch(
    navbarSource,
    /<u-status-bar[\s\S]*:bgColor=/,
    'u-navbar must not pass a separate background color into u-status-bar'
)

assert.match(
    navbarSource,
    /backgroundColor:\s*'transparent'/,
    'expected navbar content background to be transparent'
)

assert.match(
    navbarSource,
    /navbarInnerStyle\(\)[\s\S]*style\.background\s*=\s*this\.navbarBgColor/,
    'expected navbarInnerStyle to use CSS background instead of only backgroundColor'
)

console.log('navbar safe-area background assertions passed')
```

- [ ] **Step 2: Add the verification command**

Modify `package.json` `scripts` so it includes this entry after `type-check`:

```json
"type-check": "vue-tsc --noEmit",
"verify:navbar-safe-area-background": "node scripts/verify-navbar-safe-area-background.mjs"
```

- [ ] **Step 3: Run the new verification and confirm it fails for the old component**

Run:

```bash
npm run verify:navbar-safe-area-background
```

Expected: command fails with `expected u-navbar to bind continuous background styles on u-navbar__inner`.

- [ ] **Step 4: Commit the failing verification**

Run:

```bash
git add package.json scripts/verify-navbar-safe-area-background.mjs
git commit -m "添加Navbar安全区背景校验" -m "新增静态断言脚本，锁定u-navbar外层统一背景、u-status-bar透明占位和内容区透明的结构要求。"
```

### Task 2: Navbar Continuous Background Implementation

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-navbar/u-navbar.vue`
- Test: `scripts/verify-navbar-safe-area-background.mjs`

**Interfaces:**
- Consumes: `navbarBgColor`, `safeAreaInsetTop`, `fixed`, `placeholder`, `height`, `titleStyle`, slots, and existing click events from `u-navbar`.
- Produces: `navbarInnerStyle(): object`, used by the template as the single background style source for the navbar safe-area and content wrapper.

- [ ] **Step 1: Update the navbar template**

In `src/uni_modules/uview-plus/components/u-navbar/u-navbar.vue`, replace the current inner wrapper and status-bar markup:

```vue
<view :class="[fixed && 'u-navbar--fixed']">
    <u-status-bar
        v-if="safeAreaInsetTop"
        :bgColor="statusBarBgColor ? statusBarBgColor : navbarBgColor"
    ></u-status-bar>
    <view
        class="u-navbar__content"
        :class="[border && 'u-border-bottom']"
        :style="{
            height: addUnit(height),
            backgroundColor: navbarBgColor,
        }"
    >
```

with:

```vue
<view
    class="u-navbar__inner"
    :class="[fixed && 'u-navbar--fixed']"
    :style="[navbarInnerStyle]"
>
    <u-status-bar v-if="safeAreaInsetTop"></u-status-bar>
    <view
        class="u-navbar__content"
        :class="[border && 'u-border-bottom']"
        :style="{
            height: addUnit(height),
            backgroundColor: 'transparent',
        }"
    >
```

- [ ] **Step 2: Add the computed style**

In the `computed` block of the same file, add `navbarInnerStyle()` after `navbarRightColor()`:

```js
navbarRightColor() {
    return this.upThemeVar('--up-main-color', this.$u.color.mainColor)
},
navbarInnerStyle() {
    const style = {}
    style.background = this.navbarBgColor
    return style
}
```

- [ ] **Step 3: Update the component prop comment**

In the JSDoc comment of `u-navbar.vue`, replace:

```js
* @property {String}            bgColor             导航栏背景设置 （默认 '#ffffff' ）
* @property {String}            statusBarBgColor    状态栏背景颜色 不写同导航栏背景设置
```

with:

```js
* @property {String}            bgColor             导航栏背景设置，支持颜色、渐变或背景图 （默认 '#ffffff' ）
* @property {String}            statusBarBgColor    状态栏背景颜色，保留兼容；导航栏内部统一使用 bgColor 作为整体背景
```

- [ ] **Step 4: Update the TypeScript prop comment**

In `src/uni_modules/uview-plus/types/comps/navbar.d.ts`, replace:

```ts
/**
 * 导航栏背景设置
 * @default"#fff
 */
bgColor?: string
/**
 * 状态栏背景颜色 不写同导航栏背景设置
 * @default bgColor
 */
statusBarBgColor?: string
```

with:

```ts
/**
 * 导航栏背景设置，支持颜色、渐变或背景图
 * @default "#fff"
 */
bgColor?: string
/**
 * 状态栏背景颜色，保留兼容；导航栏内部统一使用 bgColor 作为整体背景
 * @default bgColor
 */
statusBarBgColor?: string
```

- [ ] **Step 5: Run the navbar verification**

Run:

```bash
npm run verify:navbar-safe-area-background
```

Expected: command passes and prints `navbar safe-area background assertions passed`.

- [ ] **Step 6: Run type checking**

Run:

```bash
npm run type-check
```

Expected: command exits with status `0`.

- [ ] **Step 7: Commit the implementation**

Run:

```bash
git add src/uni_modules/uview-plus/components/u-navbar/u-navbar.vue src/uni_modules/uview-plus/types/comps/navbar.d.ts
git commit -m "优化Navbar安全区背景渲染" -m "保留u-status-bar作为透明占位，将navbar背景统一设置到外层容器，并让内容区透明以支持渐变和图片背景连续覆盖。"
```
