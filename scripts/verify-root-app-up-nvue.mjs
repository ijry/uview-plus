import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { transformNvuePage } from '../src/uni_modules/uview-plus/libs/root/page.js'
import { rebuildUpApp } from '../src/uni_modules/uview-plus/libs/root/root.js'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (filePath) => readFileSync(resolve(repoRoot, filePath), 'utf8')

const setupResult = (await transformNvuePage(
    '<template><view /></template><script setup>const value = 1</script>',
    './App.up.vue',
    './runtime.js'
)).toString()
assert.match(setupResult, /import AppUpRoot from ['"]\.\/App\.up\.vue['"]/, 'script setup should import App.up.vue')
assert.match(setupResult, /<AppUpRoot\b/, 'script setup pages should use AppUpRoot')
assert.match(setupResult, /<\/AppUpRoot>/, 'script setup pages should close AppUpRoot')

const optionsResult = (await transformNvuePage(
    '<template><view /></template><script>export default {}</script>',
    './App.up.vue',
    './runtime.js'
)).toString()
assert.match(optionsResult, /import AppUpRoot from ['"]\.\/App\.up\.vue['"]/, 'Options API should import App.up.vue')
assert.match(optionsResult, /components:\s*\{\s*AppUpRoot\s*[,}]/, 'Options API should register AppUpRoot')

const noScriptResult = (await transformNvuePage(
    '<template><view /></template>',
    './App.up.vue',
    './runtime.js'
)).toString()
assert.match(noScriptResult, /components:\s*\{\s*AppUpRoot\s*\}/, 'script-less pages should register AppUpRoot')

const rebuiltRoot = await rebuildUpApp(
    '<template><UpRootView /></template><script setup>const ready = true</script>',
    false,
    { rootToastHostImportPath: './root-toast-host.vue' }
)
const rebuiltRootCode = rebuiltRoot.toString()
assert.match(rebuiltRootCode, /<slot \/>/, 'App.up.vue should expose the page slot')
assert.match(rebuiltRootCode, /<UpRootToastHost \/>/, 'App.up.vue should render the local Toast/Notify host')
assert.match(
    rebuiltRootCode,
    /import UpRootToastHost from ['"]\.\/root-toast-host\.vue['"]/
    ,
    'App.up.vue should import the local Toast/Notify host'
)

const rebuiltOptionsRoot = (await rebuildUpApp(
    '<template><UpRootView /></template><script>export default {}</script>',
    false,
    { rootToastHostImportPath: './root-toast-host.vue' }
)).toString()
assert.match(rebuiltOptionsRoot, /components:\s*\{\s*UpRootToastHost\s*[,}]/, 'Options API roots should register the local Toast/Notify host')

const rebuiltNoScriptRoot = (await rebuildUpApp(
    '<template><UpRootView /></template>',
    false,
    { rootToastHostImportPath: './root-toast-host.vue' }
)).toString()
assert.match(rebuiltNoScriptRoot, /import UpRootToastHost from ['"]\.\/root-toast-host\.vue['"]/, 'script-less roots should import the local Toast/Notify host')
assert.match(rebuiltNoScriptRoot, /components:\s*\{\s*UpRootToastHost\s*\}/, 'script-less roots should register the local Toast/Notify host')

const appUp = read('src/App.up.vue')
assert.match(appUp, /#ifdef APP-VUE[\s\S]*>VUE<\/text>/, 'App.up.vue should show the Vue renderer label on App Vue')
assert.match(appUp, /#ifdef APP-NVUE[\s\S]*>NVUE<\/text>/, 'App.up.vue should show the nvue renderer label on App nvue')
assert.match(
    appUp,
    /#ifdef APP-VUE[\s\S]*pointer-events:\s*none[\s\S]*#endif/,
    'App.up.vue should keep WebView-only marker styles out of nvue builds'
)
assert.match(appUp, /#ifdef APP-NVUE[\s\S]*minHeight[\s\S]*width:\s*['"]750rpx['"]/, 'App.up.vue should provide nvue root dimensions')

console.log('Root App.up.vue nvue checks passed')
