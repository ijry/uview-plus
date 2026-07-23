# Cropper inner 限制裁剪框在图片内 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 暴露并修齐 `u-cropper` 的 `inner` 能力，使裁剪框始终落在图片内，满足 issue #921。

**Architecture:** 复用组件既有 `isin`/`inner` 拖动缩放夹紧逻辑；对齐 `chooseImage` 的旋转禁用；在 `inner + canChangeSize` 时给 resize 增加图片边界校验；补 demo 与文档。

**Tech Stack:** Vue SFC (uview-plus/uni-app)、Node 静态断言脚本、Markdown 文档仓。

## Global Constraints

- 默认 `inner=false`，不得改变现有默认拖动行为。
- 不新增 `limitInside` 等别名。
- `inner=true` 时必须禁用旋转（手势 + 底部按钮）。
- 不强制同步 `uview-ultra`。
- Git commit 信息必须中文，且包含 head + body。
- 设计依据：`docs/superpowers/specs/2026-07-24-cropper-inner-limit-design.md`

---

### Task 1: 静态校验脚本

**Files:**
- Create: `scripts/verify-cropper-inner.mjs`
- Modify: `package.json`（增加 script 条目，若项目有 scripts 段）

**Interfaces:**
- Consumes: `src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue` 源码文本
- Produces: `node scripts/verify-cropper-inner.mjs`，通过则 exit 0

- [ ] **Step 1: 编写校验脚本**

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const cropper = readFileSync(
  resolve(root, 'src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue'),
  'utf8'
)
const demo = readFileSync(
  resolve(root, 'src/pages/componentsD/cropper/cropper.nvue'),
  'utf8'
)
const changelog = readFileSync(
  resolve(root, 'src/uni_modules/uview-plus/changelog.md'),
  'utf8'
)

assert.match(cropper, /inner:\s*false/, 'expected inner prop default false')
assert.match(
  cropper,
  /this\.letRotate\s*=\s*\(canRotate\s*===\s*false\s*\|\|\s*this\.isin\)\s*\?\s*0\s*:\s*1/,
  'expected chooseImage to disable rotate when inner/isin is active'
)
assert.match(
  cropper,
  /this\.letRotate\s*=\s*\(this\.canRotate\s*===\s*false\s*\|\|\s*this\.inner\s*===\s*true\)\s*\?\s*0\s*:\s*1/,
  'expected created() to disable rotate when inner is true'
)
assert.match(
  cropper,
  /isin[\s\S]*imgWidth[\s\S]*selStyle/,
  'expected move/clamp path to consider isin and selection bounds'
)
assert.match(demo, /:inner\s*=\s*["']true["']|inner:\s*true/, 'expected demo to show inner usage')
assert.match(changelog, /inner/, 'expected changelog to mention inner')

console.log('cropper inner assertions passed')
```

- [ ] **Step 2: 运行确认当前失败（实现前）**

Run: `node scripts/verify-cropper-inner.mjs`  
Expected: 至少因 chooseImage 的 letRotate 正则、demo、changelog 失败。

- [ ] **Step 3: 提交脚本**

```bash
git add scripts/verify-cropper-inner.mjs package.json
git commit -m "test: 增加 cropper inner 静态校验

用于守护 chooseImage 旋转禁用、demo 与 changelog 对 inner 的暴露。"
```

---

### Task 2: 对齐 chooseImage 旋转禁用 + resize 图片边界

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue`

**Interfaces:**
- Consumes: 既有 `isin`、`selStyle`、`useWidth/useHeight/scaleSize/posWidth/posHeight`
- Produces: `chooseImage` 在 `inner===true` 时 `letRotate=0`；resize 时裁剪框不超出图片显示矩形

- [ ] **Step 1: 修改 chooseImage 内 letRotate**

将：

```js
this.letRotate = canRotate === false ? 0 : 1;
// ...
this.isin = inner === true ? 1 : 0;
```

改为先设 isin，再统一计算：

```js
this.isin = inner === true ? 1 : 0;
this.letRotate = (canRotate === false || this.isin) ? 0 : 1;
this.letScale = canScale === false ? 0 : 1;
```

注意：若原代码 `letRotate` 在 `isin` 赋值之前，必须调整顺序。

- [ ] **Step 2: 为 resize 增加图片边界夹紧**

在 `move` 的 `resizeHandle && letChangeSize` 分支中，在通过最小尺寸与屏幕边界校验后，若 `this.isin`，计算当前图片显示矩形并夹紧：

```js
// 在已算出 style（含 left/top/width/height 字符串）且 min 尺寸通过后：
let nl = parseInt(style.left)
let nt = parseInt(style.top)
let nw = parseInt(style.width)
let nh = parseInt(style.height)

// 屏幕边界（已有逻辑可合并）
nl = Math.max(0, nl)
nt = Math.max(0, nt)
if (nl + nw > this.windowWidth) nw = this.windowWidth - nl
if (nt + nh > this.windowHeight - tabHeight) nh = this.windowHeight - tabHeight - nt

if (this.isin) {
  const imgWidth = this.useWidth * this.scaleSize
  const imgHeight = this.useHeight * this.scaleSize
  const rx0 = this.posWidth + this.useWidth / 2
  const ry0 = this.posHeight + this.useHeight / 2
  const imgL = rx0 - imgWidth / 2
  const imgT = ry0 - imgHeight / 2
  const imgR = imgL + imgWidth
  const imgB = imgT + imgHeight

  // 夹紧：裁剪框完全落在图片内
  if (nl < imgL) nl = imgL
  if (nt < imgT) nt = imgT
  if (nl + nw > imgR) nw = imgR - nl
  if (nt + nh > imgB) nh = imgB - nt
}

const minWidth = 50
const minHeight = 50
if (nw >= minWidth && nh >= minHeight) {
  style.left = nl + 'px'
  style.top = nt + 'px'
  style.width = nw + 'px'
  style.height = nh + 'px'
  this.selStyle = style
  this.drawInit()
}
```

实现时以组件内现有变量名为准，保持与既有 pan clamp 同一套几何定义（中心点 + useWidth/useHeight + scaleSize）。

- [ ] **Step 3: 提交组件修改**

```bash
git add src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue
git commit -m "fix: 对齐 cropper inner 模式下的旋转禁用与 resize 边界

chooseImage 开启 inner 时同步禁用旋转；可调裁剪框时限制在图片显示范围内，避免裁出空白。"
```

---

### Task 3: 示例页增加 inner 演示

**Files:**
- Modify: `src/pages/componentsD/cropper/cropper.nvue`

**Interfaces:**
- Consumes: `up-cropper` 的 `inner` prop / `chooseImage` params
- Produces: 页面可见的「限制在图片内」示例

- [ ] **Step 1: 增加第三组示例**

在「可变大小」块后增加：

```vue
<view class="u-page__item">
  <text class="u-page__item__title" style="margin-top: 0;">限制在图片内</text>
  <view class="u-page__item__content">
    <view class="cut-box">
      <up-cropper
        @confirm="cutImage"
        ref="avatarRefInner"
        :inner="true"
        :canChangeSize="false"
        areaWidth="300rpx"
        areaHeight="300rpx"
        exportWidth="260rpx"
        exportHeight="260rpx"
      >
        <view class="avatar-wrapper">
          <up-avatar class="avatar" :src="urls[2]" size="120px"></up-avatar>
        </view>
      </up-cropper>
    </view>
  </view>
</view>
```

script 中增加：

```js
const avatarRefInner = ref(null);
```

`cutImage` 已用 `rsp.index` 写 `urls`，头像裁剪默认 index 可能为 undefined；prop 路径触发的 confirm 可能 index 为空。为稳妥：

- 头像裁剪与 inner 示例若走插槽点击，`index` 可能是 `undefined`；可在 `@confirm` 里兼容：

```js
const cutImage = (rsp) => {
  console.log(rsp);
  const i = rsp.index === undefined || rsp.index === null ? 0 : rsp.index;
  urls.value[i] = rsp.path;
};
```

注意：现有头像示例也是 index undefined → 写 urls[0]；inner 示例若同样 undefined 会覆盖 urls[0]。更好做法：inner 示例通过外层点击 + chooseImage 传 index=2：

```vue
<view class="avatar-wrapper" @click="chooseImageInner(2)">
  <up-avatar class="avatar" :src="urls[2]" size="120px"></up-avatar>
</view>
<up-cropper @confirm="cutImage" ref="avatarRefInner"></up-cropper>
```

```js
const chooseImageInner = (index) => {
  avatarRefInner.value.chooseImage(index, {
    inner: true,
    canChangeSize: false,
    areaWidth: '300rpx',
    areaHeight: '300rpx',
    exportWidth: '260rpx',
    exportHeight: '260rpx'
  });
};
```

**推荐后者**（chooseImage + index=2），同时演示 params.inner。

- [ ] **Step 2: 提交示例**

```bash
git add src/pages/componentsD/cropper/cropper.nvue
git commit -m "docs: cropper 示例增加 inner 限制演示

通过 chooseImage 传入 inner:true，演示裁剪框限制在图片内。"
```

---

### Task 4: 文档与 changelog

**Files:**
- Modify: `D:/Repos/xyito/open/uview-plus-doc/docs/components/cropper.md`（独立文档仓）
- Modify: `src/uni_modules/uview-plus/changelog.md`

**Interfaces:**
- Produces: 用户可查到 `inner` API；changelog 可检索

- [ ] **Step 1: 更新 Props 表**

在 `canRotate` 行后增加：

```md
| inner | 是否限制裁剪框始终在图片内（开启后不可旋转） | boolean | false | true/false |
```

注意事项增加：

```md
6. 设置 `inner` 为 `true` 时，裁剪框始终保持在图片范围内，适合头像等禁止留白场景；该模式下旋转会被禁用
7. `chooseImage` 的第二个参数也可传 `inner: true` 临时开启
```

- [ ] **Step 2: changelog 顶部增加条目**

在 `## 3.8.82` 之上新增（若尚未发版可用 unreleased 或并入下一版本段；本仓习惯直接写下一版本号或当前修复说明）：

```md
## 3.8.83
feat: cropper 支持并文档化 inner 限制裁剪框在图片内

- 暴露 `inner` 属性：开启后拖动/缩放保持裁剪框在图片内，并禁用旋转（#921）
- 修复 `chooseImage` 开启 `inner` 时未同步禁用旋转的问题
- `inner + canChangeSize` 时调整裁剪框也限制在图片显示范围内
- 补充组件示例
```

若版本号已被占用，按实际最新版本 +1。

- [ ] **Step 3: 提交**

组件仓：

```bash
git add src/uni_modules/uview-plus/changelog.md
git commit -m "docs: 记录 cropper inner 能力与修复

说明 #921 相关 inner 暴露、chooseImage 旋转对齐与 resize 边界限制。"
```

文档仓 `uview-plus-doc` 单独提交（若在该目录有 git）：

```bash
cd D:/Repos/xyito/open/uview-plus-doc
git add docs/components/cropper.md
git commit -m "docs: cropper 补充 inner 属性说明

说明限制裁剪框在图片内的用法、副作用及 chooseImage 传参。"
```

---

### Task 5: 跑通静态校验并收尾

**Files:** 无新增

- [ ] **Step 1: 运行**

```bash
node scripts/verify-cropper-inner.mjs
```

Expected: `cropper inner assertions passed`

- [ ] **Step 2: 人工检查清单**

1. 默认头像裁剪：仍可拖出框外  
2. 限制在图片内：拖不动出框、缩不到露边、无旋转  
3. 可变大小 + 如需可另测 inner+canChangeSize  

- [ ] **Step 3: 确认 git status 干净（除无关 untracked）**

---

## Spec coverage self-check

| Spec 要求 | Task |
| --- | --- |
| 暴露/文档化 inner | Task 3, 4 |
| 默认 false 兼容 | Task 2 不改默认 |
| chooseImage 旋转对齐 | Task 2 Step 1 |
| resize 限制在图片内 | Task 2 Step 2 |
| demo | Task 3 |
| changelog | Task 4 |
| 静态守护 | Task 1, 5 |
| 不同步 ultra | 全任务未涉及 |

## Placeholder scan

无 TBD/TODO；代码块含具体替换内容。
