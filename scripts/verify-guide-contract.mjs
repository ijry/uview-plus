import assert from 'node:assert/strict'
import fs from 'node:fs'

function toAbs(relativePath) {
    return new URL(`../${relativePath}`, import.meta.url)
}

function exists(relativePath) {
    return fs.existsSync(toAbs(relativePath))
}

function read(relativePath) {
    return fs.readFileSync(toAbs(relativePath), 'utf8')
}

function assertContains(content, matcher, message) {
    assert.match(content, matcher, message)
}

try {
    assert.ok(
        exists('src/uni_modules/uview-plus/components/u-guide/u-guide.vue'),
        'expected u-guide.vue to exist'
    )
    assert.ok(
        exists('src/uni_modules/uview-plus/components/u-guide/props.js'),
        'expected guide props.js to exist'
    )
    assert.ok(
        exists('src/uni_modules/uview-plus/components/u-guide/guide.js'),
        'expected guide defaults guide.js to exist'
    )

    const guideDefaults = read('src/uni_modules/uview-plus/components/u-guide/guide.js')
    assertContains(guideDefaults, /guide\s*:\s*{/, 'expected guide defaults object')
    assertContains(guideDefaults, /storageKey:\s*['"]up-guide-default['"]/, 'expected default storageKey')
    assertContains(guideDefaults, /once:\s*true/, 'expected once default true')

    const guideProps = read('src/uni_modules/uview-plus/components/u-guide/props.js')
    assertContains(guideProps, /defProps\.guide\.list/, 'expected list default from defProps.guide')
    assertContains(guideProps, /defProps\.guide\.once/, 'expected once default from defProps.guide')

    const guideVue = read('src/uni_modules/uview-plus/components/u-guide/u-guide.vue')
    assertContains(guideVue, /name:\s*['"]up-guide['"]/, 'expected component name up-guide')
    assertContains(
        guideVue,
        /emits:\s*\[\s*['"]update:show['"]\s*,\s*['"]change['"]\s*,\s*['"]skip['"]\s*,\s*['"]finish['"]\s*,\s*['"]close['"]\s*\]/,
        'expected emits update:show/change/skip/finish/close'
    )
    assertContains(guideVue, /open\(\)\s*{/, 'expected open() method')
    assertContains(guideVue, /close\(\s*remember\s*=\s*true\s*\)\s*{/, 'expected close(remember = true) method')
    assertContains(guideVue, /reset\(\)\s*{/, 'expected reset() method')

    assertContains(guideProps, /import GuideDefaultProps from ['"]\.\/guide(?:\.js)?['"]/, 'expected guide props to import local defaults')
    assertContains(guideProps, /registerComponentProps\(GuideDefaultProps\)/, 'expected guide props to register local defaults')

    const propsConfig = read('src/uni_modules/uview-plus/libs/config/props.js')
    assertContains(propsConfig, /registerComponentProps/, 'expected lazy props registration API')
    assertContains(propsConfig, /setPropsConfig/, 'expected lazy props config API')

    assert.ok(
        exists('src/uni_modules/uview-plus/types/comps/guide.d.ts'),
        'expected types/comps/guide.d.ts to exist'
    )
    const guideTypes = read('src/uni_modules/uview-plus/types/comps/guide.d.ts')
    assertContains(guideTypes, /export declare const Guide:/, 'expected Guide type export')
    assertContains(guideTypes, /export declare const GuideRef:/, 'expected GuideRef type export')

    const globalTypes = read('src/uni_modules/uview-plus/types/comps.d.ts')
    assertContains(globalTypes, /\['up-guide'\]: typeof import\('\.\/comps\/guide'\)\['Guide'\]/, 'expected global component type up-guide')

    const indexTypes = read('src/uni_modules/uview-plus/types/index.d.ts')
    assertContains(indexTypes, /declare type UniGuideRef = typeof import\('\.\/comps\/guide'\)\['GuideRef'\]/, 'expected UniGuideRef alias')

    assert.ok(
        exists('src/pages/componentsC/guide/guide.vue'),
        'expected demo page src/pages/componentsC/guide/guide.vue'
    )
    const pagesJson = read('src/pages.json')
    assertContains(pagesJson, /"path"\s*:\s*"guide\/guide"/, 'expected pages.json route for guide demo')
    const componentsConfig = read('src/pages/example/components.config.js')
    assertContains(componentsConfig, /path:\s*['"]\/pages\/componentsC\/guide\/guide['"]/, 'expected components list entry for guide demo')

    console.log('guide contract assertions passed')
} catch (error) {
    console.error(error.message)
    process.exit(1)
}
