# Navbar 安全区背景连续性优化设计

## 背景

当前 `u-navbar` 在开启 `safeAreaInsetTop` 时，会在导航栏内容区上方渲染一个独立的 `u-status-bar`，并分别给状态栏占位和 `u-navbar__content` 设置背景色。

这种结构在普通纯色背景下问题不明显，但在业务希望整个头部使用渐变色、图片或其它连续背景时，状态栏区域和内容区容易出现背景断层。

## 目标

1. 让 `u-navbar` 的状态栏安全区和导航栏内容区共享同一层背景。
2. 保留现有 `u-status-bar` 占位能力，降低兼容风险。
3. 支持 `bgColor` 传入普通颜色、渐变或背景图等 CSS background 表达式。
4. 保持 `fixed`、`placeholder`、`safeAreaInsetTop` 等既有布局行为不变。

## 非目标

1. 不重构 `u-status-bar` 组件。
2. 不新增 navbar 公共属性。
3. 不改动 `navbar-mini`、`popup`、`notify` 等其它仍使用 `u-status-bar` 的组件。
4. 不移除 `statusBarBgColor` 属性，只调整 `u-navbar` 内部对它的使用方式。

## 方案对比

### 方案 A：移除 `u-status-bar`，由 navbar 外层设置 `padding-top`

- 优点：安全区逻辑集中在 navbar 内，符合直接读取 UNI API 并设置内边距的思路。
- 缺点：改动现有结构，可能影响依赖 `u-status-bar` 占位细节的平台兼容。

### 方案 B：保留 `u-status-bar`，背景统一设置在 navbar 外层

- 优点：保留现有安全区占位结构，改动小；状态栏和内容区可以共享外层背景，解决渐变和图片背景断层。
- 缺点：安全区占位仍由内部 `u-status-bar` 组件承担，不是完全扁平化布局。

### 方案 C：新增背景插槽或专用样式属性

- 优点：表达能力最强。
- 缺点：新增 API，文档和兼容成本更高，超出本次问题范围。

## 采用方案

采用 **方案 B**。

## 设计

### 1. 统一背景承载层

将导航栏整体背景设置到固定容器或内部统一容器上，而不是分别设置到 `u-status-bar` 和 `u-navbar__content`。

背景值使用现有 `bgColor` 推导出的 `navbarBgColor`，但绑定方式从 `backgroundColor` 调整为更通用的 `background`，使以下写法都能生效：

1. `#ffffff`
2. `linear-gradient(...)`
3. `url(...)`

### 2. 状态栏占位透明化

`u-status-bar` 继续由 `safeAreaInsetTop` 控制是否渲染，但在 `u-navbar` 内不再传入 `bgColor`。它只负责占位，高度仍由现有 UNI API 封装读取。

`statusBarBgColor` 属性保留，避免破坏已有类型和传参，但 `u-navbar` 不再用它给状态栏单独着色。

### 3. 内容区透明化

`u-navbar__content` 保持原有高度、布局、边框和插槽结构，但背景改为透明，避免覆盖外层连续背景。

文字、图标、左右插槽、标题宽度、点击事件等交互行为不变。

### 4. 占位高度保持不变

`fixed && placeholder` 生成的占位高度继续为：

```text
getPx(height) + getWindowInfo().statusBarHeight
```

这样页面内容下移逻辑与旧版保持一致。

## 验收标准

1. `safeAreaInsetTop=true` 时，状态栏安全区和导航栏内容区背景连续。
2. `bgColor="linear-gradient(...)"` 时，渐变覆盖整个头部区域。
3. `bgColor="url(...)"` 时，背景图覆盖整个头部区域。
4. `safeAreaInsetTop=false`、`fixed=false`、`placeholder=true` 的既有行为不回退。
5. `statusBarBgColor` 传入后不报错，类型兼容保持不变。

## 测试思路

1. 在 navbar 示例页增加或本地手动验证渐变背景。
2. 手动验证固定顶部加 placeholder 时页面内容不被遮挡。
3. 检查 `safeAreaInsetTop=false` 时不额外占用状态栏高度。
4. 检查默认主题背景在未传 `bgColor` 时仍使用主题变量兜底。

## 风险与注意事项

1. `bgColor` 名称虽然保留，但能力扩展为 CSS `background` 表达式；文档后续应避免只描述为“背景颜色”。
2. `statusBarBgColor` 在 `u-navbar` 中变为兼容保留字段，若历史业务依赖状态栏和内容区不同色，需要改为自定义外层背景或后续新增 API。
3. nvue 和小程序端对复杂 CSS background 的支持能力不同，组件只负责透传表达式，不额外做平台降级。
