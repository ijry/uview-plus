# Cropper 外部图片路径裁剪 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让调用方通过 `chooseImage(index, { imageSrc }, data)` 直接裁剪已有图片路径，同时保持未传路径时的系统选图行为不变。

**Architecture:** 将 `select()` 中“根据图片路径读取尺寸并初始化裁剪界面”的代码抽成共享 `loadImage(path)` 方法。`chooseImage` 只负责解析裁剪配置并在有效 `params.imageSrc` 与原有 `select()` 之间分流，系统选图成功后也调用同一个 `loadImage(path)`，避免两套初始化状态。

**Tech Stack:** Vue 3 Options API SFC、uni-app `uni.chooseImage` / `uni.getImageInfo`、Node.js 静态契约验证、VuePress Markdown 文档。

## Global Constraints

- 公开调用形式固定为 `chooseImage(index, { imageSrc: tempFilePath, ...params }, data)`。
- 仅非空字符串 `params.imageSrc` 跳过 `uni.chooseImage`；缺失、空字符串或非字符串保持原系统选图流程。
- 不新增响应式 `imageSrc` prop，不因数据更新自动打开裁剪界面。
- 不新增 `crop(path, options)` 等并行公开方法。
- 外部路径与系统选图必须共用同一个图片加载及裁剪初始化方法。
- “重选”按钮继续调用 `select()`，允许从外部图片裁剪界面重新打开系统选择器。
- `confirm` 返回结构 `{ avatar, path, index, data }` 不变。
- 不新增远程图片下载或跨域绕过逻辑；路径必须能被当前平台的 `uni.getImageInfo` 和画布读取。
- Git commit 信息必须使用中文，包含 `head + body` 两部分。
- 设计依据：`docs/superpowers/specs/2026-08-19-cropper-external-image-source-design.md`。

## File Map

| File | Responsibility |
| --- | --- |
| `scripts/verify-cropper-image-src.mjs` | 守护 `imageSrc` 分流、共享加载方法、demo、changelog 与脚本注册契约 |
| `package.json` | 暴露 `verify:cropper-image-src` 命令 |
| `src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue` | 实现外部路径分流与共享图片初始化 |
| `src/pages/componentsD/cropper/cropper.nvue` | 演示业务先获取临时路径，再交给 Cropper 裁剪 |
| `src/uni_modules/uview-plus/changelog.md` | 记录 #897 行为和兼容边界 |
| `../uview-plus-doc/docs/components/cropper.md` | 文档化 `params.imageSrc`、调用示例与平台限制 |

---

### Task 1: Add the External-Path Regression Contract

**Files:**
- Create: `scripts/verify-cropper-image-src.mjs`
- Modify: `package.json:42-78`
- Test: `scripts/verify-cropper-image-src.mjs`

**Interfaces:**
- Consumes: component source, cropper demo source, plugin changelog, root `package.json`
- Produces: `npm run verify:cropper-image-src`, exiting `0` only when the external-path contract is present

- [ ] **Step 1: Write the failing verification script**

Create `scripts/verify-cropper-image-src.mjs`:

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const cropper = read('src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue')
const demo = read('src/pages/componentsD/cropper/cropper.nvue')
const changelog = read('src/uni_modules/uview-plus/changelog.md')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
  packageJson.scripts['verify:cropper-image-src'],
  'node scripts/verify-cropper-image-src.mjs',
  'expected package.json to expose verify:cropper-image-src'
)
assert.match(
  cropper,
  /loadImage\(path\)\s*\{[\s\S]*uni\.getImageInfo\(\{[\s\S]*src:\s*path/,
  'expected a shared loadImage(path) method to own image info loading'
)
assert.match(
  cropper,
  /success:\s*\(r\)\s*=>\s*\{[\s\S]*this\.loadImage\(r\.tempFilePaths\[0\]\)/,
  'expected system picker success to reuse loadImage(path)'
)
assert.match(
  cropper,
  /const\s+imageSrc\s*=\s*typeof\s+params\?\.imageSrc\s*===\s*['"]string['"]\s*\?\s*params\.imageSrc\.trim\(\)\s*:\s*['"]['"]/,
  'expected chooseImage to accept only a trimmed string imageSrc'
)
assert.match(
  cropper,
  /if\s*\(imageSrc\)\s*\{[\s\S]*this\.loadImage\(imageSrc\)[\s\S]*return[\s\S]*\}[\s\S]*this\.select\(\)/,
  'expected a valid imageSrc to bypass select and invalid values to keep select'
)
assert.match(
  demo,
  /uni\.chooseImage\([\s\S]*tempFilePaths\[0\][\s\S]*chooseImage\([\s\S]*imageSrc:/,
  'expected demo to obtain a temp path before passing imageSrc to cropper'
)
assert.match(
  changelog,
  /cropper[\s\S]*imageSrc|imageSrc[\s\S]*cropper/,
  'expected changelog to mention cropper imageSrc support'
)

console.log('cropper external image source assertions passed')
```

- [ ] **Step 2: Register the new verification command**

Add beside `verify:cropper-inner` in `package.json`:

```json
"verify:cropper-image-src": "node scripts/verify-cropper-image-src.mjs",
```

- [ ] **Step 3: Run the verifier and confirm it fails for missing behavior**

Run:

```powershell
npm run verify:cropper-image-src
```

Expected: `AssertionError`, first failing on the missing `loadImage(path)` contract or later missing implementation/demo/changelog assertions. It must not fail because the npm script is absent.

- [ ] **Step 4: Commit the red regression contract**

```powershell
git add package.json scripts/verify-cropper-image-src.mjs
git commit -m "增加裁剪器外部图片路径校验" -m "新增 verify:cropper-image-src 静态契约，先锁定共享图片加载、imageSrc 分流、示例与更新日志要求，确保实现前测试处于失败状态。"
```

---

### Task 2: Reuse One Image-Loading Path in Cropper

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue:224-285`
- Modify: `src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue:729-781`
- Test: `scripts/verify-cropper-image-src.mjs`
- Test: `scripts/verify-cropper-inner.mjs`

**Interfaces:**
- Consumes: `chooseImage(index, params, data)`, `select()`, existing `selStyle`, `arWidth`, `arHeight`, `noBar`, `drawInit(true)` state
- Produces: `loadImage(path: string): void` and `params.imageSrc?: string` support in `chooseImage`

- [ ] **Step 1: Extract the existing picker-success initialization into `loadImage(path)`**

Add this method immediately before `select()` and move the existing `uni.getImageInfo` body into it:

```js
loadImage(path) {
  uni.showLoading({ mask: true });
  this.imgPath = path;
  uni.getImageInfo({
    src: path,
    success: r => {
      this.imgWidth = r.width;
      this.imgHeight = r.height;
      this.path = path;
      if (!this.hasSel) {
        let style = this.selStyle || {};
        if (this.arWidth && this.arHeight) {
          let areaWidth = this.arWidth.indexOf('rpx') >= 0 ? parseInt(this.arWidth) * this.pxRatio : parseInt(this.arWidth),
            areaHeight = this.arHeight.indexOf('rpx') >= 0 ? parseInt(this.arHeight) * this.pxRatio : parseInt(this.arHeight);
          style.width = areaWidth + 'px';
          style.height = areaHeight + 'px';
          style.top = (this.windowHeight - areaHeight - tabHeight) / 2 + 'px';
          style.left = (this.windowWidth - areaWidth) / 2 + 'px';
        } else {
          uni.showModal({
            title: t("up.cropper.emptyWidhtOrHeight"),
            showCancel: false
          });
          return;
        }
        this.selStyle = style;
      }

      if (this.noBar) {
        this.drawInit(true);
      } else {
        uni.hideTabBar({
          complete: () => {
            this.drawInit(true);
          }
        });
      }
    },
    fail: () => {
      uni.showToast({
        title: "error3",
        duration: 2000,
      });
    },
    complete() {
      uni.hideLoading();
    }
  });
},
```

Keep the current error messages, crop-box calculation, tabBar behavior, and `drawInit(true)` call unchanged.

- [ ] **Step 2: Make `select()` delegate picker results to `loadImage(path)`**

Replace the current `success` body in `uni.chooseImage` with:

```js
success: (r) => {
  this.loadImage(r.tempFilePaths[0]);
},
```

Keep the existing duplicate-selection guard and picker failure behavior:

```js
fail: () => {
  this.$emit('cancel');
}
```

Remove `const self = this` because the failure callback no longer needs an outer alias.

- [ ] **Step 3: Add the `params.imageSrc` branch to `chooseImage`**

At the beginning of `chooseImage`, normalize params without changing existing configuration fallback behavior:

```js
chooseImage(index = undefined, params = undefined, data = undefined) {
  const imageSrc = typeof params?.imageSrc === 'string' ? params.imageSrc.trim() : '';
  if (params) {
    // keep the existing configuration parsing here
  }
  this.rtn = data;
  this.indx = index;
  if (imageSrc) {
    this.loadImage(imageSrc);
    return;
  }
  this.select();
},
```

Do not add `imageSrc` to `props`, `watch`, or `data`. Do not pass it into the existing crop configuration variables; it is only the source-selection discriminator.

- [ ] **Step 4: Run focused verification**

Run:

```powershell
npm run verify:cropper-image-src
```

Expected: it still fails only on the missing demo or changelog assertion. The component assertions must pass.

Then run:

```powershell
npm run verify:cropper-inner
```

Expected: `cropper inner assertions passed`.

- [ ] **Step 5: Commit the component behavior**

```powershell
git add src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue
git commit -m "支持裁剪器加载外部图片路径" -m "为 chooseImage 增加 params.imageSrc 显式分支，并抽取共享 loadImage 方法，让外部路径与系统选图复用相同的图片信息读取、裁剪框初始化和绘制流程。"
```

---

### Task 3: Demonstrate the Two-Stage Business Flow

**Files:**
- Modify: `src/pages/componentsD/cropper/cropper.nvue:27-75`
- Modify: `src/uni_modules/uview-plus/changelog.md:1`
- Test: `scripts/verify-cropper-image-src.mjs`

**Interfaces:**
- Consumes: `avatarRefExternal.value.chooseImage(index, { imageSrc, ...options })`
- Produces: a visible example where business code calls `uni.chooseImage` first and Cropper receives the returned temporary path

- [ ] **Step 1: Add an external-path demo block**

After the existing “限制在图片内” section, add:

```vue
<view class="u-page__item">
  <text class="u-page__item__title" style="margin-top: 0;">裁剪已有临时图片</text>
  <view class="u-page__item__content">
    <view class="cut-box">
      <view class="avatar-wrapper" @click="chooseExternalImage(3)">
        <up-avatar class="avatar" :src="urls[3]" size="120px"></up-avatar>
      </view>
      <up-cropper @confirm="cutImage" ref="avatarRefExternal"></up-cropper>
    </view>
  </view>
</view>
```

- [ ] **Step 2: Add the demo ref and two-stage selector**

Add beside the existing cropper refs:

```js
const avatarRefExternal = ref(null);
```

Add this method before `cutImage`:

```js
const chooseExternalImage = (index) => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      const imageSrc = res.tempFilePaths[0];
      avatarRefExternal.value.chooseImage(index, {
        imageSrc,
        areaWidth: '300rpx',
        areaHeight: '300rpx',
        exportWidth: '260rpx',
        exportHeight: '260rpx'
      });
    }
  });
};
```

This intentionally shows that the business owns the first selection/camera step and that the Cropper does not open a second selector.

- [ ] **Step 3: Add changelog entry `3.8.110`**

Insert at the top of `src/uni_modules/uview-plus/changelog.md`:

```md
## 3.8.110
feat: cropper 支持外部图片路径直接裁剪（#897）

- `chooseImage` 第二个参数新增 `imageSrc`，可传业务拍照或选图得到的本地临时路径并直接开始裁剪
- 有效 `imageSrc` 会跳过组件内置 `uni.chooseImage`；未传、空字符串或非字符串仍保持原选图行为
- 外部路径与系统选图复用同一套图片信息读取、裁剪框初始化和绘制流程
- “重选”按钮仍打开系统图片选择器；远程地址继续受目标平台读取能力和 H5 跨域限制

```

- [ ] **Step 4: Run the full new contract**

Run:

```powershell
npm run verify:cropper-image-src
```

Expected: `cropper external image source assertions passed`.

- [ ] **Step 5: Commit demo and changelog**

```powershell
git add src/pages/componentsD/cropper/cropper.nvue src/uni_modules/uview-plus/changelog.md
git commit -m "补充裁剪已有图片的示例与日志" -m "演示业务自行获得临时路径后通过 chooseImage 的 imageSrc 参数开始裁剪，并在 3.8.110 更新日志中说明分流规则、重选行为与平台限制。"
```

---

### Task 4: Document `params.imageSrc` in the Sibling Docs Repo

**Files:**
- Modify: `../uview-plus-doc/docs/components/cropper.md:13-15`
- Modify: `../uview-plus-doc/docs/components/cropper.md:154-204`
- Test: `../uview-plus-doc/docs/components/cropper.md`

**Interfaces:**
- Consumes: `chooseImage(index, params, data)` with `params.imageSrc?: string`
- Produces: Composition API and Options API examples plus an exact method-parameter description

- [ ] **Step 1: Expand the basic-use introduction**

Replace the sentence under “基本使用” with:

```md
通过 `ref` 获取组件实例，调用 `chooseImage` 方法选择图片进行裁剪；如果业务已经通过拍照、选图等方式取得临时图片路径，可在第二个参数中传入 `imageSrc` 直接开始裁剪。
```

- [ ] **Step 2: Add a “裁剪已有临时图片” section before Props**

Insert:

````md
### 裁剪已有临时图片

业务可以先自行拍照或选图，再把得到的临时图片路径传给 Cropper。传入有效 `imageSrc` 时，组件不会再次打开系统图片选择器。

```vue
<template>
  <view>
    <button @click="takePhotoAndCrop">拍照或选图后裁剪</button>
    <up-cropper ref="externalCropperRef" @confirm="onExternalConfirm" />
  </view>
</template>
```

<div class="composition-api">

```js
<script setup>
import { ref } from 'vue';

const externalCropperRef = ref(null);
const croppedImage = ref('');

const takePhotoAndCrop = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      externalCropperRef.value.chooseImage(0, {
        imageSrc: res.tempFilePaths[0],
        areaWidth: '300rpx',
        areaHeight: '300rpx'
      });
    }
  });
};

const onExternalConfirm = (rsp) => {
  croppedImage.value = rsp.path;
};
</script>
```

</div>

<div class="options-api">

```js
<script>
export default {
  data() {
    return {
      croppedImage: ''
    }
  },
  methods: {
    takePhotoAndCrop() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.$refs.externalCropperRef.chooseImage(0, {
            imageSrc: res.tempFilePaths[0],
            areaWidth: '300rpx',
            areaHeight: '300rpx'
          });
        }
      });
    },
    onExternalConfirm(rsp) {
      this.croppedImage = rsp.path;
    }
  }
}
</script>
```

</div>
````

- [ ] **Step 3: Expand the method row and notes**

Replace the `chooseImage` method row with:

```md
| chooseImage | 选择图片或加载已有路径并开始裁剪 | (index, params, data) <br> index: 索引标识 <br> params: 配置参数对象；`imageSrc` 为非空字符串时直接加载该路径并跳过系统选图 <br> data: 自定义数据 |
```

Append these notes after the existing item 7:

```md
8. `params.imageSrc` 仅在值为非空字符串时生效；未传、空字符串或非字符串仍会打开系统图片选择器
9. `imageSrc` 必须能被当前平台的 `uni.getImageInfo` 和画布读取；远程地址在 H5 仍受跨域配置限制，组件不会自动下载或转换地址
10. 使用外部路径进入裁剪后，底部“重选”按钮仍会打开系统图片选择器
```

- [ ] **Step 4: Verify the documentation contract**

Run from `D:/Repos/xyito/open/uview-plus`:

```powershell
$doc = Get-Content -Raw '..\uview-plus-doc\docs\components\cropper.md'
if ($doc -notmatch '裁剪已有临时图片') { throw 'missing external image section' }
if ($doc -notmatch 'imageSrc:\s*res\.tempFilePaths\[0\]') { throw 'missing imageSrc example' }
if ($doc -notmatch '跳过系统选图') { throw 'missing picker bypass semantics' }
if ($doc -notmatch 'uni\.getImageInfo') { throw 'missing platform-readable path constraint' }
git -C '..\uview-plus-doc' diff --check
```

Expected: no output and exit code `0`.

- [ ] **Step 5: Build the VuePress documentation**

Run:

```powershell
npm run build
```

Workdir: `D:/Repos/xyito/open/uview-plus-doc`

Expected: VuePress build exits `0`. Ignore only pre-existing non-fatal warnings; do not modify unrelated documentation to silence them.

- [ ] **Step 6: Commit the sibling documentation repo**

```powershell
git -C '..\uview-plus-doc' add docs/components/cropper.md
git -C '..\uview-plus-doc' commit -m "补充裁剪器外部图片路径用法" -m "增加业务自行获取临时路径后通过 chooseImage imageSrc 直接裁剪的组合式与选项式示例，并说明选图分流、重选和跨域限制。"
```

---

### Task 5: Run Final Component Validation

**Files:**
- Verify: `src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue`
- Verify: `src/pages/componentsD/cropper/cropper.nvue`
- Verify: `src/uni_modules/uview-plus/changelog.md`
- Verify: `../uview-plus-doc/docs/components/cropper.md`

**Interfaces:**
- Consumes: all deliverables from Tasks 1-4
- Produces: passing focused contracts and build evidence without additional implementation changes

- [ ] **Step 1: Run both Cropper contract checks**

```powershell
npm run verify:cropper-image-src
npm run verify:cropper-inner
```

Expected:

```text
cropper external image source assertions passed
cropper inner assertions passed
```

- [ ] **Step 2: Run the H5 production build**

```powershell
npm run build:h5
```

Expected: exit code `0`. If an unrelated pre-existing build failure appears, record its exact message and do not expand this feature's scope.

- [ ] **Step 3: Check formatting and repository state**

```powershell
git diff --check
git status --short
git -C '..\uview-plus-doc' diff --check
git -C '..\uview-plus-doc' status --short
```

Expected: no whitespace errors. Both repos should be clean after their task commits, except unrelated changes that existed before execution.

- [ ] **Step 4: Review the final commit history**

```powershell
git log -6 --oneline --decorate
git -C '..\uview-plus-doc' log -3 --oneline --decorate
```

Confirm every new commit uses a Chinese head and a separate Chinese body. No release, version bump, tag, push, or issue close is part of this plan.

---

## Spec Coverage Self-Check

| Spec requirement | Covered by |
| --- | --- |
| `chooseImage` accepts optional `params.imageSrc` | Task 2 Step 3 |
| Valid path skips `uni.chooseImage` | Task 1 contract, Task 2 Step 3 |
| Missing/empty/non-string path preserves picker | Task 1 contract, Task 2 Step 3, Task 3 changelog |
| Shared load and crop initialization | Task 1 contract, Task 2 Steps 1-2 |
| Existing crop configuration/index/data preserved | Task 2 Step 3 |
| Picker cancellation remains `cancel` | Task 2 Step 2 |
| Reselect still opens system picker | unchanged template + Task 3 changelog + Task 4 notes |
| Existing confirm payload unchanged | Global Constraints; no confirm edits in any task |
| Invalid path uses existing image error handling | Task 2 Step 1 |
| No reactive prop or new public method | Global Constraints; Task 2 Step 3 |
| No remote download/cross-origin workaround | Global Constraints; Task 3 changelog; Task 4 notes |
| Demo shows business-owned path acquisition | Task 3 Steps 1-2 |
| Sibling docs updated | Task 4 |
| Existing inner behavior protected | Task 2 Step 4; Task 5 Step 1 |
| Focused verifier and broader builds | Tasks 1, 4, 5 |

## Placeholder and Interface Self-Check

- Every step contains concrete code, commands, expected results, and commit scope.
- The shared method name is consistently `loadImage(path)` in verifier, component steps, and architecture.
- The public field name is consistently `params.imageSrc` and is never introduced as a prop.
- The new command is consistently `verify:cropper-image-src`.
- The demo and docs both use `res.tempFilePaths[0]` as the external path source.
