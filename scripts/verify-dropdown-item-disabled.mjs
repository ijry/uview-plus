import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(
  new URL('../src/uni_modules/uview-plus/components/u-dropdown-item/u-dropdown-item.vue', import.meta.url),
  'utf8'
)
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
const component = script.slice(script.indexOf('export default'))
const dependencies = 'const props = {}, mpMixin = {}, mixin = {}, addUnit = () => {}, $parent = () => {};\n'
const { default: dropdownItem } = await import('data:text/javascript,' + encodeURIComponent(dependencies + component))

const changes = []
let closed = 0
const item = {
  disabled: false,
  parent: { close: () => closed++ },
  $emit(name, value) {
    if (name === 'change') changes.push(value)
  }
}

dropdownItem.methods.cellClick.call(item, 'apple')
assert.deepEqual(changes, ['apple'])
assert.equal(closed, 1)

item.disabled = true
dropdownItem.methods.cellClick.call(item, 'orange')
assert.deepEqual(changes, ['apple'], '禁用后不应提交新选项')
assert.equal(closed, 1)

console.log('DropdownItem disabled selection assertions passed')
