/**
 * Verification script for issue #1070
 * 校验 u-goods-sku 的 defaultSku 与 safeAreaInsetBottom 属性。
 *
 * 静态断言保证模板与声明一致；运行时断言直接执行组件实例方法，
 * 覆盖初始化、外部更新 defaultSku、无参回归和 reset 行为。
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')
const source = read('src/uni_modules/uview-plus/components/u-goods-sku/u-goods-sku.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
  packageJson.scripts['verify:goods-sku-default-selection'],
  'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-goods-sku-default-selection.mjs'
)

assert.match(
  source,
  /<up-popup[\s\S]*:safeAreaInsetBottom="safeAreaInsetBottom"[\s\S]*>/,
  'expected u-goods-sku to forward safeAreaInsetBottom to u-popup'
)
assert.match(
  source,
  /defaultSku:\s*\{[\s\S]*?type:\s*Object,[\s\S]*?default:\s*\(\)\s*=>\s*\(\{\}\)/,
  'expected defaultSku to be an empty-object prop'
)
assert.match(
  source,
  /safeAreaInsetBottom:\s*\{[\s\S]*?type:\s*Boolean,[\s\S]*?default:\s*true/,
  'expected safeAreaInsetBottom to default to true'
)
assert.match(
  source,
  /selectedSku:\s*\{\s*\.\.\.this\.defaultSku\s*\}/,
  'expected selectedSku to initialize from defaultSku'
)
assert.match(
  source,
  /defaultSku:\s*\{[\s\S]*?handler\(sku\)[\s\S]*?this\.selectedSku\s*=\s*\{\s*\.\.\.\(sku\s*\|\|\s*\{\}\)\s*\}/,
  'expected a defaultSku watcher that replaces internal selection'
)
assert.match(
  source,
  /reset\(\)\s*\{[\s\S]*?this\.selectedSku\s*=\s*\{\s*\.\.\.this\.defaultSku\s*\}/,
  'expected reset to restore the configured default selection'
)

// 在最小 Vue 实例上下文中运行组件方法，验证真实状态变更。
const componentConfig = await import(
  'data:text/javascript,' + encodeURIComponent(
    source
      .match(/<script>([\s\S]*?)<\/script>/)[1]
      .replace("import { t } from '../../libs/i18n'", 'const t = key => key')
      .replace('export default', 'export default')
  )
)

const { default: component } = componentConfig
const watch = component.watch.defaultSku
const handler = typeof watch === 'function' ? watch : watch.handler

const createInstanceState = defaultSku => ({ ...component.data.call({ defaultSku }), defaultSku })

const initial = createInstanceState({ color: 2, size: 3 })
assert.deepEqual(initial.selectedSku, { color: 2, size: 3 }, 'defaultSku must initialize selection')
assert.equal(initial.buyNum, 1, 'selection must not change the initial quantity')

const instance = createInstanceState({ color: 2, size: 3 })
handler.call(instance, { color: 3, size: 4 })
assert.deepEqual(instance.selectedSku, { color: 3, size: 4 }, 'new defaultSku must replace selection')

const noProp = createInstanceState({})
handler.call(noProp, undefined)
assert.deepEqual(noProp.selectedSku, {}, 'missing defaultSku must keep an empty selection')

const resetInstance = createInstanceState({ color: 1, size: 2 })
resetInstance.selectedSku = { color: 3, size: 4 }
resetInstance.buyNum = 3
component.methods.reset.call(resetInstance)
assert.deepEqual(resetInstance.selectedSku, { color: 1, size: 2 }, 'reset must restore defaultSku')
assert.equal(resetInstance.buyNum, 1, 'reset must restore the default quantity')

console.log('goods-sku default selection assertions passed')
