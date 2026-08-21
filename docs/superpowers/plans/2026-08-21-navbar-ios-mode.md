# Navbar iOS 大标题模式 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `u-navbar` 新增 `mode="ios"`，提供初始透明背景 + 左对齐大标题、下滑压缩后居中标题 + 磨砂背景的现代 iOS 导航栏体验，`default` 模式行为零回退。

**Architecture:** 大标题渲染在 in-flow 层，靠页面原生滚动位移，不经过 JS；使用方通过 `onPageScroll` 把 `scrollTop` 传入组件，仅用于驱动"玻璃层不透明度"与"居中标题不透明度"两个纯 opacity 值。玻璃层是固定层内一个独立的绝对定位元素，采用 0.82 不透明底色叠加 `backdrop-filter`，使模糊不生效的端仍保证文字可读。两条透明度曲线分段递进（0→0.5 与 0.75→1），确保任何滚动位置都不出现两段标题文字互相透出。

**Tech Stack:** Vue 3 Options API SFC、uni-app 条件编译、SCSS、CSS 自定义属性、Node.js 静态契约验证、VuePress Markdown 文档。

## Global Constraints

- 设计依据：`docs/superpowers/specs/2026-08-21-navbar-ios-mode-design.md`（commit `8f440efd8`）。
- `mode` 默认 `'default'`，除 `'ios'` 外的任何值（含非法字符串）一律按 `default` 处理，不抛错、不产生中间形态。
- `default` 模式的 DOM 结构、样式、属性语义零回退；既有 `__placeholder` 无条件加状态栏高度的写法保持原样不改。
- `ios` 模式下 `fixed` 与 `placeholder` 被忽略：固定层恒定固定，in-flow 层恒定渲染。
- 大标题行高常量 `LARGE_TITLE_HEIGHT = 52`；有效行高 `L = title ? LARGE_TITLE_HEIGHT : 0`。
- 进度公式：`progress = L > 0 ? clamp(getPx(scrollTop) / L, 0, 1) : 1`。
- 两条曲线：`glassOpacity = clamp(progress / 0.5, 0, 1)`、`centerOpacity = clamp((progress - 0.75) / 0.25, 0, 1)`。
- 玻璃底色明暗默认值：亮色 `rgba(255, 255, 255, 0.82)`、暗色 `rgba(28, 28, 30, 0.82)`；0.82 是可读性下限的承重值，不得降低。
- 模糊半径默认 `20px`，通过 `--up-navbar-glass-blur` 注入静态 class，必须保留 `-webkit-` 前缀。
- `ios` 模式下 `__inner` 必须 `background: transparent`，否则 `backdrop-filter` 采样自身底色。
- `__content` 必须显式 `position: relative; z-index: 1`，否则被绝对定位的玻璃层遮盖，表现为导航栏内容整体不可见。
- nvue 通过 `#ifdef APP-NVUE` 整体降级为 `default`；注意该 flag 在 `app-harmony` 上为 false，harmony 应获得完整 `ios` 模式。
- 大标题左内边距 13px，与现有 `__content__left` 的 `padding: 0 13px` 对齐。
- **行尾约定**：`src/uni_modules/uview-plus/components/u-navbar/props.js` 与 `src/pages/componentsC/navbar/navbar.nvue` 是 **CRLF** 文件，必须用 Python 脚本以 `newline=''` 读写打补丁，禁止用 Edit 工具直接改（会把整个文件行尾压平、污染 diff）。其余待改文件均为 LF，可正常编辑。
- Git commit 信息必须使用中文，包含 head + body 两部分。
- 不发版、不打 tag、不 push。

## File Map

| File | Responsibility |
| :- | :- |
| `scripts/verify-navbar-ios-mode.mjs` | 守护属性注册、进度公式、两条曲线、nvue 降级、玻璃层结构、主题变量、示例、changelog、脚本注册 |
| `package.json` | 暴露 `verify:navbar-ios-mode` 命令 |
| `src/uni_modules/uview-plus/components/u-navbar/navbar.js` | `mode` / `scrollTop` 默认值（LF） |
| `src/uni_modules/uview-plus/components/u-navbar/props.js` | `mode` / `scrollTop` 属性定义（**CRLF**） |
| `src/uni_modules/uview-plus/components/u-navbar/u-navbar.vue` | 结构分流、进度计算、玻璃层、样式（LF） |
| `src/uni_modules/uview-plus/components/u-navbar/theme-vars.scss` | 玻璃变量明暗默认值（LF） |
| `src/uni_modules/uview-plus/libs/theme/runtime.js` | 玻璃变量接入 `FALLBACK_THEME_VARS`（LF） |
| `src/uni_modules/uview-plus/libs/theme/theme.js` | 玻璃变量接入 `DEFAULT_THEME_EXTRA_VARS`（LF） |
| `src/uni_modules/uview-plus/types/comps/navbar.d.ts` | `mode` / `scrollTop` 类型（LF） |
| `src/pages/componentsC/navbarIos/navbarIos.vue` | `ios` 模式示例页（新建，LF） |
| `src/pages.json` | 注册示例页，`navigationStyle: custom`（LF） |
| `src/pages/componentsC/navbar/navbar.nvue` | 增加跳转入口（**CRLF**） |
| `src/uni_modules/uview-plus/changelog.md` | 3.8.112 记录（LF） |
| `../uview-plus-doc/docs/components/navbar.md` | 属性表、`ios` 章节、平台差异 |

---

### Task 1: 建立静态契约（红）

**Files:**
- Create: `scripts/verify-navbar-ios-mode.mjs`
- Modify: `package.json:76`
- Test: `scripts/verify-navbar-ios-mode.mjs`

**Interfaces:**
- Consumes: 组件源码、props、默认值、类型、主题文件、示例页、changelog、根 `package.json`
- Produces: `npm run verify:navbar-ios-mode`，仅当全部契约就位时退出码为 `0`

- [ ] **Step 1: 写下失败的验证脚本**

创建 `scripts/verify-navbar-ios-mode.mjs`：

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const navbar = read('src/uni_modules/uview-plus/components/u-navbar/u-navbar.vue')
const navbarProps = read('src/uni_modules/uview-plus/components/u-navbar/props.js')
const navbarDefaults = read('src/uni_modules/uview-plus/components/u-navbar/navbar.js')
const navbarTypes = read('src/uni_modules/uview-plus/types/comps/navbar.d.ts')
const themeVars = read('src/uni_modules/uview-plus/components/u-navbar/theme-vars.scss')
const themeRuntime = read('src/uni_modules/uview-plus/libs/theme/runtime.js')
const themeCore = read('src/uni_modules/uview-plus/libs/theme/theme.js')
const demo = read('src/pages/componentsC/navbarIos/navbarIos.vue')
const pagesJson = read('src/pages.json')
const changelog = read('src/uni_modules/uview-plus/changelog.md')
const packageJson = JSON.parse(read('package.json'))

// 1. 脚本注册
assert.equal(
    packageJson.scripts['verify:navbar-ios-mode'],
    'node scripts/verify-navbar-ios-mode.mjs',
    'expected package.json to expose verify:navbar-ios-mode'
)

// 2. 属性三处注册
assert.match(
    navbarDefaults,
    /mode:\s*'default'/,
    'expected navbar.js to default mode to "default"'
)
assert.match(
    navbarDefaults,
    /scrollTop:\s*0/,
    'expected navbar.js to default scrollTop to 0'
)
assert.match(
    navbarProps,
    /mode:\s*\{[\s\S]{0,120}?type:\s*String[\s\S]{0,120}?defProps\.navbar\.mode/,
    'expected props.js to register the mode prop'
)
assert.match(
    navbarProps,
    /scrollTop:\s*\{[\s\S]{0,160}?type:\s*\[String,\s*Number\][\s\S]{0,160}?defProps\.navbar\.scrollTop/,
    'expected props.js to register the scrollTop prop'
)
assert.match(
    navbarTypes,
    /mode\?:\s*'default'\s*\|\s*'ios'/,
    'expected navbar.d.ts to type mode as a default/ios union'
)
assert.match(
    navbarTypes,
    /scrollTop\?:\s*string\s*\|\s*number/,
    'expected navbar.d.ts to type scrollTop'
)

// 3. 大标题常量与有效行高
assert.match(
    navbar,
    /const\s+LARGE_TITLE_HEIGHT\s*=\s*52/,
    'expected LARGE_TITLE_HEIGHT constant to be 52'
)
assert.match(
    navbar,
    /largeTitleHeight\(\)\s*\{[\s\S]{0,200}?this\.title\s*\?\s*LARGE_TITLE_HEIGHT\s*:\s*0/,
    'expected effective large-title height to collapse to 0 when title is empty'
)

// 4. 进度公式与两条曲线
assert.match(
    navbar,
    /navbarProgress\(\)\s*\{[\s\S]{0,400}?getPx\(this\.scrollTop\)[\s\S]{0,200}?\/\s*height/,
    'expected progress to divide scrollTop by the effective large-title height'
)
assert.match(
    navbar,
    /navbarGlassOpacity\(\)\s*\{[\s\S]{0,200}?this\.navbarProgress\s*\/\s*0\.5/,
    'expected glass opacity to reach full at progress 0.5'
)
assert.match(
    navbar,
    /navbarCenterOpacity\(\)\s*\{[\s\S]{0,240}?\(this\.navbarProgress\s*-\s*0\.75\)\s*\/\s*0\.25/,
    'expected center title opacity to start at progress 0.75'
)

// 5. nvue 降级
assert.match(
    navbar,
    /isIosMode\(\)\s*\{[\s\S]{0,400}?#ifdef APP-NVUE[\s\S]{0,120}?return false/,
    'expected APP-NVUE to force the ios mode off'
)

// 6. 玻璃层为独立绝对定位元素，带 -webkit- 前缀
assert.match(
    navbar,
    /class="u-navbar__glass"[\s\S]{0,200}?navbarGlassOpacity/,
    'expected a dedicated glass layer bound to navbarGlassOpacity'
)
assert.match(
    navbar,
    /-webkit-backdrop-filter:\s*saturate\(180%\)\s*blur\(var\(--up-navbar-glass-blur,\s*20px\)\)/,
    'expected the -webkit- prefixed backdrop-filter with a CSS var fallback'
)
assert.match(
    navbar,
    /(?<!-)\bbackdrop-filter:\s*saturate\(180%\)\s*blur\(var\(--up-navbar-glass-blur,\s*20px\)\)/,
    'expected the unprefixed backdrop-filter alongside the prefixed one'
)

// 7. 堆叠与透明底
assert.match(
    navbar,
    /&__content\s*\{[\s\S]{0,400}?position:\s*relative;[\s\S]{0,200}?z-index:\s*1/,
    'expected __content to be stacked above the absolutely positioned glass layer'
)
assert.match(
    navbar,
    /navbarInnerStyle\(\)\s*\{[\s\S]{0,300}?isIosMode[\s\S]{0,200}?'transparent'/,
    'expected ios mode to force a transparent inner background'
)

// 8. 主题变量三处落地
for (const [label, source] of [
    ['theme-vars.scss', themeVars],
    ['libs/theme/runtime.js', themeRuntime],
    ['libs/theme/theme.js', themeCore]
]) {
    assert.match(
        source,
        /--up-navbar-glass-bg-color/,
        `expected ${label} to define --up-navbar-glass-bg-color`
    )
    assert.match(
        source,
        /--up-navbar-glass-blur/,
        `expected ${label} to define --up-navbar-glass-blur`
    )
}
assert.match(
    themeRuntime,
    /'--up-navbar-glass-bg-color':\s*'rgba\(255,\s*255,\s*255,\s*0\.82\)'/,
    'expected the light glass background to keep the 0.82 readability floor'
)
assert.match(
    themeRuntime,
    /'--up-navbar-glass-bg-color':\s*'rgba\(28,\s*28,\s*30,\s*0\.82\)'/,
    'expected the dark glass background to keep the 0.82 readability floor'
)

// 9. 示例页与注册
assert.match(
    demo,
    /onPageScroll\(\s*\(?\s*e\s*\)?\s*=>/,
    'expected the demo page to feed scrollTop from onPageScroll'
)
assert.match(
    demo,
    /mode="ios"/,
    'expected the demo page to use mode="ios"'
)
assert.match(
    pagesJson,
    /navbarIos\/navbarIos/,
    'expected pages.json to register the ios navbar demo page'
)

// 10. changelog
assert.match(
    changelog,
    /##\s*3\.8\.112[\s\S]{0,400}?navbar[\s\S]{0,200}?iOS 大标题模式/,
    'expected changelog 3.8.112 to record the navbar ios large-title mode'
)

console.log('navbar ios mode assertions passed')
```

- [ ] **Step 2: 注册验证命令**

`package.json` 是 LF 文件，可直接编辑。在 `verify:up-create-intersection-observer` 那一行后追加（注意给前一行补逗号）：

```json
    "verify:up-create-intersection-observer": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-up-create-intersection-observer.mjs",
    "verify:navbar-ios-mode": "node scripts/verify-navbar-ios-mode.mjs"
```

- [ ] **Step 3: 运行验证器，确认它因缺失行为而失败**

```powershell
npm run verify:navbar-ios-mode
```

预期：抛错。此时示例页 `src/pages/componentsC/navbarIos/navbarIos.vue` 尚不存在，`read()` 会以 `ENOENT` 失败——这是正确的红状态。**不能**因为 npm 脚本没注册而失败。

- [ ] **Step 4: 提交红契约**

```powershell
git add package.json scripts/verify-navbar-ios-mode.mjs
git commit -m "增加导航栏 iOS 模式校验脚本" -m "新增 verify:navbar-ios-mode 静态契约，先锁定属性注册、进度公式、两条透明度曲线、nvue 降级、玻璃层结构与主题变量要求，确保实现前测试处于失败状态。"
```

---

### Task 2: 注册 `mode` 与 `scrollTop` 属性

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-navbar/navbar.js:29`
- Modify: `src/uni_modules/uview-plus/components/u-navbar/props.js:93-97`（**CRLF，必须用 Python 打补丁**）
- Modify: `src/uni_modules/uview-plus/types/comps/navbar.d.ts:83`
- Test: `scripts/verify-navbar-ios-mode.mjs`

**Interfaces:**
- Consumes: `registerComponentProps(NavbarDefaultProps)` 既有机制
- Produces: `this.mode: string`（默认 `'default'`）、`this.scrollTop: string | number`（默认 `0`），供 Task 3 的计算属性使用

- [ ] **Step 1: 增加默认值**

`navbar.js` 是 LF 文件，可直接编辑。把 `titleStyle: ''` 改为带逗号并追加两项：

```js
		leftIconSize: 20,
		leftIconColor: '',
		autoBack: false,
		titleStyle: '',
		mode: 'default',
		scrollTop: 0
    }
```

- [ ] **Step 2: 用 Python 给 CRLF 的 props.js 打补丁**

`props.js` 是 CRLF 文件。**禁止用 Edit 工具**，运行以下脚本（用 `open(..., newline='')` 而非 `Path.read_text(newline=)`——后者需要 Python 3.13+，本环境为 3.12）：

```powershell
python - <<'PY'
path = 'src/uni_modules/uview-plus/components/u-navbar/props.js'
with open(path, 'r', encoding='utf-8', newline='') as f:
    text = f.read()

old = """\t\t// 标题的样式，对象或字符串\r
\t\ttitleStyle: {\r
\t\t\ttype: [String, Object],\r
\t\t\tdefault: () => defProps.navbar.titleStyle\r
\t\t}\r
"""

new = """\t\t// 标题的样式，对象或字符串\r
\t\ttitleStyle: {\r
\t\t\ttype: [String, Object],\r
\t\t\tdefault: () => defProps.navbar.titleStyle\r
\t\t},\r
\t\t// 导航栏模式，default-常规，ios-大标题磨砂模式\r
\t\tmode: {\r
\t\t\ttype: String,\r
\t\t\tdefault: () => defProps.navbar.mode\r
\t\t},\r
\t\t// 页面滚动距离，仅 ios 模式使用，由页面 onPageScroll 传入\r
\t\tscrollTop: {\r
\t\t\ttype: [String, Number],\r
\t\t\tdefault: () => defProps.navbar.scrollTop\r
\t\t}\r
"""

assert text.count(old) == 1, f'anchor not found exactly once: {text.count(old)}'
with open(path, 'w', encoding='utf-8', newline='') as f:
    f.write(text.replace(old, new))
print('props.js patched')
PY
```

锚点已预先核实在当前文件中出现恰好 1 次。

- [ ] **Step 3: 确认 props.js 行尾未被压平**

```powershell
python -c "b=open('src/uni_modules/uview-plus/components/u-navbar/props.js','rb').read(); crlf=b.count(b'\r\n'); lf=b.count(b'\n')-crlf; print(f'CRLF={crlf} LF={lf}')"
git diff --stat src/uni_modules/uview-plus/components/u-navbar/props.js
```

预期：`LF=0`（全 CRLF），且 `git diff --stat` 显示约 12 行新增，**不是**整个文件重写。若显示 96+ 行变更说明行尾被压平，须 `git checkout` 该文件后重来。

- [ ] **Step 4: 补充类型定义**

`navbar.d.ts` 是 LF 文件。在 `titleStyle?: unknown` 之后、`onLeftClick` 之前插入：

```ts
  /**
   * 标题的样式
   */
  titleStyle?: unknown
  /**
   * 导航栏模式。ios 模式下初始背景透明、标题左对齐大字号显示，
   * 下滑压缩后过渡为居中标题并呈现磨砂背景。
   * ios 模式下 fixed 与 placeholder 被忽略。nvue 端降级为 default。
   * @default "default"
   */
  mode?: 'default' | 'ios'
  /**
   * 页面滚动距离，仅 ios 模式使用，需由页面 onPageScroll 传入。
   * 不传时导航栏停留在大标题展开态。
   * @default 0
   */
  scrollTop?: string | number
```

- [ ] **Step 5: 运行验证器，确认属性断言已过**

```powershell
npm run verify:navbar-ios-mode
```

预期：仍然失败，但**失败点应前移**到 `LARGE_TITLE_HEIGHT` 常量或示例页缺失。属性相关的六条断言必须全部通过。

- [ ] **Step 6: 提交属性层**

```powershell
git add src/uni_modules/uview-plus/components/u-navbar/navbar.js src/uni_modules/uview-plus/components/u-navbar/props.js src/uni_modules/uview-plus/types/comps/navbar.d.ts
git commit -m "为导航栏增加 mode 与 scrollTop 属性" -m "新增 mode 属性区分 default 与 ios 两种形态，新增 scrollTop 属性接收页面滚动距离。默认值、属性定义与类型声明三处同步，默认行为保持 default 不变。"
```

---

### Task 3: 实现 iOS 模式结构与进度计算

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-navbar/u-navbar.vue:1-77`（模板）
- Modify: `src/uni_modules/uview-plus/components/u-navbar/u-navbar.vue:79-164`（脚本）
- Modify: `src/uni_modules/uview-plus/components/u-navbar/u-navbar.vue:170-230`（样式）
- Test: `scripts/verify-navbar-ios-mode.mjs`
- Test: `scripts/verify-navbar-safe-area-background.mjs`

**Interfaces:**
- Consumes: Task 2 的 `this.mode`、`this.scrollTop`；既有 `getPx`、`addUnit`、`getWindowInfo`、`upThemeVar`、`upThemeIsDark`
- Produces: 计算属性 `isIosMode: boolean`、`largeTitleHeight: number`、`navbarProgress: number`、`navbarGlassOpacity: number`、`navbarCenterOpacity: number`、`navbarGlassBgColor: string`、`navbarFlowSpacerHeight: string`；CSS 类 `u-navbar__flow`、`u-navbar__large-title`、`u-navbar__glass`

`u-navbar.vue` 是 LF 文件，可直接编辑。

- [ ] **Step 1: 替换模板为双模式结构**

把整个 `<template>` 块替换为：

```vue
<template>
	<view class="u-navbar" :class="[customClass]">
		<!-- ios 模式：in-flow 层，恒定渲染，随页面原生滚动被带走 -->
		<view
			v-if="isIosMode"
			class="u-navbar__flow"
		>
			<view :style="{ height: navbarFlowSpacerHeight }"></view>
			<view
				v-if="title"
				class="u-navbar__large-title"
				:style="{ height: addUnit(largeTitleHeight) }"
			>
				<text
					class="u-line-1 u-navbar__large-title__text"
					:style="[{ color: navbarTitleColor }, addStyle(titleStyle)]"
				>{{ title }}</text>
			</view>
		</view>
		<!-- default 模式：原有占位块，行为保持不变 -->
		<view
			class="u-navbar__placeholder"
			v-if="!isIosMode && fixed && placeholder"
			:style="{
				height: addUnit(getPx(height) + getWindowInfo().statusBarHeight,'px'),
			}"
		></view>
		<view
			class="u-navbar__inner"
			:class="[(isIosMode || fixed) && 'u-navbar--fixed']"
			:style="[navbarInnerStyle]"
		>
			<view
				v-if="isIosMode"
				class="u-navbar__glass"
				:style="{
					opacity: navbarGlassOpacity,
					background: navbarGlassBgColor,
				}"
			></view>
			<u-status-bar v-if="safeAreaInsetTop"></u-status-bar>
			<view
				class="u-navbar__content"
				:class="[border && !isIosMode && 'u-border-bottom']"
				:style="{
					height: addUnit(height),
					backgroundColor: 'transparent',
				}"
			>
				<view
					class="u-navbar__content__left"
					hover-class="u-navbar__content__left--hover"
					hover-start-time="150"
					@tap="leftClick"
				>
					<slot name="left">
						<up-icon
							v-if="leftIcon"
							:name="leftIcon"
							:size="leftIconSize"
							:color="navbarLeftIconColor"
						></up-icon>
						<text
							v-if="leftText"
							:style="{
								color: navbarLeftIconColor
							}"
							class="u-navbar__content__left__text"
						>{{ leftText }}</text>
					</slot>
				</view>
				<view
					class="u-navbar__content__center"
					:style="{ opacity: navbarCenterOpacity }"
				>
					<slot name="center">
						<text
							class="u-line-1 u-navbar__content__title"
							:style="[{
								width: addUnit(titleWidth),
								color: navbarTitleColor,
							}, addStyle(titleStyle)]"
						>{{ title }}</text>
					</slot>
				</view>
				<view
					class="u-navbar__content__right"
					v-if="$slots.right || rightIcon || rightText"
					@tap="rightClick"
				>
					<slot name="right">
						<up-icon
							v-if="rightIcon"
							:name="rightIcon"
							size="20"
							:color="navbarRightColor"
						></up-icon>
						<text
							v-if="rightText"
							class="u-navbar__content__right__text"
							:style="{ color: navbarRightColor }"
						>{{ rightText }}</text>
					</slot>
				</view>
			</view>
		</view>
	</view>
</template>
```

三处需要留意的改动：

1. `center` 插槽被包进 `u-navbar__content__center` 包装层以承载 `opacity`。`default` 模式下 `navbarCenterOpacity` 恒为 1，视觉无变化。
2. `border` 在 `ios` 模式下不走 `u-border-bottom`——发丝线改挂在玻璃层上随之淡入。
3. `__placeholder` 的 `v-if` 加了 `!isIosMode` 前缀，其余原样；`ios` 模式由 `__flow` 承担占位。

- [ ] **Step 2: 增加常量与计算属性**

在 `<script>` 的 import 之后、注释块之前插入常量：

```js
	import { addUnit, addStyle, getPx, getWindowInfo } from '../../libs/function/index';

	// iOS 大标题行高。它同时是 navbarProgress 的分母，
	// 因此改动此值会同步改变压缩过程的滚动区间。
	const LARGE_TITLE_HEIGHT = 52
```

在文档注释块的 `@property {Object | String} titleStyle` 之后补两行：

```
	 * @property {String}			mode				导航栏模式，default-常规，ios-大标题磨砂模式（默认 'default' ）
	 * @property {String | Number}	scrollTop			页面滚动距离，仅 ios 模式使用，由页面 onPageScroll 传入（默认 0 ）
```

在 `computed` 中，`navbarBgColor()` 之前插入：

```js
			isIosMode() {
				// nvue 缺少 filter 管线、页面非原生滚动容器、onPageScroll 不可靠，
				// 三条约束任意一条都足以让 ios 模式失效，整体降级为 default。
				// 注意 APP-NVUE 在 app-harmony 上为 false，harmony 走 ArkWeb 应获得完整 ios 模式。
				// #ifdef APP-NVUE
				return false
				// #endif
				// #ifndef APP-NVUE
				return this.mode === 'ios'
				// #endif
			},
			// 有效大标题行高：title 为空时不渲染大标题行，行高塌陷为 0
			largeTitleHeight() {
				return this.title ? LARGE_TITLE_HEIGHT : 0
			},
			// in-flow 层顶部让位块高度，为固定层腾出空间
			navbarFlowSpacerHeight() {
				const statusBarHeight = this.safeAreaInsetTop ? getWindowInfo().statusBarHeight : 0
				return addUnit(getPx(this.height) + statusBarHeight, 'px')
			},
			// 压缩进度。分母取有效大标题行高，progress=1 即大标题恰好完全没入导航栏
			navbarProgress() {
				if (!this.isIosMode) return 1
				const height = this.largeTitleHeight
				if (height <= 0) return 1
				const offset = getPx(this.scrollTop) || 0
				return Math.min(Math.max(offset / height, 0), 1)
			},
			// 磨砂在前半段走完，为居中标题的出现铺好不透明底
			navbarGlassOpacity() {
				if (!this.isIosMode) return 0
				return Math.min(Math.max(this.navbarProgress / 0.5, 0), 1)
			},
			// 居中标题在后段才启动，此时玻璃已满不透明，不会与大标题互相透出
			navbarCenterOpacity() {
				if (!this.isIosMode) return 1
				return Math.min(Math.max((this.navbarProgress - 0.75) / 0.25, 0), 1)
			},
			navbarGlassBgColor() {
				// 0.82 是可读性下限的承重值：backdrop-filter 不生效时，
				// 仅靠这个不透明度也必须保证文字不与下方内容读串。
				return this.bgColor
					|| this.upThemeVar('--up-navbar-glass-bg-color',
						this.upThemeIsDark ? 'rgba(28, 28, 30, 0.82)' : 'rgba(255, 255, 255, 0.82)')
			},
```

把既有的 `navbarInnerStyle()` 替换为：

```js
			navbarInnerStyle() {
				const style = {}
				// ios 模式下固定层必须透明，否则 backdrop-filter 采样到自身底色，模糊不出内容
				style.background = this.isIosMode ? 'transparent' : this.navbarBgColor
				return style
			}
```

- [ ] **Step 3: 增加样式**

在 `scoped` 样式块内 `.u-navbar` 的 `&--fixed` 之后插入：

```scss
		&__flow {
			/* #ifndef APP-NVUE */
			width: 100%;
			/* #endif */
		}

		&__large-title {
			@include flex(row);
			align-items: center;
			padding: 0 13px;

			&__text {
				font-size: 34px;
				font-weight: 700;
				line-height: 1.2;
			}
		}

		&__glass {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			// 模糊半径写在静态 class 内而非 :style 绑定，使 -webkit- 前缀在编译期确定。
			// iOS 16 之前的 WKWebView 只认前缀版本，两条都必须保留。
			// CSS 变量不被支持时回落到字面量 20px。
			-webkit-backdrop-filter: saturate(180%) blur(var(--up-navbar-glass-blur, 20px));
			        backdrop-filter: saturate(180%) blur(var(--up-navbar-glass-blur, 20px));
		}
```

把既有的 `&__content` 规则块开头改为（新增两行，其余原样）：

```scss
		&__content {
			@include flex(row);
			align-items: center;
			height: 44px;
			background-color: $u-bg-color;
			// 玻璃层是绝对定位的，会盖住同级的非定位元素。
			// 缺少这两行的表现是整个导航栏内容不可见。
			position: relative;
			z-index: 1;
			justify-content: center;
```

在 `&__title` 规则之前插入居中包装层：

```scss
			&__center {
				@include flex(row);
				align-items: center;
				justify-content: center;
			}
```

- [ ] **Step 4: 运行两个契约**

```powershell
npm run verify:navbar-ios-mode
npm run verify:navbar-safe-area-background
```

预期：`verify:navbar-ios-mode` 失败点前移到主题变量或示例页缺失，组件结构相关断言全部通过；`verify:navbar-safe-area-background` 输出 `navbar safe-area background assertions passed`——这条确认 `default` 模式契约未被破坏。

- [ ] **Step 5: 提交组件实现**

```powershell
git add src/uni_modules/uview-plus/components/u-navbar/u-navbar.vue
git commit -m "实现导航栏 iOS 大标题模式" -m "大标题渲染在 in-flow 层靠原生滚动位移，scrollTop 仅驱动玻璃层与居中标题两个透明度值。玻璃层为固定层内独立的绝对定位元素，__content 显式提升层级避免被其遮盖。ios 模式下固定层背景透明以保证 backdrop-filter 正常采样，nvue 通过条件编译降级为 default。"
```

---

### Task 4: 接入玻璃主题变量

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-navbar/theme-vars.scss:1-21`
- Modify: `src/uni_modules/uview-plus/libs/theme/runtime.js:14`
- Modify: `src/uni_modules/uview-plus/libs/theme/runtime.js:56`
- Modify: `src/uni_modules/uview-plus/libs/theme/theme.js:66-89`
- Test: `scripts/verify-navbar-ios-mode.mjs`

**Interfaces:**
- Consumes: Task 3 的 `navbarGlassBgColor()` 对 `upThemeVar('--up-navbar-glass-bg-color', ...)` 的调用
- Produces: `--up-navbar-glass-bg-color` 与 `--up-navbar-glass-blur` 在 CSS 层、运行时兜底、主题构建三处可用

三个文件均为 LF，可直接编辑。

- [ ] **Step 1: 补充 CSS 层默认值**

把 `theme-vars.scss` 整体替换为：

```scss
:root,
page,
body {
	--up-navbar-bg-color: #ffffff;
	--up-navbar-glass-bg-color: rgba(255, 255, 255, 0.82);
	--up-navbar-glass-blur: 20px;
}

@media (prefers-color-scheme: dark) {
	:root,
	page,
	body {
		--up-navbar-bg-color: #1c1c1e;
		--up-navbar-glass-bg-color: rgba(28, 28, 30, 0.82);
	}
}

[data-up-theme='light'] {
	--up-navbar-bg-color: #ffffff;
	--up-navbar-glass-bg-color: rgba(255, 255, 255, 0.82);
}

[data-up-theme='dark'] {
	--up-navbar-bg-color: #1c1c1e;
	--up-navbar-glass-bg-color: rgba(28, 28, 30, 0.82);
}
```

模糊半径不随明暗切换，只在 `:root` 声明一次。

- [ ] **Step 2: 接入运行时兜底**

`runtime.js` 的 `FALLBACK_THEME_VARS.light` 中，在 `'--up-navbar-bg-color': '#ffffff',` 之后插入：

```js
        '--up-navbar-bg-color': '#ffffff',
        '--up-navbar-glass-bg-color': 'rgba(255, 255, 255, 0.82)',
        '--up-navbar-glass-blur': '20px',
```

`FALLBACK_THEME_VARS.dark` 中，在 `'--up-navbar-bg-color': '#1c1c1e',` 之后插入：

```js
        '--up-navbar-bg-color': '#1c1c1e',
        '--up-navbar-glass-bg-color': 'rgba(28, 28, 30, 0.82)',
        '--up-navbar-glass-blur': '20px',
```

不要往 `THEME_COLOR_SYNC_MAP` 里加这两项——它们不是 `uni.$u.color` 的调色板令牌，加进去会污染颜色同步。

- [ ] **Step 3: 接入主题构建**

`theme.js` 的 `DEFAULT_THEME_EXTRA_VARS.light` 中，在 `'--up-calendar-month-mark-color': 'rgba(231, 232, 234, 0.83)'` 后加逗号并追加：

```js
        '--up-calendar-month-mark-color': 'rgba(231, 232, 234, 0.83)',
        '--up-navbar-glass-bg-color': 'rgba(255, 255, 255, 0.82)',
        '--up-navbar-glass-blur': '20px'
    }),
```

`DEFAULT_THEME_EXTRA_VARS.dark` 中同样处理：

```js
        '--up-calendar-month-mark-color': 'rgba(255, 255, 255, 0.04)',
        '--up-navbar-glass-bg-color': 'rgba(28, 28, 30, 0.82)',
        '--up-navbar-glass-blur': '20px'
    })
```

`buildThemeCssVars` 的返回块已经展开 `defaultExtraVars` 与其别名，无需改动。

- [ ] **Step 4: 运行验证器**

```powershell
npm run verify:navbar-ios-mode
```

预期：主题变量的八条断言全部通过，失败点前移到示例页缺失（`ENOENT`）。

- [ ] **Step 5: 提交主题变量**

```powershell
git add src/uni_modules/uview-plus/components/u-navbar/theme-vars.scss src/uni_modules/uview-plus/libs/theme/runtime.js src/uni_modules/uview-plus/libs/theme/theme.js
git commit -m "增加导航栏玻璃主题变量" -m "新增 --up-navbar-glass-bg-color 与 --up-navbar-glass-blur，在 CSS 层默认值、运行时兜底与主题构建三处落地。0.82 不透明度是模糊不生效时的可读性下限，明暗两套值均以此为准。"
```

---

### Task 5: 示例页与页面注册

**Files:**
- Create: `src/pages/componentsC/navbarIos/navbarIos.vue`
- Modify: `src/pages.json:418-424`
- Modify: `src/pages/componentsC/navbar/navbar.nvue:11-12`（**CRLF，必须用 Python 打补丁**）
- Test: `scripts/verify-navbar-ios-mode.mjs`

**Interfaces:**
- Consumes: Task 2/3 的 `mode="ios"` 与 `:scroll-top`
- Produces: 可运行的 `ios` 模式示例页，供人工验收清单逐行核对

- [ ] **Step 1: 创建示例页**

创建 `src/pages/componentsC/navbarIos/navbarIos.vue`（LF）：

```vue
<template>
	<view class="ios-demo">
		<up-navbar
			mode="ios"
			title="设置"
			:scrollTop="scrollTop"
			:autoBack="true"
			rightIcon="search"
			@rightClick="rightClick"
		></up-navbar>
		<view class="ios-demo__body">
			<text class="ios-demo__tip">向下滚动，观察大标题被压缩进导航栏，标题过渡为居中形态并出现磨砂背景。</text>
			<view
				class="ios-demo__cell"
				v-for="item in cells"
				:key="item"
			>
				<text class="ios-demo__cell__text">{{ item }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'

const scrollTop = ref(0)

const cells = ref(Array.from({ length: 30 }, (_, i) => `列表项 ${i + 1}`))

// ios 模式必须由页面把滚动距离喂给组件，
// 组件内部无法获取页面级的 onPageScroll。
onPageScroll((e) => {
	scrollTop.value = e.scrollTop
})

const rightClick = () => {
	console.log('rightClick')
}
</script>

<style lang="scss" scoped>
.ios-demo {
	min-height: 100vh;
	background-color: #f3f4f6;

	&__body {
		padding: 0 15px 40px 15px;
	}

	&__tip {
		display: block;
		font-size: 13px;
		color: #909193;
		padding: 12px 0 16px 0;
	}

	&__cell {
		background-color: #ffffff;
		border-radius: 8px;
		margin-bottom: 8px;
		padding: 14px 16px;

		&__text {
			font-size: 15px;
			color: #303133;
		}
	}
}
</style>
```

页面背景刻意用浅灰加白色卡片，这样磨砂层下方有明确的明暗边界，人工核对时能看清"影子"是否透出。

- [ ] **Step 2: 注册页面**

`pages.json` 是 LF 文件。在 `navbar/navbar` 条目之后插入：

```json
                {
                    "path" : "navbar/navbar",
                    "style" : {
                        "navigationBarTitleText" : "导航栏",
                        "navigationStyle" : "custom"
                    }
                },
                {
                    "path" : "navbarIos/navbarIos",
                    "style" : {
                        "navigationBarTitleText" : "导航栏 iOS 模式",
                        "navigationStyle" : "custom"
                    }
                },
```

- [ ] **Step 3: 用 Python 给 CRLF 的 navbar.nvue 加跳转入口**

`navbar.nvue` 是 CRLF 文件。**禁止用 Edit 工具**（同样用 `open(..., newline='')`）：

```powershell
python - <<'PY'
path = 'src/pages/componentsC/navbar/navbar.nvue'

def read():
    with open(path, 'r', encoding='utf-8', newline='') as f:
        return f.read()

def write(text):
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(text)

text = read()

old = """\t\t</up-navbar>\r
\t\t<view class="u-page__item">\r
\t\t\t<text class="u-page__item__title">基础功能</text>\r
"""

new = """\t\t</up-navbar>\r
\t\t<view class="u-page__item">\r
\t\t\t<text class="u-page__item__title">iOS 大标题模式</text>\r
\t\t\t<up-button type="primary" text="查看 iOS 模式示例" @click="toIosDemo"></up-button>\r
\t\t</view>\r
\t\t<view class="u-page__item">\r
\t\t\t<text class="u-page__item__title">基础功能</text>\r
"""

assert text.count(old) == 1, f'anchor not found exactly once: {text.count(old)}'
write(text.replace(old, new))

old_fn = """const rightClick = () => {\r
"""
new_fn = """const toIosDemo = () => {\r
\tuni.navigateTo({\r
\t\turl: '/pages/componentsC/navbarIos/navbarIos'\r
\t})\r
}\r
\r
const rightClick = () => {\r
"""

text = read()
assert text.count(old_fn) == 1, f'fn anchor not found exactly once: {text.count(old_fn)}'
write(text.replace(old_fn, new_fn))
print('navbar.nvue patched')
PY
```

两个锚点均已预先核实在当前文件中各出现恰好 1 次。

- [ ] **Step 4: 确认 navbar.nvue 行尾未被压平**

```powershell
python -c "b=open('src/pages/componentsC/navbar/navbar.nvue','rb').read(); crlf=b.count(b'\r\n'); lf=b.count(b'\n')-crlf; print(f'CRLF={crlf} LF={lf}')"
git diff --stat src/pages/componentsC/navbar/navbar.nvue
```

预期：`LF=0`，`git diff --stat` 显示约 11 行新增。若显示 129+ 行变更说明行尾被压平，须 `git checkout` 后重来。

- [ ] **Step 5: 运行完整契约**

```powershell
npm run verify:navbar-ios-mode
```

预期：`navbar ios mode assertions passed`（changelog 断言可能仍失败，若失败则留到 Task 6）。

- [ ] **Step 6: 提交示例页**

```powershell
git add src/pages/componentsC/navbarIos/navbarIos.vue src/pages.json src/pages/componentsC/navbar/navbar.nvue
git commit -m "增加导航栏 iOS 模式示例页" -m "新建 navbarIos 示例页演示 onPageScroll 向组件传入 scrollTop 的完整用法，页面使用浅灰底加白色卡片以便观察磨砂层透出的内容影子。示例页为 vue 而非 nvue，因该模式在 nvue 端降级。原 navbar 示例页增加跳转入口。"
```

---

### Task 6: 更新日志与文档

**Files:**
- Modify: `src/uni_modules/uview-plus/changelog.md:1`
- Modify: `../uview-plus-doc/docs/components/navbar.md:212-235`（Props 表）
- Modify: `../uview-plus-doc/docs/components/navbar.md:11-13`（平台差异表）
- Modify: `../uview-plus-doc/docs/components/navbar.md:145-150`（新增 ios 章节）
- Test: `scripts/verify-navbar-ios-mode.mjs`

**Interfaces:**
- Consumes: Task 2-5 的全部行为
- Produces: 3.8.112 更新日志与文档中的 `ios` 模式说明

- [ ] **Step 1: 增加 changelog 条目**

`changelog.md` 是 LF 文件。在文件最顶部插入：

```md
## 3.8.112
feat: navbar 新增 iOS 大标题模式

新增 `mode` 属性，`ios` 值提供现代 iOS 系统应用的导航栏体验：进入页面时导航栏背景透明、标题以 34px 左对齐显示；向下滚动时大标题被压缩进导航栏，标题过渡为常规居中形态，同时出现毛玻璃磨砂背景。

- 新增 `mode` 属性，可选 `default`（默认）与 `ios`，非法值按 `default` 处理
- 新增 `scrollTop` 属性接收页面滚动距离，需由页面 `onPageScroll` 传入；不传时停留在大标题展开态
- 大标题渲染在 in-flow 层靠原生滚动位移，不经过 JS，小程序端不会因 setData 回程产生拖影
- 磨砂采用 0.82 不透明底色叠加 `backdrop-filter`：支持的端得到真实毛玻璃，不支持的端仍有 82% 不透明底色兜住文字可读性
- 玻璃与居中标题的透明度曲线分段递进（0-0.5 与 0.75-1），确保任何滚动位置都不出现两段标题文字互相透出
- 新增 `--up-navbar-glass-bg-color` 与 `--up-navbar-glass-blur` 主题变量，跟随明暗模式切换
- 新增 verify:navbar-ios-mode 校验脚本

已知边界：`ios` 模式下 `fixed` 与 `placeholder` 被忽略——固定层恒定固定，in-flow 层恒定渲染，因为该层承载的是大标题这一实际内容而非可选占位。nvue 端因缺少 filter 管线、页面非原生滚动容器、`onPageScroll` 不可靠三项约束，传入 `mode="ios"` 时整体降级为 `default`。

`default` 模式的结构、样式与属性语义完全不变。

```

- [ ] **Step 2: 更新文档平台差异表**

`../uview-plus-doc/docs/components/navbar.md` 中，把原平台差异表替换为：

```md
### 平台差异说明

|App（vue）|App（nvue）|H5|小程序|
|:-:|:-:|:-:|:-:|
|√|√|√|√|

`mode="ios"` 的平台支持情况：

|平台|大标题压缩|磨砂|
|:-|:-:|:-|
|H5 现代浏览器|√|√|
|App（vue）iOS|√|√|
|App（vue）Android|√|视 WebView 版本，否则 82% 不透明底色|
|鸿蒙（app-harmony）|√|√|
|App（nvue）|整体降级为 `default`|—|
|微信小程序 iOS|√|√|
|其余小程序|√|视端能力，否则 82% 不透明底色|
```

- [ ] **Step 3: 新增 ios 模式文档章节**

在"自定义导航栏背景颜色"章节之后、"右侧演示页面源代码地址"之前插入：

````md
### iOS 大标题模式 <Badge text="3.8.112" />

通过 `mode="ios"` 启用现代 iOS 系统应用的导航栏体验：进入页面时导航栏背景透明、标题以大字号靠左显示；向下滚动时大标题被压缩进导航栏，标题过渡为常规居中形态，同时出现毛玻璃磨砂背景。

组件内部无法获取页面级的 `onPageScroll`，因此必须由页面把滚动距离通过 `scrollTop` 传入。

``` html
<template>
	<view>
		<up-navbar
			mode="ios"
			title="设置"
			:scrollTop="scrollTop"
			:autoBack="true"
		></up-navbar>
		<view><!-- 页面内容 --></view>
	</view>
</template>
```

<div class="composition-api">

```js
<script setup>
import { ref } from 'vue';
import { onPageScroll } from '@dcloudio/uni-app';

const scrollTop = ref(0);

onPageScroll((e) => {
	scrollTop.value = e.scrollTop;
});
</script>
```

</div>

<div class="options-api">

```js
<script>
	export default {
		data() {
			return {
				scrollTop: 0
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		}
	}
</script>
```

</div>

:::warning 注意
- `mode="ios"` 下 `fixed` 与 `placeholder` 会被**忽略**：导航栏恒定固定，大标题所在的占位层恒定渲染。因为该层承载的是大标题这一实际内容，而非可选占位
- 不传 `scrollTop` 时导航栏会停留在大标题展开态，不会报错。这是有意的静默降级
- `bgColor` 传入后会作为压缩态背景并仍按曲线淡入；传入**不透明**颜色会掩盖模糊效果
- `title` 为空字符串时不渲染大标题行，导航栏初始即为磨砂态
- 使用 `center` 插槽时，插槽内容随压缩过程淡入，但大标题始终取 `title` 属性渲染。若需要大标题，必须同时传 `title`
- nvue 端不支持该模式，传入 `mode="ios"` 时渲染为 `default` 形态
:::

磨砂底色与模糊半径可通过 `--up-navbar-glass-bg-color` 与 `--up-navbar-glass-blur` 两个主题变量调整，默认跟随明暗模式切换。底色的 0.82 不透明度是 `backdrop-filter` 不生效时的文字可读性下限，不建议显著降低。
````

- [ ] **Step 4: 更新 Props 表**

在 `titleStyle` 行之后追加两行：

```md
| mode <Badge text="3.8.112" />	| 导航栏模式，`ios` 为大标题磨砂模式			| String				| default		| ios	|
| scrollTop <Badge text="3.8.112" />	| 页面滚动距离，仅 `ios` 模式使用，需由页面 `onPageScroll` 传入	| String &#124; Number	| 0		| -	|
```

- [ ] **Step 5: 运行完整契约与文档检查**

```powershell
npm run verify:navbar-ios-mode
```

预期：`navbar ios mode assertions passed`。

```powershell
$doc = Get-Content -Raw '..\uview-plus-doc\docs\components\navbar.md'
if ($doc -notmatch 'iOS 大标题模式') { throw 'missing ios section' }
if ($doc -notmatch 'onPageScroll') { throw 'missing scrollTop wiring example' }
if ($doc -notmatch 'fixed` 与 `placeholder` 会被\*\*忽略\*\*') { throw 'missing ignored-props warning' }
if ($doc -notmatch '--up-navbar-glass-bg-color') { throw 'missing theme var docs' }
git -C '..\uview-plus-doc' diff --check
```

预期：无输出，退出码 `0`。

- [ ] **Step 6: 分别提交两个仓库**

```powershell
git add src/uni_modules/uview-plus/changelog.md
git commit -m "记录导航栏 iOS 模式更新日志" -m "在 3.8.112 中说明 mode 与 scrollTop 两个新属性、大标题的 in-flow 位移方案、磨砂的降级策略与分段透明度曲线，并写明 fixed/placeholder 被忽略与 nvue 降级两项边界。"
```

```powershell
git -C '..\uview-plus-doc' add docs/components/navbar.md
git -C '..\uview-plus-doc' commit -m "补充导航栏 iOS 模式文档" -m "增加 mode 与 scrollTop 属性说明、组合式与选项式的 onPageScroll 接线示例、分平台的磨砂支持情况，以及 fixed/placeholder 被忽略、center 插槽与大标题关系、主题变量调整等注意事项。"
```

---

### Task 7: 最终验证

**Files:**
- Verify: 全部 Task 1-6 产出
- Test: `scripts/verify-navbar-ios-mode.mjs`
- Test: `scripts/verify-navbar-safe-area-background.mjs`

**Interfaces:**
- Consumes: Task 1-6 的全部交付物
- Produces: 通过的静态契约、H5 构建证据、人工验收结论；本任务不做实现改动

- [ ] **Step 1: 运行两个 navbar 契约**

```powershell
npm run verify:navbar-ios-mode
npm run verify:navbar-safe-area-background
```

预期：

```text
navbar ios mode assertions passed
navbar safe-area background assertions passed
```

- [ ] **Step 2: 类型检查**

```powershell
npm run type-check
```

预期：退出码 `0`。若出现与本次改动无关的既有报错，记录其原文，不扩大改动范围。

- [ ] **Step 3: H5 构建**

```powershell
npm run build:h5
```

预期：退出码 `0`。

- [ ] **Step 4: 人工验收——逐行核对时间线**

启动 H5 开发服务：

```powershell
npm run dev:h5
```

浏览器打开 `/pages/componentsC/navbarIos/navbarIos`，缓慢向下滚动，按下表逐行核对。**这一步无法自动化**——静态断言只能守住公式，看不出视觉表现。

| 滚动距离 | progress | 预期观察 |
| :- | :- | :- |
| 0px | 0 | 仅大标题可见，导航栏区域完全透明，下方内容可透过 |
| 13px | 0.25 | 大标题上方空白处半透明穿过，**无文字重叠** |
| 26px | 0.5 | 玻璃已完全不透明，大标题字形开始被真正遮挡 |
| 39px | 0.75 | 居中标题此刻才开始出现，其下方已是实底 |
| 52px 及以上 | 1 | 大标题完全没入，居中标题完全显示 |

**最关键的一行是 26px→39px 区间**：此区间内大标题正从玻璃层下方穿过，若能看到大标题文字与任何居中文字同时可见，说明两条曲线的分段实现有误，需回到 Task 3 Step 2 检查 `navbarGlassOpacity` 与 `navbarCenterOpacity` 的分母。

另需确认：

1. 磨砂生效时能看到下方卡片边界的模糊影子，而非纯色块。
2. 返回箭头与右侧图标全程不透明，不参与淡入。
3. 切换系统暗色模式后玻璃底色变为深色。

- [ ] **Step 5: 人工验收——default 模式回归**

浏览器打开 `/pages/componentsC/navbar/navbar`，确认四个既有示例的渲染与改动前一致：默认导航栏、基础功能、自定义文本、自定义插槽。特别确认标题仍然居中且完全不透明——`center` 包装层的 `opacity` 在 `default` 模式下应恒为 1。

- [ ] **Step 6: 检查格式与仓库状态**

```powershell
git diff --check
git status --short
git -C '..\uview-plus-doc' diff --check
git -C '..\uview-plus-doc' status --short
```

预期：无空白字符错误，两个仓库在各自提交后均为干净状态。

- [ ] **Step 7: 复核提交历史与行尾**

```powershell
git log -7 --oneline --decorate
git -C '..\uview-plus-doc' log -2 --oneline --decorate
python -c "
for p in ['src/uni_modules/uview-plus/components/u-navbar/props.js','src/pages/componentsC/navbar/navbar.nvue']:
    b=open(p,'rb').read(); crlf=b.count(b'\r\n'); lf=b.count(b'\n')-crlf
    print(f'{p}: CRLF={crlf} LF={lf}')
"
```

确认每个新提交都是中文 head 加独立中文 body；确认两个 CRLF 文件的 `LF=0`。本计划不含发版、版本号变更、打 tag、push 或关闭 issue。

---

## Spec Coverage Self-Check

| Spec requirement | Covered by |
| :- | :- |
| `mode` 属性，默认 `default`，非法值按 `default` | Task 2 Step 1/2，Task 3 Step 2 的 `isIosMode` 严格等值判断 |
| `scrollTop` 属性，经 `getPx()` 兼容 rpx | Task 2 Step 1/2，Task 3 Step 2 |
| `ios` 下 `fixed` 忽略 | Task 3 Step 1 模板 `(isIosMode \|\| fixed)` |
| `ios` 下 `placeholder` 忽略 | Task 3 Step 1 模板 `!isIosMode && fixed && placeholder` |
| `bgColor` 作为压缩态背景 | Task 3 Step 2 `navbarGlassBgColor` 优先取 `this.bgColor` |
| `titleColor` / `titleStyle` 同时作用两处标题 | Task 3 Step 1 大标题与居中标题共用绑定 |
| `titleWidth` 仅约束居中标题 | Task 3 Step 1 仅居中标题绑定 `titleWidth` |
| `center` 插槽受 `centerOpacity` 控制、大标题只认 `title` | Task 3 Step 1 包装层，Task 6 Step 3 文档 |
| `left` / `right` 插槽全程不透明 | Task 3 Step 1 未绑定 opacity |
| `title` 为空不渲染大标题、`progress` 恒 1 | Task 3 Step 1 `v-if="title"`，Step 2 `largeTitleHeight` |
| 结构：in-flow 层 + 固定层 + 独立玻璃层 | Task 3 Step 1 |
| 让位块高度含 `safeAreaInsetTop` 判断 | Task 3 Step 2 `navbarFlowSpacerHeight` |
| `__inner` 在 ios 下透明 | Task 3 Step 2 `navbarInnerStyle` |
| `__content` 提升层级 | Task 3 Step 3 |
| 进度公式与除零保护 | Task 3 Step 2，Task 1 断言 |
| 两条分段曲线 | Task 3 Step 2，Task 1 断言 |
| `border` 挂玻璃层随之淡入 | Task 3 Step 1（ios 下不加 `u-border-bottom`），Step 3 玻璃层样式 |
| 玻璃层 `-webkit-` 前缀与 CSS var 回落 | Task 3 Step 3，Task 1 断言 |
| 0.82 承重值 | Task 3 Step 2，Task 4 Step 1/2/3，Task 1 断言 |
| 主题变量三处落地 | Task 4 Step 1/2/3 |
| nvue 降级、harmony 不降级 | Task 3 Step 2 条件编译与注释，Task 1 断言 |
| 大标题左内边距 13px | Task 3 Step 3 |
| 平台差异表 | Task 6 Step 2 |
| 全部 11 条验收标准 | Task 7 Step 4/5 人工核对 + Task 1 静态断言 |
| 人工验收清单时间线 | Task 7 Step 4 |
| 静态验证脚本 9 项 | Task 1 Step 1 |
| 交付物 14 个文件 | File Map 与 Task 1-6 |
| 中文 head + body 提交 | 每个 Task 的提交步骤 |

## Placeholder and Interface Self-Check

- 每个步骤都含具体代码、命令、预期结果与提交范围，无 TBD/TODO/"类似 Task N"。
- 计算属性命名在验证脚本、组件实现、覆盖表中一致：`isIosMode`、`largeTitleHeight`、`navbarProgress`、`navbarGlassOpacity`、`navbarCenterOpacity`、`navbarGlassBgColor`、`navbarFlowSpacerHeight`。
- CSS 类命名一致：`u-navbar__flow`、`u-navbar__large-title`、`u-navbar__glass`、`u-navbar__content__center`。
- 主题变量命名一致：`--up-navbar-glass-bg-color`、`--up-navbar-glass-blur`。
- 常量命名一致：`LARGE_TITLE_HEIGHT`。
- 命令名一致：`verify:navbar-ios-mode`。
- 版本号一致：3.8.112（changelog 与文档 Badge）。
- 两个 CRLF 文件（`props.js`、`navbar.nvue`）均以 Python `newline=''` 打补丁并附行尾校验步骤。
