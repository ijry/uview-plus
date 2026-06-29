# Props 按需加载设计

## 背景

当前每个组件的 `components/u-*/props.js` 都通过 `import defProps from '../../libs/config/props.js'` 获取默认 props。`libs/config/props.js` 又静态导入所有组件的默认配置文件并合并成一个大对象。结果是只要加载任意一个组件 props，就会把所有组件默认 props 拉入依赖图，组件默认 props 无法真正按需加载。

本设计只处理 props 默认配置的全量依赖问题。H5 入口中的 `import.meta.glob('./components/u-*/u-*.vue', { eager: true })` 全量组件注册不在本次范围内。

## 目标

- 单个组件的 `props.js` 只依赖本组件默认 props 文件，不再依赖全量 props 聚合文件。
- 保留现有 `setConfig({ props })` 全局覆盖能力。
- 保留 `uni.$u.props.xxx` 形式的运行时访问和直接赋值兼容。
- 避免一次性手工修改大量组件时引入不一致，实施时使用脚本或静态校验覆盖批量改造。

## 非目标

- 不改 H5 插件安装时的全量组件注册逻辑。
- 不改变组件对外 props 名称、默认值语义和 TypeScript 类型声明。
- 不重构主题、颜色、zIndex、config、http 等非 props 配置模块。

## 方案

### 1. 改造 props 配置模块为懒 store

`src/uni_modules/uview-plus/libs/config/props.js` 不再静态导入任何 `../../components/u-*/*` 默认 props 文件，只负责维护运行时 props store。

模块对外提供：

```js
const props = {}

export function registerComponentProps(defaultProps) {}
export function setPropsConfig(configProps) {}
export default props
```

`props` 是全局共享对象，继续作为 `setConfig`、`uni.$u.props` 和组件默认值读取的来源。模块初始化时必须预置当前已知组件 key 为 `{}`，例如 `props.button = {}`、`props.gap = {}`。这样 `uni.$u.props.gap.bgColor = '#f3f4f6'` 这类直接赋值不会因为顶层对象不存在而报错。

`setPropsConfig(configProps)` 负责合并用户全局配置。实现应复用现有 `shallowMerge` 的原地递归合并语义，避免替换 `props.xxx` 对象引用：

```js
shallowMerge(props.button, configProps.button)
```

这允许用户配置发生在组件加载之前。组件尚未注册默认值时，用户覆盖值会先存入 store。

`registerComponentProps(defaultProps)` 负责组件加载时注册默认值。合并策略必须是“默认值补空，已有用户配置优先”：

```js
const componentProps = props.button
props.button = componentProps
mergeDefaults(componentProps, defaultProps.button)
```

`mergeDefaults` 是只补缺省值的递归合并：当目标字段不存在时写入默认值；当目标字段已存在时保留目标值；当两侧都是普通对象时递归补齐子字段。不能直接用现有 `shallowMerge(componentProps, defaultProps.button)`，因为它会用默认 primitive 覆盖用户已写入的 primitive。

如果同一组件重复注册，结果应保持稳定，不覆盖用户后续通过 `setConfig` 或 `uni.$u.props` 写入的值。

### 2. 组件 props 改为本地默认值注册

每个 `components/u-xxx/props.js` 从依赖全量配置改为依赖本组件默认配置文件。例如 `u-button`：

```js
import { defineMixin } from '../../libs/vue'
import ButtonDefaultProps from './button'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps(ButtonDefaultProps)
```

后续组件内继续使用 `defProps.button.type`、`defProps.button.size` 等现有读取方式。这样组件运行时代码改动集中在 import 和 `defProps` 初始化，不需要改每个 prop 的 default 表达式。

对于默认配置文件名称和组件目录名不完全一致的组件，实施时按现有文件实际名称映射，例如 `u-back-top/backtop.js`、`u-calendar-strip/calendarStrip.js`、`u-swiper-indicator/swipterIndicator.js`。

### 3. 入口 setConfig 接入懒 store

`src/uni_modules/uview-plus/index.js` 继续导入并导出 `props`，但 `setConfig` 中 props 合并改为调用 `setPropsConfig`：

```js
import props, { setPropsConfig } from './libs/config/props.js'

export function setConfig(configs) {
  const settings = configs || {}
  index.shallowMerge(config, settings.config || {})
  setPropsConfig(settings.props || {})
  index.shallowMerge(color, settings.color || {})
  index.shallowMerge(zIndex, settings.zIndex || {})
}
```

`$u` 对象应包含 `props`，保证 `uni.$u.props` 与历史文档、示例和业务用法一致。

`libs/config/props.js` 内部原有的 `uni.upuiParams` 初始化逻辑可以保留，但 props 部分需要改为 `setPropsConfig(temp.options.props || {})`，并避免因为该模块被单个组件加载而导入全量组件默认值。

## 数据流

1. 应用启动并调用 `app.use(uviewPlus, upuiParams)`。
2. 入口读取 `upuiParams().options.props`，调用 `setPropsConfig` 写入用户覆盖。
3. 页面实际使用某个组件时，该组件的 `props.js` 被加载。
4. 组件 `props.js` 导入自己的默认配置文件，并调用 `registerComponentProps`。
5. `registerComponentProps` 将默认值和已有用户覆盖合并，返回对应的共享 `props` 对象。
6. 组件 prop default 继续从 `defProps.xxx.yyy` 读取最终值。

如果组件先加载、用户后调用 `setConfig`，`setPropsConfig` 会直接覆盖对应字段。两种顺序都应得到一致结果。

## 兼容性

- `setConfig({ props: { button: { type: 'primary' } } })` 继续生效。
- `uni.$u.props.button.type = 'primary'` 继续生效。
- 组件 prop default 仍使用函数读取共享对象，因此运行时修改默认值后，新创建的组件实例可以读取更新后的默认值。
- 已存在的组件默认 props 文件保持原结构，例如 `export default { button: { ... } }`，降低批量改造风险。

## 风险与处理

- 批量改造遗漏组件：新增静态校验脚本，扫描所有 `components/u-*/props.js`，禁止继续导入 `../../libs/config/props.js` 的默认导出，并校验是否调用 `registerComponentProps`。
- 默认配置文件命名不一致：实施脚本应基于目录内实际 `.js` 默认配置文件映射，无法自动判断时列出人工确认清单。
- 顶层组件 key 不完整：从现有全量 props 聚合导入清单或组件默认配置文件导出对象生成 key 列表，确保 `uni.$u.props.xxx` 顶层对象存在。
- 用户直接替换 `uni.$u.props.button = {}`：这是现有可变对象模型的固有风险，本次不改变行为，只保证常规字段赋值和 `setConfig` 合并兼容。

## 验证

- 静态验证：`libs/config/props.js` 不再包含 `../../components/` import。
- 静态验证：所有组件 `props.js` 不再默认导入全量 `libs/config/props.js`。
- 行为验证：先调用 `setConfig({ props: { button: { type: 'primary' } } })`，再加载 `u-button/props.js`，`defProps.button.type` 为 `primary`，其他 button 默认值仍完整。
- 行为验证：先加载 `u-button/props.js`，再调用 `setConfig({ props: { button: { type: 'success' } } })`，后续读取 `props.button.type` 为 `success`。
- 行为验证：`uni.$u.props.gap.bgColor = '#f3f4f6'` 不因 `gap` 顶层对象缺失报错。

## 实施范围

- 修改 `src/uni_modules/uview-plus/libs/config/props.js`
- 修改 `src/uni_modules/uview-plus/index.js`
- 批量修改 `src/uni_modules/uview-plus/components/u-*/props.js`
- 新增 props 按需加载静态/行为验证脚本
