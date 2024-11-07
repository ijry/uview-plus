<template>
	<view style="margin: 100px 30px;">
		<up-button type="primary" @click="videoAdLoad">打开广告</up-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				videoAd: ''
			};
		},
		onLoad(options){
			this.videoAdCreat()
		},
		onShow() {
			// 获取当前小程序的页面栈
			let pages = getCurrentPages();
			// 数组中索引最大的页面--当前页面
			let currentPage = pages[pages.length-1];
			// 打印出当前页面中的 options
			console.log(currentPage.options)
			let options = currentPage.options;
			if (options.scene) {
				const scene = decodeURIComponent(options.scene);
				this.id = scene;
				console.log(this.id)
			} else {
				this.id = '';
			}
		},
		methods: {
			videoAdCreat(){
				 // 在页面onLoad回调事件中创建激励视频广告实例
				 if (wx.createRewardedVideoAd) {
					this.videoAd = wx.createRewardedVideoAd({
						adUnitId: 'adunit-fe31910e54f0cdc9'
					})
					this.videoAd.onError((err) => {
						wx.showToast({
							title: this.videoAdErrHandle(err),
							icon: 'none'
						})
					})
					// 监听关闭
					this.videoAd.onClose((status) => {
						if (status && status.isEnded || status === undefined) {
							console.log('视频正常关闭 下发奖励')
							this.watchEnd();
						} else {
							// 播放中途退出，进行提示
							wx.showToast({title: '未完整观看视频不能获取奖励哦', icon: 'none'})
						}
					})
					// this.videoAdLoad()
				 } else {
					wx.showToast({
						title: '请升级微信',
						icon: 'none'
					})
				 }
			},
			// 开始广告
			videoAdLoad() {
				this.videoAd.show().catch((err) => {
					this.videoAd.load()
						.then(() => this.videoAd.show())
						.catch(err => {
							wx.showToast({
								title: this.videoAdErrHandle(err),
								icon: 'none'
							})
						})
				})
			},
			// 观看完成提交后台接口
			watchEnd() {
				uni.request({
				    url: 'https://uiadmin.net/api/v1/wxapp/ad/end',
				    data: {
				        id: this.id
				    },
					method: 'put',
				    header: {
				    },
				    success: (res) => {
				        console.log(res.data);
				    }
				});
			},
			videoAdErrHandle(err){
				 console.log('视频加载失败')
				 console.log(err)
				 // {errMsg: "no advertisement", errCode: 1004}
				 const errHandle={
					 1000:'后端接口调用失败',
					 1001:'参数错误',
					 1002:'广告单元无效',
					 1003:'内部错误',
					 1004:'无合适的广告',
					 1005:'广告组件审核中',
					 1006:'广告组件被驳回',
					 1007:'广告组件被封禁',
					 1008:'广告单元已关闭',
				 }
				 return errHandle[err.errCode] || '视频加载错误,重新加载页面试试吧'
			}
		}
	}
</script>

<style lang="scss">

</style>
