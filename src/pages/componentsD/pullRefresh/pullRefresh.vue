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
          <text class="u-page__item__title" style="margin-top: 0;">自定义下拉动画</text>
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
	  <view class="u-page__item">
	      <text class="u-page__item__title" style="margin-top: 0;">结合虚拟列表</text>
	      <view class="u-page__item__content">
	        <u-pull-refresh
			  :refreshing="refreshing3"
			  @refresh="onRefresh3"
			>
			  <u-virtual-list
				:list-data="listData3"
				:item-height="32"
				height="150px"
				@scroll="onScroll3"
			  >
				<template #default="{ item, index }">
				  <view class="list-item">
					<text>Item {{ item.id }}: {{ item.name }}</text>
				  </view>
				</template>
			  </u-virtual-list>
			</u-pull-refresh>
	      </view>
	  </view>
	  <view class="u-page__item">
	      <text class="u-page__item__title" style="margin-top: 0;">上拉加载</text>
	      <view class="u-page__item__content">
	        <u-pull-refresh
	  			  :refreshing="refreshing2"
	  			  :showLoadmore="true"
	  			  :loadmoreProps="loadmoreConfig"
	  			  @refresh="onRefresh2"
	  			  @loadmore="onLoadmore"
	  			>
	  				<!-- 使用外部 scroll-view 或其他可滚动组件 -->
	  				<scroll-view
	  				  class="scroll-area"
	  				  style="height: 100px;"
	  				  :scroll-y="true"
	  				  @scrolltolower="onScrollToLower"
	  				>
	  				  <view class="list-content">
	  					<view 
	  					  v-for="item in listData2" 
	  					  :key="item.id"
	  					  class="list-item"
	  					>
	  					  <text>{{ item.name }}</text>
	  					</view>
	  				  </view>
	  				</scroll-view>
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
		refreshing2: false,
		loadmoreConfig: {
			status: 'loadmore', // loadmore, loading, nomore
			loadmoreText: '上拉加载更多',
			loadingText: '努力加载中...',
			nomoreText: '我们是有底线的',
			iconSize: 18
		},
		listData: [],
		listData2: [],
		refreshing3: false,
		listData3: [],
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
		this.listData2 = [...data]
		this.listData3 = [...data]
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
	  },
	  onRefresh2() {
	  		this.refreshing2 = true
	  		// 模拟网络请求
	  		setTimeout(() => {
	  		  this.loadData()
	  		  this.refreshing2 = false
	  		}, 2000)
	  },
	  onRefresh3() {
	  		this.refreshing3 = true
	  		// 模拟网络请求
	  		setTimeout(() => {
	  		  this.loadData()
	  		  this.refreshing3 = false
	  		}, 2000)
	  },
	  onScroll3() {},
	  onScrollToLower() {
		  this.loadmoreConfig.status = 'loading'
		  setTimeout(() => {
		    this.listData2.push({
			  id: this.listData2.length,
			  name: 'Item ' + this.listData2.length
		    })
		    this.loadmoreConfig.status = 'loadmore'
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
