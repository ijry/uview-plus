import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const uviewRoot = path.join(repoRoot, 'src/uni_modules/uview-plus')
const propsConfigPath = path.join(uviewRoot, 'libs/config/props.js')
const componentsRoot = path.join(uviewRoot, 'components')

function read(filePath) {
    return fs.readFileSync(filePath, 'utf8')
}

function assertNotContains(content, matcher, message) {
    assert.doesNotMatch(content, matcher, message)
}

function assertContains(content, matcher, message) {
    assert.match(content, matcher, message)
}

function listComponentPropsFiles() {
    return fs.readdirSync(componentsRoot)
        .map((dirName) => path.join(componentsRoot, dirName, 'props.js'))
        .filter((propsPath) => fs.existsSync(propsPath))
        .sort()
}

function findDefaultConfigFile(componentDir) {
    const files = fs.readdirSync(componentDir)
        .filter((fileName) => fileName.endsWith('.js') && fileName !== 'props.js')
        .sort()

    const candidates = []
    for (const fileName of files) {
        const filePath = path.join(componentDir, fileName)
        const content = read(filePath)
        const match = content.match(/export\s+default\s*{\s*(?:\/\*[\s\S]*?\*\/\s*)?(?:\/\/[^\n]*\n\s*)?([A-Za-z_$][\w$]*)\s*:/)
        if (!match) continue
        const key = match[1]
        if (['methods', 'computed', 'watch', 'fade', 'params'].includes(key)) continue
        candidates.push({ fileName, key })
    }

    assert.ok(
        candidates.length <= 1,
        `expected at most one default props module in ${componentDir}, got ${candidates.map((item) => item.fileName).join(', ')}`
    )
    return candidates[0] || null
}

function transformPropsConfigSource(source) {
    return source
        .replace(/import\s+config\s+from\s+['"]\.\/config(?:\.js)?['"];?\n?/, 'const config = globalThis.__propsTestConfig\n')
        .replace(/import\s+zIndex\s+from\s+['"]\.\/zIndex(?:\.js)?['"];?\n?/, 'const zIndex = globalThis.__propsTestZIndex\n')
        .replace(/import\s+color\s+from\s+['"]\.\/color(?:\.js)?['"];?\n?/, 'const color = globalThis.__propsTestColor\n')
        .replace(/import\s+http\s+from\s+['"]\.\.\/function\/http(?:\.js)?['"];?\n?/, 'const http = globalThis.__propsTestHttp\n')
        .replace(/import\s+{\s*shallowMerge\s*}\s+from\s+['"]\.\.\/function\/index(?:\.js)?['"];?\n?/, 'const { shallowMerge } = globalThis.__propsTestFns\n')
}

async function importPropsConfigInSandbox() {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'uview-props-lazy-'))
    const modulePath = path.join(tempDir, 'props.mjs')
    globalThis.__propsTestConfig = {}
    globalThis.__propsTestZIndex = {}
    globalThis.__propsTestColor = {}
    globalThis.__propsTestHttp = {}
    function shallowMerge(target, source = {}) {
        if (!source || typeof target !== 'object' || typeof source !== 'object') return target
        for (const key of Object.keys(source)) {
            if (
                target[key]
                && source[key]
                && typeof target[key] === 'object'
                && typeof source[key] === 'object'
                && !Array.isArray(target[key])
                && !Array.isArray(source[key])
            ) {
                shallowMerge(target[key], source[key])
            } else {
                target[key] = source[key]
            }
        }
        return target
    }
    globalThis.__propsTestFns = {
        shallowMerge
    }
    fs.writeFileSync(modulePath, transformPropsConfigSource(read(propsConfigPath)), 'utf8')
    return import(`${pathToFileURL(modulePath).href}?t=${Date.now()}`)
}

function runStaticAssertions() {
    const propsConfig = read(propsConfigPath)
    assertNotContains(
        propsConfig,
        /from\s+['"]\.\.\/\.\.\/components\//,
        'libs/config/props.js must not statically import component defaults'
    )
    assertContains(
        propsConfig,
        /export\s+function\s+registerComponentProps\s*\(/,
        'expected registerComponentProps export'
    )
    assertContains(
        propsConfig,
        /export\s+function\s+setPropsConfig\s*\(/,
        'expected setPropsConfig export'
    )

    for (const propsPath of listComponentPropsFiles()) {
        const content = read(propsPath)
        const relativePath = path.relative(repoRoot, propsPath)
        assertNotContains(
            content,
            /import\s+defProps\s+from\s+['"]\.\.\/\.\.\/libs\/config\/props(?:\.js)?['"]/,
            `${relativePath} must not default-import full props config`
        )
        const usesDefProps = /defProps\./.test(content)
        const usesLazyRegistration = /registerComponentProps\s*\(/.test(content)
        if (usesDefProps || usesLazyRegistration) {
            assertContains(
                content,
                /registerComponentProps\s*\(/,
                `${relativePath} must register local props defaults`
            )
        }

        const defaultConfig = findDefaultConfigFile(path.dirname(propsPath))
        if (usesLazyRegistration && defaultConfig) {
            assertContains(
                content,
                new RegExp(`from\\s+['"]\\./${defaultConfig.fileName.replace(/\.js$/, '')}(?:\\.js)?['"]`),
                `${relativePath} must import local default module ${defaultConfig.fileName}`
            )
        }
    }
}

async function runBehaviorAssertions() {
    const module = await importPropsConfigInSandbox()
    const {
        default: props,
        registerComponentProps,
        setPropsConfig
    } = module

    assert.ok(props.button, 'expected button top-level key to exist before registration')
    assert.ok(props.gap, 'expected gap top-level key to exist before registration')

    setPropsConfig({
        button: {
            type: 'primary',
            nested: {
                keep: 'user'
            }
        }
    })
    const beforeRegisterButtonRef = props.button
    const registered = registerComponentProps({
        button: {
            type: 'info',
            size: 'normal',
            nested: {
                keep: 'default',
                fill: 'default'
            }
        }
    })

    assert.equal(registered, props, 'registerComponentProps should return shared props store')
    assert.equal(props.button, beforeRegisterButtonRef, 'registerComponentProps must keep component object reference')
    assert.equal(props.button.type, 'primary', 'user override before registration must win')
    assert.equal(props.button.size, 'normal', 'missing default field should be filled')
    assert.deepEqual(
        props.button.nested,
        { keep: 'user', fill: 'default' },
        'nested defaults should fill missing fields without replacing user fields'
    )

    setPropsConfig({
        button: {
            type: 'success'
        }
    })
    assert.equal(props.button.type, 'success', 'setPropsConfig after registration must override default')

    props.gap.bgColor = '#f3f4f6'
    assert.equal(props.gap.bgColor, '#f3f4f6', 'direct uni.$u.props-style assignment should work')

    registerComponentProps({
        box: {
            customStyle: {},
            size: 'default'
        }
    })
    assert.deepEqual(
        props.box,
        { customStyle: {}, size: 'default' },
        'local defaults not present in old aggregator, such as box, should register'
    )
}

try {
    runStaticAssertions()
    await runBehaviorAssertions()
    console.log('props lazy-loading assertions passed')
} catch (error) {
    console.error(error.message)
    process.exit(1)
}
