/**
 * uni API shims
 *
 * 部分小程序平台（如支付宝）不支持某些 uni API，直接调用会抛出 TypeError。
 * 本模块在库初始化时检测缺失的 API 并自动补齐空实现，防止运行时报错。
 *
 * 扩展方式：在 needShims 数组中追加 { name, fallback } 即可。
 */

const needShims = [
    {
        name: 'onWindowResize',
        fallback: function (_callback) { /* no-op */ }
    },
    {
        name: 'offWindowResize',
        fallback: function (_callback) { /* no-op */ }
    }
]

export function applyUniApiShims() {
    if (typeof uni === 'undefined') return

    for (const { name, fallback } of needShims) {
        if (typeof uni[name] !== 'function') {
            uni[name] = fallback
        }
    }
}
