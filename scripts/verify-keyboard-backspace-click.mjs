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

// issue #772：键盘的退格键原来只绑了 @touchstart，而电脑版微信内置浏览器（以及任何
// 鼠标操作的桌面浏览器）只会派发鼠标事件，touch 事件根本不产生，于是 @backspace
// 永远不触发——数字键用的是 @tap，所以只有退格键坏掉。
// 现在退格键和 u-number-box 的加减键一样：@tap 负责"删一次"（鼠标/触摸都会触发），
// @touchstart 只负责延时进入长按连删，短按时会被 @touchend 清掉，因此不会删两次。

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const read = filePath => readFileSync(resolve(repoRoot, filePath), 'utf8')
const packageJson = JSON.parse(read('package.json'))
const sleep = ms => new Promise(done => setTimeout(done, ms))
// 模板里带 .stop 修饰符的绑定会被 withModifiers 包一层，事件对象必须能响应 stopPropagation
const fakeEvent = type => ({
	type,
	touches: [],
	changedTouches: [],
	stopPropagation() {},
	preventDefault() {}
})

assert.equal(
	packageJson.scripts['verify:keyboard-backspace-click'],
	'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-keyboard-backspace-click.mjs',
	'package.json should expose verify:keyboard-backspace-click'
)

globalThis.uni = {
	$on() {}, $off() {}, $once() {}, $emit() {},
	getStorageSync: () => '',
	setStorageSync() {},
	getSystemInfoSync: () => ({ windowWidth: 375, windowHeight: 667 }),
	getWindowInfo: () => ({ windowWidth: 375, windowHeight: 667 }),
	requireNativePlugin: () => ({ getComponentRect() {} })
}

const { parse, compileTemplate } = require('@vue/compiler-sfc')
const { createRenderer, h } = await import('vue')

async function mountKeyboard(name) {
	const sfcPath = resolve(repoRoot, `src/uni_modules/uview-plus/components/${name}/${name}.vue`)
	const { descriptor, errors } = parse(read(`src/uni_modules/uview-plus/components/${name}/${name}.vue`), {
		filename: sfcPath
	})
	assert.deepEqual(errors, [], `${name}.vue should parse cleanly`)

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
	const { code: renderCode } = compileTemplate({ source: descriptor.template.content, filename: sfcPath, id: name })
	const { render } = await import('data:text/javascript,' + encodeURIComponent(
		renderCode.replace(/from "vue"/, `from "${pathToFileURL(resolve(repoRoot, 'node_modules/vue/index.mjs')).href}"`)
	))

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

	const emitted = []
	const Keyboard = { ...componentOptions, render }
	const app = createApp({
		render: () => h(Keyboard, { mode: 'number', onBackspace: () => emitted.push(Date.now()) })
	})
	app.component('up-icon', { render: () => h('view') })
	app.mount(nodeOps.createElement('root'))

	// 退格键：数字键盘上是那颗灰色按键，车牌键盘上是绑了 touchend 的那个 wrapper
	const backspace = nodes.find(node => {
		const cls = String(node.props.class || '')
		return cls.includes('u-keyboard__button-wrapper__button--gray') ||
			(cls.includes('u-keyboard__button__inner-wrapper') && node.props.onTouchend)
	})
	assert.ok(backspace, `${name}: the backspace key node should be rendered`)
	return { name, backspace, emitted, unmount: () => app.unmount() }
}

for (const name of ['u-number-keyboard', 'u-car-keyboard']) {
	const { backspace, emitted, unmount } = await mountKeyboard(name)

	// —— 1. 只有 tap（鼠标点击，PC 版微信内置浏览器就是这条路径）——
	assert.ok(
		backspace.props.onTap,
		`${name}: the backspace key must carry a tap handler, mouse-only browsers never fire touch events`
	)
	backspace.props.onTap(fakeEvent('click'))
	assert.equal(emitted.length, 1, `${name}: a tap on backspace should emit exactly one backspace`)
	await sleep(900)
	assert.equal(emitted.length, 1, `${name}: a tap must not leave a repeating timer running`)

	// —— 2. 触摸短按：touchstart/touchend 本身不删，删除由随后的 tap 完成（合计一次）——
	emitted.length = 0
	backspace.props.onTouchstart(fakeEvent('touchstart'))
	backspace.props.onTouchend(fakeEvent('touchend'))
	backspace.props.onTap(fakeEvent('click'))
	await sleep(900)
	assert.equal(
		emitted.length,
		1,
		`${name}: a quick touch tap (touchstart + touchend + the click the browser synthesises) must delete exactly once`
	)

	// —— 3. 长按仍然连续删除，松手后立刻停 ——
	emitted.length = 0
	backspace.props.onTouchstart(fakeEvent('touchstart'))
	await sleep(1000)
	const duringHold = emitted.length
	assert.ok(duringHold >= 2, `${name}: holding backspace should keep deleting, got ${duringHold} in 1s`)
	backspace.props.onTouchend(fakeEvent('touchend'))
	await sleep(600)
	assert.equal(emitted.length, duringHold, `${name}: releasing backspace must stop the repeat`)

	unmount()

	// —— 模板：锁住"删除挂在 tap 上、touchstart 只负责长按"这个结构 ——
	const source = read(`src/uni_modules/uview-plus/components/${name}/${name}.vue`)
	assert.match(
		source,
		/@tap="backspaceClick"/,
		`${name}: the backspace key must bind @tap, mouse-only browsers never fire touch events`
	)
	assert.doesNotMatch(
		source,
		/@touchstart(?:\.\w+)*="backspaceClick"/,
		`${name}: @touchstart must not run the single-delete handler, or a touch tap would delete twice`
	)
}

console.log('keyboard backspace click assertions passed')


