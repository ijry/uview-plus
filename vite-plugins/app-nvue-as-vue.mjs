import { createRequire } from 'node:module'

const TRUE_VALUES = new Set(['true', '1', 'yes'])
const WRAPPED = Symbol('app-nvue-as-vue')
const require = createRequire(import.meta.url)

function isTruthy(value) {
    return typeof value === 'string' &&
        TRUE_VALUES.has(value.trim().toLowerCase())
}

export function isAppNvueAsVueEnabled(configured = false) {
    return configured === true || isTruthy(process.env.APP_NVUE_AS_VUE)
}

export function convertNvuePages(pagesJson) {
    if (!pagesJson?.pages) {
        return pagesJson
    }

    pagesJson.pages.forEach((page) => {
        if (page.style?.isNVue && !page.style.isSubNVue) {
            page.style.isNVue = false
        }
    })

    return pagesJson
}

function requirePagesModule() {
    const modulePath = '@dcloudio/uni-cli-shared/dist/json/pages.js'

    try {
        return require(modulePath)
    } catch (error) {
        throw new Error(
            `无法加载 uni-cli-shared 页面模块 ${modulePath}: ${error.message}`,
            { cause: error }
        )
    }
}

function installWrapper(pagesModule, name, transform) {
    const original = pagesModule[name]
    if (typeof original !== 'function') {
        throw new TypeError(`uni-cli-shared 页面导出 ${name} 不是函数`)
    }
    if (original[WRAPPED]) {
        return
    }

    const wrapped = (...args) => transform(original(...args), args)
    wrapped[WRAPPED] = true
    pagesModule[name] = wrapped
}

export default function appNvueAsVue(configured = false) {
    const enabled = isAppNvueAsVueEnabled(configured)
    if (!enabled || process.env.UNI_PLATFORM !== 'app') {
        return {
            name: 'app-nvue-as-vue',
            apply: 'build'
        }
    }

    const pagesModule = requirePagesModule()
    installWrapper(
        pagesModule,
        'normalizePagesJson',
        (pagesJson, args) => args[1] === 'app'
            ? convertNvuePages(pagesJson)
            : pagesJson
    )
    installWrapper(
        pagesModule,
        'parsePagesJsonOnce',
        (pagesJson, args) => args[1] === 'app'
            ? convertNvuePages(pagesJson)
            : pagesJson
    )

    return {
        name: 'app-nvue-as-vue',
        apply: 'build'
    }
}
