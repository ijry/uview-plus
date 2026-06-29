# Props Lazy Loading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make component `props.js` files load only their own default props while preserving `setConfig({ props })` and `uni.$u.props` compatibility.

**Architecture:** Replace the all-components props aggregator with a lazy runtime store. Each component `props.js` imports its own default props module and registers it through `registerComponentProps`; global overrides are merged through `setPropsConfig` and always win over default values.

**Tech Stack:** uni-app, Vue SFC, plain ES modules, Node `.mjs` verification scripts, PowerShell commands.

## Global Constraints

- Do not change H5 `import.meta.glob('./components/u-*/u-*.vue', { eager: true })` behavior.
- Do not change public component prop names, default value semantics, or TypeScript component declarations.
- Preserve `setConfig({ props })` global override behavior.
- Preserve `uni.$u.props.xxx` runtime access and direct assignment compatibility.
- `git commit` messages must be Chinese and include both head and body.
- Keep edits ASCII unless the touched file already uses non-ASCII text.

---

## File Structure

- Modify `src/uni_modules/uview-plus/libs/config/props.js`
  - Responsibility: shared props store, top-level key initialization, `registerComponentProps(defaultProps)`, `setPropsConfig(configProps)`, `mergeDefaults(target, defaults)`.
- Modify `src/uni_modules/uview-plus/index.js`
  - Responsibility: plugin-level `setConfig` uses `setPropsConfig`; `$u` exposes `props`.
- Modify `src/uni_modules/uview-plus/components/u-*/props.js`
  - Responsibility: import local default props and call `registerComponentProps`; components with no default config call `registerComponentProps({ componentKey: {} })`.
- Modify `scripts/verify-guide-contract.mjs`
  - Responsibility: update the guide contract to assert lazy registration instead of full aggregator import.
- Create `scripts/verify-props-lazy-loading.mjs`
  - Responsibility: static and behavioral regression checks for lazy props loading.
- Optional create `scripts/migrate-props-lazy-loading.mjs`
  - Responsibility: one-shot repeatable migration for component `props.js` imports. Delete it before final commit if it is only used as a temporary migration helper.

---

### Task 1: Add Failing Props Lazy-Loading Verification

**Files:**
- Create: `scripts/verify-props-lazy-loading.mjs`
- Modify: `scripts/verify-guide-contract.mjs`

**Interfaces:**
- Consumes: current source layout under `src/uni_modules/uview-plus`.
- Produces: `node scripts/verify-props-lazy-loading.mjs`, a command later tasks must make pass.

- [ ] **Step 1: Create the failing verification script**

Create `scripts/verify-props-lazy-loading.mjs` with this content:

```js
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const uviewRoot = path.join(repoRoot, 'src/uni_modules/uview-plus')
const propsConfigPath = path.join(uviewRoot, 'libs/config/props.js')
const componentsRoot = path.join(uviewRoot, 'components')

function read(filePath) {
    return fs.readFileSync(filePath, 'utf8')
}

function assertNotContains(content, matcher, message) {
    assert.doesNotMatch(content, matcher, message)
}

function assertContains(content, matcher, message) {
    assert.match(content, matcher, message)
}

function listComponentPropsFiles() {
    return fs.readdirSync(componentsRoot)
        .map((dirName) => path.join(componentsRoot, dirName, 'props.js'))
        .filter((propsPath) => fs.existsSync(propsPath))
        .sort()
}

function toComponentKey(dirName) {
    return dirName
        .replace(/^u-/, '')
        .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase())
}

function findDefaultConfigFile(componentDir) {
    const files = fs.readdirSync(componentDir)
        .filter((fileName) => fileName.endsWith('.js') && fileName !== 'props.js')
        .sort()

    const candidates = []
    for (const fileName of files) {
        const filePath = path.join(componentDir, fileName)
        const content = read(filePath)
        const match = content.match(/export\s+default\s*{\s*(?:\/\*[\s\S]*?\*\/\s*)?(?:\/\/[^\n]*\n\s*)?([A-Za-z_$][\w$]*)\s*:/)
        if (!match) continue
        const key = match[1]
        if (['methods', 'computed', 'watch', 'fade', 'params'].includes(key)) continue
        candidates.push({ fileName, key })
    }

    assert.ok(
        candidates.length <= 1,
        `expected at most one default props module in ${componentDir}, got ${candidates.map((item) => item.fileName).join(', ')}`
    )
    return candidates[0] || null
}

function transformPropsConfigSource(source) {
    return source
        .replace(/import\s+config\s+from\s+['"]\.\/config(?:\.js)?['"];?\n?/, 'const config = globalThis.__propsTestConfig\n')
        .replace(/import\s+zIndex\s+from\s+['"]\.\/zIndex(?:\.js)?['"];?\n?/, 'const zIndex = globalThis.__propsTestZIndex\n')
        .replace(/import\s+color\s+from\s+['"]\.\/color(?:\.js)?['"];?\n?/, 'const color = globalThis.__propsTestColor\n')
        .replace(/import\s+http\s+from\s+['"]\.\.\/function\/http(?:\.js)?['"];?\n?/, 'const http = globalThis.__propsTestHttp\n')
        .replace(/import\s+{\s*shallowMerge\s*}\s+from\s+['"]\.\.\/function\/index(?:\.js)?['"];?\n?/, 'const { shallowMerge } = globalThis.__propsTestFns\n')
}

async function importPropsConfigInSandbox() {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'uview-props-lazy-'))
    const modulePath = path.join(tempDir, 'props.mjs')
    globalThis.__propsTestConfig = {}
    globalThis.__propsTestZIndex = {}
    globalThis.__propsTestColor = {}
    globalThis.__propsTestHttp = {}
    function shallowMerge(target, source = {}) {
        if (!source || typeof target !== 'object' || typeof source !== 'object') return target
        for (const key of Object.keys(source)) {
            if (
                target[key]
                && source[key]
                && typeof target[key] === 'object'
                && typeof source[key] === 'object'
                && !Array.isArray(target[key])
                && !Array.isArray(source[key])
            ) {
                shallowMerge(target[key], source[key])
            } else {
                target[key] = source[key]
            }
        }
        return target
    }
    globalThis.__propsTestFns = {
        shallowMerge
    }
    fs.writeFileSync(modulePath, transformPropsConfigSource(read(propsConfigPath)), 'utf8')
    return import(`${pathToFileURL(modulePath).href}?t=${Date.now()}`)
}

function runStaticAssertions() {
    const propsConfig = read(propsConfigPath)
    assertNotContains(
        propsConfig,
        /from\s+['"]\.\.\/\.\.\/components\//,
        'libs/config/props.js must not statically import component defaults'
    )
    assertContains(
        propsConfig,
        /export\s+function\s+registerComponentProps\s*\(/,
        'expected registerComponentProps export'
    )
    assertContains(
        propsConfig,
        /export\s+function\s+setPropsConfig\s*\(/,
        'expected setPropsConfig export'
    )

    for (const propsPath of listComponentPropsFiles()) {
        const content = read(propsPath)
        const relativePath = path.relative(repoRoot, propsPath)
        assertNotContains(
            content,
            /import\s+defProps\s+from\s+['"]\.\.\/\.\.\/libs\/config\/props(?:\.js)?['"]/,
            `${relativePath} must not default-import full props config`
        )
        const usesDefProps = /defProps\./.test(content)
        const usesLazyRegistration = /registerComponentProps\s*\(/.test(content)
        if (usesDefProps || usesLazyRegistration) {
            assertContains(
                content,
                /registerComponentProps\s*\(/,
                `${relativePath} must register local props defaults`
            )
        }

        const defaultConfig = findDefaultConfigFile(path.dirname(propsPath))
        if (usesLazyRegistration && defaultConfig) {
            assertContains(
                content,
                new RegExp(`from\\s+['"]\\./${defaultConfig.fileName.replace(/\.js$/, '')}(?:\\.js)?['"]`),
                `${relativePath} must import local default module ${defaultConfig.fileName}`
            )
        }
    }
}

async function runBehaviorAssertions() {
    const module = await importPropsConfigInSandbox()
    const {
        default: props,
        registerComponentProps,
        setPropsConfig
    } = module

    assert.ok(props.button, 'expected button top-level key to exist before registration')
    assert.ok(props.gap, 'expected gap top-level key to exist before registration')

    setPropsConfig({
        button: {
            type: 'primary',
            nested: {
                keep: 'user'
            }
        }
    })
    const beforeRegisterButtonRef = props.button
    const registered = registerComponentProps({
        button: {
            type: 'info',
            size: 'normal',
            nested: {
                keep: 'default',
                fill: 'default'
            }
        }
    })

    assert.equal(registered, props, 'registerComponentProps should return shared props store')
    assert.equal(props.button, beforeRegisterButtonRef, 'registerComponentProps must keep component object reference')
    assert.equal(props.button.type, 'primary', 'user override before registration must win')
    assert.equal(props.button.size, 'normal', 'missing default field should be filled')
    assert.deepEqual(
        props.button.nested,
        { keep: 'user', fill: 'default' },
        'nested defaults should fill missing fields without replacing user fields'
    )

    setPropsConfig({
        button: {
            type: 'success'
        }
    })
    assert.equal(props.button.type, 'success', 'setPropsConfig after registration must override default')

    props.gap.bgColor = '#f3f4f6'
    assert.equal(props.gap.bgColor, '#f3f4f6', 'direct uni.$u.props-style assignment should work')

    registerComponentProps({
        box: {
            customStyle: {},
            size: 'default'
        }
    })
    assert.deepEqual(
        props.box,
        { customStyle: {}, size: 'default' },
        'local defaults not present in old aggregator, such as box, should register'
    )
}

try {
    runStaticAssertions()
    await runBehaviorAssertions()
    console.log('props lazy-loading assertions passed')
} catch (error) {
    console.error(error.message)
    process.exit(1)
}
```

- [ ] **Step 2: Run the new verification to confirm it fails**

Run:

```powershell
node scripts\verify-props-lazy-loading.mjs
```

Expected: FAIL with `libs/config/props.js must not statically import component defaults`.

- [ ] **Step 3: Update guide contract expectations**

In `scripts/verify-guide-contract.mjs`, replace the old props aggregator assertions:

```js
    const propsAggregator = read('src/uni_modules/uview-plus/libs/config/props.js')
    assertContains(propsAggregator, /import Guide from ['"]\.\.\/\.\.\/components\/u-guide\/guide['"]/, 'expected props aggregator to import Guide defaults')
    assertContains(propsAggregator, /\.\.\.Guide,/, 'expected props aggregator to merge Guide defaults')
```

with lazy-registration assertions:

```js
    assertContains(guideProps, /import GuideDefaultProps from ['"]\.\/guide(?:\.js)?['"]/, 'expected guide props to import local defaults')
    assertContains(guideProps, /registerComponentProps\(GuideDefaultProps\)/, 'expected guide props to register local defaults')

    const propsConfig = read('src/uni_modules/uview-plus/libs/config/props.js')
    assertContains(propsConfig, /registerComponentProps/, 'expected lazy props registration API')
    assertContains(propsConfig, /setPropsConfig/, 'expected lazy props config API')
```

- [ ] **Step 4: Run the guide verification to confirm the new expectation fails**

Run:

```powershell
node scripts\verify-guide-contract.mjs
```

Expected: FAIL with `expected guide props to import local defaults`.

- [ ] **Step 5: Commit failing verification**

Run:

```powershell
git add scripts\verify-props-lazy-loading.mjs scripts\verify-guide-contract.mjs
git commit -m "增加 props 按需加载验证" -m "目的：先用静态和行为断言固定 props 按需加载改造目标。`n范围：新增 props lazy-loading 验证脚本，并更新 guide 契约对懒注册的预期。`n影响：当前源码尚未改造，新增验证预期会失败。"
```

Expected: commit succeeds.

---

### Task 2: Replace Full Props Aggregator With Lazy Store

**Files:**
- Modify: `src/uni_modules/uview-plus/libs/config/props.js`
- Test: `scripts/verify-props-lazy-loading.mjs`

**Interfaces:**
- Produces: `registerComponentProps(defaultProps: object): object`
- Produces: `setPropsConfig(configProps: object): object`
- Produces: default export `props: object`
- Consumes: existing `shallowMerge(target, source)` from `src/uni_modules/uview-plus/libs/function/index.js`

- [ ] **Step 1: Replace the full aggregator implementation**

Replace the content of `src/uni_modules/uview-plus/libs/config/props.js` with:

```js
/**
 * Shared props configuration store.
 *
 * Component defaults are registered lazily by each component props.js file so
 * importing one component no longer pulls defaults for every component.
 */
import config from './config'
import zIndex from './zIndex.js'
import color from './color.js'
import http from '../function/http.js'
import { shallowMerge } from '../function/index.js'

const componentKeys = [
    'actionSheet',
    'album',
    'alert',
    'avatar',
    'avatarGroup',
    'backtop',
    'badge',
    'box',
    'button',
    'calendar',
    'calendarStrip',
    'carKeyboard',
    'card',
    'cell',
    'cellGroup',
    'checkbox',
    'checkboxGroup',
    'circleProgress',
    'code',
    'codeInput',
    'col',
    'collapse',
    'collapseItem',
    'columnNotice',
    'countDown',
    'countTo',
    'datetimePicker',
    'divider',
    'dropdown',
    'dropdownItem',
    'empty',
    'form',
    'formItem',
    'gap',
    'grid',
    'gridItem',
    'guide',
    'icon',
    'image',
    'indexAnchor',
    'indexItem',
    'indexList',
    'input',
    'keyboard',
    'line',
    'lineProgress',
    'link',
    'list',
    'listItem',
    'loadingIcon',
    'loadingPage',
    'loadmore',
    'modal',
    'navbar',
    'navbarMini',
    'noNetwork',
    'noticeBar',
    'notify',
    'numberBox',
    'numberKeyboard',
    'overlay',
    'parse',
    'pdfReader',
    'picker',
    'pickerColumn',
    'popover',
    'popup',
    'radio',
    'radioGroup',
    'rate',
    'readMore',
    'row',
    'rowNotice',
    'safeBottom',
    'scrollList',
    'search',
    'section',
    'skeleton',
    'slider',
    'statusBar',
    'steps',
    'stepsItem',
    'sticky',
    'subsection',
    'swipeAction',
    'swipeActionItem',
    'swiper',
    'swiperIndicator',
    'switch',
    'tabbar',
    'tabbarItem',
    'table',
    'tabs',
    'tabsItem',
    'tag',
    'td',
    'text',
    'textarea',
    'th',
    'toast',
    'toolbar',
    'tooltip',
    'tr',
    'transition',
    'upload'
]

const props = {}

function ensureComponentProps(key) {
    if (!props[key] || typeof props[key] !== 'object') {
        props[key] = {}
    }
    return props[key]
}

function isPlainObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]'
}

function cloneDefaultValue(value) {
    if (Array.isArray(value)) {
        return value.slice()
    }
    if (isPlainObject(value)) {
        return mergeDefaults({}, value)
    }
    return value
}

function mergeDefaults(target, defaults = {}) {
    if (!target || typeof target !== 'object' || !defaults || typeof defaults !== 'object') {
        return target
    }
    Object.keys(defaults).forEach((key) => {
        const defaultValue = defaults[key]
        const targetValue = target[key]
        if (targetValue === undefined) {
            target[key] = cloneDefaultValue(defaultValue)
        } else if (isPlainObject(targetValue) && isPlainObject(defaultValue)) {
            mergeDefaults(targetValue, defaultValue)
        }
    })
    return target
}

componentKeys.forEach(ensureComponentProps)

export function registerComponentProps(defaultProps = {}) {
    Object.keys(defaultProps || {}).forEach((key) => {
        const componentProps = ensureComponentProps(key)
        mergeDefaults(componentProps, defaultProps[key])
    })
    return props
}

export function setPropsConfig(configProps = {}) {
    Object.keys(configProps || {}).forEach((key) => {
        shallowMerge(ensureComponentProps(key), configProps[key])
    })
    return props
}

function setConfig(configs = {}) {
    shallowMerge(config, configs.config || {})
    setPropsConfig(configs.props || {})
    shallowMerge(color, configs.color || {})
    shallowMerge(zIndex, configs.zIndex || {})
}

if (typeof uni !== 'undefined' && uni && uni.upuiParams) {
    console.log('setting uview-plus')
    let temp = uni.upuiParams()
    if (temp.httpIns) {
        temp.httpIns(http)
    }
    if (temp.options) {
        setConfig(temp.options)
    }
}

export default props
```

- [ ] **Step 2: Run verification to confirm partial progress**

Run:

```powershell
node scripts\verify-props-lazy-loading.mjs
```

Expected: FAIL on a component `props.js` still default-importing full props config.

- [ ] **Step 3: Commit lazy store**

Run:

```powershell
git add src\uni_modules\uview-plus\libs\config\props.js
git commit -m "改造 props 配置为懒加载存储" -m "目的：移除 props 聚合文件对所有组件默认配置的静态导入。`n范围：新增 registerComponentProps、setPropsConfig 和默认值补齐逻辑，保留 uni.upuiParams 初始化兼容。`n影响：组件 props 文件尚未批量接入，验证仍需后续任务完成。"
```

Expected: commit succeeds.

---

### Task 3: Migrate Component Props Files To Local Registration

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-*/props.js`
- Optional create/delete: `scripts/migrate-props-lazy-loading.mjs`
- Test: `scripts/verify-props-lazy-loading.mjs`
- Test: `scripts/verify-guide-contract.mjs`

**Interfaces:**
- Consumes: `registerComponentProps(defaultProps)` from Task 2.
- Produces: every component `props.js` calls `registerComponentProps(...)` and no longer default-imports `../../libs/config/props.js`.

- [ ] **Step 1: Create a temporary migration helper**

Create `scripts/migrate-props-lazy-loading.mjs` with:

```js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const componentsRoot = path.join(repoRoot, 'src/uni_modules/uview-plus/components')

function read(filePath) {
    return fs.readFileSync(filePath, 'utf8')
}

function write(filePath, content) {
    fs.writeFileSync(filePath, content, 'utf8')
}

function toPascalCase(componentName) {
    return componentName
        .replace(/^u-/, '')
        .split('-')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')
}

function toComponentKey(componentName) {
    return componentName
        .replace(/^u-/, '')
        .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase())
}

function findDefaultConfig(componentDir) {
    const candidates = []
    const fileNames = fs.readdirSync(componentDir)
        .filter((fileName) => fileName.endsWith('.js') && fileName !== 'props.js')
        .sort()

    for (const fileName of fileNames) {
        const filePath = path.join(componentDir, fileName)
        const content = read(filePath)
        const match = content.match(/export\s+default\s*{\s*(?:\/\*[\s\S]*?\*\/\s*)?(?:\/\/[^\n]*\n\s*)?([A-Za-z_$][\w$]*)\s*:/)
        if (!match) continue
        const key = match[1]
        if (['methods', 'computed', 'watch', 'fade', 'params'].includes(key)) continue
        candidates.push({
            fileName,
            importPath: `./${fileName.replace(/\.js$/, '')}`,
            key
        })
    }

    if (candidates.length > 1) {
        throw new Error(`Multiple default config candidates in ${componentDir}: ${candidates.map((item) => item.fileName).join(', ')}`)
    }
    return candidates[0] || null
}

for (const componentName of fs.readdirSync(componentsRoot).sort()) {
    const componentDir = path.join(componentsRoot, componentName)
    if (!fs.statSync(componentDir).isDirectory()) continue

    const propsPath = path.join(componentDir, 'props.js')
    if (!fs.existsSync(propsPath)) continue

    let content = read(propsPath)
    if (
        !content.includes("import defProps from '../../libs/config/props.js'")
        && !content.includes("import defProps from '../../libs/config/props'")
    ) {
        continue
    }

    const defaultConfig = findDefaultConfig(componentDir)
    const importName = `${toPascalCase(componentName)}DefaultProps`
    const fallbackKey = toComponentKey(componentName)

    const replacement = defaultConfig
        ? `import ${importName} from '${defaultConfig.importPath}'\nimport { registerComponentProps } from '../../libs/config/props.js'\n\nconst defProps = registerComponentProps(${importName})`
        : `import { registerComponentProps } from '../../libs/config/props.js'\n\nconst defProps = registerComponentProps({ ${fallbackKey}: {} })`

    content = content.replace(
        /import defProps from ['"]\.\.\/\.\.\/libs\/config\/props(?:\.js)?['"]\r?\n?/,
        replacement
    )

    write(propsPath, content)
    console.log(`migrated ${path.relative(repoRoot, propsPath)}${defaultConfig ? ` -> ${defaultConfig.fileName}` : ' -> empty defaults'}`)
}
```

- [ ] **Step 2: Run the migration helper**

Run:

```powershell
node scripts\migrate-props-lazy-loading.mjs
```

Expected: output lists migrated component `props.js` files and no error about multiple default config candidates.

- [ ] **Step 3: Inspect representative migrated files**

Run:

```powershell
Get-Content -LiteralPath src\uni_modules\uview-plus\components\u-button\props.js -TotalCount 12
Get-Content -LiteralPath src\uni_modules\uview-plus\components\u-guide\props.js -TotalCount 12
Get-Content -LiteralPath src\uni_modules\uview-plus\components\u-dropdown\props.js -TotalCount 12
Get-Content -LiteralPath src\uni_modules\uview-plus\components\u-box\props.js -TotalCount 12
```

Expected `u-button/props.js` starts with:

```js
import { defineMixin } from '../../libs/vue'
import ButtonDefaultProps from './button'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps(ButtonDefaultProps)
```

Expected `u-guide/props.js` starts with:

```js
import { defineMixin } from '../../libs/vue'
import GuideDefaultProps from './guide'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps(GuideDefaultProps)
```

Expected `u-dropdown/props.js` starts with:

```js
import { defineMixin } from '../../libs/vue'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps({ dropdown: {} })
```

Expected `u-box/props.js` starts with:

```js
import { defineMixin } from '../../libs/vue'
import BoxDefaultProps from './box'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps(BoxDefaultProps)
```

- [ ] **Step 4: Run lazy-loading and guide verification**

Run:

```powershell
node scripts\verify-props-lazy-loading.mjs
node scripts\verify-guide-contract.mjs
```

Expected: both commands PASS with:

```text
props lazy-loading assertions passed
guide contract assertions passed
```

- [ ] **Step 5: Remove temporary migration helper**

Run:

```powershell
Remove-Item -LiteralPath scripts\migrate-props-lazy-loading.mjs
```

Expected: file is removed. This helper is not part of the runtime feature.

- [ ] **Step 6: Commit component migration**

Run:

```powershell
git add src\uni_modules\uview-plus\components scripts\verify-guide-contract.mjs scripts\verify-props-lazy-loading.mjs
git commit -m "接入组件 props 本地默认值注册" -m "目的：让单个组件 props 只加载自身默认配置。`n范围：批量改造组件 props.js 使用 registerComponentProps，并同步 guide 契约和 lazy-loading 验证。`n影响：组件默认值读取路径改变，但 setConfig 覆盖语义保持不变。"
```

Expected: commit succeeds.

---

### Task 4: Wire Plugin Entry SetConfig To Lazy Props Store

**Files:**
- Modify: `src/uni_modules/uview-plus/index.js`
- Test: `scripts/verify-props-lazy-loading.mjs`
- Test: `scripts/verify-guide-contract.mjs`
- Test: `package.json` script `type-check`

**Interfaces:**
- Consumes: `setPropsConfig(configProps)` from Task 2.
- Produces: plugin `setConfig(configs)` delegates props overrides to `setPropsConfig`.
- Produces: `$u.props` references the shared lazy `props` object.

- [ ] **Step 1: Update the props config import**

In `src/uni_modules/uview-plus/index.js`, change:

```js
import props from './libs/config/props.js'
```

to:

```js
import props, { setPropsConfig } from './libs/config/props.js'
```

- [ ] **Step 2: Update plugin-level setConfig**

In `src/uni_modules/uview-plus/index.js`, change:

```js
	index.shallowMerge(props, settings.props || {})
```

to:

```js
	setPropsConfig(settings.props || {})
```

- [ ] **Step 3: Expose props on $u**

In the `$u` object inside `src/uni_modules/uview-plus/index.js`, replace:

```js
    // props,
```

with:

```js
    props,
```

- [ ] **Step 4: Extend verification for entry wiring**

In `scripts/verify-props-lazy-loading.mjs`, add these assertions inside `runStaticAssertions()` after reading `propsConfig`:

```js
    const entry = read(path.join(uviewRoot, 'index.js'))
    assertContains(
        entry,
        /import\s+props,\s*{\s*setPropsConfig\s*}\s+from\s+['"]\.\/libs\/config\/props\.js['"]/,
        'index.js must import setPropsConfig with props'
    )
    assertContains(
        entry,
        /setPropsConfig\(settings\.props\s*\|\|\s*{}\)/,
        'index.js setConfig must delegate props overrides to setPropsConfig'
    )
    assertContains(
        entry,
        /\n\s*props,\s*\n\s*\.\.\.index,/,
        '$u must expose props before spreading index helpers'
    )
```

- [ ] **Step 5: Run verification**

Run:

```powershell
node scripts\verify-props-lazy-loading.mjs
node scripts\verify-guide-contract.mjs
npm run type-check
```

Expected:

```text
props lazy-loading assertions passed
guide contract assertions passed
```

Expected `npm run type-check`: PASS. If it fails on unrelated pre-existing TypeScript errors, record the first unrelated error in the task notes before committing.

- [ ] **Step 6: Commit entry wiring**

Run:

```powershell
git add src\uni_modules\uview-plus\index.js scripts\verify-props-lazy-loading.mjs
git commit -m "接入入口 props 懒加载配置" -m "目的：让插件入口的 setConfig 使用懒 props store，并恢复 uni.$u.props 暴露。`n范围：调整 index.js 的 props 导入、setConfig 合并路径和 $u 对象字段，补充入口静态验证。`n影响：全局 props 覆盖继续生效，组件默认 props 不再因入口配置聚合而全量加载。"
```

Expected: commit succeeds.

---

### Task 5: Final Regression And Cleanup

**Files:**
- Modify if needed: `scripts/verify-props-lazy-loading.mjs`
- Modify if needed: `scripts/verify-guide-contract.mjs`
- No runtime source changes unless verification exposes a defect.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: clean final verification state.

- [ ] **Step 1: Run full relevant verification suite**

Run:

```powershell
node scripts\verify-props-lazy-loading.mjs
node scripts\verify-guide-contract.mjs
node scripts\verify-theme-runtime-bridge.mjs
node scripts\verify-navbar-theme-runtime.mjs
node scripts\verify-legacy-theme-bridge.mjs
npm run type-check
```

Expected:

```text
props lazy-loading assertions passed
guide contract assertions passed
runtime theme bridge assertions passed
```

Expected for the remaining scripts: PASS. Node may print `[MODULE_TYPELESS_PACKAGE_JSON]` warnings; warnings alone are acceptable.

- [ ] **Step 2: Confirm no full props imports remain**

Run:

```powershell
rg -n "import defProps from '../../libs/config/props|from ['\"]\\.\\.\\/\\.\\.\\/components\\/" src\uni_modules\uview-plus\libs\config\props.js src\uni_modules\uview-plus\components -g props.js
```

Expected: no output.

- [ ] **Step 3: Review worktree**

Run:

```powershell
git status --short
git diff --stat
```

Expected: only intended tracked changes are present. Pre-existing untracked `.claude/` may still appear and must not be added.

- [ ] **Step 4: Commit any cleanup changes**

If Step 1 or Step 2 required small cleanup edits, run:

```powershell
git add scripts src\uni_modules\uview-plus
git commit -m "完善 props 按需加载验证收尾" -m "目的：清理 props 按需加载改造后的验证细节。`n范围：仅包含验证脚本或缺陷修正，不引入新的架构变化。`n影响：保持懒加载行为和现有 API 兼容。"
```

If no cleanup changes exist, do not create an empty commit.
