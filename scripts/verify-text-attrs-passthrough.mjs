import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const filename = resolve(repoRoot, 'src/uni_modules/uview-plus/components/u-text/u-text.vue')
const { parse, compileTemplate } = require('vue/compiler-sfc')
const { descriptor, errors } = parse(readFileSync(filename, 'utf8'), { filename })
assert.deepEqual(errors, [], 'u-text.vue should parse without errors')

// Resolve transitive tools through their owners so this also works with pnpm.
const sharedRequire = createRequire(require.resolve('@dcloudio/uni-cli-shared/package.json'))
const mpRequire = createRequire(require.resolve('@dcloudio/uni-mp-weixin/package.json'))
const { initPreContext, preHtml, preJs } = require('@dcloudio/uni-cli-shared')
const { compile } = mpRequire('@dcloudio/uni-mp-compiler')

test('u-text compiles for WeChat and preserves explicit button bindings', () => {
    initPreContext('mp-weixin')
    const errors = []
    let wxml = ''
    compile(preHtml(descriptor.template.content, filename), {
        filename,
        mode: 'module',
        onError: error => errors.push(error.message),
        miniProgram: {
            directive: 'wx:',
            class: { array: true },
            slot: { fallbackContent: false, dynamicSlotNames: true },
            event: { key: true },
            component: { dir: 'wxcomponents' },
            emitFile: asset => { wxml = asset.source }
        }
    })
    // Runtime v-if cannot hide unsupported native-element syntax from the compiler.
    // The former v-bind="$attrs" must fail here, not pass a source-string check.
    assert.deepEqual(errors, [], 'u-text should compile without unsupported v-bind errors')
    const button = wxml.match(/<button\b[^>]*>/)?.[0]
    assert.ok(button, 'the openType branch should emit a native button')
    for (const attribute of [
        'data-index', 'openType', 'lang', 'session-from', 'send-message-title',
        'send-message-path', 'send-message-img', 'show-message-card', 'app-parameter'
    ]) {
        assert.match(button, new RegExp('\\b' + attribute + '="\\{\\{[^}]+\\}\\}"'),
            'the button should keep its explicit ' + attribute + ' binding')
    }
    for (const event of [
        'getuserinfo', 'contact', 'getphonenumber', 'error', 'launchapp', 'opensetting'
    ]) {
        assert.match(button, new RegExp('\\bbind' + event + '="'),
            'the button should keep its ' + event + ' handler')
    }
})

test('ordinary u-text content inherits attributes on its root view in H5', async () => {
    initPreContext('h5')
    const previousUni = globalThis.uni
    // Only the host uni APIs are replaced; the component and its mixins are real.
    globalThis.uni = {
        $on() {}, $off() {}, $once() {}, $emit() {},
        getStorageSync: () => '',
        setStorageSync() {},
        getSystemInfoSync: () => ({ windowWidth: 375, windowHeight: 667 }),
        getWindowInfo: () => ({ windowWidth: 375, windowHeight: 667 })
    }
    try {
        const { buildSync } = sharedRequire('esbuild')
        // Bundling resolves the extensionless imports used by uni-app components.
        const { outputFiles } = buildSync({
            stdin: {
                contents: preJs(descriptor.script.content, filename),
                resolveDir: dirname(filename),
                sourcefile: filename,
                loader: 'js'
            },
            bundle: true,
            platform: 'node',
            format: 'cjs',
            external: ['vue'],
            write: false,
            logLevel: 'silent'
        })
        const componentModule = { exports: {} }
        new Function('module', 'exports', 'require', outputFiles[0].text)(
            componentModule, componentModule.exports, require
        )
        const Vue = require('vue')
        const { renderToString } = require('vue/server-renderer')
        const { code, errors } = compileTemplate({
            source: preHtml(descriptor.template.content, filename),
            filename,
            id: 'u-text-regression',
            compilerOptions: { mode: 'function', isCustomElement: () => true }
        })
        assert.deepEqual(errors, [], 'the H5 template should compile without errors')
        const render = new Function('Vue', code)(Vue)
        const app = Vue.createSSRApp({ ...componentModule.exports.default, render }, {
            text: 'Regression text',
            id: 'text-root',
            'data-check': 'root-attrs'
        })
        const html = await renderToString(app)
        const root = html.match(/^<view\b[^>]*>/)?.[0]
        assert.ok(root, 'ordinary text should render a root view')
        assert.match(root, /\bid="text-root"/, 'id should fall through to the root view')
        assert.match(root, /\bdata-check="root-attrs"/, 'data attributes should fall through to the root view')
        assert.match(html, /Regression text/, 'the text value should still render')
    } finally {
        if (previousUni === undefined) delete globalThis.uni
        else globalThis.uni = previousUni
    }
})
