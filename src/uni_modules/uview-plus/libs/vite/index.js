import { createAppIconFontFeature } from './app-icon-font.js'

/**
 * uview-plus 通用 Vite 插件（统一入口）。
 *
 * 设计约定：
 * - 用户只需要在 vite.config 里注册一次 `UpVite()`，之后组件库新增任何构建期能力
 *   都在这里追加 feature，用户不需要改自己的配置。
 * - 每个 feature 是一个对象，按需实现以下钩子（都可选）：
 *     { name, ensure(), transform(code, id), generateBundle(bundle) }
 *   `ensure()` 对应 buildStart，`transform` 返回改写后的源码字符串或 null。
 *
 * 用法：
 *   import UpVite from 'uview-plus/libs/vite/index.js'
 *   export default defineConfig({ plugins: [UpVite(), uni()] })
 */
export function createUpViteFeatures(options = {}) {
  return [
    // App 端本地图标字体：把内置 upicon.ttf 复制到 static 并移除 App 远程 @font-face
    createAppIconFontFeature({ enabled: options.appStaticIconFont !== false }),
    // 后续新增构建期能力在此追加，保持对用户的配置零改动
  ]
}

export default function UpVite(options = {}) {
  const features = createUpViteFeatures(options)

  return {
    name: 'vite-plugin-up-vite',
    enforce: 'pre',
    buildStart() {
      features.forEach(feature => feature.ensure?.())
    },
    transform(code, id) {
      for (const feature of features) {
        const transformed = feature.transform?.(code, id)
        if (transformed) {
          return {
            code: transformed,
            map: null,
          }
        }
      }
      return null
    },
    generateBundle(_, bundle) {
      features.forEach(feature => feature.generateBundle?.(bundle))
    },
  }
}
