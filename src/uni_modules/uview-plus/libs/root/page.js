import { MagicString } from 'vue/compiler-sfc'

import { findNode, parseSFC } from './utils.js'

export async function transformPage(code, enabledGlobalRef = false) {
  const sfc = await parseSFC(code)
  const ms = new MagicString(code)

  const pageTempStart = sfc.template?.loc.start.offset
  const pageTempEnd = sfc.template?.loc.end.offset

  let pageMetaSource = ''
  const pageMetaNode = findNode(sfc, 'PageMeta')

  if (pageMetaNode) {
    pageMetaSource = pageMetaNode.loc.source
    const metaTempStart = pageMetaNode.loc.start.offset
    const metaTempEnd = pageMetaNode.loc.end.offset
    ms.remove(metaTempStart, metaTempEnd)
  }

  const pageTempAttrs = sfc.template?.attrs
  let pageRootRefSource = enabledGlobalRef ? 'ref="uniUpRoot"' : ''
  if (pageTempAttrs && pageTempAttrs.root) {
    pageRootRefSource = `ref="${pageTempAttrs.root}"`
  }

  if (pageTempStart != null && pageTempEnd != null) {
    ms.appendLeft(pageTempStart, `\n${pageMetaSource}\n<global-up-root ${pageRootRefSource}>`)
    ms.appendRight(pageTempEnd, '\n</global-up-root>\n')
  }

  return ms
}
