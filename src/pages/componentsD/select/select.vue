<template>
    <view class="u-page">
      <view class="u-page__item">
          <text class="u-page__item__title" style="margin-top: 0;">默认</text>
          <view class="u-page__item__content">
            <up-select v-model:current="cateId" label="分类"
                :options="scenesList"></up-select>
          </view>
      </view>
      <view class="u-page__item">
          <text class="u-page__item__title" style="margin-top: 0;">插槽</text>
          <view class="u-page__item__content">
            <up-select v-model:current="cateId" label="分类"
                :options="scenesList">
                <template #optionItem="{item}">
                    <text class="u-select__item_text">
                        {{item.name}}
                    </text>
                </template>
            </up-select>
          </view>
      </view>
  </view>
</template>

<script setup>
import logo from '@/static/uview/common/logo.png';
import { ref } from 'vue';

const cateId = ref('')
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
</style>
