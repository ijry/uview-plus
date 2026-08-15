# 小说阅读器样式同步实施计划

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 参考 uview-plus4，修复 u-novel-reader 在 Vue/nvue 下的布局和主题样式，并将示例页改为全屏沉浸式阅读布局，同时保留现有功能。

**Architecture:** 以当前 Vue3 组件实现为主体，只迁移 uview-plus4 .uvue 中的原生端布局规则和视觉规格。通过静态 UI 合约脚本先锁定关键 CSS 声明，再分组件修改样式；阅读状态、分页、持久化、事件和插槽不变。

**Tech Stack:** Vue SFC、SCSS、uni-app nvue、Node.js assert 静态验证脚本。

## Global Constraints

- 保留当前 Vue3 API、事件、插槽和字重、动画开关、完成按钮等扩展设置项。
- App nvue 使用的横向 Flex 容器必须显式声明 flex-direction: row。
- 顶部和底部工具栏必须悬浮在正文之上，使用 position: absolute 和 z-index: 10。
- 主题继续支持 day、paper、green、night、dark，且 JavaScript 令牌与 SCSS 变量值一致。
- 不替换阅读状态、分页计算、持久化或正文文本排版逻辑。
- 每个功能阶段使用中文 head + body 提交信息。

## Baseline

- 2026-08-15 执行时工作区干净。
- scripts/verify-novel-reader-ui.mjs 通过。
- scripts/verify-novel-reader-props.mjs 通过。
- scripts/verify-novel-reader-data.mjs 通过。
- scripts/verify-novel-reader-layout.mjs 通过。

---

### Task 1: 同步根容器与主题令牌

**Files:**
- Modify: scripts/verify-novel-reader-ui.mjs
- Modify: src/uni_modules/uview-plus/components/u-novel-reader/u-novel-reader.vue:156-317,783-825
- Modify: src/uni_modules/uview-plus/components/u-novel-reader/theme-vars.scss:1-49

**Interfaces:**
- Consumes: 当前 THEME_TOKENS、readerStyle、theme-vars.scss 和根容器样式。
- Produces: 根容器的浮层布局契约，以及五种主题完整的 active、disabled、border 令牌，供工具栏、设置和正文子组件继续通过现有 themeTokens 使用。

- [ ] Step 1: 为根容器和主题写失败断言

在 verify-novel-reader-ui.mjs 增加根组件、主题文件读取，并加入可复用的样式断言辅助函数：

~~~
const main = readFileSync(resolve(componentDir, 'u-novel-reader.vue'), 'utf8')
const themeVars = readFileSync(resolve(componentDir, 'theme-vars.scss'), 'utf8')

function assertRule(source, selector, declarations) {
    const selectorPattern = selector.replace(/[.*+?^$()|[\]\\]/g, '\\$&')
    const match = source.match(new RegExp(
        selectorPattern + '\\s*\\{([^}]*)\\}',
        's'
    ))
    assert.ok(match, 'missing style rule: ' + selector)
    for (const declaration of declarations) {
        assert.match(match[1], new RegExp(
            declaration.replace(/[.*+?^$()|[\]\\]/g, '\\$&')
        ))
    }
}

assertRule(main, '.up-novel-reader', ['position: relative'])
assert.match(main, /\.up-novel-reader__top-toolbar[\s\S]*z-index:\s*10/)
assert.match(main, /\.up-novel-reader__bottom-toolbar[\s\S]*z-index:\s*10/)

const themeColors = {
    day: ['#2979ff', '#c8c9cc'],
    paper: ['#9b7653', '#c7b9a3'],
    green: ['#4d8b55', '#b6c7b4'],
    night: ['#7da7ff', '#62656d'],
    dark: ['#8ab4ff', '#5f6368']
}
for (const [theme, [active, disabled]] of Object.entries(themeColors)) {
    assert.match(themeVars, new RegExp(
        'theme-' + theme + '[\\s\\S]*--up-novel-reader-active:\\s*' + active
    ))
    assert.match(themeVars, new RegExp(
        'theme-' + theme + '[\\s\\S]*--up-novel-reader-disabled:\\s*' + disabled
    ))
    assert.match(main, new RegExp("active:\\s*'" + active + "'"))
    assert.match(main, new RegExp("disabled:\\s*'" + disabled + "'"))
}
~~~

Keep the existing assertions intact. The new test must fail before implementation because the current root style uses z-index: 5 and non-day theme tokens use generic blue/gray values.

- [ ] Step 2: Run the focused contract and confirm failure

Run: node scripts/verify-novel-reader-ui.mjs

Expected: FAIL at the first missing root/theme assertion. Do not weaken the assertion to make the baseline pass.

- [ ] Step 3: Implement the root and theme changes

Update THEME_TOKENS so every entry contains the complete object shape below, using exact values from uview-plus4:

~~~
paper: {
    background: '#f3ead7',
    text: '#51483d',
    muted: '#8f806d',
    toolbar: '#f7efdf',
    border: 'rgba(81, 72, 61, 0.16)',
    active: '#9b7653',
    disabled: '#c7b9a3'
}
~~~

Apply analogous values for day, green, night, and dark. Change themeTokens() to spread the selected complete object without overwriting active, disabled, or border, and add --up-novel-reader-disabled to readerStyle.

Flatten theme-vars.scss to reference selector form (.up-novel-reader.theme-day, etc.) and add matching active and disabled declarations to each theme. In root style, retain current __controls wrapper and change both toolbar z-index declarations from 5 to 10; do not change existing event or positioning structure.

- [ ] Step 4: Run the focused contract and verify it passes

Run: node scripts/verify-novel-reader-ui.mjs

Expected: novel reader UI contract passed.

- [ ] Step 5: Commit the root/theme unit

~~~
git add scripts/verify-novel-reader-ui.mjs src/uni_modules/uview-plus/components/u-novel-reader/u-novel-reader.vue src/uni_modules/uview-plus/components/u-novel-reader/theme-vars.scss
git commit -m "修复：同步小说阅读器根容器与主题样式" -m "补齐五种主题的强调色、禁用色和边框令牌，并将阅读器工具栏层级与 uview-plus4 对齐。"
~~~

---

### Task 2: 修复工具栏与正文原生 Flex 布局

**Files:**
- Modify: scripts/verify-novel-reader-ui.mjs
- Modify: src/uni_modules/uview-plus/components/u-novel-reader/reader-toolbar.vue:220-310
- Modify: src/uni_modules/uview-plus/components/u-novel-reader/reader-content.vue:168-225

**Interfaces:**
- Consumes: Task 1 的 UI 合约辅助函数和主题令牌，不改变工具栏 props、事件或正文 props。
- Produces: nvue 下稳定的工具栏横向排列和分页方向，供主组件现有模板直接使用。

- [ ] Step 1: 为工具栏和分页方向写失败断言

读取 reader-toolbar.vue 与 reader-content.vue，使用 Task 1 的 assertRule 增加：

~~~
assertRule(toolbar, '.up-novel-reader__toolbar-row', ['flex-direction: row'])
assertRule(toolbar, '.up-novel-reader__toolbar-group', ['flex-direction: row'])
assertRule(toolbar, '.up-novel-reader__toolbar-button', ['flex-direction: row'])
assertRule(content, '.up-novel-reader__page', ['flex-direction: row'])
assertRule(toolbar, '.up-novel-reader__toolbar-title', ['max-width: 200px'])
assertRule(toolbar, '.up-novel-reader__progress-value', ['border-radius: 3px'])
~~~

- [ ] Step 2: Run the focused contract and confirm failure

Run: node scripts/verify-novel-reader-ui.mjs

Expected: FAIL because current Vue style relies on Web's default row direction and uses 44vw for title width.

- [ ] Step 3: Add explicit native-compatible declarations

In reader-toolbar.vue, add flex-direction: row to .up-novel-reader__toolbar-row, .up-novel-reader__toolbar-group, and .up-novel-reader__toolbar-button; change title to max-width: 200px; keep hover and disabled rules; change progress value radius to 3px.

In reader-content.vue, add flex-direction: row to .up-novel-reader__page. Keep .up-novel-reader__state as a column layout and leave text wrapping and article sizing untouched.

- [ ] Step 4: Run the focused contract and verify it passes

Run: node scripts/verify-novel-reader-ui.mjs

Expected: novel reader UI contract passed.

- [ ] Step 5: Commit the toolbar/content unit

~~~
git add scripts/verify-novel-reader-ui.mjs src/uni_modules/uview-plus/components/u-novel-reader/reader-toolbar.vue src/uni_modules/uview-plus/components/u-novel-reader/reader-content.vue
git commit -m "修复：兼容小说阅读器工具栏原生布局" -m "为工具栏、按钮组和分页容器显式指定横向 Flex，修正 nvue 下的排列方向和标题宽度。"
~~~

---

### Task 3: 同步设置与目录面板视觉规格

**Files:**
- Modify: scripts/verify-novel-reader-ui.mjs
- Modify: src/uni_modules/uview-plus/components/u-novel-reader/reader-settings.vue:211-312
- Modify: src/uni_modules/uview-plus/components/u-novel-reader/reader-catalog.vue:121-229

**Interfaces:**
- Consumes: Task 1 主题变量和当前设置/目录模板；保留 u-slider、插槽、点击事件及所有设置项。
- Produces: 与 uview-plus4 规格一致、可在 nvue 下稳定排列的弹层内容。

- [ ] Step 1: 为设置和目录写失败断言

向 UI 合约脚本加入：

~~~
assertRule(settings, '.up-novel-reader__settings', ['width: 100%'])
assertRule(settings, '.up-novel-reader__settings-header', ['flex-direction: row'])
assert.match(
    settings,
    /\.up-novel-reader__settings-row,\s*\.up-novel-reader__settings-option\s*\{[^}]*flex-direction:\s*row/s
)
assertRule(settings, '.up-novel-reader__theme-list', ['flex-direction: row'])
assertRule(settings, '.up-novel-reader__theme-option', [
    'flex: 1',
    'height: 42px',
    'border-radius: 8px'
])
assertRule(catalog, '.up-novel-reader__catalog', ['height: 100%'])
assertRule(catalog, '.up-novel-reader__catalog-header', [
    'flex-direction: row',
    'align-items: flex-end'
])
assertRule(catalog, '.up-novel-reader__catalog-item', ['flex-direction: row'])
assertRule(catalog, '.up-novel-reader__bookmark-item', ['flex-direction: row'])
~~~

- [ ] Step 2: Run the focused contract and confirm failure

Run: node scripts/verify-novel-reader-ui.mjs

Expected: FAIL on the first missing settings or catalog declaration.

- [ ] Step 3: Apply reference panel rules without removing features

In reader-settings.vue:

- Set root width to 100%.
- Use header padding 18px 20px 12px, close button 34px, scroll padding 0 20px 24px, and section padding 14px 0.
- Add flex-direction: row to header, close button, settings row, settings option, theme list, theme option, and done button.
- Make theme options flex: 1, height: 42px, border-radius: 8px, and use var(--up-novel-reader-active, #2979ff) for active border.
- Preserve hints, sliders, weight toggle, animation toggle, footer, and done action; adjust only spacing/size to fit reference rhythm.

In reader-catalog.vue:

- Change root height from 100vh to 100%.
- Add flex-direction: row to header, catalog item, index, bookmark heading, and bookmark item; use align-items: flex-end for header.
- Set title to 20px, index width to 24px, and bookmark section to margin-top: 10px; padding: 16px 18px 24px.
- Keep locked/current states, chapter selection, bookmark selection, and default slot unchanged.

- [ ] Step 4: Run the focused contract and verify it passes

Run: node scripts/verify-novel-reader-ui.mjs

Expected: novel reader UI contract passed.

- [ ] Step 5: Commit the panel unit

~~~
git add scripts/verify-novel-reader-ui.mjs src/uni_modules/uview-plus/components/u-novel-reader/reader-settings.vue src/uni_modules/uview-plus/components/u-novel-reader/reader-catalog.vue
git commit -m "修复：统一小说阅读器设置与目录样式" -m "同步弹层尺寸、主题卡片和目录间距，并补齐 nvue 下设置项与目录项的横向布局。"
~~~

---

### Task 4: 将示例页改为全屏沉浸式布局

**Files:**
- Modify: scripts/verify-novel-reader-ui.mjs
- Modify: src/pages/componentsD/novelReader/novelReader.nvue:1-51,236-273

**Interfaces:**
- Consumes: 当前示例页章节数据、mode、settings、请求/进度/设置处理函数，以及阅读器 toolbar-extra 插槽。
- Produces: 全屏示例容器和工具栏中的模式切换入口；阅读器业务事件仍由现有处理函数接收。

- [ ] Step 1: 为全屏示例写失败断言

读取示例文件并加入：

~~~
const demo = readFileSync(resolve(root, 'src/pages/componentsD/novelReader/novelReader.nvue'), 'utf8')
assert.match(demo, /<up-novel-reader[\s\S]*#toolbar-extra/)
assert.match(demo, /\.novel-reader-demo\s*\{[\s\S]*width:\s*100%[\s\S]*height:\s*100%/)
assert.match(demo, /\.novel-reader-demo__mode\s*\{[\s\S]*width:\s*36px[\s\S]*height:\s*36px/)
assert.doesNotMatch(demo, /reader-frame|900rpx/)
~~~

- [ ] Step 2: Run the focused contract and confirm failure

Run: node scripts/verify-novel-reader-ui.mjs

Expected: FAIL because current demo has .reader-frame { height: 900rpx } and no toolbar-extra slot.

- [ ] Step 3: Replace the outer demo presentation

Replace template shell with full-screen root and place mode switching in toolbar:

~~~
<template>
    <view class="novel-reader-demo">
        <up-novel-reader
            book-id="demo-novel"
            :chapters="chapters"
            :current-chapter="currentChapter"
            :loading="loading"
            :error="error"
            :progress="progress"
            :settings="settings"
            :mode="mode"
            @chapter-request="handleChapterRequest"
            @chapter-prefetch="handleChapterPrefetch"
            @progress-change="handleProgressChange"
            @settings-change="handleSettingsChange"
            @retry="handleRetry"
        >
            <template #toolbar-extra>
                <view class="novel-reader-demo__mode" @tap.stop="mode = mode === 'scroll' ? 'page' : 'scroll'">
                    <up-icon name="order" size="18" color="#2979ff"></up-icon>
                </view>
            </template>
        </up-novel-reader>
    </view>
</template>
~~~

Remove only external header, button group, fixed .reader-frame, and footer markup. Keep chapter data and request/progress/settings/retry handlers; remove presentation-only CSS for deleted blocks, and add:

~~~
.novel-reader-demo {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.novel-reader-demo__mode {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
}
~~~

If removed controls leave unused presentation-only methods or state, delete only those methods/state after confirming no remaining references; do not remove state used by reader event callbacks.

- [ ] Step 4: Run the focused contract and verify it passes

Run: node scripts/verify-novel-reader-ui.mjs

Expected: novel reader UI contract passed.

- [ ] Step 5: Commit the demo unit

~~~
git add scripts/verify-novel-reader-ui.mjs src/pages/componentsD/novelReader/novelReader.nvue
git commit -m "优化：将小说阅读器示例改为全屏布局" -m "移除固定高度示例卡片，将模式切换移入工具栏扩展区域，保持阅读器事件处理不变。"
~~~

---

### Task 5: 执行小说阅读器回归验证

**Files:**
- Read: scripts/verify-novel-reader-ui.mjs
- Read: scripts/verify-novel-reader-props.mjs
- Read: scripts/verify-novel-reader-data.mjs
- Read: scripts/verify-novel-reader-layout.mjs
- Read: src/uni_modules/uview-plus/components/u-novel-reader/*

**Interfaces:**
- Consumes: Tasks 1-4 的已提交组件和验证脚本。
- Produces: 可交付的干净工作区和明确的回归结果；不新增运行时 API。

- [ ] Step 1: 运行四个小说阅读器合约脚本

Run:

~~~
node scripts/verify-novel-reader-ui.mjs
node scripts/verify-novel-reader-props.mjs
node scripts/verify-novel-reader-data.mjs
node scripts/verify-novel-reader-layout.mjs
~~~

Expected: 四个脚本均输出 passed 并以退出码 0 完成。

- [ ] Step 2: 检查补丁格式和工作区范围

Run:

~~~
git diff --check
git status --short
git diff HEAD~4 --stat
~~~

Expected: git diff --check 无输出；状态只包含本任务的文档和小说阅读器文件；统计中不出现无关组件。

- [ ] Step 3: 记录平台验证边界

如果当前环境没有可用的 App nvue 真机或模拟器，不声称完成真机视觉验证；在交付说明中明确静态合约已通过，并列出需要在 HBuilderX/App nvue 中检查的四项：工具栏横向排列、设置主题卡片、目录项横向排列、正文高度不随工具栏显隐变化。

## Acceptance Criteria

- App nvue 下工具栏、设置行、主题项、目录项和书签项均按预期横向排列。
- 示例页中的阅读器占满可用窗口，不再出现固定 900rpx 容器。
- 顶底工具栏显隐不改变正文高度，层级保持为 10。
- 五种主题的 JavaScript 令牌与 SCSS 中的 active、disabled、border 值一致。
- 四个小说阅读器验证脚本全部通过，且 props、事件、插槽、分页和持久化逻辑未被改动。
