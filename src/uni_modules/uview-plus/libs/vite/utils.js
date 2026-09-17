import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

import { normalizePath } from 'vite'

/**
 * 识别宿主项目根目录，同时兼容 CLI 项目与 HBuilderX 项目。
 */
export function detectProjectRoot() {
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

export const isAppPlatform = () => process.env.UNI_PLATFORM === 'app'

export const toCleanId = (id) => normalizePath(id.split('?')[0])
