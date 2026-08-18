import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inputDir = path.join(repoRoot, 'src')
const pluginPath = path.join(repoRoot, 'vite-plugins/app-nvue-as-vue.mjs')
const pagesModulePath = path.join(
    repoRoot,
    'node_modules/@dcloudio/uni-cli-shared/dist/json/pages.js'
)
const targetPagePath = 'pages/componentsD/poster/poster'

function runScenario(platform, configured, envValue) {
    const source = `
        process.env.UNI_PLATFORM = ${JSON.stringify(platform)}
        process.env.UNI_INPUT_DIR = ${JSON.stringify(inputDir)}
        ${envValue === undefined
            ? 'delete process.env.APP_NVUE_AS_VUE'
            : `process.env.APP_NVUE_AS_VUE = ${JSON.stringify(envValue)}`}

        const { createRequire } = await import('node:module')
        const localRequire = createRequire(import.meta.url)
        const pagesModule = localRequire(${JSON.stringify(pagesModulePath)})
        const { default: appNvueAsVue } = await import(${JSON.stringify(
            pathToFileURL(pluginPath).href
        )})
        appNvueAsVue(${JSON.stringify(configured)})

        const pages = pagesModule.parsePagesJsonOnce(
            process.env.UNI_INPUT_DIR,
            process.env.UNI_PLATFORM
        )
        const page = pages.pages.find((item) => item.path === ${JSON.stringify(
            targetPagePath
        )})
        process.stdout.write(JSON.stringify({
            isNVue: page?.style?.isNVue,
            isSubNVue: page?.style?.isSubNVue
        }))
    `
    const result = spawnSync(
        process.execPath,
        ['--input-type=module', '-e', source],
        {
            cwd: repoRoot,
            encoding: 'utf8'
        }
    )
    assert.equal(
        result.status,
        0,
        `${platform} scenario failed:\n${result.stderr || result.stdout}`
    )
    return JSON.parse(result.stdout)
}

const appDefault = runScenario('app', false)
assert.equal(appDefault.isNVue, true, 'App should keep nvue behavior by default')

const appConfigured = runScenario('app', true)
assert.equal(
    appConfigured.isNVue,
    false,
    'configured App switch should convert ordinary nvue pages'
)

const appEnvironment = runScenario('app', false, 'TRUE')
assert.equal(
    appEnvironment.isNVue,
    false,
    'APP_NVUE_AS_VUE=true should enable the App conversion'
)

const appInvalidEnvironment = runScenario('app', false, 'maybe')
assert.equal(
    appInvalidEnvironment.isNVue,
    true,
    'invalid APP_NVUE_AS_VUE values should not enable conversion'
)

const h5Enabled = runScenario('h5', true)
const h5Default = runScenario('h5', false)
assert.deepEqual(
    h5Enabled,
    h5Default,
    'H5 page classification should not change'
)

const miniProgramEnabled = runScenario('mp-weixin', true)
const miniProgramDefault = runScenario('mp-weixin', false)
assert.deepEqual(
    miniProgramEnabled,
    miniProgramDefault,
    'mini-program page classification should not change'
)

const shared = await import('@dcloudio/uni-cli-shared')
process.env.UNI_INPUT_DIR = inputDir
const pageOptions = {
    pages: [{
        path: targetPagePath,
        style: { isNVue: false }
    }]
}
const vueRegistration = shared.normalizeAppPagesJson(pageOptions, 'app')
const nvueRegistration = shared.normalizeAppNVuePagesJson(pageOptions)
assert.match(
    vueRegistration,
    new RegExp(`import\\s+\\w+\\s+from './${targetPagePath}\\.nvue'`),
    'Vue registration should keep the .nvue source extension'
)
assert.match(
    vueRegistration,
    new RegExp(`__definePage\\('${targetPagePath}'`),
    'Vue registration should define the converted page'
)
assert.equal(
    nvueRegistration.trim(),
    '',
    'converted pages should not be registered by the nvue builder'
)

const { convertNvuePages } = await import(
    pathToFileURL(pluginPath).href
)
const subNvuePages = {
    pages: [{
        path: 'pages/example/sub-nvue',
        style: { isNVue: true, isSubNVue: true }
    }]
}
convertNvuePages(subNvuePages)
assert.equal(
    subNvuePages.pages[0].style.isNVue,
    true,
    'subNVue pages should keep their nvue classification'
)

const viteConfig = readFileSync(path.join(repoRoot, 'vite.config.ts'), 'utf8')
assert.match(
    viteConfig,
    /const\s+APP_NVUE_AS_VUE\s*=\s*false/,
    'vite.config.ts should keep native nvue enabled for the demo App build'
)
assert.ok(
    viteConfig.indexOf('appNvueAsVue(') < viteConfig.indexOf('uni()'),
    'appNvueAsVue must be registered before uni()'
)

console.log('App nvue-as-vue checks passed')
