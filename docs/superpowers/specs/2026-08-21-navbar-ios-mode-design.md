# Navbar iOS 大标题模式设计

## 背景

`u-navbar` 目前只有一种形态：状态栏占位 + 固定高度内容区，标题始终居中，背景始终不透明。

现代 iOS 系统应用（设置、邮件、音乐）使用另一种导航栏：进入页面时导航栏背景透明，标题以大字号靠左显示在页面顶部；向下滚动时大标题被压缩进导航栏，标题变为常规居中形态，同时导航栏出现毛玻璃背景——既能透出下方滚动内容的影子，又保证文字不互相叠加。

本设计为 `u-navbar` 新增 `mode` 属性，`ios` 值提供上述体验，`default` 保持现有行为完全不变。

## 目标

1. 新增 `mode` 属性，可选 `default`（默认）与 `ios`。
2. `ios` 模式下导航栏初始背景透明，标题以大字号靠左显示。
3. 向下滚动时大标题被压缩，标题过渡为常规居中形态。
4. 压缩后的导航栏呈现毛玻璃磨砂背景，可透出下方内容影子。
5. 任何滚动位置都不出现两段标题文字互相透出的叠加错乱。
6. `default` 模式的结构、样式、属性语义零回退。

## 非目标

1. 不改变 `default` 模式的任何现有行为，包括 `__placeholder` 现有的高度计算方式。
2. 不在组件内部监听页面滚动。
3. 不重构 `u-status-bar`。
4. 不为 nvue 单独实现 iOS 模式。
5. 不新增大标题行高、字号、动画曲线等细粒度属性。
6. 不改动 `u-navbar-mini`。

## 方案决策

### 滚动量来源：`scrollTop` 属性

`onPageScroll` 是页面级生命周期，组件内部无法获取，小程序端尤其如此。

- **方案 A（采用）**：新增 `scrollTop` 属性，由页面在 `onPageScroll` 中传入。与 `u-back-top` 既有约定一致，全端行为统一，且只有连续的滚动量才能驱动连续插值。
- 方案 B：组件内部按平台分别监听（H5 用 `window` 事件，小程序用 `IntersectionObserver`）。使用方零代码，但只能得到离散的"过了/没过"状态，做不出连续过渡，且各端实现分叉大。
- 方案 C：纯 CSS `position: sticky`。无需 JS，但连续的字号与位移插值在 uni-app 全端（尤其 nvue）无法用纯 CSS 表达。

### 大标题层级：in-flow 层，靠原生滚动位移

- **方案 A（采用）**：大标题渲染在 in-flow 层，随页面原生滚动被带走、滑入固定层下方。位移完全不依赖 JS，小程序端不会因 `setData` 回程延迟产生拖影。`scrollTop` 仅驱动两个 `opacity` 值，这类量对一两帧延迟不敏感。
- 方案 B：大标题渲染在固定层内，由 `scrollTop` 驱动其位移并收缩固定层高度。逻辑更自洽，但位移经过 JS 往返，小程序端会相对页面内容产生可见拖影，恰好破坏"挤压"手感。

### 磨砂降级：高不透明度底色叠加模糊

`backdrop-filter` 支持面碎片化，且除 H5 的 `@supports` 外各端无法特性检测，因此不能写"检测到不支持就换一套样式"的分支。同一套 CSS 必须在两种渲染结果下都保证文字可读。

- **方案 A（采用）**：底色使用 0.82 不透明度的半透明色，同时叠加 `backdrop-filter`。支持的端得到真实毛玻璃；不支持的端得到 82% 不透明底色，下方内容仅剩极淡影子，文字绝不读串。一套值、零检测、两端可用。
- 方案 B：不支持的端使用 100% 实色。最安全，但"透出内容影子"的效果在这些端完全丢失。
- 方案 C：新增属性让业务自行配置模糊量与底色。把必须保证可读性的取舍推给使用方，且新增 API 需要文档与类型成本。

### 两条透明度曲线：分段递进

大标题是 in-flow 的，向上滚动时会滑入固定层下方。固定层能否遮住它取决于此刻背景的不透明度，而背景也在随滚动淡入。若两条曲线同步，中间会存在一段窗口：导航栏仍半透明、大标题正从下方穿过并透出、居中标题同时淡入——三者同框即产生叠加错乱。

- **方案 A（采用）**：磨砂在前半段走完，居中标题在后段才开始。任何居中文字出现前，背景已达满不透明度。
- 方案 B：两条曲线同步线性。实现最简单，但必然存在上述三者同框的窗口。
- 方案 C：`progress` 到 1 时硬切。永不重叠，但背景是跳变出现的，且压缩过程中头部始终全透明，滚动内容会直接与状态栏文字重叠。

### nvue：整体降级为 default

三条约束叠加，任意一条都足以让 iOS 模式在 nvue 失效：

1. nvue 使用 Weex CSS 子集，无 filter 管线，`backdrop-filter` 完全不支持。
2. nvue 页面本身不是原生滚动容器，滚动依赖 `<list>` / `<scroll-view>`，而 `u-navbar` 位于滚动容器之外，in-flow 大标题不会随之位移。
3. nvue 的 `onPageScroll` 不可靠。

- **方案 A（采用）**：`#ifdef APP-NVUE` 下将 `mode` 强制视为 `default`。传入 `ios` 不报错、不产生半成品形态。
- 方案 B：nvue 上渲染大标题但不做磨砂与压缩。结果是一个永久钉住的左对齐大标题，既不像 iOS 也不像原导航栏，比不支持更糟。
- 方案 C：为 nvue 单独实现 `<list>` 内嵌方案。API 与 vue 端完全分叉，工作量翻倍，且约束 1 仍无法绕过。

## 设计

### 1. 属性

新增两个属性，需同时落地 `navbar.js` 默认值、`props.js` 属性定义、`navbar.d.ts` 类型：

| 属性 | 类型 | 默认值 | 说明 |
| :- | :- | :- | :- |
| `mode` | String | `'default'` | `'default'` 保持现有行为；`'ios'` 启用大标题与磨砂 |
| `scrollTop` | String \| Number | `0` | 页面滚动距离，仅 `ios` 模式使用，经 `getPx()` 兼容 rpx |

`mode` 为除 `'ios'` 以外的任何值（包括非法字符串）均按 `default` 处理，不抛错、不产生中间形态。

### 2. `ios` 模式下既有属性的语义

大标题的引入改变了三个既有属性的含义，必须显式收口：

- `fixed`：**忽略**，恒为固定。压缩后的导航栏必须钉在顶部，`fixed=false` 在此模式下无意义。
- `placeholder`：**忽略**，in-flow 层恒定渲染。该层承载的是大标题这一实际内容，而非可选占位；`placeholder` 默认为 `false`，若受其控制则大标题无处安放。
- `bgColor`：传入时作为压缩态背景，仍按磨砂曲线淡入；不传时使用玻璃主题变量。传入不透明颜色会掩盖模糊效果，这是预期行为，需在文档中写明。
- `titleColor` / `titleStyle`：同时作用于大标题与居中标题，颜色与字重只有一个覆盖入口。
- `titleWidth`：仅约束居中标题；大标题铺满可用宽度，超出以省略号隐藏。
- `center` 插槽：仍然替换居中区内容，并与默认居中标题一样受 `centerOpacity` 控制。大标题始终取 `title` 属性渲染，不使用 `center` 插槽内容——插槽内容通常是为常规栏高度设计的，放大后布局会失控。因此使用 `center` 插槽时若需要大标题，必须同时传 `title`。
- `left` / `right` 插槽：行为不变，全程不透明。

`title` 为空字符串时不渲染大标题行，此时有效大标题行高为 0，`progress` 恒为 1（见第 4 节），`ios` 模式退化为一个初始即呈磨砂态的常规导航栏。

### 3. 结构与高度模型

记状态栏高度为 `S`（`getWindowInfo().statusBarHeight`），常规导航栏高度为 `H`（`getPx(height)`，默认 44）。大标题行高常量为 `LARGE_TITLE_HEIGHT = 52`（内部常量，不开放为属性）；有效大标题行高 `L` 取决于是否渲染大标题：

```js
L = title ? LARGE_TITLE_HEIGHT : 0
```

`title` 为空时 `L = 0`，in-flow 层只剩让位块，导航栏初始即为压缩态。

```
<view class="u-navbar u-navbar--ios">
  <!-- ① in-flow 层：恒定渲染，被页面原生滚动带走 -->
  <view class="u-navbar__flow">
    <view style="height: S + H" />                             ← 让位给固定层
    <view class="u-navbar__large-title" v-if="title">{{ title }}</view>  ← 高 L，34px / 700，左内边距 13px
  </view>

  <!-- ② 固定层：高度恒为 S + H，永不变化 -->
  <view class="u-navbar__inner u-navbar--fixed" style="background: transparent">
    <view class="u-navbar__glass" :style="{ opacity: glassOpacity }" />   ← 绝对定位铺满，位于内容之下
    <u-status-bar v-if="safeAreaInsetTop" />
    <view class="u-navbar__content">
      left | center(:style="{ opacity: centerOpacity }") | right
    </view>
  </view>
</view>
```

三个结构要点：

1. **玻璃是独立的绝对定位层**，不是 `__inner` 的背景。背景需随滚动淡入，而文字图标必须全程不透明；同一元素上的 `opacity` 无法同时满足两者。
2. **`ios` 模式下 `__inner` 必须为 `background: transparent`**，否则 `backdrop-filter` 采样到自身底色，模糊不出任何内容。
3. **让位块高度为 `getPx(height) + (safeAreaInsetTop ? S : 0)`**。现有 `__placeholder` 无条件加 `S` 而不判断 `safeAreaInsetTop`；`ios` 模式按正确逻辑实现，`default` 模式的该行保持原样不改。

左右两侧（返回箭头、右侧动作）全程不透明，从初始状态即位于压缩栏内——这与 iOS 行为一致，仅居中标题参与淡入。

### 4. 进度与两条曲线

```js
progress      = L > 0 ? clamp(getPx(scrollTop) / L, 0, 1) : 1
glassOpacity  = clamp(progress / 0.5, 0, 1)             // 0    → 0.5 达满
centerOpacity = clamp((progress - 0.75) / 0.25, 0, 1)   // 0.75 → 1   才启动
```

分母取有效大标题行高 `L`，因此 `progress = 1` 的物理含义即"大标题恰好完全没入导航栏内"。`L = 0`（`title` 为空）时 `progress` 直接取 1，避免除零。

`border` 的下边框挂在玻璃层上，随 `glassOpacity` 一同淡入——iOS 的发丝线同样是压缩后才出现。

`scrollTop` 未传入时恒为 0，停留在展开态，不报错。

### 5. 玻璃层

```scss
.u-navbar__glass {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  -webkit-backdrop-filter: saturate(180%) blur(var(--up-navbar-glass-blur, 20px));
          backdrop-filter: saturate(180%) blur(var(--up-navbar-glass-blur, 20px));
}
```

`-webkit-` 前缀必须保留，iOS 16 之前的 WKWebView 仅识别前缀版本。模糊半径写在静态 class 内而非 `:style` 绑定，使前缀在编译期确定；CSS 变量不被支持时回落到字面量 `20px`。

底色走 JS 主题变量，因为它需要参与 `opacity` 绑定并跟随暗色模式：

```js
navbarGlassBgColor() {
  return this.bgColor
    || this.upThemeVar('--up-navbar-glass-bg-color',
         this.upThemeIsDark ? 'rgba(28, 28, 30, 0.82)' : 'rgba(255, 255, 255, 0.82)')
}
```

0.82 是承重值：模糊无法生效时，它本身即构成可读性下限。

新增的 `--up-navbar-glass-bg-color` 与 `--up-navbar-glass-blur` 需落地三处，与 `--up-navbar-bg-color` 现有待遇一致：

1. `components/u-navbar/theme-vars.scss` —— CSS 层明暗默认值
2. `libs/theme/runtime.js` 的 `FALLBACK_THEME_VARS` —— light 与 dark 两份
3. `libs/theme/theme.js` 的 `buildThemeCssVars` —— 运行时主题构建

**堆叠约束**：玻璃层为绝对定位，而 `u-status-bar` 不是；绝对定位元素会覆盖同级非定位元素。因此 `__content` 必须显式设置 `position: relative; z-index: 1`。此项遗漏的表现是整个导航栏内容不可见，属于会静默出错的细节。

### 6. 平台差异

| 平台 | 大标题压缩 | 磨砂 |
| :- | :- | :- |
| H5 现代浏览器 | √ | √ |
| APP-VUE / iOS | √ | √ |
| APP-VUE / Android | √ | 视 WebView 版本，否则 82% 实底 |
| app-harmony | √ | √（ArkWeb） |
| APP-NVUE | 整体降级为 `default` | — |
| 微信小程序 iOS | √ | √ |
| 其余小程序 | √ | 视端能力，否则 82% 实底 |

nvue 降级使用 `#ifdef APP-NVUE` 判定。注意该 flag 在 `app-harmony` 上为 false，而这正是所需行为：harmony 走 ArkWeb 渲染，应获得完整的 `ios` 模式而不被降级。

## 验收标准

1. 不传 `mode` 时，`u-navbar` 的 DOM 结构、样式与属性行为与改动前完全一致。
2. `mode="ios"` 且 `scrollTop=0` 时，导航栏背景透明，大标题以 34px 左对齐显示在状态栏与常规栏下方。
3. `mode="ios"` 且滚动量超过 52px 时，大标题完全没入，居中标题完全显示，磨砂背景不透明度达满。
4. `mode="ios"` 时传入 `fixed=false` 或 `placeholder=false` 不改变布局。
5. `mode="ios"` 且 `title=""` 时不渲染大标题行，导航栏初始即为磨砂态（`progress` 恒为 1）。
6. `mode="ios"` 但不传 `scrollTop` 时停留在展开态且不报错。
7. `mode` 传入非法值时按 `default` 处理。
8. `mode="ios"` 且使用 `center` 插槽时，插槽内容随 `centerOpacity` 淡入，大标题仍取 `title` 渲染。
9. `backdrop-filter` 不生效的端上，压缩后的导航栏为 82% 不透明底色，文字清晰可读。
10. 暗色模式下玻璃底色切换为 `rgba(28, 28, 30, 0.82)`。
11. nvue 端传入 `mode="ios"` 时渲染为 `default` 形态。

## 人工验收清单

静态断言无法覆盖视觉表现，以下时间线需在 H5 构建后逐行人工核对。此表同时是"两段文字不叠加"这一要求的验证依据：

| progress | 玻璃不透明度 | 居中标题不透明度 | 大标题位移 | 预期观察 |
| :- | :- | :- | :- | :- |
| 0 | 0 | 0 | 0 | 仅大标题可见，导航栏区域完全透明 |
| 0.25 | 0.5 | 0 | 13px | 大标题上方空白处半透明穿过，无文字重叠 |
| 0.5 | 1.0 | 0 | 26px | 玻璃已完全不透明，大标题字形开始被真正遮挡 |
| 0.75 | 1.0 | 0 | 39px | 居中标题此刻才启动，其下方已是实底 |
| 1 | 1.0 | 1.0 | 52px | 大标题完全没入，居中标题完全显示 |

关键在第四行：居中标题出现之前，玻璃已在 `progress = 0.5` 达到满不透明度，因此任何时刻都不存在两段文字互相透出。

## 测试思路

新增 `scripts/verify-navbar-ios-mode.mjs` 静态契约，注册为 `npm run verify:navbar-ios-mode`，守护以下项：

1. `mode` 与 `scrollTop` 在 `navbar.js`、`props.js`、`navbar.d.ts` 三处注册。
2. `progress` 公式使用有效大标题行高作分母、做 0-1 钳制，并在 `L = 0` 时取 1。
3. `glassOpacity` 与 `centerOpacity` 的分段区间分别为 0-0.5 与 0.75-1。
4. `#ifdef APP-NVUE` 降级分支存在。
5. `ios` 模式下 `__inner` 背景为 `transparent`。
6. 玻璃层为独立元素且带 `-webkit-` 前缀。
7. `__content` 带 `position: relative` 与 `z-index`。
8. 两个玻璃主题变量在 `theme-vars.scss`、`runtime.js`、`theme.js` 三处存在。
9. changelog 记录与 `package.json` 脚本注册。

同时运行既有 `npm run verify:navbar-safe-area-background` 确认 `default` 模式契约未被破坏，并执行 `npm run build:h5` 确认构建通过。

**验证能力的诚实边界**：本仓库 `verify:*` 脚本均为静态源码断言。它能守住公式、分流、降级等契约不被后续改动破坏，但**无法验证视觉效果**——滚动手感、磨砂是否真实生效、两条曲线交接处是否出现文字重叠，只能通过上方人工验收清单核对。

## 交付物

| 文件 | 职责 |
| :- | :- |
| `scripts/verify-navbar-ios-mode.mjs` | 静态契约守护 |
| `package.json` | 注册 `verify:navbar-ios-mode` |
| `src/uni_modules/uview-plus/components/u-navbar/navbar.js` | `mode` / `scrollTop` 默认值 |
| `src/uni_modules/uview-plus/components/u-navbar/props.js` | `mode` / `scrollTop` 属性定义 |
| `src/uni_modules/uview-plus/components/u-navbar/u-navbar.vue` | 结构、进度计算、玻璃层、样式 |
| `src/uni_modules/uview-plus/components/u-navbar/theme-vars.scss` | 玻璃变量明暗默认值 |
| `src/uni_modules/uview-plus/libs/theme/runtime.js` | 玻璃变量接入 `FALLBACK_THEME_VARS` |
| `src/uni_modules/uview-plus/libs/theme/theme.js` | 玻璃变量接入 `buildThemeCssVars` |
| `src/uni_modules/uview-plus/types/comps/navbar.d.ts` | `mode` / `scrollTop` 类型 |
| `src/pages/componentsC/navbarIos/navbarIos.vue` | `ios` 模式示例，新建 `.vue` 页面 |
| `src/pages.json` | 新页面注册，`navigationStyle: custom` |
| `src/pages/componentsC/navbar/navbar.nvue` | 增加跳转到 `ios` 示例页的入口 |
| `src/uni_modules/uview-plus/changelog.md` | 3.8.112 记录 |
| `../uview-plus-doc/docs/components/navbar.md` | 属性表、`ios` 模式章节、平台差异说明 |

示例页新建为 `.vue` 而非 `.nvue`，因为 nvue 不支持该模式；库内已有 `componentsB/tabbar/tabbar2.vue` 等 `.vue` 示例页先例。

示例页通过现有 navbar 示例页的按钮跳转进入，不在 `components.config.js` 中新增顶层条目——组件索引中 Navbar 仍为一条。

## 风险与注意事项

1. `mode="ios"` 下 `fixed` 与 `placeholder` 被忽略，这两个属性在两种模式下语义不同。文档需明确说明，避免使用方误以为配置未生效。
2. `scrollTop` 由使用方通过 `onPageScroll` 传入，若遗漏则导航栏停留在展开态。这是有意的静默降级而非报错，文档需给出完整示例代码。
3. 0.82 不透明度是可读性下限的承重值，后续调整主题变量时不应显著降低，否则模糊不生效的端会出现文字读串。
4. `L = 52px` 为内部常量 `LARGE_TITLE_HEIGHT`。若后续需要开放为属性，`progress` 分母需同步改为该属性值。
5. `--up-navbar-glass-blur` 通过 CSS 变量注入静态 class，未支持 CSS 变量的端回落到 20px 字面量；此路径与其它通过 JS 读取的主题变量机制不同，修改时需注意。
6. 大标题左内边距取 13px 而非 iOS 规范的 16pt，以与现有 `__content__left` 的 `padding: 0 13px` 对齐，保证大标题与返回箭头左边缘齐平。
