import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

// up-cropper 三个问题：
// 1) iOS 上画布高度减掉了底部安全区，而底部操作栏仍是 50px 死死贴在屏幕最底，
//    两者之间露出一条约 safeAreaInsetsBottom 的页面背景，页面上浮动的按钮/标签会从
//    这条缝里透出来，和裁剪底部按钮重叠；安卓 safeAreaInsets.bottom 为 0，所以看不出来。
//    修法：操作栏高度改为 tabHeight + 安全区，用 padding-bottom 把安全区让出来，与画布严丝合缝。
// 2) quality 属性一直都在，但 5 处 toTempFilePath 都把 fileType 硬编码成 'png'。
//    PNG 是无损格式、没有质量档位，quality 传了也不生效。修法：新增 fileType 属性，
//    只有 jpg 才会按 quality 压缩。
// 3) qlty 用 parseInt 归一化，parseInt(0.5) 是 0，`|| 0.9` 会把所有小数质量悄悄改回 0.9。
//    修法：改用 parseFloat + 夹取到 0-1，number 与数字字符串都认。

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const source = readFileSync(
  resolve(root, 'src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue'),
  'utf8'
)

const scriptMatch = source.match(/<script>([\s\S]*?)<\/script>/)
assert.ok(scriptMatch, 'u-cropper.vue should contain a script block')

// 组件脚本只有一行 import（i18n 的 t）和一个模块级常量，去掉 import 后就能在 vm 里求值，
// 这样可以直接调用 computed / methods，而不是只做文本匹配
const moduleShim = { exports: {} }
vm.runInContext(
  scriptMatch[1]
    .replace(/^[ \t]*import[^\n]*\n/gm, '')
    .replace(/export\s+default\s+/, 'module.exports = '),
  vm.createContext({ module: moduleShim, exports: moduleShim.exports, t: () => '', console })
)
const options = moduleShim.exports
assert.equal(options && options.name, 'u-cropper', 'script block should export the u-cropper options')
assert.ok(options.computed, 'u-cropper should declare computed')

// vm 里产出的对象原型属于另一个 realm，deepStrictEqual 会判不等，先摊平成普通对象
const plain = value => JSON.parse(JSON.stringify(value))

// —— 1. fileType 属性与归一化 ——
assert.equal(options.props.fileType, 'png', 'fileType prop should default to png，保持既有输出不变')
assert.equal(options.props.quality, '', 'quality prop should stay untouched')
assert.equal(
  (source.match(/fileType: 'png'/g) || []).length,
  1,
  'fileType: \'png\' 只应出现在 prop 默认值上，导出调用不允许再硬编码'
)

const expFileType = options.computed.expFileType
assert.equal(typeof expFileType, 'function', 'expFileType computed should exist')
assert.equal(expFileType.call({ fileType: 'png' }), 'png')
assert.equal(expFileType.call({ fileType: 'jpg' }), 'jpg')
assert.equal(expFileType.call({ fileType: 'JPG' }), 'jpg')
assert.equal(expFileType.call({ fileType: 'jpeg' }), 'jpg')
assert.equal(expFileType.call({ fileType: 'JPEG' }), 'jpg')
assert.equal(expFileType.call({ fileType: 'gif' }), 'png', '不认识的格式回落到 png')
assert.equal(expFileType.call({ fileType: '' }), 'png')
assert.equal(expFileType.call({ fileType: undefined }), 'png')

// —— 2. 5 处导出全部跟随 fileType，chooseImage 也可覆盖 ——
assert.equal(
  (source.match(/fileType: this\.expFileType/g) || []).length,
  5,
  '5 处 toTempFilePath 都应跟随 fileType 属性'
)
assert.match(source, /fileType = params\.fileType,/, 'chooseImage 应支持通过 params 覆盖 fileType')
assert.match(source, /if \(fileType\) this\.fileType = fileType;/, 'chooseImage 应把 params.fileType 写回属性')

// —— 3. quality 归一化 ——
const parseQuality = options.methods.parseQuality
assert.equal(typeof parseQuality, 'function', 'parseQuality method should exist')
assert.equal(parseQuality(0.5), 0.5, '小数质量不应被 parseInt 吞成 0 再回落 0.9')
assert.equal(parseQuality('0.5'), 0.5, '数字字符串也要认')
assert.equal(parseQuality(0.9), 0.9)
assert.equal(parseQuality(0.1), 0.1)
assert.equal(parseQuality(0), 0)
assert.equal(parseQuality(1), 1)
assert.equal(parseQuality(-1), 0, '越界夹到 0')
assert.equal(parseQuality(2), 1, '越界夹到 1')
assert.equal(parseQuality(80), 1, '越界夹到 1，不做百分比猜测')
assert.equal(parseQuality(''), 0.9, '空值回落 0.9')
assert.equal(parseQuality(undefined), 0.9, '缺省回落 0.9')
assert.equal(parseQuality('abc'), 0.9, '无效值回落 0.9')
assert.doesNotMatch(source, /parseInt\([^)]*\) \|\| 0\.9/, '不允许再用 parseInt 归一化质量')

// —— 4. 底部操作栏与画布严丝合缝 ——
assert.match(source, /<view class="oper-wrapper" :style="operStyle">/, 'oper-wrapper 应改用 operStyle 计算样式')
const operStyle = options.computed.operStyle
assert.equal(typeof operStyle, 'function', 'operStyle computed should exist')
assert.deepEqual(
  plain(operStyle.call({ styleDisplay: 'none', safeAreaInsetsBottom: 0 })),
  { display: 'none', height: '50px', paddingBottom: '0px' },
  '无安全区时操作栏保持 50px，与改动前一致'
)
assert.deepEqual(
  plain(operStyle.call({ styleDisplay: 'flex', safeAreaInsetsBottom: 34 })),
  { display: 'flex', height: '84px', paddingBottom: '34px' },
  'iPhone 34px 安全区时操作栏高 84px，按钮仍完整位于安全区上方'
)
assert.deepEqual(
  plain(operStyle.call({ styleDisplay: 'flex', safeAreaInsetsBottom: '34' })),
  { display: 'flex', height: '84px', paddingBottom: '34px' },
  '安全区允许是字符串'
)
assert.deepEqual(
  plain(operStyle.call({ styleDisplay: 'flex', safeAreaInsetsBottom: undefined })),
  { display: 'flex', height: '50px', paddingBottom: '0px' },
  '安全区缺失时不应算出 NaN 把操作栏顶飞'
)

// —— 5. 画布仍要减掉安全区，且 safeAreaInsets 取值加兜底 ——
assert.match(
  source,
  /this\.cvsStyleHeight = this\.windowHeight - tabHeight - this\.safeAreaInsetsBottom - 2/,
  'MP 端画布高度仍需减掉安全区，画布底部与操作栏顶部才能对齐'
)
assert.match(
  source,
  /this\.safeAreaInsetsBottom = \(sysInfo\.safeAreaInsets && sysInfo\.safeAreaInsets\.bottom\) \|\| 0;/,
  'safeAreaInsets 取值需要兜底，避免个别端取不到时算出 NaN'
)
assert.match(source, /\.oper-wrapper \{[\s\S]*?bottom: 0;/, '操作栏仍应固定在屏幕最底')

console.log('cropper export/safe-area assertions passed')
