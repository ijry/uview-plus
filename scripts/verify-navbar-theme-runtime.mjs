import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as sass from 'sass'
import config from '../src/uni_modules/uview-plus/libs/config/config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const themeSource = readFileSync(
    resolve(__dirname, '../src/uni_modules/uview-plus/libs/theme/theme.js'),
    'utf8'
)

assert.match(
    themeSource,
    /applyNativeThemeUI\(themeMode,\s*themeColors,\s*themeVars\)/,
    'expected applyTheme() to forward themeVars into applyNativeThemeUI'
)
assert.match(
    themeSource,
    /const navBg = themeVars\?\.\['--up-navbar-bg-color'\][\s\S]*config\.color\?\.\['up-navbar-bg-color'\]/,
    'expected theme native UI sync to prefer --up-navbar-bg-color'
)

const { css } = sass.compile(
    resolve(__dirname, '../src/uni_modules/uview-plus/libs/css/theme-vars-core.scss'),
    { style: 'expanded' }
)

assert.match(
    css,
    /--up-navbar-bg-color:\s*#ffffff;/,
    'expected light navbar token in theme-vars-core.scss'
)
assert.match(
    css,
    /\[data-up-theme=['"]?dark['"]?\][\s\S]*--up-navbar-bg-color:\s*#1c1c1e;/,
    'expected dark navbar token in theme-vars-core.scss'
)

const originalUni = globalThis.uni
const originalGetCurrentPages = globalThis.getCurrentPages
const originalColorMap = { ...config.color }

const navCalls = []

globalThis.getCurrentPages = () => [{}]
globalThis.uni = {
    setNavigationBarColor(options) {
        navCalls.push(options)
        return Promise.resolve()
    },
    setBackgroundColor() {},
    setTabBarStyle() {},
    getStorageSync() {
        return 'light'
    },
    setStorageSync() {},
    getSystemInfoSync() {
        return { theme: 'light' }
    },
    getAppBaseInfo() {
        return { theme: 'light' }
    },
    $emit() {},
    $u: null
}

try {
    const themeModule = await import('../src/uni_modules/uview-plus/libs/theme/theme.js')

    const { setTheme, refreshThemeFromConfig, themeState } = themeModule

    Object.keys(config.color).forEach((key) => {
        delete config.color[key]
    })
    config.color['up-navbar-bg-color'] = '#123456'
    config.color['u-navbar-bg-color'] = '#123456'

    refreshThemeFromConfig()
    navCalls.length = 0

    setTheme('light')

    assert.equal(themeState.vars['--up-navbar-bg-color'], '#123456')
    assert.equal(navCalls.at(-1)?.backgroundColor, '#123456')
} finally {
    Object.keys(config.color).forEach((key) => {
        delete config.color[key]
    })
    Object.assign(config.color, originalColorMap)
    if (originalUni === undefined) {
        delete globalThis.uni
    } else {
        globalThis.uni = originalUni
    }
    if (originalGetCurrentPages === undefined) {
        delete globalThis.getCurrentPages
    } else {
        globalThis.getCurrentPages = originalGetCurrentPages
    }
}

console.log('navbar theme runtime assertions passed')
