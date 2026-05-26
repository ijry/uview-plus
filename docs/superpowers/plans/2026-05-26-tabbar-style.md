# Tabbar 多风格与动态图标 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `up-tabbar` / `up-tabbar-item` 增加多种内置风格、双态动态图标和轻量选中动画，同时保持现有 API 与示例兼容。

**Architecture:** 以 `u-tabbar` 作为全局风格和动画配置入口，通过现有父子数据同步机制向 `u-tabbar-item` 透传 `styleType`、`animationType` 等参数；`u-tabbar-item` 负责根据激活状态计算图标、类名和局部样式。样式扩展基于统一 class 命名和有限 CSS 变量实现，避免重构组件层级。

**Tech Stack:** uni-app、Vue SFC、SCSS、uview-plus 现有 mixin/props 体系。

---

## 文件结构

- 修改 `src/uni_modules/uview-plus/components/u-tabbar/props.js`
  - 增加 tabbar 新 props 定义。
- 修改 `src/uni_modules/uview-plus/components/u-tabbar/tabbar.js`
  - 增加 tabbar 默认 props 值。
- 修改 `src/uni_modules/uview-plus/components/u-tabbar/u-tabbar.vue`
  - 透传全局风格/动画参数，增加容器 class 和样式计算。
- 修改 `src/uni_modules/uview-plus/components/u-tabbar-item/props.js`
  - 增加 item 双态图标和状态 class props。
- 修改 `src/uni_modules/uview-plus/components/u-tabbar-item/tabbarItem.js`
  - 增加 item 默认 props 值。
- 修改 `src/uni_modules/uview-plus/components/u-tabbar-item/u-tabbar-item.vue`
  - 实现图标切换、状态 class、风格样式和轻量动画。
- 修改 `src/pages/componentsB/tabbar/tabbar2.vue`
  - 增加普通 Vue 示例，覆盖新风格和动态图标。
- 修改 `src/pages/componentsB/tabbar/tabbar.nvue`
  - 增加 NVUE 示例，验证兼容场景。
- 修改 `src/uni_modules/uview-plus/changelog.md`
  - 记录 tabbar 新增风格和动态图标能力。

## Task 1: 扩展 tabbar props 与默认配置

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-tabbar/props.js`
- Modify: `src/uni_modules/uview-plus/components/u-tabbar/tabbar.js`
- Modify: `src/uni_modules/uview-plus/components/u-tabbar-item/props.js`
- Modify: `src/uni_modules/uview-plus/components/u-tabbar-item/tabbarItem.js`

- [ ] **Step 1: 定义 tabbar 新 props**

在 `src/uni_modules/uview-plus/components/u-tabbar/props.js` 中为 `up-tabbar` 新增以下字段，保持与现有写法一致：

```js
styleType: {
    type: String,
    default: () => defProps.tabbar.styleType
},
animationType: {
    type: String,
    default: () => defProps.tabbar.animationType
},
activeBackgroundColor: {
    type: String,
    default: () => defProps.tabbar.activeBackgroundColor
},
inactiveBackgroundColor: {
    type: String,
    default: () => defProps.tabbar.inactiveBackgroundColor
},
itemShape: {
    type: String,
    default: () => defProps.tabbar.itemShape
},
iconScale: {
    type: [String, Number],
    default: () => defProps.tabbar.iconScale
},
textMode: {
    type: String,
    default: () => defProps.tabbar.textMode
}
```

- [ ] **Step 2: 定义 tabbar 默认值**

在 `src/uni_modules/uview-plus/components/u-tabbar/tabbar.js` 的 `tabbar` 默认对象中加入：

```js
styleType: 'default',
animationType: 'none',
activeBackgroundColor: '',
inactiveBackgroundColor: '',
itemShape: 'default',
iconScale: 1.1,
textMode: 'always'
```

- [ ] **Step 3: 定义 item 新 props**

在 `src/uni_modules/uview-plus/components/u-tabbar-item/props.js` 中新增：

```js
activeIcon: {
    type: String,
    default: () => defProps.tabbarItem.activeIcon
},
inactiveIcon: {
    type: String,
    default: () => defProps.tabbarItem.inactiveIcon
},
activeClass: {
    type: String,
    default: () => defProps.tabbarItem.activeClass
},
inactiveClass: {
    type: String,
    default: () => defProps.tabbarItem.inactiveClass
}
```

同时修正 `icon` 的声明形式，统一为：

```js
icon: {
    type: String,
    default: () => defProps.tabbarItem.icon
}
```

- [ ] **Step 4: 定义 item 默认值**

在 `src/uni_modules/uview-plus/components/u-tabbar-item/tabbarItem.js` 的 `tabbarItem` 默认对象中加入：

```js
activeIcon: '',
inactiveIcon: '',
activeClass: '',
inactiveClass: ''
```

- [ ] **Step 5: 快速自查 props 对齐**

人工检查以下几点：

- `props.js` 与 `tabbar.js` / `tabbarItem.js` 字段完全对应。
- `iconScale` 类型与默认值兼容。
- `icon` 字段声明已修正为标准 `type` 写法。

## Task 2: 改造 tabbar 容器透传风格状态

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-tabbar/u-tabbar.vue`

- [ ] **Step 1: 扩展模板 class 绑定**

为 `u-tabbar__content` 增加风格类名绑定：

```vue
:class="[
    border && 'u-border-top',
    fixed && 'u-tabbar--fixed',
    `u-tabbar--${styleType}`,
    textMode === 'active' && 'u-tabbar--text-active'
]"
```

并为 `u-tabbar__content__item-wrapper` 增加基础类名：

```vue
:class="[
    `u-tabbar__content__item-wrapper--${styleType}`,
    itemShape !== 'default' && `u-tabbar__content__item-wrapper--shape-${itemShape}`
]"
```
```

- [ ] **Step 2: 扩展父级同步字段**

在 `computed.updateChild` 中加入以下依赖，保证修改后会触发子组件同步：

```js
this.styleType,
this.animationType,
this.activeBackgroundColor,
this.inactiveBackgroundColor,
this.itemShape,
this.iconScale,
this.textMode
```

- [ ] **Step 3: 增加容器样式计算**

在 `tabbarStyle()` 中保留原背景和边框逻辑，同时增加适用于多风格的 CSS 变量：

```js
style['--up-tabbar-active-bg'] = this.activeBackgroundColor || 'transparent'
style['--up-tabbar-inactive-bg'] = this.inactiveBackgroundColor || 'transparent'
style['--up-tabbar-icon-scale'] = `${this.iconScale}`
```

必要时为 `card` / `pill` / `glow` 增加默认容器内边距，例如：

```js
if (['pill', 'card', 'glow', 'convex'].includes(this.styleType)) {
    style.padding = '8rpx 12rpx 12rpx'
}
```

- [ ] **Step 4: 增加风格容器样式**

在 `style` 区块中补充：

- `u-tabbar--default`
- `u-tabbar--minimal`
- `u-tabbar--pill`
- `u-tabbar--lift`
- `u-tabbar--card`
- `u-tabbar--underline`
- `u-tabbar--dot`
- `u-tabbar--glow`
- `u-tabbar--convex`

这些样式只负责整体背景、间距和 item wrapper 布局，不在父级直接写 item 激活态细节。

- [ ] **Step 5: 进行局部编译风险检查**

人工检查：

- 新增 class 绑定不会在 uni 模板里产生语法错误。
- `item wrapper` 新增 `:class` 后不破坏现有 slot 布局。
- `tabbarStyle` 输出的 CSS 变量在不支持变量的场景下有合理回退。

## Task 3: 实现 item 双态图标与状态类

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-tabbar-item/u-tabbar-item.vue`

- [ ] **Step 1: 扩展父级数据结构**

将 `parentData` 默认值扩展为：

```js
parentData: {
    value: null,
    activeColor: '',
    inactiveColor: '',
    styleType: 'default',
    animationType: 'none',
    activeBackgroundColor: '',
    inactiveBackgroundColor: '',
    itemShape: 'default',
    iconScale: 1.1,
    textMode: 'always'
}
```

- [ ] **Step 2: 增加计算属性**

在 `computed` 中新增：

```js
resolvedStyleType() {
    return this.parentData.styleType || 'default'
},
resolvedAnimationType() {
    return this.parentData.animationType || 'none'
},
resolvedItemShape() {
    return this.parentData.itemShape || 'default'
},
resolvedIconName() {
    if (this.$slots['active-icon'] || this.$slots['inactive-icon']) return ''
    if (this.isActive) return this.activeIcon || this.icon
    return this.inactiveIcon || this.icon
},
itemClassNames() {
    return [
        this.isActive ? 'u-tabbar-item--active' : 'u-tabbar-item--inactive',
        this.isMidButton ? 'u-tabbar-item--mid-button' : '',
        `u-tabbar-item--${this.resolvedStyleType}`,
        this.resolvedAnimationType !== 'none' && this.isActive ? `u-tabbar-item--anim-${this.resolvedAnimationType}` : '',
        this.resolvedItemShape !== 'default' ? `u-tabbar-item--shape-${this.resolvedItemShape}` : '',
        this.isActive ? this.activeClass : this.inactiveClass
    ]
},
itemInlineStyle() {
    return {
        backgroundColor: this.isActive
            ? (this.parentData.activeBackgroundColor || 'transparent')
            : (this.parentData.inactiveBackgroundColor || 'transparent')
    }
},
textVisible() {
    return this.parentData.textMode !== 'active' || this.isActive || !!this.text
}
```

其中 `textVisible` 在实现时需要调整为：`textMode === 'active'` 时未激活项只做弱化/压缩，不直接让有文本的 item 消失导致布局抖动。最终代码以“保留占位、降低透明度或缩放”为准，不要真正删除节点。

- [ ] **Step 3: 更新模板结构**

在根节点增加：

```vue
:class="itemClassNames"
:style="[itemInlineStyle, addStyle(customStyle)]"
```

将 `up-icon` 的 `name` 改为 `resolvedIconName`：

```vue
<up-icon
    v-if="resolvedIconName"
    :name="resolvedIconName"
    :color="isActive ? resolvedActiveColor : resolvedInactiveColor"
    :size="isMidButton ? 26 : 20"
></up-icon>
```

为图标容器和文字增加风格 class：

```vue
:class="[
    isMidButton ? 'u-tabbar-item__icon--mid-button' : '',
    `u-tabbar-item__icon--${resolvedStyleType}`,
    isActive && resolvedAnimationType !== 'none' ? `u-tabbar-item__icon--anim-${resolvedAnimationType}` : ''
]"
```

```vue
:class="[
    `u-tabbar-item__text--${resolvedStyleType}`,
    parentData.textMode === 'active' && !isActive ? 'u-tabbar-item__text--muted' : ''
]"
```

并额外添加风格装饰节点：

```vue
<view v-if="resolvedStyleType === 'underline'" class="u-tabbar-item__underline"></view>
<view v-if="resolvedStyleType === 'dot'" class="u-tabbar-item__active-dot"></view>
```

注意只在需要的风格下渲染，避免无意义节点。

- [ ] **Step 4: 编写 item 样式体系**

在 `style` 区块中补充统一基础能力：

- 激活/未激活态过渡
- icon 容器统一尺寸与缩放原点
- text muted 状态
- `underline` 指示条
- `dot` 激活点
- `pill` 胶囊背景
- `lift` 上浮
- `card` 卡片阴影
- `glow` 发光背景
- `convex` 配合 midButton 的强化视觉
- `scale` / `lift` / `swing` / `pulse` 动画类

要求：

- 优先使用 `transform`, `opacity`, `box-shadow`
- 控制动画时长在 `160ms ~ 260ms`
- 不修改现有 badge 定位逻辑，除非视觉错位明显

- [ ] **Step 5: 校验双态图标回退逻辑**

人工检查以下规则是否在代码中明确可读：

- 插槽优先于 props 图标
- `activeIcon` 未提供时选中态回退 `icon`
- `inactiveIcon` 未提供时未选中态回退 `icon`
- 完全未提供图标时继续允许纯插槽模式

## Task 4: 扩展示例页覆盖多风格场景

**Files:**
- Modify: `src/pages/componentsB/tabbar/tabbar2.vue`
- Modify: `src/pages/componentsB/tabbar/tabbar.nvue`

- [ ] **Step 1: 规划示例分组**

在两个示例页中新增或替换部分 section，至少展示以下 8 组：

```txt
default + scale
pill + activeIcon
lift + activeIcon
card + pulse
underline

 dot
glow
convex + midButton
```

同时保留原有基础能力示例：徽标、名称匹配、自定义插槽、固定底部。

- [ ] **Step 2: 添加普通 Vue 风格示例**

在 `src/pages/componentsB/tabbar/tabbar2.vue` 中新增多个 `ref` 值，例如：

```js
const value8 = ref(0)
const value9 = ref(1)
const value10 = ref(0)
const value11 = ref(2)
const value12 = ref(0)
const value13 = ref(1)
const value14 = ref(2)
```

并为对应示例写出明确使用方式，例如：

```vue
<up-tabbar
    :value="value8"
    @change="name => value8 = name"
    :fixed="false"
    :placeholder="false"
    styleType="pill"
    animationType="scale"
    activeBackgroundColor="rgba(60, 156, 255, 0.12)"
>
    <up-tabbar-item text="首页" icon="home" activeIcon="home-fill"></up-tabbar-item>
    <up-tabbar-item text="发现" icon="grid" activeIcon="grid-fill"></up-tabbar-item>
    <up-tabbar-item text="消息" icon="chat" activeIcon="chat-fill"></up-tabbar-item>
    <up-tabbar-item text="我的" icon="account" activeIcon="account-fill"></up-tabbar-item>
</up-tabbar>
```

若现有图标库不存在某些 `*-fill` 图标，必须先用 `rg` 查验可用图标名，再选择真实存在的图标，不允许在代码里写可能不存在的名称。

- [ ] **Step 3: 添加 NVUE 对应示例**

将普通 Vue 示例中最关键的 4~6 组同步到 `src/pages/componentsB/tabbar/tabbar.nvue`，重点覆盖：

- `activeIcon`
- `animationType`
- `midButton + convex`
- 插槽图标兼容

NVUE 页面不必完全复制所有示例，但必须包含能暴露兼容性问题的核心组合。

- [ ] **Step 4: 调整示例页样式**

为示例页补充必要样式，保证新风格在展示页中有足够上下留白，例如：

```scss
.u-page__item--tabbar-demo {
    padding: 16rpx 24rpx 32rpx;
}
```

同时为 slot 图标或图片图标保留统一尺寸，避免不同 section 出现错位。

- [ ] **Step 5: 手工核查示例完整性**

人工检查：

- section 标题与实际示例能力一致。
- `ref` 变量没有遗漏声明。
- 所有 `@change` 绑定都能更新对应值。
- 普通页与 NVUE 页至少各有一个双态图标示例。

## Task 5: 更新变更记录并做验证

**Files:**
- Modify: `src/uni_modules/uview-plus/changelog.md`

- [ ] **Step 1: 更新 changelog**

在 `src/uni_modules/uview-plus/changelog.md` 顶部新增一条中文记录，概述：

```md
- feat: tabbar 新增多种风格预设、动态图标切换与轻量选中动画
```

保持现有 changelog 书写风格。

- [ ] **Step 2: 运行针对性静态检查**

Run: `npm run lint -- src/uni_modules/uview-plus/components/u-tabbar/u-tabbar.vue src/uni_modules/uview-plus/components/u-tabbar-item/u-tabbar-item.vue src/pages/componentsB/tabbar/tabbar2.vue`

Expected: 命令成功，若项目 lint 命令不支持传文件，则改为项目约定的最小可执行 lint 命令。

- [ ] **Step 3: 运行构建或最小验证命令**

先从 `package.json` 确认可用命令，再运行最小范围验证。优先顺序：

```bash
npm run lint
npm run build
```

若仓库没有 `build` 或 `lint`，至少执行：

```bash
git diff --check
```

Expected: 没有语法错误、格式错误或明显校验失败。

- [ ] **Step 4: 人工回归关键场景**

在结果总结中明确人工检查以下场景：

- `default` 保持兼容
- `pill` / `card` / `glow` 背景表现正常
- `underline` / `dot` 装饰仅在激活项出现
- `activeIcon` 与插槽图标优先级正确
- `midButton + convex` 没有遮挡文字或角标

- [ ] **Step 5: 整理提交说明**

按仓库规范准备中文 `git commit` 文案草稿，包含 `head + body`，例如：

```txt
feat: 优化 tabbar 风格体系与动态图标表现

- 为 tabbar 增加多种内置风格、轻量选中动画与双态图标支持
- 扩展示例页覆盖普通场景、NVUE 场景及中间按钮组合用法
- 保持现有默认行为兼容，降低业务接入成本
```

仅整理文案，不执行 `git commit`，除非用户明确要求。

## Self-Review

- 规格覆盖：计划覆盖 props、组件实现、示例、changelog、验证步骤，与设计文档一致。
- 占位扫描：无 `TODO`、`TBD`、`类似任务 N` 之类占位语句；所有文件路径均明确。
- 类型一致性：`styleType`、`animationType`、`activeIcon`、`inactiveIcon`、`activeClass`、`inactiveClass` 在所有任务中保持一致命名。
