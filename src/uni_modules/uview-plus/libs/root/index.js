import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'

import { createFilter, normalizePath } from 'vite'

import { transformNvuePage, transformPage } from './page.js'
import { rebuildUpApp, registerUpApp } from './root.js'
import { loadPagesJson, normalizePlatformPath, toArray } from './utils.js'

const rootLibPath = normalizePath(dirname(fileURLToPath(import.meta.url)))
const appStaticIconFontRelativePath = 'static/app-plus/uview-plus/upicon.ttf'
const appStaticIconFontFlag = 'const useAppStaticIconFont = false;'
const appStaticIconFontEnabledFlag = 'const useAppStaticIconFont = true;'
const appRemoteIconFontCondition = /\/\*\s*#ifdef\s+APP\s+\|\|\s+(MP-QQ\s+\|\|\s+MP-TOUTIAO\s+\|\|\s+MP-BAIDU\s+\|\|\s+MP-KUAISHOU\s+\|\|\s+MP-XHS)\s*\*\//
const appCompiledRemoteIconFontFace = /[ \t]*(?:\/\/[^\n]*\n[ \t]*)?@font-face\s*\{[^{}]*font-family:\s*['"]?uicon-iconfont['"]?;?[^{}]*at\.alicdn\.com\/t\/font_2225171[^{}]*\}\s*/
const appCompiledRemoteIconFontFaceGlobal = /[ \t]*(?:\/\/[^\n]*\n[ \t]*)?@font-face\s*\{[^{}]*font-family:\s*['"]?uicon-iconfont['"]?;?[^{}]*at\.alicdn\.com\/t\/font_2225171[^{}]*\}\s*/g

export default function UniUpRoot(options = {}) {
  const rootOptions = {
    enabledVirtualHost: false,
    enabledGlobalRef: false,
    rootFileName: 'App.up',
    autoCreateRootFile: true,
    excludePages: [],
    ...options,
  }
  const rootFileName = String(rootOptions.rootFileName || 'App.up').replace(/\.vue$/i, '')

  const detectProjectRoot = () => {
    const cwd = normalizePath(process.env.INIT_CWD || process.cwd())
    const envInputDir = process.env.UNI_INPUT_DIR ? normalizePath(process.env.UNI_INPUT_DIR) : ''
    const cliRootPath = normalizePath(resolve(cwd, 'src'))
    const hbuilderRootPath = cwd

    const isPageRoot = (path) => existsSync(resolve(path, 'pages.json'))

    if (envInputDir && isPageRoot(envInputDir)) {
      const projectType = envInputDir.endsWith('/src') ? 'cli' : 'hbuilder'
      return { rootPath: envInputDir, projectType }
    }

    if (isPageRoot(cliRootPath)) {
      return { rootPath: cliRootPath, projectType: 'cli' }
    }

    if (isPageRoot(hbuilderRootPath)) {
      return { rootPath: hbuilderRootPath, projectType: 'hbuilder' }
    }

    return {
      rootPath: envInputDir || cliRootPath,
      projectType: envInputDir && !envInputDir.endsWith('/src') ? 'hbuilder' : 'cli',
    }
  }

  const projectInfo = detectProjectRoot()
  const rootPath = normalizePath(projectInfo.rootPath)
  const appUpPath = normalizePath(resolve(rootPath, `${rootFileName}.vue`))
  const rootToastHostPath = normalizePath(resolve(rootLibPath, 'root-toast-host.vue'))
  const iconFontSourcePath = normalizePath(resolve(rootLibPath, '../../components/u-icon/upicon.ttf'))
  const appStaticIconFontPath = normalizePath(resolve(rootPath, appStaticIconFontRelativePath))
  const uIconUtilPath = normalizePath(resolve(rootPath, 'uni_modules/uview-plus/components/u-icon/util.js'))
  const uIconVuePath = normalizePath(resolve(rootPath, 'uni_modules/uview-plus/components/u-icon/u-icon.vue'))
  const nvueRootPath = normalizePath(resolve(rootPath, 'uni_modules/uview-plus/libs/root/nvue-root.vue'))
  const themeRuntimePath = normalizePath(resolve(rootPath, 'uni_modules/uview-plus/libs/theme/runtime.js'))
  const pagesPath = normalizePath(resolve(rootPath, 'pages.json'))
  const excludedPaths = toArray(rootOptions.excludePages)
    .filter(Boolean)
    .map(path => normalizePath(resolve(rootPath, path)))

  const mainFiles = [
    normalizePath(resolve(rootPath, 'main.ts')),
    normalizePath(resolve(rootPath, 'main.js')),
  ]

  const getRelativeImportPath = (fromFile, toFile) => {
    let importPath = normalizePath(relative(dirname(fromFile), toFile))
    if (!importPath.startsWith('.')) {
      importPath = `./${importPath}`
    }
    return importPath
  }

  let pagesJson = []
  let pagesJsonMtimeMs = 0
  let hasPlatformPlugin = false

  const ensureRootFile = () => {
    if (!rootOptions.autoCreateRootFile) return
    if (existsSync(appUpPath)) return

    const defaultRootSfc = `<template>
\t<UpRootView />
</template>
`

    mkdirSync(dirname(appUpPath), { recursive: true })
    writeFileSync(appUpPath, defaultRootSfc, 'utf-8')
  }

  const shouldCopyFile = (sourcePath, targetPath) => {
    if (!existsSync(targetPath)) return true
    if (statSync(sourcePath).size !== statSync(targetPath).size) return true
    return !readFileSync(sourcePath).equals(readFileSync(targetPath))
  }

  const ensureAppStaticIconFont = () => {
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

  const transformAppStaticIconFont = (code, cleanId) => {
    if (process.env.UNI_PLATFORM !== 'app') return null
    if (cleanId === uIconUtilPath && code.includes(appStaticIconFontFlag)) {
      return code.replace(appStaticIconFontFlag, appStaticIconFontEnabledFlag)
    }
    if (cleanId === uIconVuePath && appRemoteIconFontCondition.test(code)) {
      return code.replace(appRemoteIconFontCondition, '/* #ifdef $1 */')
    }
    if (cleanId === uIconVuePath && appCompiledRemoteIconFontFace.test(code)) {
      return removeAppCompiledRemoteIconFontFace(code)
    }
    return null
  }

  const removeAppRemoteIconFontFaceFromCssAssets = (bundle) => {
    if (process.env.UNI_PLATFORM !== 'app') return
    Object.values(bundle).forEach((asset) => {
      if (asset.type !== 'asset') return
      if (!asset.fileName.endsWith('.css')) return
      if (typeof asset.source !== 'string') return
      if (!appCompiledRemoteIconFontFace.test(asset.source)) return
      asset.source = removeAppCompiledRemoteIconFontFace(asset.source)
    })
  }

  const refreshPagesJson = () => {
    if (!existsSync(pagesPath)) return
    const mtimeMs = statSync(pagesPath).mtimeMs
    if (mtimeMs === pagesJsonMtimeMs && pagesJson.length) return
    pagesJson = loadPagesJson(pagesPath, rootPath)
    pagesJsonMtimeMs = mtimeMs
  }

  return {
    name: 'vite-plugin-uni-up-root',
    enforce: 'pre',
    configResolved(config) {
      const { plugins } = config
      hasPlatformPlugin = plugins.some(v => v.name === 'vite-plugin-uni-platform')
      if (plugins.some(v => v.name === 'uni:app-nvue')) {
        config.build.rollupOptions = config.build.rollupOptions || {}
        config.build.rollupOptions.treeshake = false
      }
    },
    buildStart() {
      ensureAppStaticIconFont()
      ensureRootFile()
      refreshPagesJson()
    },
    async transform(code, id) {
      let ms = null
      const isSfcBlock = id.includes('?')
      const cleanId = normalizePath(id.split('?')[0])

      const iconFontCode = transformAppStaticIconFont(code, cleanId)
      if (iconFontCode) {
        return {
          code: iconFontCode,
          map: null,
        }
      }

      const filterMain = createFilter(mainFiles)
      if (filterMain(cleanId)) {
        ms = await registerUpApp(code, rootFileName, getRelativeImportPath(cleanId, rootToastHostPath))
      }

      const filterUpRoot = createFilter(appUpPath)
      if (filterUpRoot(cleanId)) {
        ms = await rebuildUpApp(code, rootOptions.enabledVirtualHost)
      }

      refreshPagesJson()
      const pageId = hasPlatformPlugin ? normalizePlatformPath(cleanId) : cleanId
      const filterPage = createFilter(pagesJson, excludedPaths)
      if (!isSfcBlock && filterPage(pageId)) {
        if (cleanId.endsWith('.nvue')) {
          ms = await transformNvuePage(
            code,
            getRelativeImportPath(cleanId, nvueRootPath),
            getRelativeImportPath(cleanId, themeRuntimePath),
            rootOptions.enabledGlobalRef
          )
        } else {
          ms = await transformPage(code, rootOptions.enabledGlobalRef)
        }
      }

      if (ms) {
        return {
          code: ms.toString(),
          map: ms.generateMap({ hires: true }),
        }
      }
      return null
    },
    generateBundle(_, bundle) {
      removeAppRemoteIconFontFaceFromCssAssets(bundle)
    },
  }
}
