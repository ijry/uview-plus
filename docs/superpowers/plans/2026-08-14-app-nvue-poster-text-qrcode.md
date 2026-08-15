# APP-NVUE 海报文字与二维码修复实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复 Android APP-NVUE 海报导出后缺少文字和二维码的问题。

**Architecture:** 保留统一 `up-canvas` 架构，只调整 APP-NVUE 隐藏画布的可渲染状态、二维码画布刷新和原生导出时序。通过静态回归脚本锁定平台条件分支，避免影响 H5、小程序和 APP-VUE。

**Tech Stack:** Vue/uni-app、NVUE、GCanvas、Node.js 静态回归脚本。

## Global Constraints

- 仅修改海报、二维码及其 APP-NVUE 回归校验所需代码。
- 不覆盖工作区内其他并行改动。
- 不创建提交。
- APP-NVUE 隐藏画布必须保持布局和原生渲染能力，同时不可见且不可交互。
- 其他平台保持现有屏幕外隐藏方式和导出行为。

---

### Task 1: 添加失败回归校验

**Files:**
- Modify: `scripts/verify-app-nvue-qrcode-poster.mjs`

**Interfaces:**
- Consumes: `u-poster.vue` 的模板、方法和样式源码。
- Produces: 对 APP-NVUE 可渲染隐藏样式、二维码画布刷新及延迟导出的静态断言。

- [ ] **Step 1: 添加 APP-NVUE 隐藏样式断言**

断言海报画布和二维码组件在 APP-NVUE 位于真实的 `1px` 原生包装层中，并通过 `overflow: hidden` 裁剪，不使用 `display: none` 隐藏活动 GCanvas。

- [ ] **Step 2: 添加二维码刷新断言**

断言 `generateQRCode()` 在更新 `qrCodeSize` 后等待 DOM，并调用二维码组件公开的画布刷新方法，再调用 `_makeCode()`。

- [ ] **Step 3: 添加导出等待断言**

断言 `exportImage()` 等待 `posterCanvas.draw()` 完成，并在 APP-NVUE 原生渲染窗口后调用 `toTempFilePath()`。

- [ ] **Step 4: 运行校验确认失败**

Run: `npm run verify:app-nvue-qrcode-poster`

Expected: FAIL，提示缺少 APP-NVUE 可渲染隐藏、二维码刷新或导出等待实现。

### Task 2: 修复二维码画布生命周期

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-qrcode/u-qrcode.vue`
- Modify: `src/uni_modules/uview-plus/components/u-poster/u-poster.vue`

**Interfaces:**
- Produces: `refreshCanvas(force = true): Promise<boolean>`，由海报组件在二维码尺寸变化后调用。
- Consumes: `up-canvas.initCanvas(force)` 与现有 `_makeCode(): Promise<string>`。

- [ ] **Step 1: 暴露二维码画布刷新方法**

在 `u-qrcode.vue` 增加 `refreshCanvas(force = true)`：等待 DOM，非 WebView 分支重新初始化 `up-canvas` 并同步 `canvasHost`、`ctx`；WebView 分支只等待节点就绪。

- [ ] **Step 2: 海报生成前刷新二维码画布**

在 `generateQRCode()` 更新值和尺寸、等待 `$nextTick()` 后调用 `await qrCode.refreshCanvas(true)`，然后调用 `await qrCode._makeCode()`。

- [ ] **Step 3: 二维码图片加载失败时抛错**

将二维码 `uni.getImageInfo()` 失败分支改为 reject，携带生成路径和原始错误，避免用占位符掩盖失败。

### Task 3: 修复 APP-NVUE 隐藏与导出时序

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-poster/u-poster.vue`
- Modify: `src/uni_modules/uview-plus/components/u-canvas/u-canvas.vue`

**Interfaces:**
- Produces: `flushPosterCanvas(posterCanvas): Promise<void>` 与 `waitForNativeRender(): Promise<void>`。
- Consumes: `up-canvas.draw(isLastDraw, callback)` 和 `up-canvas.toTempFilePath(options)`。

- [ ] **Step 1: Promise 化画布提交**

新增 `flushPosterCanvas()`，通过 `posterCanvas.draw(false, callback)` 等待绘制命令提交；回调不可用时也能在下一事件循环继续。

- [ ] **Step 2: APP-NVUE 等待原生渲染**

新增 `waitForNativeRender()`，APP-NVUE 等待 300ms，其他平台立即完成。

- [ ] **Step 3: 重写导出收尾**

在所有元素绘制完成后依次等待 `flushPosterCanvas()`、`waitForNativeRender()`、`posterCanvas.toTempFilePath()`，并使用 `finally` 清理超时定时器和 `showCanvas`。

- [ ] **Step 4: 修复 APP-NVUE 原生导出参数**

`up-canvas.toTempFilePath()` 在 APP-NVUE 默认将 `fileType` 设为空字符串，其他平台保持 `png`；判断参数是否存在时不得使用 `||`，确保调用方显式传入的空字符串不会被覆盖。

- [ ] **Step 5: 添加平台条件隐藏样式**

APP-NVUE 将活动海报与二维码画布放入固定在视口边缘的 `1px` 原生包装层，通过 `overflow: hidden` 裁剪；非 APP-NVUE 保留 `top/left: -10000px`，未活动二维码仅在非 APP-NVUE 使用 `display: none`。

- [ ] **Step 6: 保证重复初始化不清空上下文**

APP-NVUE `up-canvas` 已有 `ctx` 时只复用上下文并触发 ready，不调用 `clearCanvas()`，避免二维码异步生成期间擦除已排队的海报背景、文字和图片命令。

### Task 4: 验证回归与构建

**Files:**
- Verify: `scripts/verify-app-nvue-qrcode-poster.mjs`
- Verify: `src/uni_modules/uview-plus/components/u-poster/u-poster.vue`
- Verify: `src/uni_modules/uview-plus/components/u-qrcode/u-qrcode.vue`

**Interfaces:**
- Consumes: Tasks 1–3 的全部实现。
- Produces: 可交付的 APP-NVUE 海报修复。

- [ ] **Step 1: 运行定向回归**

Run: `npm run verify:app-nvue-qrcode-poster`

Expected: PASS。

- [ ] **Step 2: 运行相邻画布回归**

Run: `npm run verify:up-canvas-unification`

Run: `npm run verify:overlay-qrcode-canvas-init`

Run: `npm run verify:app-canvas-hidpi`

Expected: 全部 PASS。

- [ ] **Step 3: 运行 APP 构建**

Run: `npm run build:app`

Expected: Exit 0；允许仓库既有 NVUE CSS `var(...)` 警告。

- [ ] **Step 4: 检查本次文件格式**

Run: `git diff --check -- scripts/verify-app-nvue-qrcode-poster.mjs src/uni_modules/uview-plus/components/u-poster/u-poster.vue src/uni_modules/uview-plus/components/u-qrcode/u-qrcode.vue docs/superpowers/specs/2026-08-14-app-nvue-poster-text-qrcode-design.md docs/superpowers/plans/2026-08-14-app-nvue-poster-text-qrcode.md`

Expected: Exit 0。
> APP-NVUE implementation note: the former GCanvas timing and file-type workarounds are superseded by `2026-08-15-app-nvue-webview-u-canvas-design.md` and its implementation plan. Use the generic WebView-backed `u-canvas` path for poster, text and QR export.
