# u-lottie 动画组件实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 uview-plus 中新增纯 JS 的 `u-lottie` 组件，在 H5 / App-Vue 使用 SVG 渲染，在微信小程序 / 鸿蒙使用 `u-canvas` + `lottie-miniprogram` 渲染，并提供示例页与本地示例动画。

**Architecture:** 组件用条件编译分出两条渲染轨道。Web 轨把 lottie-web 挂载到普通 `<view>` 容器；Canvas 轨以 `u-canvas` 作为画布宿主，微信直接把 2d canvas 节点交给 lottie-miniprogram，鸿蒙通过旧版 `CanvasContext` 适配层模拟标准 2D 上下文。两条轨道共用数据加载、状态机、事件和方法 API。

**Tech Stack:** uni-app Vue 3、uview-plus 3.x、lottie-web 5.13.0、lottie-miniprogram 1.0.12、SCSS。

**Spec:** `docs/superpowers/specs/2026-10-23-lottie-component-design.md`

## Global Constraints

- 引擎版本固定为 lottie-web 5.13.0 SVG 构建和 lottie-miniprogram 1.0.12，不做版本升级。
- 原始引擎校验值（包装前）：
  - `lottie_svg.min.js`：`ac64292815e1d96628a5c412f0b6f71a5134846e43b5b972ab85687bd7b53508`，242630 字节。
  - lottie-miniprogram `miniprogram_dist/index.js`：`1a4a2e2fe3088031601075455a5a110ac6018fcf36cbe29ceda43b68acc5c2b3`，209506 字节。
- 不新增 npm 依赖，不引入 UTS 原生插件，不要求自定义基座。
- 支持平台：H5、App-Vue（Android / iOS）、MP-WEIXIN、APP-HARMONY（尽力而为）。APP-NVUE 和其他小程序统一通过 `statechange` 的 `error` 类型报错，不崩溃。
- 组件 API 固定：
  - props：`filePath`、`animationData`、`contentModel`、`loop`、`autoplay`。
  - methods：`playAnimation()`、`pauseAnimation()`、`resumeAnimation()`、`cancelAnimation()`。
  - event：`statechange`，detail 为 `{ type: 'ready'|'play'|'pause'|'resume'|'stop'|'complete'|'error', message? }`。
- `contentModel` 固定支持 `ScaleToFill`、`AspectFill`、`Center`，默认 `AspectFill`。
- 不修改 `u-canvas` 的任何文件。只消费它的 `ready` 事件、`getCanvasElement()`、`getRawContext()`、`width`、`height`。
- 微信小程序与鸿蒙受 lottie-miniprogram 全局 `setup()` 限制，同一页面只允许一个并行的 `u-lottie` 实例。
- 微信小程序的 canvas backing store 由 `u-canvas` 按 DPR 放大，引擎初始化必须重置 transform 并固定 `dpr: 1`；鸿蒙旧版 `CanvasContext` 按 CSS 尺寸绘制，同样固定 `dpr: 1`。
- 不新增组件文档站页面、TS 类型声明、常驻验证脚本。
- 提交信息使用中文，必须包含 head + body 两部分。
- 所有引擎与适配层文件放在组件目录内，由条件编译控制打包。

---

## File Structure

```text
src/uni_modules/uview-plus/components/u-lottie/
  u-lottie.vue                       # 组件实现（两轨）
  props.js                           # 组件 props 定义
  lottie.js                          # 默认值，注册到全局 props 配置
  libs/
    lottie_svg.min.js                # lottie-web 5.13.0，带 ESM 导出包装
    lottie-miniprogram.min.js        # lottie-miniprogram 1.0.12，带 ESM/XMLHttpRequest 包装
    harmony-canvas-adapter.js        # 旧版 CanvasContext -> 标准 2D 上下文适配
    wx-env.js                        # 鸿蒙下为 lottie-miniprogram 注入最小 wx 环境
    LICENSE-lottie-web               # 上游 MIT 许可证
    LICENSE-lottie-miniprogram       # 上游 MIT 许可证

src/pages/componentsD/lottie/lottie.vue   # 示例页
src/static/lottie/loading.json            # 本地示例动画（200 x 200，30fps，2 秒）
src/pages.json                            # 注册示例页
```

### 与 spec 的实现说明

- 两个引擎文件是 UMD / CommonJS 产物，Vite 不会自动转换 `src` 下的裸 CJS。计划在原始文件首尾加最小 ESM 包装（`module` / `exports` 局部变量 + `export default module.exports`），不新增额外运行时代理文件。
- lottie-miniprogram 在模块加载时执行 `wx.getSystemInfoSync()` 和裸 `XMLHttpRequest = ...` 赋值。包装文件需在首部声明局部 `XMLHttpRequest`，并保证 `wx-env.js` 在引擎之前被求值。
- 示例页额外提供舞台尺寸切换，用于直观检查 `Center` 的原始尺寸居中/裁剪行为；这不扩张组件 API。

---

### Task 1: 引入引擎、许可证与示例动画

**Files:**
- Create: `src/uni_modules/uview-plus/components/u-lottie/libs/lottie_svg.min.js`
- Create: `src/uni_modules/uview-plus/components/u-lottie/libs/lottie-miniprogram.min.js`
- Create: `src/uni_modules/uview-plus/components/u-lottie/libs/LICENSE-lottie-web`
- Create: `src/uni_modules/uview-plus/components/u-lottie/libs/LICENSE-lottie-miniprogram`
- Create: `src/static/lottie/loading.json`

**Interfaces:**
- Consumes: 无。
- Produces:
  - `libs/lottie_svg.min.js`：`export default` 为 lottie-web 实例，包含 `loadAnimation(options)`。
  - `libs/lottie-miniprogram.min.js`：`export default` 为 lottie-miniprogram 实例，包含 `setup(canvas)`、`loadAnimation(options)`、`freeze()`、`unfreeze()`。
  - `src/static/lottie/loading.json`：可用 `animationData` 直接加载的 Lottie JSON。

- [ ] **Step 1: 创建目录**

```bash
mkdir -p src/uni_modules/uview-plus/components/u-lottie/libs
mkdir -p src/static/lottie
```

- [ ] **Step 2: 下载固定版本引擎与许可证**

```bash
curl -sL "https://unpkg.com/lottie-web@5.13.0/build/player/lottie_svg.min.js" \
  -o src/uni_modules/uview-plus/components/u-lottie/libs/lottie_svg.min.js
curl -sL "https://unpkg.com/lottie-miniprogram@1.0.12/miniprogram_dist/index.js" \
  -o src/uni_modules/uview-plus/components/u-lottie/libs/lottie-miniprogram.min.js
curl -sL "https://unpkg.com/lottie-web@5.13.0/LICENSE.md" \
  -o src/uni_modules/uview-plus/components/u-lottie/libs/LICENSE-lottie-web
curl -sL "https://unpkg.com/lottie-miniprogram@1.0.12/LICENSE" \
  -o src/uni_modules/uview-plus/components/u-lottie/libs/LICENSE-lottie-miniprogram
```

- [ ] **Step 3: 包装前校验引擎**

Run:

```bash
sha256sum \
  src/uni_modules/uview-plus/components/u-lottie/libs/lottie_svg.min.js \
  src/uni_modules/uview-plus/components/u-lottie/libs/lottie-miniprogram.min.js
```

Expected:

```text
ac64292815e1d96628a5c412f0b6f71a5134846e43b5b972ab85687bd7b53508  .../lottie_svg.min.js
1a4a2e2fe3088031601075455a5a110ac6018fcf36cbe29ceda43b68acc5c2b3  .../lottie-miniprogram.min.js
```

如果校验值不符，停止并重新下载，不要继续包装。

- [ ] **Step 4: 为两个引擎加 ESM 包装**

Run:

```bash
node - <<'NODE'
const fs = require('fs')
const path = require('path')
const libs = 'src/uni_modules/uview-plus/components/u-lottie/libs'

const webFile = path.join(libs, 'lottie_svg.min.js')
const web = fs.readFileSync(webFile, 'utf8')
if (!web.includes('export default module.exports')) {
    fs.writeFileSync(webFile, [
        '// lottie-web 5.13.0 (MIT), wrapped for ESM interop',
        'var module = { exports: {} };',
        'var exports = module.exports;',
        web + '\nexport default module.exports;\n'
    ].join('\n'))
}

const mpFile = path.join(libs, 'lottie-miniprogram.min.js')
const mp = fs.readFileSync(mpFile, 'utf8')
if (!mp.includes('export default module.exports')) {
    fs.writeFileSync(mpFile, [
        '// lottie-miniprogram 1.0.12 (MIT), wrapped for ESM interop',
        'var module = { exports: {} };',
        'var exports = module.exports;',
        'var XMLHttpRequest = function XMLHttpRequest() {};',
        mp + '\nexport default module.exports;\n'
    ].join('\n'))
}
NODE
```

说明：lottie-miniprogram 的产物在加载时会执行无声明的 `XMLHttpRequest = ...`。首部局部声明可避免 Rollup/Vite 输出 `'use strict'` 后在微信或鸿蒙环境抛出 `ReferenceError`。

- [ ] **Step 5: 确认包装结果**

Run:

```bash
head -n 4 src/uni_modules/uview-plus/components/u-lottie/libs/lottie_svg.min.js
head -n 5 src/uni_modules/uview-plus/components/u-lottie/libs/lottie-miniprogram.min.js
tail -n 1 src/uni_modules/uview-plus/components/u-lottie/libs/lottie_svg.min.js
tail -n 1 src/uni_modules/uview-plus/components/u-lottie/libs/lottie-miniprogram.min.js
```

Expected:
- 两个文件首部都有 `var module = { exports: {} };` 与 `var exports = module.exports;`。
- lottie-miniprogram 首部还有 `var XMLHttpRequest = function XMLHttpRequest() {};`。
- 两个文件末行都是 `export default module.exports;`。

- [ ] **Step 6: 写入本地示例动画**

Create `src/static/lottie/loading.json`:

```json
{
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 200,
  "h": 200,
  "nm": "loading",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "ring",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100, "ix": 11 },
        "r": {
          "a": 1,
          "k": [
            { "i": { "x": [0.667], "y": [1] }, "o": { "x": [0.333], "y": [0] }, "t": 0, "s": [0] },
            { "t": 60, "s": [360] }
          ],
          "ix": 10
        },
        "p": { "a": 0, "k": [100, 100, 0], "ix": 2 },
        "a": { "a": 0, "k": [0, 0, 0], "ix": 1 },
        "s": { "a": 0, "k": [100, 100, 100], "ix": 6 }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "d": 1,
              "s": { "a": 0, "k": [140, 140], "ix": 2 },
              "p": { "a": 0, "k": [0, 0], "ix": 3 },
              "nm": "Ellipse Path 1",
              "mn": "ADBE Vector Shape - Ellipse"
            },
            {
              "ty": "st",
              "c": { "a": 0, "k": [0.156862745098, 0.541176470588, 0.956862745098, 1], "ix": 3 },
              "o": { "a": 0, "k": 100, "ix": 4 },
              "w": { "a": 0, "k": 12, "ix": 5 },
              "lc": 2,
              "lj": 1,
              "ml": 4,
              "bm": 0,
              "nm": "Stroke 1",
              "mn": "ADBE Vector Graphic - Stroke"
            },
            {
              "ty": "tm",
              "s": { "a": 0, "k": 0, "ix": 1 },
              "e": { "a": 0, "k": 25, "ix": 2 },
              "o": { "a": 0, "k": 0, "ix": 3 },
              "m": 1,
              "ix": 4,
              "nm": "Trim Paths 1",
              "mn": "ADBE Vector Filter - Trim"
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [0, 0], "ix": 2 },
              "a": { "a": 0, "k": [0, 0], "ix": 1 },
              "s": { "a": 0, "k": [100, 100], "ix": 3 },
              "r": { "a": 0, "k": 0, "ix": 6 },
              "o": { "a": 0, "k": 100, "ix": 7 },
              "sk": { "a": 0, "k": 0, "ix": 4 },
              "sa": { "a": 0, "k": 0, "ix": 5 },
              "nm": "Transform"
            }
          ],
          "nm": "Ring",
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 60,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
}
```

- [ ] **Step 7: 校验 JSON 与许可证**

Run:

```bash
node -e "const d=require('./src/static/lottie/loading.json'); console.log(d.w, d.h, d.fr, d.op, d.layers.length)"
grep -c "MIT License\|The MIT License" \
  src/uni_modules/uview-plus/components/u-lottie/libs/LICENSE-lottie-web \
  src/uni_modules/uview-plus/components/u-lottie/libs/LICENSE-lottie-miniprogram
```

Expected:
- 输出 `200 200 30 60 1`。
- 两个许可证文件各至少匹配 1 次。

- [ ] **Step 8: 提交**

```bash
git add \
  src/uni_modules/uview-plus/components/u-lottie/libs \
  src/static/lottie/loading.json
git commit -m "feat: 引入 u-lottie 渲染引擎与示例动画" \
  -m "内置 lottie-web 5.13.0 与 lottie-miniprogram 1.0.12，补充 ESM 包装、上游 MIT 许可证和本地示例 JSON。"
```

---

### Task 2: 组件 API、Web 渲染轨道与示例页

**Files:**
- Create: `src/uni_modules/uview-plus/components/u-lottie/props.js`
- Create: `src/uni_modules/uview-plus/components/u-lottie/lottie.js`
- Create: `src/uni_modules/uview-plus/components/u-lottie/u-lottie.vue`
- Create: `src/pages/componentsD/lottie/lottie.vue`
- Modify: `src/pages.json`（`pages/componentsD` 分包末尾新增 lottie 页面）

**Interfaces:**
- Consumes: Task 1 的 `lottie_svg.min.js` 默认导出。
- Produces:
  - 组件 `u-lottie`，可被 easycom 的 `up-lottie` 解析。
  - props：`filePath: string`、`animationData: object|null`、`contentModel: string`、`loop: boolean`、`autoplay: boolean`。
  - methods：`playAnimation()`、`pauseAnimation()`、`resumeAnimation()`、`cancelAnimation()`。
  - event：`statechange`，payload `{ type, message? }`。
  - 组件内部方法（Task 3/4 复用）：`reload()`、`resolveSource()`、`requestJson()`、`initWeb()`、`bindEngineEvents()`、`startPlayback()`、`emitState()`、`fail()`、`normalizeError()`、`destroyEngine()`。

本任务完成后，H5/App-Vue 可用；MP-WEIXIN / APP-HARMONY 暂时在 `reload()` 中派发明确的 `error`，由 Task 3 替换。

- [ ] **Step 1: 新增默认值文件**

Create `src/uni_modules/uview-plus/components/u-lottie/lottie.js`:

```js
export default {
    lottie: {
        filePath: '',
        animationData: null,
        contentModel: 'AspectFill',
        loop: false,
        autoplay: true
    }
}
```

- [ ] **Step 2: 新增 props 文件**

Create `src/uni_modules/uview-plus/components/u-lottie/props.js`:

```js
import { defineMixin } from '../../libs/vue'
import LottieDefaultProps from './lottie'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps(LottieDefaultProps)

export const props = defineMixin({
    props: {
        // 动画 JSON 路径，支持 http(s)；H5 / App-Vue 额外支持本地静态路径
        filePath: {
            type: String,
            default: () => defProps.lottie.filePath
        },
        // 直接传入 Lottie JSON 对象，优先级高于 filePath
        animationData: {
            type: Object,
            default: () => defProps.lottie.animationData
        },
        // 内容填充模式：ScaleToFill / AspectFill / Center
        contentModel: {
            type: String,
            default: () => defProps.lottie.contentModel
        },
        // 是否循环播放
        loop: {
            type: Boolean,
            default: () => defProps.lottie.loop
        },
        // 数据与引擎就绪后是否自动播放
        autoplay: {
            type: Boolean,
            default: () => defProps.lottie.autoplay
        }
    }
})
```

- [ ] **Step 3: 创建组件 Web 轨道**

Create `src/uni_modules/uview-plus/components/u-lottie/u-lottie.vue`:

```vue
<template>
    <view class="u-lottie">
        <!-- #ifdef H5 || APP-PLUS -->
        <!-- #ifndef APP-NVUE -->
        <view
            ref="webContainer"
            class="u-lottie__web"
            :style="webContentStyle"
        ></view>
        <!-- #endif -->
        <!-- #endif -->
    </view>
</template>

<script>
import { props } from './props'
import { mpMixin } from '../../libs/mixin/mpMixin'
import { mixin } from '../../libs/mixin/mixin'

// #ifdef H5 || APP-PLUS
// #ifndef APP-NVUE
import lottieWeb from './libs/lottie_svg.min.js'
// #endif
// #endif

/**
 * lottie 动画
 * @description 加载 AE 导出的 Lottie JSON 并播放；H5/App-Vue 使用 SVG，微信小程序/鸿蒙使用 canvas。
 * @property {String} filePath 动画 JSON 路径，支持 http(s)；H5 / App-Vue 额外支持本地静态路径
 * @property {Object} animationData 直接传入 Lottie JSON 对象，优先级高于 filePath
 * @property {String} contentModel 填充模式：ScaleToFill / AspectFill / Center
 * @property {Boolean} loop 是否循环播放
 * @property {Boolean} autoplay 就绪后是否自动播放
 * @event {Function} statechange 状态变化，detail.type 为 ready/play/pause/resume/stop/complete/error
 * @example <up-lottie :animation-data="data" content-model="AspectFill" @statechange="onState" />
 */
export default {
    name: 'u-lottie',
    mixins: [mpMixin, mixin, props],
    emits: ['statechange'],
    data() {
        return {
            webCenterSize: null,
            canvasVisible: false,
            canvasWidth: 300,
            canvasHeight: 300,
            canvasId: `u-lottie-canvas-${Date.now()}${Math.floor(Math.random() * 1000)}`
        }
    },
    computed: {
        rendererKind() {
            // #ifdef APP-NVUE
            return 'unsupported'
            // #endif
            // #ifdef MP-WEIXIN || APP-HARMONY
            return 'canvas'
            // #endif
            // #ifdef MP
            return 'unsupported'
            // #endif
            // #ifdef H5 || APP-PLUS
            return 'web'
            // #endif
            return 'unsupported'
        },
        preserveAspectRatio() {
            if (this.contentModel === 'ScaleToFill') return 'none'
            if (this.contentModel === 'Center') return 'xMidYMid meet'
            return 'xMidYMid slice'
        },
        webContentStyle() {
            if (this.contentModel !== 'Center') {
                return { width: '100%', height: '100%', flex: '0 0 auto' }
            }
            if (this.webCenterSize) {
                return {
                    width: `${this.webCenterSize.width}px`,
                    height: `${this.webCenterSize.height}px`,
                    flex: '0 0 auto'
                }
            }
            return { width: '100%', height: '100%', flex: '0 0 auto' }
        }
    },
    watch: {
        filePath() {
            this.reload()
        },
        animationData() {
            this.reload()
        },
        contentModel() {
            this.reload()
        },
        loop(value) {
            if (this._animation) {
                this._animation.loop = value
            }
        }
    },
    created() {
        this._animation = null
        this._requestTask = null
        this._loadToken = 0
        this._pendingPlay = false
        this._ready = false
        this._completed = false
        this._engineState = 'idle'
        this._failedToken = -1
    },
    mounted() {
        this.reload()
    },
    beforeUnmount() {
        this._loadToken += 1
        if (this._requestTask && typeof this._requestTask.abort === 'function') {
            this._requestTask.abort()
        }
        this._requestTask = null
        this.destroyEngine()
    },
    methods: {
        async reload() {
            const token = this._loadToken + 1
            this._loadToken = token
            if (this._requestTask && typeof this._requestTask.abort === 'function') {
                this._requestTask.abort()
            }
            this._requestTask = null
            this.destroyEngine()
            this.canvasVisible = false
            this.webCenterSize = null
            this._ready = false
            this._completed = false
            this._pendingPlay = false
            this._failedToken = -1
            this._engineState = 'idle'

            const kind = this.rendererKind
            if (kind === 'unsupported') {
                this.fail('当前平台不支持 u-lottie', token)
                return
            }

            try {
                const source = await this.resolveSource()
                if (token !== this._loadToken) return
                if (kind === 'web') {
                    await this.initWeb(source, token)
                    return
                }
                this.fail('当前平台暂未接入画布渲染', token)
            } catch (error) {
                if (token !== this._loadToken) return
                this.fail(this.normalizeError(error), token)
            }
        },
        async resolveSource() {
            if (this.animationData && typeof this.animationData === 'object') {
                return { data: this.animationData }
            }
            const path = typeof this.filePath === 'string' ? this.filePath.trim() : ''
            if (!path) {
                throw new Error('u-lottie: filePath 与 animationData 不能同时为空')
            }
            if (/^https?:\/\//i.test(path)) {
                return { data: await this.requestJson(path) }
            }

            // #ifdef APP-HARMONY
            try {
                return { data: await this.requestJson(path) }
            } catch (error) {
                throw new Error('u-lottie: 鸿蒙暂不支持读取本地 JSON，请改用 animationData')
            }
            // #endif

            // #ifdef H5 || APP-PLUS
            // #ifndef APP-NVUE
            return { path }
            // #endif
            // #endif

            // #ifdef MP-WEIXIN
            throw new Error('u-lottie: 微信小程序无法读取本地 JSON，请改用 animationData')
            // #endif

            throw new Error('u-lottie: 当前平台不支持该数据源')
        },
        requestJson(url) {
            return new Promise((resolve, reject) => {
                const task = uni.request({
                    url,
                    method: 'GET',
                    dataType: 'json',
                    responseType: 'text',
                    success: (response) => {
                        if (this._requestTask === task) this._requestTask = null
                        if (response.statusCode < 200 || response.statusCode >= 300) {
                            reject(new Error(`u-lottie: 请求失败 (${response.statusCode})`))
                            return
                        }
                        let data = response.data
                        if (typeof data === 'string') {
                            try {
                                data = JSON.parse(data)
                            } catch (error) {
                                reject(new Error('u-lottie: JSON 解析失败'))
                                return
                            }
                        }
                        if (!data || typeof data !== 'object') {
                            reject(new Error('u-lottie: 返回内容不是有效的 Lottie JSON'))
                            return
                        }
                        resolve(data)
                    },
                    fail: (error) => {
                        if (this._requestTask === task) this._requestTask = null
                        const suffix = error && error.errMsg ? ` - ${error.errMsg}` : ''
                        reject(new Error(`u-lottie: 请求失败${suffix}`))
                    }
                })
                this._requestTask = task
            })
        },
        async initWeb(source, token) {
            // #ifdef H5 || APP-PLUS
            // #ifndef APP-NVUE
            if (!lottieWeb || typeof lottieWeb.loadAnimation !== 'function') {
                this.fail('lottie-web 引擎未加载', token)
                return
            }
            if (source.data && this.contentModel === 'Center') {
                this.applyWebCenterSize(source.data)
            }
            await this.$nextTick()
            if (token !== this._loadToken) return
            const containerRef = this.$refs.webContainer
            const container = containerRef && (containerRef.$el || containerRef)
            if (!container) {
                this.fail('动画容器不存在', token)
                return
            }
            const options = {
                container,
                renderer: 'svg',
                loop: this.loop,
                autoplay: false,
                rendererSettings: {
                    preserveAspectRatio: this.preserveAspectRatio
                }
            }
            if (source.data) {
                options.animationData = source.data
            } else {
                options.path = source.path
            }
            let animation
            try {
                animation = lottieWeb.loadAnimation(options)
            } catch (error) {
                this.fail(this.normalizeError(error), token)
                return
            }
            if (token !== this._loadToken) {
                animation.destroy()
                return
            }
            this._animation = animation
            this.bindEngineEvents(animation, token)
            // #endif
            // #endif
        },
        applyWebCenterSize(data) {
            const width = Number(data && data.w)
            const height = Number(data && data.h)
            if (width > 0 && height > 0) {
                this.webCenterSize = { width, height }
            }
        },
        bindEngineEvents(animation, token) {
            const isCurrent = () => token === this._loadToken
            animation.addEventListener('DOMLoaded', () => {
                if (!isCurrent()) return
                if (
                    this.rendererKind === 'web' &&
                    this.contentModel === 'Center' &&
                    !this.webCenterSize
                ) {
                    this.applyWebCenterSize(animation.animationData)
                    if (this.webCenterSize) {
                        this.$nextTick(() => {
                            if (isCurrent() && this._animation) {
                                this._animation.resize()
                            }
                        })
                    }
                }
                this._ready = true
                this.emitState('ready')
                if (this.autoplay || this._pendingPlay) {
                    this._pendingPlay = false
                    this.startPlayback()
                }
            })
            animation.addEventListener('complete', () => {
                if (!isCurrent() || this.loop) return
                this._completed = true
                this._engineState = 'completed'
                this.emitState('complete')
            })
            const onFailure = () => {
                if (!isCurrent()) return
                this.fail('动画加载失败', token)
            }
            animation.addEventListener('data_failed', onFailure)
            animation.addEventListener('error', onFailure)
        },
        startPlayback() {
            const animation = this._animation
            if (!animation) {
                this._pendingPlay = true
                return
            }
            if (this._engineState === 'playing') return
            if (this._completed || this._engineState === 'stopped') {
                animation.goToAndStop(0, true)
                this._completed = false
            }
            animation.play()
            this._engineState = 'playing'
            this.emitState('play')
        },
        playAnimation() {
            if (!this._animation || !this._ready) {
                this._pendingPlay = true
                return
            }
            this.startPlayback()
        },
        pauseAnimation() {
            if (!this._animation || this._engineState !== 'playing') return
            this._animation.pause()
            this._engineState = 'paused'
            this.emitState('pause')
        },
        resumeAnimation() {
            if (!this._animation || this._engineState !== 'paused') return
            this._animation.play()
            this._engineState = 'playing'
            this.emitState('resume')
        },
        cancelAnimation() {
            this._pendingPlay = false
            if (!this._animation) return
            this._animation.stop()
            this._completed = false
            this._engineState = 'stopped'
            this.emitState('stop')
        },
        emitState(type, message = '') {
            const detail = { type }
            if (type === 'error') {
                detail.message = message
            }
            this.$emit('statechange', detail)
        },
        fail(message, token) {
            if (typeof token === 'number' && token !== this._loadToken) return
            if (this._failedToken === this._loadToken) return
            this._failedToken = this._loadToken
            this._engineState = 'error'
            this.emitState('error', message || '动画初始化失败')
        },
        normalizeError(error) {
            if (!error) return '动画初始化失败'
            if (typeof error === 'string') return error
            return error.message || error.errMsg || '动画初始化失败'
        },
        destroyEngine() {
            if (this._animation) {
                try {
                    this._animation.destroy()
                } catch (error) {
                    // 引擎可能尚未完成初始化，销毁失败不影响后续重载
                }
                this._animation = null
            }
            this._ready = false
            this._engineState = 'idle'
        }
    }
}
</script>

<style lang="scss" scoped>
.u-lottie {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.u-lottie__web {
    flex: 0 0 auto;
}
</style>
```

- [ ] **Step 4: 创建示例页**

Create `src/pages/componentsD/lottie/lottie.vue`:

```vue
<template>
    <view class="u-page">
        <view class="u-page__item">
            <text class="u-page__item__title">Lottie 动画</text>
            <view class="u-page__item__content">
                <view
                    class="lottie-stage"
                    :style="{ width: stageSize + 'px', height: stageSize + 'px' }"
                >
                    <up-lottie
                        ref="lottieRef"
                        class="lottie-stage__canvas"
                        :animation-data="animationData"
                        :content-model="contentModel"
                        :loop="loop"
                        @statechange="onStateChange"
                    />
                </view>

                <view class="lottie-group">
                    <text class="lottie-group__title">填充模式</text>
                    <view class="lottie-group__actions">
                        <up-button
                            v-for="model in contentModels"
                            :key="model"
                            size="small"
                            :type="contentModel === model ? 'primary' : 'info'"
                            :plain="contentModel !== model"
                            :text="model"
                            @click="changeContentModel(model)"
                        ></up-button>
                    </view>
                </view>

                <view class="lottie-group">
                    <text class="lottie-group__title">播放控制</text>
                    <view class="lottie-group__actions">
                        <up-button size="small" type="primary" text="播放" @click="play"></up-button>
                        <up-button size="small" text="暂停" @click="pause"></up-button>
                        <up-button size="small" text="恢复" @click="resume"></up-button>
                        <up-button size="small" type="error" text="取消" @click="cancel"></up-button>
                        <up-button
                            size="small"
                            :type="loop ? 'success' : 'info'"
                            :text="loop ? '循环：开' : '循环：关'"
                            @click="toggleLoop"
                        ></up-button>
                    </view>
                </view>

                <view class="lottie-group">
                    <text class="lottie-group__title">舞台尺寸</text>
                    <view class="lottie-group__actions">
                        <up-button
                            v-for="size in stageSizes"
                            :key="size"
                            size="small"
                            :type="stageSize === size ? 'primary' : 'info'"
                            :plain="stageSize !== size"
                            :text="size + 'px'"
                            @click="stageSize = size"
                        ></up-button>
                    </view>
                </view>

                <view class="lottie-group">
                    <text class="lottie-group__title">状态日志</text>
                    <view class="lottie-log">
                        <text
                            v-for="(item, index) in stateLog"
                            :key="index"
                            class="lottie-log__item"
                        >{{ item }}</text>
                        <text v-if="stateLog.length === 0" class="lottie-log__empty">暂无状态</text>
                    </view>
                </view>

                <text class="lottie-note">
                    H5 / App-Vue 使用 SVG 渲染；微信小程序与鸿蒙使用 canvas 渲染，同一页面仅支持一个实例。
                    网络加载示例：&lt;up-lottie file-path="https://example.com/anim.json" /&gt;，
                    小程序需配置合法域名，H5 需服务端允许 CORS。
                </text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import loadingData from '@/static/lottie/loading.json'

const lottieRef = ref(null)
const animationData = loadingData
const contentModels = ['ScaleToFill', 'AspectFill', 'Center']
const contentModel = ref('AspectFill')
const stageSizes = [200, 300, 360]
const stageSize = ref(300)
const loop = ref(true)
const stateLog = ref([])

function onStateChange(event) {
    const detail = event && event.detail ? event.detail : event
    if (!detail || !detail.type) return
    const time = new Date().toLocaleTimeString()
    const message = detail.message ? ` - ${detail.message}` : ''
    stateLog.value.unshift(`${time}  ${detail.type}${message}`)
    if (stateLog.value.length > 6) {
        stateLog.value.pop()
    }
}

function changeContentModel(model) {
    contentModel.value = model
}

function play() {
    if (lottieRef.value) lottieRef.value.playAnimation()
}

function pause() {
    if (lottieRef.value) lottieRef.value.pauseAnimation()
}

function resume() {
    if (lottieRef.value) lottieRef.value.resumeAnimation()
}

function cancel() {
    if (lottieRef.value) lottieRef.value.cancelAnimation()
}

function toggleLoop() {
    loop.value = !loop.value
}
</script>

<style lang="scss" scoped>
.lottie-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    overflow: hidden;
    border: 1px dashed #dcdfe6;
    background-color: #f8f8f8;
    transition: width 0.2s, height 0.2s;
}

.lottie-stage__canvas {
    width: 100%;
    height: 100%;
}

.lottie-group {
    margin-top: 20px;
}

.lottie-group__title {
    display: block;
    margin-bottom: 10px;
    font-size: 14px;
    color: #303133;
}

.lottie-group__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.lottie-log {
    min-height: 120px;
    padding: 12px;
    border-radius: 8px;
    background-color: #f5f6f7;
}

.lottie-log__item {
    display: block;
    padding: 2px 0;
    font-size: 12px;
    color: #606266;
}

.lottie-log__empty {
    font-size: 12px;
    color: #909399;
}

.lottie-note {
    display: block;
    margin-top: 20px;
    font-size: 12px;
    line-height: 1.6;
    color: #909399;
}
</style>
```

- [ ] **Step 5: 注册示例页**

Modify `src/pages.json`：在 `pages/componentsD` 分包的 `address/addSite` 条目之后、数组结束 `]` 之前加入：

```json
                ,
                {
                    "path" : "lottie/lottie",
                    "style" : {
                        "navigationBarTitleText" : "Lottie 动画"
                    }
                }
```

变更后片段应形如：

```json
                {
                    "path" : "address/addSite",
                    "style" : {
                        "navigationBarTitleText" : "添加用户地址"
                    }
                },
                {
                    "path" : "lottie/lottie",
                    "style" : {
                        "navigationBarTitleText" : "Lottie 动画"
                    }
                }
            ]
```

- [ ] **Step 6: 启动 H5 并确认页面可打开**

Run（后台）：

```bash
npm run dev:h5
```

Expected:
- 编译成功，无 `lottie_svg.min.js` 相关模块错误。
- 浏览器打开 `http://localhost:5100/#/pages/componentsD/lottie/lottie`，能看到蓝色旋转圆弧。

- [ ] **Step 7: 验证 SVG 渲染与播放**

在页面中执行：

```js
() => new Promise((resolve) => {
    const svg = document.querySelector('.u-lottie svg')
    if (!svg) {
        resolve({ error: 'svg-missing' })
        return
    }
    const first = svg.innerHTML
    setTimeout(() => resolve({ changed: first !== svg.innerHTML }), 400)
})
```

Expected: `{ changed: true }`，状态日志中出现 `ready` 和 `play`。

- [ ] **Step 8: 验证暂停、恢复、取消与完成**

操作：
1. 点击「暂停」，等待 400ms，确认 SVG `innerHTML` 不再变化，日志出现 `pause`。
2. 点击「恢复」，等待 400ms，确认 SVG 继续变化，日志出现 `resume`。
3. 点击「取消」，确认日志出现 `stop`。
4. 点击「循环：开」关闭循环，等待动画播完，确认日志出现 `complete`；再次点击「播放」，确认从第 0 帧重新开始并出现 `play`。

Expected: 全部状态按上述顺序出现，页面无异常。

- [ ] **Step 9: 验证三种填充模式**

依次点击 `ScaleToFill`、`AspectFill`、`Center`，每次等待 500ms 后执行：

```js
() => {
    const svg = document.querySelector('.u-lottie svg')
    const wrap = document.querySelector('.u-lottie__web')
    const rect = wrap.getBoundingClientRect()
    return {
        preserveAspectRatio: svg && svg.getAttribute('preserveAspectRatio'),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
    }
}
```

Expected:
- `ScaleToFill`：`preserveAspectRatio === 'none'`，容器 300 x 300。
- `AspectFill`：`preserveAspectRatio === 'xMidYMid slice'`，容器 300 x 300。
- `Center`：`preserveAspectRatio === 'xMidYMid meet'`，容器 200 x 200，且在 300 x 300 舞台中居中。

- [ ] **Step 10: 检查 H5 控制台**

Expected: 无 `lottie`、Vue 组件解析或未捕获异常；允许 H5 开发工具的常规 info。

- [ ] **Step 11: 提交**

```bash
git add \
  src/uni_modules/uview-plus/components/u-lottie/u-lottie.vue \
  src/uni_modules/uview-plus/components/u-lottie/props.js \
  src/uni_modules/uview-plus/components/u-lottie/lottie.js \
  src/pages/componentsD/lottie/lottie.vue \
  src/pages.json
git commit -m "feat: 新增 u-lottie 组件 Web 渲染与示例页" \
  -m "实现组件 props、状态事件与播放控制方法，并在 H5/App-Vue 使用 lottie-web SVG 渲染；示例页支持填充模式、舞台尺寸与状态日志。"
```

---

### Task 3: 微信小程序 Canvas 渲染轨道

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-lottie/u-lottie.vue`
- Create: `src/uni_modules/uview-plus/components/u-lottie/libs/wx-env.js`

**Interfaces:**
- Consumes:
  - Task 2 的组件核心方法。
  - Task 1 的 `lottie-miniprogram.min.js` 默认导出。
  - `u-canvas` 的 `ready` 事件、`getCanvasElement()`、`getRawContext()`。
- Produces:
  - MP-WEIXIN 渲染路径。
  - 内部方法：`initCanvasLayout(source, token)`、`measureRoot()`、`onCanvasReady()`、`initCanvasEngine(token)`、`startCanvasAnimation(context, token)`、`releaseCanvasOwner()`。
  - 模块级单实例占用变量 `canvasEngineOwner`。
  - `wx-env.js` 供 Task 4 鸿蒙复用。

- [ ] **Step 1: 新增 wx 环境垫片**

Create `src/uni_modules/uview-plus/components/u-lottie/libs/wx-env.js`:

```js
if (typeof wx === 'undefined') {
    const globalObject = typeof globalThis !== 'undefined'
        ? globalThis
        : (typeof window !== 'undefined' ? window : null)
    if (globalObject) {
        globalObject.wx = {
            getSystemInfoSync() {
                const info = uni.getSystemInfoSync() || {}
                return Object.assign({ pixelRatio: 1, platform: '' }, info)
            }
        }
    }
}

export {}
```

- [ ] **Step 2: 模板增加 u-canvas**

在 `u-lottie.vue` 的根 `<view class="u-lottie">` 内、Web 分支之后加入：

```vue
        <!-- #ifdef MP-WEIXIN || APP-HARMONY -->
        <u-canvas
            v-if="canvasVisible"
            ref="canvasRef"
            :canvas-id="canvasId"
            :width="canvasWidth"
            :height="canvasHeight"
            bg-color="transparent"
            @ready="onCanvasReady"
        />
        <!-- #endif -->
```

- [ ] **Step 3: 条件引入 u-canvas、wx 垫片与小程序引擎**

在 `import { mixin } ...` 之后、Web 引擎 import 之前加入：

```js
// #ifdef APP-HARMONY
import './libs/wx-env.js'
// #endif

// #ifdef MP-WEIXIN || APP-HARMONY
import uCanvas from '../u-canvas/u-canvas.vue'
import lottieMiniprogram from './libs/lottie-miniprogram.min.js'
// #endif

// #ifdef MP-WEIXIN || APP-HARMONY
let canvasEngineOwner = null
// #endif
```

- [ ] **Step 4: 注册子组件**

在 `export default {` 的 `mixins` 之后加入：

```js
    components: {
        // #ifdef MP-WEIXIN || APP-HARMONY
        uCanvas
        // #endif
    },
```

- [ ] **Step 5: 补充实例字段**

在 `created()` 的现有赋值之后加入：

```js
        this._sourceData = null
        this._ownsCanvasEngine = false
        this._instanceId = `u-lottie-${Date.now()}${Math.floor(Math.random() * 1000)}`
```

- [ ] **Step 6: reload 接入画布布局**

将 `reload()` 中的：

```js
                if (kind === 'web') {
                    await this.initWeb(source, token)
                    return
                }
                this.fail('当前平台暂未接入画布渲染', token)
```

替换为：

```js
                if (kind === 'web') {
                    await this.initWeb(source, token)
                    return
                }
                await this.initCanvasLayout(source, token)
```

并在 `this.canvasVisible = false` 之后加入：

```js
            this._sourceData = null
```

- [ ] **Step 7: 新增画布布局、测量与初始化方法**

在 `applyWebCenterSize(data)` 方法之后加入：

```js
        async initCanvasLayout(source, token) {
            if (!source.data) {
                this.fail('画布平台仅支持 animationData 或 http(s) 数据源', token)
                return
            }
            this._sourceData = source.data
            const rect = await this.measureRoot()
            if (token !== this._loadToken) return
            if (!rect) {
                this.fail('组件宽高为 0，请为 u-lottie 设置明确的宽高', token)
                return
            }
            let width = rect.width
            let height = rect.height
            if (this.contentModel === 'Center') {
                const naturalWidth = Number(source.data.w)
                const naturalHeight = Number(source.data.h)
                if (naturalWidth > 0 && naturalHeight > 0) {
                    width = naturalWidth
                    height = naturalHeight
                }
            }
            this.canvasWidth = width
            this.canvasHeight = height
            this.canvasId = `u-lottie-canvas-${Date.now()}${Math.floor(Math.random() * 1000)}`
            this.canvasVisible = true
        },
        async measureRoot() {
            for (let attempt = 0; attempt < 10; attempt += 1) {
                const rect = await new Promise((resolve) => {
                    uni.createSelectorQuery()
                        .in(this)
                        .select('.u-lottie')
                        .boundingClientRect((result) => resolve(result))
                        .exec()
                })
                if (rect && rect.width > 0 && rect.height > 0) {
                    return rect
                }
                await new Promise((resolve) => setTimeout(resolve, 30))
            }
            return null
        },
        onCanvasReady() {
            if (!this.canvasVisible) return
            const token = this._loadToken
            this.$nextTick(() => {
                if (!this.canvasVisible || token !== this._loadToken) return
                this.initCanvasEngine(token)
            })
        },
        async initCanvasEngine(token) {
            // #ifdef MP-WEIXIN || APP-HARMONY
            if (token !== this._loadToken) return
            if (this._animation) {
                this.destroyEngine()
            }
            const canvasRef = this.$refs.canvasRef
            if (!canvasRef) {
                this.fail('画布未就绪', token)
                return
            }
            if (canvasEngineOwner && canvasEngineOwner !== this._instanceId) {
                this.fail('微信小程序与鸿蒙同一页面仅支持一个 u-lottie 实例', token)
                return
            }
            if (!canvasEngineOwner) {
                canvasEngineOwner = this._instanceId
                this._ownsCanvasEngine = true
            }
            try {
                // #ifdef MP-WEIXIN
                const node = canvasRef.getCanvasElement()
                const context = canvasRef.getRawContext()
                if (!node || !context) {
                    throw new Error('画布节点初始化失败')
                }
                if (typeof context.setTransform === 'function') {
                    context.setTransform(1, 0, 0, 1, 0, 0)
                }
                lottieMiniprogram.setup(node)
                this.startCanvasAnimation(context, token)
                // #endif

                // #ifdef APP-HARMONY
                const legacyContext = canvasRef.getRawContext()
                if (!legacyContext) {
                    throw new Error('画布上下文初始化失败')
                }
                this.fail('鸿蒙平台画布初始化失败', token)
                // #endif
            } catch (error) {
                this.releaseCanvasOwner()
                this.fail(this.normalizeError(error), token)
            }
            // #endif
        },
        startCanvasAnimation(context, token) {
            // #ifdef MP-WEIXIN || APP-HARMONY
            const animation = lottieMiniprogram.loadAnimation({
                animationData: this._sourceData,
                loop: this.loop,
                autoplay: false,
                rendererSettings: {
                    context,
                    preserveAspectRatio: this.preserveAspectRatio,
                    dpr: 1,
                    clearCanvas: true
                }
            })
            if (token !== this._loadToken) {
                animation.destroy()
                this.releaseCanvasOwner()
                return
            }
            this._animation = animation
            this.bindEngineEvents(animation, token)
            // #endif
        },
        releaseCanvasOwner() {
            // #ifdef MP-WEIXIN || APP-HARMONY
            if (this._ownsCanvasEngine && canvasEngineOwner === this._instanceId) {
                canvasEngineOwner = null
            }
            this._ownsCanvasEngine = false
            // #endif
        },
```

- [ ] **Step 8: 销毁时释放占用**

将 `destroyEngine()` 中：

```js
            this._ready = false
            this._engineState = 'idle'
```

替换为：

```js
            this.releaseCanvasOwner()
            this._ready = false
            this._engineState = 'idle'
```

- [ ] **Step 9: 验证 MP-WEIXIN 编译**

Run:

```bash
rm -rf dist/build/mp-weixin
npm run build:mp-weixin
```

Expected:
- 退出码 0。
- 构建日志没有 `lottie-miniprogram`、`u-canvas` 解析错误。

- [ ] **Step 10: 检查条件编译产物**

Run:

```bash
grep -rl "only support http protocol" dist/build/mp-weixin | head
grep -rl "createElementNS" dist/build/mp-weixin --include="*.js" --exclude-dir=static | head
```

Expected:
- 第一条命令输出至少一个文件，说明小程序引擎被打入。
- 第二条命令无输出，说明 lottie-web SVG 引擎未进入小程序代码产物（`static` 下的第三方静态文件不参与判定）。

再确认组件产物存在：

```bash
find dist/build/mp-weixin -path "*u-lottie*" -type f | head
```

Expected: 至少能看到 `u-lottie.wxml`、`u-lottie.js`、`u-lottie.json` 或等价的合并产物。

- [ ] **Step 11: 回归 H5**

Run（后台）：

```bash
npm run dev:h5
```

复用 Task 2 Step 7-9 的检查。

Expected: H5 行为与 Task 2 结束时一致，无控制台报错。

- [ ] **Step 12: 提交**

```bash
git add \
  src/uni_modules/uview-plus/components/u-lottie/u-lottie.vue \
  src/uni_modules/uview-plus/components/u-lottie/libs/wx-env.js
git commit -m "feat: 支持 u-lottie 微信小程序画布渲染" \
  -m "基于 u-canvas 与 lottie-miniprogram 接入小程序渲染，处理 DPR、单实例限制、尺寸测量与组件销毁。"
```

---

### Task 4: 鸿蒙旧版 CanvasContext 适配

**Files:**
- Create: `src/uni_modules/uview-plus/components/u-lottie/libs/harmony-canvas-adapter.js`
- Modify: `src/uni_modules/uview-plus/components/u-lottie/u-lottie.vue`

**Interfaces:**
- Consumes:
  - `u-canvas.getRawContext()` 返回的旧版 `CanvasContext`。
  - Task 3 的 `startCanvasAnimation(context, token)`、`releaseCanvasOwner()`。
- Produces:
  - `createHarmonyCanvasAdapter({ context, width, height })` 返回 `{ canvas, context, flush, destroy }`。
  - `canvas` 提供 `width`、`height`、`getContext('2d')`、`requestAnimationFrame`、`cancelAnimationFrame`、`createImage`。
  - `context` 提供 lottie canvas 渲染器使用的标准 2D 属性与方法。

- [ ] **Step 1: 创建适配层**

Create `src/uni_modules/uview-plus/components/u-lottie/libs/harmony-canvas-adapter.js`:

```js
function parseFontSize(font) {
    const matched = String(font || '').match(/(\d+(?:\.\d+)?)px/)
    return matched ? Number(matched[1]) : 10
}

export function createHarmonyCanvasAdapter(options = {}) {
    const legacy = options.context
    if (!legacy) {
        throw new Error('harmony canvas context is required')
    }

    const width = Number(options.width) > 0 ? Number(options.width) : 1
    const height = Number(options.height) > 0 ? Number(options.height) : 1

    const state = {
        fillStyle: '#000000',
        strokeStyle: '#000000',
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10,
        lineDashOffset: 0,
        lineDash: [],
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        font: '10px sans-serif'
    }
    const stack = []
    const rafIds = new Set()
    let dirty = false
    let flushing = false
    let destroyed = false

    const markDirty = () => {
        dirty = true
    }

    const flush = () => {
        if (destroyed || !dirty || flushing) return
        dirty = false
        flushing = true
        let released = false
        const release = () => {
            if (released) return
            released = true
            flushing = false
        }
        try {
            if (typeof legacy.draw === 'function') {
                legacy.draw(false, release)
                setTimeout(release, 80)
            } else {
                release()
            }
        } catch (error) {
            release()
        }
    }

    const sync = () => {
        if (typeof legacy.setFillStyle === 'function') {
            legacy.setFillStyle(state.fillStyle)
        }
        if (typeof legacy.setStrokeStyle === 'function') {
            legacy.setStrokeStyle(state.strokeStyle)
        }
        if (typeof legacy.setLineWidth === 'function') {
            legacy.setLineWidth(state.lineWidth)
        }
        if (typeof legacy.setLineCap === 'function') {
            legacy.setLineCap(state.lineCap)
        }
        if (typeof legacy.setLineJoin === 'function') {
            legacy.setLineJoin(state.lineJoin)
        }
        if (typeof legacy.setMiterLimit === 'function') {
            legacy.setMiterLimit(state.miterLimit)
        }
        if (typeof legacy.setGlobalAlpha === 'function') {
            legacy.setGlobalAlpha(state.globalAlpha)
        }
        if (typeof legacy.setGlobalCompositeOperation === 'function') {
            legacy.setGlobalCompositeOperation(state.globalCompositeOperation)
        }
        if (typeof legacy.setLineDash === 'function') {
            legacy.setLineDash(state.lineDash, state.lineDashOffset)
        }
        if (typeof legacy.setFontSize === 'function') {
            legacy.setFontSize(parseFontSize(state.font))
        }
    }

    const canvas = {
        width,
        height,
        getContext() {
            return context
        },
        requestAnimationFrame(callback) {
            const timer = setTimeout(() => {
                rafIds.delete(timer)
                if (destroyed) return
                try {
                    callback(Date.now())
                } finally {
                    flush()
                }
            }, 33)
            rafIds.add(timer)
            return timer
        },
        cancelAnimationFrame(timer) {
            if (rafIds.has(timer)) {
                clearTimeout(timer)
                rafIds.delete(timer)
            }
        },
        createImage() {
            const image = {
                width: 0,
                height: 0,
                _src: '',
                _localPath: '',
                onload: null,
                onerror: null,
                addEventListener(type, callback) {
                    if (type === 'load') image.onload = callback
                    if (type === 'error') image.onerror = callback
                }
            }
            Object.defineProperty(image, 'src', {
                get() {
                    return image._src
                },
                set(value) {
                    image._src = value
                    uni.getImageInfo({
                        src: value,
                        success(result) {
                            image.width = result.width || 0
                            image.height = result.height || 0
                            image._localPath = result.path || value
                            if (typeof image.onload === 'function') image.onload()
                        },
                        fail() {
                            if (typeof image.onerror === 'function') image.onerror()
                        }
                    })
                }
            })
            return image
        }
    }

    const context = {
        canvas,
        get fillStyle() {
            return state.fillStyle
        },
        set fillStyle(value) {
            state.fillStyle = value
        },
        get strokeStyle() {
            return state.strokeStyle
        },
        set strokeStyle(value) {
            state.strokeStyle = value
        },
        get lineWidth() {
            return state.lineWidth
        },
        set lineWidth(value) {
            state.lineWidth = value
        },
        get lineCap() {
            return state.lineCap
        },
        set lineCap(value) {
            state.lineCap = value
        },
        get lineJoin() {
            return state.lineJoin
        },
        set lineJoin(value) {
            state.lineJoin = value
        },
        get miterLimit() {
            return state.miterLimit
        },
        set miterLimit(value) {
            state.miterLimit = value
        },
        get lineDashOffset() {
            return state.lineDashOffset
        },
        set lineDashOffset(value) {
            state.lineDashOffset = value
        },
        get globalAlpha() {
            return state.globalAlpha
        },
        set globalAlpha(value) {
            state.globalAlpha = value
        },
        get globalCompositeOperation() {
            return state.globalCompositeOperation
        },
        set globalCompositeOperation(value) {
            state.globalCompositeOperation = value
        },
        get font() {
            return state.font
        },
        set font(value) {
            state.font = value
        },
        save() {
            stack.push(Object.assign({}, state))
            if (typeof legacy.save === 'function') legacy.save()
        },
        restore() {
            if (stack.length) Object.assign(state, stack.pop())
            if (typeof legacy.restore === 'function') legacy.restore()
            sync()
        },
        translate(x, y) {
            legacy.translate(x, y)
        },
        scale(x, y) {
            legacy.scale(x, y)
        },
        rotate(angle) {
            legacy.rotate(angle)
        },
        transform(a, b, c, d, e, f) {
            if (typeof legacy.transform === 'function') {
                legacy.transform(a, b, c, d, e, f)
            }
        },
        setTransform(a, b, c, d, e, f) {
            if (typeof legacy.setTransform === 'function') {
                legacy.setTransform(a, b, c, d, e, f)
            } else if (typeof legacy.transform === 'function') {
                legacy.transform(a, b, c, d, e, f)
            }
        },
        beginPath() {
            legacy.beginPath()
        },
        closePath() {
            legacy.closePath()
        },
        moveTo(x, y) {
            legacy.moveTo(x, y)
        },
        lineTo(x, y) {
            legacy.lineTo(x, y)
        },
        bezierCurveTo(a, b, c, d, e, f) {
            legacy.bezierCurveTo(a, b, c, d, e, f)
        },
        quadraticCurveTo(a, b, c, d) {
            if (typeof legacy.quadraticCurveTo === 'function') {
                legacy.quadraticCurveTo(a, b, c, d)
            }
        },
        rect(x, y, w, h) {
            legacy.rect(x, y, w, h)
        },
        arc(x, y, radius, start, end, anticlockwise) {
            if (typeof legacy.arc === 'function') {
                legacy.arc(x, y, radius, start, end, anticlockwise)
            }
        },
        fill() {
            sync()
            legacy.fill()
            markDirty()
        },
        stroke() {
            sync()
            legacy.stroke()
            markDirty()
        },
        clip() {
            if (typeof legacy.clip === 'function') {
                legacy.clip()
            }
        },
        clearRect(x, y, w, h) {
            if (typeof legacy.clearRect === 'function') {
                legacy.clearRect(x, y, w, h)
            }
            markDirty()
        },
        fillRect(x, y, w, h) {
            sync()
            if (typeof legacy.fillRect === 'function') {
                legacy.fillRect(x, y, w, h)
            }
            markDirty()
        },
        strokeRect(x, y, w, h) {
            sync()
            if (typeof legacy.strokeRect === 'function') {
                legacy.strokeRect(x, y, w, h)
            }
            markDirty()
        },
        drawImage() {
            const image = arguments[0]
            const source = image && (image._localPath || image._src || image.src)
            if (!source) return
            sync()
            const args = Array.prototype.slice.call(arguments, 1)
            try {
                if (args.length >= 8) {
                    legacy.drawImage(source, args[4], args[5], args[6], args[7])
                } else if (args.length >= 4) {
                    legacy.drawImage(source, args[0], args[1], args[2], args[3])
                } else {
                    legacy.drawImage(
                        source,
                        args[0] || 0,
                        args[1] || 0,
                        image.width || 0,
                        image.height || 0
                    )
                }
                markDirty()
            } catch (error) {
                // 单张图片绘制失败时跳过，避免中断整个动画
            }
        },
        createLinearGradient(x0, y0, x1, y1) {
            return legacy.createLinearGradient(x0, y0, x1, y1)
        },
        createRadialGradient(x0, y0, r0, x1, y1, r1) {
            return legacy.createRadialGradient(x0, y0, r0, x1, y1, r1)
        },
        setLineDash(segments, offset) {
            state.lineDash = Array.isArray(segments) ? segments.slice() : []
            if (typeof offset === 'number') {
                state.lineDashOffset = offset
            }
        },
        fillText(text, x, y) {
            sync()
            if (typeof legacy.fillText === 'function') {
                legacy.fillText(text, x, y)
            }
            markDirty()
        },
        strokeText(text, x, y) {
            sync()
            if (typeof legacy.strokeText === 'function') {
                legacy.strokeText(text, x, y)
            }
            markDirty()
        },
        measureText(text) {
            const fontSize = parseFontSize(state.font)
            return { width: String(text == null ? '' : text).length * fontSize * 0.6 }
        }
    }

    return {
        canvas,
        context,
        flush,
        destroy() {
            destroyed = true
            rafIds.forEach((timer) => clearTimeout(timer))
            rafIds.clear()
            stack.length = 0
        }
    }
}
```

- [ ] **Step 2: 引入适配层**

在 `u-lottie.vue` 的 `// #ifdef APP-HARMONY` 导入块中加入：

```js
import { createHarmonyCanvasAdapter } from './libs/harmony-canvas-adapter.js'
```

变更后该块为：

```js
// #ifdef APP-HARMONY
import './libs/wx-env.js'
import { createHarmonyCanvasAdapter } from './libs/harmony-canvas-adapter.js'
// #endif
```

- [ ] **Step 3: 实例化适配层**

将 `initCanvasEngine()` 中的：

```js
                // #ifdef APP-HARMONY
                const legacyContext = canvasRef.getRawContext()
                if (!legacyContext) {
                    throw new Error('画布上下文初始化失败')
                }
                this.fail('鸿蒙平台画布初始化失败', token)
                // #endif
```

替换为：

```js
                // #ifdef APP-HARMONY
                const legacyContext = canvasRef.getRawContext()
                if (!legacyContext) {
                    throw new Error('画布上下文初始化失败')
                }
                const adapter = createHarmonyCanvasAdapter({
                    context: legacyContext,
                    width: this.canvasWidth,
                    height: this.canvasHeight
                })
                this._harmonyAdapter = adapter
                lottieMiniprogram.setup(adapter.canvas)
                this.startCanvasAnimation(adapter.context, token)
                // #endif
```

- [ ] **Step 4: 初始化异常时清理适配层**

将 `initCanvasEngine()` 的 catch 块中：

```js
            } catch (error) {
                this.releaseCanvasOwner()
                this.fail(this.normalizeError(error), token)
            }
```

替换为：

```js
            } catch (error) {
                // #ifdef APP-HARMONY
                if (this._harmonyAdapter) {
                    this._harmonyAdapter.destroy()
                    this._harmonyAdapter = null
                }
                // #endif
                this.releaseCanvasOwner()
                this.fail(this.normalizeError(error), token)
            }
```

- [ ] **Step 5: 销毁时清理适配层**

将 `destroyEngine()` 中：

```js
            if (this._animation) {
                try {
                    this._animation.destroy()
                } catch (error) {
                    // 引擎可能尚未完成初始化，销毁失败不影响后续重载
                }
                this._animation = null
            }
            this.releaseCanvasOwner()
```

替换为：

```js
            if (this._animation) {
                try {
                    this._animation.destroy()
                } catch (error) {
                    // 引擎可能尚未完成初始化，销毁失败不影响后续重载
                }
                this._animation = null
            }
            // #ifdef APP-HARMONY
            if (this._harmonyAdapter) {
                this._harmonyAdapter.destroy()
                this._harmonyAdapter = null
            }
            // #endif
            this.releaseCanvasOwner()
```

- [ ] **Step 6: 初始化字段**

在 `created()` 的现有赋值之后加入：

```js
        this._harmonyAdapter = null
```

- [ ] **Step 7: 用 Node 跑适配层冒烟检查（不写入仓库）**

Run:

```bash
node --input-type=module - <<'NODE'
import { readFileSync } from 'fs'

const source = readFileSync(
    'src/uni_modules/uview-plus/components/u-lottie/libs/harmony-canvas-adapter.js',
    'utf8'
)
const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(source).toString('base64')
const { createHarmonyCanvasAdapter } = await import(moduleUrl)

const calls = []
const legacy = new Proxy({}, {
    get(target, key) {
        if (key === 'createLinearGradient' || key === 'createRadialGradient') {
            return () => ({ addColorStop() {} })
        }
        if (key === 'draw') {
            return (...args) => {
                calls.push(['draw', ...args])
                const callback = args[1]
                if (typeof callback === 'function') callback()
            }
        }
        return (...args) => {
            calls.push([key, ...args])
        }
    }
})

const adapter = createHarmonyCanvasAdapter({ context: legacy, width: 200, height: 200 })
const ctx = adapter.context
ctx.fillStyle = '#ff0000'
ctx.beginPath()
ctx.moveTo(0, 0)
ctx.lineTo(10, 10)
ctx.fill()
ctx.lineWidth = 3
ctx.strokeStyle = '#00ff00'
ctx.beginPath()
ctx.moveTo(0, 0)
ctx.stroke()
ctx.save()
ctx.globalAlpha = 0.5
ctx.restore()
ctx.setTransform(1, 0, 0, 1, 0, 0)
ctx.clearRect(0, 0, 200, 200)
adapter.flush()

const hasFillStyle = calls.some((call) => call[0] === 'setFillStyle' && call[1] === '#ff0000')
const hasLineWidth = calls.some((call) => call[0] === 'setLineWidth' && call[1] === 3)
const hasDraw = calls.some((call) => call[0] === 'draw')
const hasTransform = calls.some((call) => call[0] === 'setTransform')
if (!hasFillStyle || !hasLineWidth || !hasDraw || !hasTransform) {
    throw new Error(`adapter smoke failed: ${JSON.stringify({ hasFillStyle, hasLineWidth, hasDraw, hasTransform })}`)
}
console.log('adapter smoke ok:', calls.length, 'calls')
NODE
```

Expected: `adapter smoke ok: <数量> calls`，进程退出码 0。

- [ ] **Step 8: 回归 H5 与微信小程序构建**

Run:

```bash
npm run build:mp-weixin
```

Expected: 退出码 0。

Run（后台）：

```bash
npm run dev:h5
```

依次打开示例页，复用 Task 2 Step 7-9 的检查。

Expected: H5 行为不变，无控制台错误。

- [ ] **Step 9: 尝试鸿蒙编译（记录环境结果）**

Run:

```bash
npx uni build -p app-harmony
```

Expected（二选一）：
- 工具链完整：构建退出码 0，说明组件与适配层通过鸿蒙平台编译。
- 本机缺少鸿蒙构建环境：记录完整错误摘要，并在最终说明中写明「鸿蒙仅完成静态审查，未完成真实运行验证」。

无论结果如何，不得把未运行的鸿蒙行为描述为已验证。

- [ ] **Step 10: 提交**

```bash
git add \
  src/uni_modules/uview-plus/components/u-lottie/u-lottie.vue \
  src/uni_modules/uview-plus/components/u-lottie/libs/harmony-canvas-adapter.js
git commit -m "feat: 增加 u-lottie 鸿蒙画布适配" \
  -m "通过旧版 CanvasContext 适配层为鸿蒙提供尽力而为的 canvas 渲染，并处理绘制刷新、样式同步、图片加载与销毁清理。"
```

---

### Task 5: 最终验证与交付检查

**Files:**
- Verify: `src/uni_modules/uview-plus/components/u-lottie/**`
- Verify: `src/pages/componentsD/lottie/lottie.vue`
- Verify: `src/static/lottie/loading.json`
- Verify: `src/pages.json`

**Interfaces:**
- Consumes: 前四个任务的全部产物。
- Produces: 可交付的组件、示例页和平台验证结论。

- [ ] **Step 1: 检查工作区只包含预期改动**

Run:

```bash
git status --short
git diff --stat
```

Expected: 仅包含 `u-lottie` 组件目录、示例页、示例 JSON、`pages.json` 以及先前任务提交后的无残留临时文件。

- [ ] **Step 2: 运行 H5 生产构建**

Run:

```bash
rm -rf dist/build/h5
npm run build:h5
```

Expected: 退出码 0。

- [ ] **Step 3: 校验 H5 与小程序引擎隔离**

Run:

```bash
grep -rl "createElementNS" dist/build/h5 --include="*.js" --exclude-dir=static | head
grep -rl "only support http protocol" dist/build/h5 | head
rm -rf dist/build/mp-weixin
npm run build:mp-weixin
grep -rl "only support http protocol" dist/build/mp-weixin | head
grep -rl "createElementNS" dist/build/mp-weixin --include="*.js" --exclude-dir=static | head
```

Expected:
- H5：第一条有输出（包含 SVG 引擎）；第二条无输出（不包含小程序引擎）。
- MP：第三条有输出（包含小程序引擎）；第四条无输出（不包含 SVG 引擎）。
- 排除 `static` 目录是为了避让仓库原有的 `src/static` 第三方文件（如 pdf.js）中的同名 API。

- [ ] **Step 4: 完整回归 H5 示例页**

Run（后台）：

```bash
npm run dev:h5
```

依次确认：
1. 页面打开，蓝色圆弧持续旋转。
2. 三种填充模式分别对应 `none`、`xMidYMid slice`、`xMidYMid meet`，`Center` 容器为 200 x 200。
3. 播放 / 暂停 / 恢复 / 取消 / 循环开关均产生正确状态。
4. 非循环播放结束出现 `complete`，再次播放从头开始。
5. 舞台尺寸切换到 200 / 300 / 360，`Center` 始终按原始 200 x 200 居中并裁剪。
6. 控制台无错误。

- [ ] **Step 5: 静态检查不支持平台的分支**

Run:

```bash
grep -n "APP-NVUE\|MP-WEIXIN\|APP-HARMONY\|H5 || APP-PLUS" \
  src/uni_modules/uview-plus/components/u-lottie/u-lottie.vue
```

Expected:
- 能看到 `rendererKind` 中 APP-NVUE 与其他小程序的 `unsupported` 分支。
- 能看到 Web 轨的 `H5 || APP-PLUS` 与嵌套 `#ifndef APP-NVUE`。
- 能看到 Canvas 轨的 `MP-WEIXIN || APP-HARMONY`。

本机没有 nvue / 鸿蒙运行环境，nvue 只做静态确认：`rendererKind` 返回 `unsupported`，`reload()` 调用 `fail()` 派发 `error`，不会访问 `document` 或 `u-canvas`。

- [ ] **Step 6: 检查包体积与许可证**

Run:

```bash
ls -lh src/uni_modules/uview-plus/components/u-lottie/libs
```

Expected:
- 两个引擎文件各约 200KB 以上。
- 两份 LICENSE 存在。

- [ ] **Step 7: 最终提交（仅当有未提交改动）**

```bash
git status --short
```

如果没有改动，跳过提交。如果有验证过程中产生的必要修正：

```bash
git add \
  src/uni_modules/uview-plus/components/u-lottie \
  src/pages/componentsD/lottie/lottie.vue \
  src/static/lottie/loading.json \
  src/pages.json
git commit -m "fix: 完善 u-lottie 跨平台细节" \
  -m "根据 H5 与微信小程序构建验证结果修正渲染、尺寸或状态处理，并保持条件编译隔离。"
```

- [ ] **Step 8: 输出交付说明**

最终回复必须包含：
1. 已实现平台与验证方式。
2. 未能验证的平台及具体原因：App-Vue 需要原生运行环境；APP-HARMONY 需要鸿蒙工具链/真机；APP-NVUE 与其他小程序只做了静态分支检查。
3. 已知限制：小程序/鸿蒙单实例、鸿蒙滤镜与图片处理为尽力而为、小程序不能读取包内本地 JSON。
4. 示例页路径与使用方式。

---

## 验证命令汇总

```bash
# H5 开发预览
npm run dev:h5

# H5 生产构建
npm run build:h5

# 微信小程序构建
npm run build:mp-weixin

# 鸿蒙编译尝试（可能因本机环境失败）
npx uni build -p app-harmony

# 引擎隔离检查
grep -rl "createElementNS" dist/build/h5 --include="*.js" --exclude-dir=static
grep -rl "only support http protocol" dist/build/h5
grep -rl "only support http protocol" dist/build/mp-weixin
grep -rl "createElementNS" dist/build/mp-weixin --include="*.js" --exclude-dir=static
```

## 验收对照

| Spec 要求 | 落地任务 |
| --- | --- |
| props / 方法 / statechange 事件 | Task 2 |
| H5 / App-Vue SVG 渲染 | Task 2 |
| MP-WEIXIN canvas 渲染与单实例 | Task 3 |
| APP-HARMONY 旧版 CanvasContext 适配 | Task 4 |
| nvue / 其他小程序统一 error | Task 2 + Task 5 静态检查 |
| ScaleToFill / AspectFill / Center | Task 2（Web）+ Task 3（Canvas） |
| 数据源优先级与本地路径限制 | Task 2 |
| 尺寸测量、重载、销毁 | Task 2 + Task 3 + Task 4 |
| 示例页与本地示例 JSON | Task 1 + Task 2 |
| 条件编译产物隔离 | Task 3 + Task 5 |
| 无法本机验证的平台记录原因 | Task 4 + Task 5 |
