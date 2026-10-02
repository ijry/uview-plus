import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const select = read('src/uni_modules/uview-plus/components/u-select/u-select.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:select-panel'],
	'node scripts/verify-select-panel.mjs',
	'expected package.json to expose verify:select-panel'
)

// —— 面板要有指向触发区的三角形指示器 ——
assert.match(
	select,
	/arrow:\s*\{\s*\n\s*type:\s*Boolean,\s*\n\s*default:\s*true/,
	'expected an arrow prop defaulting to true'
)
assert.match(
	select,
	/<view class="u-select__arrow"[\s\S]*?u-select__arrow__outer[\s\S]*?u-select__arrow__inner[\s\S]*?<\/view>/,
	'expected the arrow to be drawn as an outer/inner triangle pair'
)
// 指示器必须画在 u-select__options__wrap 之外，否则会被面板的 overflow 裁掉
assert.ok(
	select.indexOf('<view class="u-select__arrow"') < select.indexOf('<view class="u-select__options__wrap"'),
	'expected the arrow to sit outside the scrollable options wrap'
)
assert.match(select, /&--bottom \{[\s\S]*?border-bottom-color:/, 'expected a downward panel arrow')
assert.match(select, /&--top \{[\s\S]*?border-top-color:/, 'expected an upward panel arrow')

// —— 展开方向按上下剩余空间算，放不下就限高滚动，不能把页面撑高 ——
assert.match(
	select,
	/placement:\s*\{\s*\n\s*type:\s*String,\s*\n\s*default:\s*'auto'/,
	'expected a placement prop defaulting to auto'
)
assert.match(
	select,
	/adjustOptionsWrapPosition\(\)\s*\{[\s\S]*?\$uGetRect\('\.u-select__label'\)/,
	'expected the trigger rect to be measured before choosing a direction'
)
assert.match(
	select,
	/const spaceBelow = windowHeight - labelRect\.bottom[\s\S]*?const spaceAbove = labelRect\.top/,
	'expected both the space below and above the trigger to be computed'
)
assert.match(
	select,
	/if \(this\.placement === 'auto' && wrapRect\.height > spaceBelow && spaceAbove > spaceBelow\)\s*\{\s*\n[^\n]*\n\s*this\.optionsPlacement = 'top'/,
	'expected the panel to flip above the trigger when there is no room below'
)
assert.match(
	select,
	/if \(space > 0 && wrapRect\.height > space\)\s*\{\s*\n\s*this\.optionsWrapMaxHeight = `\$\{Math\.floor\(space\)\}px`/,
	'expected the panel to be capped to the remaining space instead of overflowing the window'
)
assert.match(
	select,
	/maxHeight: this\.optionsWrapMaxHeight \|\| this\.maxHeight/,
	'expected the computed cap to win over the maxHeight prop'
)
assert.match(
	select,
	/if \(this\.optionsPlacement === 'top'\)\s*\{\s*\n\s*style\.top = 'auto';\s*\n\s*style\.bottom = `calc\(100% \+ \$\{this\.panelGap\}px\)`/,
	'expected the upward placement to anchor the panel with bottom'
)
// 向下展开时 margin-bottom 无效，翻转向上时却会额外顶起 46px
assert.doesNotMatch(select, /margin-bottom:\s*46px/, 'expected the dead 46px wrap margin to be gone')

// —— 多选 ——
assert.match(
	select,
	/multiple:\s*\{\s*\n\s*type:\s*Boolean,\s*\n\s*default:\s*false/,
	'expected a multiple prop'
)
assert.match(
	select,
	/current:\s*\{\s*\n\s*type:\s*\[String, Number, Array\]/,
	'expected current to accept an array for multiple mode'
)
// 多选分支必须在关闭面板之前 return，否则连续勾选每次都会收起
assert.match(
	select,
	/selectItem\(item\)\s*\{[\s\S]*?if \(this\.multiple\)\s*\{[\s\S]*?this\.\$emit\('update:current', list\);[\s\S]*?return;[\s\S]*?\}\s*\n\s*this\.isOpen = false;/,
	'expected multiple mode to toggle the value list and keep the panel open'
)
assert.match(select, /return names\.join\('、'\);/, 'expected the trigger text to join every selected label')

// —— 打开时回显之前选中的内容 ——
// 选项颜色是行内绑定的，选中态必须走同一个绑定，靠 .active 类改颜色会被行内样式盖掉
assert.match(
	select,
	/:style="\{ color: itemTextColor\(item\) \}"/,
	'expected the option row colour to come from itemTextColor'
)
assert.match(
	select,
	/itemTextColor\(item\)\s*\{[\s\S]*?this\.isSelected\(item\) \? this\.resolvedActiveColor : this\.resolvedItemColor/,
	'expected the selected row to use the active colour'
)
assert.match(
	select,
	/&\.active \{\s*\n\s*background-color:/,
	'expected the active class to finally carry a style of its own'
)
assert.match(
	select,
	/<up-icon v-if="isSelected\(item\)" name="checkbox-mark"/,
	'expected a check mark on the selected rows'
)
// current 为空时不能走宽松比较，否则 key 为 0 的项会被当成选中
assert.match(
	select,
	/isSelected\(item\)\s*\{[\s\S]*?if \(this\.current === '' \|\| this\.current === null \|\| typeof this\.current === 'undefined'\)\s*\{\s*\n\s*return false;/,
	'expected isSelected to bail out when nothing is selected'
)

console.log('select panel assertions passed')
