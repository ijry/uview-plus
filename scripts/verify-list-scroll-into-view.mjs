#!/usr/bin/env node

/**
 * Verification script for issue #671 — u-list 的 scrollIntoViewById 不生效
 *
 * 这个脚本不做字符串匹配，而是用 uni-app 自己的条件编译器把 u-list.vue 编成各端的
 * 代码，再把编出来的 scrollIntoViewById 真正跑一遍：
 *   - H5 / 小程序：断言方法体不为空，且会把 anchor 换算成 scroll-view 需要的节点 id
 *   - nvue：断言能通过 children 找到 weex 节点（老实现读的 this.refs 永远是空数组）
 * 同时执行 u-list-item 的 anchorId 计算属性，确认未设置 anchor 时不会输出重复 id。
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const { preprocess } = require('@dcloudio/uni-cli-shared/lib/preprocess')

const listPath = join(projectRoot, 'src/uni_modules/uview-plus/components/u-list/u-list.vue')
const itemPath = join(projectRoot, 'src/uni_modules/uview-plus/components/u-list-item/u-list-item.vue')
const listSrc = readFileSync(listPath, 'utf-8')
const itemSrc = readFileSync(itemPath, 'utf-8')

console.log('Verifying u-list scrollIntoViewById (issue #671)...\n')

const issues = []
const ok = (msg) => console.log('✓ ' + msg)
const bad = (msg) => { issues.push('❌ ' + msg); console.log('❌ ' + msg) }

// 从 start 处的第一个 { 起做括号配对，返回整段 `名字(...) { ... }`
function braceMatch(src, start) {
    let i = src.indexOf('{', start)
    let depth = 0
    for (; i < src.length; i++) {
        if (src[i] === '{') depth++
        else if (src[i] === '}') { depth--; if (depth === 0) break }
    }
    return src.slice(start, i + 1)
}

// 取出某个平台条件编译后的方法源码
function compiledMethod(src, platform, name) {
    const out = preprocess(src, { [platform]: true }, { type: 'js' })
    const start = out.indexOf(`${name}(id) {`)
    if (start === -1) return null
    return braceMatch(out, start)
}

// 方法体里真正会执行的语句数（去掉空行和注释）
function statementCount(methodSrc) {
    const body = methodSrc.slice(methodSrc.indexOf('{') + 1, -1)
    return body.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//')).length
}

// ---------------------------------------------------------------- 1. 各端方法体非空
const platforms = ['H5', 'MP_WEIXIN', 'MP_ALIPAY', 'APP_PLUS', 'APP_NVUE']
for (const platform of platforms) {
    const method = compiledMethod(listSrc, platform, 'scrollIntoViewById')
    if (!method) {
        bad(`${platform}: 找不到 scrollIntoViewById`)
        continue
    }
    const count = statementCount(method)
    if (count === 0) bad(`${platform}: scrollIntoViewById 条件编译后是空方法（#671 的直接原因）`)
    else ok(`${platform}: scrollIntoViewById 编译后有 ${count} 条语句`)
}

// ---------------------------------------------------------------- 2. 非 nvue 分支实跑
function makeListCtx() {
    const ctx = {
        // children 由子组件的 getParentData 维护
        children: Array.from({ length: 5 }, (_, i) => ({
            anchor: `anchor_${i}`,
            $refs: { [`u-list-item-anchor_${i}`]: { weexNode: `node_${i}` } }
        })),
        scrollWithAnimation: true,
        innerScrollIntoView: '',
        ticks: [],
        $nextTick(fn) { this.ticks.push(fn) },
        flush() { const q = this.ticks; this.ticks = []; q.forEach(fn => fn()) }
    }
    return ctx
}

function runH5(id, ctx = makeListCtx()) {
    const src = compiledMethod(listSrc, 'H5', 'scrollIntoViewById')
    const fn = new Function(`return function ${src}`)()
    fn.call(ctx, id)
    return ctx
}

// anchor 要换算成 u-list-item 输出的节点 id
{
    const ctx = runH5('anchor_3')
    if (ctx.innerScrollIntoView === 'u-list-item-anchor_3') ok('非 nvue: anchor_3 -> u-list-item-anchor_3')
    else bad(`非 nvue: anchor_3 应换算成 u-list-item-anchor_3，实际为 ${JSON.stringify(ctx.innerScrollIntoView)}`)
}

// 直接传节点 id（scroll-into-view 属性的原语义）要原样透传
{
    const ctx = runH5('some-user-node')
    if (ctx.innerScrollIntoView === 'some-user-node') ok('非 nvue: 非 anchor 的节点 id 原样透传')
    else bad(`非 nvue: 节点 id 应原样透传，实际为 ${JSON.stringify(ctx.innerScrollIntoView)}`)
}

// 连续滚动到同一个节点：scroll-into-view 需要先置空再赋值才会二次生效
{
    const ctx = runH5('anchor_3')
    runH5('anchor_3', ctx)
    if (ctx.innerScrollIntoView !== '') {
        bad('非 nvue: 重复调用同一 anchor 时没有先置空，scroll-into-view 不会再次触发')
    } else {
        ctx.flush()
        if (ctx.innerScrollIntoView === 'u-list-item-anchor_3') ok('非 nvue: 重复调用同一 anchor 会先置空再赋值')
        else bad(`非 nvue: 置空后没有重新赋值，实际为 ${JSON.stringify(ctx.innerScrollIntoView)}`)
    }
}

// 空值不能抛错，也不能把已有目标冲掉
{
    const ctx = makeListCtx()
    ctx.innerScrollIntoView = 'keep-me'
    let err = null
    try { for (const v of ['', null, undefined]) runH5(v, ctx) } catch (e) { err = String(e) }
    if (err) bad(`非 nvue: 空 id 抛错 ${err}`)
    else if (ctx.innerScrollIntoView !== 'keep-me') bad('非 nvue: 空 id 不应改动滚动目标')
    else ok('非 nvue: 空 id 是安全的空操作')
}

// ---------------------------------------------------------------- 3. nvue 分支实跑
function runNvue(id, ctx = makeListCtx()) {
    const src = compiledMethod(listSrc, 'APP_NVUE', 'scrollIntoViewById')
    const scrolled = []
    const dom = { scrollToElement: (node, opts) => scrolled.push({ node, opts }) }
    const fn = new Function('dom', `return function ${src}`)(dom)
    fn.call(ctx, id)
    return scrolled
}

// children 里找到节点，通过 weex dom.scrollToElement
{
    let hit = []
    let err = null
    try { hit = runNvue('anchor_3') } catch (e) { err = String(e) }
    if (err) bad(`nvue: anchor_3 抛错 ${err}`)
    else if (hit.length === 1 && hit[0].node.weexNode === 'node_3' && hit[0].opts.animated === true) {
        ok('nvue: anchor_3 找到 weex 节点，scrollWithAnimation 生效')
    } else {
        bad(`nvue: anchor_3 应找到 node_3 并传递 animated: true，实际 ${JSON.stringify(hit)}`)
    }
}

// 已经带前缀的 ref 名也要能找到
{
    let hit = []
    let err = null
    try { hit = runNvue('u-list-item-anchor_1') } catch (e) { err = String(e) }
    if (err) bad(`nvue: u-list-item-anchor_1 抛错 ${err}`)
    else if (hit.length === 1 && hit[0].node.weexNode === 'node_1') ok('nvue: 已带前缀的 ref 名也能找到')
    else bad(`nvue: u-list-item-anchor_1 应找到 node_1，实际 ${JSON.stringify(hit)}`)
}

// 未知 anchor 是空操作，不能抛错
{
    let err = null
    let hit = []
    try { hit = runNvue('nope') } catch (e) { err = String(e) }
    if (err) bad(`nvue: 未知 anchor 抛错 ${err}`)
    else if (hit.length > 0) bad('nvue: 未知 anchor 不该滚动')
    else ok('nvue: 未知 anchor 是安全的空操作')
}

// ---------------------------------------------------------------- 4. u-list-item 的 anchorId 计算属性
function runAnchorId(anchorValue) {
    const compiled = preprocess(itemSrc, { H5: true }, { type: 'js' })
    const start = compiled.indexOf('anchorId()')
    if (start === -1) return { missing: true }
    const body = braceMatch(compiled, start)
    const fn = new Function(`return function ${body}`)()
    return { value: fn.call({ anchor: anchorValue }) }
}

{
    const r = runAnchorId('my_anchor')
    if (r.missing) bad('u-list-item: 缺少 anchorId 计算属性，节点不会带 id，scroll-into-view 无从下手')
    else if (r.value === 'u-list-item-my_anchor') ok('u-list-item: anchor="my_anchor" -> id="u-list-item-my_anchor"')
    else bad(`u-list-item: anchor="my_anchor" 应输出 u-list-item-my_anchor，实际 ${r.value}`)
}

{
    let allNull = true
    for (const v of ['', null, undefined]) {
        const r = runAnchorId(v)
        if (r.missing || r.value !== null) {
            bad(`u-list-item: anchor=${JSON.stringify(v)} 应输出 null（不写 id 属性），实际 ${JSON.stringify(r.value)}`)
            allNull = false
            break
        }
    }
    if (allNull) ok('u-list-item: 空 anchor 不输出 id，避免重复 id')
}

// 模板上必须真的把 anchorId 绑成 id，否则计算属性再对也没用
if (/:id\s*=\s*"anchorId"/.test(itemSrc)) ok('u-list-item: 模板已绑定 :id="anchorId"')
else bad('u-list-item: 模板没有绑定 :id="anchorId"')

if (/:scroll-into-view\s*=\s*"innerScrollIntoView"/.test(listSrc)) ok('u-list: scroll-view 已绑定 innerScrollIntoView')
else bad('u-list: scroll-view 没有绑定 innerScrollIntoView')

// ---------------------------------------------------------------- 完工
console.log('')
if (issues.length === 0) {
    console.log('✅ 全部通过：scrollIntoViewById 在各端都能正常工作')
    process.exit(0)
} else {
    console.log(`❌ ${issues.length} 项失败\n`)
    issues.forEach(i => console.log(i))
    process.exit(1)
}



