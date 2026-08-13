# App 编译将 nvue 按 Vue 处理设计

## 背景

示例项目大部分页面使用 `.nvue` 文件时，为了对比普通 Vue 渲染效果，当前需要手动修改文件扩展名或维护重复页面，调试成本较高。

uni-app 会根据 `pages.json` 页面规范化结果中的 `style.isNVue` 决定页面进入 Vue builder 还是 nvue builder。App 平台的页面后缀解析仍优先查找 `.nvue`，因此仅修改 `manifest.json` 中的 nvue 编译器配置不能覆盖只有 `.nvue` 文件的页面。

## 目标

- 提供项目级全局编译开关，将 App 编译中的普通 `.nvue` 页面按 Vue 页面处理。
- 不修改页面文件扩展名，不复制页面文件，不增加重复路由。
- 开关关闭时保持现有行为。
- 仅影响 App 编译；H5 和小程序编译保持原有行为。
- 保留 `.nvue` 文件作为页面源文件，继续使用 uni-app 原有的页面后缀解析逻辑。
- 保留 `subNVue` 虚拟页面的原生 nvue 行为。

## 非目标

- 不改变 `.nvue` 文件本身的 Vue 模板、脚本或样式语法。
- 不修改 `node_modules` 中的 uni-app 编译器源码。
- 不改变生产构建默认行为。
- 不处理模拟器或真机运行时的像素密度、Canvas DPR 或图片导出质量问题。

## 方案

在项目中新增 Vite 插件 `vite-plugins/app-nvue-as-vue.mjs`，并在 `vite.config.ts` 中显式配置开关：

```ts
const APP_NVUE_AS_VUE = false
```

插件支持通过环境变量临时覆盖配置：

```text
APP_NVUE_AS_VUE=true
```

最终开关满足以下条件时才生效：

```text
配置开关开启 或 APP_NVUE_AS_VUE=true
且 UNI_PLATFORM=app
```

插件必须在 `uni()` 之前初始化，确保 uni-app 创建 Vue 和 nvue 页面插件前完成页面解析函数包装。

## 编译流程

1. Vite 加载项目配置。
2. 项目插件读取配置开关和当前平台。
3. 当目标平台为 App 且开关开启时，包装 `@dcloudio/uni-cli-shared/dist/json/pages.js` 的：
   - `normalizePagesJson`
   - `parsePagesJsonOnce`
4. 包装函数调用 uni-app 原始实现，保持页面过滤、平台样式、主题和页面缓存等行为不变。
5. 对返回结果中的普通页面执行：
   - 页面存在真实 `.nvue` 文件且不是 `isSubNVue` 虚拟页面时，将 `style.isNVue` 设为 `false`。
6. Vue builder 读取结果后，将页面加入普通 Vue 页面注册，并通过 App 页面后缀解析找到原始 `.nvue` 文件。
7. nvue builder 读取同一结果后，不再为这些普通 `.nvue` 页面生成 nvue 页面入口。
8. H5、小程序及开关关闭场景不包装页面解析函数。

## 模块职责

### `app-nvue-as-vue.mjs`

- 解析布尔开关。
- 判断当前是否为 App 平台。
- 包装页面解析函数。
- 仅修改普通页面的 `isNVue` 标记。
- 提供幂等保护，避免 Vite 配置或多次构建初始化时重复包装。

### `vite.config.ts`

- 保存默认关闭的项目级开关。
- 在 `uni()` 前注册项目插件。
- 不改变其他平台插件顺序和配置。

### `scripts/verify-app-nvue-as-vue.mjs`

- 使用隔离的 Node 进程加载插件和 uni-cli-shared。
- 验证开关关闭时页面标记不变。
- 验证 App 开启时普通 `.nvue` 页面标记为 `false`。
- 验证 `subNVue` 页面不被错误转换。
- 验证 H5 和小程序平台不受影响。
- 验证 App 页面代码进入 Vue 页面注册，不进入 nvue 页面注册。

## 错误处理

- 无法加载 uni-cli-shared 页面模块时直接抛出错误，避免静默生成错误的 App 页面。
- 页面解析原始函数抛出的错误原样向上传递。
- 非布尔环境变量值不视为开启，只有 `true`、`1` 或 `yes`（忽略大小写）才开启。
- 插件不修改源文件；构建失败时不会留下页面文件副本或扩展名变更。

## 兼容性和风险

- 该方案依赖 uni-app 当前公开包导出及页面规范化内部模块路径，需在 uni-app 依赖升级后运行验证脚本。
- 只修改页面分类标记，不改变 Vue compiler 的页面后缀解析，因此 `.nvue` 页面仍使用原文件作为输入。
- 使用普通 Vue 编译后，依赖 nvue 原生组件、nvue 专有样式或 nvue 编译限制的页面可能出现编译或运行差异，这是开关的预期用途和已知影响。
- `subNVue` 继续保持 nvue 分类，避免影响原生覆盖层页面。

## 验证标准

满足以下条件才视为完成：

1. `APP_NVUE_AS_VUE=false` 或未设置时，现有 App 页面分类和产物路径不变。
2. App 开启开关后，至少一个只有 `.nvue` 文件的页面：
   - 在 Vue 页面注册代码中出现；
   - 不在 nvue 页面注册代码中出现；
   - 实际导入路径仍指向 `.nvue` 文件。
3. H5 和至少一个小程序平台在开关开启时仍按原有逻辑处理 `.nvue` 页面。
4. 验证脚本通过。
5. App 构建至少完成一次；若受本机原生构建环境限制无法完成，必须记录具体阻塞原因。
