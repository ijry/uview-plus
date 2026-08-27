import { MagicString } from 'vue/compiler-sfc'

import { parseSFC } from './utils.js'

function ensureRootToastHostComponent(ms, scriptContent) {
  const componentsMatch = scriptContent.match(/components\s*:\s*\{([\s\S]*?)\}/)
  if (componentsMatch && /\bUpRootToastHost\b/.test(componentsMatch[1])) return

  if (componentsMatch) {
    // ms.appendLeft(componentsMatch.index + componentsMatch[0].length, ' UpRootToastHost,')
    const openBraceIndex = componentsMatch.index + componentsMatch[0].indexOf('{')
    ms.appendLeft(openBraceIndex + 1, ' UpRootToastHost,')
    return
  }

  const exportDefaultMatch = scriptContent.match(/export\s+default\s+(?:defineComponent\s*\()?\s*\{/)
  if (exportDefaultMatch) {
    ms.appendLeft(
      exportDefaultMatch.index + exportDefaultMatch[0].length,
      '\n  components: { UpRootToastHost },'
    )
  }
}

function getRootToastHostImport(importPath) {
  return `import UpRootToastHost from '${importPath}'\n`
}

export async function registerUpApp(
  code,
  fileName = 'App.up',
  rootToastHostPath = './uni_modules/uview-plus/libs/root/root-toast-host.vue'
) {
  const ms = new MagicString(code)

  const importCode = `import GlobalUpRoot from "./${fileName}.vue";
import UpRootToastHost from "${rootToastHostPath}";`
  const vueUseComponentCode = 'app.component("global-up-root", GlobalUpRoot);\napp.component("ku-root-toast-host", UpRootToastHost);'

  ms.prepend(`${importCode}\n`).replace(
    /(createApp[\s\S]*?)(return\s\{\s*app)/,
    `$1${vueUseComponentCode}\n$2`,
  )

  return ms
}

export async function rebuildUpApp(
  code,
  enabledVirtualHost = false,
  { rootToastHostImportPath = '' } = {}
) {
  const ms = new MagicString(code)
  const rootTagNameRE = /<(UpRootView|up-root-view)(?:\s*\/>|><\/\1>)/
  const hasRootView = rootTagNameRE.test(code)
  if (hasRootView) {
    const rootToastHostTag = rootToastHostImportPath
      ? '<UpRootToastHost />'
      : '<ku-root-toast-host />'
    ms.replace(rootTagNameRE, `<slot />\n    ${rootToastHostTag}`)
  }

  const shouldInjectRootToastHost = hasRootView && rootToastHostImportPath
  const sfc = enabledVirtualHost || shouldInjectRootToastHost
    ? await parseSFC(code)
    : null

  if (shouldInjectRootToastHost) {
    const importCode = getRootToastHostImport(rootToastHostImportPath)

    if (sfc.scriptSetup) {
      if (!/\bimport\s+UpRootToastHost\b/.test(sfc.scriptSetup.content)) {
        ms.appendLeft(sfc.scriptSetup.loc.start.offset, importCode)
      }
    } else if (sfc.script) {
      if (!/\bimport\s+UpRootToastHost\b/.test(sfc.script.content)) {
        ms.appendLeft(sfc.script.loc.start.offset, importCode)
      }
      ensureRootToastHostComponent(ms, sfc.script.content)
    }
  }

  if (enabledVirtualHost) {
    if (sfc.script) {
      return ms
    }
    const langType = sfc.scriptSetup?.lang
    if (!sfc.scriptSetup && shouldInjectRootToastHost) {
      ms.append(`<script ${langType ? `lang="${langType}"` : ''}>
    ${getRootToastHostImport(rootToastHostImportPath)}export default {
      components: { UpRootToastHost },
      options: {
        virtualHost: true,
      }
    }
</script>`)
      return ms
    }
    ms.append(`<script ${langType ? `lang="${langType}"` : ''}>
    export default {
      options: {
        virtualHost: true,
      }
    }\n</script>`)
  }

  if (!sfc?.script && !sfc?.scriptSetup && shouldInjectRootToastHost) {
    ms.append(`<script>
    ${getRootToastHostImport(rootToastHostImportPath)}export default {
      components: { UpRootToastHost },
    }
</script>`)
  }

  return ms
}
