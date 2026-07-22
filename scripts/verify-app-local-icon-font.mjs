import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path) => readFileSync(resolve(repoRoot, path), 'utf8')

const uIconVue = read('src/uni_modules/uview-plus/components/u-icon/u-icon.vue')
const util = read('src/uni_modules/uview-plus/components/u-icon/util.js')
const fontPath = resolve(repoRoot, 'src/uni_modules/uview-plus/components/u-icon/upicon.ttf')

if (!existsSync(fontPath)) {
  throw new Error('built-in icon font asset upicon.ttf is missing')
}

if (statSync(fontPath).size <= 0) {
  throw new Error('built-in icon font asset upicon.ttf is empty')
}

const appRemoteFontFace = /#ifdef\s+APP[^\n]*[\s\S]*?@font-face[\s\S]*?at\.alicdn\.com[\s\S]*?#endif/
if (appRemoteFontFace.test(uIconVue)) {
  throw new Error('u-icon.vue still includes an App remote @font-face block')
}

if (!/#ifdef\s+MP-QQ\s+\|\|\s+MP-TOUTIAO\s+\|\|\s+MP-BAIDU\s+\|\|\s+MP-KUAISHOU\s+\|\|\s+MP-XHS/.test(uIconVue)) {
  throw new Error('u-icon.vue should keep the non-App mini-program @font-face condition')
}

if (!/new URL\('\.\/upicon\.ttf',\s*import\.meta\.url\)\.href/.test(util)) {
  throw new Error('util.js should resolve the App built-in font from ./upicon.ttf')
}

if (!/params\.loaded\s*=\s*true;\s*return;[\s\S]*if\s*\(config\.loadFontOnce\)/.test(util)) {
  throw new Error('util.js should mark App built-in font loading once before falling back to loadFontOnce for non-App')
}

if (!/return config\.iconUrl/.test(util)) {
  throw new Error('util.js should keep config.iconUrl for non-App platforms')
}

console.log('app local icon font checks passed')
