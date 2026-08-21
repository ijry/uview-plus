import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const navbar = read('src/uni_modules/uview-plus/components/u-navbar/u-navbar.vue')
const navbarProps = read('src/uni_modules/uview-plus/components/u-navbar/props.js')
const navbarDefaults = read('src/uni_modules/uview-plus/components/u-navbar/navbar.js')
const navbarTypes = read('src/uni_modules/uview-plus/types/comps/navbar.d.ts')
const themeVars = read('src/uni_modules/uview-plus/components/u-navbar/theme-vars.scss')
const themeRuntime = read('src/uni_modules/uview-plus/libs/theme/runtime.js')
const themeCore = read('src/uni_modules/uview-plus/libs/theme/theme.js')
const demo = read('src/pages/componentsC/navbarIos/navbarIos.vue')
const pagesJson = read('src/pages.json')
const changelog = read('src/uni_modules/uview-plus/changelog.md')
const packageJson = JSON.parse(read('package.json'))

// 1. 脚本注册
assert.equal(
    packageJson.scripts['verify:navbar-ios-mode'],
    'node scripts/verify-navbar-ios-mode.mjs',
    'expected package.json to expose verify:navbar-ios-mode'
)

// 2. 属性三处注册
assert.match(
    navbarDefaults,
    /mode:\s*'default'/,
    'expected navbar.js to default mode to "default"'
)
assert.match(
    navbarDefaults,
    /scrollTop:\s*0/,
    'expected navbar.js to default scrollTop to 0'
)
assert.match(
    navbarProps,
    /mode:\s*\{[\s\S]{0,120}?type:\s*String[\s\S]{0,120}?defProps\.navbar\.mode/,
    'expected props.js to register the mode prop'
)
assert.match(
    navbarProps,
    /scrollTop:\s*\{[\s\S]{0,160}?type:\s*\[String,\s*Number\][\s\S]{0,160}?defProps\.navbar\.scrollTop/,
    'expected props.js to register the scrollTop prop'
)
assert.match(
    navbarTypes,
    /mode\?:\s*'default'\s*\|\s*'ios'/,
    'expected navbar.d.ts to type mode as a default/ios union'
)
assert.match(
    navbarTypes,
    /scrollTop\?:\s*string\s*\|\s*number/,
    'expected navbar.d.ts to type scrollTop'
)

// 3. 大标题常量与有效行高
assert.match(
    navbar,
    /const\s+LARGE_TITLE_HEIGHT\s*=\s*52/,
    'expected LARGE_TITLE_HEIGHT constant to be 52'
)
assert.match(
    navbar,
    /largeTitleHeight\(\)\s*\{[\s\S]{0,200}?this\.title\s*\?\s*LARGE_TITLE_HEIGHT\s*:\s*0/,
    'expected effective large-title height to collapse to 0 when title is empty'
)

// 4. 进度公式与两条曲线
assert.match(
    navbar,
    /navbarProgress\(\)\s*\{[\s\S]{0,400}?getPx\(this\.scrollTop\)[\s\S]{0,200}?\/\s*height/,
    'expected progress to divide scrollTop by the effective large-title height'
)
assert.match(
    navbar,
    /navbarGlassOpacity\(\)\s*\{[\s\S]{0,200}?this\.navbarProgress\s*\/\s*0\.5/,
    'expected glass opacity to reach full at progress 0.5'
)
assert.match(
    navbar,
    /navbarCenterOpacity\(\)\s*\{[\s\S]{0,240}?\(this\.navbarProgress\s*-\s*0\.75\)\s*\/\s*0\.25/,
    'expected center title opacity to start at progress 0.75'
)

// 5. nvue 降级
assert.match(
    navbar,
    /isIosMode\(\)\s*\{[\s\S]{0,400}?#ifdef APP-NVUE[\s\S]{0,120}?return false/,
    'expected APP-NVUE to force the ios mode off'
)

// 6. 玻璃层为独立绝对定位元素，带 -webkit- 前缀
assert.match(
    navbar,
    /class="u-navbar__glass"[\s\S]{0,200}?navbarGlassOpacity/,
    'expected a dedicated glass layer bound to navbarGlassOpacity'
)
assert.match(
    navbar,
    /-webkit-backdrop-filter:\s*saturate\(180%\)\s*blur\(var\(--up-navbar-glass-blur,\s*20px\)\)/,
    'expected the -webkit- prefixed backdrop-filter with a CSS var fallback'
)
assert.match(
    navbar,
    /(?<!-)\bbackdrop-filter:\s*saturate\(180%\)\s*blur\(var\(--up-navbar-glass-blur,\s*20px\)\)/,
    'expected the unprefixed backdrop-filter alongside the prefixed one'
)

// 7. 堆叠与透明底
assert.match(
    navbar,
    /&__content\s*\{[\s\S]{0,400}?position:\s*relative;[\s\S]{0,200}?z-index:\s*1/,
    'expected __content to be stacked above the absolutely positioned glass layer'
)
assert.match(
    navbar,
    /navbarInnerStyle\(\)\s*\{[\s\S]{0,300}?isIosMode[\s\S]{0,200}?'transparent'/,
    'expected ios mode to force a transparent inner background'
)

// 8. 主题变量三处落地
for (const [label, source] of [
    ['theme-vars.scss', themeVars],
    ['libs/theme/runtime.js', themeRuntime],
    ['libs/theme/theme.js', themeCore]
]) {
    assert.match(
        source,
        /--up-navbar-glass-bg-color/,
        `expected ${label} to define --up-navbar-glass-bg-color`
    )
    assert.match(
        source,
        /--up-navbar-glass-blur/,
        `expected ${label} to define --up-navbar-glass-blur`
    )
}
assert.match(
    themeRuntime,
    /'--up-navbar-glass-bg-color':\s*'rgba\(255,\s*255,\s*255,\s*0\.82\)'/,
    'expected the light glass background to keep the 0.82 readability floor'
)
assert.match(
    themeRuntime,
    /'--up-navbar-glass-bg-color':\s*'rgba\(28,\s*28,\s*30,\s*0\.82\)'/,
    'expected the dark glass background to keep the 0.82 readability floor'
)

// 9. 示例页与注册
assert.match(
    demo,
    /onPageScroll\(\s*\(?\s*e\s*\)?\s*=>/,
    'expected the demo page to feed scrollTop from onPageScroll'
)
assert.match(
    demo,
    /mode="ios"/,
    'expected the demo page to use mode="ios"'
)
assert.match(
    pagesJson,
    /navbarIos\/navbarIos/,
    'expected pages.json to register the ios navbar demo page'
)

// 10. changelog
assert.match(
    changelog,
    /##\s*3\.8\.112[\s\S]{0,400}?navbar[\s\S]{0,200}?iOS 大标题模式/,
    'expected changelog 3.8.112 to record the navbar ios large-title mode'
)

console.log('navbar ios mode assertions passed')
