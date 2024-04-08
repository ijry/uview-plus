import { http, toast} from '@/uni_modules/uview-plus'
const requestInterceptors=(vm)=>{
	/**
	 * 请求拦截
	 * @param {Object} http
	 */
	http.interceptors.request.use((config) => { // 可使用async await 做异步操作
		// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
		config.data = config.data || {}
		// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
		// console.log(vm.$store.state);		// console.log(config)
		return config
	}, (config) => // 可使用async await 做异步操作
		Promise.reject(config))
}
const responseInterceptors=(vm)=>{
	/**
	 * 响应拦截
	 * @param {Object} http 
	 */
	http.interceptors.response.use((response) => { /* 对响应成功做点什么 可使用async await 做异步操作*/
		const data = response.data		// console.log('http', data)
		// 自定义参数
		const custom = response.config?.custom
		if (data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
			// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
			if (custom.toast !== false) {
				toast(data.message)
			}
			// 如果需要catch返回，则进行reject
			if (custom?.catch) {
				return Promise.reject(data)
			} else {
				// 否则返回一个pending中的promise
				return new Promise(() => { })
			}
		}
		return data.data || {}
	}, (response) => { /*  对响应错误做点什么 （statusCode !== 200）*/
		return Promise.reject(response)
	})
}


export {
	requestInterceptors,
	responseInterceptors
}


