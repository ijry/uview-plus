<script>	import { http } from '@/uni_modules/uview-plus'
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: async function() {
			console.log('App Show')
			// let res = await http.get('/')			// console.log(res)
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	// @import "uview-plus/index.scss";	@import "@/uni_modules/uview-plus/index.scss";
	@import "common/demo.scss";
</style>
