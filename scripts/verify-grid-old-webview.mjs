import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// issue #670：安卓 7 的 app 上 u-grid 布局错乱，宫格一个占一行。
// u-grid 在非 nvue 端用 display:grid 排版，u-grid-item 则把自己的宽度写成 100%，
// 这个 100% 只有在父级真是 grid 容器时才等于“一列的宽度”。
// 安卓 7 自带的 WebView 是 Chromium 52/55，CSS Grid 要到 Chromium 57 才可用，
// display:grid 整条会被样式解析器丢弃，容器退回同一条规则里的 display:flex，
// 于是每个 width:100% 的宫格都独占一行。
// 兜底只能写在样式里：app 端组件的 style 是在逻辑层算出来的，那里没有 CSS 对象，
// 拿不到 CSS.supports 的结果，只有视图层的 WebView 自己知道支持不支持 grid。
// 所以 u-grid 在 @supports not (display: grid) 里显式退回 flex 并透出列数，
// u-grid-item 在同样的条件里按列数覆盖宽度。本脚本守住这套契约。

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const read = filePath => readFileSync(resolve(repoRoot, filePath), 'utf8')
const gridPath = resolve(repoRoot, 'src/uni_modules/uview-plus/components/u-grid/u-grid.vue')
const itemPath = resolve(repoRoot, 'src/uni_modules/uview-plus/components/u-grid-item/u-grid-item.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:grid-old-webview'],
	'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-grid-old-webview.mjs',
	'package.json should expose verify:grid-old-webview'
)

const { parse, compileStyleAsync } = require('@vue/compiler-sfc')
const { initPreContext, preJs, preCss, preNVueJs, preNVueCss } = require(
	resolve(repoRoot, 'node_modules/@dcloudio/uni-cli-shared/dist/preprocess/index.js')
)

const gridSfc = parse(read('src/uni_modules/uview-plus/components/u-grid/u-grid.vue'), { filename: gridPath })
const itemSfc = parse(read('src/uni_modules/uview-plus/components/u-grid-item/u-grid-item.vue'), { filename: itemPath })
assert.deepEqual(gridSfc.errors, [], 'u-grid.vue should parse cleanly')
assert.deepEqual(itemSfc.errors, [], 'u-grid-item.vue should parse cleanly')
const styleSource = sfc => sfc.descriptor.styles.map(style => style.content).join('\n')

// 组件样式跑一遍真实的 sass + scoped + v-bind 改写，断言的是最终下发的 CSS 而不是源码文本。
// flex mixin 和 $u-border-color 平时由宿主工程的全局 scss 提供，这里给等价的占位定义让样式能独立编译。
const scssPrelude = [
	'@mixin flex($direction: row) { display: flex; flex-direction: $direction; }',
	'$u-border-color: #dadbde;'
].join('\n')
async function compiled(source, filename) {
	const result = await compileStyleAsync({
		source: `${scssPrelude}\n${source}`,
		filename,
		id: 'data-v-test',
		scoped: true,
		preprocessLang: 'scss',
		preprocessOptions: { silenceDeprecations: ['legacy-js-api', 'color-functions', 'import'] }
	})
	assert.deepEqual(result.errors, [], `${filename} styles should compile`)
	return result.code
}
const supportsBlock = css => {
	const match = css.match(/@supports\s+not\s*\(display:\s*grid\)\s*\{([\s\S]*?)\n\}/)
	return match && match[1]
}

// --- webview 类平台：grid 照常用，同时带上 grid 不可用时的兜底
for (const platform of ['h5', 'app']) {
	initPreContext(platform)
	const gridCss = await compiled(preCss(styleSource(gridSfc), gridPath), gridPath)
	const itemCss = await compiled(preCss(styleSource(itemSfc), itemPath), itemPath)

	assert.match(gridCss, /display:\s*grid\s*!important/, `${platform} should still lay the grid out with display:grid`)

	const gridFallback = supportsBlock(gridCss)
	assert.ok(gridFallback, `${platform} needs a @supports fallback for webviews without CSS Grid (Chromium < 57)`)
	assert.match(gridFallback, /display:\s*flex\s*!important/, `${platform} must fall back to a wrapping flex row`)
	// 列数得透出给子组件，且必须取自 col 属性（v-bind 编译出来的 CSS 变量）
	const exposedCol = gridFallback.match(/--up-grid-col:\s*var\(--test-col\)/)
	assert.ok(exposedCol, `${platform} must expose the column count to u-grid-item as --up-grid-col`)

	const itemFallback = supportsBlock(itemCss)
	assert.ok(itemFallback, `${platform} u-grid-item needs the matching @supports fallback`)
	// 内联的 width:100% 只能靠 !important 压住；宽度按父级透出的列数分
	assert.match(
		itemFallback,
		/width:\s*calc\(100%\s*\/\s*var\(--up-grid-col,\s*1\)\)\s*!important/,
		`${platform} u-grid-item must size itself by the column count when CSS Grid is missing`
	)
}

// 小程序端：样式编译器未必认 @supports，而小程序渲染层内核较新，不需要兜底
initPreContext('mp-weixin')
{
	const gridCss = await compiled(preCss(styleSource(gridSfc), gridPath), gridPath)
	const itemCss = await compiled(preCss(styleSource(itemSfc), itemPath), itemPath)
	assert.match(gridCss, /display:\s*grid\s*!important/, 'mp should still use display:grid')
	assert.doesNotMatch(gridCss, /@supports/, 'the @supports fallback is not shipped to mini programs')
	assert.doesNotMatch(itemCss, /@supports/, 'the @supports fallback is not shipped to mini programs')
}

// nvue 走 weex 自己的 flex 布局，既没有 grid 也不认 @supports
initPreContext('app')
{
	const gridCss = preNVueCss(styleSource(gridSfc), gridPath).replace(/\/\/[^\n]*/g, '')
	const itemCss = preNVueCss(styleSource(itemSfc), itemPath).replace(/\/\/[^\n]*/g, '')
	assert.doesNotMatch(gridCss, /display:\s*grid/, 'nvue must not use display:grid')
	assert.doesNotMatch(gridCss, /@supports/, 'nvue cannot parse @supports')
	assert.doesNotMatch(itemCss, /@supports/, 'nvue cannot parse @supports')
}

// --- 宽度不能改成在脚本里按环境判断：app 端 style 在逻辑层算，那里没有 CSS 对象
const itemScript = itemSfc.descriptor.script.content
for (const platform of ['h5', 'app', 'mp-weixin']) {
	initPreContext(platform)
	const js = preJs(itemScript, itemPath)
	assert.match(js, /style\['width'\] = '100%'/, `${platform} keeps the plain width:100% inline style`)
	assert.doesNotMatch(js, /CSS\.supports/, 'CSS.supports is unavailable in the app logic layer, keep the fallback in CSS')
}
initPreContext('app')
assert.match(
	preNVueJs(itemScript, itemPath),
	/style\['width'\] = this\.width/,
	'nvue keeps its measured pixel width'
)

console.log('grid old-webview assertions passed')
