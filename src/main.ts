import App from './App'

// pinia
import pinia from '@/store'

// 引入全局uview-plus
import uviewPlus, { setConfig } from '@/uni_modules/uview-plus'

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

// 引入uview-plus对小程序分享的mixin封装
import mpShare from '@/uni_modules/uview-plus/libs/mixin/mpShare.js'
import mixin from './common/mixin'
  
// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createI18n } from 'vue-i18n'
const i18n = createI18n(i18nConfig)
import { initRequest } from './util/request/index'

export function createApp() {
  const app = createSSRApp(App)

  app.use(pinia)
	.use(i18n)
	.use(uviewPlus, () => {
		return {
			httpIns: initRequest,
			options: {
				// 修改config对象的属性
				config: {
					// 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
					unit: 'rpx',
					interceptor: {
						navbarLeftClick:() => {
							console.log('全局拦截')
						}
					},
					// 自定义扩展图标
					customIcon: {
						family: 'xyicon',
						url: 'https://at.alicdn.com/t/c/font_1305928_egvk3tbr3fs.ttf?t=1744189362601'
					},
					customIcons: {
						'light-mode' : '\ue66c'
					}
				},
				// 修改$u.props对象的属性
				props: {
					// 修改radio组件的size参数的默认值，相当于执行 uni.$u.props.radio.size = 30
					alert: {
						type: 'error'
					}
					// 其他组件属性配置
					// ......
				}
			}
		}
	})

  // #ifdef MP
  app.mixin(mpShare)
  app.mixin(mixin)
  // #endif

  return {
    app
  }
}
// #endif




