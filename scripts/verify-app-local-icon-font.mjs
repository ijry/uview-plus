import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import UniUpRoot from '../src/uni_modules/uview-plus/libs/root/index.js'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path) => readFileSync(resolve(repoRoot, path), 'utf8')
const appStaticIconFontPath = 'static/app-plus/uview-plus/upicon.ttf'
const appRuntimeIconFontUrl = '_www/static/app-plus/uview-plus/upicon.ttf'
const appAndMiniProgramFontFaceCondition = /#ifdef\s+APP\s+\|\|\s+MP-QQ\s+\|\|\s+MP-TOUTIAO\s+\|\|\s+MP-BAIDU\s+\|\|\s+MP-KUAISHOU\s+\|\|\s+MP-XHS/
const miniProgramFontFaceCondition = /#ifdef\s+MP-QQ\s+\|\|\s+MP-TOUTIAO\s+\|\|\s+MP-BAIDU\s+\|\|\s+MP-KUAISHOU\s+\|\|\s+MP-XHS/

const uIconVue = read('src/uni_modules/uview-plus/components/u-icon/u-icon.vue')
const util = read('src/uni_modules/uview-plus/components/u-icon/util.js')
const fontPath = resolve(repoRoot, 'src/uni_modules/uview-plus/components/u-icon/upicon.ttf')

if (!existsSync(fontPath)) {
  throw new Error('built-in icon font asset upicon.ttf is missing')
}

if (statSync(fontPath).size <= 0) {
  throw new Error('built-in icon font asset upicon.ttf is empty')
}

const defaultAppRemoteFontFace = /#ifdef\s+APP\s+\|\|\s+MP-QQ\s+\|\|\s+MP-TOUTIAO\s+\|\|\s+MP-BAIDU\s+\|\|\s+MP-KUAISHOU\s+\|\|\s+MP-XHS[\s\S]*?@font-face[\s\S]*?at\.alicdn\.com[\s\S]*?#endif/
const compiledAppRemoteFontFace = /@font-face\s*\{[\s\S]*?font-family:\s*['"]?uicon-iconfont['"]?[\s\S]*?at\.alicdn\.com\/t\/font_2225171[\s\S]*?\}/
if (!defaultAppRemoteFontFace.test(uIconVue)) {
  throw new Error('u-icon.vue should keep the App remote @font-face block for projects that do not enable UniUpRoot')
}

if (!appAndMiniProgramFontFaceCondition.test(uIconVue)) {
  throw new Error('u-icon.vue should keep App plus mini-program @font-face compatibility by default')
}

const withTempUniProject = async (platform, callback) => {
  const rootPath = mkdtempSync(resolve(tmpdir(), 'uview-plus-app-font-'))
  const oldUniPlatform = process.env.UNI_PLATFORM
  const oldUniInputDir = process.env.UNI_INPUT_DIR

  try {
    writeFileSync(resolve(rootPath, 'pages.json'), '{"pages":[]}', 'utf8')
    process.env.UNI_PLATFORM = platform
    process.env.UNI_INPUT_DIR = rootPath
    await callback(rootPath)
  } finally {
    if (oldUniPlatform === undefined) {
      delete process.env.UNI_PLATFORM
    } else {
      process.env.UNI_PLATFORM = oldUniPlatform
    }

    if (oldUniInputDir === undefined) {
      delete process.env.UNI_INPUT_DIR
    } else {
      process.env.UNI_INPUT_DIR = oldUniInputDir
    }

    rmSync(rootPath, { recursive: true, force: true })
  }
}

if (!/const\s+appVueLoadedPages\s*=\s*new\s+WeakSet\(\)/.test(util)) {
  throw new Error('util.js should track loaded icon fonts per App Vue page')
}

if (!/const\s+appVueLoadingPages\s*=\s*new\s+WeakSet\(\)/.test(util)) {
  throw new Error('util.js should deduplicate in-flight icon font loads per App Vue page')
}

if (!/const\s+getCurrentAppVuePage\s*=\s*\(\)\s*=>[\s\S]*getCurrentPages\(\)/.test(util)) {
  throw new Error('util.js should resolve the active App Vue page before loading its font')
}

if (!/const\s+isLoaded\s*=\s*\(\)\s*=>[\s\S]*appVueLoadedPages\.has\(/.test(util)) {
  throw new Error('util.js should expose page-aware App Vue font loaded state')
}

if (!/success\(\)\s*{[\s\S]*appVueLoadedPages\.add\(/.test(util)) {
  throw new Error('util.js should only mark an App Vue page loaded after loadFontFace succeeds')
}

if (!/fail\(\)\s*{[\s\S]*appVueLoadingPages\.delete\(/.test(util)) {
  throw new Error('util.js should allow an App Vue page to retry after loadFontFace fails')
}

if (!/beforeCreate\(\)\s*{[\s\S]*#ifndef APP-VUE[\s\S]*fontUtil\.isLoaded\(\)/.test(uIconVue)) {
  throw new Error('u-icon.vue should avoid page font registration before App Vue is mounted')
}

if (!/mounted\(\)\s*{[\s\S]*#ifdef APP-VUE[\s\S]*fontUtil\.isLoaded\(\)[\s\S]*fontUtil\.loadFont\(\)/.test(uIconVue)) {
  throw new Error('u-icon.vue should register the font after each App Vue page mounts')
}

if (!/params\.loaded\s*=\s*true;[\s\S]*if\s*\(config\.loadFontOnce\)/.test(util)) {
  throw new Error('util.js should preserve one-time font loading for App nvue and non-App platforms')
}

if (!/return config\.iconUrl/.test(util)) {
  throw new Error('util.js should keep config.iconUrl for non-App platforms')
}

if (!/const\s+useAppStaticIconFont\s*=\s*false/.test(util)) {
  throw new Error('util.js should default App built-in font loading to config.iconUrl for upgrade compatibility')
}

if (!/if\s*\(\s*!useAppStaticIconFont\s*\)\s*{\s*return config\.iconUrl;?\s*}/.test(util)) {
  throw new Error('util.js should use config.iconUrl on App until UniUpRoot enables static icon fonts')
}

if (/\?url/.test(util)) {
  throw new Error('util.js should not rely on emitted assets URLs for the App built-in font')
}

if (!util.includes(appRuntimeIconFontUrl)) {
  throw new Error(`util.js should load the App built-in font from ${appRuntimeIconFontUrl}`)
}

if (!/plus\.io\.convertLocalFileSystemURL/.test(util)) {
  throw new Error('util.js should convert the App built-in font URL to a platform absolute path')
}

await withTempUniProject('app', async (rootPath) => {
  const plugin = UniUpRoot({ rootFileName: 'App.up', autoCreateRootFile: false })
  plugin.buildStart()

  const copiedFontPath = resolve(rootPath, appStaticIconFontPath)
  if (!existsSync(copiedFontPath)) {
    throw new Error(`UniUpRoot should copy the App built-in font to ${appStaticIconFontPath}`)
  }

  if (readFileSync(copiedFontPath).compare(readFileSync(fontPath)) !== 0) {
    throw new Error('UniUpRoot should copy the App built-in font without changing its contents')
  }

  const utilPath = resolve(rootPath, 'uni_modules/uview-plus/components/u-icon/util.js')
  const transformedUtil = await plugin.transform(util, utilPath)
  if (!transformedUtil || !/const\s+useAppStaticIconFont\s*=\s*true/.test(transformedUtil.code)) {
    throw new Error('UniUpRoot should switch util.js to static App icon fonts')
  }

  const uIconVuePath = resolve(rootPath, 'uni_modules/uview-plus/components/u-icon/u-icon.vue')
  const transformedUIconVue = await plugin.transform(uIconVue, uIconVuePath)
  if (!transformedUIconVue || defaultAppRemoteFontFace.test(transformedUIconVue.code)) {
    throw new Error('UniUpRoot should remove the App remote @font-face block from u-icon.vue')
  }

  if (!miniProgramFontFaceCondition.test(transformedUIconVue.code)) {
    throw new Error('UniUpRoot should keep the mini-program @font-face condition in u-icon.vue')
  }

  const appCompiledUIconVue = uIconVue
    .replace(/\/\*\s*#ifdef\s+APP\s+\|\|\s+MP-QQ\s+\|\|\s+MP-TOUTIAO\s+\|\|\s+MP-BAIDU\s+\|\|\s+MP-KUAISHOU\s+\|\|\s+MP-XHS\s*\*\/\n?/, '')
    .replace(/\/\*\s*#endif\s*\*\//, '')
  const transformedCompiledUIconVue = await plugin.transform(appCompiledUIconVue, uIconVuePath)
  if (!transformedCompiledUIconVue || compiledAppRemoteFontFace.test(transformedCompiledUIconVue.code)) {
    throw new Error('UniUpRoot should remove the App remote @font-face after uni:pre condition compilation')
  }

  const compiledStyleId = `${uIconVuePath}?vue&type=style&index=0&lang.scss&scoped=true`
  const compiledStyle = appCompiledUIconVue.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] || ''
  const transformedCompiledStyle = await plugin.transform(compiledStyle, compiledStyleId)
  if (!transformedCompiledStyle || compiledAppRemoteFontFace.test(transformedCompiledStyle.code)) {
    throw new Error('UniUpRoot should remove the App remote @font-face from u-icon.vue style blocks')
  }

  const bundle = {
    'app.css': {
      type: 'asset',
      fileName: 'app.css',
      source: `body{margin:0}${compiledStyle}`
    },
    'app-service.js': {
      type: 'chunk',
      fileName: 'app-service.js',
      code: `const url = "https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf";`
    }
  }
  plugin.generateBundle?.({}, bundle)
  if (compiledAppRemoteFontFace.test(String(bundle['app.css'].source))) {
    throw new Error('UniUpRoot should remove the App remote @font-face from generated CSS assets')
  }
  if (!String(bundle['app-service.js'].code).includes('font_2225171')) {
    throw new Error('UniUpRoot should only strip CSS @font-face assets')
  }
})

await withTempUniProject('h5', async (rootPath) => {
  UniUpRoot({ rootFileName: 'App.up', autoCreateRootFile: false }).buildStart()
  const copiedFontPath = resolve(rootPath, appStaticIconFontPath)
  if (existsSync(copiedFontPath)) {
    throw new Error(`UniUpRoot should not copy the App built-in font while UNI_PLATFORM is h5`)
  }
})

console.log('app local icon font checks passed')
