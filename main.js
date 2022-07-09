import App from './App'

// vuex
import store from './store'

// 引入全局uView
import uView from './uni_modules/uview-ui/index.js'
console.log('uView')
//import mixin from './common/mixin'

// #ifdef MP
// 引入uView对小程序分享的mixin封装
// const mpShare = require('@/uni_modules/uview-ui/libs/mixin/mpShare.js')
// Vue.mixin(mpShare)
// Vue.mixin(mixin)
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  // 引入请求封装
  // require('./util/request/index')(app)

  app.use(store)
	.use(uView)
  return {
    app
  }
}
// #endif




