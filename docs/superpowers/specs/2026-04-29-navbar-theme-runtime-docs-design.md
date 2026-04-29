# 导航栏主题变量收敛与主题文档澄清设计

## 背景

当前 `uview-plus` 已同时存在三套与主题相关的能力：

1. `uni-app` 原生 `theme.json` / `pages.json` 声明式主题配置
2. `uview-plus` CSS 变量体系（`--up-*` / `--u-*`）
3. `uview-plus` 运行时主题系统（`setTheme` / `setThemePreference` / `setConfig({ color })`）

用户容易产生两个误解：

1. 误以为导航栏颜色最终来自 `theme.json`
2. 误以为旧版 `uni.scss` 中手写的 `$u-*` 覆盖在 `3.8+` 后仍与旧版本完全等价

实际情况是：`uview-plus` 运行时主题系统会主动调用原生 UI 同步逻辑，导航栏最终效果以运行时主题变量链为准，而不是仅由 `theme.json` 决定。

## 目标

本次调整只解决两个问题：

1. 收敛导航栏颜色来源，让运行时同步统一优先读取 `--up-navbar-bg-color`
2. 在文档中明确 `theme.json`、CSS 变量、运行时主题 API、旧版 `uni.scss` 兼容桥之间的职责和优先级

## 非目标

本次不处理以下事项：

1. 不重构整个主题系统架构
2. 不改动 `theme.json` / `pages.json` 的现有声明式结构
3. 不引入新的主题开关或新的公共 API
4. 不扩展旧 `$u-*` 自动生成 dark 主题

## 方案对比

### 方案 A：只改文档

- 优点：实现成本最低
- 缺点：运行时代码仍存在两套导航栏取值口径，文档解释成本高

### 方案 B：统一导航栏运行时取值，并补全文档

- 优点：代码和文档口径一致，用户只需要记住 `--up-navbar-bg-color`
- 缺点：需要同时修改框架代码和文档

### 方案 C：全面重写主题文档和运行时主题接口

- 优点：最彻底
- 缺点：范围明显超出当前问题

## 采用方案

采用 **方案 B**。

## 设计

### 1. 运行时导航栏颜色来源收敛

当前 `runtime.js` 已经通过 `getThemeVar('--up-navbar-bg-color', fallback)` 获取导航栏背景色，但 `theme.js` 的原生 UI 同步仍直接优先读取 `config.color['up-navbar-bg-color']` / `config.color['u-navbar-bg-color']`。

本次应统一为同一条主题变量链：

1. 优先使用运行时主题变量中的 `--up-navbar-bg-color`
2. 如果存在别名变量，则保持 `--u-navbar-bg-color` 兼容
3. 都没有时再使用 light `#ffffff` / dark `#1c1c1e` 作为兜底

这样以下来源最终都能收敛到同一个导航栏 token：

1. 旧 `uni.scss` `$u-*` light bridge
2. CSS 变量自定义
3. `setConfig({ color })`
4. `setTheme` / `setThemePreference`

### 2. `theme.json` 的角色定义

文档需要明确：

1. `theme.json` 是 `uni-app` 的声明式默认值入口
2. 它通过 `pages.json` 中的 `@变量名` 参与页面配置
3. 当 `uview-plus` 运行时主题系统开始同步原生 UI 时，导航栏、背景色、tabBar 的最终视觉效果以运行时主题变量为准

这不是否定 `theme.json`，而是明确职责边界：

- `theme.json` 负责声明式默认配置
- `uview-plus` 运行时主题负责应用运行过程中的主动同步和动态切换

### 3. 文档组织方式

主说明放在 guide 文档：

1. `../uview-plus-doc/docs/guide/theme.md`
2. `../uview-plus-doc/docs/guide/darkMode.md`

安装入口文档只放摘要和跳转，不复制长篇说明：

1. `../uview-plus-doc/docs/components/npmSetting.md`
2. `../uview-plus-doc/docs/components/downloadSetting.md`

如有必要，可同步更新：

1. `../uview-plus-doc/docs/components/settingDesc.md`
2. `../uview-plus-doc/docs/components/common.md`

但以“不重复维护内容”为原则，只补摘要和跳转。

### 4. 老版本兼容说明

文档必须明确 `3.8+` 后的兼容边界：

1. 主题体系已迁移到 CSS 变量为主
2. 旧 `uni.scss` 中手写的 `$u-*` 仍兼容，但只桥接到 light 主题
3. dark 主题不会从旧 `$u-*` 自动生成
4. 若业务使用 `setConfig({ color })`，显式运行时改色优先级高于旧 bridge
5. 旧项目必须继续保留 `@import 'uview-plus/theme.scss';`
6. 旧 `$u-*` 变量必须写在 `@import 'uview-plus/theme.scss';` 之前

### 5. 验收标准

代码层面：

1. `theme.js` 与 `runtime.js` 的导航栏运行时取值口径一致
2. 运行时主题切换后，导航栏颜色优先跟随 `--up-navbar-bg-color`
3. 不影响已有的 H5 `page not found` 兜底逻辑

文档层面：

1. 用户能明确区分 `theme.json` 与运行时主题的职责
2. 用户能知道导航栏推荐定制入口是 `--up-navbar-bg-color`
3. 老版本用户能看到 `3.8+` 迁移提醒和兼容边界

## 风险与注意事项

1. 文档中不能把 `theme.json` 描述为“无效”或“弃用”，它仍然承担声明式默认配置职责
2. 运行时代码收敛时不能破坏 `setConfig({ color })` 现有优先级
3. 安装入口文档只应摘要说明，否则后续容易与 guide 文档失去同步

## 测试思路

1. 检查 light / dark 两种模式下导航栏颜色是否都能由 `--up-navbar-bg-color` 驱动
2. 检查旧 `$u-*` bridge 是否仍能影响 light 模式导航栏
3. 检查 `setConfig({ color: { 'up-navbar-bg-color': ... } })` 是否仍可覆盖
4. 检查文档中的旧版说明与新主题说明不存在互相冲突的表述
