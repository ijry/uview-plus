import assert from 'node:assert/strict'
import color from '../src/uni_modules/uview-plus/libs/config/color.js'
import config from '../src/uni_modules/uview-plus/libs/config/config.js'
import {
    getThemeVars,
    refreshThemeFromConfig,
    syncThemeColorOverrideState
} from '../src/uni_modules/uview-plus/libs/theme/theme.js'

function resetObject(target, baseline) {
    Object.keys(target).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(baseline, key)) {
            delete target[key]
        }
    })
    Object.assign(target, baseline)
}

const baselineConfigColor = { ...config.color }
const baselineColor = { ...color }

try {
    syncThemeColorOverrideState({ reset: true })
    refreshThemeFromConfig()

    let lightVars = getThemeVars('light')
    assert.equal(
        lightVars['--up-primary'],
        'var(--up-light-primary, #3c9cff)',
        'expected default light primary to resolve through bridge token'
    )
    assert.equal(
        lightVars['--up-main-color'],
        'var(--up-light-main-color, #303133)',
        'expected default light main-color to resolve through bridge token'
    )

    color.primary = '#654321'
    syncThemeColorOverrideState({
        color: {
            primary: '#654321'
        }
    })
    refreshThemeFromConfig()

    lightVars = getThemeVars('light')
    assert.equal(
        lightVars['--up-primary'],
        '#654321',
        'expected explicit runtime color override to win over bridge token'
    )

    config.color['u-main-color'] = '#102030'
    syncThemeColorOverrideState({
        configColor: {
            'u-main-color': '#102030'
        }
    })
    refreshThemeFromConfig()

    lightVars = getThemeVars('light')
    assert.equal(
        lightVars['--up-main-color'],
        '#102030',
        'expected explicit config.color override to win over bridge token'
    )

    const darkVars = getThemeVars('dark')
    assert.equal(
        darkVars['--up-main-color'],
        '#f5f5f5',
        'expected dark mode to keep framework default main-color'
    )

    console.log('runtime theme bridge assertions passed')
} finally {
    resetObject(color, baselineColor)
    resetObject(config.color, baselineConfigColor)
    syncThemeColorOverrideState({ reset: true })
    refreshThemeFromConfig()
}
