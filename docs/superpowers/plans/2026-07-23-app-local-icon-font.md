# App Local Icon Font Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** App 端内置 `u-icon` 字体默认从包内本地 `upicon.ttf` 加载，不再请求远程 CDN。

**Architecture:** Add a focused verification script that codifies the regression contract, then update `u-icon` font loading in place. `util.js` owns runtime font source selection and load-once behavior; `u-icon.vue` owns CSS fallback rules for non-App mini-program targets only.

**Tech Stack:** uni-app Vue 3, uview-plus uni_modules package, JavaScript conditional compilation comments, Node.js verification script.

## Global Constraints

- App 端内置图标字体默认只使用包内本地字体，不再请求远程 CDN。
- App 端内置字体加载失败时不回退远程，避免弱网阻塞重新出现。
- App 端内置字体只加载一次，避免多图标页面重复调用字体加载 API。
- H5 和小程序继续沿用现有远程 `config.iconUrl` 行为，降低跨端回归风险。
- 保留自定义图标 `config.customIcon` 现有能力。
- 不改变图标 unicode 映射和 `u-icon` 组件 API。
- 不为用户项目生成或修改 `static/app-plus/fonts/upfont.ttf`。
- 不引入构建插件或要求用户手动配置 PostCSS。
- Git commit 信息必须使用中文，并包含 head + body。

---

## File Structure

- `scripts/verify-app-local-icon-font.mjs`: new repository check for the App-local font contract. It reads source files directly and fails if App CSS still references the CDN, if the package font asset is missing, or if runtime loading no longer uses the local `upicon.ttf` path.
- `package.json`: add `verify:app-local-icon-font` so the contract can be run consistently.
- `src/uni_modules/uview-plus/components/u-icon/util.js`: update built-in icon font loading to use `new URL('./upicon.ttf', import.meta.url).href` on App/App-nvue, while non-App platforms continue using `config.iconUrl`.
- `src/uni_modules/uview-plus/components/u-icon/u-icon.vue`: remove `APP` from the remote CSS `@font-face` condition; keep the fallback CSS for mini-program targets that still depend on it.
- `src/uni_modules/uview-plus/components/u-icon/upicon.ttf`: add the package-local built-in icon font asset to version control.

---

### Task 1: Add The Regression Verification Contract

**Files:**
- Create: `scripts/verify-app-local-icon-font.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `src/uni_modules/uview-plus/components/u-icon/u-icon.vue`, `src/uni_modules/uview-plus/components/u-icon/util.js`, `src/uni_modules/uview-plus/components/u-icon/upicon.ttf`
- Produces: `npm run verify:app-local-icon-font`

- [ ] **Step 1: Create the verification script**

Use `apply_patch` to add `scripts/verify-app-local-icon-font.mjs` with this exact content:

```js
import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path) => readFileSync(resolve(repoRoot, path), 'utf8')

const uIconVue = read('src/uni_modules/uview-plus/components/u-icon/u-icon.vue')
const util = read('src/uni_modules/uview-plus/components/u-icon/util.js')
const fontPath = resolve(repoRoot, 'src/uni_modules/uview-plus/components/u-icon/upicon.ttf')

if (!existsSync(fontPath)) {
  throw new Error('built-in icon font asset upicon.ttf is missing')
}

if (statSync(fontPath).size <= 0) {
  throw new Error('built-in icon font asset upicon.ttf is empty')
}

const appRemoteFontFace = /#ifdef\s+APP[^\n]*[\s\S]*?@font-face[\s\S]*?at\.alicdn\.com[\s\S]*?#endif/
if (appRemoteFontFace.test(uIconVue)) {
  throw new Error('u-icon.vue still includes an App remote @font-face block')
}

if (!/#ifdef\s+MP-QQ\s+\|\|\s+MP-TOUTIAO\s+\|\|\s+MP-BAIDU\s+\|\|\s+MP-KUAISHOU\s+\|\|\s+MP-XHS/.test(uIconVue)) {
  throw new Error('u-icon.vue should keep the non-App mini-program @font-face condition')
}

if (!/new URL\('\.\/upicon\.ttf',\s*import\.meta\.url\)\.href/.test(util)) {
  throw new Error('util.js should resolve the App built-in font from ./upicon.ttf')
}

if (!/params\.loaded\s*=\s*true;\s*return;[\s\S]*if\s*\(config\.loadFontOnce\)/.test(util)) {
  throw new Error('util.js should mark App built-in font loading once before falling back to loadFontOnce for non-App')
}

if (!/return config\.iconUrl/.test(util)) {
  throw new Error('util.js should keep config.iconUrl for non-App platforms')
}

console.log('app local icon font checks passed')
```

- [ ] **Step 2: Add the npm script**

Use `apply_patch` to insert the verification command after the existing `verify:up-canvas-unification` script in `package.json`:

```json
"verify:up-canvas-unification": "node scripts/verify-up-canvas-unification.mjs",
"verify:app-local-icon-font": "node scripts/verify-app-local-icon-font.mjs"
```

- [ ] **Step 3: Run the verification script and confirm the red phase**

Run:

```powershell
npm run verify:app-local-icon-font
```

Expected: FAIL with this message on the current implementation:

```text
u-icon.vue still includes an App remote @font-face block
```

- [ ] **Step 4: Do not commit yet**

Keep the verification script and `package.json` change unstaged or staged locally, but do not commit the red phase by itself. Task 2 makes the check pass and commits the complete behavior change.

---

### Task 2: Implement App-Local Built-In Font Loading

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-icon/util.js`
- Modify: `src/uni_modules/uview-plus/components/u-icon/u-icon.vue`
- Add: `src/uni_modules/uview-plus/components/u-icon/upicon.ttf`
- Modify: `scripts/verify-app-local-icon-font.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `npm run verify:app-local-icon-font` from Task 1
- Produces: App-local `uicon-iconfont` source selection via `getIconUrl()`, App forced single-load behavior via `markFontLoaded()`, and non-App `config.iconUrl` behavior unchanged

- [ ] **Step 1: Replace `util.js` with App-local source selection**

Use `apply_patch` to replace the whole file `src/uni_modules/uview-plus/components/u-icon/util.js` with this exact content:

```js
import config from '../../libs/config/config';

const iconFontFamily = 'uicon-iconfont';

let params = {
    loaded: false
};

const getIconUrl = () => {
    // #ifdef APP || APP-NVUE
    return new URL('./upicon.ttf', import.meta.url).href;
    // #endif
    return config.iconUrl;
};

const markFontLoaded = () => {
    // App端使用包内本地字体，重复注册没有收益且会放大多图标页面开销。
    // #ifdef APP || APP-NVUE
    params.loaded = true;
    return;
    // #endif
    // 全局加载不稳定，默认关闭，需要开启可以配置loadFontOnce。
    if (config.loadFontOnce) {
        params.loaded = true;
    }
};

// 加载字体方法
const loadFont = () => {
    const iconUrl = getIconUrl();
    markFontLoaded();
    // #ifdef APP-NVUE
    // nvue通过weex的dom模块引入字体，相关文档地址如下：
    // https://weex.apache.org/zh/docs/modules/dom.html#addrule
    const domModule = weex.requireModule('dom');
    domModule.addRule('fontFace', {
        'fontFamily': iconFontFamily,
        'src': `url('${iconUrl}')`
    });
    if (config.customIcon.family) {
        domModule.addRule('fontFace', {
            'fontFamily': config.customIcon.family,
            'src': `url('${config.customIcon.url}')`
        });
    }
    // #endif
    // #ifdef APP || H5 || MP-WEIXIN || MP-ALIPAY
    uni.loadFontFace({
        global: true, // 是否全局生效。微信小程序 '2.10.0'起支持全局生效，需在 app.vue 中调用。
        family: iconFontFamily,
        source: 'url("' + iconUrl + '")',
        success() {
            // console.log('内置字体图标加载成功');
        },
        fail() {
            // console.error('内置字体图标加载出错');
        }
    });
    if (config.customIcon.family) {
        uni.loadFontFace({
            global: true, // 是否全局生效。微信小程序 '2.10.0'起支持全局生效，需在 app.vue 中调用。
            family: config.customIcon.family,
            source: 'url("' + config.customIcon.url + '")',
            success() {
                // console.log('扩展字体图标加载成功');
            },
            fail() {
                // console.error('扩展字体图标加载出错');
            }
        });
    }
    // #endif
    // #ifdef APP-NVUE
    // if (this.customFontFamily) {
    //     domModule.addRule('fontFace', {
    //         'fontFamily': `${this.customPrefix}-${this.customFontFamily}`,
    //         'src': `url('${this.customFontUrl}')`
    //     })
    // }
    // #endif
    return true;
};

export default {
    params: params,
    loadFont
}
```

- [ ] **Step 2: Remove App from the remote CSS font-face condition**

Use `apply_patch` to replace the current `@font-face` condition block in `src/uni_modules/uview-plus/components/u-icon/u-icon.vue`:

```scss
	/* #ifdef APP || MP-QQ || MP-TOUTIAO || MP-BAIDU || MP-KUAISHOU || MP-XHS */
	// 2025/04/09在App/微信/支付宝/鸿蒙元服务已改用uni.loadFontFace加载字体
	@font-face {
		font-family: 'uicon-iconfont';
		src: url('https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf') format('truetype');
	}
	/* #endif */
```

with this exact block:

```scss
	/* #ifdef MP-QQ || MP-TOUTIAO || MP-BAIDU || MP-KUAISHOU || MP-XHS */
	// App端通过uni.loadFontFace加载包内本地字体，避免远程字体阻塞页面渲染。
	@font-face {
		font-family: 'uicon-iconfont';
		src: url('https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf') format('truetype');
	}
	/* #endif */
```

- [ ] **Step 3: Ensure the built-in font asset is tracked**

Confirm the file exists:

```powershell
Get-Item -LiteralPath 'src\uni_modules\uview-plus\components\u-icon\upicon.ttf' | Select-Object Length
```

Expected: the command prints a positive `Length` value. In the current workspace this value is `55940`.

- [ ] **Step 4: Run the targeted verification**

Run:

```powershell
npm run verify:app-local-icon-font
```

Expected:

```text
app local icon font checks passed
```

- [ ] **Step 5: Run the existing nearby verification**

Run:

```powershell
npm run verify:up-canvas-unification
```

Expected:

```text
up-canvas unification checks passed
```

- [ ] **Step 6: Review the final diff**

Run:

```powershell
git diff -- package.json scripts/verify-app-local-icon-font.mjs src/uni_modules/uview-plus/components/u-icon/util.js src/uni_modules/uview-plus/components/u-icon/u-icon.vue
git status --short
```

Expected:

```text
 M package.json
 M src/uni_modules/uview-plus/components/u-icon/u-icon.vue
 M src/uni_modules/uview-plus/components/u-icon/util.js
?? scripts/verify-app-local-icon-font.mjs
?? src/uni_modules/uview-plus/components/u-icon/upicon.ttf
```

Other pre-existing untracked paths such as `.claude/` and `cachePath/` may still appear; do not stage them.

- [ ] **Step 7: Commit the complete implementation**

Run:

```powershell
git add -- package.json scripts/verify-app-local-icon-font.mjs src/uni_modules/uview-plus/components/u-icon/util.js src/uni_modules/uview-plus/components/u-icon/u-icon.vue src/uni_modules/uview-plus/components/u-icon/upicon.ttf
git commit -m '修复 App 端图标字体本地加载' -m 'App 端内置 u-icon 字体改为从包内 upicon.ttf 加载，移除 App 远程 @font-face，并新增验证脚本防止回归。'
```

Expected: commit succeeds with a Chinese head and body.
