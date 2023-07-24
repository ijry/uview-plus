<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <view style="padding: 20px;">
	  <up-input @change="change"></up-input>
      <up-button type="primary" text="确定"></up-button>
      <up-button type="success" :plain="true" text="镂空"></up-button>
      <up-button type="error" :plain="true" :hairline="true" text="细边"></up-button>
      <up-button type="info" :disabled="disabled" text="禁用"></up-button>
      <up-button type="warning" loading loadingText="加载中"></up-button>
      <up-button type="primary" icon="map" text="图标按钮"></up-button>
      <up-button type="primary" shape="circle" text="按钮形状"></up-button>
      <up-button text="渐变色按钮" color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"></up-button>
      <up-button type="primary" size="small" text="大小尺寸" @click="openDt"></up-button>
      <up-datetime-picker
        :show="show"
        v-model="value1"
        mode="datetime"
      ></up-datetime-picker>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref('Hello')

const disabled = ref(false)
const show = ref(false)
const value1 = ref(Number(new Date()))

const openDt = function() {
  show.value = true
}

const change = function(e) {
	console.log(e)
	uni.showToast({
		title: 'change'
	})
}

</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
