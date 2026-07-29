# Swipe Action Scrolling Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose `up-swipe-action-item` horizontal swipe state through `v-model:scrolling` and a `scrolling` event so pages can pause page or container scrolling while a left-swipe gesture is active.

**Architecture:** Add a boolean `scrolling` prop with internal cached state and emit both `update:scrolling` and `scrolling` only on state changes. Reuse the existing platform-specific gesture paths and call a shared component method from WXS, normal JS, and APP-NVUE. Lock the public contract with a focused static verification script.

**Tech Stack:** Vue SFC, uni-app conditional compilation, WXS, APP-NVUE BindingX, Node ESM verification script, TypeScript declaration files.

## Global Constraints

- Commit messages must use Chinese.
- Commit messages must include both `head` and `body`.
- `scrolling = true` only means a horizontal swipe gesture is currently active and external scrolling should be paused.
- Menu open state must not keep `scrolling` true after `touchend` or gesture end.
- Do not let the component directly mutate parent `scroll-view` or `page-meta`.
- Do not change swipe threshold, open/close decisions, button layout, or default behavior for users who do not bind `scrolling`.
- Do not bump package version or publish.
- Ignore pre-existing untracked `.claude/`.

## File Map

- Create: `scripts/verify-swipe-action-scrolling.mjs`
- Modify: `package.json`
- Modify: `src/uni_modules/uview-plus/components/u-swipe-action-item/swipeActionItem.js`
- Modify: `src/uni_modules/uview-plus/components/u-swipe-action-item/props.js`
- Modify: `src/uni_modules/uview-plus/components/u-swipe-action-item/u-swipe-action-item.vue`
- Modify: `src/uni_modules/uview-plus/components/u-swipe-action-item/index.wxs`
- Modify: `src/uni_modules/uview-plus/components/u-swipe-action-item/other.js`
- Modify: `src/uni_modules/uview-plus/components/u-swipe-action-item/nvue.js`
- Modify: `src/uni_modules/uview-plus/types/comps/swipeActionItem.d.ts`
- Modify: `src/pages/componentsA/swipeAction/swipeAction.nvue`
- Modify: `src/uni_modules/uview-plus/changelog.md`

---

### Task 1: Add Static Verification

**Files:**
- Create: `scripts/verify-swipe-action-scrolling.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: npm script `verify:swipe-action-scrolling` running `node scripts/verify-swipe-action-scrolling.mjs`.

- [ ] **Step 1: Create `scripts/verify-swipe-action-scrolling.mjs`**

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const vue = read('src/uni_modules/uview-plus/components/u-swipe-action-item/u-swipe-action-item.vue')
const props = read('src/uni_modules/uview-plus/components/u-swipe-action-item/props.js')
const defaults = read('src/uni_modules/uview-plus/components/u-swipe-action-item/swipeActionItem.js')
const wxs = read('src/uni_modules/uview-plus/components/u-swipe-action-item/index.wxs')
const other = read('src/uni_modules/uview-plus/components/u-swipe-action-item/other.js')
const nvue = read('src/uni_modules/uview-plus/components/u-swipe-action-item/nvue.js')
const types = read('src/uni_modules/uview-plus/types/comps/swipeActionItem.d.ts')
const demo = read('src/pages/componentsA/swipeAction/swipeAction.nvue')
const changelog = read('src/uni_modules/uview-plus/changelog.md')
const packageJson = JSON.parse(read('package.json'))
```

- [ ] **Step 2: Add assertions for package script, props, emits, platform branches, types, demo, and changelog**

- [ ] **Step 3: Register the script in `package.json`**

```json
"verify:swipe-action-scrolling": "node scripts/verify-swipe-action-scrolling.mjs"
```

- [ ] **Step 4: Run the script before implementation**

Run: `npm run verify:swipe-action-scrolling`

Expected: FAIL because `scrolling` support is not implemented yet.

### Task 2: Add Public Component API

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-swipe-action-item/swipeActionItem.js`
- Modify: `src/uni_modules/uview-plus/components/u-swipe-action-item/props.js`
- Modify: `src/uni_modules/uview-plus/components/u-swipe-action-item/u-swipe-action-item.vue`

**Interfaces:**
- Consumes: npm script `verify:swipe-action-scrolling`.
- Produces: prop `scrolling?: boolean`, emits `update:scrolling` and `scrolling`, method `setScrolling(value: boolean)`.

- [ ] **Step 1: Add default `scrolling: false`**

```js
scrolling: false,
```

- [ ] **Step 2: Add Boolean prop in `props.js`**

```js
scrolling: {
    type: Boolean,
    default: () => defProps.swipeActionItem.scrolling
}
```

- [ ] **Step 3: Add emits and cached state in `u-swipe-action-item.vue`**

```js
emits: ['click', 'update:show', 'update:scrolling', 'scrolling'],
data() {
    return {
        innerScrolling: this.scrolling
    }
}
```

- [ ] **Step 4: Add `setScrolling(value)` and sync watchers**

```js
setScrolling(value) {
    const next = !!value
    if (this.innerScrolling === next) return
    this.innerScrolling = next
    this.$emit('update:scrolling', next)
    this.$emit('scrolling', next)
}
```

- [ ] **Step 5: Release scrolling on disable and unmount**

Call `this.setScrolling(false)` when `disabled` becomes true and in component teardown.

### Task 3: Wire Platform Gesture Paths

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-swipe-action-item/u-swipe-action-item.vue`
- Modify: `src/uni_modules/uview-plus/components/u-swipe-action-item/index.wxs`
- Modify: `src/uni_modules/uview-plus/components/u-swipe-action-item/other.js`
- Modify: `src/uni_modules/uview-plus/components/u-swipe-action-item/nvue.js`

**Interfaces:**
- Consumes: `setScrolling(value: boolean)` method from Task 2.
- Produces: `scrolling` true when horizontal swipe movement is accepted, false on gesture release/cancel/close.

- [ ] **Step 1: Add `touchcancel` bindings in Vue template**

Bind `@touchcancel="wxs.touchcancel"` on the WXS branch and `@touchcancel="touchcancel"` on the normal JS branch.

- [ ] **Step 2: Update WXS path**

Call `ownerInstance.callMethod('setScrolling', true)` after the vertical-movement return check and call `ownerInstance.callMethod('setScrolling', false)` in `touchend`, new `touchcancel`, and close paths.

- [ ] **Step 3: Update normal JS path**

Call `this.setScrolling(true)` after horizontal movement is confirmed and `this.setScrolling(false)` in `touchend`, new `touchcancel`, and `closeHandler`.

- [ ] **Step 4: Update APP-NVUE path**

Call `this.setScrolling(true)` when BindingX pan begins and `this.setScrolling(false)` on `end`/`exit`, close, click-close, unbind, and animation completion.

### Task 4: Types, Demo, Changelog

**Files:**
- Modify: `src/uni_modules/uview-plus/types/comps/swipeActionItem.d.ts`
- Modify: `src/pages/componentsA/swipeAction/swipeAction.nvue`
- Modify: `src/uni_modules/uview-plus/changelog.md`

**Interfaces:**
- Consumes: public API from Task 2.
- Produces: documented TypeScript props/events and demo usage.

- [ ] **Step 1: Add TypeScript definitions**

```ts
scrolling?: boolean
['onUpdate:scrolling']?: (value: boolean) => any
onScrolling?: (value: boolean) => any
```

- [ ] **Step 2: Add demo state and binding**

```vue
<up-swipe-action-item v-model:scrolling="swipeScrolling">
```

```js
const swipeScrolling = ref(false)
```

- [ ] **Step 3: Add changelog entry**

Document that `up-swipe-action-item` now exposes `v-model:scrolling` and `scrolling` for external scroll locking during horizontal swipe gestures.

- [ ] **Step 4: Run verification**

Run: `npm run verify:swipe-action-scrolling`

Expected: PASS with `swipe action scrolling assertions passed`.
