import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'

import { normalizePath } from 'vite'

import { detectProjectRoot } from './utils.js'

const rootLibPath = normalizePath(dirname(fileURLToPath(import.meta.url)))
export const appStaticIconFontRelativePath = 'static/app-plus/uview-plus/upicon.ttf'
// 源码默认 App 端优先本地字体，只有在显式关闭本地字体时才切回 config.iconUrl
const appStaticIconFontFlag = 'const useAppStaticIconFont = true;'
const appStaticIconFontDisabledFlag = 'const useAppStaticIconFont = false;'
const appRemoteIconFontCondition = /\/\*\s*#ifdef\s+APP\s+\|\|\s+(MP-QQ\s+\|\|\s+MP-TOUTIAO\s+\|\|\s+MP-BAIDU\s+\|\|\s+MP-KUAISHOU\s+\|\|\s+MP-XHS)\s*\*\//
const appCompiledRemoteIconFontFace = /[ \t]*(?:\/\/[^\n]*\n[ \t]*)?@font-face\s*\{[^{}]*font-family:\s*['"]?uicon-iconfont['"]?;?[^{}]*at\.alicdn\.com\/t\/font_2225171[^{}]*\}\s*/
const appCompiledRemoteIconFontFaceGlobal = /[ \t]*(?:\/\/[^\n]*\n[ \t]*)?@font-face\s*\{[^{}]*font-family:\s*['"]?uicon-iconfont['"]?;?[^{}]*at\.alicdn\.com\/t\/font_2225171[^{}]*\}\s*/g

/**
 * App 本地图标字体能力。
 *
 * 与 Root 组件无关：不使用 UpRoot 的项目也可以单独引入本插件，
 * 让 App / App-nvue 使用随包分发的 static 字体，而不是远程 CDN 字体。
 */
export function createAppIconFontPlugin(options = {}) {
  const enabled = options.enabled !== false
  const projectInfo = detectProjectRoot()
  const rootPath = normalizePath(projectInfo.rootPath)
  const iconFontSourcePath = normalizePath(resolve(rootLibPath, '../../components/u-icon/upicon.ttf'))
  const appStaticIconFontPath = normalizePath(resolve(rootPath, appStaticIconFontRelativePath))
  const uIconUtilPath = normalizePath(resolve(rootPath, 'uni_modules/uview-plus/components/u-icon/util.js'))
  const uIconVuePath = normalizePath(resolve(rootPath, 'uni_modules/uview-plus/components/u-icon/u-icon.vue'))

  const shouldCopyFile = (sourcePath, targetPath) => {
    if (!existsSync(targetPath)) return true
    if (statSync(sourcePath).size !== statSync(targetPath).size) return true
    return !readFileSync(sourcePath).equals(readFileSync(targetPath))
  }

  const ensureAppStaticIconFont = () => {
    if (!enabled) return
    if (process.env.UNI_PLATFORM !== 'app') return
    if (!existsSync(iconFontSourcePath)) {
      throw new Error(`uview-plus built-in icon font is missing: ${iconFontSourcePath}`)
    }

    mkdirSync(dirname(appStaticIconFontPath), { recursive: true })
    if (shouldCopyFile(iconFontSourcePath, appStaticIconFontPath)) {
      copyFileSync(iconFontSourcePath, appStaticIconFontPath)
    }
  }

  const removeAppCompiledRemoteIconFontFace = (code) => code.replace(appCompiledRemoteIconFontFaceGlobal, '')

  const transformCode = (code, cleanId) => {
    if (process.env.UNI_PLATFORM !== 'app') return null
    if (!enabled) {
      if (cleanId === uIconUtilPath && code.includes(appStaticIconFontFlag)) {
        return code.replace(appStaticIconFontFlag, appStaticIconFontDisabledFlag)
      }
      return null
    }
    if (cleanId === uIconVuePath && appRemoteIconFontCondition.test(code)) {
      return code.replace(appRemoteIconFontCondition, '/* #ifdef $1 */')
    }
    if (cleanId === uIconVuePath && appCompiledRemoteIconFontFace.test(code)) {
      return removeAppCompiledRemoteIconFontFace(code)
    }
    return null
  }

  const onGenerateBundle = (bundle) => {
    if (!enabled) return
    if (process.env.UNI_PLATFORM !== 'app') return
    Object.values(bundle).forEach((asset) => {
      if (asset.type !== 'asset') return
      if (!asset.fileName.endsWith('.css')) return
      if (typeof asset.source !== 'string') return
      if (!appCompiledRemoteIconFontFace.test(asset.source)) return
      asset.source = removeAppCompiledRemoteIconFontFace(asset.source)
    })
  }

  return {
    enabled,
    rootPath,
    appStaticIconFontPath,
    ensureAppStaticIconFont,
    transformCode,
    onGenerateBundle,
  }
}

/**
 * 独立的 App 本地图标字体 Vite 插件，供不使用 Root 组件的项目使用。
 *
 * 用法：import UniUpAppIconFont from 'uview-plus/libs/root/app-icon-font.js'
 *      plugins: [UniUpAppIconFont()]
 */
export default function UniUpAppIconFont(options = {}) {
  const iconFont = createAppIconFontPlugin(options)

  return {
    name: 'vite-plugin-uni-up-app-icon-font',
    enforce: 'pre',
    buildStart() {
      iconFont.ensureAppStaticIconFont()
    },
    transform(code, id) {
      const transformed = iconFont.transformCode(code, normalizePath(id.split('?')[0]))
      if (transformed) {
        return {
          code: transformed,
          map: null,
        }
      }
      return null
    },
    generateBundle(_, bundle) {
      iconFont.onGenerateBundle(bundle)
    },
  }
}
