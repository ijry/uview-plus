# uview-plus AI skill

给 AI 编码助手用的 uview-plus 使用说明，按 [Agent Skills](https://code.claude.com/docs/en/skills) 的 `SKILL.md` 格式组织，随 uview-plus 一起分发。

目的很简单：让 AI 写 uview-plus 代码时不再靠猜——组件名、图标名、属性、双向绑定写法、easycom 接入、多端差异都有一手依据。

```
skills/uview-plus/
├── SKILL.md                    # 入口：硬规则 + 样板代码 + 索引
└── references/
    ├── setup.md                # 安装接入（npm / uni_modules）
    ├── components.md           # 组件清单（源码生成）
    ├── icons.md                # 内置图标名清单（源码生成）
    ├── api.md                  # uni.$u 工具库、路由、请求、主题、i18n
    └── pitfalls.md             # 症状 → 原因，多端与接入常见坑
```

## 在项目里启用

### Claude Code / 认 SKILL.md 的工具

把这个目录放到项目的 `.claude/skills/` 下即可被自动发现。

npm 装法：

```bash
mkdir -p .claude/skills
cp -r node_modules/uview-plus/skills/uview-plus .claude/skills/
```

uni_modules（HBuilderX）装法，把源路径换成项目里的实际位置：

```bash
mkdir -p .claude/skills
cp -r src/uni_modules/uview-plus/skills/uview-plus .claude/skills/
```

Windows PowerShell：

```powershell
New-Item -ItemType Directory -Force .claude\skills | Out-Null
Copy-Item -Recurse -Force node_modules\uview-plus\skills\uview-plus .claude\skills\
```

想让内容随 uview-plus 升级自动更新，用软链代替复制（Windows 需要开发者模式或管理员权限）：

```bash
ln -s ../../node_modules/uview-plus/skills/uview-plus .claude/skills/uview-plus
```

也可以放到 `~/.claude/skills/` 让所有项目共用。

### 其他 AI 工具

不认 `SKILL.md` 的工具（Cursor、Copilot、Codex 等），在项目的 `AGENTS.md`、`.cursor/rules/*.mdc` 或 `.github/copilot-instructions.md` 里加一句指路即可：

```md
本项目使用 uview-plus 组件库。写相关代码前先读 node_modules/uview-plus/skills/uview-plus/SKILL.md，
组件名以 references/components.md 为准，图标名以 references/icons.md 为准，不要凭印象拼名字。
```

## 维护说明

`references/components.md` 与 `references/icons.md` 由 uview-plus 仓库的 `scripts/gen-skill-references.mjs` 从源码生成，`npm run verify:skill-assets` 会校验它们没有漂移，**不要手改**。

其余文件手写。发现内容与源码不符，欢迎到 https://github.com/ijry/uview-plus/issues 反馈，请注明是哪个文件的哪一段。
