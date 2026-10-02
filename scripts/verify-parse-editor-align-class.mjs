import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// issue #292：uni-app 的 editor 组件内核是 quill，quill 把 align 注册成
// Attributor.Class('align', 'ql-align')，因此富文本里对齐只体现为 class
// （ql-align-center / ql-align-right / ql-align-justify，左对齐是默认值不出 class），
// 而 quill 的那份样式表只随 editor 组件加载、rich-text 也不认 class，
// 所以 u-parse 必须自己把这些 class 翻译成行内 text-align。
// 修复前只翻译了 align-center，于是"居中生效、靠右不生效"。

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const read = filePath => readFileSync(resolve(repoRoot, filePath), 'utf8')

const parserPath = resolve(repoRoot, 'src/uni_modules/uview-plus/components/u-parse/parser.js')
assert.ok(existsSync(parserPath), 'u-parse parser.js should exist')
const parserSource = read('src/uni_modules/uview-plus/components/u-parse/parser.js')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:parse-editor-align-class'],
    'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-parse-editor-align-class.mjs',
    'package.json should expose verify:parse-editor-align-class'
)

const { initPreContext, preJs, preNVueJs } = require(
    resolve(repoRoot, 'node_modules/@dcloudio/uni-cli-shared/dist/preprocess/index.js')
)

globalThis.uni = {
    canIUse: () => false,
    getSystemInfoSync: () => ({ windowWidth: 375, system: 'Android 13' }),
    setNavigationBarTitle() {}
}

// 条件编译后再执行，保证跑的是各端真正拿到的那份代码
function loadParser(platform) {
    initPreContext(platform)
    const source = preJs(parserSource, parserPath).replace(/export default Parser/, 'return Parser')
    return new Function(source)()
}

function parse(Parser, html) {
    return new Parser({ nodes: [], imgList: [] }).parse(html)
}

const textAlignOf = node => ((node.attrs.style || '').match(/(?:^|;)\s*text-align:\s*([\w-]+)/) || [])[1]

const CASES = [
    // [html, 期望的 text-align, 说明]
    ['<p>plain</p>', undefined, '没有 class 时不应凭空加 text-align'],
    ['<p class="ql-align-center">c</p>', 'center', 'ql-align-center 应翻译成居中'],
    ['<p class="ql-align-right">r</p>', 'right', 'ql-align-right 应翻译成靠右（#292）'],
    ['<p class="ql-align-justify">j</p>', 'justify', 'ql-align-justify 应翻译成两端对齐'],
    ['<p class="align-left">l</p>', 'left', '显式的 align-left 也应翻译，避免继承父级对齐'],
    ['<p class="ql-align-right other">r</p>', 'right', '对齐 class 与其他 class 并存时仍应识别'],
    ['<div class="ql-align-right"><span>r</span></div>', 'right', '非 p 标签同样适用'],
    // 行内样式仍然应该压过 class：编辑器两者都给时以行内样式为准
    ['<p class="ql-align-right" style="text-align:center">r</p>', 'center', '行内 text-align 应压过 class'],
    // 负例：与对齐无关的编辑器 class 不能被误判
    ['<p class="ql-indent-1">i</p>', undefined, 'ql-indent-1 不是对齐 class'],
    ['<p class="ql-syntax">s</p>', undefined, '无关 class 不应产生 text-align']
]

for (const platform of ['h5', 'mp-weixin', 'app']) {
    const Parser = loadParser(platform)
    for (const [html, expected, message] of CASES) {
        const [node] = parse(Parser, html)
        assert.equal(textAlignOf(node), expected, `[${platform}] ${message} —— ${html}`)
    }
}

// 这段翻译写在条件编译之外，nvue 也必须留着，否则 nvue 上只有居中生效
initPreContext('app')
assert.match(
    preNVueJs(parserSource, parserPath),
    /\['left', 'center', 'right', 'justify'\][\s\S]{0,200}?styleObj\['text-align'\]/,
    'nvue output should keep the editor align-class mapping'
)

console.log('verify:parse-editor-align-class OK')
