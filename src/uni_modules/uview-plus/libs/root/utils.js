import { existsSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import process from 'node:process'

import { parse as VueParser } from 'vue/compiler-sfc'
import { normalizePath } from 'vite'

function stripJsonComments(jsonText) {
  return jsonText
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:\\])\/\/.*$/gm, '$1')
}

function parseJsonc(jsonText) {
  const withoutComments = stripJsonComments(jsonText)
  const withoutTrailingComma = withoutComments.replace(/,\s*([}\]])/g, '$1')
  return JSON.parse(withoutTrailingComma)
}

export async function parseSFC(code) {
  try {
    return VueParser(code, { pad: 'space' }).descriptor
  } catch {
    throw new Error('[@up-root] Vue version must support compiler-sfc parser.')
  }
}

const PAGE_FILE_EXTS = ['.vue', '.nvue', '.uvue']

export function formatPagePath(root, path) {
  const joinedPath = join(root, path)
  const pathExt = extname(joinedPath)

  if (pathExt) {
    return normalizePath(joinedPath)
  }

  const pageFilePath = PAGE_FILE_EXTS
    .map(fileExt => `${joinedPath}${fileExt}`)
    .find(filePath => existsSync(filePath))

  return normalizePath(pageFilePath || `${joinedPath}.vue`)
}

export function loadPagesJson(path, rootPath) {
  const pagesJsonRaw = readFileSync(path, 'utf-8')
  const parsed = parseJsonc(pagesJsonRaw) || {}
  const pages = parsed.pages || []
  const subPackages = parsed.subPackages || []

  return [
    ...pages.map((page) => formatPagePath(rootPath, page.path)),
    ...subPackages
      .map(({ pages: subPages = [], root = '' }) => {
        return subPages.map((page) => formatPagePath(join(rootPath, root), page.path))
      })
      .flat(),
  ]
}

export function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}

export function toPascalCase(str) {
  return str
    .replace(/(^\w|-+\w)/g, (match) => match.toUpperCase().replace(/-/g, ''))
}

export function findNode(sfc, rawTagName) {
  const templateSource = sfc.template?.content
  if (!templateSource) return

  let tagName = ''
  if (templateSource.includes(`<${toKebabCase(rawTagName)}`)) {
    tagName = toKebabCase(rawTagName)
  } else if (templateSource.includes(`<${toPascalCase(rawTagName)}`)) {
    tagName = toPascalCase(rawTagName)
  }
  if (!tagName) return

  const nodeAst = sfc.template?.ast
  if (!nodeAst) return

  const traverse = (nodes) => {
    for (const node of nodes) {
      if (node.type === 1) {
        if (node.tag === tagName) return node
        if (node.children?.length) {
          const found = traverse(node.children)
          if (found) return found
        }
      }
    }
  }

  return traverse(nodeAst.children)
}

const platform = process.env.UNI_PLATFORM

export function normalizePlatformPath(id) {
  const idExt = extname(id)
  if (idExt !== '.vue') return id
  if (!id.includes(`.${platform}.`)) return id
  return id.replace(`.${platform}.`, '.')
}

export function toArray(value) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}
