# Tabbar 多风格与动态图标设计

## 背景

当前 `up-tabbar` / `up-tabbar-item` 主要提供基础底部导航能力，默认视觉较为单一。现有选中态以颜色切换为主，缺少可直接复用的风格预设，也缺少对动态图标切换和选中动画的统一支持。这导致业务方要么接受较死板的默认样式，要么通过插槽和自定义样式重复造轮子。

本次目标是在保持现有 API 兼容的前提下，为 tabbar 组件补齐“内置多风格 + 动态 icon + 自定义扩展口”三层能力。

## 目标

- 为 `up-tabbar` 增加一组开箱即用的内置风格预设。
- 为 `up-tabbar-item` 增加选中/未选中双态图标支持。
- 为选中态增加轻量动画能力，提升视觉反馈。
- 保留插槽与样式扩展口，允许业务自定义动态图标和内容。
- 保持现有不传新参数时的默认行为基本不变。

## 非目标

- 不引入逐帧动画、Lottie 或第三方动画依赖。
- 不实现复杂的运行时布局测量动画。
- 不为每个 item 单独设计完整主题系统。
- 不对 tabbar 现有 DOM 结构进行大规模重构。

## 现状与约束

### 现有结构

- `src/uni_modules/uview-plus/components/u-tabbar/u-tabbar.vue`
  - 负责容器、固定定位、占位高度、安全区、背景色和边框色。
- `src/uni_modules/uview-plus/components/u-tabbar-item/u-tabbar-item.vue`
  - 负责 item 点击、激活态判定、图标展示、文字展示、角标展示。
- `src/uni_modules/uview-plus/components/u-tabbar/props.js`
  - 定义 tabbar props。
- `src/uni_modules/uview-plus/components/u-tabbar-item/props.js`
  - 定义 tabbar item props。
- `src/uni_modules/uview-plus/components/u-tabbar/tabbar.js`
  - 默认 props 配置。
- `src/uni_modules/uview-plus/components/u-tabbar-item/tabbarItem.js`
  - 默认 props 配置。
- `src/pages/componentsB/tabbar/tabbar2.vue` 与 `src/pages/componentsB/tabbar/tabbar.nvue`
  - 现有示例页，需要扩展展示新能力。

### 兼容性约束

- 组件同时服务普通 Vue 与 NVUE 场景，动画实现需要保守，优先使用 `transform`、`opacity`、`box-shadow`。
- 现有 `midButton` 已有特殊视觉和布局，需要避免与新增风格体系冲突。
- 现有插槽用法不能被破坏；未提供 `activeIcon` 时应继续支持原本 `active-icon` / `inactive-icon` 插槽方案。
- 现有 `icon` 可能是内置图标名，也可能是图片路径，双态图标切换需要沿用现有 `up-icon` 能力边界。

## 方案选择

### 方案 A：仅内置风格预设

- 优点：接入简单，文档直观。
- 缺点：自定义上限低，无法满足动态图标差异化需求。

### 方案 B：仅开放扩展能力

- 优点：灵活度最高。
- 缺点：业务接入成本高，无法直接解决“默认样式太死板”的问题。

### 方案 C：内置预设 + 扩展能力

- 提供多种 `styleType` 预设。
- 提供 `activeIcon` 与统一动画参数。
- 保留图标插槽与状态透传。

推荐采用方案 C。它同时解决默认视觉单一和业务定制不足两个问题，且可以在现有结构上增量实现。

## 最终设计

## 1. 风格体系

`up-tabbar` 新增 `styleType`，默认值为 `default`。首批内置以下 9 种风格：

- `default`
  - 与当前风格保持接近，仅增强过渡动画。
- `minimal`
  - 极简模式，仅强调颜色变化，适合工具型页面。
- `pill`
  - 选中项显示胶囊背景，识别度高。
- `lift`
  - 选中项轻微上浮，图标和文字有缩放反馈。
- `card`
  - item 具备卡片感，适合需要更强层次的场景。
- `underline`
  - 选中项底部显示指示条，适合内容型导航。
- `dot`
  - 选中项显示激活小圆点，风格更轻。
- `glow`
  - 选中项显示轻量发光背景，适合年轻化视觉。
- `convex`
  - 将现有中间凸起视觉纳入统一风格体系。

说明：`midButton` 保留，但其职责收敛为“某个 item 使用中间按钮模式”；`convex` 负责整体风格语义。两者组合时，以 `midButton` 的布局能力为准、以 `convex` 的视觉变量为补充。

## 2. 动态图标能力

### 基础双态图标

`up-tabbar-item` 新增：

- `activeIcon`
  - 选中态图标名或图片路径。
- `inactiveIcon`
  - 非选中态图标名或图片路径，可选；默认回退到现有 `icon`。

显示规则：

1. 若传入插槽 `active-icon` / `inactive-icon`，插槽优先。
2. 否则根据 `isActive` 优先使用 `activeIcon` / `inactiveIcon`。
3. 若未提供 `inactiveIcon`，则回退到 `icon`。
4. 若未提供 `activeIcon`，选中态继续使用 `icon` 并叠加动画/颜色变化。

### 动画态

`up-tabbar` 新增 `animationType`，默认 `none`，支持：

- `none`
- `scale`
- `lift`
- `swing`
- `pulse`

动画只作用于激活项，优先通过 CSS class 实现，不引入 JS 驱动动画。

### 自定义扩展口

图标插槽继续保留，并向插槽消费者约定通过现有激活状态做条件渲染。若现有插槽能力不足，可在本次补充 scoped slot 数据，但该改动需谨慎评估 uni-app 兼容性。优先级上，本次先保证非 scoped slot 兼容，并通过 class 与 props 满足大部分需求。

## 3. 新增样式参数

### `up-tabbar`

建议新增：

- `styleType: String = 'default'`
- `animationType: String = 'none'`
- `activeBackgroundColor: String = ''`
- `inactiveBackgroundColor: String = ''`
- `itemShape: String = 'default'`
- `iconScale: String | Number = 1.1`
- `textMode: String = 'always'`

说明：

- `textMode`
  - `always`：始终显示文字。
  - `active`：仅选中项强化显示文字；未选中项可弱化或隐藏，由预设样式控制。
- `itemShape` 先保留简单枚举，如 `default`、`round`、`square`，主要服务 `pill` / `card`。

### `up-tabbar-item`

建议新增：

- `activeIcon: String = ''`
- `inactiveIcon: String = ''`
- `activeClass: String = ''`
- `inactiveClass: String = ''`

说明：

- `activeClass` / `inactiveClass` 提供业务层额外样式钩子。
- 暂不新增更复杂的独立动画字段，避免与父级 `animationType` 冲突。

## 4. 样式和结构策略

### `u-tabbar`

- 在容器层增加基于 `styleType` 的 class，如 `u-tabbar--pill`。
- 在 item wrapper 层增加公共布局 class，保证不同风格仍复用现有 item 结构。
- 需要为 `pill`、`card`、`glow` 等风格提供额外内边距和背景容器样式。

### `u-tabbar-item`

- 根节点增加状态 class：
  - `u-tabbar-item--active`
  - `u-tabbar-item--inactive`
  - `u-tabbar-item--mid-button`
  - `u-tabbar-item--anim-{type}`
- 图标容器、文字容器分别增加子级状态 class，便于做缩放、上浮、光晕和底部指示条。
- `underline` 与 `dot` 风格建议使用伪元素或额外小容器实现，避免破坏现有结构。

## 5. 数据流

- `u-tabbar` 继续通过父子关系向 item 传递 `value`、颜色等状态。
- 同步扩展传递：
  - `styleType`
  - `animationType`
  - `activeBackgroundColor`
  - `inactiveBackgroundColor`
  - `itemShape`
  - `textMode`
  - `iconScale`
- `u-tabbar-item` 根据父级数据和自身 props，计算：
  - 当前展示图标
  - 当前状态 class
  - 当前文字展示策略
  - 当前局部背景色

## 6. 兼容策略

- 未传 `styleType` 时默认 `default`，视觉尽量接近当前实现。
- 未传 `animationType` 时不增加额外动画。
- 未传 `activeIcon` / `inactiveIcon` 时继续使用现有 `icon` 或插槽逻辑。
- 现有 `mode='midButton'` 保持可用。
- 文档中明确说明 `convex` 与 `midButton` 的配合用法，避免误解。

## 7. 示例与文档

示例页至少覆盖：

- `default + scale`
- `pill + activeIcon`
- `lift + activeIcon`
- `card + pulse`
- `underline`
- `dot`
- `glow`
- `convex + midButton`
- 自定义插槽动态图标示例

文档需要补充：

- 新 props 表
- 风格效果说明
- 双态图标使用方式
- 动画类型说明
- 与 `midButton` 的兼容说明

## 8. 测试策略

本仓库以组件示例和构建验证为主，本次至少完成：

- props 默认值和类型同步更新。
- 示例页能正常编译并展示。
- 检查普通 Vue 示例与 NVUE 示例均已覆盖新增能力。
- 手工验证以下场景：
  - 仅 `icon`
  - `icon + activeIcon`
  - 仅插槽图标
  - `midButton`
  - `styleType + animationType` 组合

若现有项目存在组件测试模式，可补充针对 icon 切换的最小测试；若无现成测试基础，则不额外引入测试框架。

## 风险与处理

### 风险 1：NVUE 动画支持差异

处理：仅使用保守的样式动画能力，避免复杂关键帧依赖；必要时对个别动画在 NVUE 下弱化。

### 风险 2：图标源不一致导致尺寸抖动

处理：统一图标容器尺寸，通过 icon wrapper 控制基线和缩放，不直接依赖图标自身尺寸。

### 风险 3：风格组合过多导致维护复杂

处理：严格限制首批内置风格数量，所有风格基于统一状态 class 和 CSS 变量实现，避免每种风格单独走一套 DOM。

## 实施范围

本次实施涉及：

- `src/uni_modules/uview-plus/components/u-tabbar/*`
- `src/uni_modules/uview-plus/components/u-tabbar-item/*`
- `src/uni_modules/uview-plus/libs/config/props.js`
- `src/uni_modules/uview-plus/types/comps.d.ts`（如需类型补充）
- `src/pages/componentsB/tabbar/tabbar2.vue`
- `src/pages/componentsB/tabbar/tabbar.nvue`
- 对应文档或说明文件（若本仓库 tabbar 文档源码在仓库内）

## 结论

本设计采用“内置多风格预设 + 动态图标 + 扩展钩子”的增量方案，在不破坏现有使用方式的前提下，显著提升 tabbar 的视觉可用性和业务适配能力。实现重点应放在统一 class 体系、双态图标计算逻辑、示例覆盖，以及对 `midButton` 的兼容收口。
