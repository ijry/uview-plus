# 旧版 uni.scss 主题桥接设计

## 背景

uview-plus 在近期主题系统升级后，将原先以纯 SCSS 变量为核心的主题机制，切换为以 `--up-*` / `--u-*` CSS 变量和运行时主题状态为核心的方案。

升级前，用户常见做法是：

1. 在 `uni.scss` 中引入 `uview-plus/theme.scss`
2. 在同一文件里手写覆盖 `$u-primary`、`$u-main-color`、`$u-border-color` 等变量
3. 依赖组件内部的 `$u-*` 变量消费这些自定义值

升级后出现的兼容问题是：

1. `theme.scss` 已从纯 SCSS 常量切换为 `var(--up-xxx)` 代理
2. `index.scss` 会主动注入默认 `--up-*` 变量
3. 一部分组件已优先消费 `--up-*`，甚至直接写成 `var(--up-xxx, #fallback)`
4. 旧用户在 `uni.scss` 中覆写的 `$u-*`，无法再稳定成为最终渲染颜色来源

这会导致老项目升级后，浅色主题下的品牌色、文字色、边框色等与历史版本不一致。

## 目标

1. 兼容所有在 `uni.scss` 中手写的 `$u-*` 变量覆盖
2. 兼容方式尽量不要求老用户改接入代码
3. 旧变量只覆盖 light 主题
4. dark 主题继续使用框架当前默认暗色体系
5. 保持现有 `setTheme` / `setThemePreference` / `uThemeChange` 运行时机制不变

## 非目标

1. 不兼容任意业务 CSS 选择器写死颜色的页面级样式
2. 不把旧 `$u-*` 自动推导为一套新的暗黑主题色
3. 不回退当前 CSS 变量和运行时主题体系
4. 不要求所有组件立即回退到 `$u-*` 优先

## 问题根因

当前主题系统存在两条来源链路：

1. 编译期链路
   `uni.scss` -> `theme.scss` -> `$u-*`

2. 运行时链路
   `theme-vars-core.scss` + `theme.js` + `runtime.js` -> `--up-*` / `--u-*`

兼容问题来自两点：

1. 编译期 `$u-*` 已不再直接产出最终颜色，而是转成对 `--up-*` 的引用
2. 运行时与全局样式层已经预先定义了默认 `--up-*`，导致 `$u-*` fallback 很多时候不会生效

因此，单纯保留旧 `theme.scss` 文件名并不能保证旧主题覆盖继续生效。

## 选定方案

采用“旧 `$u-*` 作为 light 主题源，编译期桥接为 CSS 变量”的方案。

核心原则：

1. 用户仍然可以在 `uni.scss` 中覆写 `$u-*`
2. 框架在编译期把这些 `$u-*` 的最终值导出为 light 主题下的 `--up-*` / `--u-*`
3. dark 主题变量仍由 `theme-vars-core.scss` 和运行时主题系统提供
4. 当主题模式为 `light` 或 `system + light` 时，旧值生效
5. 当主题模式为 `dark` 或 `system + dark` 时，继续使用框架暗色默认值

## 方案细节

### 1. 变量职责重新划分

变量来源分为两层：

1. light 桥接层
   来源：用户在 `uni.scss` 中最终得到的 `$u-*`
   产出：`[data-up-theme='light']` 与默认 light 上下文使用的 `--up-*` / `--u-*`

2. dark 默认层
   来源：框架内置暗色语义变量
   产出：`@media (prefers-color-scheme: dark)` 与 `[data-up-theme='dark']`

这样可以保证老用户的旧主题覆盖只影响浅色，不污染暗色模式。

### 2. bridge 的输出范围

桥接层至少覆盖以下变量：

1. 主题色族
   - `$u-primary`
   - `$u-primary-dark`
   - `$u-primary-disabled`
   - `$u-primary-light`
   - `$u-success`
   - `$u-success-dark`
   - `$u-success-disabled`
   - `$u-success-light`
   - `$u-warning`
   - `$u-warning-dark`
   - `$u-warning-disabled`
   - `$u-warning-light`
   - `$u-error`
   - `$u-error-dark`
   - `$u-error-disabled`
   - `$u-error-light`
   - `$u-info`
   - `$u-info-dark`
   - `$u-info-disabled`
   - `$u-info-light`

2. 语义文字与边框背景
   - `$u-main-color`
   - `$u-content-color`
   - `$u-tips-color`
   - `$u-light-color`
   - `$u-border-color`
   - `$u-bg-color`
   - `$u-disabled-color`

3. 可选扩展项
   如果后续文档中已有更多 `u-` / `up-` 颜色令牌，也应一并纳入桥接清单，避免只兼容主色不兼容衍生令牌。

### 3. 输出策略

输出规则如下：

1. `theme.scss` 中保留 `$u-*` 变量定义，允许用户在导入前后覆写
2. 新增一个 light bridge 样式块，把 `$u-*` 的最终值写入：
   - `:root`
   - `page`
   - `body`
   - `[data-up-theme='light']`

3. 同时输出：
   - `--up-*`
   - `--u-*`

4. `theme-vars-core.scss` 中 dark 部分保持原样

这样，老用户即便完全不使用 `setConfig({ color })`，其 `uni.scss` 自定义仍可进入新的 CSS 变量消费链路。

### 4. 与运行时主题的关系

运行时主题系统不移除，但职责调整为：

1. dark 模式切换与系统跟随仍由 `theme.js` 负责
2. light 模式下若用户未做运行时颜色配置，则直接消费 bridge 产出的 CSS 变量
3. 若用户显式调用 `setConfig({ color })`，运行时配置可继续覆盖默认 light 颜色
4. bridge 兼容旧 SCSS；`setConfig({ color })` 面向新方案

需要保持一个稳定优先级：

1. 运行时显式颜色配置
2. 旧 `uni.scss` light bridge
3. 框架默认 light 变量

### 5. 对组件的预期影响

兼容后，以下组件类别可自动恢复旧 light 主题表现：

1. 仍通过 `$u-*` 间接取色的组件
2. 使用 `var(--up-xxx, $u-xxx)` 的组件
3. 已直接使用 `var(--up-xxx, #fallback)` 的组件

第 3 类之所以能恢复，是因为其 `--up-*` 将由 light bridge 提供旧值。

### 6. 与暗黑模式的边界

本方案明确不做以下行为：

1. 不将 `$u-primary` 自动映射为 dark 下的 `--up-primary`
2. 不根据旧 light 主题自动推导 dark 衍生色
3. 不把用户旧的浅色边框、浅色背景直接带入 dark

dark 保持框架现有语义变量值，确保对比度和可用性优先。

## 文件改动建议

### 需要修改

1. `src/uni_modules/uview-plus/theme.scss`
   增加 light bridge 输出，确保 `$u-*` 最终值写入 `--up-*` / `--u-*`

2. `src/uni_modules/uview-plus/libs/css/theme-vars-core.scss`
   调整 light 默认变量来源边界，避免覆盖 bridge 产出的 light 值

3. `src/uni_modules/uview-plus/libs/theme/theme.js`
   明确 light 主题构建时优先级，避免运行时默认值无条件覆盖 bridge

4. `src/uni_modules/uview-plus/libs/theme/runtime.js`
   确保读取 light 主题变量时，能正确回落到 bridge 注入结果

### 建议补充文档

1. `uview-plus-doc/docs/guide/theme.md`
   标注旧 SCSS 主题定制在新版本中的兼容策略

2. `uview-plus-doc/docs/guide/darkMode.md`
   说明“旧 `$u-*` 只覆盖 light，不覆盖 dark”

## 验证方案

至少验证以下场景：

1. 老项目仅在 `uni.scss` 中覆写 `$u-primary`
   预期：light 下主色恢复旧值，dark 仍用默认暗色体系

2. 老项目覆写 `$u-main-color`、`$u-content-color`、`$u-border-color`
   预期：light 下文字和边框恢复旧值

3. 组件直接写 `var(--up-primary, #2979ff)`
   预期：light 下命中 bridge 变量，而不是默认 fallback

4. `setThemePreference('system')`
   预期：系统亮色时读取 bridge；系统暗色时读取框架 dark 变量

5. `setTheme('light')` / `setTheme('dark')`
   预期：light 与 dark 强制切换均正常

6. 未自定义 `uni.scss`
   预期：行为与当前版本一致，无额外回归

## 风险与取舍

### 风险

1. `theme.scss` 和 `theme-vars-core.scss` 都参与 light 变量输出，若优先级处理不当，会出现 bridge 被默认值覆盖
2. 若部分组件仍混用旧硬编码和新变量，兼容后仍可能有零星表现不一致
3. 某些平台对 `page` / `body` / `:root` 的变量继承路径不同，需验证 H5、小程序、App、nvue 表现

### 取舍

1. 本方案优先兼容老用户升级成本
2. 不追求让旧主题文件自动生成高质量 dark 配色
3. 允许新旧主题机制并存一个过渡期

## 推荐落地顺序

1. 先实现 `theme.scss` light bridge
2. 再校正 `theme-vars-core.scss` 与运行时 theme 的优先级
3. 最后补文档与迁移说明

## 结论

方案 A 的本质不是“关闭新主题系统”，而是把旧 `uni.scss` 中的 `$u-*` 重新接入新主题系统的 light 入口。

这样可以同时满足：

1. 老用户升级后尽量不改代码
2. 新暗黑模式能力继续可用
3. 新旧主题体系在过渡期可并存
