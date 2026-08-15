import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const componentDir = resolve(root, 'src/uni_modules/uview-plus/components/u-novel-reader')
const source = readFileSync(resolve(componentDir, 'u-novel-reader.vue'), 'utf8')
const toolbar = readFileSync(resolve(componentDir, 'reader-toolbar.vue'), 'utf8')
const content = readFileSync(resolve(componentDir, 'reader-content.vue'), 'utf8')
const settings = readFileSync(resolve(componentDir, 'reader-settings.vue'), 'utf8')
const catalog = readFileSync(resolve(componentDir, 'reader-catalog.vue'), 'utf8')
const themeVars = readFileSync(resolve(componentDir, 'theme-vars.scss'), 'utf8')

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function assertStyleRule(styleSource, selector, declarations) {
    const match = styleSource.match(new RegExp(
        `${escapeRegExp(selector)}\\s*\\{([^}]*)\\}`,
        's'
    ))
    assert.ok(match, `missing style rule: ${selector}`)
    for (const declaration of declarations) {
        assert.match(match[1], new RegExp(escapeRegExp(declaration)))
    }
}

function assertThemeToken(theme, expected) {
    const match = source.match(new RegExp(`${theme}:\\s*\\{([^}]*)\\}`, 's'))
    assert.ok(match, `missing JavaScript theme token: ${theme}`)
    for (const [name, value] of Object.entries(expected)) {
        assert.match(
            match[1],
            new RegExp(`${escapeRegExp(name)}:\\s*'${escapeRegExp(value)}'`)
        )
    }
}

function assertThemeVariables(theme, expected) {
    const selector = `.up-novel-reader.theme-${theme}`
    const match = themeVars.match(new RegExp(
        `${escapeRegExp(selector)}\\s*\\{([^}]*)\\}`,
        's'
    ))
    assert.ok(match, `missing SCSS theme variables: ${theme}`)
    for (const [name, value] of Object.entries(expected)) {
        assert.match(
            match[1],
            new RegExp(`${escapeRegExp(name)}:\\s*${escapeRegExp(value)}`)
        )
    }
}

for (const token of ['u-status-bar', 'u-safe-bottom', 'u-popup']) {
    assert.match(source, new RegExp(token))
}
for (const token of ['arrow-left', 'showBack', 'toggle-controls']) {
    assert.match(toolbar, new RegExp(token))
}
assertStyleRule(toolbar, '.up-novel-reader__toolbar-row', ['flex-direction: row'])
assertStyleRule(toolbar, '.up-novel-reader__toolbar-group', ['flex-direction: row'])
assertStyleRule(toolbar, '.up-novel-reader__toolbar-button', ['flex-direction: row'])
assertStyleRule(toolbar, '.up-novel-reader__toolbar-title', ['max-width: 200px'])
assertStyleRule(toolbar, '.up-novel-reader__progress-value', ['border-radius: 3px'])
assertStyleRule(content, '.up-novel-reader__page', ['flex-direction: row'])
assert.match(settings, /u-slider/)
assertStyleRule(settings, '.up-novel-reader__settings', ['width: 100%'])
assertStyleRule(settings, '.up-novel-reader__settings-header', ['flex-direction: row'])
assertStyleRule(settings, '.up-novel-reader__settings-close', ['flex-direction: row'])
assert.match(
    settings,
    /\.up-novel-reader__settings-row,\s*\.up-novel-reader__settings-option\s*\{[^}]*flex-direction:\s*row/s
)
assertStyleRule(settings, '.up-novel-reader__theme-list', ['flex-direction: row'])
assertStyleRule(settings, '.up-novel-reader__theme-option', [
    'flex-direction: row',
    'flex: 1',
    'height: 42px',
    'border-radius: 8px'
])
assertStyleRule(settings, '.up-novel-reader__theme-option.is-active', [
    'border-color: var(--up-novel-reader-active, #2979ff)'
])
assertStyleRule(settings, '.up-novel-reader__settings-done', ['flex-direction: row'])
assertStyleRule(catalog, '.up-novel-reader__catalog', ['height: 100%'])
assertStyleRule(catalog, '.up-novel-reader__catalog-header', [
    'flex-direction: row',
    'align-items: flex-end'
])
assertStyleRule(catalog, '.up-novel-reader__catalog-item', ['flex-direction: row'])
assertStyleRule(catalog, '.up-novel-reader__catalog-index', ['flex-direction: row'])
assertStyleRule(catalog, '.up-novel-reader__bookmark-heading', ['flex-direction: row'])
assertStyleRule(catalog, '.up-novel-reader__bookmark-item', ['flex-direction: row'])

assertStyleRule(source, '.up-novel-reader', ['position: relative'])
assert.match(
    source,
    /\.up-novel-reader__controls,\s*\.up-novel-reader__top-toolbar,\s*\.up-novel-reader__bottom-toolbar\s*\{[^}]*z-index:\s*10/s
)

const themes = {
    day: {
        border: 'rgba(48, 49, 51, 0.12)',
        active: '#2979ff',
        disabled: '#c8c9cc'
    },
    paper: {
        border: 'rgba(81, 72, 61, 0.16)',
        active: '#9b7653',
        disabled: '#c7b9a3'
    },
    green: {
        border: 'rgba(63, 81, 64, 0.16)',
        active: '#4d8b55',
        disabled: '#b6c7b4'
    },
    night: {
        border: 'rgba(214, 215, 218, 0.16)',
        active: '#7da7ff',
        disabled: '#62656d'
    },
    dark: {
        border: 'rgba(229, 231, 235, 0.16)',
        active: '#8ab4ff',
        disabled: '#5f6368'
    }
}

for (const [theme, expected] of Object.entries(themes)) {
    assert.match(source + settings, new RegExp(theme))
    assertThemeToken(theme, expected)
    assertThemeVariables(theme, {
        '--up-novel-reader-border': expected.border,
        '--up-novel-reader-active': expected.active,
        '--up-novel-reader-disabled': expected.disabled
    })
}
console.log('novel reader UI contract passed')
