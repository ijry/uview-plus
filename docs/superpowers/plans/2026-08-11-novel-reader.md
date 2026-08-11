# 小说阅读器组件 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with review checkpoints.

**Goal:** 在 `uview-plus` 中新增支持全端、受控章节、双阅读模式、目录、设置、书签和本地持久化的 `u-novel-reader` 组件，并同步提供示例、文档和校验脚本。

**Architecture:** 对外提供单一 `u-novel-reader.vue`，内部拆分正文归一化、阅读状态、分页计算、文本测量、持久化、工具栏、目录和设置面板。章节请求由业务通过事件完成，组件只负责阅读状态与 UI；纵向模式使用 `scroll-view`，横向模式使用分页结果驱动 `swiper`。

**Tech Stack:** Vue 3、uni-app、JavaScript、SCSS、uview-plus 现有 `u-icon`、`u-popup`、`u-slider`、`u-status-bar`、`u-safe-bottom` 组件、Node.js 静态校验脚本。

## Global Constraints

- 公共组件名称固定为 `u-novel-reader`，同时由现有 easycom 规则支持 `up-novel-reader`。
- 必须支持 H5、小程序、App Vue 页面和 App nvue 页面；不引入第三方阅读引擎或新的运行时依赖。
- 章节数据由业务控制，组件不直接请求网络；正文只支持纯文本和段落数组。
- 必须支持 `scroll` 纵向滚动和 `page` 横向分页，并通过事件请求章节和预加载章节。
- 顶部返回按钮默认属于顶部工具栏，不常驻；顶部使用 `u-status-bar`，底部使用 `u-safe-bottom`。
- 必须支持主题、字号、行高、段距、正文宽度、字体、粗体、动画、目录、书签、进度和阅读时长统计。
- 持久化使用版本化 `uni` 存储，显式传入状态优先于本地存储和默认值。
- 不修改版本号、changelog 或发布流程。
- 每个提交的 `head` 和 `body` 必须使用中文；提交不得只有单行标题。
- 当前工作区已有未跟踪 `.claude/`，不得将其加入本次提交。

---

### Task 1: 注册组件 props 与默认配置

**Files:**
- Create: `src/uni_modules/uview-plus/components/u-novel-reader/novelReader.js`
- Create: `src/uni_modules/uview-plus/components/u-novel-reader/props.js`
- Modify: `src/uni_modules/uview-plus/libs/config/props.js`
- Create: `scripts/verify-novel-reader-props.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces the public props consumed by `u-novel-reader.vue`: `chapters`, `currentChapter`, `loading`, `error`, `bookId`, `storageKey`, `persist`, `initialProgress`, `progress`, `initialBookmarks`, `bookmarks`, `defaultSettings`, `settings`, `mode`, `showBack`, `autoBack`, `backIcon`, `safeAreaInsetTop`, `safeAreaInsetBottom`, `preloadThreshold`, `pageAnimation`, and `controlsAutoHide`.
- Produces default settings:

```js
{
  theme: 'day',
  fontSize: 18,
  lineHeight: 1.8,
  paragraphSpacing: 16,
  contentWidth: '92%',
  fontFamily: 'system',
  fontWeight: 400,
  animation: true
}
```

- Produces `npm run verify:novel-reader-props`.

- [ ] **Step 1: Write the failing contract script**

Create `scripts/verify-novel-reader-props.mjs` with assertions that the component directory, `novelReader.js`, and `props.js` exist; `props.js` imports `registerComponentProps`; `novelReader.js` exports a `novelReader` default key; and `libs/config/props.js` contains `'novelReader'`.

```js
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const componentDir = resolve(root, 'src/uni_modules/uview-plus/components/u-novel-reader')
const registrySource = readFileSync(resolve(root, 'src/uni_modules/uview-plus/libs/config/props.js'), 'utf8')

assert.equal(existsSync(componentDir), true)
assert.equal(existsSync(resolve(componentDir, 'novelReader.js')), true)
assert.equal(existsSync(resolve(componentDir, 'props.js')), true)
const propsSource = readFileSync(resolve(componentDir, 'props.js'), 'utf8')
const defaultsSource = readFileSync(resolve(componentDir, 'novelReader.js'), 'utf8')
assert.match(propsSource, /registerComponentProps/)
assert.match(defaultsSource, /novelReader/)
assert.match(registrySource, /'novelReader'/)
console.log('novel reader props contract passed')
```

- [ ] **Step 2: Run the contract script and verify it fails**

Run: `node scripts/verify-novel-reader-props.mjs`

Expected: FAIL because the component directory and registry entry do not exist.

- [ ] **Step 3: Add the default configuration**

Create `novelReader.js` with a single `novelReader` object containing every default from the design spec, including `showBack: true`, `autoBack: false`, `backIcon: 'arrow-left'`, `safeAreaInsetTop: true`, `safeAreaInsetBottom: true`, `mode: 'scroll'`, `preloadThreshold: 2`, `pageAnimation: true`, `controlsAutoHide: 0`, and `persist: true`.

- [ ] **Step 4: Add the props mixin and registry key**

Create `props.js` with `defineMixin`, `registerComponentProps`, typed defaults, and object defaults returned from factory functions. Add `'novelReader'` to `componentKeys` in `libs/config/props.js`.

- [ ] **Step 5: Add the npm verification entry and run it**

Add `"verify:novel-reader-props": "node scripts/verify-novel-reader-props.mjs"` to `package.json`.

Run: `npm run verify:novel-reader-props`

Expected: PASS with `novel reader props contract passed`.

- [ ] **Step 6: Commit the contract**

```powershell
git add src/uni_modules/uview-plus/components/u-novel-reader/novelReader.js src/uni_modules/uview-plus/components/u-novel-reader/props.js src/uni_modules/uview-plus/libs/config/props.js scripts/verify-novel-reader-props.mjs package.json
git commit -m "注册小说阅读器组件参数" -m "增加小说阅读器的默认配置、props 混入和静态校验入口，为后续阅读状态与 UI 实现提供公共契约。"
```

### Task 2: 实现正文归一化、阅读状态与本地持久化

**Files:**
- Create: `src/uni_modules/uview-plus/components/u-novel-reader/content-normalizer.js`
- Create: `src/uni_modules/uview-plus/components/u-novel-reader/reader-core.js`
- Create: `src/uni_modules/uview-plus/components/u-novel-reader/persistence.js`
- Create: `scripts/verify-novel-reader-data.mjs`
- Modify: `package.json`

**Interfaces:**
- `normalizeContent(content)` returns `{ paragraphs, text, length }`.
- `normalizeProgress(progress, chapter)` returns a progress object with `chapterId`, `chapterIndex`, `charOffset`, `pageIndex`, `scrollTop`, `chapterProgress`, and `totalProgress`.
- `mergeReaderSettings(defaultSettings, persistedSettings, externalSettings)` returns the resolved `ReaderSettings`.
- `createStorageKey({ storageKey, bookId })` returns `uview-plus:novel-reader:${bookId}` when `storageKey` is empty and `bookId` exists.
- `readPersistedState(key)` returns a validated versioned state or `null`.
- `writePersistedState(key, state)` writes a version `1` payload using `uni.setStorageSync` when available and fails silently with a returned `false`.
- `reader-core.js` exposes pure transitions for `toggleControls`, `setMode`, `setSettings`, `setProgress`, `toggleBookmark`, `startReading`, `pauseReading`, and `consumeReadingTime`.

- [ ] **Step 1: Write the data contract assertions**

Create `scripts/verify-novel-reader-data.mjs` to assert that the helper source contains the named exports, normalizes both strings and arrays, declares storage version `1`, and rejects invalid persisted states.

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const normalizer = readFileSync(resolve(root, 'src/uni_modules/uview-plus/components/u-novel-reader/content-normalizer.js'), 'utf8')
const core = readFileSync(resolve(root, 'src/uni_modules/uview-plus/components/u-novel-reader/reader-core.js'), 'utf8')
const persistence = readFileSync(resolve(root, 'src/uni_modules/uview-plus/components/u-novel-reader/persistence.js'), 'utf8')

for (const name of ['normalizeContent', 'normalizeProgress']) assert.match(normalizer, new RegExp(name))
for (const name of ['toggleControls', 'setMode', 'setSettings', 'setProgress', 'toggleBookmark']) assert.match(core, new RegExp(name))
assert.match(persistence, /version:\s*1/)
assert.match(persistence, /setStorageSync/)
assert.match(persistence, /JSON\.parse/)
console.log('novel reader data contract passed')
```

- [ ] **Step 2: Run the data assertions and verify they fail**

Run: `node scripts/verify-novel-reader-data.mjs`

Expected: FAIL because the helper modules do not exist.

- [ ] **Step 3: Implement content normalization**

Implement `normalizeContent` so strings split on `\r\n`, `\n`, or `\r`; arrays preserve item order; empty trailing paragraphs are removed only when the whole content is empty; and every returned paragraph has a stable `index`, `text`, `startOffset`, and `endOffset`.

- [ ] **Step 4: Implement progress and settings transitions**

Implement immutable transition functions in `reader-core.js`. Clamp `charOffset`, `pageIndex`, and progress values; keep the current chapter ID when settings change; and use `charOffset` as the restoration anchor after a reflow.

- [ ] **Step 5: Implement versioned persistence**

Implement `persistence.js` with:

```js
const STORAGE_VERSION = 1
const DEFAULT_STORAGE_PREFIX = 'uview-plus:novel-reader:'
```

Validate `progress`, `settings`, `bookmarks`, `readingTime`, and `updatedAt` before returning stored data. Catch storage and JSON errors without throwing into the render path.

- [ ] **Step 6: Add the npm entry and run the assertions**

Add `"verify:novel-reader-data": "node scripts/verify-novel-reader-data.mjs"` to `package.json`.

Run: `npm run verify:novel-reader-data`

Expected: PASS with `novel reader data contract passed`.

- [ ] **Step 7: Commit the data layer**

```powershell
git add src/uni_modules/uview-plus/components/u-novel-reader/content-normalizer.js src/uni_modules/uview-plus/components/u-novel-reader/reader-core.js src/uni_modules/uview-plus/components/u-novel-reader/persistence.js scripts/verify-novel-reader-data.mjs package.json
git commit -m "实现小说阅读器状态与持久化" -m "增加正文归一化、阅读进度、设置、书签和版本化本地存储的纯状态逻辑，保证后续 UI 层只消费稳定状态。"
```

### Task 3: 实现文本测量与横向分页引擎

**Files:**
- Create: `src/uni_modules/uview-plus/components/u-novel-reader/measure-adapter.js`
- Create: `src/uni_modules/uview-plus/components/u-novel-reader/layout-engine.js`
- Create: `scripts/verify-novel-reader-layout.mjs`
- Modify: `package.json`

**Interfaces:**
- `createLayoutKey({ chapterId, settings, width, height })` returns a deterministic cache key.
- `wrapText(text, width, measureText)` returns line segments with character offsets.
- `paginateParagraphs(paragraphs, layout)` returns `{ pages, pageCount, charOffsetToPage }`.
- `resolveAnchor(pages, charOffset)` returns the page index and local offset nearest to the requested character offset.
- `measure-adapter.js` exposes `measureTextWidth(text, style)` and `measureContainer(selector, vm)` with Canvas/selector-query fallback.

- [ ] **Step 1: Write the failing layout assertions**

Create `scripts/verify-novel-reader-layout.mjs` that checks the layout source contains deterministic cache key construction, paragraph wrapping, page output, character offsets, and anchor restoration.

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(resolve(root, 'src/uni_modules/uview-plus/components/u-novel-reader/layout-engine.js'), 'utf8')

for (const name of ['createLayoutKey', 'wrapText', 'paginateParagraphs', 'resolveAnchor']) {
  assert.match(source, new RegExp(name))
}
assert.match(source, /charOffset/)
assert.match(source, /pageCount/)
console.log('novel reader layout contract passed')
```

- [ ] **Step 2: Run the layout assertions and verify they fail**

Run: `node scripts/verify-novel-reader-layout.mjs`

Expected: FAIL because the layout engine does not exist.

- [ ] **Step 3: Implement text measurement adapters**

Use a supplied measurement callback as the primary path. When the callback is unavailable, use the component’s Canvas context or a conservative average-width fallback. Keep platform checks inside `measure-adapter.js`; the layout engine must remain platform-independent.

- [ ] **Step 4: Implement deterministic line wrapping**

Wrap Chinese characters individually and keep contiguous Latin/number tokens together until the measured width exceeds the content width. Preserve paragraph boundaries and attach absolute character offsets to each segment.

- [ ] **Step 5: Implement page grouping and anchor recovery**

Group lines by available height after subtracting paragraph spacing. Do not create an empty page for an empty paragraph. Ensure a single long paragraph is split across pages and `resolveAnchor` returns the first page whose end offset contains the requested anchor.

- [ ] **Step 6: Add layout caching and run the assertions**

Cache only pure layout results by `createLayoutKey`; invalidate when chapter ID, font settings, content width, or container dimensions change.

Add `"verify:novel-reader-layout": "node scripts/verify-novel-reader-layout.mjs"` to `package.json`.

Run: `npm run verify:novel-reader-layout`

Expected: PASS with `novel reader layout contract passed`.

- [ ] **Step 7: Commit the pagination engine**

```powershell
git add src/uni_modules/uview-plus/components/u-novel-reader/measure-adapter.js src/uni_modules/uview-plus/components/u-novel-reader/layout-engine.js scripts/verify-novel-reader-layout.mjs package.json
git commit -m "增加小说阅读器分页引擎" -m "实现跨端文本测量、长段落断行、页面分组和字符锚点恢复，为横向分页与设置重排提供基础。"
```

### Task 4: 组装正文容器与受控章节切换

**Files:**
- Create: `src/uni_modules/uview-plus/components/u-novel-reader/reader-content.vue`
- Create: `src/uni_modules/uview-plus/components/u-novel-reader/u-novel-reader.vue`
- Create: `src/uni_modules/uview-plus/components/u-novel-reader/theme-vars.scss`
- Modify: `scripts/verify-novel-reader-layout.mjs`

**Interfaces:**
- `reader-content.vue` consumes normalized paragraphs, pages, `mode`, `settings`, `loading`, `error`, and `empty` slots.
- `u-novel-reader.vue` consumes the props mixin and emits the public events from the design spec.
- `reader-content.vue` emits `content-scroll`, `page-change`, `tap-zone`, and `layout-ready`.

- [ ] **Step 1: Add component shell assertions**

Extend `scripts/verify-novel-reader-layout.mjs` to assert that `u-novel-reader.vue` renders `reader-content`, uses `currentChapter`, exposes `chapter-request`, and contains both `scroll-view` and `swiper`.

```js
const componentSource = readFileSync(
  resolve(root, 'src/uni_modules/uview-plus/components/u-novel-reader/u-novel-reader.vue'),
  'utf8'
)
assert.match(componentSource, /reader-content/)
assert.match(componentSource, /currentChapter/)
assert.match(componentSource, /chapter-request/)
assert.match(componentSource, /scroll-view/)
assert.match(componentSource, /swiper/)
```

- [ ] **Step 2: Run the extended assertions and verify they fail**

Run: `npm run verify:novel-reader-layout`

Expected: FAIL because the public component and content renderer do not exist.

- [ ] **Step 3: Implement the content renderer**

Render normalized paragraphs in `scroll-view` for `scroll` mode. Render paginated page strings inside `swiper-item` for `page` mode. Keep keys based on paragraph/page indexes and never use the paragraph text itself as a key.

- [ ] **Step 4: Implement mode-specific interaction**

Emit `content-scroll` with `scrollTop`; emit `page-change` with `pageIndex`; translate left/right tap zones into previous/next page requests; let middle taps toggle controls; and disable horizontal gesture handling in scroll mode.

- [ ] **Step 5: Implement the public component shell**

Normalize the current chapter, resolve external/persisted/default state, calculate layout after mount and dimension changes, and route boundary actions through one `requestChapter(targetIndex, direction)` method. Ignore duplicate requests while `loading` or while the same request token is pending.

- [ ] **Step 6: Add theme variables and run the assertions**

Add `day`, `paper`, `green`, `night`, and `dark` variables to `theme-vars.scss`. Ensure content style uses the resolved theme and typography settings without mutating global `uview-plus` variables.

Run: `npm run verify:novel-reader-layout`

Expected: PASS with the layout and component shell assertions.

- [ ] **Step 7: Commit the content integration**

```powershell
git add src/uni_modules/uview-plus/components/u-novel-reader/reader-content.vue src/uni_modules/uview-plus/components/u-novel-reader/u-novel-reader.vue src/uni_modules/uview-plus/components/u-novel-reader/theme-vars.scss scripts/verify-novel-reader-layout.mjs
git commit -m "组装小说阅读器正文容器" -m "接入纵向滚动、横向分页、正文主题和受控章节切换，建立小说阅读器的主渲染路径。"
```

### Task 5: 增加工具栏、目录、设置与安全区适配

**Files:**
- Create: `src/uni_modules/uview-plus/components/u-novel-reader/reader-toolbar.vue`
- Create: `src/uni_modules/uview-plus/components/u-novel-reader/reader-catalog.vue`
- Create: `src/uni_modules/uview-plus/components/u-novel-reader/reader-settings.vue`
- Modify: `src/uni_modules/uview-plus/components/u-novel-reader/u-novel-reader.vue`
- Modify: `src/uni_modules/uview-plus/components/u-novel-reader/theme-vars.scss`
- Create: `scripts/verify-novel-reader-ui.mjs`
- Modify: `package.json`

**Interfaces:**
- `reader-toolbar.vue` emits `back`, `toggle-catalog`, `toggle-settings`, `toggle-bookmark`, `previous`, `next`, and `toggle-controls`.
- `reader-catalog.vue` consumes `chapters`, `currentChapter`, `bookmarks`, and `progress`; emits `chapter-select` and `bookmark-select`.
- `reader-settings.vue` consumes `settings`; emits `update-settings` and `close`.
- The public component forwards `back` and, only when `autoBack` is true, calls `uni.navigateBack()`.

- [ ] **Step 1: Write UI contract assertions**

Create `scripts/verify-novel-reader-ui.mjs` to assert the UI source contains `u-status-bar`, `u-safe-bottom`, `arrow-left`, `showBack`, `u-popup`, `u-slider`, and all five theme names.

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const componentDir = resolve(root, 'src/uni_modules/uview-plus/components/u-novel-reader')
const source = readFileSync(resolve(componentDir, 'u-novel-reader.vue'), 'utf8')
const toolbar = readFileSync(resolve(componentDir, 'reader-toolbar.vue'), 'utf8')
const settings = readFileSync(resolve(componentDir, 'reader-settings.vue'), 'utf8')

for (const token of ['u-status-bar', 'u-safe-bottom', 'u-popup']) assert.match(source, new RegExp(token))
for (const token of ['arrow-left', 'showBack', 'toggle-controls']) assert.match(toolbar, new RegExp(token))
assert.match(settings, /u-slider/)
for (const theme of ['day', 'paper', 'green', 'night', 'dark']) assert.match(source + settings, new RegExp(theme))
console.log('novel reader UI contract passed')
```

- [ ] **Step 2: Run the UI assertions and verify they fail**

Run: `node scripts/verify-novel-reader-ui.mjs`

Expected: FAIL because the toolbar, catalog, settings, and safe-area integrations do not exist.

- [ ] **Step 3: Implement the toolbar**

Render the top toolbar only when `controlsVisible` is true. Put the default `arrow-left` icon inside the top toolbar, not as a permanent overlay. Put chapter title, catalog, bookmark, progress, previous, next, and settings actions behind touch-sized interactive regions.

- [ ] **Step 4: Implement catalog and settings panels**

Use `u-popup` for the catalog and settings panels. Use `u-slider` for字号、行高、段距和正文宽度; use `u-icon` for actions; render locked chapters as disabled and keep the current chapter highlighted. Keep all visible labels in Chinese demo content but expose slots for custom panel content.

- [ ] **Step 5: Implement safe-area and reduced-motion behavior**

Wrap the top toolbar in `u-status-bar` when `safeAreaInsetTop` is true and the bottom toolbar in `u-safe-bottom` when `safeAreaInsetBottom` is true. Set the effective animation flag to `pageAnimation && settings.animation`; when false, pass zero duration to transitions and swiper.

- [ ] **Step 6: Add the npm entry and run the assertions**

Add `"verify:novel-reader-ui": "node scripts/verify-novel-reader-ui.mjs"` to `package.json`.

Run: `npm run verify:novel-reader-ui`

Expected: PASS with `novel reader UI contract passed`.

- [ ] **Step 7: Commit the reading controls**

```powershell
git add src/uni_modules/uview-plus/components/u-novel-reader/reader-toolbar.vue src/uni_modules/uview-plus/components/u-novel-reader/reader-catalog.vue src/uni_modules/uview-plus/components/u-novel-reader/reader-settings.vue src/uni_modules/uview-plus/components/u-novel-reader/u-novel-reader.vue src/uni_modules/uview-plus/components/u-novel-reader/theme-vars.scss scripts/verify-novel-reader-ui.mjs package.json
git commit -m "完善小说阅读器工具栏与设置" -m "增加顶部工具栏、目录、书签入口、阅读设置、主题切换和顶底安全区适配，保持返回按钮随工具栏显示。"
```

### Task 6: 接入持久化、书签、统计和异步错误状态

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-novel-reader/u-novel-reader.vue`
- Modify: `src/uni_modules/uview-plus/components/u-novel-reader/reader-core.js`
- Modify: `src/uni_modules/uview-plus/components/u-novel-reader/persistence.js`
- Modify: `src/uni_modules/uview-plus/components/u-novel-reader/reader-catalog.vue`
- Modify: `scripts/verify-novel-reader-data.mjs`

**Interfaces:**
- Emits `progress-change`, `settings-change`, `bookmark-change`, and `reading-time-change` with the payloads defined in the design spec.
- Emits `chapter-prefetch` when `pageCount - pageIndex <= preloadThreshold`.
- Emits `retry` from the error slot and retry button.
- Uses `initialProgress`/`progress`, `initialBookmarks`/`bookmarks`, `defaultSettings`/`settings` precedence exactly as specified.

- [ ] **Step 1: Extend data assertions for persistence behavior**

Assert that `u-novel-reader.vue` references `readPersistedState`, `writePersistedState`, `chapter-prefetch`, `reading-time-change`, and `retry`; assert that storage keys include both `storageKey` and `bookId`.

- [ ] **Step 2: Run the extended assertions and verify the missing integrations**

Run: `npm run verify:novel-reader-data`

Expected: FAIL on the missing component integration tokens.

- [ ] **Step 3: Implement state precedence and throttled writes**

Resolve state in this order: explicit controlled prop, initial prop, persisted state, default. Schedule progress/settings/bookmark writes with one shared timer; flush on page hide, component unmount, and chapter request.

- [ ] **Step 4: Implement bookmarks and chapter prefetch**

Create bookmark IDs from `chapterId:charOffset`, update the catalog list immediately, emit the complete bookmark list, and emit `chapter-prefetch` only once per target chapter until the current chapter changes.

- [ ] **Step 5: Implement reading-time tracking and errors**

Start timing on first content interaction, pause on page hide or loading/error, and emit accumulated milliseconds. Render `loading`, `error`, and `empty` slots; ignore stale chapter responses by comparing request tokens.

- [ ] **Step 6: Run all data assertions**

Run: `npm run verify:novel-reader-data`

Expected: PASS with `novel reader data contract passed`.

- [ ] **Step 7: Commit the state integration**

```powershell
git add src/uni_modules/uview-plus/components/u-novel-reader/u-novel-reader.vue src/uni_modules/uview-plus/components/u-novel-reader/reader-core.js src/uni_modules/uview-plus/components/u-novel-reader/persistence.js src/uni_modules/uview-plus/components/u-novel-reader/reader-catalog.vue scripts/verify-novel-reader-data.mjs
git commit -m "接入小说阅读器阅读状态" -m "完成进度、设置、书签、阅读时长、章节预加载和异步错误状态的事件与持久化闭环。"
```

### Task 7: 添加组件示例与页面注册

**Files:**
- Create: `src/pages/componentsD/novelReader/novelReader.nvue`
- Modify: `src/pages.json`
- Modify: `src/pages/example/components.config.js`

**Interfaces:**
- The demo must exercise the public contract without network access:

```vue
<up-novel-reader
  book-id="demo-novel"
  :chapters="chapters"
  :current-chapter="currentChapter"
  :progress="progress"
  :settings="settings"
  @chapter-request="handleChapterRequest"
  @chapter-prefetch="handleChapterPrefetch"
  @progress-change="progress = $event"
  @settings-change="settings = $event"
/>
```

- [ ] **Step 1: Create deterministic demo chapters**

Create at least four chapters with long Chinese paragraphs, one empty chapter, and one locked chapter. Keep chapter content inline so H5 and nvue demos do not depend on external services.

- [ ] **Step 2: Add controlled chapter switching**

Implement `handleChapterRequest` in the demo to set `currentChapter` from the local fixture after a short `setTimeout`; set `loading` and clear it in both success and failure paths.

- [ ] **Step 3: Add mode and settings demo controls**

Render the reader inside a page-sized container. Show the current chapter, progress event output, and a button to reset the demo storage key. Do not add business-only controls to the public component.

- [ ] **Step 4: Register the route**

Add the `componentsD/novelReader/novelReader` page entry near the other reading/document components in `src/pages.json`, with navigation title `小说阅读器`.

- [ ] **Step 5: Register the component catalog item**

Add the component entry after `pdfReader` in `src/pages/example/components.config.js` using `icon: 'file-text'`, title `NovelReader 小说阅读器`, and title `NovelReader`.

- [ ] **Step 6: Run a route/config check**

Run: `npm run type-check`

Expected: The new page and component references introduce no new diagnostics. If existing unrelated diagnostics remain, record them without changing unrelated files.

- [ ] **Step 7: Commit the demo**

```powershell
git add src/pages/componentsD/novelReader/novelReader.nvue src/pages.json src/pages/example/components.config.js
git commit -m "增加小说阅读器示例页面" -m "注册小说阅读器演示路由和组件目录，使用本地章节数据验证受控切换、进度、设置和预加载事件。"
```

### Task 8: 编写组件文档并接入文档导航

**Files:**
- Create: `..\uview-plus-doc\docs\components\novelReader.md`
- Modify: `..\uview-plus-doc\docs\.vuepress\config.js`

**Interfaces:**
- Documentation must describe the exact `chapters`/`currentChapter` controlled data contract.
- Documentation must list every public prop, event, slot, theme, storage behavior, and platform limitation.
- Documentation demo URL must be `/pages/componentsD/novelReader/novelReader`.

- [ ] **Step 1: Copy the documented API into a component page**

Create `novelReader.md` with:

```md
## 小说阅读器

<demo-model url="/pages/componentsD/novelReader/novelReader"></demo-model>
```

Include sections for basic usage, controlled chapter loading, scroll/page modes, directory and bookmarks, settings/themes, persistence, safe area, slots, events, and platform differences.

- [ ] **Step 2: Add a minimal controlled usage example**

Document the following shape and explain that `chapter-request` does not perform the request itself:

```vue
<up-novel-reader
  book-id="book-1"
  :chapters="chapters"
  :current-chapter="currentChapter"
  @chapter-request="loadChapter"
/>
```

- [ ] **Step 3: Add the API tables**

Use the existing component documentation table style with exact prop types/defaults, event payloads, and slot names from the design spec. Explicitly document that the return icon belongs to the top toolbar and is not permanently visible.

- [ ] **Step 4: Add platform and accessibility notes**

Document H5、小程序、App Vue、App nvue support, safe-area defaults, pure-text scope, reduced-motion behavior, and the requirement to update `currentChapter` after handling `chapter-request`.

- [ ] **Step 5: Add the sidebar route**

Insert `'/components/novelReader'` after `'/components/pdfReader'` in the relevant component group in `docs/.vuepress/config.js`.

- [ ] **Step 6: Run Markdown and path checks**

From `D:\Repos\xyito\open\uview-plus` run:

```powershell
Test-Path '..\uview-plus-doc\docs\components\novelReader.md'
rg -n "novelReader|小说阅读器|chapter-request|safeAreaInsetTop" '..\uview-plus-doc\docs\components\novelReader.md' '..\uview-plus-doc\docs\.vuepress\config.js'
```

Expected: the document exists and the route/API terms are present.

- [ ] **Step 7: Commit the documentation repository**

```powershell
git -C ..\uview-plus-doc add docs/components/novelReader.md docs/.vuepress/config.js
git -C ..\uview-plus-doc commit -m "补充小说阅读器组件文档" -m "增加小说阅读器的使用说明、完整 API、平台差异和侧边栏入口，确保组件功能可查阅和可验证。"
```

### Task 9: 全量验证并整理交付状态

**Files:**
- Modify only if validation exposes a defect in the files above.
- Verify: `src/uni_modules/uview-plus/components/u-novel-reader/`
- Verify: `src/pages/componentsD/novelReader/novelReader.nvue`
- Verify: `scripts/verify-novel-reader-*.mjs`
- Verify: `..\uview-plus-doc\docs\components\novelReader.md`

- [ ] **Step 1: Run all targeted verification scripts**

Run:

```powershell
npm run verify:novel-reader-props
npm run verify:novel-reader-data
npm run verify:novel-reader-layout
npm run verify:novel-reader-ui
```

Expected: all four scripts exit with code `0`.

- [ ] **Step 2: Run type checking**

Run: `npm run type-check`

Expected: no diagnostics caused by the new component. Record pre-existing unrelated diagnostics instead of modifying unrelated code.

- [ ] **Step 3: Build H5**

Run: `npm run build:h5`

Expected: Vite/uni-app completes the H5 build without template, import, or Sass errors.

- [ ] **Step 4: Check the final worktree**

Run:

```powershell
git status --short
git -C ..\uview-plus-doc status --short
git diff --check
```

Expected: only the intentionally retained `.claude/` worktree entry remains untracked; no generated build output or unrelated file is staged.

- [ ] **Step 5: Review commits and summarize**

Run:

```powershell
git log -9 --oneline --decorate
git -C ..\uview-plus-doc log -3 --oneline --decorate
```

Confirm every new commit has a Chinese head and body, and report the targeted checks, type-check/build results, platform limitations, and any unrelated pre-existing failures.
