# APP-NVUE 海报文字与二维码绘制修复设计

## 背景

Android APP-NVUE 海报能够导出图片，但主画布中的文字与通过隐藏二维码组件生成的二维码没有出现在结果中。将 GCanvas 移到视口外或使用 `display: none` 会使依赖原生 `TextureView` 的画布不可渲染；仅给自定义组件添加低透明度样式又无法可靠隐藏其原生子视图，导致内部海报画布和二维码生成器直接出现在页面中。

## 目标

- APP-NVUE 导出的海报正常包含文字和二维码。
- 隐藏画布不遮挡页面、不响应触摸。
- 二维码尺寸变化后使用匹配尺寸的画布生成。
- H5、小程序和 APP-VUE 保持现有行为。

## 方案

### 画布可渲染状态

APP-NVUE 下不再把海报画布和二维码画布移动到远离视口的位置或设置 `display: none`。两个渲染器分别放入真实的原生 `view` 包装层，包装层固定在视口边缘并限制为 `1px`，通过 `overflow: hidden` 裁剪可见内容，同时保留子画布的实际尺寸和原生渲染能力。其他平台继续使用原有屏幕外隐藏方式。

### 画布初始化幂等性

`up-canvas` 首次初始化时清空画布，重复初始化只复用已经启用的原生上下文，不得再次调用 `clearCanvas()`。海报生成期间二维码存在异步等待，延迟的 mounted 初始化若清空复用中的主画布，会删除已经排队的背景、文字和普通图片命令，最终导出只剩最后绘制的二维码。

### 二维码画布刷新

海报生成二维码前更新内容与尺寸，等待 DOM 更新，并强制刷新二维码内部 `up-canvas`。随后调用 `_makeCode()`，等待临时图片路径返回，再加载到海报画布。

### 导出时序

主画布完成所有元素的异步绘制后统一调用 `draw()`。APP-NVUE 等待 300ms 原生渲染窗口后再调用 `toTempFilePath()`，避免 Android Bridge 的同步回调早于 GPU 实际提交完成。

### 原生导出参数

APP-NVUE 的 GCanvas `toTempFilePath()` 第七个参数必须使用空字符串，和 DCloud 官方 NVUE Canvas 示例保持一致。统一画布组件仅在其他平台默认使用 `png`，并保留调用方显式传入的空字符串，避免 Android 原生导出不回调并最终触发超时。

## 错误处理

- 画布刷新、二维码生成、二维码图片加载或导出失败时抛出明确错误。
- 超时定时器在成功或失败后清理，避免后续误改组件状态。
- 不再用二维码占位符掩盖真实二维码图片加载失败。

## 验证

- 新增静态回归校验，覆盖 APP-NVUE 原生裁剪包装层、二维码强制刷新和导出等待。
- 运行现有二维码、海报、画布统一和 APP 构建校验。
- Android 真机确认文字、二维码、背景和普通图片均出现在导出海报中。
> APP-NVUE implementation note: the former GCanvas timing and file-type workarounds are superseded by `2026-08-15-app-nvue-webview-u-canvas-design.md`. APP-NVUE poster, text and QR rendering now share the generic WebView-backed `u-canvas` runtime.
