# 安装与接入

## 两种装法

### npm（vue-cli / 命令行工程）

```bash
npm install uview-plus
# 升级
npm update uview-plus
```

注意：项目路径与项目名不要带中文；用 pnpm 时 `vue-i18n` 可能报 `@intlify/message-compiler` 相关错误，改用 npm 或锁 `vue-i18n@9.1.9`。

引用前缀是 `uview-plus`，例如 `uview-plus/index.scss`。

### HBuilderX（uni_modules）

在 uni-app 插件市场选 `uni_modules 版本` → `使用 HBuilderX 导入插件`，包会落到项目里的 `uni_modules/uview-plus`（CLI 工程是 `src/uni_modules/uview-plus`），后续可在 HBuilderX 里一键升级。

引用前缀改成 `@/uni_modules/uview-plus`，例如 `@/uni_modules/uview-plus/index.scss`。下文示例都用 npm 前缀，uni_modules 工程按此替换即可。

包内已内置 dayjs（`components/u-datetime-picker/dayjs.esm.min.js`），无需额外安装。

## 接入步骤

### 1. main.js 注册

```js
import uviewPlus from 'uview-plus'

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(uviewPlus)
	return { app }
}
// #endif
```

需要全局配置时，第二个参数传一个返回配置对象的函数：

```js
app.use(uviewPlus, () => {
	return {
		// 可选：拿到内置 http 实例挂拦截器
		httpIns: initRequest,
		options: {
			config: {
				unit: 'rpx', // 组件数值型尺寸的默认单位，默认 px
				interceptor: {
					navbarLeftClick: () => {}
				},
				customIcon: { family: 'xyicon', url: 'https://.../font.ttf' },
				customIcons: { 'light-mode': '\ue66c' } // 值是字体里的 unicode
			},
			color: { 'up-primary': '#2979ff' },
			// 改组件属性的默认值，等价于 uni.$u.props.alert.type = 'error'
			props: { alert: { type: 'error' } }
		}
	}
})
```

运行时也可以改：`import { setConfig } from 'uview-plus'`。

### 2. pages.json 配 easycom

三条规则都指向同一份 `components/u-*`，缺哪条就用不了对应前缀。规则**必须**写在 `custom` 里，且整个 `pages.json` 只能有一个 `easycom` 字段：

```json
{
	"easycom": {
		"autoscan": true,
		"custom": {
			"^u--(.*)": "uview-plus/components/u-$1/u-$1.vue",
			"^up-(.*)": "uview-plus/components/u-$1/u-$1.vue",
			"^u-([^-].*)": "uview-plus/components/u-$1/u-$1.vue"
		}
	}
}
```

uni_modules 工程把值换成 `@/uni_modules/uview-plus/components/u-$1/u-$1.vue`。

**改完 easycom 必须重启项目/重新编译**，uni-app 不会热更新这份规则。改完没重启是"组件不渲染"最常见的原因。

### 3. App.vue 引入基础样式

```vue
<style lang="scss">
	/* 必须在 style 的第一行，且 style 标签要有 lang="scss" */
	@import "uview-plus/index.scss";
</style>
```

### 4. uni.scss 引入主题变量

```scss
@import "uview-plus/theme.scss";
```

`uni.scss` 是 uni-app 的特殊文件（会被注入每个组件），**只能**放 `theme.scss`。把 `index.scss` 之类的样式塞进 `uni.scss` 会让打包体积暴涨。

## 平台与工程配置

### 小程序

`manifest.json` 里给微信、头条小程序加上 `mergeVirtualHostAttributes`，否则组件根节点上的 class/style 不生效：

```json
"mp-weixin": { "mergeVirtualHostAttributes": true },
"mp-toutiao": { "mergeVirtualHostAttributes": true }
```

### nvue 页面必须启用 Root

项目里只要有 `.nvue` 页面，就要在 `vite.config.ts` 启用 `UniUpRoot`，并保留 `App.up.vue` 里的 `<UpRootView />`：

```js
import UniUpRoot from 'uview-plus/libs/root/index.js'

export default defineConfig({
	plugins: [UniUpRoot({ rootFileName: 'App.up' }), uni()]
})
```

没启用时 nvue 页面拿不到主题能力，典型报错是 `TypeError: this.upThemeVar is not a function` 或 `Property "upThemePageStyle" was accessed during render but is not defined on instance`。

### sass 版本

sass 1.8.0 以上会对 `@import` 报废弃警告，官方建议锁版本：

```json
"sass": "1.63.2",
"sass-loader": "10.4.1"
```

顺带在 `vite.config.ts` 里静音其余废弃警告：

```js
css: {
	preprocessorOptions: {
		scss: { silenceDeprecations: ['legacy-js-api', 'color-functions', 'import'] }
	}
}
```

### TypeScript

`tsconfig.json` 的 `types` 里加 `uview-plus/types`，组件与 `uni.$u` 才有类型提示：

```json
{
	"compilerOptions": {
		"types": ["@dcloudio/types", "uview-plus/types"]
	}
}
```

## 接入自检

1. H5 开发模式下控制台有 `uview-plus V3` 的版本 banner
2. `console.log(uni.$u.config.v)` 打得出 `'3'`（这个字段只表示大版本，补丁版本看包内 `package.json`）
3. 页面里写 `<up-button type="primary" text="按钮"></up-button>`，能看到蓝色按钮样式

三条里任意一条不成立，按上面的步骤逐条回查，不要先去怀疑组件本身。
