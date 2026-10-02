---
name: uview-plus
description: 在 uni-app + Vue3 项目里使用 uview-plus 组件库时使用。覆盖 up-*/u-* 组件写法、easycom 接入、组件与图标清单、uni.$u 工具库、主题与暗黑模式、H5/小程序/App-nvue/鸿蒙多端差异。写页面、初次接入或升级 uview-plus、排查"组件不渲染/样式不生效/属性无效/图标空白"时都适用。
---

# uview-plus

uni-app 生态的 Vue3 组件库（fork 自 uView2）。139 个组件加一套 JS 工具库（`uni.$u`），一套代码覆盖 H5、微信/支付宝/头条/QQ 小程序、Android/iOS App（vue 与 nvue）、鸿蒙。

包的位置：npm 装法在 `node_modules/uview-plus/`，HBuilderX 装法在项目里的 `uni_modules/uview-plus/`。下文的相对路径都以这个包根目录为准，遇到不确定的用法**优先读包内源码**而不是凭印象写。

## 先确认接入完整

写页面之前先确认宿主项目这 4 处都配好了。缺任意一处的典型症状就是"组件写了不渲染""样式全丢""属性不生效"，这类问题九成不是组件 bug：

1. `pages.json` 的 `easycom.custom` 里有 uview-plus 的三条规则
2. `main.js` 里 `app.use(uviewPlus)`
3. `App.vue` **首行** `@import "uview-plus/index.scss";`，且 `<style lang="scss">`
4. `uni.scss` 里 `@import "uview-plus/theme.scss";`

新项目接入、或上面任意一条没配，读 `references/setup.md`（npm 与 uni_modules 两种装法都有，含 manifest、tsconfig、nvue 的额外要求）。

## 硬规则

1. **不要 `import` 组件**。easycom 会按规则自动引入，模板里直接写 `<up-button text="按钮"></up-button>`。手写 import 反而容易和 easycom 规则打架。
2. **前缀用 `up-`**。`u-`、`u--` 仍然兼容（三条 easycom 规则都指向同一份 `components/u-*`），但 `u-` 会和 uni-app 官方组件抢名字（例如 `u-slider`），新代码统一用 `up-`，同一项目里不要混用。
3. **组件名从 `references/components.md` 里挑**，不要凭印象拼。清单里没有的名字就是不存在，结果是编译报错或者整块不渲染。
4. **属性、事件、插槽不要猜**。一手说明在包内：
   - `components/u-<名字>/u-<名字>.vue` 顶部 JSDoc 的 `@property` / `@event`
   - `components/u-<名字>/props.js` 是属性的真实默认值（约四分之一的组件没有这个文件，属性直接写在 `.vue` 里）
   - `types/comps/<驼峰名>.d.ts` 是 TS 类型（覆盖常用组件，不是全部）
5. **图标名从 `references/icons.md` 里挑**。`<up-icon name="star-fill"></up-icon>`，名字写错**不会报错**，只是渲染空白。要用清单外的图标，走 `customIcon` 配置自己的字体图标。
6. **双向绑定分两类**，搞反了就是"弹窗打不开"或"输入框不联动"：
   - 值类组件（`up-input`、`up-checkbox-group`、`up-rate`、`up-slider`、`up-datetime-picker` …）内部是 `modelValue`，写 `v-model="xxx"`
   - 显隐类组件（`up-popup`、`up-action-sheet`、`up-modal`、`up-picker`、`up-cascader`、`up-tooltip`、`up-guide`、`up-swipe-action-item`）内部是 `show` + `update:show`，写 `v-model:show="show"`
   - 其余组件先看它的 `emits` 数组再决定，不要想当然。
7. **数值型尺寸的单位取决于 `config.unit`**（默认 `px`，项目可全局改成 `rpx`）。要确定的单位就把单位写全：`width="80px"`。
8. **组件内部尽量不要依赖宿主全局 class**。需要覆盖样式时优先用组件自身的 `customStyle` / 具体属性，小程序有样式隔离，全局类不一定命中。

## 一个可运行的样板

```vue
<template>
	<view>
		<up-navbar title="表单" :autoBack="true"></up-navbar>
		<up-form ref="formRef" :model="form" :rules="rules" labelWidth="80">
			<up-form-item label="手机号" prop="mobile" borderBottom>
				<up-input v-model="form.mobile" placeholder="请输入手机号" border="none"></up-input>
			</up-form-item>
		</up-form>
		<up-button type="primary" text="提交" @click="submit"></up-button>
		<up-popup v-model:show="show" mode="bottom">
			<view style="padding: 24px;">提交成功</view>
		</up-popup>
	</view>
</template>

<script setup>
import { reactive, ref } from 'vue'

const formRef = ref(null)
const show = ref(false)
const form = reactive({ mobile: '' })
const rules = {
	mobile: [{ required: true, message: '请输入手机号', trigger: ['blur', 'change'] }]
}

function submit() {
	formRef.value
		.validate()
		.then(() => {
			show.value = true
		})
		.catch(() => {
			uni.$u.toast('请检查表单')
		})
}
</script>
```

要点：`up-form` 的 `validate()` 返回 Promise（校验失败 reject 错误数组）；`uni.$u.*` 在 `.vue` 与普通 `.js` 里都能用，不必 import。

## 按需展开

| 需要做的事 | 读这个文件 |
| --- | --- |
| 装包、接入、easycom / scss / manifest / tsconfig / nvue Root 配置 | `references/setup.md` |
| 挑组件、查某个组件的属性事件在哪 | `references/components.md` |
| 用图标 | `references/icons.md` |
| 路由、请求、校验、时间、主题、暗黑模式、多语言等 JS 能力 | `references/api.md` |
| 组件不渲染、样式不生效、多端表现不一致、报错排查 | `references/pitfalls.md` |

包内还有一手资料：`changelog.md`（版本变更，升级排查先看它）、`types/`（TS 声明）。当前版本看包内 `package.json` 的 `version`；`uni.$u.config.v` 只返回大版本 `'3'`，不能用来判断补丁版本。

在线文档 https://uview-plus.jiangruyi.com ，与包内源码不一致时**以源码为准**。
