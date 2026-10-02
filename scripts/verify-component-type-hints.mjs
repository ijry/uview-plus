/**
 * Verification script for issue #793
 * 校验 up-number-box / up-pagination / up-form / up-swipe-action-item 的 ts 声明
 * 与组件真实的 props、emits 保持一致，避免类型提示与运行时行为不符。
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')
const comps = read('src/uni_modules/uview-plus/types/comps.d.ts')
const numberBoxProps = read('src/uni_modules/uview-plus/components/u-number-box/props.js')
const numberBox = read('src/uni_modules/uview-plus/components/u-number-box/u-number-box.vue')
const numberBoxTypes = read('src/uni_modules/uview-plus/types/comps/numberBox.d.ts')
const pagination = read('src/uni_modules/uview-plus/components/u-pagination/u-pagination.vue')
const paginationTypes = read('src/uni_modules/uview-plus/types/comps/pagination.d.ts')
const formTypes = read('src/uni_modules/uview-plus/types/comps/form.d.ts')
const swipeActionItem = read('src/uni_modules/uview-plus/components/u-swipe-action-item/u-swipe-action-item.vue')
const swipeActionItemTypes = read('src/uni_modules/uview-plus/types/comps/swipeActionItem.d.ts')
const packageJson = JSON.parse(read('package.json'))

// 取 props: { ... } 里的顶层属性名
const readPropNames = source => {
    const start = source.indexOf('props: {')
    assert.notEqual(start, -1, 'expected a props declaration')
    const names = []
    let depth = 0
    for (let index = source.indexOf('{', start); index < source.length; index++) {
        const char = source[index]
        if (char === '{') {
            depth += 1
            continue
        }
        if (char === '}') {
            depth -= 1
            if (depth === 0) break
            continue
        }
        if (depth !== 1) continue
        const matched = /^([A-Za-z_$][\w$]*)\s*:/.exec(source.slice(index))
        if (matched) {
            names.push(matched[1])
            index += matched[0].length - 1
        }
    }
    assert.ok(names.length, 'expected to parse at least one prop')
    return names
}

// 取 emits: [ ... ] 里的事件名
const readEmitNames = source => {
    const matched = /emits:\s*\[([^\]]*)\]/.exec(source)
    assert.ok(matched, 'expected an emits declaration')
    return matched[1]
        .split(',')
        .map(item => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
}

// current-change -> onCurrentChange，update:modelValue -> onUpdate:modelValue
const handlerName = event => `on${event.replace(/(^|-)(\w)/g, (full, prefix, char) => char.toUpperCase())}`

const assertPropsDeclared = (label, source, types) => {
    for (const name of readPropNames(source)) {
        assert.match(
            types,
            new RegExp(`^ {2}${name}\\?:`, 'm'),
            `expected ${label} to declare the ${name} prop`
        )
    }
}

const assertEmitsDeclared = (label, source, types) => {
    for (const event of readEmitNames(source)) {
        const handler = handlerName(event)
        assert.match(
            types,
            new RegExp(`^ {2}\\[?'?${handler}'?\\]?\\?:`, 'm'),
            `expected ${label} to declare the ${event} event as ${handler}`
        )
    }
}

assert.equal(
    packageJson.scripts['verify:component-type-hints'],
    'node scripts/verify-component-type-hints.mjs'
)

// up-number-box：props 与 emits 必须全部有声明，v-model 依赖 modelValue
assertPropsDeclared('numberBox.d.ts', numberBoxProps, numberBoxTypes)
assertEmitsDeclared('numberBox.d.ts', numberBox, numberBoxTypes)
assert.match(
    numberBoxProps,
    /modelValue:\s*\{/,
    'expected the VUE3 branch of u-number-box to bind modelValue'
)
// focus/blur/change 发出的是单个对象，不是多个位置参数
assert.match(numberBox, /this\.\$emit\('focus',\s*\{/, 'expected focus to emit an object')
assert.match(numberBox, /this\.\$emit\(\s*'blur',\s*\{/, 'expected blur to emit an object')
assert.match(numberBox, /this\.\$emit\('change',\s*\{/, 'expected change to emit an object')
assert.match(
    numberBoxTypes,
    /onFocus\?:\s*\(event:\s*NumberBoxFocusPayload\)\s*=>\s*any/,
    'expected NumberBoxProps.onFocus to take a single payload'
)
assert.match(
    numberBoxTypes,
    /onBlur\?:\s*\(event:\s*NumberBoxFocusPayload\)\s*=>\s*any/,
    'expected NumberBoxProps.onBlur to take a single payload'
)
assert.match(
    numberBoxTypes,
    /onChange\?:\s*\(event:\s*NumberBoxChangePayload\)\s*=>\s*any/,
    'expected NumberBoxProps.onChange to take a single payload'
)
assert.doesNotMatch(
    numberBoxTypes,
    /on(?:Focus|Blur|Change)\?:\s*\(value:\s*any,\s*name:\s*any\)/,
    'expected the two positional arguments signature to be gone'
)
assert.match(
    numberBoxTypes,
    /type:\s*'plus'\s*\|\s*'minus'\s*\|\s*''/,
    'expected the change payload to type the trigger source field'
)

// up-pagination：组件已发布但此前没有任何类型声明
assert.match(
    comps,
    /\['up-pagination'\]:\s*typeof import\('\.\/comps\/pagination'\)\['Pagination'\]/,
    'expected up-pagination to be registered in GlobalComponents'
)
assertPropsDeclared('pagination.d.ts', pagination, paginationTypes)
assertEmitsDeclared('pagination.d.ts', pagination, paginationTypes)
assert.match(
    paginationTypes,
    /onCurrentChange\?:\s*\(page:\s*number\)\s*=>\s*any/,
    'expected PaginationProps.onCurrentChange to type the page argument'
)
assert.match(
    paginationTypes,
    /onSizeChange\?:\s*\(size:\s*number\)\s*=>\s*any/,
    'expected PaginationProps.onSizeChange to type the size argument'
)

// up-form：validate().then(valid) 里的 valid 应该是 boolean
assert.match(
    formTypes,
    /validate:\s*\(options\?:\s*FormValidateOptions\)\s*=>\s*Promise<boolean>/,
    'expected FormRef.validate to resolve with a boolean'
)
assert.match(
    formTypes,
    /validateField:\s*\(\s*value:\s*string\s*\|\s*string\[\]/,
    'expected FormRef.validateField to type its prop argument'
)
assert.match(
    formTypes,
    /clearValidate:\s*\(props\?:\s*string\s*\|\s*string\[\]\)\s*=>\s*void/,
    'expected FormRef.clearValidate to accept an optional prop list'
)

// up-swipe-action-item：click 同样是单个对象
assert.match(swipeActionItem, /this\.\$emit\('click',\s*\{/, 'expected click to emit an object')
assert.match(
    swipeActionItemTypes,
    /onClick\?:\s*\(event:\s*\{\s*index:\s*number;\s*name\?:\s*string\s*\|\s*number\s*\}\)\s*=>\s*any/,
    'expected SwipeActionItemProps.onClick to take a single payload'
)

console.log('component type hints assertions passed')
