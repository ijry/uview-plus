<style lang='scss' scoped>
.cate-tab {
    height: calc(100vh - 150px);
    /* #ifdef H5 */
    height: calc(100vh - 150px - var(--window-top));
    /* #endif */
	.text-red {
		color: red;
	}
}
</style>
<template>
    <view class="u-page">
        <view style="height: 68px;background: linear-gradient(135deg,#fce38a,#f38181);margin-bottom: 10px;"></view>
		<up-cate-tab class="cate-tab" mode="follow" :height="height" :tabList="tabList"
			tabKeyName="title" itemKeyName="title">
            <template #pageItem="{pageItem}">
                <view class="w-full" style="width: 100%;">
                    <up-cell-group :border='false'>
                        <up-cell :border='false'>
                            <template #icon>
                                <up-image :src="pageItem.cover" width="80px" height="60px"></up-image>
                            </template>
                            <template v-slot:title>
                                <view>
                                    {{ pageItem.title }}
                                </view>
                            </template>
                            <template v-slot:label>
                                <view class="h-100 pt-1 up-flex up-flex-end" style="margin-bottom: 10px;">
                                    <text class="text-md text-red">￥{{ pageItem.price }}</text>
                                </view>
								<view class="up-flex up-flex-end">
									<up-number-box buttonSize="22px"></up-number-box>
								</view>
                            </template>
                            <template v-slot:value>
                                
                            </template>
                        </up-cell>
                    </up-cell-group>
                </view>
            </template>
        </up-cate-tab>
    </view>
 </template>
 
 <script setup>
 import { ref, onMounted } from 'vue';

 const height = ref('calc(100vh - 150px)');
   
 // 响应式数据  
 const tabList = ref([]);

 setTimeout(() => {
    console.log('加载数据')
    tabList.value = [
        { title: '选项一',  children: [
            {title: '水煮肉片', cover: 'https://s3.bmp.ovh/imgs/2024/12/16/35bc6d28ab1c8bc7.png', price: 88}
            ]
        },  
        { title: '选项二',  children: [
            {title: '酸菜鱼', cover: 'https://s3.bmp.ovh/imgs/2024/12/16/35bc6d28ab1c8bc7.png', price: 99}
            ]
        },
        { title: '选项三',  children: [
            {title: '水煮肉片', cover: 'https://s3.bmp.ovh/imgs/2024/12/16/35bc6d28ab1c8bc7.png', price: 88}
            ]
        },  
        { title: '选项四',  children: [
            {title: '酸菜鱼', cover: 'https://s3.bmp.ovh/imgs/2024/12/16/35bc6d28ab1c8bc7.png', price: 99}
            ]
        }
    ]
//    height.value = 'calc(100vh - 150px)';
 }, 1000);   
 </script>
 
 <style lang="scss">
    /* #ifndef APP-NVUE */
    page {
       background-color: $u-bg-color;
    }
    /* #endif */
    
    .u-page {
       padding: 0;
       flex: 1;
       background-color: $u-bg-color;
 
       &__item {
 
          &__title {
             color: $u-tips-color;
             background-color: $u-bg-color;
             padding: 15px;
             font-size: 15px;
 
             &__slot-title {
                color: $u-primary;
                font-size: 14px;
             }
          }
       }
    }
 </style>
 