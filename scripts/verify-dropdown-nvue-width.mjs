import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// issue #814：nvue(weex)不支持百分比长度。u-dropdown 的根节点、下拉内容和遮罩都靠 width: 100% 撑宽，
// 编译到 nvue 时 uni-nvue-styler 会把它修正成 width: 100（NOTE: unit `%` is not supported ...），
// 也就是 750 设计宽下的 100px，于是标题栏、下拉面板和遮罩一起被压成屏幕左侧一条窄列。
// 本脚本按真实管线（条件编译 -> sass -> uni-nvue-styler）编译组件样式：
// nvue 下不允许再出现百分比长度或固定宽度，绝对定位元素改用 left + right 撑满；非 nvue 端保持 width: 100%。

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const read = filePath => readFileSync(resolve(repoRoot, filePath), 'utf8')
const sfcPath = resolve(repoRoot, 'src/uni_modules/uview-plus/components/u-dropdown/u-dropdown.vue')

assert.equal(
	JSON.parse(read('package.json')).scripts['verify:dropdown-nvue-width'],
	'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-dropdown-nvue-width.mjs',
	'package.json should expose verify:dropdown-nvue-width'
)

const { parse: parseSfc } = require('@vue/compiler-sfc')
const { descriptor, errors } = parseSfc(read('src/uni_modules/uview-plus/components/u-dropdown/u-dropdown.vue'), {
	filename: sfcPath
})
assert.deepEqual(errors, [], 'u-dropdown.vue should parse cleanly')
const styleSource = descriptor.styles.map(style => style.content).join('\n')
assert.match(styleSource, /\.u-dropdown\b/, 'the scoped stylesheet should still define .u-dropdown')

const { initPreContext, preCss, preNVueCss } = require(
	resolve(repoRoot, 'node_modules/@dcloudio/uni-cli-shared/dist/preprocess/index.js')
)
const sass = require('sass')
// uni-app 把 src/uni.scss 当作 additionalData 注入每一个样式块（vite-plugin-uni/dist/config/css.js），
// 组件样式里的 @include flex / $u-content-color 都来自它引入的 theme.scss；
// 真实管线同样会先对它做一次条件编译，这里保持一致，避免 #ifdef 注释残留到产物里
const compileScss = scss => sass.compileString(`${preCss(read('src/uni.scss'), sfcPath)}\n${scss}`, {
	loadPaths: [resolve(repoRoot, 'src')],
	importers: [{
		findFileUrl: url => url.startsWith('@/') ? pathToFileURL(resolve(repoRoot, 'src', url.slice(2))) : null
	}],
	silenceDeprecations: ['legacy-js-api', 'color-functions', 'import', 'global-builtin']
}).css

// --- nvue：编译器不得再把百分比宽度修正成固定 px
initPreContext('app')
const { code, messages } = await require('@dcloudio/uni-nvue-styler').parse(
	compileScss(preNVueCss(styleSource, sfcPath)),
	{ type: 'nvue', logLevel: 'NOTE', filename: sfcPath }
)
assert.deepEqual(
	messages.filter(message => /unit `%` is not supported/.test(message.text)).map(message => message.text),
	[],
	'nvue 下不应再有百分比长度被编译器修正成固定 px'
)

const nvueStyles = JSON.parse(code)
const nvueRule = selector => {
	const declarations = nvueStyles[selector] && nvueStyles[selector]['']
	assert.ok(declarations, `${selector} should keep a style rule on nvue`)
	return declarations
}

// 根节点：nvue 下没有宽度声明，靠 flex 在父级里拉伸/撑满
const root = nvueRule('u-dropdown')
assert.equal(root.width, undefined, 'nvue 下 .u-dropdown 不能带固定宽度，否则整个菜单被压成窄列')
assert.equal(root.flex, 1, 'nvue 下 .u-dropdown 仍要靠 flex 撑开')
assert.equal(root.position, 'relative', '下拉内容是相对根节点绝对定位的')

// 下拉内容与遮罩：绝对定位，用 left + right 撑满父级宽度
for (const selector of ['u-dropdown__content', 'u-dropdown__content__mask']) {
	const declarations = nvueRule(selector)
	assert.equal(declarations.width, undefined, `nvue 下 .${selector} 不能带固定宽度`)
	assert.equal(declarations.position, 'absolute', `.${selector} 应保持绝对定位`)
	assert.equal(declarations.left, 0, `nvue 下 .${selector} 需要 left: 0`)
	assert.equal(declarations.right, 0, `nvue 下 .${selector} 需要 right: 0 才能撑满父级宽度`)
}

// --- 其他端：仍然使用 width: 100%，且不带 nvue 专用的 right
const postcss = require('postcss')
for (const platform of ['h5', 'mp-weixin', 'app']) {
	initPreContext(platform)
	const declarations = {}
	postcss.parse(compileScss(preCss(styleSource, sfcPath))).walkRules(rule => {
		const target = declarations[rule.selector] || (declarations[rule.selector] = {})
		rule.walkDecls(decl => { target[decl.prop] = decl.value })
	})
	for (const selector of ['.u-dropdown', '.u-dropdown__content', '.u-dropdown__content__mask']) {
		assert.equal(declarations[selector]?.width, '100%', `${platform} 的 ${selector} 仍应使用 width: 100%`)
	}
	for (const selector of ['.u-dropdown__content', '.u-dropdown__content__mask']) {
		assert.equal(declarations[selector].right, undefined, `${platform} 不需要 nvue 专用的 right 声明`)
	}
}

console.log('dropdown nvue width assertions passed')
