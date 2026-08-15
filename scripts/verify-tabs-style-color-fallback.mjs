import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const tabsVue = readFileSync(
    resolve(root, 'src/uni_modules/uview-plus/components/u-tabs/u-tabs.vue'),
    'utf8'
)

const textStyleBody = tabsVue.match(
    /textStyle\(\)\s*\{([\s\S]*?)\n\s*\},\s*\n\s*propsBadge\(\)/
)?.[1]

assert.ok(textStyleBody, 'expected to find the tabs textStyle computed body')

const addStyle = customStyle => {
    if (!customStyle || typeof customStyle === 'object') {
        return customStyle || {}
    }
    return Object.fromEntries(
        customStyle
            .split(';')
            .filter(Boolean)
            .map(item => item.split(':').map(part => part.trim()))
    )
}
const deepMerge = (target = {}, source = {}) => ({ ...target, ...source })
const defProps = {
    tabs: {
        activeStyle: { color: '#303133' },
        inactiveStyle: { color: '#606266' }
    }
}
const createTextStyle = new Function(
    'addStyle',
    'deepMerge',
    'defProps',
    `return function textStyle() {${textStyleBody}}`
)(addStyle, deepMerge, defProps)

const renderTextStyle = ({
    index = 0,
    activeStyle = defProps.tabs.activeStyle,
    inactiveStyle = defProps.tabs.inactiveStyle,
    providedProps = [],
    shapeMode = ''
} = {}) => {
    const themeColors = {
        '--up-main-color': '#theme-active',
        '--up-content-color': '#theme-inactive',
        '--up-disabled-color': '#theme-disabled'
    }
    const context = {
        innerCurrent: 0,
        activeStyle,
        inactiveStyle,
        shapeMode,
        tabList: [{ disabled: false }, { disabled: false }],
        $u: {
            color: {
                mainColor: '#fallback-active',
                contentColor: '#fallback-inactive',
                disabledColor: '#fallback-disabled'
            }
        },
        upHasProp(propName) {
            return providedProps.includes(propName)
        },
        upThemeVar(varName, fallbackColor) {
            return themeColors[varName] || fallbackColor
        }
    }
    return createTextStyle.call(context)(index)
}

assert.deepEqual(
    renderTextStyle({
        activeStyle: { fontSize: '16px' },
        providedProps: ['activeStyle']
    }),
    { fontSize: '16px', color: '#theme-active' },
    'active font size must retain the theme color'
)

assert.deepEqual(
    renderTextStyle({
        index: 1,
        inactiveStyle: { fontWeight: '600' },
        providedProps: ['inactiveStyle']
    }),
    { fontWeight: '600', color: '#theme-inactive' },
    'inactive font weight must retain the theme color'
)

assert.equal(
    renderTextStyle({
        activeStyle: 'font-size: 16px; font-weight: 600',
        providedProps: ['activeStyle']
    }).color,
    '#theme-active',
    'string styles without color must retain the theme color'
)

assert.equal(
    renderTextStyle({
        activeStyle: { color: '#ff0000', fontSize: '16px' },
        providedProps: ['activeStyle']
    }).color,
    '#ff0000',
    'an explicit active color must override the theme color'
)

assert.equal(
    renderTextStyle({
        activeStyle: { color: '#303133' },
        providedProps: ['activeStyle']
    }).color,
    '#303133',
    'an explicitly provided default color must override the theme color'
)

assert.equal(
    renderTextStyle().color,
    '#theme-active',
    'the implicit default active color must not override the theme color'
)

for (const color of ['', '   ', null, undefined]) {
    assert.equal(
        renderTextStyle({
            activeStyle: { color, fontSize: '16px' },
            providedProps: ['activeStyle']
        }).color,
        '#theme-active',
        'an empty active color must retain the theme color'
    )
}

assert.equal(
    renderTextStyle({
        activeStyle: { fontWeight: '700' },
        providedProps: ['activeStyle'],
        shapeMode: 'pill-arrow'
    }).color,
    '#ffffff',
    'pill-arrow font styles without color must retain the shape color'
)

assert.equal(
    renderTextStyle({
        activeStyle: { color: '#00ff00' },
        providedProps: ['activeStyle'],
        shapeMode: 'tag'
    }).color,
    '#00ff00',
    'tag styles with an explicit color must override the shape color'
)

console.log('tabs style color fallback assertions passed')
