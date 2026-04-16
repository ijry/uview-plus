<template>
  <view class="u-page">
      <view class="u-page__item">
          <text class="u-page__item__title" style="margin-top: 0;">默认</text>
          <view class="u-page__item__content">
            <up-select v-model:current="cateId" label="分类" :showOptionsLabel="true"
                :options="scenesList"></up-select>
          </view>
      </view>
      <view class="u-page__item">
          <text class="u-page__item__title" style="margin-top: 0;">插槽</text>
          <view class="u-page__item__content">
            <up-select v-model:current="cateId" label="分类" :showOptionsLabel="true"
                :options="scenesList">
                <template #optionItem="{item}">
                    <text class="u-select__item_text">
                        {{item.name}}
                    </text>
                </template>
            </up-select>
          </view>
      </view>
      <view class="u-page__item">
          <text class="u-page__item__title" style="margin-top: 0;">边框与下拉宽度</text>
          <view class="u-page__item__content u-page__item__content--pc">
            <up-select
                v-model:current="pcSelectId"
                label="请选择分类"
                :showOptionsLabel="true"
                :options="scenesList"
                :border="true"
                optionsWidth="100%">
            </up-select>
          </view>
      </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const cateId = ref('')
const pcSelectId = ref('')
const scenesList = ref([
    {
        id: '1',
        name: '分类1'
    },
    {
        id: '2',
        name: '分类2'
    },
    {
        id: '3',
        name: '分类4'
    },
])
</script>

<style lang="scss" scoped>
  .u-page__item {
      margin-bottom: 15px;
  }
  .u-page__item__title {
      margin-bottom: 10px;
  }
  .u-page__item__content--pc {
      width: 100%;
  }
</style>

