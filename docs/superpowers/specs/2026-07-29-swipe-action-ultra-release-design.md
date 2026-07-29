# Swipe Action Ultra Release 设计

## 背景

`uview-plus` 已为 `up-swipe-action-item` 增加 `scrolling` / `v-model:scrolling` / `scrolling` 事件，用于在横向滑动时通知外部暂停页面或容器滚动。`uview-ultra` 维护在 `D:\Repos\xyito\open\uview-plus4`，同一能力需要同步到 Vue 与 UVue 实现，并在文档中说明如何配合 `page-meta` 或 `scroll-view` 禁止滚动。

发布新版本必须遵守 `D:\Repos\xyito\config\ultraUI.md`：使用发布脚本、准备 notes、先 dry-run，实际发布命令只执行一次。

## 目标

- `uview-ultra` 的 `up-swipe-action-item` 支持 `scrolling` 双向绑定和 `scrolling` 事件。
- Vue 实现覆盖 WXS、普通 JS、APP-NVUE 分支；UVue 实现覆盖 UTS 触摸逻辑。
- 横向滑动确认后置 `scrolling = true`，手势结束、取消、关闭、禁用或卸载时恢复 `false`。
- 菜单打开态不持续锁滚动。
- 文档补充页面滚动与 `scroll-view` 容器滚动的用法示例。
- 同步插件 changelog 与文档 changelog。
- 提交改动并发布 `uview-plus` 与 `uview-ultra` patch 版本。

## 非目标

- 不让组件内部直接修改父级 `scroll-view` 的 `scroll-y`。
- 不改变滑动阈值、打开/关闭判定、按钮布局或默认视觉表现。
- 不重复执行同一个版本的实际发布命令。

## 方案

`uview-ultra` 对齐 `uview-plus` 的公开 API：

- 默认配置新增 `scrolling: false`。
- props 新增 `scrolling` Boolean。
- emits 新增 `update:scrolling` 与 `scrolling`。
- 内部新增 `innerScrolling` 缓存和 `setScrolling(value)`，只在值变化时 emit。
- WXS 通过 `ownerInstance.callMethod('setScrolling', value)` 通知 Vue 实例。
- UTS / JS / nvue 分支直接调用 `setScrolling(value)`。
- 模板补充 `touchcancel`，避免系统取消触摸后外部滚动状态卡住。

文档分别更新：

- `uview-plus-doc/docs/components/swipeAction.md`
- `uview-plus-doc4/docs/components/swipeAction.md`
- 对应文档 changelog

发布 notes 使用同一说明，突出：

- `swipe-action-item` 新增 `scrolling` / `v-model:scrolling`。
- 横向滑动时可暂停页面或容器滚动。
- 手势释放后自动恢复，不影响菜单打开后的页面滚动。

## 验证

- 新增或扩展静态验证脚本，检查 `uview-ultra` Vue/UVue 的 props、emits、释放路径、类型、示例与 changelog。
- 运行 `uview-plus` 已有 `verify:swipe-action-scrolling`。
- 按 `uview-plus4/AGEMTS.md` 至少执行一次 HBuilderX CLI 编译/发布校验；如本机环境不可用，记录失败原因。
- 发布前执行发布脚本 dry-run，确认输出无误后执行实际发布。
