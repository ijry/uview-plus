import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = path => readFileSync(resolve(repoRoot, path), 'utf8')

const posterSource = read('src/uni_modules/uview-plus/components/u-poster/u-poster.vue')
const canvasSource = read('src/uni_modules/uview-plus/components/u-canvas/u-canvas.vue')

/**
 * 从 SFC 中抽出一个方法定义（含方法名与函数体），用于脱离 uni-app 运行时直接执行。
 */
function extractMethod(source, signature) {
    const start = source.indexOf(signature)
    assert.notEqual(start, -1, `未能在源码中找到方法: ${signature}`)
    let depth = 0
    let index = source.indexOf('{', start)
    const bodyStart = index
    for (; index < source.length; index++) {
        if (source[index] === '{') depth++
        else if (source[index] === '}') {
            depth--
            if (depth === 0) break
        }
    }
    assert.ok(index < source.length, `方法括号不配对: ${signature}`)
    return source.slice(start, bodyStart) + source.slice(bodyStart, index + 1)
}

function compileMethod(source, signature, isAsync) {
    const body = extractMethod(source, signature)
    // eslint-disable-next-line no-new-func
    return new Function(`return ({ ${isAsync ? 'async ' : ''}${body} })`)()
}

const RPX_RATIO = 0.5 // 鸿蒙超宽设备统一走 baseWidth 375：375/750 = 0.5
const convertRpxToPx = value => (typeof value === 'number'
    ? value
    : (String(value).endsWith('rpx') ? parseFloat(value) * RPX_RATIO : parseFloat(value) || 0))

// ---------------------------------------------------------------------------
// 1. u-poster.drawTextWithLineClamp：鸿蒙 measureText 恒返回 0 时仍必须换行
// ---------------------------------------------------------------------------
const poster = compileMethod(posterSource, 'drawTextWithLineClamp(ctx, text, x, y, maxWidth, css) {', true)

function createHarmonyCtx() {
    const drawn = []
    return {
        drawn,
        // 鸿蒙 CanvasContext.measureText 同步返回值恒为 0
        measureText: () => ({ width: 0 }),
        fillText: (text, x, y) => drawn.push({ text, x, y })
    }
}

const DEMO_TEXT = '精美陶瓷茶具套装，高端大气上档次，送礼自用两相宜'
const DEMO_CSS = { lineClamp: 2, fontSize: '36rpx', lineHeight: '50rpx' }
const DEMO_MAX_WIDTH = convertRpxToPx('396rpx')

const harmonyCtx = createHarmonyCtx()
await poster.drawTextWithLineClamp.call(
    { convertRpxToPx },
    harmonyCtx, DEMO_TEXT, 0, 0, DEMO_MAX_WIDTH, DEMO_CSS
)

assert.equal(
    harmonyCtx.drawn.length, 2,
    `鸿蒙测量失效时海报文本必须按 lineClamp 换行，实际绘制 ${harmonyCtx.drawn.length} 行: ` +
    JSON.stringify(harmonyCtx.drawn.map(item => item.text))
)
assert.ok(
    harmonyCtx.drawn[0].text.length < DEMO_TEXT.length,
    '第一行不能承载整段文本，否则等于没有换行'
)
assert.match(
    harmonyCtx.drawn[1].text, /\.\.\.$/,
    '超出 lineClamp 的文本应以省略号结尾'
)
// 行距必须生效，否则两行会重叠成一团
const lineHeight = convertRpxToPx(DEMO_CSS.lineHeight)
assert.equal(
    harmonyCtx.drawn[1].y - harmonyCtx.drawn[0].y, lineHeight,
    '两行之间应相隔一个 lineHeight'
)
// 估算宽度不得超出可用宽度：全角字符按一个字号计算
const fontSize = convertRpxToPx(DEMO_CSS.fontSize)
for (const line of harmonyCtx.drawn) {
    const estimated = Array.from(line.text).reduce(
        (width, char) => width + (/[一-鿿＀-￯]/.test(char) ? fontSize : fontSize * 0.56),
        0
    )
    assert.ok(
        estimated <= DEMO_MAX_WIDTH + 0.01,
        `换行后单行估算宽度 ${estimated} 超过可用宽度 ${DEMO_MAX_WIDTH}: ${line.text}`
    )
}

// 真实测量可用时依旧优先采用测量值（不能被兜底估算顶掉）
const measuredCtx = {
    drawn: [],
    measureText: text => ({ width: Array.from(String(text)).length * 4 }),
    fillText(text, x, y) { this.drawn.push({ text, x, y }) }
}
await poster.drawTextWithLineClamp.call(
    { convertRpxToPx },
    measuredCtx, DEMO_TEXT, 0, 0, DEMO_MAX_WIDTH, DEMO_CSS
)
assert.equal(
    measuredCtx.drawn.length, 1,
    '真实测量表明可以放进一行时，不应触发多余换行'
)
assert.equal(
    measuredCtx.drawn[0].text, DEMO_TEXT,
    '一行放得下时应完整绘制原文'
)

// ---------------------------------------------------------------------------
// 2. u-canvas.estimateTextWidth：全角字符不能按半角估算
// ---------------------------------------------------------------------------
const canvas = compileMethod(canvasSource, 'estimateTextWidth(text, fontSize) {', false)
const estimate = (text, size) => canvas.estimateTextWidth.call({ fontSize: 12 }, text, size)

assert.equal(estimate('汉字', 20), 40, '汉字宽度应约等于一个字号')
assert.ok(
    estimate('中文', 20) > estimate('ab', 20),
    '全角字符必须比半角字符宽，否则中文会短算而不换行'
)
assert.ok(estimate('中文测试', 20) > 20 * 4 * 0.6, '中文估算不得沿用 0.6 的半角系数')
assert.equal(estimate('', 20), 0, '空字符串宽度为 0')

// ---------------------------------------------------------------------------
// 3. u-canvas.measureText：绝不能把 0 宽度交给调用方
// ---------------------------------------------------------------------------
const measure = compileMethod(canvasSource, 'measureText(text) {', false)
const zeroWidthResult = measure.measureText.call({
    fontSize: 18,
    ctx: { measureText: () => ({ width: 0 }) },
    estimateTextWidth: canvas.estimateTextWidth
}, '中文')
assert.ok(
    zeroWidthResult.width > 0,
    '同步测量返回 0 时必须回退到估算，否则换行逻辑会误判为宽度足够'
)
const realWidthResult = measure.measureText.call({
    fontSize: 18,
    ctx: { measureText: () => ({ width: 123 }) },
    estimateTextWidth: canvas.estimateTextWidth
}, '中文')
assert.equal(realWidthResult.width, 123, '有效测量值应原样返回')

// ---------------------------------------------------------------------------
// 4. 源码约束：鸿蒙分支必须存在且有超时兜底
// ---------------------------------------------------------------------------
assert.match(
    canvasSource,
    /#ifdef APP-HARMONY[\s\S]*?this\.ctx\.measureText\(String\(text\), done\)[\s\S]*?#endif/,
    '鸿蒙必须通过 callback 形式取真实文本宽度'
)
assert.match(
    canvasSource,
    /_harmonyMeasureUnavailable/,
    '鸿蒙回调不可用时应记录状态，避免每次测量都干等超时'
)

console.log('HarmonyOS 海报文本换行断言全部通过')
