import { rollup } from 'rollup'
import UniUpRoot from '../src/uni_modules/uview-plus/libs/root/index.js'

const plugin = UniUpRoot({ rootFileName: 'App.up', autoCreateRootFile: false })

const nvueConfig = {
  plugins: [{ name: 'uni:app-nvue' }],
  build: { rollupOptions: {} }
}
plugin.configResolved(nvueConfig)

if (nvueConfig.build.rollupOptions.treeshake !== false) {
  throw new Error('UniUpRoot should disable nvue sub-build tree-shaking for app-nvue esbuild')
}

const bundle = await rollup({
  input: 'main.js',
  treeshake: nvueConfig.build.rollupOptions.treeshake,
  plugins: [{
    name: 'virtual-nvue-pages',
    resolveId(id) {
      if (id === 'main.js' || id === './pages/example/components.js') return id
    },
    load(id) {
      if (id === 'main.js') return "import('./pages/example/components.js').then((res) => { res() })"
      if (id === './pages/example/components.js') return 'export default function App() {}'
    },
    renderDynamicImport() {
      return { left: 'Promise.resolve(', right: ')' }
    }
  }]
})

const { output } = await bundle.generate({
  dir: 'dist/virtual-nvue',
  format: 'es',
  entryFileNames: '[name].js',
  chunkFileNames: '[name].js'
})
await bundle.close()

const pageChunk = output.find((chunk) => chunk.fileName === 'components.js')
if (!pageChunk || !/export\s*\{[^}]*default/.test(pageChunk.code)) {
  throw new Error('nvue page chunks should keep a default export after dynamic import polyfill')
}

console.log('root nvue entry signature checks passed')
