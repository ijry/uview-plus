# Swipe Action Scrolling Model 设计

## 背景

`up-swipe-action-item` 当前在横向滑动判定后会尝试调用 `preventDefault()` 和 `stopPropagation()` 阻止页面滚动，但组件没有把“正在横向滑动，需要外部容器暂停滚动”的状态暴露出去。业务在 `scroll-view`、复杂容器或需要 `page-meta` 锁页面滚动时，只能自行包一层触摸逻辑，容易和组件内部手势逻辑重复。

## 目标

- 为 `up-swipe-action-item` 增加 `scrolling` 双向状态，支持 `v-model:scrolling`。
- 同步提供 `scrolling` 事件，便于不使用 `v-model` 的项目监听状态变化。
- `scrolling = true` 仅表示当前手指横向滑动过程中建议外部禁用滚动；`touchend`、`touchcancel`、关闭或禁用时恢复 `false`。
- 保持默认行为不变，未绑定 `scrolling` 的业务不受影响。
- 覆盖 WXS 分支、非 WXS 小程序分支和 APP-NVUE 分支的状态通知。
- 同步 TypeScript 类型和示例用法。

## 非目标

- 不让组件内部直接操作父级 `scroll-view` 的 `scroll-y`。
- 不让菜单打开态长期锁定页面或容器滚动。
- 不改动现有滑动阈值、打开/关闭判定和按钮布局。
- 不发布新版本。

## 方案

在 `u-swipe-action-item` 上新增 `scrolling` Boolean prop，默认 `false`，并新增 `update:scrolling` 与 `scrolling` emit。组件内部新增统一方法 `setScrolling(value)`，只有状态变化时才触发事件，避免重复通知。

各平台触摸逻辑在确认横向滑动后调用 `setScrolling(true)`：

- WXS 分支通过 `ownerInstance.callMethod('setScrolling', true)` 通知组件实例。
- `other.js` 分支直接调用 `this.setScrolling(true)`。
- APP-NVUE 分支在 `onTouchstart` 进入 BindingX 横向 pan 前调用 `this.setScrolling(true)`。

释放逻辑在 `touchend`、`touchcancel`、`closeHandler`、禁用或组件卸载时调用 `setScrolling(false)`。模板为支持 `touchcancel` 补齐事件绑定。

## 使用方式

```vue
<page-meta :page-style="swipeScrolling ? 'overflow:hidden;' : ''" />

<scroll-view scroll-y :scroll-y="!swipeScrolling">
  <up-swipe-action>
    <up-swipe-action-item v-model:scrolling="swipeScrolling">
      ...
    </up-swipe-action-item>
  </up-swipe-action>
</scroll-view>
```

也可以只监听事件：

```vue
<up-swipe-action-item @scrolling="swipeScrolling = $event">
  ...
</up-swipe-action-item>
```

## 验证

新增轻量静态校验脚本，检查：

- props 中存在 `scrolling`。
- emits 中存在 `update:scrolling` 与 `scrolling`。
- WXS、other、nvue 分支都包含开启和释放滚动锁通知。
- 模板绑定了 `touchcancel`。
- TypeScript 类型包含 `scrolling`、`onUpdate:scrolling` 和 `onScrolling`。
- 示例页包含 `v-model:scrolling` 用法。
