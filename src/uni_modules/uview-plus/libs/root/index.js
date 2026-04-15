import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs'

import { createFilter, normalizePath } from 'vite'

import { transformPage } from './page.js'
import { rebuildUpApp, registerUpApp } from './root.js'
import { loadPagesJson, normalizePlatformPath, toArray } from './utils.js'

export default function UniUpRoot(options = {}) {
  const rootOptions = {
    enabledVirtualHost: false,
    enabledGlobalRef: false,
    rootFileName: 'App.up',
    autoCreateRootFile: true,
    autoCreateViteConfig: true,
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
  const pagesPath = normalizePath(resolve(rootPath, 'pages.json'))
  const projectBasePath = normalizePath(
    projectInfo.projectType === 'cli' ? resolve(rootPath, '..') : rootPath
  )
  const viteConfigTsPath = normalizePath(resolve(projectBasePath, 'vite.config.ts'))
  const viteConfigJsPath = normalizePath(resolve(projectBasePath, 'vite.config.js'))
  const excludedPaths = toArray(rootOptions.excludePages)
    .filter(Boolean)
    .map(path => normalizePath(resolve(rootPath, path)))

  const mainFiles = [
    normalizePath(resolve(rootPath, 'main.ts')),
    normalizePath(resolve(rootPath, 'main.js')),
  ]

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

  const ensureViteConfigFile = () => {
    if (!rootOptions.autoCreateViteConfig) return
    if (existsSync(viteConfigTsPath) || existsSync(viteConfigJsPath)) return

    const template = `import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import UniUpRoot from "./src/uni_modules/uview-plus/libs/root/index.js";

export default defineConfig({
  plugins: [
    UniUpRoot({
      rootFileName: "${rootFileName}",
    }),
    uni(),
  ],
});
`

    writeFileSync(viteConfigTsPath, template, 'utf-8')
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
    configResolved({ plugins }) {
      hasPlatformPlugin = plugins.some(v => v.name === 'vite-plugin-uni-platform')
    },
    buildStart() {
      ensureViteConfigFile()
      ensureRootFile()
      refreshPagesJson()
    },
    async transform(code, id) {
      let ms = null
      const cleanId = normalizePath(id.split('?')[0])

      const filterMain = createFilter(mainFiles)
      if (filterMain(cleanId)) {
        ms = await registerUpApp(code, rootFileName)
      }

      const filterUpRoot = createFilter(appUpPath)
      if (filterUpRoot(cleanId)) {
        ms = await rebuildUpApp(code, rootOptions.enabledVirtualHost)
      }

      refreshPagesJson()
      const pageId = hasPlatformPlugin ? normalizePlatformPath(cleanId) : cleanId
      const filterPage = createFilter(pagesJson, excludedPaths)
      if (filterPage(pageId)) {
        ms = await transformPage(code, rootOptions.enabledGlobalRef)
      }

      if (ms) {
        return {
          code: ms.toString(),
          map: ms.generateMap({ hires: true }),
        }
      }
      return null
    },
  }
}
