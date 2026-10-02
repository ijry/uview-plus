import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// issue #650：页面里只要出现一个 up-tabs，微信开发者工具就会刷一条
// 「<scroll-view>: 设置 enable-flex 属性以使 flexbox 布局生效」。
// 告警来自基础库对 scroll-view 的这句检查（WeappVendor/3.17.0 原文）：
//   "flex" !== window.getComputedStyle(this.$$).display || this.enableFlex ||
//       emitComponentWarning('scroll-view', '设置 enable-flex 属性以使 flexbox 布局生效')
// u-tabs 的 scroll-view 原来带着 @include flex（展开就是 display: flex）却没有 enable-flex，正好命中。
//
// 修复方式是去掉这条 display: flex，而不是补 enable-flex：
// scroll-view 的内容在微信端被基础库包在 #wrap / #main 两层 div 里（H5 端同理是
// .uni-scroll-view / .uni-scroll-view-content），宿主上的 flex 本来就管不到内容，
// 真正横向排布 tab 的是内部的 __nav；反过来补 enable-flex 会给那两层容器加上
// display: inherit，__nav 从块级变成 flex item 后按 max-content 收缩，
// :scrollable="false" 的等宽 tab 会退化成内容宽度。
//
// 本脚本守住这个不变式：模板上没有 enable-flex 时，任何平台编译出来的样式
// 都不许给 scroll-view 声明 display: flex；同时 nvue 的横向主轴和内部 __nav 的 flex 不能丢。

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')
const sfcPath = resolve(root, 'src/uni_modules/uview-plus/components/u-tabs/u-tabs.vue')
const source = read('src/uni_modules/uview-plus/components/u-tabs/u-tabs.vue')
const theme = read('src/uni_modules/uview-plus/theme.scss')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:tabs-scroll-view-flex'],
	'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-tabs-scroll-view-flex.mjs',
	'package.json should expose verify:tabs-scroll-view-flex'
)

const sass = require('sass')
const { initPreContext, preCss, preNVueCss } = require(
	resolve(root, 'node_modules/@dcloudio/uni-cli-shared/dist/preprocess/index.js')
)

// 模板上有没有 enable-flex，决定了下面允不允许出现 display: flex
const scrollViewTag = source.match(/<scroll-view[\s\S]*?>/)
assert.ok(scrollViewTag, 'the tabs template should still render a scroll-view')
const hasEnableFlex = /\benable-flex\b/.test(scrollViewTag[0])

const styleSource = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[1]).join('\n')
assert.match(styleSource, /&__scroll-view\s*\{/, 'the scoped stylesheet should still style the scroll-view')

// 取某个平台条件编译 + scss 编译之后，某条选择器上的声明
function declarationsOf(selector, platform, { nvue = false } = {}) {
	initPreContext(platform)
	const pre = nvue ? preNVueCss : preCss
	const { css } = sass.compileString(`${pre(theme, 'theme.scss')}\n${pre(styleSource, sfcPath)}`)
	const rules = []
	const rule = /([^{}]+)\{([^{}]*)\}/g
	let match
	while ((match = rule.exec(css))) rules.push([match[1].trim(), match[2]])
	const hit = rules.find(([selectors]) => selectors.split(',').some(one => one.trim() === selector))
	assert.ok(hit, `${platform}${nvue ? '(nvue)' : ''} should still style ${selector}`)
	return hit[1]
}

for (const platform of ['h5', 'mp-weixin', 'mp-alipay', 'mp-toutiao', 'app']) {
	const scrollView = declarationsOf('.u-tabs__wrapper__scroll-view', platform)
	assert.ok(
		hasEnableFlex || !/display:\s*flex/.test(scrollView),
		`${platform}: scroll-view 声明了 display: flex 却没有 enable-flex，微信端会告警（issue #650）`
	)
	// 去掉的只是宿主上不生效的那条 flex，占满剩余宽度和内部导航的横向排布都得留着
	assert.match(scrollView, /flex:\s*1/, `${platform}: scroll-view 仍要占满剩余宽度`)
	assert.match(
		declarationsOf('.u-tabs__wrapper__nav', platform),
		/display:\s*flex/,
		`${platform}: 真正横向排布 tab 的是 __nav，这条 display: flex 不能删`
	)
}

// nvue/weex 主轴默认纵向，scroll-view 上必须显式声明 row，否则 tab 会竖着排
assert.match(
	declarationsOf('.u-tabs__wrapper__scroll-view', 'app', { nvue: true }),
	/flex-direction:\s*row/,
	'app-nvue: scroll-view 需要显式的横向主轴'
)

console.log('tabs scroll-view flex assertions passed')
