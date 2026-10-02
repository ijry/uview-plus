import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const componentDir = path.join(repoRoot, 'src/uni_modules/uview-plus/components/u-video')
const localesDir = path.join(repoRoot, 'src/uni_modules/uview-plus/libs/i18n/locales')

function read(filePath) {
    return fs.readFileSync(filePath, 'utf8')
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function readComponentFile(name) {
    const filePath = path.join(componentDir, name)
    assert.ok(fs.existsSync(filePath), `missing u-video file: ${name}`)
    return read(filePath)
}

// ---------- 组件文件与注册约定 ----------
const source = readComponentFile('u-video.vue')
const propsSource = readComponentFile('props.js')
const defaultsSource = readComponentFile('video.js')
const danmakuSource = readComponentFile('danmaku.js')
const utilsSource = readComponentFile('video-utils.js')
const danmakuView = readComponentFile('video-danmaku.vue')
const sliderView = readComponentFile('video-slider.vue')

// easycom 只按 components/u-video/u-video.vue 解析，H5 全局注册还要求组件声明 name
assert.match(source, /name:\s*'up-video'/, 'u-video.vue must declare name: up-video')
for (const child of fs.readdirSync(componentDir)) {
    assert.doesNotMatch(
        child,
        /^u-(?!video\.vue$)/,
        `child file ${child} would be picked up by the u-* easycom glob`
    )
}

// props 惰性注册约定（scripts/verify-props-lazy-loading.mjs 会一并扫描）
assert.match(propsSource, /registerComponentProps\(/, 'props.js must register defaults lazily')
assert.match(propsSource, /from\s+'\.\/video'/, 'props.js must import ./video defaults')
assert.match(defaultsSource, /export\s+default\s*{\s*video:\s*{/, 'video.js must default-export { video: {...} }')
for (const helper of [danmakuSource, utilsSource]) {
    assert.doesNotMatch(helper, /export\s+default/, 'helper modules must stay named-export only')
    assert.doesNotMatch(helper, /from\s+'(uni|vue)/, 'helper modules must stay framework free')
}

const propsRegistry = read(path.join(repoRoot, 'src/uni_modules/uview-plus/libs/config/props.js'))
assert.match(propsRegistry, /'video'/, "libs/config/props.js componentKeys must contain 'video'")

// ---------- issue #745 要求的播放器能力 ----------
const capabilities = {
    倍速: [/rateList/, /playbackRate\(/],
    弹幕: [/danmuList/, /danmuOpen/, /sendDanmu/],
    选集: [/episodes/, /episodeIndex/, /episode-change/],
    音量: [/volume/, /muted/],
    封面: [/poster/],
    广告: [/ads/, /ad-skip/, /ad-click/],
    全屏: [/requestFullScreen\(/, /exitFullScreen\(/],
    进度: [/seek\(/, /@timeupdate/]
}
for (const [name, matchers] of Object.entries(capabilities)) {
    for (const matcher of matchers) {
        assert.match(source + propsSource + defaultsSource, matcher, `u-video 缺少${name}相关实现: ${matcher}`)
    }
}

// 自绘控制层必须关掉原生控制条，并通过 VideoContext 操作播放器
assert.match(source, /:controls="false"/, 'custom controls require native controls disabled')
assert.match(source, /createVideoContext\(/, 'u-video must drive the player through createVideoContext')
// 控制层放在 <video> 子节点内，才能在全屏状态下继续显示
assert.match(
    source,
    /<video[\s\S]*?>[\s\S]*?up-video__layer[\s\S]*?<\/video>/,
    'control layers must be rendered inside the <video> node so fullscreen keeps them'
)
for (const event of ['@play', '@pause', '@ended', '@timeupdate', '@waiting', '@error', '@fullscreenchange', '@progress']) {
    assert.match(source, new RegExp(escapeRegExp(event)), `u-video must handle ${event}`)
}
assert.match(danmakuView, /translateX/, 'danmaku layer must animate horizontally')
assert.match(sliderView, /touchstart|touchmove/, 'progress slider must support dragging')

// ---------- 示例与文案接线 ----------
const pagesJson = read(path.join(repoRoot, 'src/pages.json'))
assert.match(pagesJson, /"video\/video"/, 'pages.json must register the video demo page')
const demoConfig = read(path.join(repoRoot, 'src/pages/example/components.config.js'))
assert.match(demoConfig, /\/pages\/componentsD\/video\/video/, 'components.config.js must list the video demo')
assert.ok(
    fs.existsSync(path.join(repoRoot, 'src/pages/componentsD/video/video.nvue')),
    'missing demo page src/pages/componentsD/video/video.nvue'
)
assert.ok(
    fs.existsSync(path.join(repoRoot, 'src/static/uview/demo/video.png')),
    'missing demo icon src/static/uview/demo/video.png'
)

const localeFiles = fs.readdirSync(localesDir).filter((name) => /^(zh-Hans|zh-Hant|en|es|fr|de|ko|ja|ru|th)\.js$/.test(name))
assert.equal(localeFiles.length, 10, 'expected 10 locale files')
const videoKeys = new Set()
for (const key of read(path.join(localesDir, 'zh-Hans.js')).matchAll(/"(up\.video\.[^"]+)"/g)) {
    videoKeys.add(key[1])
}
assert.ok(videoKeys.size >= 8, `expected up.video.* labels in zh-Hans, got ${videoKeys.size}`)
for (const name of localeFiles) {
    const localeSource = read(path.join(localesDir, name))
    for (const key of videoKeys) {
        assert.match(localeSource, new RegExp(escapeRegExp(`"${key}"`)), `${name} missing ${key}`)
    }
}
for (const key of videoKeys) {
    assert.match(source, new RegExp(escapeRegExp(key)), `u-video.vue never uses ${key}`)
}

// ---------- 纯逻辑模块的行为断言 ----------
const utils = await import(pathToFileURL(path.join(componentDir, 'video-utils.js')).href)
const danmaku = await import(pathToFileURL(path.join(componentDir, 'danmaku.js')).href)

assert.equal(utils.formatVideoTime(0), '00:00')
assert.equal(utils.formatVideoTime(65), '01:05')
assert.equal(utils.formatVideoTime(3725), '01:02:05')
assert.equal(utils.formatVideoTime(Number.NaN), '00:00')
assert.equal(utils.formatVideoTime(-10), '00:00')

assert.deepEqual(utils.normalizeRateList([2, 1, '1.5', 0, -1, 1]), [1, 1.5, 2])
assert.deepEqual(utils.normalizeRateList('nope'), [1])

assert.deepEqual(
    utils.normalizeEpisodes(['a.mp4', { src: 'b.mp4', title: '预告' }]),
    [
        { src: 'a.mp4', title: '1', poster: '', danmuList: null },
        { src: 'b.mp4', title: '预告', poster: '', danmuList: null }
    ]
)

const ads = utils.normalizeAds([
    { src: 'ad.mp4' },
    { type: 'pause', image: 'p.png' },
    { type: 'postroll', image: 'q.png', duration: 3, skipAfter: 1 }
])
assert.equal(ads[0].type, 'preroll', 'ads default to preroll')
assert.equal(ads[0].duration, 0, 'video ads keep their own duration')
assert.equal(ads[1].duration, 5, 'image ads fall back to a 5s duration')
assert.deepEqual(utils.pickAds(ads, 'postroll').map((item) => item.image), ['q.png'])
assert.equal(utils.adSkippable({ skipAfter: -1 }, 99), false)
assert.equal(utils.adSkippable({ skipAfter: 0 }, 0), true)
assert.equal(utils.adSkippable({ skipAfter: 5 }, 4.9), false)
assert.equal(utils.adSkippable({ skipAfter: 5 }, 5), true)

assert.equal(utils.timeToProgress(30, 120), 25)
assert.equal(utils.timeToProgress(30, 0), 0, 'unknown duration must not divide by zero')
assert.equal(utils.progressToTime(25, 120), 30)
assert.equal(utils.clampNumber(1.4, 0, 1), 1)

// 弹幕：归一化、时间游标、轨道复用
const list = danmaku.normalizeDanmuList([
    { text: '晚点的', time: 9 },
    '开场',
    { text: '中间', time: 5, color: '#ff0000', type: 'top' }
])
assert.deepEqual(list.map((item) => item.time), [0, 5, 9], 'danmu list must be sorted by time')
assert.equal(list[0].text, '开场')
assert.equal(list[1].type, 'top')
assert.equal(list[2].type, 'scroll', 'unknown type falls back to scroll')

assert.equal(danmaku.findDanmuCursor(list, -1), 0)
assert.equal(danmaku.findDanmuCursor(list, 5), 1, 'cursor points at the first item still due')
assert.equal(danmaku.findDanmuCursor(list, 6), 2)
assert.equal(danmaku.findDanmuCursor(list, 100), 3)

const state = danmaku.createDanmuState()
const layout = { containerWidth: 300, itemWidth: 100, duration: 8, trackCount: 2 }
assert.equal(danmaku.acquireDanmuTrack(state, { ...layout, now: 0 }), 0)
assert.equal(danmaku.acquireDanmuTrack(state, { ...layout, now: 0 }), 1, 'second danmu takes the next track')
assert.equal(danmaku.acquireDanmuTrack(state, { ...layout, now: 0 }), -1, 'all tracks busy')
// 100px 宽的弹幕在 8s 内走完 400px，2s 后尾巴已完全进场，轨道可复用
assert.equal(danmaku.acquireDanmuTrack(state, { ...layout, now: 2400 }), 0, 'track frees once the tail cleared')
danmaku.resetDanmuState(state)
assert.equal(danmaku.acquireDanmuTrack(state, { ...layout, now: 2400 }), 0, 'reset clears every track')
assert.ok(
    danmaku.estimateDanmuWidth('十个字的弹幕内容', 14) > danmaku.estimateDanmuWidth('短', 14),
    'width estimation must grow with the text'
)

console.log('u-video component contract passed')
