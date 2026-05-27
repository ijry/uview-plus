# Tabbar 高颜值图标与视觉升级 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 tabbar 增加一套更统一、更高级的默认图标资源和主推视觉方案，围绕 `首页 / 发现 / 发布 / 消息 / 我的` 重构示例表现，并在文档中补充本地图标与 iconfont 两种接入方式。

**Architecture:** 保持现有 `up-tabbar` / `up-tabbar-item` API 不变，以本地图片资源作为高颜值示例默认实现，以 `activeIcon/inactiveIcon` 承载两态切换；同时保留 `iconfont` 扩展路线，通过文档说明接入。视觉层面仅细调 `convex`、`pill`、`glow` 等主推风格，不引入额外运行时依赖。

**Tech Stack:** uni-app、Vue SFC、SCSS、仓库内静态图片资源、VuePress 文档。

---

## 文件结构

- 新增 `src/static/uview/tabbar/` 下的一组 tabbar 图标资源
  - 存放 `home` / `discover` / `publish` / `message` / `profile` 的 active / inactive 图标。
- 修改 `src/pages/componentsB/tabbar/tabbar2.vue`
  - 用本地图标重做普通 Vue 示例页主推 section。
- 修改 `src/pages/componentsB/tabbar/tabbar.nvue`
  - 用本地图标重做 NVUE 示例页主推 section。
- 修改 `src/uni_modules/uview-plus/components/u-tabbar/u-tabbar.vue`
  - 细调主推风格容器表现。
- 修改 `src/uni_modules/uview-plus/components/u-tabbar-item/u-tabbar-item.vue`
  - 细调主推风格 item 表现与图片图标容器表现。
- 修改 `src/uni_modules/uview-plus/changelog.md`
  - 补充视觉升级与示例资源说明。
- 修改 `D:/Repos/xyito/open/uview-plus-doc/docs/components/tabbar.md`
  - 增加推荐图标方案、本地图标接入示例、iconfont 扩展建议。

## Task 1: 准备本地图标资源与命名规范

**Files:**
- Create: `src/static/uview/tabbar/home.png`
- Create: `src/static/uview/tabbar/home-active.png`
- Create: `src/static/uview/tabbar/discover.png`
- Create: `src/static/uview/tabbar/discover-active.png`
- Create: `src/static/uview/tabbar/publish.png`
- Create: `src/static/uview/tabbar/publish-active.png`
- Create: `src/static/uview/tabbar/message.png`
- Create: `src/static/uview/tabbar/message-active.png`
- Create: `src/static/uview/tabbar/profile.png`
- Create: `src/static/uview/tabbar/profile-active.png`

- [ ] **Step 1: 确定图标规格**

采用统一规则：

- 普通 tab 图标：建议视觉尺寸 `48px ~ 56px`
- 中间发布按钮图标：建议视觉尺寸 `64px ~ 76px`
- 图标内容居中，四周保留安全留白
- inactive 与 active 保持轮廓一致，仅在填充、色彩和高光上变化

- [ ] **Step 2: 生成或整理图标资源**

资源主题统一为：

- `home`：圆润首页
- `discover`：探索/发现
- `publish`：主操作按钮
- `message`：聊天消息
- `profile`：个人中心

要求：

- 命名严格使用 `xxx.png` / `xxx-active.png`
- 若使用透明背景 PNG，确保边缘干净，不要带白边
- 中间 `publish-active.png` 可以使用更明显的高亮底色，但不得依赖页面背景色才能成立

- [ ] **Step 3: 将资源放入代码仓**

统一放在：

```txt
src/static/uview/tabbar/
```

后续示例页通过静态路径直接引用，例如：

```txt
/static/uview/tabbar/home.png
/static/uview/tabbar/home-active.png
```

- [ ] **Step 4: 人工检查资源一致性**

检查：

- 五组图标的视角、线条粗细、圆角风格一致
- active / inactive 两态能一眼看出层级变化
- 发布按钮图标相比其他图标有明显主次差异

## Task 2: 重构示例页主推场景

**Files:**
- Modify: `src/pages/componentsB/tabbar/tabbar2.vue`
- Modify: `src/pages/componentsB/tabbar/tabbar.nvue`

- [ ] **Step 1: 定义统一示例数据语义**

把主推示例统一为：

```txt
首页 / 发现 / 发布 / 消息 / 我的
```

替换原本偏演示味的 `放映厅 / 直播` 为更接近真实产品的文案。

- [ ] **Step 2: 重做普通 Vue 主推示例**

在 `src/pages/componentsB/tabbar/tabbar2.vue` 中，新增或替换为以下三组高优先级示例：

- `convex + 本地图标 + 发布按钮`
- `pill + 本地图标`
- `glow + 本地图标`

示例写法参考：

```vue
<up-tabbar
    :value="valueMain"
    @change="name => valueMain = name"
    :fixed="false"
    :placeholder="false"
    :safeAreaInsetBottom="false"
    styleType="convex"
    animationType="scale"
>
    <up-tabbar-item text="首页" icon="/static/uview/tabbar/home.png" activeIcon="/static/uview/tabbar/home-active.png"></up-tabbar-item>
    <up-tabbar-item text="发现" icon="/static/uview/tabbar/discover.png" activeIcon="/static/uview/tabbar/discover-active.png"></up-tabbar-item>
    <up-tabbar-item text="发布" icon="/static/uview/tabbar/publish.png" activeIcon="/static/uview/tabbar/publish-active.png" mode="midButton"></up-tabbar-item>
    <up-tabbar-item text="消息" icon="/static/uview/tabbar/message.png" activeIcon="/static/uview/tabbar/message-active.png"></up-tabbar-item>
    <up-tabbar-item text="我的" icon="/static/uview/tabbar/profile.png" activeIcon="/static/uview/tabbar/profile-active.png"></up-tabbar-item>
</up-tabbar>
```

- [ ] **Step 3: 重做 NVUE 主推示例**

在 `src/pages/componentsB/tabbar/tabbar.nvue` 中同步保留至少两组：

- `convex + 本地图标 + 发布按钮`
- `pill` 或 `glow` 其中一组

重点验证：图片图标在 NVUE 下也能稳定显示。

- [ ] **Step 4: 保留扩展能力示例**

普通 Vue 页中保留以下示例，不必删除：

- 插槽图标示例
- iconfont 图标示例
- `activeIcon/inactiveIcon` 方案

这样文档和组件能力仍然完整，不会让用户误以为只能用图片图标。

- [ ] **Step 5: 调整示例页配套样式**

为高颜值示例增加更适合展示的外层背景和留白，例如：

```scss
.u-page__item--showcase {
    padding: 24rpx;
    background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
}
```

同时确保图片图标尺寸统一，例如：

```scss
.u-page__item__tabbar-icon {
    width: 22px;
    height: 22px;
}

.u-page__item__tabbar-icon--publish {
    width: 30px;
    height: 30px;
}
```

## Task 3: 细调组件主推风格视觉

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-tabbar/u-tabbar.vue`
- Modify: `src/uni_modules/uview-plus/components/u-tabbar-item/u-tabbar-item.vue`

- [ ] **Step 1: 优化 `convex` 容器质感**

细调 `u-tabbar--convex`：

- 容器边角更柔和
- 顶部边缘更干净
- 阴影更轻，避免厚重发灰

目标方向：更像成品移动端底栏，而不是 demo 特效。

- [ ] **Step 2: 优化中间按钮层次**

细调 `u-tabbar-item--mid-button` 与 `u-tabbar-item__icon--mid-button`：

- 让 `publish` 按钮比普通 tab 更大一档
- 按钮底色、描边、阴影更有主操作感
- 保证与 `convex` 风格组合时不显得突兀

- [ ] **Step 3: 优化 `pill` 与 `glow` 风格**

细调以下方向：

- `pill`：弱化廉价按钮感，增加轻柔背景和更自然圆角
- `glow`：控制发光范围，避免“泛蓝一圈”的廉价感
- `card`：保留但不作为主推示例，可只做小幅优化

- [ ] **Step 4: 优化图片图标容器**

确保 `u-tabbar-item` 使用图片图标时：

- 图片居中
- 缩放动画不会抖动
- 中间按钮图片与普通按钮图片尺寸逻辑不同
- badge 不会压住图片主体

若需要，可为图片图标单独增加 class 或 style 分支，但不要破坏 `up-icon` 现有图片逻辑。

- [ ] **Step 5: 人工检查视觉一致性**

检查：

- `convex` / `pill` / `glow` 三组主推示例的气质一致
- 中间 `发布` 的主次足够明确
- inactive 态不抢戏，active 态不廉价

## Task 4: 补充文档中的推荐方案

**Files:**
- Modify: `D:/Repos/xyito/open/uview-plus-doc/docs/components/tabbar.md`

- [ ] **Step 1: 增加“推荐图标方案”小节**

说明三种接入路线：

- 内置字体图标：接入快
- 本地图标资源：视觉最好，推荐用于首页 tabbar
- iconfont 扩展：适合统一企业图标库

- [ ] **Step 2: 增加本地图标示例**

补一段完整示例，直接使用：

```html
icon="/static/uview/tabbar/home.png"
activeIcon="/static/uview/tabbar/home-active.png"
```

同时配合 `convex + midButton` 展示发布型底栏。

- [ ] **Step 3: 增加 iconfont 方案说明**

在 tabbar 文档中增加一段跳转或说明，提示用户：

- 若需要统一替换整套图标，可结合 `custom-prefix`
- 详细步骤见 `CustomIcon 扩展自定义图标库`

- [ ] **Step 4: 补充取舍建议**

明确建议：

- 首页/主导航：优先本地图标资源
- 管理后台/工具页：优先内置 iconfont 或扩展 iconfont
- 想保留最强自由度：优先插槽方案

## Task 5: 记录变更并验证

**Files:**
- Modify: `src/uni_modules/uview-plus/changelog.md`

- [ ] **Step 1: 更新 changelog**

补充一条说明，强调本次不仅有风格和动画，还补充了更高颜值的图标示例与推荐方案。

- [ ] **Step 2: 运行代码仓构建验证**

Run: `npm run build:h5`

Expected: 构建成功。

- [ ] **Step 3: 运行文档仓构建验证**

Run: `npm run build`

Workdir: `D:/Repos/xyito/open/uview-plus-doc`

Expected: 文档静态站点成功生成。

- [ ] **Step 4: 运行 diff 检查**

分别执行：

```bash
git diff --check
```

在两个仓库中都应通过。

- [ ] **Step 5: 整理提交说明**

代码仓提交建议：

```txt
优化 tabbar 默认视觉与主推图标方案

补充一套面向首页导航的本地图标资源与高颜值示例。
细调 convex、pill、glow 等主推风格与中间发布按钮层次。
保持现有 API 兼容，并完善文档中的推荐接入方式。
```

文档仓提交建议：

```txt
完善 tabbar 推荐图标方案与视觉示例说明

补充本地图标资源、iconfont 扩展和发布型 tabbar 的使用说明。
明确不同业务场景下的图标接入建议。
```

## Self-Review

- 规格覆盖：计划覆盖资源、示例、组件视觉、文档和验证，符合这轮目标。
- 占位扫描：无 `TODO` / `TBD` 占位项，所有文件路径均明确。
- 类型一致性：继续沿用 `activeIcon`、`inactiveIcon`、`styleType`、`animationType` 等既有命名。
