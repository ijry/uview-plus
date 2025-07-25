<template>
    <view class="u-page">
	  <up-alert class="u-m-b-20" description="PC端查看时需要触摸仿真模式才会正确计算位置"></up-alert>
      <view class="u-page__item">
          <text class="u-page__item__title" style="margin-top: 0;">单列多行模式</text>
          <view class="u-page__item__content">
            <u-dragsort :initial-list="list" @drag-end="handleDragEnd">
			  <template #default="{ item, index }">
				<view class="custom-item">
				  <text>序号：{{ index + 1 }}</text> -
				  <text>{{ item.label }}</text>
				</view>
			  </template>
			</u-dragsort>
          </view>
      </view>
	  <view class="u-page__item">
	      <text class="u-page__item__title" style="margin-top: 0;">多行多列模式</text>
	      <view class="u-page__item__content">
	        <u-dragsort
	            :initial-list="list"
	            :draggable="true"
				:columns="3"
	            direction="all"
	            @drag-end="handleDragEnd">
			  <template #default="{ item, index }">
				<view class="u-p-r-10">
					<view class="custom-item-h">
					<text>{{ item.label }}</text>
					</view>
				</view>
			  </template>
			</u-dragsort>
	      </view>
	  </view>
	  <view class="u-page__item">
	      <text class="u-page__item__title" style="margin-top: 0;">单行横向拖动</text>
	      <view class="u-page__item__content">
	        <u-dragsort
	            :initial-list="list2"
	            :draggable="true"
	            direction="horizontal"
	            @drag-end="handleDragEnd">
			  <template #default="{ item, index }">
				<view class="u-p-r-10">
					<view class="custom-item-h">
					<text>{{ item.label }}</text>
					</view>
				</view>
			  </template>
			</u-dragsort>
	      </view>
	  </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
		  { id: 1, label: '项目 A' },
		  { id: 2, label: '项目 B' },
		  { id: 3, label: '项目 C' },
		  { id: 4, label: '项目 D' },
		  { id: 5, label: '项目 E' },
		  { id: 6, label: '项目 F' },
		  { id: 7, label: '项目 G' },
		  { id: 8, label: '项目 H' },
      ],
	  list2: [
		  { id: 1, label: '横向 A' },
		  { id: 2, label: '横向 B' },
		  { id: 3, label: '横向 C' },
		  { id: 4, label: '横向 D' },
		  { id: 5, label: '横向 E' },
		  { id: 6, label: '横向 F' },
		  { id: 7, label: '横向 G' },
		  { id: 8, label: '横向 H' },
      ]
    };
  },
  methods: {
    handleDragEnd(sortedList) {
	  console.log('拖拽结束，新的顺序:', sortedList);
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
  .custom-item {
	  background-color: #f5f5f5;
	  padding: 10px;
	  box-sizing: border-box;
  }
  .custom-item-h {
	  background-color: #f5f5f5;
	  padding: 10px;
	  box-sizing: border-box;
  }
</style>
