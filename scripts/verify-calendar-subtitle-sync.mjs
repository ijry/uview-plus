import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
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

// issue #776：日历副标题只由 monthIndex 决定，而 monthIndex 过去只在 scroll-view 的
// @scroll 回调里更新。关闭再打开日历时月份数据会重建、滚动位置也会回到默认月份，
// 但这个过程不一定产生滚动事件（H5 上 scrollIntoView 指向的就是当前位置、
// 微信小程序上 scroll-top 沿用上次数值没有变化，都收不到 @scroll），
// monthIndex 于是停留在关闭前滚到的月份，副标题和日历内容对不上。
// 本脚本真实挂载 u-calendar，用打桩的 scroll-view 复现「打开 → 滑到底 → 关闭 → 再打开」，
// 断言副标题始终等于视口顶部真正显示的月份。

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const read = filePath => readFileSync(resolve(repoRoot, filePath), 'utf8')
const sfcPath = resolve(repoRoot, 'src/uni_modules/uview-plus/components/u-calendar/u-calendar.vue')
const source = read('src/uni_modules/uview-plus/components/u-calendar/u-calendar.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:calendar-subtitle-sync'],
	'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-calendar-subtitle-sync.mjs',
	'package.json should expose verify:calendar-subtitle-sync'
)

const { parse, compileTemplate } = require('@vue/compiler-sfc')
const { descriptor, errors } = parse(source, { filename: sfcPath })
assert.deepEqual(errors, [], 'u-calendar.vue should parse cleanly')

globalThis.uni = {
	$on() {}, $off() {}, $once() {}, $emit() {},
	getLocale: () => 'zh-Hans',
	getStorageSync: () => '',
	setStorageSync() {},
	showToast() {},
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

const { createRenderer, h, nextTick, reactive } = await import('vue')
const dayjs = (
	await import(
		pathToFileURL(
			resolve(repoRoot, 'src/uni_modules/uview-plus/components/u-datetime-picker/dayjs.esm.min.js')
		).href
	)
).default

const { code: renderCode } = compileTemplate({
	source: descriptor.template.content,
	filename: sfcPath,
	id: 'u-calendar'
})
const { render } = await import(
	'data:text/javascript,' +
		encodeURIComponent(
			renderCode.replace(/from "vue"/, `from "${pathToFileURL(resolve(repoRoot, 'node_modules/vue/index.mjs')).href}"`)
		)
)

const { initPreContext, preJs } = require(
	resolve(repoRoot, 'node_modules/@dcloudio/uni-cli-shared/dist/preprocess/index.js')
)

// SFC 的 script 走 data: 模块加载，data: URL 没有基准路径，相对导入先改写成绝对 file URL；
// 两个 .vue 子组件在本脚本里用桩替换，这里先摘掉它们的 import
async function loadCalendarOptions(platform) {
	initPreContext(platform)
	const platformScript = preJs(descriptor.script.content, sfcPath)
	const rewritten = platformScript
		.replace(/^\s*import\s+uHeader\s+from\s+.*$/m, 'const uHeader = null')
		.replace(/^\s*import\s+uMonth\s+from\s+.*$/m, 'const uMonth = null')
		.replace(/(from\s+['"])(\.[^'"]+)(['"])/g, (match, head, specifier, tail) => {
			const base = resolve(dirname(sfcPath), specifier)
			const target = [base, `${base}.js`, `${base}/index.js`].find(
				item => existsSync(item) && statSync(item).isFile()
			)
			assert.ok(target, `${specifier} should resolve to a real file`)
			return head + pathToFileURL(target).href + tail
		})
	return (await import('data:text/javascript,' + encodeURIComponent(rewritten))).default
}

// 月份块高度按 month.vue 的排版推算：首月没有月份标题，行数取决于当月 1 号是周几
const MONTH_TITLE_HEIGHT = 42
const ROW_HEIGHT = 56
// 滚动区域高度即组件里的 rowHeight * 5 + 30
const VIEWPORT = ROW_HEIGHT * 5 + 30
const padMonth = month => (month < 10 ? `0${month}` : String(month))
const expectedSubtitle = ({ year, month }) => `${year}年${padMonth(month)}月`

function measureMonth({ year, month }, index) {
	const first = dayjs(`${year}-${padMonth(month)}-01`)
	const offset = (first.day() === 0 ? 7 : first.day()) - 1
	const rows = Math.ceil((offset + first.daysInMonth()) / 7)
	return rows * ROW_HEIGHT + (index === 0 ? 0 : MONTH_TITLE_HEIGHT)
}

async function mountCalendar(platform, props) {
	const options = await loadCalendarOptions(platform)
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
		insert(child, parent, anchor) {
			child.parent = parent
			parent.children = parent.children || []
			const index = anchor ? parent.children.indexOf(anchor) : -1
			index === -1 ? parent.children.push(child) : parent.children.splice(index, 0, child)
		},
		remove(child) {
			const parent = child && child.parent
			if (!parent || !parent.children) return
			const index = parent.children.indexOf(child)
			index !== -1 && parent.children.splice(index, 1)
		},
		parentNode: node => (node ? node.parent : null),
		nextSibling(node) {
			const parent = node && node.parent
			if (!parent || !parent.children) return null
			const index = parent.children.indexOf(node)
			return index === -1 ? null : parent.children[index + 1] || null
		},
		querySelector: () => null,
		setScopeId() {},
		patchProp(node, key, prev, next) { node.props[key] = next }
	}

	// scene 描述 scroll-view 的真实滚动状态，以及 month 子组件量出来的月份几何信息
	const scene = { months: [], tops: [], contentHeight: 0, position: 0, onScroll: null }
	const maxScroll = () => Math.max(0, scene.contentHeight - VIEWPORT)
	const setPosition = value => {
		const next = Math.max(0, Math.min(maxScroll(), value))
		if (next === scene.position) return
		scene.position = next
		// 位置真的变了才会有滚动事件，这正是 issue #776 里副标题掉队的前提
		scene.onScroll && scene.onScroll({ detail: { scrollTop: next } })
	}
	// 视口顶部真正显示的月份：最后一个 top 不大于当前滚动位置的月份
	const shownMonthIndex = () => {
		let index = 0
		scene.tops.forEach((top, i) => {
			if (scene.position >= top) index = i
		})
		return index
	}

	const passthrough = name => ({
		name,
		render() {
			return h('view', { class: name }, this.$slots.default ? this.$slots.default() : [])
		}
	})

	// u-popup 只在 show 为真时渲染内容（真实实现里 u-transition 用 v-if 挂载/卸载）
	const popupStub = {
		name: 'u-popup',
		props: { show: Boolean, pageInline: Boolean },
		render() {
			if (!this.show && !this.pageInline) return null
			return h('view', { class: 'u-popup' }, this.$slots.default ? this.$slots.default() : [])
		}
	}

	// scroll-view 桩：scroll-top 与 scroll-into-view 都只在绑定值“发生变化”时才重新定位，
	// 这就是组件里那句「scrollIntoView需要有一个值变动过程，才会产生作用」描述的行为；
	// 重新挂载出来的 scroll-view 从顶部开始，初始值不会自动生效
	const scrollViewStub = {
		name: 'scroll-view',
		props: {
			scrollTop: { type: [Number, String], default: 0 },
			scrollIntoView: { type: String, default: '' }
		},
		watch: {
			scrollTop(value) {
				setPosition(Number(value) || 0)
			},
			scrollIntoView(value) {
				const matched = /^month-(\d+)$/.exec(value || '')
				if (matched) setPosition(scene.tops[Number(matched[1])] || 0)
			}
		},
		mounted() {
			scene.position = 0
			scene.onScroll = this.$attrs.onScroll
		},
		unmounted() {
			scene.onScroll = null
		},
		render() {
			return h('view', { class: 'scroll-view' }, this.$slots.default ? this.$slots.default() : [])
		}
	}

	// month 桩：对齐 month.vue 的 init()，先抛选中日期，再把量好的 top 交给父组件
	const monthStub = {
		name: 'u-calendar-month',
		props: { months: { type: Array, default: () => [] } },
		emits: ['monthSelected', 'updateMonthTop'],
		mounted() {
			this.$emit('monthSelected', [])
			scene.months = this.months.map(({ year, month }) => ({ year, month }))
			let height = 1
			scene.tops = scene.months.map((item, index) => {
				const top = height
				height += measureMonth(item, index)
				return top
			})
			scene.contentHeight = height
			this.$emit('updateMonthTop', scene.tops)
		},
		render() {
			return h('view', { class: 'u-calendar-month-wrapper' })
		}
	}

	const headerStub = {
		name: 'u-calendar-header',
		props: { subtitle: { type: String, default: '' } },
		render() {
			return h('view', { class: 'u-calendar-header', subtitle: this.subtitle })
		}
	}

	const Calendar = {
		...options,
		components: { ...options.components, uHeader: headerStub, uMonth: monthStub },
		render
	}
	const state = reactive({ show: false })
	const { createApp } = createRenderer(nodeOps)
	const app = createApp({ render: () => h(Calendar, { ...props, show: state.show }) })
	app.component('view', passthrough('view'))
	app.component('text', passthrough('text'))
	app.component('scroll-view', scrollViewStub)
	app.component('picker-view', passthrough('picker-view'))
	app.component('picker-view-column', passthrough('picker-view-column'))
	app.component('u-popup', popupStub)
	app.component('u-button', { render: () => h('view') })
	app.component('up-icon', { render: () => h('view') })
	app.mount(nodeOps.createElement('root'))

	const settle = async () => {
		for (let i = 0; i < 6; i++) await nextTick()
	}
	const subtitle = () => {
		const node = nodes.findLast(item => item.props && item.props.class === 'u-calendar-header')
		return node ? node.props.subtitle : null
	}

	return {
		scene,
		settle,
		subtitle,
		shownMonthIndex,
		maxScroll,
		setPosition,
		open: async () => { state.show = true; await settle() },
		close: async () => { state.show = false; await settle() },
		unmount: () => app.unmount()
	}
}

// 复现步骤：打开 → 滑到最底部 → 关闭 → 再次打开，每一步副标题都必须与视口顶部的月份一致
async function runScenario({ platform, label, props, defaultMonth }) {
	const calendar = await mountCalendar(platform, props)
	const describe = step => `${platform} ${label} ${step}`
	const assertSubtitleMatchesContent = step => {
		const index = calendar.shownMonthIndex()
		const shown = calendar.scene.months[index]
		assert.ok(shown, describe(`${step}：应量出月份几何信息`))
		assert.equal(
			calendar.subtitle(),
			expectedSubtitle(shown),
			describe(`${step}：副标题应与视口顶部显示的月份（month-${index}）一致`)
		)
	}

	await calendar.open()
	assert.equal(calendar.scene.months.length, 13, describe('首次打开：应生成13个月份'))
	assertSubtitleMatchesContent('首次打开')
	// 打开时应停在默认月份上
	assert.equal(
		calendar.scene.months[calendar.shownMonthIndex()].year + '-' + padMonth(calendar.scene.months[calendar.shownMonthIndex()].month),
		defaultMonth,
		describe('首次打开：应停在默认月份')
	)

	// 用户一路滑到底部
	calendar.setPosition(calendar.maxScroll())
	await calendar.settle()
	assert.equal(
		calendar.shownMonthIndex(),
		calendar.scene.months.length - 1,
		describe('滑动到底部：视口顶部应是最后一个月份')
	)
	assertSubtitleMatchesContent('滑动到底部')

	// 点遮罩/关闭按钮收起日历，再次打开
	await calendar.close()
	await calendar.open()
	assertSubtitleMatchesContent('再次打开')
	assert.equal(
		calendar.scene.months[calendar.shownMonthIndex()].year + '-' + padMonth(calendar.scene.months[calendar.shownMonthIndex()].month),
		defaultMonth,
		describe('再次打开：应重新回到默认月份')
	)

	// 再次打开后继续滑动，副标题仍要跟着滚动位置走
	calendar.setPosition(calendar.scene.tops[3])
	await calendar.settle()
	assertSubtitleMatchesContent('再次打开后继续滑动')

	calendar.unmount()
}

// issue 里的参数：日期范围为过去一年，monthNum=13，未传 defaultDate（今天不在范围内，
// 于是没有任何月份可以滚动过去，问题最容易暴露）
const reporterProps = { minDate: '2024-07-05', maxDate: '2025-07-05', monthNum: 13 }
for (const platform of ['h5', 'mp-weixin']) {
	await runScenario({
		platform,
		label: '未传defaultDate',
		props: reporterProps,
		defaultMonth: '2024-07'
	})
	// 默认月份在中间时，重新打开要滚回默认月份，副标题也要跟着回去
	await runScenario({
		platform,
		label: 'defaultDate在中间月份',
		props: { ...reporterProps, defaultDate: '2025-01-10' },
		defaultMonth: '2025-01'
	})
}

// onScroll 不能再用 listHeight 兜底：月份 top 还没量出来时所有月份的判断阈值相同，
// 循环会把 monthIndex 推到最后一个月份，副标题直接跳到末月
assert.doesNotMatch(
	descriptor.script.content,
	/this\.months\[i\]\.top \|\| this\.listHeight/,
	'onScroll must not fall back to listHeight as the per-month threshold'
)

console.log('calendar subtitle sync assertions passed')

