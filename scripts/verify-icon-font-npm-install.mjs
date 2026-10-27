import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// issue #1069：npm 安装（node_modules）时 App 本地字体插件匹配不到，
// 且 App-Vue 预先 convertLocalFileSystemURL 导致云打包正式 APK 图标不显示。
// 本脚本锁定两处根因的修复：
//  1) 构建插件的 transform 同时覆盖 node_modules 与 uni_modules 安装方式；
//  2) App-Vue 的 loadFontFace 直接使用原始 _www/... 路径，交给 view 层转换一次。

import UpVite from '../src/uni_modules/uview-plus/libs/vite/index.js'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path) => readFileSync(resolve(repoRoot, path), 'utf8')

const uIconVue = read('src/uni_modules/uview-plus/components/u-icon/u-icon.vue')
const util = read('src/uni_modules/uview-plus/components/u-icon/util.js')
const packageJson = JSON.parse(read('package.json'))

assert(packageJson.scripts['verify:icon-font-npm-install'] ===
  'node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/verify-icon-font-npm-install.mjs',
  'package.json should expose verify:icon-font-npm-install')

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const defaultAppRemoteFontFace = /#ifdef\s+APP\s+\|\|\s+MP-QQ\s+\|\|\s+MP-TOUTIAO\s+\|\|\s+MP-BAIDU\s+\|\|\s+MP-KUAISHOU\s+\|\|\s+MP-XHS[\s\S]*?@font-face[\s\S]*?at\.alicdn\.com[\s\S]*?#endif/
const compiledAppRemoteFontFace = /@font-face\s*\{[\s\S]*?font-family:\s*['"]?uicon-iconfont['"]?[\s\S]*?at\.alicdn\.com\/t\/font_2225171[\s\S]*?\}/

// 根因2：App-Vue 必须用原始 _www/... 路径（不再提前 convertLocalFileSystemURL）。
if (!/useAppStaticIconFont\s*\?\s*appIconFontUrl\s*:\s*iconUrl/.test(util)) {
  throw new Error('util.js should pass the raw _www app font URL to registerAppVueFontFace for App-Vue (issue #1069)')
}

const withTempUniProject = async (platform, callback) => {
  const rootPath = mkdtempSync(resolve(tmpdir(), 'uview-plus-npm-font-'))
  const oldUniPlatform = process.env.UNI_PLATFORM
  const oldUniInputDir = process.env.UNI_INPUT_DIR
  try {
    writeFileSync(resolve(rootPath, 'pages.json'), '{"pages":[]}', 'utf8')
    process.env.UNI_PLATFORM = platform
    process.env.UNI_INPUT_DIR = rootPath
    await callback(rootPath)
  } finally {
    if (oldUniPlatform === undefined) delete process.env.UNI_PLATFORM
    else process.env.UNI_PLATFORM = oldUniPlatform
    if (oldUniInputDir === undefined) delete process.env.UNI_INPUT_DIR
    else process.env.UNI_INPUT_DIR = oldUniInputDir
    rmSync(rootPath, { recursive: true, force: true })
  }
}

await withTempUniProject('app', async (rootPath) => {
  const plugin = UpVite()
  plugin.buildStart()

  // 根因1：npm 安装时包位于 node_modules/uview-plus/...，transform 也必须剥离 App 远程 @font-face
  const npmUIconVuePath = resolve(rootPath, 'node_modules/uview-plus/components/u-icon/u-icon.vue')
  const transformed = await plugin.transform(uIconVue, npmUIconVuePath)
  if (!transformed || defaultAppRemoteFontFace.test(transformed.code)) {
    throw new Error('UpVite should strip the App remote @font-face for npm-installed u-icon.vue (node_modules path)')
  }

  const npmUtilPath = resolve(rootPath, 'node_modules/uview-plus/components/u-icon/util.js')
  const transformedUtil = await plugin.transform(util, npmUtilPath)
  if (!/const\s+useAppStaticIconFont\s*=\s*true/.test(transformedUtil?.code || util)) {
    throw new Error('UpVite should keep util.js on static App icon fonts for npm installs')
  }

  // 模拟 uni:pre 已展开 App 条件后的 style block（npm 路径）
  const appCompiledUIconVue = uIconVue
    .replace(/\/\*\s*#ifdef\s+APP\s+\|\|\s+MP-QQ\s+\|\|\s+MP-TOUTIAO\s+\|\|\s+MP-BAIDU\s+\|\|\s+MP-KUAISHOU\s+\|\|\s+MP-XHS\s*\*\/\n?/, '')
    .replace(/\/\*\s*#endif\s*\*\//, '')
  const compiledStyleId = `${npmUIconVuePath}?vue&type=style&index=0&lang.scss&scoped=true`
  const compiledStyle = appCompiledUIconVue.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] || ''
  const transformedCompiledStyle = await plugin.transform(compiledStyle, compiledStyleId)
  if (!transformedCompiledStyle || compiledAppRemoteFontFace.test(transformedCompiledStyle.code)) {
    throw new Error('UpVite should strip the App remote @font-face from npm-installed u-icon.vue style blocks')
  }
})

console.log('icon font npm install (issue #1069) checks passed')
