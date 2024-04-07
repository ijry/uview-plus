import App from './App'

// vuex
import store from './store'

// 引入全局uview-plus
import uviewPlus from '@/uni_modules/uview-plus/index.js'

// i18n部分的配置
// 引入语言包，注意路径
import zhHans from '@/common/locales/zh.js';
import en from '@/common/locales/en.js';
const messages = {
	en,
	'zh-Hans': zhHans,
}
let i18nConfig = {
  locale: uni.getLocale(),// 获取已设置的语言
  messages
}

// 引入uView对小程序分享的mixin封装
import mpShare from '@/uni_modules/uview-plus/libs/mixin/mpShare.js'
import mixin from './common/mixin'
  
// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createI18n } from 'vue-i18n'
const i18n = createI18n(i18nConfig)
import { initRequest } from './util/request/index'
export function createApp() {
  const app = createSSRApp(App)
  
  // 引入请求封装
  initRequest(app)

  app.use(store)
	.use(i18n)
	.use(uviewPlus)

  // #ifdef MP
  app.mixin(mpShare)
  app.mixin(mixin)
  // #endif

  return {
    app
  }
}
// #endif




