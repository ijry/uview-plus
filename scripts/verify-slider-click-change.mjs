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

// issue #810：点击滑块轨道后 change 不触发，外部拿不到点击的值。
// 起因是 onClick 只改内部值和进度条长度，change 完全依赖 modelValue 的 watch 回抛：
// 单向绑定(:modelValue，父级不写回)时一个事件都收不到；反过来父级用代码改值时，
// 又会收到一个用户根本没操作过的 change。现在 change 由点击本身发出，本脚本守住这一点。

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const read = filePath => readFileSync(resolve(repoRoot, filePath), 'utf8')
const sfcPath = resolve(repoRoot, 'src/uni_modules/uview-plus/components/u-slider/u-slider.vue')
const source = read('src/uni_modules/uview-plus/components/u-slider/u-slider.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:slider-click-change'],
	'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-slider-click-change.mjs',
	'package.json should expose verify:slider-click-change'
)

const { parse, compileTemplate } = require(resolve(repoRoot, 'node_modules/vue/compiler-sfc/index.js'))
const { descriptor, errors } = parse(source, { filename: sfcPath })
assert.deepEqual(errors, [], 'u-slider.vue should parse cleanly')
const template = descriptor.template.content

// --- 一次点击只能进入 onClick 一次：进度条在轨道内部，它再绑一次点击就会重复发 change
assert.match(template, /class="u-slider-inner" @click="onClick"/, 'the track should keep handling clicks')
assert.equal(
	template.split('@click="onClick"').length - 1,
	1,
	'onClick must be bound exactly once, a second binding inside the track fires change twice per tap'
)
// --- 滑块本身的点击已经由 touch 事件处理完了，冒泡回轨道会再发一次 change
assert.equal(
	template.split('@click.stop').length - 1,
	2,
	'both slider knobs should stop the click from bubbling back to the track'
)

// --- change 必须来自交互本身：watch 里回抛 change 会让父级用代码改值时收到假的 change
const watchBlock = source.slice(source.indexOf('watch: {'), source.indexOf('async mounted()'))
assert.ok(watchBlock.includes('modelValue(n)'), 'the watch block should still sync the value prop')
assert.doesNotMatch(
	watchBlock,
	/\$emit\('change'/,
	'the value watchers must not emit change, a programmatic value change is not a user change'
)

// --- 各端条件编译后点击都要发 change；nvue 拿不到坐标，整段本来就被 #ifndef APP-NVUE 排除
const { initPreContext, preJs, preNVueJs } = require(
	resolve(repoRoot, 'node_modules/@dcloudio/uni-cli-shared/dist/preprocess/index.js')
)
const clickEmit = /const \$crtFmtValue = this\.updateValue\(this\.newValue, false, 1\)\s*\n\s*this\.\$emit\('change', \$crtFmtValue\)/
const platformScripts = {}
for (const platform of ['h5', 'mp-weixin', 'app', 'app-harmony']) {
	initPreContext(platform)
	const script = preJs(descriptor.script.content, sfcPath)
	platformScripts[platform] = script
	assert.match(script, clickEmit, `${platform} should emit change when the track is clicked`)
	assert.doesNotMatch(
		script.slice(script.indexOf('watch: {'), script.indexOf('mounted()')),
		/\$emit\('change'/,
		`${platform} should not emit change from the value watchers`
	)
}
initPreContext('app')
assert.doesNotMatch(
	preNVueJs(descriptor.script.content, sfcPath),
	clickEmit,
	'app-nvue cannot read click coordinates, the whole branch stays excluded there'
)

// --- 真实挂载 H5 条件编译后的组件，断言一次交互对外发出的事件序列
// 组件没挂在真实页面里量不到轨道尺寸，直接给一条 200px 的轨道，值和像素一一对应
const SLIDER_RECT = { left: 0, top: 0, width: 200, height: 200 }

globalThis.uni = {
	$on() {}, $off() {}, $once() {}, $emit() {},
	getStorageSync: () => '',
	setStorageSync() {},
	getSystemInfoSync: () => ({ windowWidth: 375, windowHeight: 667 }),
	getWindowInfo: () => ({ windowWidth: 375, windowHeight: 667 }),
	createSelectorQuery() {
		const query = {
			in: () => query,
			select: () => query,
			selectAll: () => query,
			boundingClientRect(callback) {
				callback && callback({ ...SLIDER_RECT, right: 200, bottom: 200 })
				return query
			},
			exec: () => query
		}
		return query
	}
}

// SFC 的 script 走 data: 模块加载，data: URL 没有基准路径，相对导入先改写成绝对 file URL
const scriptModule = 'data:text/javascript,' + encodeURIComponent(
	platformScripts.h5.replace(/(from\s+['"])(\.[^'"]+)(['"])/g, (match, head, specifier, tail) => {
		const base = resolve(dirname(sfcPath), specifier)
		const target = existsSync(base) ? base : `${base}.js`
		assert.ok(existsSync(target), `${specifier} should resolve to a real file`)
		return head + pathToFileURL(target).href + tail
	})
)
const componentOptions = (await import(scriptModule)).default
const { code: renderCode } = compileTemplate({ source: template, filename: sfcPath, id: 'u-slider' })
const { render } = await import('data:text/javascript,' + encodeURIComponent(
	renderCode.replace(/from "vue"/, `from "${pathToFileURL(resolve(repoRoot, 'node_modules/vue/index.mjs')).href}"`)
))

const { createRenderer, h, ref, nextTick } = await import('vue')
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

async function mountSlider({ modelValue = 30, rangeValue, vertical = false, writeBack = false, disabled = false } = {}) {
	nodes.length = 0
	const events = []
	const record = name => value => events.push([name, Array.isArray(value) ? [...value] : value])
	const model = ref(modelValue)
	const range = ref(rangeValue ? [...rangeValue] : null)
	const instance = ref(null)
	const Slider = { ...componentOptions, render }
	const app = createApp({
		render: () => h(Slider, {
			ref: instance,
			modelValue: model.value,
			vertical,
			disabled,
			...(range.value ? { isRange: true, rangeValue: range.value } : {}),
			'onUpdate:modelValue': value => {
				record('update:modelValue')(value)
				// 双向绑定时父级把值写回来，等价于 v-model
				if (writeBack && !Array.isArray(value)) model.value = value
			},
			onChange: record('change'),
			onChanging: record('changing'),
			onStart: () => events.push(['start'])
		})
	})
	// useNative 分支里的原生 slider 在 Node 里没有实现，给个占位
	app.component('slider', { render: () => h('slider') })
	app.mount(nodeOps.createElement('root'))
	const vm = instance.value
	assert.ok(vm, 'the slider instance should be available')
	// mounted 里量轨道尺寸是异步的，等它跑完再交互，否则初始化会把交互结果覆盖掉
	await nextTick()
	await new Promise(resolve => setTimeout(resolve, 0))
	assert.deepEqual(
		{ width: vm.sliderRect.width, height: vm.sliderRect.height },
		{ width: SLIDER_RECT.width, height: SLIDER_RECT.height },
		'the slider should have measured its own track before the interaction'
	)
	return { vm, events, model, range, app }
}

const changes = events => events.filter(([name]) => name === 'change')
const touchAt = position => ({ touches: [{ clientX: position, clientY: position }] })

// 1. issue #810：单向绑定(:modelValue)时点击轨道，父级必须收到带值的 change
{
	const { vm, events } = await mountSlider({ modelValue: 30 })
	vm.onClick({ detail: { x: 150, y: 0 } })
	await nextTick()
	assert.deepEqual(
		changes(events),
		[['change', 75]],
		'a click on the track must emit exactly one change carrying the clicked value'
	)
	assert.ok(
		events.some(([name, value]) => name === 'update:modelValue' && value === 75),
		'a click should still update v-model'
	)
	assert.equal(vm.barStyle.width, '150px', 'the active bar should follow the click')
}

// 2. 双向绑定(v-model)父级写回值后，也只能有一个 change，不能被 watch 再放大一次
{
	const { vm, events } = await mountSlider({ modelValue: 30, writeBack: true })
	vm.onClick({ detail: { x: 150, y: 0 } })
	await nextTick()
	await nextTick()
	assert.deepEqual(
		changes(events),
		[['change', 75]],
		'v-model usage must not turn one click into two change events'
	)
}

// 3. 父级用代码改值：进度条要跟着走，但没人操作过滑块，不能发 change
{
	const { vm, events, model } = await mountSlider({ modelValue: 30 })
	model.value = 60
	await nextTick()
	assert.deepEqual(changes(events), [], 'a programmatic value change is not a user change')
	assert.equal(vm.barStyle.width, '120px', 'the active bar should still follow the value prop')
}

// 4. 拖动路径不受影响：拖动中 changing，抬手一次 change
{
	const { vm, events } = await mountSlider({ modelValue: 30 })
	vm.onTouchStart(touchAt(60))
	vm.onTouchMove(touchAt(100))
	vm.onTouchEnd({})
	await nextTick()
	assert.deepEqual(
		events.filter(([name]) => name === 'changing' || name === 'change'),
		[['changing', 30], ['changing', 50], ['change', 50]],
		'dragging should keep emitting changing while moving and one change on release'
	)
}

// 5. 垂直模式点击按纵坐标取值
{
	const { vm, events } = await mountSlider({ modelValue: 30, vertical: true })
	vm.onClick({ detail: { x: 0, y: 140 } })
	await nextTick()
	assert.deepEqual(
		changes(events),
		[['change', 70]],
		'a click on a vertical track should emit the value derived from the y coordinate'
	)
}

// 6. 区间模式点击：change 带回整个区间，且 rangeValue 的深监听不再补发第二个
{
	const { vm, events } = await mountSlider({ rangeValue: [10, 40] })
	vm.onClick({ detail: { x: 160, y: 0 } })
	await nextTick()
	await nextTick()
	assert.deepEqual(
		changes(events),
		[['change', [10, 80]]],
		'a click in range mode should emit exactly one change carrying both handles'
	)
}

// 7. 禁用状态不响应点击
{
	const { vm, events } = await mountSlider({ modelValue: 30, disabled: true })
	vm.onClick({ detail: { x: 150, y: 0 } })
	await nextTick()
	assert.deepEqual(changes(events), [], 'a disabled slider should ignore clicks')
}

// 8. 拿不到点击坐标时不能瞎发 change：算出来的只会是 min，不是用户点的值
{
	const { vm, events } = await mountSlider({ modelValue: 30 })
	vm.onClick({ detail: {} })
	vm.onClick({})
	await nextTick()
	assert.deepEqual(changes(events), [], 'a click without coordinates must not emit a made-up value')
	assert.equal(vm.barStyle.width, '60px', 'a click without coordinates must not move the slider')
}

// 9. 弹窗里没显示过、轨道长度还是 0 时同理：不动值也不发事件
{
	const { vm, events } = await mountSlider({ modelValue: 30 })
	vm.sliderRect = { left: 0, top: 0, width: 0, height: 0 }
	vm.onClick({ detail: { x: 150, y: 0 } })
	await nextTick()
	assert.deepEqual(changes(events), [], 'an unmeasured track cannot resolve a click')
}

console.log('slider click change assertions passed')
