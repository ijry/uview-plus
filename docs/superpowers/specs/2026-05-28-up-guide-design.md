# up-guide 首屏全屏引导组件设计

## 背景

当前组件库缺少一个开箱即用的「App 首屏全屏引导」组件。业务方若需要首次进入引导，通常要自行组合 `swiper`、遮罩、按钮和本地存储，重复成本高且跨端体验不一致。

本次新增 `up-guide`，目标是在不引入额外依赖的前提下，提供稳定、轻量、跨端可用的首次引导能力，并内置“只显示一次”记忆逻辑。

## 目标

- 提供全屏引导页展示能力，支持多页滑动。
- 提供通用交互：`跳过`、`下一步`、`立即体验`。
- 内置“只显示一次”记忆逻辑，默认启用。
- 支持业务通过 `v-model:show` 控制显示与关闭。
- 覆盖 uni-app 常见运行端，优先稳定性。

## 非目标

- 不实现复杂蒙层高亮（逐步指向页面元素）引导。
- 不实现服务式弹出 API（如 `uni.$u.guide.open()`）。
- 不引入第三方动画/轮播依赖。
- 不提供过度复杂的主题系统。

## 方案选择

### 方案 A：`up-guide` 单组件（推荐）

- 优点：接入路径短，API 清晰，维护成本低。
- 缺点：页内结构极端定制能力有限。

### 方案 B：`up-guide + up-guide-item` 组合组件

- 优点：每页内容可高度自定义。
- 缺点：使用和文档复杂度较高，不适合首发。

### 方案 C：服务式 API

- 优点：业务调用看起来简洁。
- 缺点：实现复杂、可组合性差，不利于跨端样式一致。

结论：首发采用方案 A，保留后续向方案 B 演进空间。

## 组件定位与架构

`up-guide` 为页面级全屏覆盖组件，职责仅聚焦：

1. 渲染引导页内容（图片/标题/描述）。
2. 管理分页与当前页状态。
3. 处理跳过、完成等关闭动作。
4. 处理首次展示存储记忆。

组件目录规划：

- `src/uni_modules/uview-plus/components/u-guide/u-guide.vue`
- `src/uni_modules/uview-plus/components/u-guide/props.js`
- `src/uni_modules/uview-plus/components/u-guide/guide.js`

配套接入：

- `src/uni_modules/uview-plus/libs/config/props.js`
- `src/uni_modules/uview-plus/types/comps/guide.d.ts`
- `src/uni_modules/uview-plus/types/comps.d.ts`
- 示例页与入口配置

## API 设计

### Props

- `show: boolean`
  - 说明：显示状态，支持 `v-model:show`。
- `list: GuideItem[]`
  - 说明：引导页数据，至少 1 项。
- `storageKey: string`
  - 默认：`up-guide-default`
  - 说明：一次性记忆 key。
- `once: boolean`
  - 默认：`true`
  - 说明：是否只展示一次。
- `showSkip: boolean`
  - 默认：`true`
- `skipText: string`
  - 默认：`跳过`
- `nextText: string`
  - 默认：`下一步`
- `finishText: string`
  - 默认：`立即体验`
- `indicator: boolean`
  - 默认：`true`

### GuideItem

- `image: string`（必填）
- `title?: string`
- `desc?: string`
- `backgroundColor?: string`

### Events

- `update:show`
- `change`（`{ current }`）
- `skip`
- `finish`
- `close`

### Expose Methods

- `open()`
- `close(remember = true)`
- `reset()`

## 数据流与一次性记忆策略

### 初始化

1. 组件挂载时读取 `once` 与 `storageKey`。
2. 若命中已读标记：
   - 内部设为不显示。
   - 同步触发 `update:show(false)`。
3. 未命中时按外部 `show` 进入展示态。

### 运行

1. 外部 `show` 变化时，内部同步显示状态。
2. `swiper` 切页更新 `current` 并触发 `change`。
3. 点击 `跳过` / `立即体验`：
   - 调用 `close(true)`。
   - 写入存储标记。
   - 分别触发 `skip` / `finish`。
   - 统一触发 `close` 与 `update:show(false)`。

### 重置

- 调用 `reset()` 删除 `storageKey` 标记，允许再次展示。

### 存储实现

- 使用 `uni.getStorageSync` / `uni.setStorageSync` / `uni.removeStorageSync`。
- 存储异常时降级为仅内存控制，不影响页面主流程。

## 交互与视觉边界

- 全屏遮罩阻断底层交互，避免穿透。
- 底部操作区适配安全区（`safe-area-inset-bottom`）。
- 页内按钮逻辑：
  - 非末页显示 `下一步`。
  - 末页显示 `立即体验`。
  - `showSkip=true` 时全程可跳过。
- “跳过/完成”动作加入幂等保护，避免重复触发事件。
- 默认高层级 `z-index`（建议 `10075`），防止被普通弹层覆盖。

## 异常处理

- `list` 为空：组件不渲染主内容，开发环境 `console.warn`。
- `GuideItem.image` 缺失：显示占位块，布局不崩溃。
- `storageKey` 空值：回退默认 key `up-guide-default`。

## 跨端策略

作为组件库组件，默认按 uni-app 通用能力实现，不做端限定分支：

- 使用通用组件能力（`view`、`swiper`、`image`）。
- 使用通用存储 API。
- 样式与动画采用轻量策略，优先跨端稳定。

## 测试策略

### 功能用例

- 首次进入展示。
- 点击跳过关闭并记忆。
- 最后一页点击立即体验关闭并记忆。
- 二次进入不展示。

### 配置用例

- `once=false` 时每次可展示。
- `reset()` 后可重新展示。
- 自定义 `storageKey` 互不干扰。

### 交互用例

- 滑动切页与按钮切页一致。
- `change/skip/finish/close` 事件触发符合预期。
- 连续快速点击不会重复触发关闭流程。

### 边界用例

- `list=[]`。
- `storageKey` 为空。
- 某一页缺少 `image`。

## 实施范围

- 新增 `u-guide` 组件及默认配置。
- 补充 TS 组件类型声明。
- 新增示例页：
  - `src/pages/componentsC/guide/guide.vue`
- 增加示例入口：
  - `src/pages.json`
  - `src/pages/example/components.config.js`

## 风险与处理

- 风险：不同端 `swiper` 手感差异。
  - 处理：保持动画简单，交互以按钮逻辑兜底。
- 风险：业务端存储 key 冲突。
  - 处理：提供 `storageKey`，并在文档建议按业务命名。
- 风险：重复点击导致重复事件。
  - 处理：关闭流程加锁，保证幂等。

## 结论

采用单组件方案交付 `up-guide`，以“全屏多页引导 + 只显示一次”作为首发能力边界。该方案在接入成本、跨端稳定性和后续可演进性之间平衡最佳，能够满足组件库通用场景并支持后续扩展。
