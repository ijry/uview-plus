# AGENTS

## 提交规范

- `git commit` 信息必须使用中文。
- 提交信息必须包含 `head + body` 两部分，不允许只有单行标题。
- `head` 使用一句话概述本次改动；`body` 说明改动目的、范围或影响。

## 发布规范

- 发布新版本时，必须参考 `D:\Repos\xyito\config\ultraUI.md` 执行。
- 按该文档中的命令与流程处理 `uview-plus` / `uview-ultra` 的版本 bump、notes、发布与后续提交推送。

## npm 发布暂停（长期指令，优先级最高）

- **uview-ultra 的 npm 发布目前处于暂停状态**：无用户明确、当次单独的「恢复 npm」指示前，禁止执行 `npm publish`。仅 DCloud 插件市场发布按 `ultraUI.md` 正常进行。
- `ultraUI.md` 中 4.x 的「npm 双渠道」章节与本条冲突时，**以本暂停令为准**。既有用户指令（暂停）优先级高于文档与先例推断；拿不准先问，勿自行推断为「已恢复」。
- 背景：2026-10-30 起用户多次要求暂停 npm；11-01、11-06 两次误发后撤回均被 npm 拒绝（本机为绕过 2FA 的细粒度令牌，publish 可用但 unpublish 报 403 `Granular access tokens that bypass two-factor authentication may not perform this action`），撤回须用户本人带 2FA 手动 `npm unpublish`。
- 若用户要求恢复 npm 发布，须取得用户**当次、明确的单独确认**，绝不可从「某次单独允许发布」推断为恢复长期暂停。

## uview-plus说明

uview-plus一般是指的同一个父目录下的uview-plus文件夹项目， 文档一般也在同一父目录下。
