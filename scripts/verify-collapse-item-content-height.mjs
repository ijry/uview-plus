#!/usr/bin/env node

/**
 * issue #811 回归验证
 * u-collapse-item 展开后不应把面板高度永久锁在一次性的测量值上：
 * 内容里的图片、异步数据在测量之后才变高时，面板必须跟着内容长高，
 * 而不是被 .u-collapse-item__content 的 overflow:hidden 裁掉一截。
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(
    resolve(__dirname, '../src/uni_modules/uview-plus/components/u-collapse-item/u-collapse-item.vue'),
    'utf8'
)

// 按非 nvue 端（H5/小程序/app-vue）的条件编译结果取脚本
function loadCollapseItemOptions(deps) {
    const scriptBlock = source.match(/<script>([\s\S]*?)<\/script>/)
    assert.ok(scriptBlock, 'u-collapse-item 应该包含 script 块')
    const executableScript = scriptBlock[1]
        .replace(/\/\/ #ifdef APP-NVUE[\s\S]*?\/\/ #endif/g, '')
        .replace(/^\s*import\s+.*$/gm, '')
        .replace(/export default\s*\{/, 'return {')
    return new Function(
        'props', 'mpMixin', 'mixin', 'nextTick', 'guid', 'sleep', 'error', 'test',
        executableScript
    )(deps.props, deps.mpMixin, deps.mixin, deps.nextTick, deps.guid, deps.sleep, deps.error, deps.test)
}

function createAnimationRecorder() {
    const record = { steps: [] }
    globalThis.uni = {
        createAnimation() {
            let pendingHeight
            const api = {
                height(value) {
                    pendingHeight = value
                    return api
                },
                step(option) {
                    record.steps.push({ height: pendingHeight, duration: option && option.duration })
                    return api
                },
                export() {
                    return { actions: record.steps.slice() }
                }
            }
            return api
        }
    }
    return record
}

function createInstance(options) {
    const contentStyleLog = []
    let contentStyle = {}
    const instance = {
        ...options.data(),
        duration: 300,
        expanded: false,
        // 模拟内容自然高度，测试过程中会变化
        contentHeight: 42,
        queryRectCalls: 0,
        contentStyleLog,
        async $uGetRect() {
            instance.queryRectCalls++
            return { height: instance.contentHeight }
        }
    }
    Object.defineProperty(instance, 'contentStyle', {
        get: () => contentStyle,
        set(value) {
            contentStyle = value
            contentStyleLog.push('height' in value ? value.height : '(未设置)')
        }
    })
    for (const [name, method] of Object.entries(options.methods)) {
        instance[name] = method.bind(instance)
    }
    return instance
}

async function flushMicrotasks(times = 30) {
    for (let index = 0; index < times; index++) await Promise.resolve()
}

const animationRecord = createAnimationRecorder()
// 需要考察“动画结束回调”时机的用例会打开这个闸门，把 sleep 的 resolve 攒起来手动放行
let parkedSleeps = null
const options = loadCollapseItemOptions({
    props: {},
    mpMixin: {},
    mixin: {},
    nextTick: async () => {},
    guid: () => 'u-test-id',
    sleep: () => (parkedSleeps ? new Promise((resolve) => parkedSleeps.push(resolve)) : Promise.resolve()),
    error: () => {},
    test: { array: Array.isArray }
})
const instance = createInstance(options)

// 测试 1: 展开动画结束后高度交还给内容
{
    instance.expanded = true
    await instance.setContentAnimate()
    await flushMicrotasks()
    assert.equal(instance.contentStyle.height, 'auto', '展开动画结束后面板高度应该是 auto')
    console.log('✓ 展开动画结束后面板高度交还给内容（height: auto）')
}

// 测试 2: 展开动画只导出一个 step
// uni 的 step() 会累积之前的 animates，多余的空 step 会在动画结束时把同一个像素高度
// 再写一遍，正好盖掉上面交还给内容的 auto 高度
{
    assert.equal(animationRecord.steps.length, 1, '展开动画应该只有一个 step')
    assert.equal(animationRecord.steps[0].height, 42, '展开动画的目标高度应该是测量到的内容高度')
    assert.equal(animationRecord.steps[0].duration, 300, '展开动画应该沿用 duration 属性')
    console.log('✓ 展开仍然是一次 height 过渡动画，目标高度取自节点测量值')
}

// 测试 3: 内容在展开之后变高，面板不会停留在旧的测量值上
{
    instance.contentHeight = 96
    // 没有任何新的点击/重新初始化，面板高度依然由内容决定
    assert.equal(instance.contentStyle.height, 'auto', '内容变高后面板高度仍应交给内容，而不是锁定像素值')
    console.log('✓ 内容在测量之后变高时，面板高度不再被锁死（issue #811）')
}

// 测试 4: 收起前先把 auto 固定成当前实际高度，动画才有起点
{
    animationRecord.steps.length = 0
    instance.contentStyleLog.length = 0
    const rectCallsBefore = instance.queryRectCalls
    instance.expanded = false
    await instance.setContentAnimate()
    await flushMicrotasks()
    assert.deepEqual(
        instance.contentStyleLog,
        ['96px', '(未设置)'],
        '收起时应先把高度固定为当前实际高度，动画结束后再解除锁定'
    )
    assert.ok(
        instance.queryRectCalls - rectCallsBefore >= 2,
        '固定高度后应再读一次布局，确保像素高度已生效'
    )
    assert.equal(animationRecord.steps.length, 1, '收起动画应该只有一个 step')
    assert.equal(animationRecord.steps[0].height, 0, '收起动画的目标高度应该是 0')
    console.log('✓ 收起时先把 auto 固定为实际高度，收起动画仍然从实际高度过渡到 0')
}

// 测试 5: 快速连点时，旧动画的结束回调不能改写新动画的高度
{
    instance.expanded = true
    await instance.setContentAnimate()
    await flushMicrotasks()
    assert.equal(instance.contentStyle.height, 'auto', '前置条件：面板处于展开且高度为 auto 的状态')

    parkedSleeps = []
    instance.expanded = false
    await instance.setContentAnimate() // 收起：把高度固定成 96px，结束回调被拦住
    await flushMicrotasks()
    assert.equal(instance.contentStyle.height, '96px', '收起时应先固定为实际高度')

    instance.expanded = true
    await instance.setContentAnimate() // 动画还没结束又点开
    await flushMicrotasks()

    parkedSleeps[0]() // 放行收起动画的结束回调
    await flushMicrotasks()
    assert.equal(
        instance.contentStyle.height,
        '96px',
        '过期的结束回调不应把正在进行的展开动画直接跳到 auto'
    )

    parkedSleeps[1]() // 放行展开动画的结束回调
    await flushMicrotasks()
    assert.equal(instance.contentStyle.height, 'auto', '最后一次动画结束后才交还高度给内容')
    parkedSleeps = null
    console.log('✓ 快速连点时只有最后一次动画的结束回调生效')
}

console.log('\n全部检查通过：u-collapse-item 展开后高度跟随内容（issue #811）')
