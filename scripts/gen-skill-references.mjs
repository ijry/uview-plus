// 生成 AI skill 需要的两份索引：组件清单与图标名清单。
// 这两份索引一旦与源码不一致，AI 就会写出不存在的组件名或图标名（图标名写错不报错，只是不显示），
// 所以不手写，改由本脚本从源码生成，再由 scripts/verify-skill-assets.mjs 守住不漂移。
//
//   node scripts/gen-skill-references.mjs   # 重新生成两份索引
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const packageDir = 'src/uni_modules/uview-plus'
export const skillDir = `${packageDir}/skills/uview-plus`
export const componentIndexPath = `${skillDir}/references/components.md`
export const iconIndexPath = `${skillDir}/references/icons.md`

const read = relativePath => readFileSync(resolve(repoRoot, relativePath), 'utf8')

// 取 JSDoc 里某个标签的首行内容，用于组件一句话说明与文档链接
function pickTag(source, tag) {
	const matched = source.match(new RegExp(`@${tag}\\s+([^\\r\\n]*)`))
	if (!matched) return ''
	return matched[1]
		.replace(/\s*\*\/\s*$/, '')
		.replace(/\s+/g, ' ')
		.replace(/\|/g, '\\|')
		.replace(/[,，、]$/, '')
		.trim()
}

// easycom 三条规则都把 up-x / u-x / u--x 解析到 components/u-x/u-x.vue，
// 因此"可用组件"就是以 u- 开头、且存在同名 .vue 入口的目录。
// components/uview-plus 是插件市场用的空占位组件，u-section 只有 section.js，两者都不算组件。
export function listComponents() {
	const componentsDir = resolve(repoRoot, packageDir, 'components')
	return readdirSync(componentsDir, { withFileTypes: true })
		.filter(entry => entry.isDirectory() && entry.name.startsWith('u-'))
		.map(entry => entry.name)
		.filter(name => existsSync(resolve(componentsDir, name, `${name}.vue`)))
		.sort()
		.map(name => {
			const source = read(`${packageDir}/components/${name}/${name}.vue`)
			return {
				name,
				upName: name.replace(/^u-/, 'up-'),
				description: pickTag(source, 'description'),
				doc: pickTag(source, 'tutorial')
			}
		})
}

// 图标名来自 components/u-icon/icons.js 的键，组件内部会自动补 uicon- 前缀
export function listIcons() {
	const source = read(`${packageDir}/components/u-icon/icons.js`)
	const names = [...source.matchAll(/'uicon-([A-Za-z0-9-]+)'\s*:/g)].map(matched => matched[1])
	return [...new Set(names)].sort()
}

export function buildComponentIndex() {
	const components = listComponents()
	const rows = components.map(component => {
		const doc = component.doc ? `[文档](${component.doc})` : '-'
		return `| \`${component.upName}\` | ${component.description || '-'} | ${doc} |`
	})
	return [
		'# 组件清单',
		'',
		'> 本文件由 `scripts/gen-skill-references.mjs` 从源码生成，请勿手改。',
		'',
		`共 ${components.length} 个组件。表中是推荐的 \`up-\` 写法，把前缀换成 \`u-\` 或 \`u--\` 等价可用。`,
		'',
		'**清单里没有的名字就是不存在**，不要凭印象拼组件名。查一个组件的属性、事件、插槽：',
		'',
		'- `components/u-<名字>/u-<名字>.vue` 顶部 JSDoc 的 `@property` / `@event`，是最完整的一手说明',
		'- `components/u-<名字>/props.js` 是属性的真实默认值（部分组件没有这个文件，属性直接写在 `.vue` 里）',
		'- `types/comps/<驼峰名>.d.ts` 是 TS 类型（覆盖常用组件，不是全部）',
		'',
		'例如 `up-button` 对应 `components/u-button/u-button.vue`、`components/u-button/props.js`、`types/comps/button.d.ts`。',
		'',
		'| 组件 | 说明 | 文档 |',
		'| --- | --- | --- |',
		...rows,
		''
	].join('\n')
}

export function buildIconIndex() {
	const icons = listIcons()
	return [
		'# 图标名清单',
		'',
		'> 本文件由 `scripts/gen-skill-references.mjs` 从源码生成，请勿手改。',
		'',
		`\`up-icon\` 内置图标共 ${icons.length} 个，来源是 \`components/u-icon/icons.js\`。`,
		'',
		'用法是去掉 `uicon-` 前缀的名字：`<up-icon name="star-fill" size="20"></up-icon>`。',
		'',
		'**名字写错不会报错，只会渲染不出图标**，所以务必从下面的清单里挑，或者改用 `customIcon` 扩展自己的字体图标。',
		'',
		...icons.map(icon => `- \`${icon}\``),
		''
	].join('\n')
}

function writeIfChanged(relativePath, content) {
	const absolutePath = resolve(repoRoot, relativePath)
	const previous = existsSync(absolutePath) ? readFileSync(absolutePath, 'utf8') : ''
	if (previous === content) {
		console.log(`unchanged ${relativePath}`)
		return
	}
	writeFileSync(absolutePath, content)
	console.log(`written   ${relativePath}`)
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(repoRoot, 'scripts/gen-skill-references.mjs')) {
	writeIfChanged(componentIndexPath, buildComponentIndex())
	writeIfChanged(iconIndexPath, buildIconIndex())
}
