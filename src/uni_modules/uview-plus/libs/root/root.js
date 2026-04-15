import { MagicString } from 'vue/compiler-sfc'

import { parseSFC } from './utils.js'

export async function registerUpApp(code, fileName = 'App.up') {
  const ms = new MagicString(code)

  const importCode = `import GlobalUpRoot from "./${fileName}.vue";
import UpRootToastHost from "./uni_modules/uview-plus/libs/root/root-toast-host.vue";`
  const vueUseComponentCode = 'app.component("global-up-root", GlobalUpRoot);\napp.component("ku-root-toast-host", UpRootToastHost);'

  ms.prepend(`${importCode}\n`).replace(
    /(createApp[\s\S]*?)(return\s\{\s*app)/,
    `$1${vueUseComponentCode}\n$2`,
  )

  return ms
}

export async function rebuildUpApp(code, enabledVirtualHost = false) {
  const ms = new MagicString(code)
  const rootTagNameRE = /<(UpRootView|up-root-view)(?:\s*\/>|><\/\1>)/
  ms.replace(rootTagNameRE, '<slot />\n    <ku-root-toast-host />')

  if (enabledVirtualHost) {
    const sfc = await parseSFC(code)
    if (sfc.script) {
      return ms
    }
    const langType = sfc.scriptSetup?.lang
    ms.append(`<script ${langType ? `lang="${langType}"` : ''}>
    export default {
      options: {
        virtualHost: true,
      }
    }\n</script>`)
  }

  return ms
}
