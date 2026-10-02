import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'

import {
	buildComponentIndex,
	buildIconIndex,
	componentIndexPath,
	iconIndexPath,
	listComponents,
	listIcons,
	packageDir,
	repoRoot,
	skillDir
} from './gen-skill-references.mjs'

// issue #1054：仓库此前没有任何面向 AI 的资料，AI 写 uview-plus 代码只能靠猜，
// 于是把 skill 随包分发（skills/ 在包目录内，npm 与 uni_modules 两种装法都能拿到）。
// skill 的价值全在"内容与源码一致"，一旦漂移就会主动教 AI 写错，因此本脚本守住这一点。

const read = relativePath => readFileSync(resolve(repoRoot, relativePath), 'utf8')
const skillMd = read(`${skillDir}/SKILL.md`)
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:skill-assets'],
	'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-skill-assets.mjs',
	'package.json should expose verify:skill-assets'
)

// --- skill 必须落在会被发布的包目录内，否则用户装完拿不到
assert.ok(
	skillDir.startsWith(`${packageDir}/`),
	'the skill bundle must live inside the published package directory'
)
assert.ok(existsSync(resolve(repoRoot, `${packageDir}/skills/README.md`)), 'skills/README.md should exist')

// --- SKILL.md 的 frontmatter 要满足 Agent Skills 的约定
const frontmatter = skillMd.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
assert.ok(frontmatter, 'SKILL.md must start with a YAML frontmatter block')
const skillName = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1].trim()
const skillDescription = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1].trim()
assert.equal(skillName, 'uview-plus', 'the skill name must match its directory name')
assert.ok(skillDescription, 'SKILL.md needs a description so agents can decide when to load it')
assert.ok(skillDescription.length <= 1024, 'the skill description must stay within 1024 characters')

// --- 参考文件与 SKILL.md 双向对齐，既不能引用不存在的文件，也不能有没被索引的孤儿文件
const referenceFiles = readdirSync(resolve(repoRoot, skillDir, 'references')).sort()
assert.deepEqual(
	referenceFiles,
	['api.md', 'components.md', 'icons.md', 'pitfalls.md', 'setup.md'],
	'unexpected reference file set'
)
for (const file of referenceFiles) {
	assert.ok(skillMd.includes(`references/${file}`), `SKILL.md should route to references/${file}`)
}
for (const referenced of skillMd.matchAll(/references\/([\w.-]+\.md)/g)) {
	assert.ok(referenceFiles.includes(referenced[1]), `SKILL.md references a missing file: ${referenced[1]}`)
}

// --- 生成的两份索引必须与源码同步（漂移就等于教 AI 写不存在的名字）
assert.equal(
	read(componentIndexPath),
	buildComponentIndex(),
	'components.md is stale, run: node scripts/gen-skill-references.mjs'
)
assert.equal(
	read(iconIndexPath),
	buildIconIndex(),
	'icons.md is stale, run: node scripts/gen-skill-references.mjs'
)

const components = listComponents()
assert.ok(components.length > 100, 'the component index looks suspiciously short')
for (const component of components) {
	assert.ok(
		existsSync(resolve(repoRoot, packageDir, 'components', component.name, `${component.name}.vue`)),
		`${component.upName} has no entry file`
	)
}

// icons.md 教用户去掉 uicon- 前缀，这条前提由 u-icon 的解析逻辑保证
assert.match(
	read(`${packageDir}/components/u-icon/u-icon.vue`),
	/icons\['uicon-'\s*\+\s*this\.name\]/,
	'u-icon no longer prefixes icon names with uicon-, icons.md would be wrong'
)
const icons = listIcons()
assert.ok(icons.includes('star-fill'), 'the icon index should contain the documented star-fill example')

// --- easycom 三条规则：skill 里写的必须和示例工程 pages.json 里的一致
// pages.json 是 GBK 编码，只按 ASCII 匹配规则键
const easycomKeys = ['"^u--(.*)"', '"^up-(.*)"', '"^u-([^-].*)"']
const pagesJson = readFileSync(resolve(repoRoot, 'src/pages.json'), 'latin1')
const setupMd = read(`${skillDir}/references/setup.md`)
for (const key of easycomKeys) {
	assert.ok(pagesJson.includes(key), `src/pages.json lost the easycom rule ${key}`)
	assert.ok(setupMd.includes(key), `references/setup.md is missing the easycom rule ${key}`)
}

// --- v-model:show 的组件名单是手写的，用组件真实的 emits 反查，防止名单过期
const showModelComponents = components
	.filter(component => {
		const source = read(`${packageDir}/components/${component.name}/${component.name}.vue`)
		return source.match(/emits:\s*\[[^\]]*\]/)?.[0].includes('update:show') ?? false
	})
	.map(component => component.upName)
assert.ok(showModelComponents.length > 0, 'no component emits update:show anymore, the docs would be wrong')

const pitfallsMd = read(`${skillDir}/references/pitfalls.md`)
for (const [fileName, content] of [['SKILL.md', skillMd], ['references/pitfalls.md', pitfallsMd]]) {
	const listedLine = content
		.split(/\r?\n/)
		.find(line => line.includes('update:show') && line.includes('v-model:show'))
	assert.ok(listedLine, `${fileName} should explain the v-model:show component set`)
	const listed = [...listedLine.matchAll(/`(up-[a-z-]+)`/g)].map(matched => matched[1]).sort()
	assert.deepEqual(
		listed,
		[...showModelComponents].sort(),
		`${fileName} lists the wrong set of update:show components`
	)
}

// --- SKILL.md 里的样板代码是 AI 最可能照抄的一段，必须能编译、且每个属性真实存在
const sample = skillMd.match(/```vue\r?\n([\s\S]*?)```/)?.[1]
assert.ok(sample, 'SKILL.md should ship a runnable sample')
assert.match(sample, /<template>[\s\S]*<\/template>/, 'the sample needs a template block')
assert.match(sample, /<script setup>[\s\S]*<\/script>/, 'the sample needs a script setup block')

// 未安装依赖的裸检出（例如新建的 worktree）也要能跑，SFC 解析在依赖可用时才做
let parseSfc = null
try {
	parseSfc = createRequire(import.meta.url)('@vue/compiler-sfc').parse
} catch {
	console.log('note: @vue/compiler-sfc unavailable, skipping SFC parse of the sample')
}
if (parseSfc) {
	const { errors } = parseSfc(sample, { filename: 'skill-sample.vue' })
	assert.deepEqual(errors, [], 'the SKILL.md sample must be a valid SFC')
}

// 全局 mixin 提供的属性 + 模板通用属性，不属于组件自身 props
const mixinProps = ['customStyle', 'customClass', 'url', 'linkType']
const templateAttrs = ['ref', 'key', 'id', 'class', 'style', 'slot']

function componentProps(componentName) {
	// 约四分之一的组件没有 props.js，属性直接写在 .vue 里
	const propsFile = `${packageDir}/components/${componentName}/props.js`
	const source = existsSync(resolve(repoRoot, propsFile))
		? read(propsFile)
		: read(`${packageDir}/components/${componentName}/${componentName}.vue`)
	const propsBlock = source.slice(source.indexOf('props: {'))
	return [...propsBlock.matchAll(/^\s+([a-zA-Z][\w]*):\s*\{/gm)].map(matched => matched[1])
}

for (const tag of sample.matchAll(/<up-([a-z-]+)([^>]*?)\/?>/g)) {
	const componentName = `u-${tag[1]}`
	assert.ok(
		components.some(component => component.name === componentName),
		`the sample uses <up-${tag[1]}>, which does not exist`
	)
	const allowed = [...componentProps(componentName), ...mixinProps, ...templateAttrs]
	for (const attr of tag[2].matchAll(/(^|\s)([:@]?[\w.-]+)(?==|\s|$)/g)) {
		const raw = attr[2]
		if (raw.startsWith('v-') || raw.startsWith('@')) continue
		const name = raw.replace(/^:/, '')
		assert.ok(
			allowed.includes(name),
			`the sample passes "${name}" to <up-${tag[1]}>, which has no such prop`
		)
	}
}

// --- api.md 里列的函数必须真实存在，且"挂在哪里"的说法要和 index.js 一致
const packageIndex = read(`${packageDir}/index.js`)
const functionIndex = read(`${packageDir}/libs/function/index.js`)

// uni.$u 上的键：$u 对象字面量的顶层键，外加 ...index 展开进来的 libs/function/index.js 默认导出
const dollarUKeys = [
	...packageIndex.slice(packageIndex.indexOf('const $u = {')).split('\n}')[0].matchAll(/^\s+([\w$]+)\s*[,:]/gm)
].map(matched => matched[1])
const functionDefaultExportKeys = [
	...functionIndex.slice(functionIndex.lastIndexOf('export default {')).matchAll(/^\s+([\w$]+),?$/gm)
].map(matched => matched[1])

// 包根的具名导出：index.js 自己的 export 块，加上 export * 转出去的函数
const starReExported = [
	...functionIndex.matchAll(/^export function ([\w$]+)/gm),
	...read(`${packageDir}/libs/function/colorGradient.js`).matchAll(/^export function ([\w$]+)/gm)
].map(matched => matched[1])
const namedExports = [
	...packageIndex.matchAll(/^\s+([\w$]+),?$/gm),
	...packageIndex.matchAll(/^export function ([\w$]+)/gm)
].map(matched => matched[1])

const knownHelpers = new Set([
	...dollarUKeys,
	...functionDefaultExportKeys,
	...starReExported,
	...namedExports
])
assert.ok(dollarUKeys.includes('route'), 'failed to parse the $u object from index.js')
assert.ok(functionDefaultExportKeys.includes('timeFormat'), 'failed to parse libs/function/index.js')

// api.md 明确写了这两个只能具名导入，一旦被挂到 $u 上这句话就该删掉
const onDollarU = new Set([...dollarUKeys, ...functionDefaultExportKeys])
for (const importOnly of ['digit', 'getDeviceInfo']) {
	assert.ok(
		!onDollarU.has(importOnly),
		`${importOnly} is now on uni.$u, references/api.md still calls it import-only`
	)
}

const apiMd = read(`${skillDir}/references/api.md`)
const helperRows = apiMd
	.slice(apiMd.indexOf('## 常用函数'), apiMd.indexOf('节点查询优先用'))
	.split(/\r?\n/)
	.filter(line => line.startsWith('|') && !line.startsWith('| ---') && !line.startsWith('| 分类'))
assert.ok(helperRows.length >= 8, 'failed to locate the helper table in references/api.md')
for (const row of helperRows) {
	for (const cell of row.matchAll(/`([^`]+)`/g)) {
		const identifier = cell[1].replace(/^uni\.\$u\.?/, '').split(/[(.\s/]/)[0]
		if (!/^[A-Za-z_$][\w$]*$/.test(identifier)) continue
		assert.ok(
			knownHelpers.has(identifier),
			`references/api.md mentions "${identifier}", which the package does not export`
		)
	}
}

// api.md 声称主题方法只在 uni.$u 上，这条一旦变了会把使用者引到错误的 import
assert.ok(dollarUKeys.includes('setTheme'), 'uni.$u.setTheme is gone, references/api.md needs updating')
assert.ok(
	!/^\s+setTheme,?$/m.test(packageIndex.slice(packageIndex.indexOf('// 导出'), packageIndex.indexOf('export *'))),
	'setTheme is now a named export, references/api.md says it is not'
)

console.log(`skill assets ok: ${components.length} components, ${icons.length} icons`)
