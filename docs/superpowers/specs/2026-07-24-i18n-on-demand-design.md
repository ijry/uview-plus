# i18n 语言包按需加载设计

## 背景

GitHub issue [#908](https://github.com/ijry/uview-plus/issues/908) 反馈：i18n 相关代码约 30KB，主包体积紧张，希望可屏蔽或裁剪。

当前实现（`src/uni_modules/uview-plus/libs/i18n/index.js`）：

- 顶部静态 import 多语言 JSON：`zh-Hans` / `zh-Hant` / `en` / `es` / `fr` / `de` / `ko` / `ja` / `ru`
- 主入口 `index.js` 直接 `import i18n, { t }`
- 大量组件默认文案依赖 `t()`（calendar、picker、empty、loadmore 等）

结果：只要引入 uview-plus / 任意使用 `t()` 的组件，整包语言资源都会进入依赖图，无法按语言裁剪。

issue 历史回复为「暂无法动态化控制」。本次将其改为可按需注册的正式能力。

参考：`D:\Repos\xyito\open\uview-plus4\uni_modules\uview-ultra\libs\i18n` 已将语言包改为 `locales/*.js` 格式。uview-plus 对齐「JS 语言包」形态，但**不**照搬 ultra 的 key 变换（`up_common_*` + `replaceAll('.', '_')`），以免破坏现有 `up.common.cancel` 等组件 key。

## 目标

1. 默认只内置 `zh-Hans`，显著降低主包 i18n 体积
2. 其他语言通过显式 `registerLocale` 按需注册
3. 语言包改为 JS 模块，并从包入口统一导出，业务侧无需手写 locales 文件路径
4. 兼容全平台：微信/支付宝/抖音/QQ/H5/APP/NVUE/鸿蒙，不依赖动态 `import()`
5. 文档与 changelog 明确标注重大变更与迁移方式

## 非目标

- 不引入 `vue-i18n` 作为内置依赖（业务侧 vue-i18n 与组件内置 `t()` 继续独立）
- 不做运行时网络拉取语言包
- 不改组件文案 key（保持 `up.common.*` 点分 key）
- 不强制同步改造 `uview-ultra`（可另开任务）
- 不保证未注册语言时仍显示对应外语（未注册回退中文）

## 方案选择

| 方案 | 说明 | 结论 |
| --- | --- | --- |
| A 显式 `registerLocale` + 默认仅 `zh-Hans` | 静态依赖，全平台稳，体积收益最大 | **采用** |
| B 切换语言时动态 `import` | H5 友好，小程序/部分 APP 异步 chunk 不稳定 | 否 |
| C 默认全量 + 可选裁剪入口 | 兼容最好，但 #908 主包问题仍在 | 否 |

默认语言策略：仅 `zh-Hans`（用户已确认）。

语言包形态：`json` → `js`（`export default { ... }`），并从入口导出命名语言包模块，避免业务写深层路径，也减少 npm / HBuilder 文档分叉。

## 架构

### 文件结构

```text
libs/i18n/
  index.js              # t / registerLocale / getLocale / setLocale / hasLocale；默认仅内置 zh-Hans
  locale-packs.js       # 可选语言命名导出（en/ja/.../all），不与 t 同文件静态耦合
  locales/
    zh-Hans.js
    zh-Hant.js
    en.js
    es.js
    fr.js
    de.js
    ko.js
    ja.js
    ru.js
    th.js
    all.js              # 聚合全部可选语言，便于一键恢复旧行为
```

删除旧 `locales/*.json`，避免双份资源。

### 依赖边界（关键）

- 组件继续：`import { t } from '../../libs/i18n'`
- `libs/i18n/index.js` **不得** 静态 import 非中文语言包，也不得 re-export `en/ja/...`
- 可选语言只允许出现在：
  - `libs/i18n/locale-packs.js`
  - 业务侧显式 import 后 `registerLocale`
  - 主入口对 `locale-packs` 的 re-export（业务从包根引入时使用）

原因：组件广泛依赖 `libs/i18n` 的 `t`。若可选语言与 `t` 同文件静态耦合，多数小程序打包仍会把全语言打进主包，#908 目标落空。

### 主入口导出

`src/uni_modules/uview-plus/index.js`：

```js
export { t, i18n, registerLocale, hasLocale, getLocale, setLocale } from './libs/i18n/index.js'
export {
  en,
  es,
  fr,
  de,
  ko,
  ja,
  ru,
  th,
  zhHans,
  zhHant,
  all as allLocales
} from './libs/i18n/locale-packs.js'
```

业务统一写法（npm / HBuilder 只差包导入前缀，与其他 API 一致）：

```js
import { registerLocale, en, ja } from 'uview-plus'
// 或
// import { registerLocale, en, ja } from '@/uni_modules/uview-plus'

registerLocale('en', en)
registerLocale('ja', ja)
```

全量恢复：

```js
import { registerLocale, allLocales } from 'uview-plus'
registerLocale(allLocales)
```

## API

### `t(value, params = {})`

保持现有语义：

1. 读 `settings.lang`（初始 `uni.getLocale()`，监听 `uni.onLocaleChange` 更新）
2. 若当前语言未注册，回退 `zh-Hans`
3. 取 `settings.locales[lang][value]`，不存在则返回 `value`
4. 支持 `{name}` 参数替换

不引入 ultra 的 `.` → `_` key 变换。

### `registerLocale(locale, messages?)`

两种调用：

```js
registerLocale('en', enMessages)
registerLocale({
  en: enMessages,
  ja: jaMessages,
  'zh-Hant': zhHantMessages
})
```

行为：

- 合并/覆盖到 `settings.locales`
- 同步、纯对象写入，无异步
- 非法参数忽略或 no-op（实现时保持健壮，不抛致命错误阻断应用启动）

### `hasLocale(locale)`

返回该语言是否已注册。

### `getLocale()`

返回当前内部 `settings.lang`。

### `setLocale(locale)`

1. 更新内部 `settings.lang`
2. 若存在 `uni.setLocale`，同步调用，便于与系统/其他 i18n 一致

说明：仅 `setLocale/uni.setLocale` 不会自动加载语言包；目标语言必须先 `registerLocale`。

### 默认内置

```js
settings.locales = {
  'zh-Hans': zhHans
}
```

`th` 历史未进 settings，本次纳入 `locale-packs` / `all`，但默认不内置。

## 语言包 JS 格式

对齐 ultra 的模块形态，保留 uview-plus 点分 key：

```js
// locales/en.js
export default {
  'up.common.cancel': 'Cancel',
  'up.common.confirm': 'Confirm'
  // ...
}
```

`locales/all.js` 聚合可选语言（是否包含已默认内置的 `zh-Hans` 由实现选择；注册时覆盖同名语言是安全的）。推荐导出完整 map，便于「一键旧行为」：

```js
import zhHans from './zh-Hans.js'
import zhHant from './zh-Hant.js'
import en from './en.js'
// ...
export default {
  'zh-Hans': zhHans,
  'zh-Hant': zhHant,
  en,
  // ...
}
```

## 兼容与迁移

| 场景 | 结果 |
| --- | --- |
| 纯中文项目 | 零改动，主包自动变小 |
| 已 `uni.setLocale('en')` 但未注册 `en` | 组件文案回退 `zh-Hans`（**行为变化**） |
| 需要英文等 | 启动时 `registerLocale('en', en)` |
| 需要完整旧行为 | `registerLocale(allLocales)` |
| 组件内 `t('up.xxx')` | 无需修改 |
| 业务自建 vue-i18n | 不受影响，继续独立 |

这是 **重大变更（breaking change）**，必须在文档与 changelog 显著标注。

## 文档

更新 `uview-plus-doc/docs/guide/i18n.md`：

1. 置顶重大变更提示（`::: warning`）
   - 默认仅内置简体中文
   - 使用其他语言必须先 `registerLocale`
   - 仅 `uni.setLocale('en')` 不够
2. 按需注册示例：统一从包入口引入 `registerLocale` + 语言模块
3. 全量恢复示例：`allLocales`
4. 说明与 vue-i18n 的关系：业务文案可继续 vue-i18n；组件内置文案走 uview-plus `t()`
5. 不再要求业务手写 `libs/i18n/locales/xx.json` 深层路径；npm / HBuilder 仅保留包导入前缀差异（与现有 JS API 文档一致）

可选：在 quickstart / 体积优化相关文档增加一句交叉链接（非必须）。

## Changelog

`src/uni_modules/uview-plus/changelog.md` 使用重大变更语气，例如：

```md
## x.x.x
feat!: i18n 语言包改为按需注册，默认仅内置 zh-Hans（#908）

- 重大变更：不再默认打包 en/es/fr/de/ko/ja/ru/zh-Hant 等语言包，主包体积可明显下降
- 语言包由 json 调整为 js 模块，并从包入口导出 en/ja/.../allLocales，业务无需手写深层路径
- 迁移：非中文项目需在应用启动时 registerLocale 注册所需语言；可用 allLocales 一键恢复旧行为
- 兼容：t()、uni.getLocale/onLocaleChange 用法不变；未注册语言回退 zh-Hans
- 文档：i18n 指南补充按需注册与重大变更说明
```

同步在文档站重大更新页 `uview-plus-doc/docs/components/changelog.md` 增加同级摘要，升级用户可优先看到。

## 实现要点

1. 将现有 json 内容迁移为 `export default { ... }` 的 js 文件（key 保持点分格式）
2. 重写 `libs/i18n/index.js`：默认仅 `zh-Hans` + 注册/查询/设置 API + 原 `t`
3. 新增 `locale-packs.js`、`locales/all.js`
4. 主入口导出 API 与语言包命名导出
5. 如有类型声明，补充 `registerLocale` 等导出（若仓库已有对应 d.ts）
6. 更新文档与双 changelog
7. 增加静态/行为验证脚本（风格对齐 `scripts/verify-props-lazy-loading.mjs`）

## 验证

### 静态

- `libs/i18n/index.js` 不静态 import 非 `zh-Hans` 语言文件
- 不存在 `libs/i18n/locales/*.json`
- 存在 `locales/*.js` 与 `locale-packs.js`
- 主入口可导出 `registerLocale`、`en`、`allLocales` 等

### 行为

- 默认 `t('up.common.cancel')` 在中文下正确
- 未注册 `en` 时，即使 lang 为 `en` 也回退中文
- `registerLocale('en', en)` 后英文 key 生效
- 批量 `registerLocale({ en, ja })` 生效
- `registerLocale(allLocales)` 恢复多语言
- `uni.onLocaleChange` 仍更新内部 lang

### 文档 / 日志

- i18n 指南含重大变更与按需示例
- 插件 changelog 与文档站重大更新均写明 breaking 与迁移

## 风险

1. **已上线多语言项目未改代码会回退中文**  
   缓解：changelog / 文档 warning / 提供 `allLocales` 一行恢复。

2. **主入口 re-export 语言包导致误打全量**  
   仅当业务 `import { en } from 'uview-plus'` 时带入对应模块；不 import 则不应进入包。验证脚本需覆盖「只 import t 时不出现 en 文案」的静态约束（至少保证 i18n/index 不依赖 en）。

3. **部分构建对 JSON 与 JS 默认导出处理差异**  
   统一 JS 后路径更稳，但需确认 easycom/小程序构建能解析 `export default` 语言模块。

## 决策记录

- 默认语言：仅 `zh-Hans`
- 接入方式：显式 `registerLocale`
- 语言包格式：JS（参考 ultra，保留点分 key）
- 暴露方式：包入口导出语言模块，业务不写深层路径
- 全平台：禁止动态 import 懒加载方案
