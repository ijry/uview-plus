# u-lottie 动画组件设计（纯 JS + u-canvas）

## 背景

示例项目需要一个与 DCloud 插件 zl-lottie（id=28092）功能对齐的 Lottie 动画组件，用于加载 AE 导出的 Lottie JSON 并播放。

zl-lottie 的 App 端依赖 UTS 原生插件和 lottie-android / lottie-ios，必须自定义基座调试，接入成本高。本项目是纯 JS 组件库，且 nvue 已不是重点，因此不产出原生插件，改用现有 `u-canvas` 承载 canvas 渲染器，在 Web / App-Vue / 微信小程序 / HarmonyOS 上提供统一的组件 API。

## 目标

- 提供 `u-lottie` 组件，API 与 zl-lottie 对齐：
  - props：`filePath`、`contentModel`、`loop`
  - 方法：`playAnimation()`、`pauseAnimation()`、`resumeAnimation()`、`cancelAnimation()`
  - 事件：`statechange`
- 支持 H5、App-Vue（iOS / Android）、微信小程序。
- APP-HARMONY 使用旧版 Canvas API 适配，作为尽力而为的兼容实现。
- 不修改页面文件扩展名，不引入 UTS 原生插件，不要求自定义基座。
- nvue、其他小程序等不可用平台不发散报错，统一通过 `statechange` 的 `error` 类型暴露。
- 仅新增组件、渲染引擎资源、示例页和示例 JSON，不改动现有组件行为。

## 非目标

- 不支持 APP-NVUE。`u-canvas` 的 nvue 分支通过 `<web-view>` 指令桥渲染，依赖使用方项目中的 `static/app-plus/up-canvas` 资产，且每帧命令需要序列化后 `postMessage`，不适合持续动画。若后续必须支持，再单独评估。
- 不支持支付宝、百度、抖音等其他小程序。`lottie-miniprogram` 依赖微信 canvas 节点能力。
- 不追求 HarmonyOS 与 Web 完全一致的滤镜、混合模式、像素级效果和全部表达式。
- 不新增组件文档站页面、TS 类型声明和独立验证脚本（沿用当前交付范围：组件 + 引擎资源 + 示例页 + 示例 JSON）。
- 不改造 `u-canvas` 的既有接口。`u-lottie` 只消费其 `ready` 事件、`getCanvasElement()`、`getRawContext()` 和 `width` / `height` 等既有能力。

## 平台矩阵

| 平台 | 渲染方案 | 支持程度 | 本地可验证 |
| --- | --- | --- | --- |
| H5 | lottie-web 5.13.0，SVG 渲染器 | 完整 | 是 |
| App-Vue（iOS / Android） | lottie-web 5.13.0，SVG 渲染器 | 完整 | 需真机或模拟器运行 |
| APP-HARMONY | `u-canvas` + lottie-miniprogram 1.0.12 + 旧版 CanvasContext 适配层 | 尽力而为，常见矢量动画 | 否，本机无鸿蒙环境 |
| MP-WEIXIN | `u-canvas` + lottie-miniprogram 1.0.12 | 常见矢量动画，单实例 | 编译可验证，运行需微信开发者工具 |
| APP-NVUE | 不支持 | 发 `error` | 否 |
| 其他小程序 | 不支持 | 发 `error` | 否 |

## 方案总览

### 引擎双轨

1. **Web 轨（H5 / App-Vue）**
   - 引入 `lottie-web@5.13.0` 的 `lottie_svg.min.js`（约 242KB，含表达式支持）。
   - App-Vue 使用 `// #ifdef APP-PLUS` 静态引入（内部嵌套 `// #ifndef APP-NVUE` 排除 nvue），与 webview 生命周期同步加载。
   - H5 使用 `// #ifdef H5` 动态 `import()`，模块级缓存，失败时重置缓存以便重试。引擎被拆分为独立异步 chunk，仅在 `u-lottie` 挂载后按需拉取，不进入共享入口包。
   - 组件模板在对应平台渲染一个普通 `<view>` 容器，由 `lottie.loadAnimation({ container, renderer: 'svg', ... })` 挂载 SVG。
   - App-Vue 运行在 webview 中，有 DOM，因此不需要 renderjs。
2. **Canvas 轨（MP-WEIXIN / APP-HARMONY）**
   - 引入 `lottie-miniprogram@1.0.12`（约 205KB，基于 lottie-web 5.5.7 的 canvas 渲染器）。
   - 条件编译：`// #ifdef MP-WEIXIN || APP-HARMONY`。
   - 组件内部条件引入 `u-canvas`，以其作为画布宿主；数据加载完成并测量尺寸后再渲染 `u-canvas`，拿到 `ready` 后初始化引擎。
   - 微信小程序直接把 `u-canvas` 暴露的 2d canvas 节点交给 `setup()`。
   - 鸿蒙没有 DOM canvas 节点，构造一个标准 2D 上下文适配器，底层转发到 `u-canvas` 的旧版 `CanvasContext`。

### 为什么不用原生插件

- 原生插件需要 UTS 编译、自定义基座、Android/iOS 各自引入 Lottie SDK，无法在纯 JS 组件库中开箱即用。
- 当前用户明确 nvue 不再重要，用 JS + `u-canvas` 已能覆盖小程序和鸿蒙的主要使用场景。

### 为什么 H5 / App-Vue 不用 `u-canvas`

- SVG 渲染器在 Web 上质量、性能和文本支持均优于 canvas 渲染器，且不需要处理 DPR。
- `u-canvas` 的 H5 分支是 canvas 2d，使用它会丢失 SVG 矢量渲染优势。
- `u-canvas` 只用于必须走 canvas 的平台。

## 组件 API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| filePath | String | `''` | 动画 JSON 路径。支持 http(s) URL；H5 / App-Vue 额外支持本地静态路径。小程序和鸿蒙的本地路径受平台限制，建议改用 `animationData`。 |
| animationData | Object | `null` | 直接传入 Lottie JSON 对象，优先级高于 `filePath`。用于本地内置 JSON 和离线场景，是对 zl-lottie 的兼容扩展。 |
| contentModel | String | `'AspectFill'` | 内容填充模式：`ScaleToFill` / `AspectFill` / `Center`。 |
| loop | Boolean | `false` | 是否循环播放。 |
| autoplay | Boolean | `true` | 数据加载和引擎初始化完成后是否自动播放。zl-lottie 未暴露该属性，这里作为兼容扩展。 |

### 方法

| 方法 | 说明 |
| --- | --- |
| playAnimation() | 从头或从当前位置播放；引擎未就绪时记录待播放标记，就绪后执行。 |
| pauseAnimation() | 暂停当前动画。 |
| resumeAnimation() | 从暂停位置恢复。 |
| cancelAnimation() | 停止并回到第 0 帧。 |

### 事件

`statechange` 的回调对象结构：

```js
{
  type: 'ready' | 'play' | 'pause' | 'resume' | 'stop' | 'complete' | 'error',
  message: '' // 仅 error 时提供
}
```

跨端回调参数不同：H5 / App-Vue 的回调参数直接是该对象（`{ type, message? }`）；微信小程序 / 鸿蒙通过自定义组件事件派发，对象位于 `event.detail`。监听时统一按 `const detail = event.detail || event` 取值。

| type | 触发时机 |
| --- | --- |
| ready | 数据加载完成且引擎初始化成功，自动播放前触发。 |
| play | 自动播放或调用 `playAnimation()` 实际开始播放。 |
| pause | 调用 `pauseAnimation()` 且当前处于播放状态。 |
| resume | 调用 `resumeAnimation()` 从暂停状态恢复。 |
| stop | 调用 `cancelAnimation()` 停止并归零。 |
| complete | 非循环动画播放结束。循环播放不派发 `complete`。 |
| error | 数据加载、解析、平台不支持、多实例冲突或引擎异常。 |

zl-lottie 文档未给出 `detail.type` 的具体枚举，这里定义上述稳定枚举并在示例页展示。

### 使用示例

```vue
<template>
    <up-lottie
        ref="lottieRef"
        :animation-data="animationData"
        content-model="AspectFill"
        :loop="true"
        style="width: 300px; height: 300px;"
        @statechange="onStateChange"
    />
</template>

<script setup>
import { ref } from 'vue'
import loadingData from '@/static/lottie/loading.json'

const lottieRef = ref(null)
const animationData = loadingData

function onStateChange(e) {
    const detail = e.detail || e
    console.log(detail.type)
}

function play() {
    lottieRef.value.playAnimation()
}
</script>
```

## contentModel 映射

三种模式在 Web 和 Canvas 上使用同一套语义：

| contentModel | Web（SVG） | Canvas（小程序 / 鸿蒙） | preserveAspectRatio |
| --- | --- | --- | --- |
| ScaleToFill | 容器铺满组件，拉伸 | 画布尺寸 = 组件尺寸，拉伸 | `none` |
| AspectFill | 容器铺满组件，等比裁剪 | 画布尺寸 = 组件尺寸，等比裁剪 | `xMidYMid slice` |
| Center | 渲染容器尺寸 = JSON 原始 `w` × `h`，居中，超出裁剪 | 画布 CSS 尺寸 = JSON 原始 `w` × `h`，居中，超出裁剪 | `xMidYMid meet`（画布与动画同比例，等效 1:1） |

实现要点：

- 组件根节点固定 `position: relative; overflow: hidden;`，Canvas 平台使用 flex 居中。
- `ScaleToFill` / `AspectFill` 的画布 CSS 尺寸取组件根节点测量值。
- `Center` 的画布 CSS 尺寸取 JSON 的 `w` / `h`，不做缩放；组件小于原始尺寸时自然裁剪，组件更大时留白居中。
- JSON 缺少有效 `w` / `h` 时，`Center` 退化为组件尺寸 + `xMidYMid meet`，并继续播放。

## 数据源与加载

加载优先级：

1. `animationData` 为对象：直接使用。
2. `filePath` 为 http(s)：使用 `uni.request` 拉取 JSON 文本，解析为对象后交给引擎。微信小程序需配置合法域名。
3. `filePath` 为本地路径：
   - H5 / App-Vue：把路径交给 lottie-web 的 `path`，由引擎自行加载；加载完成后再从引擎读取 `w` / `h` 完成 `Center` 布局。
   - APP-HARMONY：尝试用 `uni.request` 读取本地静态路径；失败则发 `error`，提示改用 `animationData`。
   - MP-WEIXIN：无法读取小程序包内本地 JSON，直接发 `error`，提示改用 `animationData`。
4. 两者都为空：发 `error`。

本地 JSON 示例统一使用 `animationData`，避免小程序和鸿蒙的平台差异。

## 渲染流程

### H5 / App-Vue

1. `mounted` 或 `filePath` / `animationData` 变化时触发加载。
2. 解析数据源；`Center` 模式根据 `animationData.w/h` 预先设置渲染容器尺寸，路径加载场景在引擎就绪后补齐尺寸。
3. 获取 `<view>` 的 DOM 元素：`this.$refs.container.$el || this.$refs.container`。
4. 调用 `lottie.loadAnimation({ container, renderer: 'svg', loop, autoplay: false, animationData, path, rendererSettings: { preserveAspectRatio } })`。
5. 监听 `DOMLoaded` / `data_ready` 发 `ready`；若 `autoplay` 为 true 再调用 `play()` 并发 `play`。
6. 监听 `complete`，非循环时发 `complete`。
7. 监听 `data_failed` 和 `error` 事件，发 `error`。
8. 卸载或重载时调用 `animation.destroy()`。

### 微信小程序

1. 加载数据并测量根节点尺寸，计算画布 CSS 尺寸。
2. 渲染 `u-canvas`（`bg-color="transparent"`、`disable-scroll` 视需求），监听 `ready`。
3. `ready` 后：
   - 取 `const node = canvasRef.getCanvasElement()`，取 `const ctx = canvasRef.getRawContext()`。
   - 执行 `ctx.setTransform(1, 0, 0, 1, 0, 0)`，清除 `u-canvas` 为 DPR 设置的初始变换。
   - 调用 `setup(node)`（lottie-miniprogram 全局初始化）。
   - 调用 `loadAnimation({ animationData, loop, autoplay: false, rendererSettings: { context: ctx, preserveAspectRatio, dpr: 1 } })`。
4. `u-canvas` 已把 canvas backing store 设为 `CSS 尺寸 × dpr`，且引擎 `dpr` 固定为 1，引擎按 backing store 像素绘制，最终由 canvas CSS 尺寸缩放显示，避免双重 DPR。
5. 单实例限制：`setup()` 是全局单例，且组件内的占用标记是模块级变量、作用域为整个应用而非单个页面。因此同一时刻只允许一个并行的 `u-lottie` 实例，第二个实例发 `error`。实例销毁或加载失败时释放占用标记；若页面在实例未卸载时就跳转，占用标记会继续保留并阻塞其他页面，当前版本不做 page hide/show 重新获取，需先卸载组件再离开页面。

### APP-HARMONY

1. 同小程序，先加载数据、测量、渲染 `u-canvas`。
2. `ready` 后取旧版 `CanvasContext`，构造 `harmony-canvas-adapter`：
   - `canvas` 对象：`width` / `height`（CSS 像素）、`getContext('2d')`、`requestAnimationFrame`、`cancelAnimationFrame`、`createImage`。
   - 2D 上下文：把 `fillStyle` / `strokeStyle` / `lineWidth` / `font` 等属性同步到 `setFillStyle()` / `setStrokeStyle()` / `setLineWidth()` / `setFontSize()` 等旧版方法。
   - `save` / `restore` / `translate` / `scale` / `rotate` / `transform` / `setTransform` / 路径 / 填充 / 描边 / 裁剪直接转发。
   - `measureText` 使用字号和全角/半角估算，避免鸿蒙同步测量返回 0。
   - `createImage` 通过 `uni.getImageInfo` 转成本地路径，`drawImage` 使用该路径；图片原始尺寸与 JSON 不一致时的处理为尽力而为。
   - `requestAnimationFrame` 内部用 `setTimeout` 驱动，并在每帧回调结束后调用 `context.draw(false)` 刷新指令。
3. 调用 `setup(adapterCanvas)`，再以 `rendererSettings.context = adapterContext`、`dpr = 1` 初始化。
4. 已知限制：滤镜、部分混合模式、像素级效果、动态创建 canvas 不支持；性能依赖旧版 CanvasContext 的 `draw()` 跨桥开销，复杂动画可能掉帧。

### 尺寸与重载

- 画布平台在 `mounted` 后通过 `uni.createSelectorQuery().in(this).select('.u-lottie').boundingClientRect()` 测量根节点；尺寸为 0 时重试，仍为 0 则发 `error`。
- `contentModel` 变化：销毁引擎、重新计算画布尺寸、重建 `u-canvas` 和引擎。
- `filePath` / `animationData` 变化：销毁引擎并重新加载，保留当前 `loop` / `contentModel` / `autoplay`。
- `loop` 变化：若引擎已存在，直接更新动画实例的 `loop` 属性。
- 组件卸载：销毁引擎、取消 RAF / 定时器、释放小程序或鸿蒙的单实例占用。

## 状态机

```text
idle -> loading -> ready -> playing <-> paused
                     |          |
                     v          v
                   error      stopped
```

- `loading` 阶段重复触发重载时，以最后一次数据源为准，旧请求结果丢弃。
- `playAnimation()` 在 `loading` 阶段设置待播放标记，`ready` 后执行；在 `ready` 前调用 `cancelAnimation()` 会清除待播放标记，并抑制本次加载的 `autoplay`。
- 销毁或重载时取消未完成的请求和尺寸测量回调。
- 异步 `data_failed` / `error` 失败时销毁动画与鸿蒙适配器、释放画布占用并置为 `error`；同一加载令牌只派发一次 `error` 状态。

## 文件清单

```text
src/uni_modules/uview-plus/components/u-lottie/
  u-lottie.vue
  props.js
  lottie.js
  libs/
    lottie_svg.min.js              # lottie-web 5.13.0 SVG 构建
    lottie-miniprogram.min.js      # lottie-miniprogram 1.0.12 canvas 构建
    harmony-canvas-adapter.js      # 旧版 CanvasContext -> 2D 上下文适配
    wx-env.js                      # 鸿蒙下为 lottie-miniprogram 注入最小 wx 环境
    LICENSE-lottie-web
    LICENSE-lottie-miniprogram

src/pages/componentsD/lottie/lottie.vue   # 示例页
src/static/lottie/loading.json            # 本地示例动画
src/pages.json                            # 注册示例页
```

说明：

- 引擎文件放在组件目录内，只被 `u-lottie` 条件引入。H5 的 SVG 引擎是独立异步 chunk，仅在 `u-lottie` 挂载后按需拉取，不进入共享入口包；小程序 / 鸿蒙的 canvas 引擎随平台包一起打包。
- 保留上游 MIT License 文件。
- `u-canvas` 不修改，也不复制其 nvue 静态资产。

## 验证标准

1. H5：`npm run dev:h5` 启动示例页，动画正常渲染和播放；`play` / `pause` / `resume` / `cancel` 状态事件正确；三种 `contentModel` 表现符合上表；控制台无报错。
2. MP-WEIXIN：`npm run build:mp-weixin` 编译通过，产物中包含 `u-lottie` 和 `lottie-miniprogram`，不包含 `lottie-web` SVG 构建。
3. H5 / MP 构建产物检查：H5 入口 chunk 不包含 SVG 引擎（无 `createElementNS` 等引擎代码），SVG 引擎位于独立异步 chunk；Web 平台不包含 `lottie-miniprogram`，小程序不包含 SVG 引擎，确认条件编译生效。
4. 示例页使用本地 `loading.json`，不依赖网络；额外提供一个 http(s) `filePath` 示例并注明域名白名单要求。
5. App-Vue、APP-HARMONY、APP-NVUE 无法在本机完成运行验证，必须记录具体原因：
   - 本机无 HBuilderX CLI / 原生运行环境；
   - 鸿蒙适配层只能静态审查和编译检查。
6. nvue 页面使用 `u-lottie` 时不崩溃，能收到 `error` 状态。

## 风险与限制

- **引擎版本不一致**：Web 使用 lottie-web 5.13.0，小程序 / 鸿蒙使用 lottie-miniprogram 1.0.12（内部为 5.5.7），少数新特性或表达式渲染结果可能不同。
- **单实例限制**：微信小程序和鸿蒙受 lottie-miniprogram 全局 `setup()` 限制，组件用模块级变量记录占用者，因此限制是应用级而非页面级：同一时刻只能有一个并行的 `u-lottie` 实例；页面在实例未卸载时跳转，占用会继续保留并可能阻塞其他页面，当前版本不做 page hide/show 重新获取。
- **鸿蒙适配层为尽力而为**：旧版 CanvasContext 能力子集有限，复杂遮罩、滤镜、混合模式和图片处理可能失真；需要在真机回归。
- **本地路径限制**：微信小程序无法读取包内本地 JSON，必须使用 `animationData`；鸿蒙本地路径是否可读取决于运行时，失败时回退到 `animationData`。
- **包体积**：H5 的 SVG 引擎约 242KB，构建为独立异步 chunk，仅在 `u-lottie` 挂载后拉取，不进入共享入口包；小程序 / 鸿蒙的 canvas 引擎（约 205KB）随平台包一起打包。
- **网络加载**：http(s) 数据源需要配置小程序合法域名和 H5 CORS；示例页默认使用本地 `animationData`。远程 Lottie JSON 的表达式字段是可执行代码，必须仅加载可信来源，避免 XSS 或任意脚本执行。
- **布局依赖**：组件依赖父容器给定宽高；画布平台尺寸为 0 时会发 `error`，不会自动猜测尺寸。
