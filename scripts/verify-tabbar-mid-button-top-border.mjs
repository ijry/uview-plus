import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')
const tabbarItem = read('src/uni_modules/uview-plus/components/u-tabbar-item/u-tabbar-item.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:tabbar-mid-button-top-border'],
	'node scripts/verify-tabbar-mid-button-top-border.mjs'
)
assert.match(tabbarItem, /class="u-tabbar-item__mid-button-border"/)
assert.match(tabbarItem, /class="u-tabbar-item__mid-button-border-circle"/)
assert.match(tabbarItem, /\.u-tabbar-item__icon--mid-button[\s\S]*width:\s*64px[\s\S]*height:\s*64px/)
assert.match(tabbarItem, /hasMidButtonText\(\)[\s\S]*this\.\$slots\.text[\s\S]*String\(this\.text \|\| ''\)\.length > 0/)
assert.match(tabbarItem, /resolvedMidButtonOffsetY\(\)[\s\S]*Number\.parseFloat\(this\.midButtonOffsetY\)/)
assert.match(tabbarItem, /:customStyle="midButtonIconStyle"/)
assert.match(tabbarItem, /midButtonIconStyle\(\)[\s\S]*position:\s*'relative'[\s\S]*zIndex:\s*2/)
assert.match(tabbarItem, /midButtonTranslateY\(\)[\s\S]*`\$\{this\.resolvedMidButtonOffsetY\}px`/)
assert.match(tabbarItem, /midButtonBorderClipHeight\(\)[\s\S]*this\.hasMidButtonText \? 15\.5 : 7[\s\S]*clipBaseHeight - this\.resolvedMidButtonOffsetY/)
assert.match(tabbarItem, /this\.isMidButton && !this\.hasMidButtonText \? 'u-tabbar-item--mid-button-no-text' : ''/)
assert.match(tabbarItem, /\.u-tabbar-item__mid-button-border[\s\S]*width:\s*64px[\s\S]*height:\s*v-bind\('midButtonBorderClipHeight'\)/)
assert.match(tabbarItem, /#ifdef APP-NVUE[\s\S]*\.u-tabbar-item__mid-button-border[\s\S]*height:\s*15\.5px/)
assert.match(tabbarItem, /#ifdef APP-NVUE[\s\S]*\.u-tabbar-item--mid-button-no-text \.u-tabbar-item__mid-button-border[\s\S]*height:\s*7px/)
assert.match(tabbarItem, /\.u-tabbar-item__mid-button-border[\s\S]*overflow:\s*hidden/)
assert.match(tabbarItem, /\.u-tabbar-item__mid-button-border-circle[\s\S]*width:\s*64px[\s\S]*height:\s*64px/)
assert.match(tabbarItem, /background:\s*transparent/)
assert.match(tabbarItem, /pointer-events:\s*none/)
assert.match(tabbarItem, /\.u-tabbar-item__mid-button-border[\s\S]*z-index:\s*0/)
assert.match(tabbarItem, /\.u-tabbar-item__mid-button-inner[\s\S]*z-index:\s*1/)
assert.match(tabbarItem, /:deep\(\.u-icon\)[\s\S]*z-index:\s*2/)
assert.match(tabbarItem, /class="u-tabbar-item__icon"[\s\S]*class="u-tabbar-item__mid-button-border"[\s\S]*class="u-tabbar-item__mid-button-border-circle"[\s\S]*class="u-tabbar-item__mid-button-inner"/)
assert.match(tabbarItem, /\.u-tabbar-item__mid-button-border[\s\S]*left:\s*0/)
assert.match(tabbarItem, /\.u-tabbar-item__mid-button-border[\s\S]*top:\s*0/)
assert.match(tabbarItem, /&__content\s*\{[\s\S]*?&--mid-button\s*\{[\s\S]*?transform:\s*translateY\(v-bind\('midButtonTranslateY'\)\)/)
assert.doesNotMatch(tabbarItem, /midButtonBorderStyle/)
assert.doesNotMatch(tabbarItem, /\.u-tabbar-item--mid-button\s*\{[^}]*transform:\s*translateY/)
assert.doesNotMatch(tabbarItem, /u-tabbar-item__mid-button-arc/)
assert.doesNotMatch(tabbarItem, /<svg/)

console.log('tabbar mid-button top border assertions passed')
