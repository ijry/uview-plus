# JS 工具库（uni.$u）

## 两种取用方式

```js
// 1) 全局对象，.vue 与普通 .js 文件里都能直接用，不需要 import
uni.$u.toast('保存成功')

// 2) 具名导入，按需引入
import { route, timeFormat, deepClone } from 'uview-plus'
```

`.vue` 里还有 `this.$u`（选项式 API，由 install 挂到 `globalProperties`）。

注意：**主题相关方法只在 `uni.$u` 上**（`setTheme`、`getThemeVars` 等不是包根的具名导出），需要 import 时从 `uview-plus/libs/theme/theme.js` 取。

## 路由

```js
uni.$u.route({ type: 'navigateTo', url: '/pages/index/index', params: { id: 1 } })
uni.$u.route('/pages/index/index', { id: 1 }) // 等价简写，默认 navigateTo
```

`type` 可选 `navigateTo`（默认）、`redirect`、`switchTab`、`reLaunch`、`navigateBack`；`params` 会被拼成 query。全局拦截配置见 `libs/util/route.js`。

## 请求

`uni.$u.http` 是内置 luch-request 实例（`libs/luch-request`），支持 `get/post/put/delete/upload/download`、拦截器、`baseURL` 等：

```js
uni.$u.http.get('/user/info', { params: { id: 1 } })
```

推荐在 `app.use(uviewPlus, () => ({ httpIns: initRequest }))` 的 `httpIns` 回调里统一配置拦截器，见 `references/setup.md`。

## 校验

`uni.$u.test.*` 全部返回布尔值：`mobile`、`email`、`url`、`date`、`dateISO`、`number`、`digits`、`string`、`array`、`object`、`func`、`promise`、`idCard`、`carNo`、`amount`、`chinese`、`letter`、`enOrNum`、`landline`、`contains`、`range`、`rangeLength`、`empty`、`jsonString`、`code`、`image`、`video`、`regExp`。

完整签名见 `types/func.d.ts` 的 `test` 接口。

## 常用函数

| 分类 | 函数 |
| --- | --- |
| 时间 | `timeFormat(dateTime, 'yyyy-mm-dd')`、`timeFrom(timestamp)`、`padZero`；`uni.$u.date` 是 `timeFormat` 的别名 |
| 数值 | `calc.add/sub/mul/div`（浮点安全）、`digit.plus/minus/times/divide/round`（高精度）、`priceFormat`、`range(min, max, value)`、`getPx`、`addUnit`、`rpx2px`、`getDuration` |
| 对象 | `deepClone`、`deepMerge`、`shallowMerge`、`getProperty`、`setProperty`、`getValueByPath` |
| 字符串 | `trim(str, pos)`、`queryParams(data, isPrefix, arrayFormat)`、`guid(len)` |
| 函数 | `debounce(fn, wait)`、`throttle(fn, wait)`、`sleep(ms)` |
| 环境 | `os()`、`sys()`、`getWindowInfo()`、`getDeviceInfo()`、`platform`、`page()`、`pages()` |
| 交互 | `toast(title, duration)`、`type2icon(type, fill)` |
| 颜色 | `colorGradient`、`hexToRgb`、`rgbToHex`、`colorToRgba`、`genLightColor` |
| 节点查询 | `upGetRect(selector, all, comp)`、`upCreateIntersectionObserver(comp, options)` |
| 其他 | `random(min, max)`、`randomArray(arr)`、`addStyle`、`$parent(name)`、`formValidate` |

表里的 `digit` 与 `getDeviceInfo` **不在 `uni.$u` 上**，只能具名导入（`import { digit, getDeviceInfo } from 'uview-plus'`）；其余都挂在 `uni.$u`，也都能具名导入。挂载清单以包内 `index.js` 的 `$u` 对象为准。

节点查询优先用 `upGetRect` / `upCreateIntersectionObserver` 而不是直接写 `uni.createSelectorQuery`：它们已经处理了 nvue 与组件已卸载的情况。实现在 `libs/function/index.js`，类型在 `types/func.d.ts`。

## 配置对象

- `uni.$u.config`：`v`（大版本 `'3'`）、`unit`、`iconUrl`、`customIcon`、`interceptor`、`nativeThemeSync` 等，默认值在 `libs/config/config.js`
- `uni.$u.props`：所有组件属性的默认值，可全局改
- `uni.$u.color`：`up-primary` / `up-success` / `up-error` / `up-warning` / `up-info` 等主题色
- `uni.$u.zIndex`：各类浮层的层级
- `setConfig({ config, props, color, zIndex })`：运行时改上面这些

## 主题与暗黑模式

```js
uni.$u.setTheme('dark')          // 'light' | 'dark'
uni.$u.setThemePreference('auto') // 跟随系统
uni.$u.getThemeVars()             // 当前主题的 CSS 变量表
```

3.8 起主题走 `--up-*` CSS 变量 + 运行时主题，旧的 `$u-*` scss 变量只桥接 light 主题。样式里优先用 `var(--up-primary)` 这类变量；模板里可用 `upThemeVar('--up-border-color', '#dadbde')`、`upThemeIsDark`、`upThemePageStyle`、`upThemeCardStyle`（由 install 挂在实例上，nvue 页面依赖 Root 注入）。

想让原生导航栏 / tabBar 跟随运行时主题，需要显式打开 `config.nativeThemeSync`（默认关，避免覆盖项目已有的 `pages.json` / `theme.json`）。

## 多语言

```js
import { registerLocale, setLocale, t, en, ja } from 'uview-plus'

registerLocale('ja', ja) // 按需注册语言包，不注册就不打进包
setLocale('ja')
t('up.common.confirm')
```

内置语言包：`en`、`es`、`fr`、`de`、`ko`、`ja`、`ru`、`th`、`zhHans`、`zhHant`（`allLocales` 是全量，会增大体积）。文案键形如 `up.common.confirm`，全量键看 `libs/i18n/locales/en.js`。

## 全局 toast / notify

`uni.$u.rootToast(options)`、`uni.$u.rootNotify(options)` 不需要在页面里放组件。它们依赖 Root 注入的宿主组件（见 `references/setup.md` 的 Root 一节）；没启用 Root 时会自动降级成 `uni.showToast`。

也可以用组件形式：页面里放 `<up-toast ref="toastRef"></up-toast>`，再 `toastRef.value.show({ message: '...' })`。

## 组件实例方法

组件方法要通过 `ref` 调，常用的几个：

- `up-form`：`validate()`（返回 Promise）、`validateField(props, cb)`、`resetFields()`、`clearValidate(props)`、`setRules(rules)`
- `up-toast` / `up-notify`：`show(options)`
- 其他组件的方法看对应 `u-<名字>.vue` 里 `methods` 的公开方法与 JSDoc `@method` 说明。
