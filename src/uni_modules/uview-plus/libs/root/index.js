import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs'

import { createFilter, normalizePath } from 'vite'

import { transformNvuePage, transformPage } from './page.js'
import { rebuildUpApp, registerUpApp } from './root.js'
import { loadPagesJson, normalizePlatformPath, toArray } from './utils.js'
import { createAppIconFontFeature } from '../vite/app-icon-font.js'
import { detectProjectRoot } from '../vite/utils.js'

const rootLibPath = normalizePath(dirname(fileURLToPath(import.meta.url)))

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

  const projectInfo = detectProjectRoot()
  const rootPath = normalizePath(projectInfo.rootPath)
  // App 本地图标字体与 Root 组件无关，这里复用 UniUp 的同一个 feature，保持老项目行为不变
  const appIconFont = createAppIconFontFeature({ enabled: rootOptions.appStaticIconFont !== false })
  const appUpPath = normalizePath(resolve(rootPath, `${rootFileName}.vue`))
  const rootToastHostPath = normalizePath(resolve(rootLibPath, 'root-toast-host.vue'))
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
      appIconFont.ensure()
      ensureRootFile()
      refreshPagesJson()
    },
    async transform(code, id) {
      let ms = null
      const isSfcBlock = id.includes('?')
      const cleanId = normalizePath(id.split('?')[0])

      const iconFontCode = appIconFont.transform(code, cleanId)
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
        ms = await rebuildUpApp(code, rootOptions.enabledVirtualHost, {
          rootToastHostImportPath: getRelativeImportPath(cleanId, rootToastHostPath)
        })
      }

      refreshPagesJson()
      const pageId = hasPlatformPlugin ? normalizePlatformPath(cleanId) : cleanId
      const filterPage = createFilter(pagesJson, excludedPaths)
      if (!isSfcBlock && filterPage(pageId)) {
        if (cleanId.endsWith('.nvue')) {
          ms = await transformNvuePage(
            code,
            getRelativeImportPath(cleanId, appUpPath),
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
      appIconFont.generateBundle(bundle)
    },
  }
}
