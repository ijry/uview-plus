# u-calendar 透传常用 u-popup 属性设计

## 背景

GitHub issue #1029 反馈：`u-calendar` 内部使用 `u-popup` 承载弹层，但没有暴露 `u-popup` 的常用配置。典型问题是 `pageInline` 页面内插入模式下，使用者不一定需要底部安全区占位，却无法传入 `safeAreaInsetBottom=false`。

当前 `u-calendar` 已显式透传 `round`、`pageInline`、`closeOnClickOverlay`，但未透传 `safeAreaInsetBottom` 等属性。`u-popup` 默认 `safeAreaInsetBottom=true`，因此 `u-calendar pageInline` 也会继承底部安全区占位。

## 目标

为 `u-calendar` 增加一组显式的常用 `u-popup` 配置，并透传给日历主弹层，解决页面内插入模式下无法关闭底部安全区的问题，同时保持现有用法默认行为不变。

## 范围

新增并透传以下 `u-calendar` props：

- `overlay`
- `duration`
- `overlayStyle`
- `overlayOpacity`
- `zIndex`
- `safeAreaInsetBottom`
- `safeAreaInsetTop`
- `bgColor`

继续保留既有透传：

- `round`
- `closeOnClickOverlay`
- `pageInline`

不新增 `popupProps` 对象透传。原因是对象透传在小程序、nvue、类型声明和默认值覆盖上更容易出现平台差异，且会弱化 `u-calendar` 的公开 API 边界。

不透传 `mode`。`u-calendar` 已有 `mode` 表示日期选择模式，继续固定内部 `u-popup` 为 `bottom`，避免命名冲突和行为歧义。

不开放 `closeable`。`u-calendar` 当前通过 `:closeable="!pageInline"` 保证页面内模式不显示关闭按钮，这个约束应保持不变。

## API 设计

`u-calendar` 新增 props 的默认值对齐 `u-popup` 当前默认值：

- `overlay`: `true`
- `duration`: `300`
- `overlayStyle`: `{}`
- `overlayOpacity`: `0.5`
- `zIndex`: `10075`
- `safeAreaInsetBottom`: `true`
- `safeAreaInsetTop`: `false`
- `bgColor`: `''`

示例：

```vue
<up-calendar
  :show="true"
  pageInline
  :safeAreaInsetBottom="false"
/>
```

## 实现方案

在 `src/uni_modules/uview-plus/components/u-calendar/calendar.js` 中补充默认配置。

在 `src/uni_modules/uview-plus/components/u-calendar/props.js` 中补充 props 声明，类型与 `u-popup` 对齐。

在 `src/uni_modules/uview-plus/components/u-calendar/u-calendar.vue` 的主 `u-popup` 上透传新增属性。只影响包裹日历内容的主弹层，不影响内部时间选择器弹层。

在 `src/uni_modules/uview-plus/types/comps/calendar.d.ts` 中补充类型声明与注释。

## 兼容性

所有新增 props 默认值与 `u-popup` 一致，未传参时现有弹层、遮罩、层级、安全区和背景行为保持不变。

`pageInline` 模式默认仍保留 `u-popup` 的底部安全区行为。需要取消时由用户显式传入 `:safeAreaInsetBottom="false"`。

## 验证

新增静态校验脚本，检查以下内容：

- `u-calendar` 默认配置包含新增 popup props。
- `u-calendar` props 声明类型与默认值引用完整。
- `u-calendar.vue` 主 `u-popup` 已绑定新增属性。
- `calendar.d.ts` 暴露新增类型。

同时运行项目现有类型检查，验证 TypeScript 声明没有语法回退。
