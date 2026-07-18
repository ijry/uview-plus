# Calendar Popup Props Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `u-calendar` 增加常用 `u-popup` 显式 props，并透传到日历主弹层，使 `pageInline` 模式可通过 `safeAreaInsetBottom=false` 关闭底部安全区。

**Architecture:** 保持 `u-calendar` 作为稳定公开 API 边界，不引入 `popupProps` 对象透传。新增 props 在 `calendar.js` 定义默认值，在 `props.js` 暴露给组件，在 `u-calendar.vue` 主 `u-popup` 上逐项绑定，并同步 TypeScript 声明。用静态验证脚本覆盖默认值、props 声明、模板透传和类型声明，避免多文件同步遗漏。

**Tech Stack:** Vue 3 Options API / uni-app / uview-plus 组件 props mixin / Node.js 静态校验脚本 / TypeScript 声明文件。

## Global Constraints

- `u-calendar` 新增 props 必须是显式声明，不使用 `popupProps` 对象透传。
- 不透传 `mode`，因为 `u-calendar.mode` 已表示日期选择模式，内部主 `u-popup` 继续固定 `mode="bottom"`。
- 不开放 `closeable`，保留 `:closeable="!pageInline"` 的既有行为。
- 新增 props 默认值必须对齐 `u-popup` 当前默认值。
- `pageInline` 默认行为不变；只有用户显式传入 `:safeAreaInsetBottom="false"` 时才关闭底部安全区。
- 提交信息必须使用中文，并包含 head 和 body。
- 不修改既有无关变更：`AGENTS.md`、`.claude/`。

---

## File Structure

- Create: `scripts/verify-calendar-popup-props.mjs`
  - 负责静态断言 `u-calendar` 的新增 popup props 已在默认值、props、模板和类型声明中同步。
- Modify: `package.json`
  - 增加 `verify:calendar-popup-props` 脚本入口。
- Modify: `src/uni_modules/uview-plus/components/u-calendar/calendar.js`
  - 增加 `u-calendar` 新 popup props 的默认值。
- Modify: `src/uni_modules/uview-plus/components/u-calendar/props.js`
  - 增加 `u-calendar` 新 popup props 的 props 声明，默认值引用 `defProps.calendar`。
- Modify: `src/uni_modules/uview-plus/components/u-calendar/u-calendar.vue`
  - 将新增 props 逐项绑定到主 `u-popup`，不影响内部时间选择器弹层。
- Modify: `src/uni_modules/uview-plus/types/comps/calendar.d.ts`
  - 增加新 props 的 TypeScript 类型和注释。

## Task 1: Calendar Popup Props API

**Files:**
- Create: `scripts/verify-calendar-popup-props.mjs`
- Modify: `package.json`
- Modify: `src/uni_modules/uview-plus/components/u-calendar/calendar.js`
- Modify: `src/uni_modules/uview-plus/components/u-calendar/props.js`
- Modify: `src/uni_modules/uview-plus/components/u-calendar/u-calendar.vue`
- Modify: `src/uni_modules/uview-plus/types/comps/calendar.d.ts`

**Interfaces:**
- Consumes: `u-popup` props `overlay`, `duration`, `overlayStyle`, `overlayOpacity`, `zIndex`, `safeAreaInsetBottom`, `safeAreaInsetTop`, `bgColor`.
- Produces: `u-calendar` props with the same public names: `overlay?: boolean`, `duration?: number | string`, `overlayStyle?: unknown`, `overlayOpacity?: number | string`, `zIndex?: number | string`, `safeAreaInsetBottom?: boolean`, `safeAreaInsetTop?: boolean`, `bgColor?: string`.

- [ ] **Step 1: Write the failing static verification script**

Create `scripts/verify-calendar-popup-props.mjs` with this exact content:

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const calendarVueSource = read('src/uni_modules/uview-plus/components/u-calendar/u-calendar.vue')
const calendarPropsSource = read('src/uni_modules/uview-plus/components/u-calendar/props.js')
const calendarDefaultsSource = read('src/uni_modules/uview-plus/components/u-calendar/calendar.js')
const calendarTypesSource = read('src/uni_modules/uview-plus/types/comps/calendar.d.ts')

const popupProps = [
    'overlay',
    'duration',
    'overlayStyle',
    'overlayOpacity',
    'zIndex',
    'safeAreaInsetBottom',
    'safeAreaInsetTop',
    'bgColor'
]

const mainPopupMatch = calendarVueSource.match(/<u-popup\s+([\s\S]*?)>\s*<view class="u-calendar">/)
assert.ok(mainPopupMatch, 'expected u-calendar main popup wrapping .u-calendar')
const mainPopupAttrs = mainPopupMatch[1]

for (const prop of popupProps) {
    assert.match(
        mainPopupAttrs,
        new RegExp(`:${prop}="${prop}"`),
        `expected main u-popup to bind :${prop}="${prop}"`
    )
    assert.match(
        calendarPropsSource,
        new RegExp(`${prop}:\\s*\\{[\\s\\S]*default:\\s*\\(\\)\\s*=>\\s*defProps\\.calendar\\.${prop}`),
        `expected props.js to define ${prop} from defProps.calendar.${prop}`
    )
    assert.match(
        calendarDefaultsSource,
        new RegExp(`${prop}:\\s*`),
        `expected calendar default props to include ${prop}`
    )
    assert.match(
        calendarTypesSource,
        new RegExp(`${prop}\\?:`),
        `expected calendar.d.ts to expose ${prop}`
    )
}

assert.match(calendarDefaultsSource, /overlay:\s*true/, 'expected overlay default to match u-popup')
assert.match(calendarDefaultsSource, /duration:\s*300/, 'expected duration default to match u-popup')
assert.match(calendarDefaultsSource, /overlayStyle:\s*\{\}/, 'expected overlayStyle default to match u-popup')
assert.match(calendarDefaultsSource, /overlayOpacity:\s*0\.5/, 'expected overlayOpacity default to match u-popup')
assert.match(calendarDefaultsSource, /zIndex:\s*10075/, 'expected zIndex default to match u-popup')
assert.match(calendarDefaultsSource, /safeAreaInsetBottom:\s*true/, 'expected safeAreaInsetBottom default to match u-popup')
assert.match(calendarDefaultsSource, /safeAreaInsetTop:\s*false/, 'expected safeAreaInsetTop default to match u-popup')
assert.match(calendarDefaultsSource, /bgColor:\s*''/, 'expected bgColor default to match u-popup')

assert.match(
    mainPopupAttrs,
    /mode="bottom"/,
    'expected u-calendar main popup mode to remain fixed to bottom'
)
assert.match(
    mainPopupAttrs,
    /:closeable="!pageInline"/,
    'expected u-calendar to keep closeable controlled by pageInline'
)
assert.doesNotMatch(
    calendarPropsSource,
    /popupProps|closeable:\s*\{/,
    'u-calendar must not expose popupProps or closeable'
)

console.log('calendar popup props assertions passed')
```

- [ ] **Step 2: Add the npm verification entry**

Modify `package.json` so the end of `scripts` contains this block:

```json
    "type-check": "vue-tsc --noEmit",
    "verify:pagination": "node scripts/verify-pagination-component.mjs",
    "verify:navbar-safe-area-background": "node scripts/verify-navbar-safe-area-background.mjs",
    "verify:calendar-popup-props": "node scripts/verify-calendar-popup-props.mjs"
```

- [ ] **Step 3: Run the new test and verify it fails before implementation**

Run:

```powershell
npm run verify:calendar-popup-props
```

Expected: command exits non-zero with an assertion similar to:

```text
AssertionError [ERR_ASSERTION]: expected main u-popup to bind :overlay="overlay"
```

- [ ] **Step 4: Add calendar default props**

In `src/uni_modules/uview-plus/components/u-calendar/calendar.js`, replace this section:

```js
        show: false,
        closeOnClickOverlay: false,
        readonly: false,
```

with:

```js
        show: false,
        overlay: true,
        duration: 300,
        overlayStyle: {},
        overlayOpacity: 0.5,
        zIndex: 10075,
        safeAreaInsetBottom: true,
        safeAreaInsetTop: false,
        bgColor: '',
        closeOnClickOverlay: false,
        readonly: false,
```

- [ ] **Step 5: Add calendar props declarations**

In `src/uni_modules/uview-plus/components/u-calendar/props.js`, replace this section:

```js
        // 是否显示日历弹窗
        show: {
            type: Boolean,
            default: () => defProps.calendar.show
        },
        // 是否允许点击遮罩关闭日历
        closeOnClickOverlay: {
            type: Boolean,
            default: () => defProps.calendar.closeOnClickOverlay
        },
        // 是否为只读状态，只读状态下禁止选择日期
```

with:

```js
        // 是否显示日历弹窗
        show: {
            type: Boolean,
            default: () => defProps.calendar.show
        },
        // 是否显示遮罩
        overlay: {
            type: Boolean,
            default: () => defProps.calendar.overlay
        },
        // 动画时长，单位ms
        duration: {
            type: [String, Number],
            default: () => defProps.calendar.duration
        },
        // 自定义遮罩的样式
        overlayStyle: {
            type: [Object, String],
            default: () => defProps.calendar.overlayStyle
        },
        // 遮罩的透明度，0-1之间
        overlayOpacity: {
            type: [Number, String],
            default: () => defProps.calendar.overlayOpacity
        },
        // 层级
        zIndex: {
            type: [String, Number],
            default: () => defProps.calendar.zIndex
        },
        // 是否为iPhoneX留出底部安全距离
        safeAreaInsetBottom: {
            type: Boolean,
            default: () => defProps.calendar.safeAreaInsetBottom
        },
        // 是否留出顶部安全距离（状态栏高度）
        safeAreaInsetTop: {
            type: Boolean,
            default: () => defProps.calendar.safeAreaInsetTop
        },
        // 弹窗背景色，设置为transparent可去除白色背景
        bgColor: {
            type: String,
            default: () => defProps.calendar.bgColor
        },
        // 是否允许点击遮罩关闭日历
        closeOnClickOverlay: {
            type: Boolean,
            default: () => defProps.calendar.closeOnClickOverlay
        },
        // 是否为只读状态，只读状态下禁止选择日期
```

- [ ] **Step 6: Bind the new props to the main popup**

In `src/uni_modules/uview-plus/components/u-calendar/u-calendar.vue`, replace the opening main `u-popup` block:

```vue
	<u-popup
		:show="show"
		mode="bottom"
		:closeable="!pageInline"
		@close="close"
		:round="round"
		:pageInline="pageInline"
		:closeOnClickOverlay="closeOnClickOverlay"
	>
```

with:

```vue
	<u-popup
		:show="show"
		mode="bottom"
		:overlay="overlay"
		:duration="duration"
		:overlayStyle="overlayStyle"
		:overlayOpacity="overlayOpacity"
		:zIndex="zIndex"
		:safeAreaInsetBottom="safeAreaInsetBottom"
		:safeAreaInsetTop="safeAreaInsetTop"
		:bgColor="bgColor"
		:closeable="!pageInline"
		@close="close"
		:round="round"
		:pageInline="pageInline"
		:closeOnClickOverlay="closeOnClickOverlay"
	>
```

- [ ] **Step 7: Add TypeScript declarations**

In `src/uni_modules/uview-plus/types/comps/calendar.d.ts`, replace this section:

```ts
  /**
   * 是否显示日历弹窗
   * @default false
   */
  show?: boolean
  /**
   * 是否允许点击遮罩关闭日历 （注意：关闭事件需要自行处理，只会在开启closeOnClickOverlay后点击遮罩层执行close回调）
   * @default false
   */
  closeOnClickOverlay?: boolean
```

with:

```ts
  /**
   * 是否显示日历弹窗
   * @default false
   */
  show?: boolean
  /**
   * 是否显示遮罩
   * @default true
   */
  overlay?: boolean
  /**
   * 动画时长，单位ms
   * @default 300
   */
  duration?: number | string
  /**
   * 自定义遮罩的样式
   */
  overlayStyle?: unknown
  /**
   * 遮罩透明度，0-1之间，勿与overlayStyle共用
   * @default 0.5
   */
  overlayOpacity?: number | string
  /**
   * 弹出层的z-index值
   * @default 10075
   */
  zIndex?: number | string
  /**
   * 是否留出底部安全距离
   * @default true
   */
  safeAreaInsetBottom?: boolean
  /**
   * 是否留出顶部安全距离（状态栏高度）
   * @default false
   */
  safeAreaInsetTop?: boolean
  /**
   * 背景色，一般用于特殊弹窗内容场景，设置为transparent可去除默认的白色背景
   */
  bgColor?: string
  /**
   * 是否允许点击遮罩关闭日历 （注意：关闭事件需要自行处理，只会在开启closeOnClickOverlay后点击遮罩层执行close回调）
   * @default false
   */
  closeOnClickOverlay?: boolean
```

- [ ] **Step 8: Run focused verification**

Run:

```powershell
npm run verify:calendar-popup-props
```

Expected:

```text
calendar popup props assertions passed
```

- [ ] **Step 9: Run type check**

Run:

```powershell
npm run type-check
```

Expected: this repository currently has a pre-existing type-check baseline failure unrelated to this task. The failure starts at `src/uni_modules/uview-plus/components/u-parse/node/node.vue:2` with Vue template parser errors. Treat the result as acceptable only if no new errors reference the calendar files changed by this plan.

- [ ] **Step 10: Check worktree scope**

Run:

```powershell
git status --short
```

Expected relevant changes:

```text
 M package.json
 M src/uni_modules/uview-plus/components/u-calendar/calendar.js
 M src/uni_modules/uview-plus/components/u-calendar/props.js
 M src/uni_modules/uview-plus/components/u-calendar/u-calendar.vue
 M src/uni_modules/uview-plus/types/comps/calendar.d.ts
?? scripts/verify-calendar-popup-props.mjs
```

Existing unrelated changes may still appear and must not be staged:

```text
 M AGENTS.md
?? .claude/
```

- [ ] **Step 11: Commit implementation**

Run:

```powershell
git add -- docs/superpowers/plans/2026-07-19-calendar-popup-props.md package.json scripts/verify-calendar-popup-props.mjs src/uni_modules/uview-plus/components/u-calendar/calendar.js src/uni_modules/uview-plus/components/u-calendar/props.js src/uni_modules/uview-plus/components/u-calendar/u-calendar.vue src/uni_modules/uview-plus/types/comps/calendar.d.ts
git commit -m "增强日历弹层属性透传" -m "为 u-calendar 增加常用 u-popup 配置的显式 props 与透传逻辑，并加入静态校验覆盖 safeAreaInsetBottom 等属性。"
```

Expected: a commit is created. `AGENTS.md` and `.claude/` remain unstaged/uncommitted.

## Self-Review

- Spec coverage: Task 1 covers all新增 props、默认值、模板透传、类型声明和静态验证；明确不实现 `popupProps`、`mode`、`closeable` 透传。
- Placeholder scan: no unresolved placeholders or vague implementation steps remain.
- Type consistency: `safeAreaInsetBottom`、`safeAreaInsetTop`、`overlayOpacity`、`zIndex` and other names are identical across defaults, props, template bindings, type declarations and verification script.
- Baseline adjustment: full `npm run type-check` is documented as a known pre-existing repository failure after reproduction before implementation.
