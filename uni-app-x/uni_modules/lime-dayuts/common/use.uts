// @ts-nocheck
import {DayutsLocale} from '../utssdk/interface'
import en from './locale/en'
import zhCn from './locale/zh-cn'

// #ifndef UNI-APP-X

// #ifdef VUE2
import {reactive} from '@vue/composition-api'
// #endif

// #ifdef VUE3
import {reactive} from 'vue'
// #endif

// #endif


const localesMap = new Map<string, DayutsLocale>()
//定义一个大写的State类型
type LocaleState = {
  lang: string;
  locales: Map<string, DayutsLocale>
}
export let localeState = reactive({
  lang: 'en',
  locales: localesMap
} as LocaleState)
localeState.locales.set('en', en)
localeState.locales.set('zh-cn', zhCn)

class DayutsIntl {
	constructor(){}
	use(locale:DayutsLocale):DayutsIntl{
		localeState.locales.set(locale.name, locale)
		return this
	}
	set locale(locale: string){
		if(localeState.locales.has(locale)){
			localeState.lang = locale
		} else {
			let list:string[] = []
			localeState.locales.forEach(function(_:any,key:string){
			   list.push(key)
			})
			console.warn(`未知语言: "${locale}". 请使用以下已知语言之一:${list.join(', ')}`);
		}
	}
	get locale(): string{
		return localeState.lang
	}
	set(name: string, locale:DayutsLocale){
		localeState.locales.set(name, locale)
	}
	has(name: string):boolean{
		return localeState.locales.has(name)
	}
}
export const dayutsIntl = new DayutsIntl()


// const dyauts = use(xx).use(xx).use(xx).use(xx)
// dyauts.locale ='zh'