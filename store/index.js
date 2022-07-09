import { createStore } from 'vuex'

const store = createStore({
  // 为了不和页面或组件的data中的造成混淆，state中的变量前面建议加上$符号
  state: {
	  // 用户信息
	  $userInfo: {
		  id: 1
	  }
  }
})

export default store
