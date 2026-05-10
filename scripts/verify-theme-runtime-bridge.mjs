import assert from 'node:assert/strict'
import color from '../src/uni_modules/uview-plus/libs/config/color.js'
import config from '../src/uni_modules/uview-plus/libs/config/config.js'
import {
    initThemeSystem,
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
const originalDocument = globalThis.document
const originalUni = globalThis.uni

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

    const styleWrites = []
    const createStyleProxy = () => new Proxy({}, {
        set(target, property, value) {
            styleWrites.push({ property, value })
            target[property] = value
            return true
        }
    })
    const appRoot = { style: createStyleProxy() }
    globalThis.document = {
        documentElement: {
            style: createStyleProxy(),
            setAttribute(name, value) {
                this[name] = value
            }
        },
        body: {
            style: createStyleProxy()
        },
        getElementById(id) {
            return id === 'app' ? appRoot : null
        }
    }
    globalThis.uni = {
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
        setBackgroundColor() {},
        setTabBarStyle() {},
        $emit() {}
    }

    initThemeSystem()

    assert.equal(
        globalThis.document.documentElement['data-up-theme'],
        'light',
        'expected initThemeSystem() to keep syncing the H5 theme attribute'
    )
    assert.deepEqual(
        styleWrites,
        [],
        'expected initThemeSystem() not to write html/body/#app background styles'
    )

    console.log('runtime theme bridge assertions passed')
} finally {
    resetObject(color, baselineColor)
    resetObject(config.color, baselineConfigColor)
    syncThemeColorOverrideState({ reset: true })
    refreshThemeFromConfig()
    if (originalDocument === undefined) {
        delete globalThis.document
    } else {
        globalThis.document = originalDocument
    }
    if (originalUni === undefined) {
        delete globalThis.uni
    } else {
        globalThis.uni = originalUni
    }
}
