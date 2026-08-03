# Dragsort Handler And Wrapper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复微信小程序自定义拖动句柄不显示，并消除横向与网格项目右侧的额外白色区域。

**Architecture:** 继续使用现有单组件实现，通过计算属性统一跨端插槽判断；内容包装层仅保留布局职责。现有 Node 静态回归脚本负责锁定模板、交互与样式约束。

**Tech Stack:** Vue 2 Options API、uni-app、微信小程序 `movable-view`、Node.js assertions、SCSS

## Global Constraints

- 不改变 `u-dragsort` 的公开 props、插槽名称和 `drag-end` 事件结构。
- 不改变三种方向模式的排序和坐标计算。
- 不触碰工作区中的无关修改。
- 不创建 git 提交，除非用户明确要求。

---

### Task 1: 添加句柄与包装层回归约束

**Files:**
- Modify: `scripts/verify-dragsort-stable-identity.mjs`
- Modify: `src/pages/componentsD/dragsort/dragsort.vue`

**Interfaces:**
- Consumes: `u-dragsort.vue` 的模板、计算属性、触摸处理和 SCSS 文本
- Produces: 跨端句柄兼容与结构包装层样式断言

- [ ] **Step 1: 写入失败断言**

```js
assert.match(dragsortVue, /hasHandler\(\)[\s\S]*\$slots\.handler[\s\S]*\$slots\.\$handler/)
assert.match(dragsortVue, /v-if="hasHandler"/)
assert.match(dragsortVue, /if \(this\.hasHandler && e\.currentTarget\.dataset\.action !== 'handler'\)/)
assert.match(dragsortDemo, /<template\s+#handler="\{\s*item\s*,\s*index\s*\}">/)
assert.doesNotMatch(itemContentStyle, /border(?:-radius)?\s*:|background(?:-color)?\s*:/)
```

- [ ] **Step 2: 运行断言确认失败**

Run: `npm run verify:dragsort-stable-identity`

Expected: FAIL，指出缺少 `hasHandler` 或包装层仍含卡片样式。

### Task 2: 实现跨端句柄与纯结构包装层

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-dragsort/u-dragsort.vue`

**Interfaces:**
- Consumes: Vue `$slots.handler`、微信小程序 `$slots.$handler`
- Produces: `hasHandler: boolean`，供模板和 `onTouchStart` 统一使用

- [ ] **Step 1: 新增计算属性并替换判断**

```js
hasHandler() {
    return !!(this.$slots.handler || this.$slots.$handler)
}
```

模板使用 `v-if="hasHandler"`，触摸逻辑使用 `this.hasHandler`。

- [ ] **Step 2: 移除包装层视觉卡片样式**

保留 `position`、`padding`、`box-sizing`，删除 `border`、`border-radius`、`background-color`。

- [ ] **Step 3: 运行专项校验**

Run: `npm run verify:dragsort-stable-identity`

Expected: PASS，并输出 `dragsort stable identity assertions passed`。

### Task 3: 验证微信小程序编译产物

**Files:**
- Inspect: `dist/build/mp-weixin/uni_modules/uview-plus/components/u-dragsort/u-dragsort.wxml`
- Inspect: `dist/build/mp-weixin/uni_modules/uview-plus/components/u-dragsort/u-dragsort.wxss`

**Interfaces:**
- Consumes: uni-app 微信小程序构建
- Produces: 可编译的 WXML/WXSS 和跨端行为证据

- [ ] **Step 1: 构建微信小程序**

Run: `npm run build:mp-weixin`

Expected: 构建成功，无模板或样式编译错误。

- [ ] **Step 2: 检查编译结果**

确认 WXML 保留句柄条件和插槽节点，WXSS 中 `.u-dragsort-item-content` 不包含背景、边框和圆角。
