# App static 图标字体加载设计

## 背景

2026-07-23 的 App 本地图标字体方案把 `upicon.ttf` 交给 Vite 以 `?url` 发射，App 产物会引用 `/assets/upicon.<hash>.ttf`。iOS App 端用户反馈 `u-icon` 不显示，构建产物复现到同一路径后，问题集中在 App 本地字体路径不符合 uni-app 对 `static` 资源的使用约定。

本设计覆盖旧设计中的“无需手动拷贝到 static，也不生成 static/app-plus 字体文件”决定。

## 目标

- 未启用 `UniUpRoot` 的老项目升级后，App 端继续保留远程 CSS `@font-face` 和 `config.iconUrl` 加载，避免图标突然缺失。
- 启用 `UniUpRoot` 的 App / App-nvue 项目，构建时自动把包内 `components/u-icon/upicon.ttf` 复制到应用 `static/app-plus/uview-plus/upicon.ttf`。
- 启用 `UniUpRoot` 后，App 运行时通过 `_www/static/app-plus/uview-plus/upicon.ttf` 定位字体，并优先用 `plus.io.convertLocalFileSystemURL` 转为平台绝对路径。
- 启用 `UniUpRoot` 后，构建阶段移除 App 远程 CSS 字体条件，避免本地字体与远程字体同时加载。
- H5 和小程序继续使用 `config.iconUrl`，不引入新的 static 资源依赖。
- 保留 `config.customIcon` 的现有加载方式。

## 非目标

- 不改变图标 unicode 映射、字体 family 名称或 `u-icon` 组件 API。
- 不改变用户自定义图标字体的路径策略。
- 不为非 App 平台复制 `upicon.ttf`。

## 方案

在现有 `UniUpRoot` Vite 插件中加入 App 平台构建钩子。插件已负责识别 CLI 与 HBuilderX 的 `UNI_INPUT_DIR`，因此由它计算应用根目录并写入 `static/app-plus/uview-plus/upicon.ttf`。复制前比较文件大小和内容，目标已一致时不重写，避免重复构建导致无意义的文件变更。

`components/u-icon/util.js` 不再 import `./upicon.ttf?url`，源码默认仍使用 `config.iconUrl`，保证未启用 Root 插件的项目保留旧行为。`UniUpRoot` 启用且平台为 App 时，插件把 `util.js` 中的 `useAppStaticIconFont` 编译开关改为 `true`，App / App-nvue 分支才使用 `_www/static/app-plus/uview-plus/upicon.ttf`，并在 `plus.io.convertLocalFileSystemURL` 可用时转换成本机路径后传给 `uni.loadFontFace` 或 nvue `dom.addRule`。

`components/u-icon/u-icon.vue` 源码默认保留 App 远程 CSS `@font-face`。`UniUpRoot` 启用且平台为 App 时，插件把该条件改成仅保留小程序平台，让启用 Root 的项目只走本地字体。实际构建中 `uni:pre` 会先于 Root 插件执行并把 App 条件编译成无条件 CSS，因此 Root 插件还会处理已经编译过的 SFC/style block，并在 `generateBundle` 阶段兜底移除 CSS asset 中的内置远程 `@font-face`。

## 测试

- 扩展 `verify:app-local-icon-font`，断言默认源码保留 App 远程 CSS `@font-face` 和 `config.iconUrl` 兼容路径。
- 在临时 uni-app 项目中直接执行 `UniUpRoot.buildStart()`，断言 App 平台会复制 `upicon.ttf` 到 `static/app-plus/uview-plus/upicon.ttf` 且内容一致。
- 直接调用 `UniUpRoot.transform()`，断言启用 Root 后 `util.js` 切到 static 字体开关，`u-icon.vue` 移除 App 远程 CSS 条件但保留小程序条件。
- 模拟 `uni:pre` 已经展开 App 条件后的 SFC/style block，并模拟生成的 CSS asset，断言 Root 插件仍会移除内置远程 `@font-face`。
- 验证 `util.js` 不再包含 `?url`，并包含 `_www/static/app-plus/uview-plus/upicon.ttf` 与 `plus.io.convertLocalFileSystemURL`。

## 影响

启用 `UniUpRoot` 的 App 构建会在应用源码的 `static/app-plus/uview-plus/upicon.ttf` 写入一份组件库内置字体。用户无需手工复制；如果用户项目已存在同一路径但内容不同，构建会用组件库内置字体覆盖，保证 `u-icon` 默认字体与 unicode 映射匹配。

未启用 `UniUpRoot` 的老项目不会自动写入 `static/app-plus`，仍按远程 CSS 字体和 `uni.loadFontFace(config.iconUrl)` 工作，降低升级风险。
