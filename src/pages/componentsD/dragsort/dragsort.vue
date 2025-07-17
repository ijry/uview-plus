<template>
    <view class="u-page">
      <view class="u-page__item">
          <text class="u-page__item__title" style="margin-top: 0;">基础使用</text>
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
	      <text class="u-page__item__title" style="margin-top: 0;">横向拖动</text>
	      <view class="u-page__item__content">
	        <u-dragsort
	            :initial-list="list"
	            :draggable="true"
	            direction="horizontal"
	            @drag-end="handleDragEnd"
	          />
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
      ]
    };
  },
  methods: {
    handleDragEnd(sortedList) {
	  console.log('拖拽结束，新的顺序:', sortedList);
	  this.list = sortedList;
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
	  margin-bottom: 2px;
	  padding: 10px;
  }
</style>
