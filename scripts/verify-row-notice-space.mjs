import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire, register } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// 组件库源码用无扩展名的相对导入和目录导入（uni-app 编译器会补全），Node 原生 ESM 不会，
// 注册解析钩子把 './x' 回退到 './x.js' 或 './x/index.js'，以便直接加载组件做真实挂载
register(
	'data:text/javascript,' +
		encodeURIComponent(`
import { existsSync } from 'node:fs'
export async function resolve(specifier, context, next) {
	try {
		return await next(specifier, context)
	} catch (err) {
		if (specifier.startsWith('.') && context.parentURL) {
			for (const suffix of ['.js', '/index.js']) {
				if (existsSync(new URL(specifier + suffix, context.parentURL))) {
					return next(specifier + suffix, context)
				}
			}
		}
		throw err
	}
}
`)
)

// issue #545：u-row-notice 为了规避低端安卓机的动画抖动，把 text 每 20 个字符切一段渲染到
// 独立的 text 标签里，而这些 text 标签又是 flex 项（会被块级化）。CSS 的空白处理会丢弃
// 每个块首尾的可折叠空白，于是原文第 21 个字符是空格时，它正好落在第二段的行首被吃掉，
// 用户看到的就是两个词粘在一起。空白值必须同时满足"保留原文空白"和"不换行"，只有 pre 符合。
// 浏览器实测（H5 dev + CDP，fontSize=30px）：nowrap 下该空格渲染宽度 0px、整段比应有宽度窄
// 6.72px；改成 pre 后空格宽 6.73px、整段宽度与保留空白的参照一致。
//
// 允许的值：能保留空白又不换行的只有 pre。pre-wrap / break-spaces 会换行，
// normal / nowrap / pre-line 会折叠并裁掉行首行尾空白。
const KEEPS_SPACES_AND_NEVER_WRAPS = /^pre(\s+!important)?$/

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const read = filePath => readFileSync(resolve(repoRoot, filePath), 'utf8')
const sfcPath = resolve(repoRoot, 'src/uni_modules/uview-plus/components/u-row-notice/u-row-notice.vue')
const source = read('src/uni_modules/uview-plus/components/u-row-notice/u-row-notice.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:row-notice-space'],
	'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-row-notice-space.mjs',
	'package.json should expose verify:row-notice-space'
)

const { parse, compileTemplate } = require('vue/compiler-sfc')
const { descriptor, errors } = parse(source, { filename: sfcPath })
assert.deepEqual(errors, [], 'u-row-notice.vue should parse cleanly')

// --- scoped 样式里的容器空白值同样不能是会折叠空白的值（子节点会继承它）
{
	const styles = descriptor.styles.map(style => style.content).join('\n')
	const rule = styles.match(/&__text\s*\{[\s\S]*?\n\t*\}/)
	assert.ok(rule, 'the .u-notice__content__text rule should exist')
	const declared = rule[0].match(/white-space:\s*([^;\n]+)/)
	assert.ok(declared, 'the scrolling text rule should declare white-space')
	assert.match(
		declared[1].trim(),
		KEEPS_SPACES_AND_NEVER_WRAPS,
		'the scrolling text must keep the author white space and still never wrap'
	)
}

// --- 每个平台条件编译后都必须保留这行内联空白声明，写进 #ifdef 就等于某些端上空格照旧丢失
// 具体值由下面的真实挂载断言把关，这里只关心它没有被某个平台裁掉
{
	const { initPreContext, preJs, preNVueJs } = require(
		resolve(repoRoot, 'node_modules/@dcloudio/uni-cli-shared/dist/preprocess/index.js')
	)
	const inline = /style\.whiteSpace = /
	for (const platform of ['h5', 'mp-weixin', 'app', 'app-harmony']) {
		initPreContext(platform)
		assert.match(preJs(descriptor.script.content, sfcPath), inline, `${platform} should keep the inline white-space`)
	}
	initPreContext('app')
	assert.match(preNVueJs(descriptor.script.content, sfcPath), inline, 'app-nvue should keep the inline white-space')
}

// --- 真实挂载，断言切分后的每个 text 节点上落到的内联 style 与文字内容
globalThis.uni = {
	$on() {}, $off() {}, $once() {}, $emit() {},
	getStorageSync: () => '',
	setStorageSync() {},
	getSystemInfoSync: () => ({ windowWidth: 375, windowHeight: 667 }),
	getWindowInfo: () => ({ windowWidth: 375, windowHeight: 667 }),
	requireNativePlugin: () => ({ getComponentRect() {} }),
	createSelectorQuery() {
		const query = {
			in: () => query,
			select: () => query,
			selectAll: () => query,
			boundingClientRect: () => query,
			exec: () => query
		}
		return query
	}
}

// SFC 的 script 走 data: 模块加载，data: URL 没有基准路径，相对导入先改写成绝对 file URL；
// 同时先过一遍 h5 的条件编译，否则 mounted 里 APP-PLUS 分支的 getCurrentPages 会直接报错
const { initPreContext, preJs } = require(
	resolve(repoRoot, 'node_modules/@dcloudio/uni-cli-shared/dist/preprocess/index.js')
)
initPreContext('h5')
const scriptModule = 'data:text/javascript,' + encodeURIComponent(
	preJs(descriptor.script.content, sfcPath).replace(/(from\s+['"])(\.[^'"]+)(['"])/g, (match, head, specifier, tail) => {
		const base = resolve(dirname(sfcPath), specifier)
		const target = existsSync(base) ? base : `${base}.js`
		assert.ok(existsSync(target), `${specifier} should resolve to a real file`)
		return head + pathToFileURL(target).href + tail
	})
)
const componentOptions = (await import(scriptModule)).default
const { code: renderCode } = compileTemplate({ source: descriptor.template.content, filename: sfcPath, id: 'u-row-notice' })
const { render } = await import('data:text/javascript,' + encodeURIComponent(
	renderCode.replace(/from "vue"/, `from "${pathToFileURL(resolve(repoRoot, 'node_modules/vue/index.mjs')).href}"`)
))

const { createRenderer, h } = await import('vue')
const nodes = []
const nodeOps = {
	createElement(tag) {
		const node = { tag, props: {}, children: [], parent: null }
		nodes.push(node)
		return node
	},
	createText: text => ({ tag: '#text', text, props: {}, children: [] }),
	createComment: text => ({ tag: '#comment', text, props: {}, children: [] }),
	setText(node, text) { node.text = text },
	setElementText(node, text) { node.text = text },
	insert(child, parent) { child.parent = parent; parent.children.push(child) },
	remove(child) {
		const parent = child.parent
		parent && parent.children.splice(parent.children.indexOf(child), 1)
	},
	parentNode: node => node.parent,
	nextSibling: () => null,
	querySelector: () => null,
	setScopeId() {},
	patchProp(node, key, prev, next) { node.props[key] = next }
}
const { createApp } = createRenderer(nodeOps)

function renderChunks(props) {
	nodes.length = 0
	const RowNotice = { ...componentOptions, render }
	const app = createApp({ render: () => h(RowNotice, props) })
	app.component('up-icon', { render: () => h('view') })
	app.mount(nodeOps.createElement('root'))
	const chunks = nodes.filter(node => node.tag === 'text')
	app.unmount()
	return chunks
}

// 复现用文本：前 20 个字符不含空格，第 21 个字符是空格，切分后正好落在第二段的行首
const HEAD = 'ABCDEFGHIJKLMNOPQRST'
const CASES = [
	{ label: 'space as the 21st character', text: `${HEAD} WXYZ` },
	{ label: 'space as the 20th character', text: `${HEAD.slice(0, 19)} UWXYZ` },
	{ label: 'consecutive spaces across the split', text: `${HEAD.slice(0, 18)}  UVWXYZ` }
]

for (const { label, text } of CASES) {
	const chunks = renderChunks({ text })
	assert.ok(chunks.length > 1, `${label}: the text should be split into several text nodes`)
	// 切分本身不能丢字符：拼回去必须和原文完全一致
	assert.equal(
		chunks.map(node => node.text).join(''),
		text,
		`${label}: the chunks must join back into the original text`
	)
	// 确认这批用例确实构造出了"空白落在段首或段尾"的情况，否则断言就是空转
	assert.ok(
		chunks.some(node => /^\s|\s$/.test(node.text)),
		`${label}: at least one chunk should start or end with white space`
	)
	for (const [index, node] of chunks.entries()) {
		assert.match(
			String(node.props.style?.whiteSpace ?? ''),
			KEEPS_SPACES_AND_NEVER_WRAPS,
			`${label}: chunk ${index} must keep its edge white space and still never wrap`
		)
	}
}

// 不含空格的文本行为不变：仍然按 20 个字符切分，内容拼回后一致
{
	const text = '寒雨连江夜入吴平明送客楚山孤洛阳亲友如相问一片冰心在玉壶'
	const chunks = renderChunks({ text })
	assert.deepEqual(
		chunks.map(node => node.text),
		[text.slice(0, 20), text.slice(20)],
		'text without spaces should still be chunked every 20 characters'
	)
}

console.log('row notice space assertions passed')
