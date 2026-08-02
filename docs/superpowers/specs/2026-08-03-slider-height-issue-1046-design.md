# Slider Height Issue #1046 设计

## 背景

GitHub issue #1046 报告 `u-slider.vue` 设置非空 `height` 后报错。当前 3.x 组件在 `mounted` 中判断 `this.height != ''`，却把 `sizeLocal` 赋值为未声明变量 `val`，因此在获取滑块尺寸和执行 `init()` 前稳定抛出 `ReferenceError`。

该问题由垂直模式改造提交 `64a6c0320` 引入，并在合并重复 `mounted` 生命周期后开始实际触发。`height` 是既有兼容参数，`size` 是垂直模式新增的统一厚度参数，预期优先级应为：非空 `height` 优先，否则回退 `size`。

## 目标

- 修复非空 `height` 导致的 mounted 阶段运行时错误。
- 保留旧 `height` 参数对轨道厚度的覆盖能力。
- 保留未设置 `height` 时使用 `size` 的现有行为。
- 增加可重复执行的回归校验，覆盖两个初始化分支。
- 以 patch 版本发布 uview-plus 3.8.94。

## 非目标

- 不重构 slider 的布局、触摸或垂直模式实现。
- 不把 `sizeLocal` 改为响应式 computed，也不扩展运行时动态切换参数的语义。
- 不修改或发布 uview-ultra 4.x；其 Vue 与 UVue slider 均直接使用 `height`，不存在同一错误路径。
- 不修改文档站的 API 文档；`height` 已有说明，问题属于实现回归。

## 方案比较

### 方案一：修正 mounted 赋值

将 `this.sizeLocal = val` 改为 `this.sizeLocal = this.height`。这是推荐方案，改动最小，直接恢复既有兼容语义，不影响 `size` 回退和其他 slider 逻辑。

### 方案二：将 `sizeLocal` 改为 computed

使用 `height || size` 派生厚度，可额外支持挂载后动态变更参数，但会扩大响应式与样式更新范围，不是 issue 所需，回归风险更高。

### 方案三：移除 `height` 兼容分支

只保留 `size` 可以绕开错误，但会破坏已公开且示例仍在使用的 `height` API，不可接受。

## 实现设计

1. 新增 `scripts/verify-slider-height.mjs`，读取实际 SFC 源码并提取 mounted 起始处的厚度初始化分支。
2. 校验脚本通过 `Function` 执行提取出的真实初始化代码：非空 `height='4px'` 必须得到 `sizeLocal='4px'`，空 `height` 必须回退到 `size`。
3. 校验脚本同时断言源码不存在 `this.sizeLocal = val`，示例页仍包含非空 `height` 用例，并在 `package.json` 注册专用命令。
4. 先运行校验确认当前代码失败，再只修改 `u-slider.vue` 的错误赋值并确认校验通过。

## 发布设计

- 使用独立干净 worktree，避免主工作区插件目录内未跟踪的 `u-tabs-pro` 被打入发布包。
- 发布说明使用 UTF-8 notes 文件，不包含版本标题，由发布脚本自动生成 changelog 区块。
- 先用 Git Bash 执行一次 `--dry-run --bump patch`，确认目标版本为 3.8.94。
- 实际发布使用 Git Bash 后台执行并记录日志；同一版本只执行一次，失败或状态不明时不自动重试。
- 发布成功后显式提交版本和 changelog，快进合并到 `3.x` 并推送；所有提交使用中文 head 与 body。

## 验证

- `node scripts/verify-slider-height.mjs`
- `node scripts/verify-slider-decimal-step.mjs`
- `npm run type-check`，若存在与本改动无关的基线错误则记录具体文件和错误。
- 发布前检查插件目录无未跟踪文件，发布后核对 package version、changelog、发布日志和 Git 工作区范围。
