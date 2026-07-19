# up-canvas 统一承载设计

## 背景

`u-barcode`、`u-qrcode`、`u-cropper`、`u-poster`、`u-upload` 仍在组件内部直接使用 uni-app 内置 `<canvas>`。`u-signature` 已通过 `up-canvas` 间接承载画布，但当前 `up-canvas` 的跨平台封装不完整，无法直接覆盖上述组件的绘图、导出和像素读写场景。

本次改造的目标是让业务组件不再直接声明 `<canvas>`，统一通过 `up-canvas` 承载画布节点。`up-canvas` 内部继续按平台使用 uni-app `<canvas>` 或 APP-NVUE 的 `gcanvas`。

## 目标

- `u-barcode`、`u-qrcode`、`u-cropper`、`u-poster`、`u-upload` 模板中不再直接出现 `<canvas>`。
- 上述组件改为通过 `<up-canvas>` 获取上下文、绘制、导出图片或读写像素。
- `up-canvas` 参考 `ly-canvas` 补齐 MP/H5 的 2D canvas 节点获取、DPR backing store、`ready` 事件和常用 API 包装。
- APP-NVUE 尽量统一由 `up-canvas` 内部的 `gcanvas` 承载，业务组件不直接依赖 `gcanvas`。
- 保持现有组件 props、事件和主要行为不变。

## 非目标

- 不做版本发布、版本号 bump 或 changelog 发布流程。
- 不重写条码、二维码、裁剪或海报算法。
- 不引入新依赖。
- 不解决现有无关工作区改动。

## 方案

采用“先补底座，再迁移组件”的方案。

`up-canvas` 负责统一节点生命周期和上下文差异。它需要提供 `ready` 事件、`initCanvas(force)`、`refresh()`、`getRawContext()`、`getCanvasNode()`、`getCanvasElement()`、`exportImage()`、`toTempFilePath()`、`getImageData()`、`putImageData()` 以及常用绘图方法包装。包装方法优先兼容 uni-app 旧 CanvasContext 的 `setFillStyle`、`draw` 等 API，同时兼容 2D canvas node 的标准属性 API。

业务组件只依赖 `up-canvas` 的公开方法或 `getRawContext()` 返回的上下文。对于旧 CanvasContext 和 2D canvas node 的差异，组件内部不再直接通过 `uni.createCanvasContext`、`uni.createSelectorQuery().select('<canvas>')` 或 `canvasToTempFilePath` 访问原始 canvas，除非被封装在 `up-canvas` 方法内部。

## 组件迁移

### u-barcode

把可见条码画布改成 `up-canvas`。`useCanvas=true` 时绘制到可见 `up-canvas`；`useCanvas=false` 时仍生成图片，但临时画布也由隐藏的 `up-canvas` 承载，避免直接 `<canvas>`。

### u-qrcode

模板中的 MP/H5/APP-PLUS `<canvas>` 和 APP-NVUE `gcanvas/web-view` 分支统一收敛到 `up-canvas`。二维码组件继续使用现有 `qrcode.js` 生成矩阵和绘制逻辑，但上下文来源改为 `up-canvas`。带 icon 的 nvue 特殊路径优先迁移到 `up-canvas` 能力；如果 `gcanvas` 图片能力不足，保留组件内部已有降级逻辑但不直接声明 canvas。

### u-cropper

三个画布层改为三个 `up-canvas`：主图层、操作层、预览层。原来的 `ctxCanvas`、`ctxCanvasOper`、`ctxCanvasPrv` 改为从对应 `up-canvas` 获取。裁剪导出、图片数据读写通过 `up-canvas` 的 `toTempFilePath()`、`getImageData()`、`putImageData()` 封装完成。

### u-poster

隐藏海报画布改为 `up-canvas`，绘制和导出通过该实例完成。隐藏二维码仍使用 `up-qrcode`，但 `up-qrcode` 自身会在本次迁移中使用 `up-canvas`。

### u-upload

隐藏视频首帧画布改为 `up-canvas`。原本微信端通过 `#myCanvas` 获取 2D node 并调用 `wx.canvasToTempFilePath`，迁移后通过 `up-canvas.getCanvasElement()` 取得节点绘制，通过 `up-canvas.toTempFilePath()` 导出，避免模板直接声明 `<canvas>`。

## 错误处理

- `up-canvas` 初始化失败时返回 `false` 并输出明确错误，不抛出影响页面渲染的异常。
- 业务组件在画布未 ready 时等待 `initCanvas(true)` 或短暂延迟后重试一次。
- 导出、读写像素失败时保持现有 `fail`、`error` 或事件回调路径。

## 测试与验证

- 新增脚本验证指定组件模板中不再直接出现 `<canvas>`，并验证这些组件包含 `up-canvas`。
- 验证 `up-canvas` 包含迁移需要的核心 API：绘制、样式、导出、像素读写、节点访问。
- 运行现有可用静态验证脚本；如果 `type-check` 存在历史无关错误，只记录不把无关错误算作本次失败。
- 至少运行一次 H5 或微信小程序构建命令来发现模板和条件编译问题，优先使用 `npm run build:h5`。

## 风险

- APP-NVUE 的图片绘制能力依赖 `gcanvas`，二维码 icon 或复杂海报图片绘制可能仍受平台能力限制。
- `u-cropper` 依赖多层 canvas 和像素读写，是迁移中风险最高的组件。
- `u-upload` 的视频首帧截取原本依赖微信 2D canvas node，其他平台行为不会因此扩大承诺。
