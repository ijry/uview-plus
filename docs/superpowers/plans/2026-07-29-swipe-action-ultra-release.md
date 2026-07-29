# Swipe Action Ultra Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sync `swipe-action-item` scrolling state support to `uview-ultra`, document scroll-lock usage, commit all touched repositories, and publish patch releases once.

**Architecture:** Mirror the `uview-plus` `scrolling` API in `uview-ultra` Vue and UVue implementations. Keep the component stateless from the parent-container perspective: emit `update:scrolling` and `scrolling`, but let users bind `page-meta` or `scroll-view` themselves. Use static checks plus HBuilderX CLI verification before publishing with the configured script.

**Tech Stack:** Vue SFC, UVue/UTS, WXS, uni-app, HBuilderX CLI, Node ESM verification scripts, Markdown docs, shell publish script.

## Global Constraints

- Commit messages must use Chinese.
- Commit messages must include both `head` and `body`.
- Publishing must follow `D:\Repos\xyito\config\ultraUI.md`.
- Use Git Bash for publish commands on Windows.
- Actual publish command for the same version must run only once.
- Run dry-run before actual publish.
- Do not change swipe threshold, open/close decisions, button layout, or default visual behavior.
- `scrolling = true` only means a horizontal swipe gesture is active; menu open state must not keep it true.

## File Map

- Modify: `D:/Repos/xyito/open/uview-plus4/uni_modules/uview-ultra/components/up-swipe-action-item/up-swipe-action-item.vue`
- Modify: `D:/Repos/xyito/open/uview-plus4/uni_modules/uview-ultra/components/up-swipe-action-item/up-swipe-action-item.uvue`
- Modify: `D:/Repos/xyito/open/uview-plus4/uni_modules/uview-ultra/components/up-swipe-action-item/index.wxs`
- Modify: `D:/Repos/xyito/open/uview-plus4/uni_modules/uview-ultra/components/up-swipe-action-item/props.js`
- Modify: `D:/Repos/xyito/open/uview-plus4/uni_modules/uview-ultra/components/up-swipe-action-item/props.uts`
- Modify: `D:/Repos/xyito/open/uview-plus4/uni_modules/uview-ultra/components/up-swipe-action-item/swipeActionItem.js`
- Modify: `D:/Repos/xyito/open/uview-plus4/uni_modules/uview-ultra/components/up-swipe-action-item/swipeActionItem.uts`
- Modify: `D:/Repos/xyito/open/uview-plus4/uni_modules/uview-ultra/types/comps/swipeActionItem.d.ts`
- Modify: `D:/Repos/xyito/open/uview-plus4/pages/componentsA/swipeAction/swipeAction.uvue`
- Create: `D:/Repos/xyito/open/uview-plus4/scripts/verify-swipe-action-scrolling.mjs`
- Modify: `D:/Repos/xyito/open/uview-plus4/package.json`
- Modify: `D:/Repos/xyito/open/uview-plus4/uni_modules/uview-ultra/changelog.md`
- Modify: `D:/Repos/xyito/open/uview-plus-doc4/docs/components/swipeAction.md`
- Modify: `D:/Repos/xyito/open/uview-plus-doc4/docs/components/changelog.md`
- Modify: `D:/Repos/xyito/open/uview-plus-doc/docs/components/swipeAction.md`
- Modify: `D:/Repos/xyito/open/uview-plus-doc/docs/components/changelog.md`
- Create/modify: `D:/Repos/xyito/cachePath/notes-swipe-action-scrolling.md`

---

### Task 1: Add uview-ultra Verification

**Files:**
- Create: `D:/Repos/xyito/open/uview-plus4/scripts/verify-swipe-action-scrolling.mjs`
- Modify: `D:/Repos/xyito/open/uview-plus4/package.json`

**Interfaces:**
- Produces: `npm run verify:swipe-action-scrolling` in `uview-plus4`.

- [ ] **Step 1: Add static assertions for Vue/UVue props, emits, `touchcancel`, WXS/UTS release calls, types, demo, and changelog.**
- [ ] **Step 2: Register `"verify:swipe-action-scrolling": "node scripts/verify-swipe-action-scrolling.mjs"`.**
- [ ] **Step 3: Run `npm run verify:swipe-action-scrolling` and confirm it fails before implementation.**

### Task 2: Sync uview-ultra Vue Implementation

**Files:**
- Modify: Vue component/defaults/props/types listed in File Map.

**Interfaces:**
- Produces: Vue `scrolling?: boolean`, `update:scrolling`, `scrolling`, and `setScrolling(value)`.

- [ ] **Step 1: Add `scrolling: false` to JS defaults and `scrolling` Boolean prop.**
- [ ] **Step 2: Add `update:scrolling` and `scrolling` emits, `innerScrolling`, `setScrolling`, disabled watcher, and unmount release in `up-swipe-action-item.vue`.**
- [ ] **Step 3: Bind WXS and normal JS `touchcancel` in the template.**
- [ ] **Step 4: Update `index.wxs` to call `setScrolling(true)` after horizontal movement is confirmed and `setScrolling(false)` in `touchend`, `touchcancel`, and `closeSwipeAction`.**
- [ ] **Step 5: Update normal JS and nvue logic inside the Vue SFC to release `scrolling` on gesture end/cancel/close.**

### Task 3: Sync uview-ultra UVue Implementation

**Files:**
- Modify: `up-swipe-action-item.uvue`
- Modify: `props.uts`
- Modify: `swipeActionItem.uts`
- Modify: `pages/componentsA/swipeAction/swipeAction.uvue`

**Interfaces:**
- Produces: UVue `scrolling?: boolean`, `update:scrolling`, `scrolling`, and `setScrolling(value)`.

- [ ] **Step 1: Add UTS default and prop.**
- [ ] **Step 2: Add UTS emits and `innerScrolling` ref.**
- [ ] **Step 3: Add `setScrolling(value: boolean)` and call it in horizontal touchmove, touchend, touchcancel, close, disabled watcher, and unmount.**
- [ ] **Step 4: Add `@touchcancel="touchcancel"` in UVue template.**
- [ ] **Step 5: Add demo `v-model:scrolling="swipeScrolling"` and `const swipeScrolling = ref(false)`.**

### Task 4: Update Documentation

**Files:**
- Modify: both `swipeAction.md` files.
- Modify: both docs `changelog.md` files.
- Modify: plugin changelogs.

**Interfaces:**
- Produces: user-facing docs for `v-model:scrolling`, `@scrolling`, `page-meta`, and `scroll-view`.

- [ ] **Step 1: Add a “防止页面或容器滚动” section to both swipeAction docs.**
- [ ] **Step 2: Add `scrolling` prop and `scrolling` event rows to both docs API tables.**
- [ ] **Step 3: Add changelog entries to `uview-plus` docs and `uview-ultra` docs.**
- [ ] **Step 4: Add top plugin changelog entries for uview-plus and uview-ultra.**

### Task 5: Verify, Commit, Publish

**Files:**
- Modify/create notes under `D:/Repos/xyito/cachePath`.
- Commit in each changed git repo.

**Interfaces:**
- Consumes: implementation and docs from Tasks 1-4.
- Produces: committed changes and published patch versions.

- [ ] **Step 1: Run static verification scripts in `uview-plus` and `uview-plus4`.**
- [ ] **Step 2: Run HBuilderX CLI compile/publish verification for `uview-plus4` per `AGEMTS.md`.**
- [ ] **Step 3: Review `git diff --check` and `git status --short` in all changed repos.**
- [ ] **Step 4: Commit uview-plus4, uview-plus-doc4, uview-plus-doc, and any remaining uview-plus docs/changelog changes with Chinese head/body commit messages.**
- [ ] **Step 5: Write release notes file under `D:/Repos/xyito/cachePath/notes-swipe-action-scrolling.md`.**
- [ ] **Step 6: Run publish script dry-run for uview-plus and uview-ultra.**
- [ ] **Step 7: If dry-run succeeds, run actual publish script once for each plugin.**
- [ ] **Step 8: Commit/push post-release version/changelog changes created by the publish script.**
