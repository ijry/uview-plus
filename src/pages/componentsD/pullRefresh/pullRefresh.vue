<template>
    <view class="u-page">
		<view class="u-page__item">
		    <text class="u-page__item__title" style="margin-top: 0;">基本使用</text>
		    <view class="u-page__item__content">
		      <u-pull-refresh
		          :refreshing="refreshing"
		          :threshold="50"
		          @refresh="onRefresh"
		        >
		          <!-- 列表内容 -->
		          <view class="list-content">
						<view 
						  v-for="item in listData" 
						  :key="item.id"
						  class="list-item"
						>
						  <text>{{ item.name }}</text>
						</view>
					</view>
		        </u-pull-refresh>
		    </view>
		</view>
		<view class="u-page__item">
          <text class="u-page__item__title" style="margin-top: 0;">自定义动画</text>
          <view class="u-page__item__content">
            <u-pull-refresh
			  :refreshing="refreshing1"
			  :threshold="60"
			  @refresh="onRefresh1"
			>
			  <!-- 自定义下拉状态 -->
			  <template #pull="{ distance, threshold }">
				<view class="custom-refresh-content u-flex-y u-flex-items-center">
				  <view class="pull-animation">
					<text>👇</text>
				  </view>
				  <text class="refresh-text">下拉刷新 ({{ Math.round(distance) }}px)</text>
				</view>
			  </template>
			  
			  <!-- 自定义释放状态 -->
			  <template #release="{ distance, threshold }">
				<view class="custom-refresh-content u-flex-y u-flex-items-center">
				  <view class="release-animation">
					<text>👆</text>
				  </view>
				  <text class="refresh-text">释放刷新</text>
				</view>
			  </template>
			  
			  <!-- 自定义刷新中状态 -->
			  <template #refreshing>
				<view class="custom-refresh-content u-flex-y u-flex-items-center">
				  <view class="refreshing-animation">
					<text class="bounce">🔄</text>
				  </view>
				  <text class="refresh-text">正在刷新...</text>
				</view>
			  </template>
			  
			  <!-- 列表内容 -->
			  <view class="list-content">
				<view 
				  v-for="item in listData" 
				  :key="item.id"
				  class="list-item"
				>
				  <text>{{ item.name }}</text>
				</view>
			  </view>
			</u-pull-refresh>
          </view>
      </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
		refreshing: false,
		refreshing1: false,
		listData: []
    };
  },
  created() {
    this.loadData()
  },
  methods: {
	  loadData() {
	    const data = []
		for (let i = 0; i < 8; i++) {
		  data.push({
			id: i,
			name: `Item ${i}`
		  })
		}
		this.listData = data
	  },
	  
	  onRefresh() {
		this.refreshing = true
		// 模拟网络请求
		setTimeout(() => {
		  this.loadData()
		  this.refreshing = false
		}, 2000)
	  },
	  
	  onRefresh1() {
	  		this.refreshing1 = true
	  		// 模拟网络请求
	  		setTimeout(() => {
	  		  this.loadData()
	  		  this.refreshing1 = false
	  		}, 2000)
	  }
  }
};
</script>

<style lang="scss" scoped>
  .u-page__item {
      margin-bottom: 15px;
  }
  .u-page__item__title {
      margin-bottom: 10px;
  }
</style>

<style scoped>
.lottie-refresh {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
}

.animation-container {
  margin-bottom: 10px;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
