import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const componentDir = resolve(root, 'src/uni_modules/uview-plus/components/u-novel-reader')
const registrySource = readFileSync(resolve(root, 'src/uni_modules/uview-plus/libs/config/props.js'), 'utf8')

assert.equal(existsSync(componentDir), true)
assert.equal(existsSync(resolve(componentDir, 'novelReader.js')), true)
assert.equal(existsSync(resolve(componentDir, 'props.js')), true)

const propsSource = readFileSync(resolve(componentDir, 'props.js'), 'utf8')
const defaultsSource = readFileSync(resolve(componentDir, 'novelReader.js'), 'utf8')

assert.match(propsSource, /registerComponentProps/)
assert.match(defaultsSource, /novelReader/)
assert.match(registrySource, /'novelReader'/)

console.log('novel reader props contract passed')
