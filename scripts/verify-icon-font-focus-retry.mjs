import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// issue #844：up-search 输入内容后失去焦点，之后再也无法聚焦、无法删除已输入的内容。
// 链路：清除按钮只在输入框聚焦时才创建 -> 它内部的 u-icon 在 beforeCreate 里补发字体请求
// -> 微信开发者工具下这次请求会把正在聚焦的 input 挤掉焦点 -> blur 又把清除按钮收回，循环无解。
// 这里锁定：字体加载失败后，"新建 u-icon" 不得再触发字体请求，重试只能由定时器承担。

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const read = (filePath) => readFileSync(resolve(repoRoot, filePath), 'utf8')

const utilRelPath = 'src/uni_modules/uview-plus/components/u-icon/util.js'
const utilPath = resolve(repoRoot, utilRelPath)
const utilSource = read(utilRelPath)
const uIconSource = read('src/uni_modules/uview-plus/components/u-icon/u-icon.vue')
const searchSource = read('src/uni_modules/uview-plus/components/u-search/u-search.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:icon-font-focus-retry'],
    'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-icon-font-focus-retry.mjs',
    'package.json should expose verify:icon-font-focus-retry'
)

// --- 触发前提：聚焦 u-search 确实会新建一个 u-icon 实例
assert.match(
    searchSource,
    /u-search__content__close[\s\S]{0,120}v-if="isShowClear"/,
    'u-search 的清除按钮应由 isShowClear 控制显示'
)
assert.match(
    searchSource,
    /isShowClear\(\)\s*\{[\s\S]*?return !!focused && keyword !== ""/,
    'isShowClear 应依赖 focused，聚焦时才创建清除按钮'
)
assert.match(searchSource, /getFocus\(\)\s*\{\s*this\.focused = true/, '聚焦时应把 focused 置为 true')
assert.match(
    uIconSource,
    /beforeCreate\(\)\s*\{[\s\S]*?fontUtil\.loadFont\(\)/,
    'u-icon 应在 beforeCreate 尝试加载字体'
)

// --- 意图记录在源码里，避免后人把重试重新挂回 beforeCreate
assert.match(utilSource, /const maxFontRetryTimes = \d+/, 'util.js 应声明字体重试次数上限')
assert.match(utilSource, /const fontRetryDelay = \d+/, 'util.js 应声明字体重试间隔')
assert.match(utilSource, /issues\/844/, 'util.js 应留下 issue #844 的出处')

// --- 行为验证：在真实的条件编译产物上跑一遍字体加载状态机
const { initPreContext, preJs } = require(
    resolve(repoRoot, 'node_modules/@dcloudio/uni-cli-shared/dist/preprocess/index.js')
)

const createHarness = (platform, { loadFontOnce = true } = {}) => {
    initPreContext(platform)
    const body = preJs(utilSource, utilPath)
        .replace(/^\s*import\s+config\s+from\s+.*$/m, '')
        .replace(/export\s+default\s*/, 'return ')
    const requests = []
    let timers = []
    let settled = 0
    // eslint-disable-next-line no-new-func
    const fontUtil = new Function('config', 'uni', 'setTimeout', body)(
        {
            iconUrl: 'https://example.test/upicon.ttf',
            customIcon: { family: '', url: '' },
            loadFontOnce
        },
        { loadFontFace: (options) => requests.push(options) },
        (handler, delay) => timers.push({ handler, delay })
    )
    return {
        requests,
        // 等价于 u-icon.vue 的 beforeCreate()，也就是"新建一个图标"
        createIcon: () => {
            if (!fontUtil.isLoaded()) fontUtil.loadFont()
        },
        failNext: () => requests[settled++].fail({ errMsg: 'loadFontFace:fail' }),
        succeedNext: () => requests[settled++].success(),
        pendingTimers: () => timers.length,
        flushTimers: () => {
            const due = timers
            timers = []
            due.forEach(({ handler }) => handler())
        },
        isLoaded: () => fontUtil.isLoaded()
    }
}

// uni.loadFontFace 在 H5、微信、支付宝三端共用同一段非 App Vue 逻辑
for (const platform of ['h5', 'mp-weixin', 'mp-alipay']) {
    const font = createHarness(platform)

    font.createIcon()
    assert.equal(font.requests.length, 1, `${platform}: 首个图标应发起一次字体请求`)
    font.createIcon()
    font.createIcon()
    assert.equal(font.requests.length, 1, `${platform}: 请求进行中不应重复发起`)

    // 加载失败。此后每次聚焦 u-search 都会新建清除按钮里的 u-icon
    font.failNext()
    for (let i = 0; i < 5; i += 1) font.createIcon()
    assert.equal(font.requests.length, 1, `${platform}: 失败后新建图标不应立刻补发字体请求`)
    assert.equal(font.pendingTimers(), 1, `${platform}: 失败后应安排一次延时重试`)

    font.flushTimers()
    assert.equal(font.requests.length, 2, `${platform}: 延时重试应自行补发请求`)

    font.failNext()
    for (let i = 0; i < 5; i += 1) font.createIcon()
    assert.equal(font.requests.length, 2, `${platform}: 再次失败后仍不应由新建图标补发`)
    font.flushTimers()
    assert.equal(font.requests.length, 3, `${platform}: 第二次重试应生效`)

    font.failNext()
    font.flushTimers()
    assert.equal(font.requests.length, 4, `${platform}: 第三次重试应生效`)

    font.failNext()
    assert.equal(font.pendingTimers(), 0, `${platform}: 重试次数用尽后不应再安排重试`)
    for (let i = 0; i < 5; i += 1) font.createIcon()
    assert.equal(font.requests.length, 4, `${platform}: 重试用尽后新建图标不应再发字体请求`)
}

// 成功路径保持原样：loadFontOnce 为 true 时成功即收敛
{
    const font = createHarness('mp-weixin')
    font.createIcon()
    font.succeedNext()
    assert.ok(font.isLoaded(), 'loadFontOnce=true 时成功后应标记为已加载')
    for (let i = 0; i < 5; i += 1) font.createIcon()
    assert.equal(font.requests.length, 1, '成功后不应再发起字体请求')
    assert.equal(font.pendingTimers(), 0, '成功后不应留下重试定时器')
}

console.log('icon font focus retry checks passed')
