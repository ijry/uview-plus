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

// issue #873：tabbar 的顶部边框曾经完全依赖全局工具类 u-border-top（libs/css/common.scss）。
// 该类只存在于宿主项目的全局样式表里，而小程序自定义组件有样式隔离，
// 组件内部节点能否命中这条全局类取决于宿主项目引入全局样式的方式，
// 于是出现同一个 tabbar 在某些页面有边框、切到另一个页面边框消失的现象。
// 现在边框由组件自身内联样式绘制，本脚本守住这一点。

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const read = filePath => readFileSync(resolve(repoRoot, filePath), 'utf8')
const sfcPath = resolve(repoRoot, 'src/uni_modules/uview-plus/components/u-tabbar/u-tabbar.vue')
const source = read('src/uni_modules/uview-plus/components/u-tabbar/u-tabbar.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:tabbar-border'],
	'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-tabbar-border.mjs',
	'package.json should expose verify:tabbar-border'
)

const { parse, compileTemplate } = require('@vue/compiler-sfc')
const { descriptor, errors } = parse(source, { filename: sfcPath })
assert.deepEqual(errors, [], 'u-tabbar.vue should parse cleanly')

// --- 模板不得再依赖宿主的全局边框工具类
assert.doesNotMatch(
	descriptor.template.content,
	/u-border-top/,
	'the tabbar template must not rely on the global u-border-top utility class'
)
// 组件自身的 scoped 样式表里也没有边框声明，所以边框只能来自内联样式
assert.doesNotMatch(
	descriptor.styles.map(style => style.content).join('\n'),
	/border-top/,
	'the scoped stylesheet is not expected to draw the top border'
)

// --- 每个平台条件编译后都必须保留内联边框，写进 #ifdef 就等于某些端上没有边框
{
	const { initPreContext, preJs, preNVueJs } = require(
		resolve(repoRoot, 'node_modules/@dcloudio/uni-cli-shared/dist/preprocess/index.js')
	)
	const borderPattern = /style\.borderTopWidth = '0\.5px'[\s\S]{0,200}?style\.borderTopColor = this\.tabbarBorderColor/
	for (const platform of ['h5', 'mp-weixin', 'app', 'app-harmony']) {
		initPreContext(platform)
		assert.match(preJs(descriptor.script.content, sfcPath), borderPattern, `${platform} should keep the inline top border`)
	}
	initPreContext('app')
	assert.match(preNVueJs(descriptor.script.content, sfcPath), borderPattern, 'app-nvue should keep the inline top border')
}

// --- 真实挂载，断言最终落到节点上的 class 与内联 style
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

// SFC 的 script 走 data: 模块加载，data: URL 没有基准路径，相对导入先改写成绝对 file URL
const scriptModule = 'data:text/javascript,' + encodeURIComponent(
	descriptor.script.content.replace(/(from\s+['"])(\.[^'"]+)(['"])/g, (match, head, specifier, tail) => {
		const base = resolve(dirname(sfcPath), specifier)
		const target = existsSync(base) ? base : `${base}.js`
		assert.ok(existsSync(target), `${specifier} should resolve to a real file`)
		return head + pathToFileURL(target).href + tail
	})
)
const componentOptions = (await import(scriptModule)).default
const { code: renderCode } = compileTemplate({ source: descriptor.template.content, filename: sfcPath, id: 'u-tabbar' })
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
	createText: text => ({ tag: 'text', text, props: {} }),
	createComment: text => ({ tag: 'comment', text, props: {} }),
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

function renderTabbar(props) {
	nodes.length = 0
	const Tabbar = { ...componentOptions, render }
	const app = createApp({ render: () => h(Tabbar, props) })
	app.component('u-safe-bottom', { render: () => h('view') })
	app.mount(nodeOps.createElement('root'))
	const content = nodes.find(node => String(node.props.class || '').includes('u-tabbar__content'))
	assert.ok(content, 'the tabbar content node should be rendered')
	app.unmount()
	return content
}

// 默认：边框由内联样式绘制，颜色取主题边框色（和 u-input 的 inputBorderColor 走同一套 helper）
{
	const { getThemeVar } = await import(
		pathToFileURL(resolve(repoRoot, 'src/uni_modules/uview-plus/libs/theme/runtime.js')).href
	)
	const themeBorderColor = getThemeVar('--up-border-color', '#dadbde')
	assert.ok(themeBorderColor, 'the theme should expose a border color')

	const content = renderTabbar({})
	assert.doesNotMatch(content.props.class, /u-border-top/, 'the rendered node must not carry the global border class')
	assert.equal(content.props.style.borderTopWidth, '0.5px', 'the default tabbar must draw its own 0.5px top border')
	assert.equal(content.props.style.borderTopStyle, 'solid')
	assert.equal(
		content.props.style.borderTopColor,
		themeBorderColor,
		'the default border color should come from the theme border color'
	)
}

// borderColor 生效，且不再需要 !important 去压全局工具类
{
	const content = renderTabbar({ borderColor: 'red' })
	assert.equal(content.props.style.borderTopColor, 'red', 'borderColor should paint the top border')
	assert.doesNotMatch(
		JSON.stringify(content.props.style),
		/!important/,
		'the inline border no longer needs !important; nvue/weex cannot parse it'
	)
}

// border=false 时不画边框
{
	const content = renderTabbar({ border: false })
	assert.equal(content.props.style.borderTopWidth, undefined, 'border=false must not draw a top border')
	assert.equal(content.props.style.borderTopStyle, undefined)
	assert.equal(content.props.style.borderTopColor, undefined)
}

// customStyle 仍然可以覆盖组件算出来的边框
{
	const content = renderTabbar({ customStyle: { borderTopColor: '#000000' } })
	assert.equal(content.props.style.borderTopColor, '#000000', 'customStyle should still win over the computed border')
}

console.log('tabbar border assertions passed')
