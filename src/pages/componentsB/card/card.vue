<template>
	<view>
		<view class="u-card-wrap">
			<up-title class="u-p-t-20 u-p-l-30">基础卡片</up-title>
			<up-card :showHead="false">
				<template #body>
					<view class="ts-14 tw5 lh-1-8" >
						尊敬的客户您好，您有来自的开票。如果有疑问请联系您的客户经理。
					</view>
				</template>
			</up-card>
			<up-title class="u-p-t-20 u-p-l-30">高级卡片</up-title>
			<up-card @click="click" @head-click="headClick" :title="title"
				:sub-title="subTitle" :thumb="thumb" :padding="padding" :border="border">
				<template #body>
					<view>
						<view class="u-body-item u-flex u-flex-items-start u-border-bottom u-col-between u-p-t-0">
							<view class="u-body-item-title u-line-2">瓶身描绘的牡丹一如你初妆，冉冉檀香透过窗心事我了然，宣纸上走笔至此搁一半</view>
							<image src="https://uview-plus.jiangruyi.com/uview/ext/59c256f85a8c3757.jpg" mode="aspectFill"></image>
						</view>
						<view class="u-body-item u-flex u-row-between u-p-b-0">
							<view class="u-body-item-title u-line-2">釉色渲染仕女图韵味被私藏，而你嫣然的一笑如含苞待放</view>
							<image src="https://uview-plus.jiangruyi.com/uview/ext/59c256f85a8c3757.jpg" mode="aspectFill"></image>
						</view>
					</view>
				</template>
				<template #foot>
					<view>
						<up-icon name="chat-fill" size="16" color="" label="30评论"></up-icon>
					</view>
				</template>
			</up-card>
		</view>
		<view class="u-demo">
			<view class="u-demo-block">
			    <text class="u-demo-block__title">参数配置</text>
			</view>
			<view class="u-demo-block">
			    <text class="u-demo-block__title">左上角图标</text>
			    <view class="u-demo-block__content">
					<up-subsection :list="['显示', '隐藏']" @change="thumbChange"></up-subsection>
			    </view>
			</view>
			<view class="u-demo-block">
			    <text class="u-demo-block__title">内边距</text>
			    <view class="u-demo-block__content">
					<up-subsection current="1" :list="['10', '15', '20']" @change="paddingChange"></up-subsection>
			    </view>
			</view>
			<view class="u-demo-block">
			    <text class="u-demo-block__title">底部</text>
			    <view class="u-demo-block__content">
					<up-subsection :list="['显示', '隐藏']" @change="bottomChange"></up-subsection>
			    </view>
			</view>
			<view class="u-demo-block">
			    <text class="u-demo-block__title">外边框</text>
			    <view class="u-demo-block__content">
					<up-subsection :list="['显示', '隐藏']" @change="borderChange"></up-subsection>
			    </view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('素胚勾勒出青花，笔锋浓转淡')
const subTitle = ref('2023-05-15')
const thumb = ref('https://uview-plus.jiangruyi.com/uview/ext/59c256f85a8c3757.jpg')
const padding = ref(15)
const bottomSlot = ref(true)
const border = ref(true)

const thumbChange = (index) => {
	thumb.value = index == 0 ? 'https://uview-plus.jiangruyi.com/uview/ext/59c256f85a8c3757.jpg' : ''
}

const paddingChange = (index) => {
	padding.value = [10, 15, 20][index]
}

const bottomChange = (index) => {
	bottomSlot.value = !index
}

const borderChange = (index) => {
	border.value = !index
}

const click = (index) => {
	console.log(index)
}

const headClick = (index) => {
	console.log(index)
}
</script>

<style scoped lang="scss">
	.u-demo {
		padding: 20px;
	}
	
	.u-card-wrap { 
		background-color: $u-bg-color;
		padding: 1px;
		
		.u-body-item {
			font-size: 32rpx;
			color: #333;
			padding: 20rpx 10rpx;
		}
			
		.u-body-item image {
			width: 120rpx;
			flex: 0 0 120rpx;
			height: 120rpx;
			border-radius: 8rpx;
			margin-left: 12rpx;
		}
	}
</style>