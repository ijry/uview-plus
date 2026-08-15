# APP-NVUE WebView u-canvas 后端设计

## 背景

Android APP-NVUE 的 GCanvas 基于原生 `TextureView`。当前海报绘制命令可以进入 GCanvas，但 Android 导出接口存在平台差异：背景 drawable 会触发 `WX_RENDER_ERR_TEXTURE_SETBACKGROUND`，原生 `toTempFilePath()` 也可能不回调，最终让海报导出超时或只保留部分内容。

仓库已经在 `u-qrcode` 中使用 APP-NVUE WebView、`evalJs`、`postMessage` 和 `plus.nativeObj.Bitmap` 生成二维码。这个链路可以承载完整的 Canvas 2D 绘制，但必须由 `u-canvas` 统一对外提供能力，不能让海报、二维码和后续图表分别维护不同的 WebView 协议。

## 目标

- APP-NVUE 的 `u-canvas` 使用 WebView Canvas 作为绘制后端，绕过 GCanvas 导出链路。
- `u-canvas` 保持现有组件调用方式，现有海报、二维码和自定义 Canvas 绘图代码不需要了解 WebView。
- `u-qrcode`、`u-poster` 和未来的自定义图表统一通过 `u-canvas` 绘制和导出。
- 兼容 `ly-canvas` 和 `lyCharts` 已使用的 Canvas 2D 方法、属性和调用习惯。
- H5、小程序、APP-VUE 保持现有 Canvas 后端和导出行为。
- 不引入 ECharts 或其他图表库；未来图形由调用方自行使用 Canvas 2D API 绘制。

## 非目标

- 不在 `local.html` 中实现海报、二维码或图表业务逻辑。
- 不开放传入任意 JavaScript 字符串到 WebView 执行。
- 不在本次改造中实现完整的 WebGL 后端。
- 不改变 `u-poster` 对外的 JSON 配置格式和导出返回结构。

## 对外 API

`u-canvas` 仍然是唯一公开 Canvas 组件。非 APP-NVUE 平台继续使用当前原生 Canvas；APP-NVUE 将 `getRawContext()` 和 `getCanvasContext()` 返回为本地代理上下文。

代理上下文保留现有方法调用风格，同时兼容 Canvas 属性赋值：

```js
const canvas = this.$refs.canvas;
const ctx = canvas.getRawContext();

ctx.fillStyle = '#ffffff';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(20, 20);
ctx.arcTo(120, 20, 120, 100, 16);
ctx.stroke();

await ctx.draw();
const result = await canvas.toTempFilePath({ width: 300, height: 200 });
```

`ctx.draw()` 和 `canvas.draw()` 使用同一个提交队列。`draw(reserve, callback)` 保留现有回调形式，并在 APP-NVUE 返回可等待的 Promise；Promise 在 WebView 完成当前批次及资源加载后才完成。

### 兼容方法

现有 `u-canvas` 已覆盖 `ly-canvas.vue` 的大部分显式封装。本次代理上下文必须补齐以下方法：

- 路径：`arcTo`、`ellipse`。
- 变换：`setTransform`、`transform`、`resetTransform`。
- 线条：`setMiterLimit`、`setLineDash`、`getLineDash`。
- 文字：`strokeText`。
- 样式：`globalCompositeOperation`、`fillStyle`、`strokeStyle`、`lineWidth`、`lineCap`、`lineJoin`、`miterLimit`、`globalAlpha`、`font`、`textAlign`、`textBaseline`。
- 资源：`createPattern`，以及带 `addColorStop` 的线性和径向渐变对象。
- 生命周期和像素：`draw`、`toTempFilePath`、`getImageData`、`putImageData`。

方法同时提供组件级别的显式包装，原始上下文代理也提供同名方法和属性，从而兼容 `lyCharts` 中直接使用 `ctx.fillStyle`、`ctx.font`、`ctx.arcTo()` 和 `ctx.draw()` 的代码。

`measureText()` 保持同步返回值，以兼容现有图表布局代码；APP-NVUE 代理使用本地可重复的字体宽度估算。另提供异步精确测量入口，供需要 WebView 字体实际指标的新代码使用。

## APP-NVUE 后端

### 组件模板

APP-NVUE 的 `u-canvas` 使用一个真实的 `<web-view>` 作为内部 Canvas 容器，WebView 的实际宽高与画布逻辑尺寸一致。需要隐藏画布的组件继续在外层使用 `1px` 包装层和 `overflow: hidden`，不使用 `display: none`，保证 WebView 保持活动状态。

H5、小程序和 APP-VUE 保留当前 `<canvas>` 条件分支；APP-NVUE 的 GCanvas 分支由 WebView 后端完整替换。

### 本地上下文代理

APP-NVUE 首次初始化时创建一个命令队列和 WebView 会话。代理方法不直接访问不存在于 NVUE JavaScript 上下文中的浏览器 Canvas 对象，而是将操作记录为可序列化命令：

- 绘图方法记录操作名和参数。
- 属性赋值记录状态变更。
- 渐变和图案返回带资源 ID 的本地代理对象。
- `drawImage` 将本地图片或远程图片解析为 WebView 可读取的 Data URL，并缓存资源。
- `draw(false)` 在 WebView 中清理上一帧后执行当前批次；`draw(true)` 保留上一帧。
- 批次成功后清理已提交命令，失败则只拒绝当前请求，不遗留悬挂 Promise。

图片、像素数据和命令批次通过带 `requestId` 的分片协议传输，避免单次 `evalJs` 参数过大。分片只属于内部传输细节，不暴露给 `u-canvas` 调用方。

### `local.html` 职责

`src/static/app-plus/up-canvas/local.html` 改造成通用宿主页面，只负责：

- 加载 `uni.webview.min.js` 和通用运行时脚本。
- 创建和维护 HTML Canvas。
- 接收 `u-canvas` 命令分片并按顺序执行。
- 等待图片、渐变和其他 Canvas 资源就绪。
- 回传 `canvasReady`、统一的 `canvasResponse`、`canvasTouch` 和 `canvasError` 事件。
- 使用 `plus.nativeObj.Bitmap` 优先在 WebView 内保存 PNG，减少大图片 Base64 穿过 WebView 桥接；不可用时回传 Base64，由 `u-canvas` 侧保存。

页面不包含海报或二维码业务分支。旧二维码 `setContent()` 入口随 `u-qrcode` 同步迁移而移除，避免长期维护两套协议。

## 组件迁移

### `u-qrcode`

APP-NVUE 不再维护独立二维码 WebView 生成分支。二维码组件改为使用内部 `up-canvas`，现有二维码算法继续在组件侧生成绘图调用，二维码 Logo 通过 `u-canvas.drawImage()` 加入同一命令队列。二维码导出使用 `u-canvas.toTempFilePath()`。

这样二维码和海报的绘制、图片加载、导出和错误处理完全一致，也避免两个 WebView 同时存在时的生命周期竞争。

### `u-poster`

海报现有的 `drawItem()` 继续调用 `u-canvas` 的矩形、文字、图片、渐变和二维码方法。APP-NVUE 不再依赖 GCanvas 的原生提交延迟或空文件类型约定；`flushPosterCanvas()` 等待 `u-canvas.draw()` 的 WebView 完成回执后直接导出。

海报外部 API、元素类型和返回值保持不变。

## 事件和错误

- 每个 WebView 会话维护单调递增的 `requestId`，过期响应直接丢弃。
- `ready` 未到达、命令执行失败、图片加载失败、导出失败和桥接异常都转成 `u-canvas` Promise rejection。
- 导出超时保留兜底计时器，计时器在成功、失败和组件销毁时清理。
- WebView 不接收任意调用方 JavaScript，只接收白名单 Canvas 命令和资源数据。
- Canvas 触摸事件通过 `canvasTouch` 由 WebView 转发到 `u-canvas`，继续触发 `touchstart`、`touchmove`、`touchend` 事件。

## 验证

- 静态校验 `u-canvas` 代理方法、属性映射、命令分片协议和 `local.html` 消息类型。
- 使用现有 `u-poster` 示例验证背景、普通图片、文字、多个二维码和带 Logo 二维码。
- 使用 `arcTo`、属性赋值、渐变、变换、文字测量和 `draw(true)` 编写最小自定义图形回归。
- 验证 `getImageData`、`putImageData` 和 `toTempFilePath` 的 Promise 成功与失败路径。
- 运行现有二维码、海报、画布统一、HiDPI 和 APP 构建校验。
- Android 真机完整编译安装，确认页面显示、海报导出和二维码 Logo 均正常。
