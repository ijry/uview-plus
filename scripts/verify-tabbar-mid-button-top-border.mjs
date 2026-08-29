import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const { calculateMidButtonBorderClipHeight } = await import('../src/uni_modules/uview-plus/components/u-tabbar-item/midButtonGeometry.js')

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')
const tabbar = read('src/uni_modules/uview-plus/components/u-tabbar/u-tabbar.vue')
const tabbarItem = read('src/uni_modules/uview-plus/components/u-tabbar-item/u-tabbar-item.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
	packageJson.scripts['verify:tabbar-mid-button-top-border'],
	'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-tabbar-mid-button-top-border.mjs'
)
assert.match(tabbarItem, /class="u-tabbar-item__mid-button-border"/)
assert.match(tabbarItem, /class="u-tabbar-item__mid-button-border-circle"/)
assert.match(tabbarItem, /\.u-tabbar-item__icon--mid-button[\s\S]*width:\s*64px[\s\S]*height:\s*64px/)
assert.match(tabbarItem, /hasMidButtonText\(\)[\s\S]*this\.\$slots\.text[\s\S]*String\(this\.text \|\| ''\)\.length > 0/)
assert.match(tabbarItem, /resolvedMidButtonOffsetY\(\)[\s\S]*Number\.parseFloat\(this\.midButtonOffsetY\)/)
assert.match(tabbarItem, /borderColor:\s*''/)
assert.match(tabbar, /this\.textMode,[\s\S]*this\.borderColor/)
assert.match(tabbarItem, /:customStyle="midButtonIconStyle"/)
assert.match(tabbarItem, /midButtonIconStyle\(\)[\s\S]*position:\s*'relative'[\s\S]*zIndex:\s*2/)
assert.match(tabbarItem, /midButtonTranslateY\(\)[\s\S]*`\$\{this\.resolvedMidButtonOffsetY\}px`/)
assert.match(tabbarItem, /midButtonBorderClipHeight\(\)[\s\S]*midButtonBorderClipHeightValue/)
assert.match(tabbarItem, /:style="midButtonBorderCircleStyle"/)
assert.match(tabbarItem, /midButtonBorderCircleStyle\(\)[\s\S]*this\.parentData\.borderColor[\s\S]*borderColor:\s*this\.parentData\.borderColor/)
assert.match(tabbarItem, /this\.isMidButton && !this\.hasMidButtonText \? 'u-tabbar-item--mid-button-no-text' : ''/)
assert.match(tabbarItem, /class="u-tabbar-item__mid-button-border"[\s\S]*:style="midButtonBorderStyle"/)
assert.doesNotMatch(tabbarItem, /height:\s*v-bind\('midButtonBorderClipHeight'\)/)
assert.doesNotMatch(tabbarItem, /height:\s*15\.5px/)
assert.doesNotMatch(tabbarItem, /height:\s*7px/)
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
assert.match(tabbar, /midButtonBorderTopOffset\(\)[\s\S]*this\.border \? 0\.25 : 0/)
assert.match(tabbarItem, /calculateMidButtonBorderClipHeight/)
assert.match(tabbarItem, /this\.parentData\.border \? this\.parentData\.midButtonBorderTopOffset : 0/)
assert.match(tabbarItem, /rect\.height <= 0/)
assert.match(tabbarItem, /iconContentClassNames\(\)/)
assert.match(tabbarItem, /!this\.isMidButton \? `u-tabbar-item__icon--anim-/)
assert.doesNotMatch(tabbarItem, /\.u-tabbar-item--mid-button\s*\{[^}]*transform:\s*translateY/)
assert.doesNotMatch(tabbarItem, /u-tabbar-item__mid-button-arc/)
assert.doesNotMatch(tabbarItem, /<svg/)

assert.equal(calculateMidButtonBorderClipHeight({ contentTop: 0, circleTop: -23.5, borderTopOffset: 0.25 }), 23.75)
assert.equal(calculateMidButtonBorderClipHeight({ contentTop: 0, circleTop: -12.25, borderTopOffset: 0 }), 12.25)
assert.equal(calculateMidButtonBorderClipHeight({ contentTop: 10, circleTop: -100, borderTopOffset: 0.25 }), 64)
assert.equal(calculateMidButtonBorderClipHeight({ contentTop: 10, circleTop: 100, borderTopOffset: 0.25 }), 0)

console.log('tabbar mid-button top border assertions passed')
