/**
 * Verification for the u-goods-sku close() bug (this.false = true 笔误).
 *
 * 静态断言锁住模板透传与 close() 实现；运行时直接执行 close() 方法，
 * 确认弹窗真正关闭（show=false），且不会误建 this.false 属性、不会自己重复 emit close。
 * 关闭事件统一由模板 @close="$emit('close')" 透传，保证每种关闭方式恰好 emit 一次。
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
  packageJson.scripts['verify:goods-sku-close'],
  'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-goods-sku-close.mjs'
)

// 静态：模板把 popup 的 close/closed 透传给父组件
assert.match(source, /@close="\$emit\('close'\)"/, 'u-goods-sku should forward popup close to the parent')
assert.match(source, /@closed="\$emit\('closed'\)"/, 'u-goods-sku should forward popup closed to the parent')

// 静态：不能再出现 this.false / this.true 这类无效赋值
assert.ok(!/this\.false\s*=/.test(source), 'u-goods-sku must not assign to this.false')
assert.ok(!/this\.true\s*=/.test(source), 'u-goods-sku must not assign to this.true')

// 静态：close() 必须真正关闭弹窗（this.show = false），且自己不再 emit close
// （交由模板透传，避免 ref.close() 经 popup 的 show watcher 补发导致重复 emit）
assert.match(source, /close\(\)\s*\{[\s\S]*?this\.show\s*=\s*false/, 'close() should set show to false')
assert.ok(
  !/close\(\)\s*\{[\s\S]*?this\.\$emit\('close'\)/.test(source),
  'close() should not emit close itself (the template forwards popup close to the parent)'
)

// 运行时：直接执行 close()，确认 show 被置为 false、不误建 false 属性、不自己 emit close
const componentConfig = await import(
  'data:text/javascript,' + encodeURIComponent(
    source
      .match(/<script>([\s\S]*?)<\/script>/)[1]
      .replace("import { t } from '../../libs/i18n'", 'const t = key => key')
  )
)

const { default: component } = componentConfig

const emitted = []
const instance = Object.assign(
  { show: true, $emit: (...args) => emitted.push(args) },
  component.data.call({ defaultSku: {} }),
  component.methods
)
instance.close()

assert.equal(instance.show, false, 'close() must set show to false')
assert.equal(instance.false, undefined, 'close() must not create a stray this.false property')
assert.equal(
  emitted.filter(e => e[0] === 'close').length,
  0,
  'close() itself must not emit close (template forwards it, avoiding duplicate emit)'
)

console.log('goods-sku close assertions passed')
