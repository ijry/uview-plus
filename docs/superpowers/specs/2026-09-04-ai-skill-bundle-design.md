# uview-plus AI skill 包设计

## 背景

issue #1054 请求「提供一些 skill，让 AI 能够方便的使用 uview-plus」。

核实结论：仓库与已发布产物里确实没有任何面向 AI 的资料。

- 全库搜索 `skill` / `llms.txt` / `mcp` / `.cursor` / `copilot-instructions` 无命中；`docs/superpowers/` 下只有本仓库自身的开发计划与设计稿
- 根目录 `AGENTS.md` 只写本仓库的提交与发布规范，与「怎么用 uview-plus」无关
- 已发布的 `uview-plus@3.8.117` npm 包顶层只有 `changelog.md`、`components`、`index.js`、`index.scss`、`libs`、`LICENSE`、`package.json`、`README.md`、`theme.scss`、`tsconfig.json`、`types`
- 文档站 `uview-plus-doc` 也没有 AI 相关页面

唯一可被机器读取的资产是 `types/`（87 个 `.d.ts`，覆盖 139 个组件中的一部分），它服务于 IDE 补全，不解决 AI「不知道有哪些组件、属性怎么写、接入要配什么」的问题。

AI 写 uview-plus 代码时最常见的失败是编造组件名与图标名、把 `v-model` 和 `v-model:show` 搞反、漏掉 easycom 配置，然后把「没渲染」当成组件 bug。这些都是有确定答案的事实，适合用 skill 固化。

## 目标

1. 提供一份符合 Agent Skills（`SKILL.md`）格式的说明，让认这个格式的工具能直接加载。
2. 随包分发：npm 与 uni_modules 两种装法都能拿到。
3. 组件名、图标名这类硬事实从源码生成，不手写。
4. 内容与源码漂移时，仓库的校验脚本要能拦住。
5. 不认 `SKILL.md` 的工具也有可用的接入方式。

## 非目标

1. 不做 MCP server。它需要独立进程与版本协商，维护成本远高于几份 markdown，而这个 issue 的诉求是「让 AI 知道怎么用」。
2. 不把 139 个组件的属性表全量抄进 skill。属性的一手来源是组件 `.vue` 顶部 JSDoc 与 `props.js`，抄一份只会立刻过期；skill 的职责是把 AI 指到这些文件。
3. 不改动组件运行时代码。
4. 不动文档站，也不改在线文档的内容。

## 方案决策

### 放在包目录内（`src/uni_modules/uview-plus/skills/`）

- **方案 A（采用）**：放进包内。npm 装法在 `node_modules/uview-plus/skills/`，HBuilderX 装法直接落在用户项目的 `uni_modules/uview-plus/skills/`，一次维护两种装法都覆盖，且随版本升级同步。
- 方案 B：放仓库根的 `.claude/skills/`。根 `.gitignore` 已经忽略 `.claude/`，而且只服务于「开发 uview-plus 本身」的场景，不会分发给使用者，与 issue 诉求相反。
- 方案 C：单独发一个 `uview-plus-skill` 包。多一个发布物、多一处版本对齐，收益只是省掉一次拷贝。

包内不能自动写入用户项目的 `.claude/skills/`，因此在 `skills/README.md` 给出拷贝与软链两种接法，软链可以随包升级自动更新。

### 硬事实由脚本生成

`references/components.md`（139 个组件）与 `references/icons.md`（213 个图标名）由 `scripts/gen-skill-references.mjs` 从 `components/` 目录与 `components/u-icon/icons.js` 生成。

组件的判定规则与 easycom 对齐：`components/` 下以 `u-` 开头、且存在同名 `.vue` 入口的目录。据此排除了插件市场占位用的 `components/uview-plus` 与只剩 `section.js` 的 `u-section`。

一句话说明取自组件 `.vue` 顶部 JSDoc 的 `@description`，文档链接取自 `@tutorial`，两者都缺的组件留空，不臆造。

### 分层，不堆成一篇长文

`SKILL.md` 只放「一定要知道」的硬规则加一段样板代码，其余按需读 `references/`。这样 AI 常驻上下文里只有入口，24K 的组件清单只在真正要挑组件时才加载。

## 交付物

```
src/uni_modules/uview-plus/skills/
├── README.md                   # 在各类 AI 工具里怎么启用
└── uview-plus/
    ├── SKILL.md                # 入口：硬规则 + 样板 + 索引
    └── references/
        ├── setup.md            # 安装接入（npm / uni_modules）
        ├── components.md       # 组件清单（生成）
        ├── icons.md            # 图标名清单（生成）
        ├── api.md              # uni.$u、路由、请求、主题、i18n
        └── pitfalls.md         # 症状 → 原因
scripts/gen-skill-references.mjs
scripts/verify-skill-assets.mjs
```

`README.md`（仓库根与包内各一处）增加入口说明。

## 防漂移

`npm run verify:skill-assets` 覆盖：

1. `SKILL.md` frontmatter 的 `name` 与目录名一致、`description` 存在且不超过 1024 字符
2. `references/` 的文件集合与 `SKILL.md` 的索引双向对齐，既无死链也无孤儿文件
3. 两份生成文件与生成器输出逐字节一致（过期即失败，提示重跑生成器）
4. 清单里的每个组件都有真实入口文件；`u-icon` 仍然按 `uicon-` 前缀解析图标名（否则 `icons.md` 的用法说明就错了）
5. easycom 三条规则在 `src/pages.json` 与 `setup.md` 里同时存在
6. `v-model:show` 组件名单与组件真实 `emits` 反查结果完全一致——这份名单是手写的，最容易过期
7. `SKILL.md` 的样板代码：结构完整、每个 `up-*` 标签存在、每个属性在对应 `props.js` 或全局 mixin 里真实存在；依赖可用时再做一次 SFC 解析
8. `api.md` 函数表里的每个标识符都能在 `$u` 对象、`libs/function` 默认导出或包根具名导出里找到
9. `api.md` 关于"挂在哪里"的两条断言：主题方法只在 `uni.$u` 上（不是包根具名导出）、`digit` 与 `getDeviceInfo` 只能具名导入

第 6~9 条是本次的关键守卫：它们把「手写的断言」绑回源码，改组件或调整导出面时会主动报错。

## 验证

- `npm run verify:skill-assets` 通过（139 个组件、213 个图标）
- 分别篡改组件清单、`v-model:show` 名单、样板里的属性名与组件名、`api.md` 的函数名后都能失败，确认守卫不是空跑
- 按 `skills/README.md` 的做法把 skill 拷进临时项目的 `.claude/skills/`，用 YAML 解析器确认 frontmatter 只有 `name`、`description` 两个键且 `name` 与目录名一致
- 借临时安装的 `@vue/compiler-sfc` 跑通样板代码的 SFC 解析，零错误
- 仓库 42 个 `verify:*` 脚本中 35 个通过，7 个因当前 worktree 未安装 `node_modules`（缺 `vite` / `rollup` / `vue` / `@dcloudio/uni-cli-shared`）无法运行，与本次改动无关
