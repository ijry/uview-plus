# 常见坑

按"症状 → 原因"排列，遇到问题先从这里对号入座，多数不是组件 bug。

## 组件写了但没渲染 / 样式全丢

1. `pages.json` 的 easycom 规则漏了、写在 `custom` 外面，或者 `pages.json` 里有两个 `easycom` 字段
2. **改完 easycom 没重启项目**。uni-app 不热更新这份规则，改完必须重新编译
3. `App.vue` 没在 `<style lang="scss">` 首行 `@import "uview-plus/index.scss";`
4. `main.js` 漏了 `app.use(uviewPlus)`

## H5 正常，小程序 / App 空白

`install` 在 H5 端会额外用 `import.meta.glob` 把包内组件注册成全局组件（见包内 `index.js`），所以 H5 即使 easycom 没配好也能跑；小程序与 App 完全依赖 easycom。

**只要出现"H5 好的、小程序空白"，先查 easycom**，不要怀疑组件的小程序兼容性。

## 小程序上组件根节点的 class / style 不生效

`manifest.json` 里缺 `mergeVirtualHostAttributes`：

```json
"mp-weixin": { "mergeVirtualHostAttributes": true },
"mp-toutiao": { "mergeVirtualHostAttributes": true }
```

小程序自定义组件有样式隔离，宿主的全局工具类不一定能命中组件内部节点。要覆盖组件样式，优先用组件自己的属性或 `customStyle`，而不是写全局类去穿透。

## 打包体积突然暴涨

`uni.scss` 里塞了 `index.scss` 之类的样式文件。`uni.scss` 会被注入每一个组件，只能放 `theme.scss`。

## nvue 页面报 `this.upThemeVar is not a function` / 白屏

项目里有 `.nvue` 页面但没启用 Root：`vite.config.ts` 缺 `UniUpRoot` 插件，或 `App.up.vue` 里的 `<UpRootView />` 被删了。nvue 页面的主题能力依赖 Root 注入。同类报错还有 `Property "upThemePageStyle" was accessed during render but is not defined on instance`。

## 弹窗关不掉 / 打不开

分三种情况，看组件的 `emits` 决定写法：

- emit `update:show` 的（`up-popup`、`up-action-sheet`、`up-modal`、`up-picker`、`up-cascader`、`up-tooltip`、`up-guide`、`up-swipe-action-item`）：用 `v-model:show="show"`
- 只有 `show` 属性、不 emit `update:show` 的（例如 `up-calendar`、`up-datetime-picker`）：只能 `:show="show"`，再在 `@close` / `@cancel` / `@confirm` 里自己把变量置 false。给它们写 `v-model:show` 不会报错，但永远关不掉
- 值类组件（`up-input` 等）内部是 `modelValue`，写 `v-model="x"`；给它们写 `v-model:show` 无效

## 图标不显示

1. 名字不在 `references/icons.md` 里。`up-icon` 找不到名字时会把 `name` 原样当内容渲染，不报错也不提示
2. 用了自定义字体图标但没配 `customIcon.family` / `customIcon.url`
3. App 端弱网。3.8.82 起 APP / APP-NVUE 已内置本地字体，无需额外配置；H5 与小程序仍走 `config.iconUrl` 远程字体

## 尺寸忽然变小 / 变大

项目把 `config.unit` 改成了 `rpx`，所有传数值的尺寸属性（`<up-image width="80">`）都按 rpx 解析。两个补充事实：

- 组件 scss 里写死的 px 不受这个配置影响，它只作用于属性传参
- 想要确定的单位就把单位写全：`width="80px"`

## 组件名和其他插件冲突

easycom 的 `^u-([^-].*)` 规则会拦走所有 `u-` 开头的标签，优先级高于页面里显式 `import` 的同名组件，于是第三方的 `u-parse` 之类会因为在 uview-plus 里找不到而报错。解决办法是给第三方组件换个不以 `u-` 开头的名字。

新代码统一用 `up-` 前缀能避开这一类冲突，也能避开官方 SDK 占用的名字（如 `u-slider`）。

## 主题 / 暗黑模式改了没反应

- 3.8 起主题是 `--up-*` CSS 变量 + 运行时主题；老项目 `uni.scss` 里的 `$u-*` 覆盖只桥接 light，不会自动生成 dark
- 原生导航栏、页面背景、tabBar 默认**不**跟随运行时主题，需要显式打开 `config.nativeThemeSync`（默认关，避免覆盖项目已有的 `pages.json` / `theme.json`）

## 构建期报错

- `Deprecation Warning: Sass @import rules are deprecated`：把 sass 锁到 `sass@1.63.2` + `sass-loader@10.4.1`，并在 `vite.config.ts` 里加 `silenceDeprecations`
- `@intlify/message-compiler` 相关报错：pnpm 与 vue-i18n 的兼容问题，改用 npm 或锁 `vue-i18n@9.1.9`
- 项目路径或项目名含中文也会引发莫名的构建失败

## 版本判断

`uni.$u.config.v` 只返回大版本 `'3'`，判断补丁版本要看包内 `package.json` 的 `version`。升级后出现的异常，先翻包内 `changelog.md`。
