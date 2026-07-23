import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const i18nRoot = path.join(repoRoot, 'src/uni_modules/uview-plus/libs/i18n')
const localesDir = path.join(i18nRoot, 'locales')
const indexPath = path.join(i18nRoot, 'index.js')
const packsPath = path.join(i18nRoot, 'locale-packs.js')
const mainIndexPath = path.join(repoRoot, 'src/uni_modules/uview-plus/index.js')
const changelogPath = path.join(repoRoot, 'src/uni_modules/uview-plus/changelog.md')

function read(filePath) {
    return fs.readFileSync(filePath, 'utf8')
}

function listLocaleFiles(ext) {
    if (!fs.existsSync(localesDir)) return []
    return fs.readdirSync(localesDir).filter((name) => name.endsWith(ext)).sort()
}

// ---------- static ----------
const indexSource = read(indexPath)
const mainIndexSource = read(mainIndexPath)
const changelog = read(changelogPath)

assert.match(indexSource, /zh-Hans/, 'expected zh-Hans default locale')
assert.doesNotMatch(
    indexSource,
    /from\s+['"]\.\/locales\/(?!zh-Hans(?:\.js)?['"])[^'"]+['"]/,
    'i18n/index.js must not statically import non zh-Hans locale files'
)
assert.doesNotMatch(
    indexSource,
    /export\s+\{[^}]*\ben\b/,
    'i18n/index.js must not re-export optional locale packs'
)
assert.equal(listLocaleFiles('.json').length, 0, 'locale json files should be removed')

const requiredLocaleJs = [
    'zh-Hans.js',
    'zh-Hant.js',
    'en.js',
    'es.js',
    'fr.js',
    'de.js',
    'ko.js',
    'ja.js',
    'ru.js',
    'th.js',
    'all.js'
]
for (const name of requiredLocaleJs) {
    assert.ok(
        fs.existsSync(path.join(localesDir, name)),
        `missing locale module: ${name}`
    )
}
assert.ok(fs.existsSync(packsPath), 'missing locale-packs.js')

const packsSource = read(packsPath)
for (const name of ['en', 'ja', 'zhHant', 'all']) {
    assert.match(packsSource, new RegExp(name), `locale-packs should export ${name}`)
}

assert.match(mainIndexSource, /registerLocale/, 'main index must export registerLocale')
assert.match(mainIndexSource, /allLocales|all as allLocales/, 'main index must export allLocales')
assert.match(mainIndexSource, /\ben\b/, 'main index must export en locale pack')
assert.match(changelog, /feat!|重大变更|按需/, 'changelog must mark breaking on-demand i18n change')
assert.match(changelog, /#908/, 'changelog should reference #908')

// ---------- behavioral (sandbox import) ----------
function installUniMock(initialLocale = 'zh-Hans') {
    const listeners = []
    globalThis.uni = {
        __locale: initialLocale,
        getLocale() {
            return this.__locale
        },
        setLocale(locale) {
            this.__locale = locale
            listeners.forEach((fn) => fn(locale))
        },
        onLocaleChange(fn) {
            listeners.push(fn)
        }
    }
    return listeners
}

async function importI18nFresh() {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'uview-i18n-'))
    const target = path.join(tempDir, `i18n-${Date.now()}-${Math.random().toString(16).slice(2)}.mjs`)
    let source = read(indexPath)
    source = source.replace(
        /from\s+['"](\.\/locales\/[^'"]+)['"]/g,
        (full, rel) => {
            const abs = pathToFileURL(path.resolve(i18nRoot, rel)).href
            return `from '${abs}'`
        }
    )
    fs.writeFileSync(target, source, 'utf8')
    return import(pathToFileURL(target).href + `?t=${Date.now()}`)
}

async function importLocalePack(relName) {
    const filePath = path.join(localesDir, relName)
    return import(pathToFileURL(filePath).href + `?t=${Date.now()}`)
}

async function runBehavior() {
    installUniMock('zh-Hans')
    const mod = await importI18nFresh()
    const {
        t,
        registerLocale,
        hasLocale,
        getLocale,
        setLocale
    } = mod

    assert.equal(typeof t, 'function')
    assert.equal(typeof registerLocale, 'function')
    assert.equal(hasLocale('zh-Hans'), true)
    assert.equal(hasLocale('en'), false)
    assert.equal(t('up.common.cancel'), '取消')

    // unregistered en falls back to zh-Hans
    setLocale('en')
    assert.equal(getLocale(), 'en')
    assert.equal(t('up.common.cancel'), '取消')

    const enMod = await importLocalePack('en.js')
    registerLocale('en', enMod.default)
    assert.equal(hasLocale('en'), true)
    assert.equal(t('up.common.cancel'), 'Cancel')

    const jaMod = await importLocalePack('ja.js')
    registerLocale({ ja: jaMod.default })
    setLocale('ja')
    assert.equal(t('up.common.cancel'), jaMod.default['up.common.cancel'])

    // params interpolation still works on zh-Hans
    setLocale('zh-Hans')
    const withParam = t('up.calendar.daysExceed', { days: 3 })
    assert.match(String(withParam), /3/)

    // all locales map
    const allMod = await importLocalePack('all.js')
    assert.equal(typeof allMod.default, 'object')
    assert.ok(allMod.default.en || allMod.default['en'])
    registerLocale(allMod.default)
    assert.equal(hasLocale('ru'), true)
}

await runBehavior()
console.log('i18n on-demand assertions passed')
