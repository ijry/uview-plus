# Slider Decimal Step Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `u-slider` support decimal `step` values in the default custom implementation while documenting native-mode platform limits.

**Architecture:** Keep the public API unchanged and concentrate arithmetic changes inside `u-slider.vue`. Add a focused Node verification script that checks source contracts plus the decimal step rounding algorithm. Update the demo, plugin changelog, and adjacent docs site slider page.

**Tech Stack:** Vue SFC, uni-app, Node ESM verification script, Markdown docs.

## Global Constraints

- Commit messages must use Chinese.
- Commit messages must include both `head` and `body`.
- Decimal `step` support is guaranteed only for `useNative=false`.
- `useNative=true` continues to pass `step` to uni-app native `<slider>`.
- Invalid `step` values fall back to `1` and must not produce `NaN`.
- Do not modify unused legacy slider helper files: `mpwxs.wxs`, `mpwxs.js`, `mpother.js`, `nvue.js`.
- Ignore pre-existing untracked paths `.claude/` and `src/pages/componentsA/icon/icon.vue`.

---

### Task 1: Add Decimal Step Verification

**Files:**
- Create: `scripts/verify-slider-decimal-step.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: npm script `verify:slider-decimal-step`.
- Produces: verification command `npm run verify:slider-decimal-step`.
- Consumes: source files changed by later tasks.

- [ ] **Step 1: Create the failing verification script**

Create `scripts/verify-slider-decimal-step.mjs` with this content:

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const sliderVue = read('src/uni_modules/uview-plus/components/u-slider/u-slider.vue')
const sliderDemo = read('src/pages/componentsB/slider/slider.nvue')
const changelog = read('src/uni_modules/uview-plus/changelog.md')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:slider-decimal-step'],
    'node scripts/verify-slider-decimal-step.mjs',
    'expected package.json to expose verify:slider-decimal-step'
)

assert.doesNotMatch(
    sliderVue,
    /parseInt\(this\.step\)/,
    'u-slider format logic must not parse decimal step with parseInt'
)
assert.match(
    sliderVue,
    /import\s+\{\s*digitLength,\s*strip\s*\}\s+from\s+'..\/..\/libs\/function\/digit\.js'/,
    'expected u-slider to import decimal precision helpers'
)
for (const helper of ['toSliderNumber', 'getSliderStep', 'normalizeSliderValue', 'formatByStep']) {
    assert.match(sliderVue, new RegExp(`${helper}\\(`), `expected ${helper} helper in u-slider`)
}
assert.match(
    sliderVue,
    /Math\.round\(\(boundedValue\s*-\s*min\)\s*\/\s*step\)/,
    'expected step rounding to use min as the step base'
)

const digitLength = value => {
    const eSplit = Number(value).toString().split(/[eE]/)
    const len = (eSplit[0].split('.')[1] || '').length - +(eSplit[1] || 0)
    return len > 0 ? len : 0
}

const strip = (num, precision = 15) => +parseFloat(Number(num).toPrecision(precision))

const normalize = (...values) => {
    const value = values[0]
    const precision = Math.min(15, Math.max(...values.map(item => digitLength(item))))
    return Number(strip(value).toFixed(precision))
}

const formatByStep = ({ value, min = 0, max = 100, step = 1, lower = min, upper = max }) => {
    const safeStep = Number.isFinite(Number(step)) && Number(step) > 0 ? Number(step) : 1
    const safeMin = Number(min)
    const safeMax = Number(max)
    const safeLower = Math.min(Math.max(Number(lower), safeMin), safeMax)
    const safeUpper = Math.max(Math.min(Number(upper), safeMax), safeLower)
    const boundedValue = Math.max(safeLower, Math.min(Number(value), safeUpper))
    const steps = Math.round((boundedValue - safeMin) / safeStep)
    const formatted = normalize(safeMin + steps * safeStep, safeMin, safeMax, safeStep, boundedValue)
    return normalize(Math.max(safeLower, Math.min(formatted, safeUpper)), safeMin, safeMax, safeStep, boundedValue)
}

assert.equal(formatByStep({ value: 0.34, min: 0, max: 1, step: 0.1 }), 0.3)
assert.equal(formatByStep({ value: 0.36, min: 0, max: 1, step: '0.1' }), 0.4)
assert.equal(formatByStep({ value: 2.74, min: 1, max: 4, step: 0.5 }), 2.5)
assert.equal(formatByStep({ value: 0.16, min: 0.05, max: 0.35, step: 0.1 }), 0.15)
assert.equal(formatByStep({ value: 0.95, min: 0, max: 1, step: 0 }), 1)
assert.equal(formatByStep({ value: 0.92, min: 0, max: 1, step: 0.1, lower: 0, upper: 0.7 }), 0.7)
assert.equal(formatByStep({ value: 0.08, min: 0, max: 1, step: 0.1, lower: 0.3, upper: 1 }), 0.3)

assert.match(sliderDemo, /:step="0\.1"/, 'expected demo page to include a decimal step example')
assert.match(sliderDemo, /value3\s*=\s*ref\(0\.3\)/, 'expected demo decimal value to initialize at 0.3')
assert.match(changelog, /slider[\s\S]*小数步长|小数步长[\s\S]*slider/, 'expected changelog to mention slider decimal step')

console.log('slider decimal step assertions passed')
```

- [ ] **Step 2: Register the npm script**

Modify `package.json` scripts by adding this entry after `verify:i18n-on-demand`:

```json
"verify:slider-decimal-step": "node scripts/verify-slider-decimal-step.mjs"
```

Keep the previous script valid by adding a comma after `"verify:i18n-on-demand": "node scripts/verify-i18n-on-demand.mjs"`.

- [ ] **Step 3: Run the new verification and confirm the red phase**

Run: `npm run verify:slider-decimal-step`

Expected: FAIL with an assertion that `u-slider` still contains `parseInt(this.step)` or is missing decimal helper methods.

- [ ] **Step 4: Commit the verification**

```bash
git add package.json scripts/verify-slider-decimal-step.mjs
git commit -m "test: 增加 slider 小数步长校验" -m "新增针对 step 小数格式化、示例与 changelog 的静态校验，为后续组件修复建立可重复验证入口。"
```

### Task 2: Implement Decimal Step Formatting

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-slider/u-slider.vue`

**Interfaces:**
- Consumes: `digitLength(value)` and `strip(value)` from `src/uni_modules/uview-plus/libs/function/digit.js`.
- Produces: component methods `toSliderNumber(value, fallback)`, `getSliderStep()`, `normalizeSliderValue(value, ...refs)`, `formatByStep(value, lowerLimit, upperLimit)`.
- Produces: `format(value, index)` returning finite Number values for integer and decimal steps.

- [ ] **Step 1: Import decimal precision helpers**

Change the script imports near the top of `u-slider.vue` to include:

```js
import { digitLength, strip } from '../../libs/function/digit.js'
```

- [ ] **Step 2: Use numeric min/max when deriving raw values from pointer position**

In `onTouchStart`, `onTouchMove`, and `onClick`, replace each raw value calculation with the local numeric form:

```js
const min = this.toSliderNumber(this.min)
const max = this.toSliderNumber(this.max, 100)
this.newValue = ((this.distanceX / this.sliderRect.width) * (max - min)) + min
```

For vertical branches, use the same `min` and `max` with `this.distanceY / this.sliderRect.height`.

- [ ] **Step 3: Make `updateValue` use numeric bounds**

At the start of `updateValue(value, drag, index = 1)`, after `valueFormat` is calculated, normalize bounds:

```js
let valueFormat = this.format(value, index)
const min = this.toSliderNumber(this.min)
const max = this.toSliderNumber(this.max, 100)
const range = max - min
if (valueFormat > max) {
    valueFormat = max
}
if (valueFormat < min) {
    valueFormat = min
}
```

Then use `range` in slider length calculations:

```js
sliderLength = range === 0 ? 0 : Math.min((valueFormat - min) / range * this.sliderRect.width, this.sliderRect.width)
```

Use the same pattern for vertical height with `this.sliderRect.height`.

- [ ] **Step 4: Replace the old `format` implementation**

Replace the existing `format(value, index = 1)` method with these methods:

```js
toSliderNumber(value, fallback = 0) {
    const number = Number(value)
    return Number.isFinite(number) ? number : fallback
},
getSliderStep() {
    const step = this.toSliderNumber(this.step, 1)
    return step > 0 ? step : 1
},
normalizeSliderValue(value, ...refs) {
    const precision = Math.min(
        15,
        Math.max(
            digitLength(value),
            digitLength(this.toSliderNumber(this.min)),
            digitLength(this.toSliderNumber(this.max, 100)),
            digitLength(this.getSliderStep()),
            ...refs.map(item => digitLength(this.toSliderNumber(item)))
        )
    )
    return Number(strip(value).toFixed(precision))
},
formatByStep(value, lowerLimit, upperLimit) {
    const min = this.toSliderNumber(this.min)
    const max = this.toSliderNumber(this.max, 100)
    const step = this.getSliderStep()
    const lower = Math.min(Math.max(this.toSliderNumber(lowerLimit, min), min), max)
    const upper = Math.max(Math.min(this.toSliderNumber(upperLimit, max), max), lower)
    const boundedValue = Math.max(lower, Math.min(this.toSliderNumber(value, min), upper))
    const steps = Math.round((boundedValue - min) / step)
    const valueFormat = this.normalizeSliderValue(min + steps * step, boundedValue)
    return this.normalizeSliderValue(Math.max(lower, Math.min(valueFormat, upper)), boundedValue)
},
format(value, index = 1) {
    const min = this.toSliderNumber(this.min)
    const max = this.toSliderNumber(this.max, 100)
    const step = this.getSliderStep()

    if (this.isRange) {
        switch (index) {
            case 0:
                return this.formatByStep(
                    value,
                    min,
                    this.normalizeSliderValue(this.toSliderNumber(this.rangeValue[1], max) - step)
                )
            case 1:
                return this.formatByStep(
                    value,
                    this.normalizeSliderValue(this.toSliderNumber(this.rangeValue[0], min) + step),
                    max
                )
            default:
                return this.formatByStep(value, min, max)
        }
    }

    return this.formatByStep(value, min, max)
}
```

- [ ] **Step 5: Run focused verification and inspect failure scope**

Run: `npm run verify:slider-decimal-step`

Expected: still FAIL because the demo and changelog have not been updated yet. It must no longer fail on `parseInt(this.step)`, missing helpers, or decimal arithmetic checks.

- [ ] **Step 6: Commit the component implementation**

```bash
git add src/uni_modules/uview-plus/components/u-slider/u-slider.vue
git commit -m "fix: 支持 slider 小数步长格式化" -m "将自定义 slider 的步长格式化改为小数安全计算，支持普通、区间和垂直滑块使用数字或字符串形式的小数 step。"
```

### Task 3: Update Demo, Changelog, And Docs

**Files:**
- Modify: `src/pages/componentsB/slider/slider.nvue`
- Modify: `src/uni_modules/uview-plus/changelog.md`
- Modify: `D:/Repos/xyito/open/uview-plus-doc/docs/components/slider.md`

**Interfaces:**
- Consumes: decimal behavior from Task 2.
- Produces: documented example for `step="0.1"`.

- [ ] **Step 1: Add the demo decimal slider**

In `src/pages/componentsB/slider/slider.nvue`, add this block after the existing "指定步长(每次步进5)" block:

```vue
<view class="u-demo-block">
    <text class="u-demo-block__title">小数步长(每次步进0.1)</text>
    <view class="u-page__slide-item">
        <up-slider
            v-model="value3"
            :step="0.1"
            :min="0"
            :max="1"
            showValue
        ></up-slider>
    </view>
</view>
```

Change the setup value from:

```js
const value3 = ref(30)
```

to:

```js
const value3 = ref(0.3)
```

- [ ] **Step 2: Add plugin changelog entry**

At the top of `src/uni_modules/uview-plus/changelog.md`, add:

```md
## 3.8.85
fix: slider 支持自定义模式小数步长

- 自定义 slider 的 `step` 支持 `0.1`、`0.5` 等小数和字符串数字，避免旧逻辑将小数步长格式化为 `NaN`
- 普通滑块、区间双滑块和垂直滑块统一按 `min + n * step` 对齐步进值
- `useNative=true` 仍透传给 uni-app 原生 slider，具体小数表现取决于目标平台

```

- [ ] **Step 3: Update docs site slider guide**

In `D:/Repos/xyito/open/uview-plus-doc/docs/components/slider.md`, replace the step tip with:

```md
:::tip 提示
需要注意的是，建议让`(max - min)`能被`step`整除，否则可能出现无法滑动到最大值的情况。默认自定义模式支持`0.1`、`0.5`等小数步长；`useNative=true`时会透传给uni-app原生slider，具体小数表现取决于目标平台。
:::
```

Then add this example after the existing integer step example:

```md
小数步长也可以使用数字或字符串数字：

```html
<up-slider v-model="value" :step="0.1" :min="0" :max="1" showValue></up-slider>
```
```

- [ ] **Step 4: Run focused verification**

Run: `npm run verify:slider-decimal-step`

Expected: PASS with `slider decimal step assertions passed`.

- [ ] **Step 5: Commit demo and docs**

For the code repo:

```bash
git add src/pages/componentsB/slider/slider.nvue src/uni_modules/uview-plus/changelog.md
git commit -m "docs: 补充 slider 小数步长示例" -m "在示例页和插件 changelog 中说明自定义 slider 支持小数 step，并标注原生模式的平台差异。"
```

For the docs repo:

```bash
cd D:/Repos/xyito/open/uview-plus-doc
git add docs/components/slider.md
git commit -m "docs: 更新 slider 小数步长说明" -m "补充小数 step 示例，明确建议按区间范围整除并说明 useNative 原生模式由平台决定。"
```

### Task 4: Final Verification

**Files:**
- Read: `package.json`
- Read: `src/uni_modules/uview-plus/components/u-slider/u-slider.vue`
- Read: `src/pages/componentsB/slider/slider.nvue`
- Read: `src/uni_modules/uview-plus/changelog.md`
- Read: `D:/Repos/xyito/open/uview-plus-doc/docs/components/slider.md`

**Interfaces:**
- Consumes: all previous tasks.
- Produces: final confidence report.

- [ ] **Step 1: Run the focused verifier**

Run: `npm run verify:slider-decimal-step`

Expected: PASS with `slider decimal step assertions passed`.

- [ ] **Step 2: Run type check**

Run: `npm run type-check`

Expected: PASS. If it fails from pre-existing unrelated type errors, capture the first unrelated file path and keep the focused verifier result as the binding regression check.

- [ ] **Step 3: Inspect final worktree scope**

Run in `D:/Repos/xyito/open/uview-plus`:

```bash
git status --short
git diff --stat HEAD
```

Expected: only pre-existing untracked paths remain in the code repo.

Run in `D:/Repos/xyito/open/uview-plus-doc`:

```bash
git status --short
```

Expected: docs repo is clean after its docs commit.

- [ ] **Step 4: Summarize behavior**

Report these concrete outcomes:

```text
Default custom slider now supports decimal step values.
Native mode still delegates decimal behavior to uni-app native slider.
Focused verification command: npm run verify:slider-decimal-step.
Type-check result: PASS or the captured unrelated failure.
```

## Self-Review

- Spec coverage: component decimal formatting, demo, docs, changelog, native-mode boundary, invalid step fallback, and verification are covered.
- Placeholder scan: no unresolved placeholder terms remain.
- Type consistency: helper method names used in verification match the component implementation task.
