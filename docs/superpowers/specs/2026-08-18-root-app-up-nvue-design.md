# Root App.up.vue nvue 复用设计

## 目标

让 Root 插件处理的原生 App nvue 页面也实例化项目根文件 `App.up.vue`，使 Vue 页面与 nvue 页面共享同一份根容器源码。根容器中的页面背景、主题刷新、Root View 内容、Toast/Notify 宿主以及后续在 `App.up.vue` 中增加的调试标识，都应在两种渲染器中生效。

这里的“共享”指共享源码和行为，不跨 WebView 共享 Vue 实例。每个 nvue 页面仍由 uni-app 创建独立的 `Vue.createPageApp` 实例。

## 范围与约束

- 只处理当前 Root 插件已经通过 `pages.json` 匹配的页面和分包页面。
- 保留非 App 平台和现有 APP-VUE 页面行为。
- 保留 nvue 页面现有的 `page-meta` 导航栏注入、主题辅助计算属性和全局 Root ref 能力。
- 不要求把 nvue 页面转换为 WebView Vue；页面继续走原生 nvue 编译器。
- 不依赖 App Service 的全局组件注册，因为 nvue 子构建会为页面创建独立 Vue 应用。

## 方案

### nvue 页面注入

`libs/root/index.js` 将项目 `App.up.vue` 的相对路径传给 `transformNvuePage`。`libs/root/page.js` 在 nvue 页面模板外层使用 `AppUpRoot`，并按页面脚本类型注入本地组件：

- `script setup` 页面导入 `AppUpRoot`，由 Vue 3 script setup 自动注册。
- Options API 页面把 `AppUpRoot` 加入 `components`。
- 无脚本页面生成包含 `AppUpRoot` 的最小脚本。

原有的 nvue 主题辅助注入继续保留，因为页面自身仍可能使用 `upThemeVar`、`upThemePageStyle`、导航栏颜色等属性。`UpNvueRoot` 不再作为默认页面外壳，但 `nvue-root.vue` 文件保留，避免对外部直接引用造成破坏。

### App.up.vue 的 nvue 兼容

`App.up.vue` 继续作为根容器唯一源码。其 `APP-NVUE` 分支负责：

- 使用对象样式提供实际页面高度、`750rpx` 宽度和主题背景色。
- 在创建/显示/销毁阶段同步主题运行时和 `uThemeChange` 监听。
- 避免把 `:root`、`body` 等仅 WebView 有效的全局选择器送入 nvue 样式编译器。

Vue/H5 等平台继续保留现有全局 SCSS 导入和 CSS 变量入口；nvue 只编译简单的根容器样式。

### Root Toast/Notify 宿主

`rebuildUpApp` 在替换 `<UpRootView />` 时，把 Toast/Notify 宿主改为本地组件 `UpRootToastHost`，并向 `App.up.vue` 注入相对导入：

- `script setup` 通过导入自动注册。
- Options API 注入 `components` 注册。
- 无脚本页面生成脚本并注册组件。

这样 nvue 页面不需要依赖 `main.js` 中只对 App Service 生效的 `app.component` 注册。原有全局注册保留，兼容其他 Root 使用方式。

### 错误与兼容处理

- Root 自动创建 `App.up.vue` 的逻辑保持不变，缺少根文件时仍使用最小模板。
- 自定义 `App.up.vue` 如果包含 nvue 不支持的模板、组件或样式，由 nvue 编译器正常报错，错误定位保持在根文件；不静默降级到另一份根模板，避免 Vue/nvue 行为分叉。
- 页面没有模板或脚本时沿用现有 Root 注入策略，保证生成的 SFC 仍可编译。

## 测试

- 增加 Root nvue 注入验证：断言 nvue 页面导入项目 `App.up.vue`、模板使用 `AppUpRoot`，并覆盖 script setup、Options API、无脚本三种页面形态。
- 增加 App.up 重建验证：断言 Root View 被替换为 slot、Toast/Notify 宿主被本地导入并注册。
- 增加源码断言：`App.up.vue` 的 WebView 全局样式位于非 nvue 条件内，nvue 分支包含根宽度和页面高度处理。
- 运行现有 `verify:app-nvue-as-vue`、`verify:root-nvue-entry-signatures`、`verify:app-local-icon-font`，并执行一次 App 平台构建检查 nvue 子构建可以解析根组件。

