<template>
	<view @click="handleClick">
        <slot>复制</slot>
    </view>
</template>
<script>
export default {
    name: "xy-copy",
    props: {
        content: {
            type: String,
            default: ''
        },
		alertStyle: {
			type: String,
			default: 'toast'
		},
		notice: {
			type: String,
			default: '复制成功'
		}
    },
	emits: ['success'],
    methods: {
        handleClick() {
            let content = this.content;
			if (!content) {
				uni.showToast({
				    title: '暂无',
				    icon: 'none',
				    duration: 2000,
				});
				return false;
			}
            content = typeof content === 'string' ? content : content.toString() // 复制内容，必须字符串，数字需要转换为字符串
            /**
			* 小程序端 和 app端的复制逻辑
			*/
			let that = this;
            uni.setClipboardData({
                data: content,
                success: function() {
					if (that.alertStyle == 'modal') {
						uni.showModal({
							title: '提示',
							content: that.notice
						});
					} else {
						uni.showToast({
						    title: that.notice,
						    icon: 'none'
						});
					}
					that.$emit('success');
                },
                fail:function(){
                    uni.showToast({
                        title: '复制失败',
                        icon: 'none',
                        duration:3000,
                    });
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
