# App 端内置图标字体本地加载设计

## 背景

GitHub issue #1044 反馈 uview-plus 3.8 在 App 端把 `u-icon` 的远程 `@font-face` 编译进样式后，弱网环境会阻塞页面渲染；同时 `u-icon` 实例较多时会重复调用 `uni.loadFontFace`，放大网络请求和卡顿风险。

当前代码中，`components/u-icon/u-icon.vue` 在 `APP` 条件下包含远程 CDN `@font-face`，`components/u-icon/util.js` 默认从 `config.iconUrl` 加载远程字体，且 `loadFontOnce` 默认关闭时每个图标实例都可能触发一次加载。

## 目标

- App 端内置图标字体默认只使用包内本地字体，不再请求远程 CDN。
- App 端内置字体加载失败时不回退远程，避免弱网阻塞重新出现。
- App 端内置字体只加载一次，避免多图标页面重复调用字体加载 API。
- H5 和小程序继续沿用现有远程 `config.iconUrl` 行为，降低跨端回归风险。
- 保留自定义图标 `config.customIcon` 现有能力。

## 非目标

- 不改变图标 unicode 映射和 `u-icon` 组件 API。
- 不为用户项目生成或修改 `static/app-plus/fonts/upfont.ttf`。
- 不改变 H5、小程序默认字体源。
- 不引入构建插件或要求用户手动配置 PostCSS。

## 方案

采用 App 端本地字体严格模式。

1. 将内置 `upicon.ttf` 作为 `uview-plus/components/u-icon/upicon.ttf` 随 uni_modules 包分发。
2. 在 `components/u-icon/util.js` 中新增平台条件逻辑：
   - App Vue 页面通过本地路径调用 `uni.loadFontFace` 加载 `uicon-iconfont`。
   - App nvue 页面通过 `weex.requireModule('dom').addRule('fontFace')` 加载同一本地字体。
   - 非 App 平台继续使用 `config.iconUrl`。
3. 从 `u-icon.vue` 的 App 条件编译中移除远程 `@font-face`，避免生成的 App 样式触发 CDN 请求。
4. 对内置字体加载状态进行收敛：
   - App 端首次进入 `loadFont()` 即标记已加载，后续 `u-icon` 实例不再重复调用。
   - 非 App 平台继续尊重 `config.loadFontOnce`，维持原兼容行为。
5. 自定义图标仍按现有 `config.customIcon.family/url` 加载，不强制本地化，避免破坏用户已有配置。

## 数据流

`u-icon.beforeCreate()` 检查 `fontUtil.params.loaded`。若未加载，则调用 `fontUtil.loadFont()`。`loadFont()` 根据编译平台选择内置字体源：

- `APP` / `APP-NVUE`：使用包内 `./upicon.ttf` 对应的运行时可访问本地路径。
- H5 / 小程序：使用 `config.iconUrl`。

加载完成与否不改变图标组件渲染流程；字体不可用时图标按平台默认字体行为降级，但 App 不再触发远程网络阻塞。

## 错误处理

- App 端内置字体加载失败时不发起远程请求。
- `uni.loadFontFace` 和 `dom.addRule` 的失败回调保持静默，延续现有组件库行为。
- 自定义图标失败处理不变。

## 测试

- 新增轻量验证脚本，检查 App 条件下 `u-icon.vue` 不再包含远程 CDN `@font-face`。
- 验证 `util.js` 存在 App 本地字体路径、`loadFontOnce` 收敛逻辑和非 App `config.iconUrl` 路径。
- 运行现有相关验证脚本，确保改动不影响已覆盖的组件约束。

## 影响

- App 端用户无需额外下载字体或写 PostCSS 改写规则。
- App 端内置图标不再依赖 at.alicdn.com，弱网下避免字体网络阻塞。
- 包体增加一个约 55KB 的 ttf 文件。
- 如果用户依赖修改 `config.iconUrl` 来替换内置图标字体，App 端默认将不再使用该远程地址；自定义图标仍应通过 `customIcon` 配置。
