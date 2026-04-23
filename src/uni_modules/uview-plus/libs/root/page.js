import { MagicString } from 'vue/compiler-sfc'

import { findNode, parseSFC } from './utils.js'

function getPageRootRefSource(sfc, enabledGlobalRef = false) {
  const pageTempAttrs = sfc.template?.attrs
  if (pageTempAttrs && pageTempAttrs.root) {
    return `ref="${pageTempAttrs.root}"`
  }
  return enabledGlobalRef ? 'ref="uniUpRoot"' : ''
}

function ensureNvueNavigationBar(pageMetaSource) {
  const navigationBarSource = '<navigation-bar :front-color="upThemeNavFrontColor" :background-color="upThemeNavBgColor" />'
  if (!pageMetaSource) return `<page-meta>${navigationBarSource}</page-meta>`
  if (pageMetaSource.indexOf('navigation-bar') > -1 || pageMetaSource.indexOf('NavigationBar') > -1) {
    return pageMetaSource
  }
  return pageMetaSource.replace(/<page-meta([^>]*)>/i, `<page-meta$1>${navigationBarSource}`)
}

function wrapTemplate(ms, sfc, tagName, rootRefSource = '', withNvueNavigationBar = false) {
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

  if (withNvueNavigationBar) {
    pageMetaSource = ensureNvueNavigationBar(pageMetaSource)
  }

  if (pageTempStart != null && pageTempEnd != null) {
    ms.appendLeft(pageTempStart, `\n${pageMetaSource}\n<${tagName} ${rootRefSource}>`)
    ms.appendRight(pageTempEnd, `\n</${tagName}>\n`)
  }
}

export async function transformPage(code, enabledGlobalRef = false) {
  const sfc = await parseSFC(code)
  const ms = new MagicString(code)

  wrapTemplate(ms, sfc, 'global-up-root', getPageRootRefSource(sfc, enabledGlobalRef))

  return ms
}

function ensureOptionsComponent(ms, scriptContent) {
  if (scriptContent.includes('UpNvueRoot')) return

  const componentsMatch = scriptContent.match(/components\s*:\s*\{/)
  if (componentsMatch) {
    ms.appendLeft(componentsMatch.index + componentsMatch[0].length, ' UpNvueRoot,')
    return
  }

  const exportDefaultMatch = scriptContent.match(/export\s+default\s+(?:defineComponent\s*\()?\s*\{/)
  if (exportDefaultMatch) {
    ms.appendLeft(
      exportDefaultMatch.index + exportDefaultMatch[0].length,
      '\n  components: { UpNvueRoot },'
    )
  }
}

function ensureOptionsThemeMixin(ms, scriptContent) {
  if (scriptContent.includes('__upNvueThemeMixin')) return

  const mixinsMatch = scriptContent.match(/mixins\s*:\s*\[/)
  if (mixinsMatch) {
    ms.appendLeft(mixinsMatch.index + mixinsMatch[0].length, ' __upNvueThemeMixin,')
    return
  }

  const exportDefaultMatch = scriptContent.match(/export\s+default\s+(?:defineComponent\s*\()?\s*\{/)
  if (exportDefaultMatch) {
    ms.appendLeft(
      exportDefaultMatch.index + exportDefaultMatch[0].length,
      '\n  mixins: [__upNvueThemeMixin],'
    )
  }
}

function getScriptSetupImports(componentImportPath, runtimeImportPath) {
  return `import UpNvueRoot from '${componentImportPath}'
import { computed as __upComputed, onBeforeUnmount as __upOnBeforeUnmount, onMounted as __upOnMounted, ref as __upRef } from 'vue'
import { onShow as __upOnShow } from '@dcloudio/uni-app'
import {
  applyNativeThemeUI as __upApplyNativeThemeUI,
  applyNativeThemeUIDeferred as __upApplyNativeThemeUIDeferred,
  getThemeCardStyle as __upGetThemeCardStyle,
  getThemeIsDark as __upGetThemeIsDark,
  getThemePageStyle as __upGetThemePageStyle,
  getThemeVar as __upThemeVar,
  syncThemeRuntimeFromStorage as __upSyncThemeRuntimeFromStorage
} from '${runtimeImportPath}'

const __upThemeVersion = __upRef(0)
let __upThemeChangeHandler = null
const __upReadThemeVersion = () => Number((typeof uni !== 'undefined' && uni.$u && uni.$u.theme && uni.$u.theme.version) || 0)
const __upSyncThemeVersion = (payload = {}) => {
  const version = Number(payload.version || __upReadThemeVersion() || 0)
  __upThemeVersion.value = version || Number(__upThemeVersion.value || 0) + 1
}
__upOnMounted(() => {
  __upSyncThemeRuntimeFromStorage()
  __upSyncThemeVersion()
  __upApplyNativeThemeUI()
  if (typeof uni !== 'undefined' && typeof uni.$on === 'function') {
    __upThemeChangeHandler = (payload = {}) => {
      __upSyncThemeRuntimeFromStorage()
      __upSyncThemeVersion(payload)
      __upApplyNativeThemeUI()
    }
    uni.$on('uThemeChange', __upThemeChangeHandler)
  }
})
__upOnShow(() => {
  __upSyncThemeRuntimeFromStorage()
  __upSyncThemeVersion()
  __upApplyNativeThemeUIDeferred()
})
__upOnBeforeUnmount(() => {
  if (typeof uni !== 'undefined' && typeof uni.$off === 'function' && __upThemeChangeHandler) {
    uni.$off('uThemeChange', __upThemeChangeHandler)
    __upThemeChangeHandler = null
  }
})
const upThemeVar = (varName, fallbackColor) => {
  __upThemeVersion.value
  return __upThemeVar(varName, fallbackColor)
}
const upThemeCardStyle = __upComputed(() => {
  __upThemeVersion.value
  return __upGetThemeCardStyle()
})
const upThemePageStyle = __upComputed(() => {
  __upThemeVersion.value
  return __upGetThemePageStyle()
})
const upThemeIsDark = __upComputed(() => {
  __upThemeVersion.value
  return __upGetThemeIsDark()
})
const upThemeNavFrontColor = __upComputed(() => {
  __upThemeVersion.value
  return __upGetThemeIsDark() ? '#ffffff' : '#000000'
})
const upThemeNavBgColor = __upComputed(() => {
  __upThemeVersion.value
  return __upThemeVar('--up-navbar-bg-color', __upGetThemeIsDark() ? '#1c1c1e' : '#ffffff')
})
`
}

function getOptionsImports(componentImportPath, runtimeImportPath) {
  return `import UpNvueRoot from '${componentImportPath}'
import {
  applyNativeThemeUI as __upApplyNativeThemeUI,
  applyNativeThemeUIDeferred as __upApplyNativeThemeUIDeferred,
  getThemeCardStyle as __upGetThemeCardStyle,
  getThemeIsDark as __upGetThemeIsDark,
  getThemePageStyle as __upGetThemePageStyle,
  getThemeVar as __upThemeVar,
  syncThemeRuntimeFromStorage as __upSyncThemeRuntimeFromStorage
} from '${runtimeImportPath}'

const __upNvueThemeMixin = {
  data() {
    return {
      __upNvueThemeVersion: 0,
      __upNvueThemeChangeHandler: null
    }
  },
  created() {
    __upSyncThemeRuntimeFromStorage()
    this.__upSyncNvueThemeVersion()
    __upApplyNativeThemeUI()
    if (typeof uni !== 'undefined' && typeof uni.$on === 'function') {
      this.__upNvueThemeChangeHandler = (payload = {}) => {
        __upSyncThemeRuntimeFromStorage()
        this.__upSyncNvueThemeVersion(payload)
        __upApplyNativeThemeUI()
      }
      uni.$on('uThemeChange', this.__upNvueThemeChangeHandler)
    }
  },
  onShow() {
    __upSyncThemeRuntimeFromStorage()
    this.__upSyncNvueThemeVersion()
    __upApplyNativeThemeUIDeferred()
  },
  beforeUnmount() {
    if (typeof uni !== 'undefined' && typeof uni.$off === 'function' && this.__upNvueThemeChangeHandler) {
      uni.$off('uThemeChange', this.__upNvueThemeChangeHandler)
      this.__upNvueThemeChangeHandler = null
    }
  },
  computed: {
    upThemeCardStyle() {
      this.__upNvueThemeVersion
      return __upGetThemeCardStyle()
    },
    upThemePageStyle() {
      this.__upNvueThemeVersion
      return __upGetThemePageStyle()
    },
    upThemeIsDark() {
      this.__upNvueThemeVersion
      return __upGetThemeIsDark()
    },
    upThemeNavFrontColor() {
      this.__upNvueThemeVersion
      return __upGetThemeIsDark() ? '#ffffff' : '#000000'
    },
    upThemeNavBgColor() {
      this.__upNvueThemeVersion
      return __upThemeVar('--up-navbar-bg-color', __upGetThemeIsDark() ? '#1c1c1e' : '#ffffff')
    }
  },
  methods: {
    __upReadNvueThemeVersion() {
      return Number((typeof uni !== 'undefined' && uni.$u && uni.$u.theme && uni.$u.theme.version) || 0)
    },
    __upSyncNvueThemeVersion(payload = {}) {
      const version = Number(payload.version || this.__upReadNvueThemeVersion() || 0)
      this.__upNvueThemeVersion = version || Number(this.__upNvueThemeVersion || 0) + 1
    },
    upThemeVar(varName, fallbackColor) {
      this.__upNvueThemeVersion
      return __upThemeVar(varName, fallbackColor)
    }
  }
}
`
}

export async function transformNvuePage(
  code,
  componentImportPath,
  runtimeImportPath,
  enabledGlobalRef = false
) {
  const sfc = await parseSFC(code)
  const ms = new MagicString(code)

  wrapTemplate(ms, sfc, 'UpNvueRoot', getPageRootRefSource(sfc, enabledGlobalRef), true)

  if (sfc.scriptSetup) {
    ms.appendLeft(sfc.scriptSetup.loc.start.offset, getScriptSetupImports(componentImportPath, runtimeImportPath))
  } else if (sfc.script) {
    ms.appendLeft(sfc.script.loc.start.offset, getOptionsImports(componentImportPath, runtimeImportPath))
    ensureOptionsComponent(ms, sfc.script.content)
    ensureOptionsThemeMixin(ms, sfc.script.content)
  } else {
    ms.append(
      `\n<script>\n${getOptionsImports(componentImportPath, runtimeImportPath)}export default {\n  components: { UpNvueRoot },\n  mixins: [__upNvueThemeMixin]\n}\n</script>\n`
    )
  }

  return ms
}
