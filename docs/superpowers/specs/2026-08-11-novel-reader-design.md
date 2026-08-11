# 小说阅读器组件设计

## 背景

`uview-plus` 当前没有面向小说正文的通用阅读组件。业务项目通常需要自行处理章节切换、正文排版、横向分页、阅读设置、目录、书签、进度保存和安全区适配，导致不同项目的阅读体验与跨端行为不一致。

本次新增 `u-novel-reader`，目标是提供一个全端可用、受控章节数据、支持长时间阅读的小说阅读组件。组件参考成熟移动阅读器的交互，但不负责网络请求和业务鉴权。

## 目标

- 支持 H5、小程序、App Vue 页面和 App nvue 页面。
- 对外提供单一 `u-novel-reader` 组件，内部按职责拆分状态、分页、持久化和 UI 模块。
- 支持纵向滚动与横向分页两种阅读模式，并允许运行时切换。
- 支持纯文本和段落数组，不引入 HTML、Markdown 或媒体正文解析。
- 支持目录、上下章、章节预加载、书签、阅读进度、阅读时长统计和异步加载状态。
- 支持字号、行高、段距、正文宽度、字体、粗体、主题和翻页动画设置。
- 默认提供与 `u-navbar` 一致的返回按钮参数和顶部/底部安全区适配。
- 同步补充示例页、组件文档和静态校验脚本。

## 非目标

- 组件不直接请求章节接口，不内置鉴权、付费解锁或广告逻辑。
- 首版不支持 HTML、Markdown、图片、音频、视频和自定义正文节点。
- 首版不实现全文搜索、划线批注、评论和云端同步。
- 不引入第三方阅读引擎或新的运行时依赖。
- 不修改无关组件、主题系统或发布版本号。

## 设计原则

1. **业务控制章节，组件控制阅读体验**：业务传入章节元数据和当前章节正文，组件通过事件请求下一章、上一章或目录目标章节。
2. **稳定优先于视觉特效**：分页、恢复位置和安全区行为必须先于翻页动画；动画可以关闭或在减少动态效果时自动降级。
3. **正文内容不丢失**：排版失败、存储损坏或章节加载失败时，组件显示明确状态并保留重试或切换纵向模式的路径。
4. **跨端能力集中适配**：测量、状态栏、底部安全区和持久化由内部适配模块统一处理，不在模板中散落平台判断。
5. **保持 uview-plus 习惯**：组件目录使用 `u-novel-reader`，默认参数使用 `props.js` 与 `novelReader.js`，图标和弹层复用现有组件。

## 公共 API

### 章节数据

```js
const chapters = [
  {
    id: 'chapter-1',
    index: 0,
    title: '第一章 初见',
    isLocked: false,
    progress: 0
  }
]

const currentChapter = {
  id: 'chapter-1',
  index: 0,
  title: '第一章 初见',
  content: [
    '这是第一段正文。',
    '这是第二段正文。'
  ]
}
```

`chapters` 只承担目录和章节定位所需的元数据。`currentChapter.content` 接受字符串或字符串数组，组件内部统一归一化为段落数组。`index` 必须是章节在业务目录中的稳定索引，不能使用当前已加载数组的相对索引替代。

### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `chapters` | `Array` | `[]` | 章节目录元数据 |
| `currentChapter` | `Object \| null` | `null` | 当前章节及正文 |
| `loading` | `Boolean` | `false` | 当前章节是否正在加载 |
| `error` | `Object \| null` | `null` | 当前章节加载或排版错误 |
| `bookId` | `String \| Number` | `''` | 书籍唯一标识，用于默认存储键 |
| `storageKey` | `String` | `''` | 自定义存储键，优先级高于 `bookId` |
| `persist` | `Boolean` | `true` | 是否启用进度、设置和书签本地持久化 |
| `initialProgress` | `Object \| null` | `null` | 外部传入的初始进度 |
| `progress` | `Object \| null` | `null` | 可选的外部进度状态 |
| `initialBookmarks` | `Array` | `[]` | 外部传入的初始书签 |
| `bookmarks` | `Array \| null` | `null` | 可选的外部书签状态 |
| `defaultSettings` | `Object` | 见下文 | 初始阅读设置 |
| `settings` | `Object \| null` | `null` | 可选的外部设置状态 |
| `mode` | `String` | `'scroll'` | `scroll` 纵向滚动或 `page` 横向分页 |
| `showBack` | `Boolean` | `true` | 顶部工具栏是否显示返回图标 |
| `autoBack` | `Boolean` | `false` | 点击返回图标后是否自动执行 `uni.navigateBack()` |
| `backIcon` | `String` | `'arrow-left'` | 返回图标名称 |
| `safeAreaInsetTop` | `Boolean` | `true` | 顶部工具栏是否适配状态栏安全区 |
| `safeAreaInsetBottom` | `Boolean` | `true` | 底部工具栏是否适配底部安全区 |
| `preloadThreshold` | `Number` | `2` | 距离章节末尾多少页时触发预加载 |
| `pageAnimation` | `Boolean` | `true` | 是否启用横向分页动画 |
| `controlsAutoHide` | `Number` | `0` | 工具栏自动隐藏延迟，`0` 表示不自动隐藏 |

`defaultSettings` 的默认值为：

```js
{
  theme: 'day',
  fontSize: 18,
  lineHeight: 1.8,
  paragraphSpacing: 16,
  contentWidth: '92%',
  fontFamily: 'system',
  fontWeight: 400,
  animation: true
}
```

组件初始进入阅读页时默认隐藏顶部和底部工具栏；点击正文中部显示工具栏。`showBack` 只控制工具栏显示后的返回按钮，不改变工具栏的显隐逻辑。`pageAnimation` 是业务层能力开关，`settings.animation` 是用户设置；实际动画状态为两者同时启用。

字号、段距和正文宽度接受数字或带单位字符串；无单位数字按组件内部统一的跨端单位转换。行高支持无单位倍数或带单位值。

### 事件

```js
@back="handleBack"
@chapter-request="handleChapterRequest"
@chapter-prefetch="handleChapterPrefetch"
@progress-change="handleProgressChange"
@settings-change="handleSettingsChange"
@bookmark-change="handleBookmarkChange"
@reading-time-change="handleReadingTimeChange"
@mode-change="handleModeChange"
@toolbar-change="handleToolbarChange"
@retry="handleRetry"
```

事件 payload 约定：

```js
// chapter-request / chapter-prefetch
{
  targetIndex: 3,
  targetId: 'chapter-4',
  direction: 'next' // 'previous' | 'catalog'
}

// progress-change
{
  chapterId: 'chapter-1',
  chapterIndex: 0,
  pageIndex: 2,
  pageCount: 8,
  charOffset: 420,
  chapterProgress: 0.32,
  totalProgress: 0.04,
  scrollTop: 640,
  updatedAt: 1786444800000
}

// settings-change
{
  mode: 'page',
  theme: 'paper',
  fontSize: 20,
  lineHeight: 1.9,
  paragraphSpacing: 18,
  contentWidth: '92%',
  fontFamily: 'system',
  fontWeight: 400,
  animation: true
}
```

章节请求事件只表达意图，不改变 `currentChapter`。业务完成异步加载后更新 `currentChapter`，组件根据章节 ID 和请求标识处理竞态返回。

### 插槽

- `top`：顶部工具栏右侧扩展区域。
- `bottom`：底部工具栏扩展区域。
- `toolbar-extra`：工具栏操作项。
- `catalog`：替换目录内容。
- `settings`：替换设置面板内容。
- `loading`：章节加载状态。
- `error`：错误状态，提供 `retry` 作用域方法。
- `empty`：无章节或正文为空时的状态。

## 内部架构

组件目录位于 `src/uni_modules/uview-plus/components/u-novel-reader/`，对外只暴露 `u-novel-reader.vue`。

内部职责划分：

- `u-novel-reader.vue`：组合阅读容器、管理生命周期、转发事件和渲染插槽。
- `reader-core.js`：管理当前模式、工具栏状态、进度锚点、书签和阅读时长。
- `content-normalizer.js`：将字符串、换行和段落数组归一化为稳定段落结构。
- `layout-engine.js`：根据容器尺寸和阅读设置计算行、页、字符偏移及缓存键。
- `measure-adapter.js`：封装 Canvas 文本测量和 `createSelectorQuery` 尺寸测量差异。
- `persistence.js`：封装存储键、版本化数据结构、节流写入和损坏数据恢复。
- `reader-toolbar.vue`：顶部/底部工具栏、返回、目录、书签和进度操作。
- `reader-catalog.vue`：目录抽屉、章节高亮、锁定状态和目录点击。
- `reader-settings.vue`：主题、字号、行高、段距、宽度、字体和动画设置。
- `reader-content.vue`：纵向段落渲染与横向页面渲染。
- `props.js`、`novelReader.js`：按现有组件约定声明 props 和默认值。
- `theme-vars.scss`：阅读器主题变量和主题覆盖。

内部 Vue 文件不使用 `u-` 前缀，避免被 easycom 误识别为公共组件。

## 数据流

1. 组件接收 `chapters`、`currentChapter`、外部进度和外部设置。
2. `reader-core` 合并显式状态、本地存储和默认值，生成当前阅读快照。
3. `content-normalizer` 处理正文，`layout-engine` 在分页模式下计算页面。
4. 阅读位置变化时，组件节流发出 `progress-change`，同时按配置写入本地存储。
5. 接近章节边界时发出 `chapter-prefetch`；用户真正翻章时发出 `chapter-request`。
6. 业务更新 `currentChapter` 后，组件校验章节 ID、请求标识和目标方向，再恢复字符锚点。

当 `progress`、`bookmarks` 或 `settings` 传入非空值时，它们作为外部受控状态使用；未传入时由组件内部状态和本地持久化驱动。`mode` prop 优先于 `settings.mode`，事件中的设置快照始终包含最终生效的 `mode`。

## 阅读模式与交互

### 纵向模式

- 内容放入 `scroll-view`，段落之间使用可配置的段距。
- 滚动位置转换为章节字符锚点和章节进度。
- 到达首尾边界时，通过工具栏按钮或明确的边界操作请求上一章/下一章。
- 不横向劫持正文滚动，避免与系统返回手势和页面滚动冲突。

### 横向模式

- `layout-engine` 按正文宽度、可用高度、字号、字体、行高和段距拆分页面。
- 页面由已经计算的文本片段组成，使用 `swiper` 管理滑动和动画。
- 点击左侧区域上一页、点击右侧区域下一页、点击中部区域显示或隐藏工具栏。
- 到达当前章节末页后，请求下一章；首章首屏和末章末屏使用明确的禁用状态。

### 工具栏

- 返回按钮只存在于顶部工具栏内，不常驻。
- 顶部工具栏显示时默认包含返回图标、章节标题、目录入口和右侧扩展插槽。
- 底部工具栏提供章节进度、上一章、下一章、设置和书签。
- `controlsAutoHide` 默认关闭自动隐藏；业务开启后，工具栏按延迟隐藏。
- 设置动画关闭或系统要求减少动画时，分页切换使用无动画或最短过渡。

## 主题、安全区与可访问性

内置主题：

| 主题 | 背景 | 正文 |
| --- | --- | --- |
| `day` | `#f7f8fa` | `#303133` |
| `paper` | `#f3ead7` | `#51483d` |
| `green` | `#e7f1e4` | `#3f5140` |
| `night` | `#202124` | `#d6d7da` |
| `dark` | `#111214` | `#e5e7eb` |

主题通过组件作用域 CSS 变量覆盖，不修改全局 `uview-plus` 主题。主题变量至少包括背景、正文、次要文字、工具栏背景、边框、进度条和禁用色。

顶部工具栏使用 `u-status-bar` 适配状态栏；底部工具栏使用 `u-safe-bottom` 适配底部指示条。nvue、微信小程序等平台优先使用 `getWindowInfo().safeAreaInsets` 计算，H5 使用安全区样式兜底。屏幕尺寸或横竖屏变化时重新计算容器尺寸和分页。

交互控件使用现有 `u-icon` 图标，不使用 emoji 作为图标。按钮提供清晰触摸反馈、动态标签和焦点状态；颜色不是唯一状态提示。分页动画遵循减少动态效果设置。

## 书签、进度与统计

书签结构：

```js
{
  id: 'chapter-1:420',
  chapterId: 'chapter-1',
  chapterIndex: 0,
  charOffset: 420,
  excerpt: '这是当前书签附近的正文摘要',
  createdAt: 1786444800000
}
```

进度以 `chapterId`、`charOffset`、`pageIndex` 和 `scrollTop` 共同保存。字符偏移用于重排后的定位，页码和滚动距离用于同一布局下的快速恢复。

阅读时长只统计组件处于可见、非加载、用户有交互的活跃时间；组件销毁或进入后台前发出 `reading-time-change`，不内置上传行为。

本地存储使用版本化结构：

```js
{
  version: 1,
  progress: {},
  settings: {},
  bookmarks: [],
  readingTime: 0,
  updatedAt: 1786444800000
}
```

优先级为显式传入状态 > 本地存储 > 默认值。写入使用节流；无法解析的旧数据直接清理并恢复默认值，不阻塞正文渲染。

## 错误处理

- 章节请求期间锁定重复的相同目标请求。
- 为每次章节请求分配递增标识，旧请求晚返回时忽略。
- `error` 状态通过错误插槽呈现，重试触发 `retry`，不伪造章节内容。
- 正文为空时显示 `empty` 插槽；无章节目录时禁用目录入口。
- 分页测量不可用时保留正文，并允许切换为纵向模式。
- 存储损坏、版本不兼容或写入失败只影响持久化，不影响当前阅读。

## 测试与验收

静态校验脚本覆盖：

- 组件目录、`props.js`、默认配置和 easycom 可发现性。
- 核心事件名称及 payload 字段。
- 主题、安全区、返回按钮默认参数。
- 分页引擎的长段落、换行、空内容、边界和缓存键。
- 持久化版本、书籍隔离、节流写入和损坏数据恢复。

手工验证覆盖：

- H5、小程序、App Vue、App nvue。
- 375px 宽度、平板宽度、横屏和带刘海/底部指示条设备。
- 纵向滚动、横向分页、点击分区、滑动翻页、目录跳转、书签恢复。
- 快速连续翻章、加载失败重试、设置重排和系统减少动画。

验收标准：

- 用户可只提供章节元数据、当前章节正文和 `chapter-request` 处理函数完成阅读。
- 切换阅读设置后，正文视觉参数立即生效，阅读位置保持在同一字符附近。
- 退出并重新进入同一本书后，进度、设置和书签按配置恢复。
- 返回按钮默认显示在顶部工具栏，工具栏隐藏时同步隐藏，并完成顶部安全区适配。
- 组件不直接依赖网络、第三方分页引擎或 HTML 正文解析。

## 交付范围

- `src/uni_modules/uview-plus/components/u-novel-reader/` 组件源码。
- `src/pages/componentsD/novelReader/novelReader.nvue` 示例页面及必要的页面配置。
- `src/pages/example/components.config.js` 组件目录注册。
- `scripts/verify-novel-reader.mjs` 静态验证脚本及 `package.json` 脚本入口。
- `..\uview-plus-doc\docs\components\novelReader.md` 组件文档及文档导航配置。
