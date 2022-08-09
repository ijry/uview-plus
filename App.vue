<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			console.log(uni.$u.http)
			//uni.$u.http.get('https://baidu.com')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uni_modules/uview-plus/index.scss";
	@import "common/demo.scss";
</style>
