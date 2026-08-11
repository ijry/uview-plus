# 瀑布流直挂数据回归验证实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 `u-waterfall` 增加“组件首次挂载即带有数据”场景的回归验证，覆盖 Issue #1050 描述的代数初始值语义。

**Architecture:** 不修改 `u-waterfall` 运行时代码。扩展现有 `scripts/verify-waterfall-distribution.mjs` 的源码加载和组件实例模拟逻辑，直接调用 `copyFlowList` 的 `immediate` watcher，验证初始代数为 `0` 时所有数据均能进入列分配流程。

**Tech Stack:** Node.js、`node:assert/strict`、现有 `npm run verify:waterfall-distribution` 脚本。

## Global Constraints

- 仅修改回归验证脚本；不扩大到 `$uGetRect` 超时处理。
- 保持现有串行队列、分配代数和列高测量实现不变。
- 不改动用户工作区已有的未跟踪 `.claude/` 文件。

---

### Task 1: 增加直挂数据回归用例

**Files:**
- Modify: `scripts/verify-waterfall-distribution.mjs`

**Interfaces:**
- Consumes: `loadWaterfallOptions`, `createWaterfallInstance`, `options.watch.copyFlowList.handler`
- Produces: 对首次 watcher 调用的分配结果断言

- [ ] **Step 1: 添加初始代数语义断言**

在现有并发/清空回归用例附近增加测试，创建默认实例并确认：

```js
assert.equal(
    instance.distributionGeneration,
    0,
    'a newly mounted waterfall should start at generation 0'
)
```

- [ ] **Step 2: 模拟 `v-if` 带数据直挂**

使用 15 条预先存在的数据调用 immediate watcher 的 handler，传入 `undefined` 旧值：

```js
const initialList = Array.from({ length: 15 }, (_, index) => ({
    id: `item-${index}`
}))
options.watch.copyFlowList.handler.call(instance, initialList, undefined)
await instance.distributionPromise
```

保持 `addTime: 0` 和现有 `$uGetRect` 模拟，避免测试依赖真实计时或 DOM。

- [ ] **Step 3: 断言数据完整分配**

验证两列各有数据，且所有输入 id 恰好出现一次：

```js
const distributedItems = instance.columnList.flat()
assert.equal(distributedItems.length, initialList.length)
assert.deepEqual(
    distributedItems.map(item => item.id).sort(),
    initialList.map(item => item.id).sort(),
    'data present during initial mount should be distributed without being dropped'
)
```

- [ ] **Step 4: 运行专项验证**

Run: `npm run verify:waterfall-distribution`

Expected: 输出 `waterfall distribution assertions passed` 并以退出码 `0` 结束。

- [ ] **Step 5: 检查变更范围**

Run: `git diff --check; git status --short`

Expected: 仅出现 `scripts/verify-waterfall-distribution.mjs` 的计划内修改，以及本来就存在的未跟踪 `.claude/`；无空白错误。
