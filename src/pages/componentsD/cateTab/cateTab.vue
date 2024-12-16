<style lang='scss' scoped>
.cate-tab {
    height: calc(100vh - 150px);
    /* #ifdef H5 */
    height: calc(100vh - 150px - var(--window-top));
    /* #endif */
}
</style>
<template>
    <view class="u-page">
        <view style="height: 138px;background: #f1f1f1;"></view>
		<up-cate-tab class="cate-tab" :tabList="tabList" tabKeyName="title" itemKeyName="title">
            <template #pageItem="{pageItem}">
                <view class="w-full">
                    <up-cell-group :border='false'>
                        <up-cell :border='false'>
                            <template #icon>
                                <up-image :src="pageItem.cover" width="100px" height="100px"></up-image>
                            </template>
                            <template v-slot:title>
                                <view>
                                    {{ pageItem.title }}
                                </view>
                            </template>
                            <template v-slot:label>
                                <view class="h-100 pt-1">
                                    <text class="text-md text-red">￥{{ pageItem.price }}</text>
                                </view>
                            </template>
                            <template v-slot:value>
                                <up-number-box></up-number-box>
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
   
 // 响应式数据  
 const tabList = ref([  
   { title: '选项一',  children: [
     {title: '水煮肉片', cover: 'https://s3.bmp.ovh/imgs/2024/12/16/35bc6d28ab1c8bc7.png', price: 88}
     ]
   },  
   { title: '选项一',  children: [
     {title: '酸菜鱼', cover: 'https://s3.bmp.ovh/imgs/2024/12/16/35bc6d28ab1c8bc7.png', price: 99}
     ]
   },
   { title: '选项一',  children: [
     {title: '水煮肉片', cover: 'https://s3.bmp.ovh/imgs/2024/12/16/35bc6d28ab1c8bc7.png', price: 88}
     ]
   },  
   { title: '选项一',  children: [
     {title: '酸菜鱼', cover: 'https://s3.bmp.ovh/imgs/2024/12/16/35bc6d28ab1c8bc7.png', price: 99}
     ]
   },
 ]);
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
 