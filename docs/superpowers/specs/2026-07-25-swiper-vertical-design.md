# Swiper Vertical 设计

## 背景

GitHub issue #936 反馈 `up-swiper` 缺少原生 `swiper` 已有的 `vertical` 属性。当前 `u-swiper` 只透传了 `circular`、`interval`、`duration`、`autoplay`、`current`、`previousMargin` 等属性，未暴露纵向滑动开关，业务无法直接配置纵向轮播。

同系列 `uview-ultra` 已在 `up-swiper` 中支持 `vertical`，默认 `false`，并直接绑定到原生 `<swiper :vertical="vertical">`。

## 目标

- 为 `u-swiper` / `up-swiper` 增加 `vertical` 布尔属性。
- 默认 `false`，保持现有横向轮播行为不变。
- 将 `vertical` 透传给原生 `swiper`。
- 同步 props 默认值、TypeScript 类型、组件注释、示例页和 changelog。
- 用轻量静态校验脚本锁定关键实现契约。

## 非目标

- 不改造指示器在纵向模式下的布局与动画。
- 不调整 `previousMargin` / `nextMargin` 卡片式横向露出逻辑。
- 不发布新版本。
- 不合并分支。

## 方案

对齐 `uview-ultra` 的最小透传实现：

1. 在 `swiper.js` 默认配置增加 `vertical: false`。
2. 在 `props.js` 声明 `vertical` Boolean prop。
3. 在 `u-swiper.vue` 的原生 `<swiper>` 上绑定 `:vertical="vertical"`，并补充组件注释。
4. 在 `types/comps/swiper.d.ts` 补充类型定义。
5. 在示例页增加纵向轮播示例。
6. 在 changelog 记录该能力，对应 issue #936。

## 验证

新增 `scripts/verify-swiper-vertical.mjs`，检查：

- 默认配置包含 `vertical: false`。
- props 声明了 `vertical`。
- 组件模板透传 `:vertical="vertical"`。
- 类型定义包含 `vertical?: boolean`。
- 示例页出现纵向示例。
- package.json 暴露校验脚本。
