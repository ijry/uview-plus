# upGetRect 公共方法设计

## 目标

在 uview-plus 公共函数中新增 `upGetRect(selector, all = false, comp = null)`，使组合式 API 用户可以通过命名导入或 `uni.$u.upGetRect` 查询组件节点，无需依赖 `this.$uGetRect` 或由组件生命周期动态绑定的 `uni.$u.getRect`。

## 范围

- 新增公共 `upGetRect` 函数及默认函数集合导出。
- 让现有 `$uGetRect` 委托公共函数，保留旧调用方式和 `uni.$u.getRect`。
- 保留 uview-plus 现有的多节点语义：`all=true` 返回完整节点数组。
- 支持普通 uni-app 平台和 APP-NVUE。
- 补充 TypeScript 声明、组合式 API 文档示例和针对性验证脚本。

本次不进行版本 bump、发布、Git 提交，也不改造现有组件调用点。

## API 契约

```ts
upGetRect(
  selector: string,
  all?: boolean,
  comp?: ComponentPublicInstance | ComponentInternalInstance | null
): Promise<UniNamespace.NodeInfo | UniNamespace.NodeInfo[]>
```

- `selector`：传给节点查询 API 的选择器；APP-NVUE 下按现有规则将首字符去除后作为 `ref` 名称。
- `all=false`：查询单个节点并返回 `UniNamespace.NodeInfo`。
- `all=true`：查询全部匹配节点并返回 `UniNamespace.NodeInfo[]`，不采用 uview-plus4 当前只返回首项的行为。
- `comp`：可选的节点查询作用域。组合式 API 用户可传入 `getCurrentInstance()?.proxy`；普通端未传时不调用 `.in()`，直接在当前页面中按 `selector` 查询。APP-NVUE 依赖组件 `$refs`，未传时返回空结果。
- 单节点未命中时返回各尺寸字段为 `0` 的空节点对象；多节点未命中时返回空数组，避免 Promise 悬空。

## 实现结构

公共实现放在 `src/uni_modules/uview-plus/libs/function/index.js`：

1. 导出命名函数 `upGetRect`。
2. 将函数加入文件末尾的默认导出对象，使安装后的 `uni.$u` 包含 `upGetRect`。
3. 普通平台通过 `uni.createSelectorQuery()` 创建查询；仅在传入 `comp` 时调用 `.in(comp)`，再根据 `all` 选择 `select` 或 `selectAll`。
4. APP-NVUE 延续 `sleep(30)`、`comp.$refs` 和原生 `dom.getComponentRect` 查询方式；`all=true` 时将目标 ref 归一化为数组并逐个查询，返回完整结果数组。

`src/uni_modules/uview-plus/libs/mixin/mixin.js` 保留 `$uGetRect(selector, all)`，但改为调用 `upGetRect(selector, all, this)`。`upBindGetRect` 继续提供 `uni.$u.getRect` 兼容入口，因此现有 Options API 用户无需迁移。

包根入口已使用公共函数的命名导出和默认对象，无需新增第二套导出桥接逻辑。

## 类型与文档

- 在 `types/func.d.ts` 为 `Func` 增加 `upGetRect` 重载：`all=true` 返回数组，默认或 `false` 返回单节点。
- 在 `types/index.d.ts` 增加根路径命名导出声明。
- 在同级文档项目的 `docs/js/getRect.md` 增加组合式 API 示例，展示 `getCurrentInstance`、`proxy` 和 `upGetRect` 的用法，同时保留现有 Options API 示例。

## 错误与兼容性

- 查询失败不新增 reject 契约，继续以可用的空结果 resolve，保持调用方只需处理查询结果。
- APP-NVUE 在组件实例、`$refs`、目标 ref 或原生 dom 插件不可用时返回空结果，不继续调用无效引用。
- 旧 `$uGetRect` 与 `uni.$u.getRect` 的参数和成功结果保持兼容；唯一可观察改善是未命中节点时 Promise 会正常结束。

## 验证

新增一个 Node 验证脚本并挂入根 `package.json`：

- 验证单节点使用 `select`，多节点使用 `selectAll`。
- 验证查询调用 `.in(comp)` 且作用域实例未丢失。
- 验证 `all=true` 返回完整数组，空查询返回稳定空结果。
- 验证公共函数默认导出、根路径命名导出和 mixin 委托关系。
- 验证 TypeScript 声明和文档示例已包含新 API。

最后运行新增验证脚本，并执行与公共入口相关的现有轻量验证；不触发发布流程。
