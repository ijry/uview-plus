import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const harmonyRoot = path.join(repoRoot, 'harmony-configs/entry/src/main')
const modulePath = path.join(harmonyRoot, 'module.json5')
// base is the fallback locale; defining the reasons here covers every locale
const stringPath = path.join(harmonyRoot, 'resources/base/element/string.json')

function read(filePath) {
    return fs.readFileSync(filePath, 'utf8')
}

// json5 without a parser dep: strip comments and trailing commas
function parseJson5(source) {
    const withoutComments = source
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|[^:])\/\/.*$/gm, '$1')
    return JSON.parse(withoutComments.replace(/,(\s*[}\]])/g, '$1'))
}

assert.ok(fs.existsSync(modulePath), 'missing harmony-configs module.json5')

const moduleJson = parseJson5(read(modulePath))
const permissions = moduleJson?.module?.requestPermissions
assert.ok(Array.isArray(permissions), 'module.json5 must declare requestPermissions')

// every $string: reference in ACTIVE config must resolve in string.json.
// scan the parsed object, not raw text, so commented-out permissions are ignored.
const referenced = [...JSON.stringify(moduleJson).matchAll(/"\$string:([A-Za-z0-9_]+)"/g)].map((m) => m[1])
assert.ok(referenced.length > 0, 'expected $string: references in module.json5')

const stringRel = path.relative(repoRoot, stringPath)
assert.ok(fs.existsSync(stringPath), `missing string resource file: ${stringRel}`)

const entries = JSON.parse(read(stringPath))?.string
assert.ok(Array.isArray(entries), `${stringRel} must contain a string array`)

const defined = new Set(entries.map((item) => item.name))
for (const name of referenced) {
    assert.ok(
        defined.has(name),
        `${stringRel} is missing "${name}" referenced by module.json5 (hvigor CompileResource fails with error 11211120)`
    )
}
for (const item of entries) {
    assert.ok(
        typeof item.value === 'string' && item.value.length > 0,
        `${stringRel} entry "${item.name}" must have a non-empty value`
    )
}

// location + approximate location must be declared together or listing is rejected
const names = permissions.map((item) => item.name)
assert.ok(
    names.includes('ohos.permission.LOCATION') ===
        names.includes('ohos.permission.APPROXIMATELY_LOCATION'),
    'ohos.permission.LOCATION and APPROXIMATELY_LOCATION must be declared together'
)

// reason must be a resource reference, never a literal; usedScene must be filled in
for (const item of permissions) {
    if (!('reason' in item)) continue
    assert.match(
        item.reason,
        /^\$string:/,
        `${item.name} reason must be a $string: reference, not a literal`
    )
    assert.ok(
        item.usedScene && Object.keys(item.usedScene).length > 0,
        `${item.name} must declare a non-empty usedScene`
    )
}

console.log('harmony permission resource assertions passed')
