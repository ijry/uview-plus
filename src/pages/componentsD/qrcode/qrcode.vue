<template>
  	<view class="u-page">
		<view class="u-page__item">
			<text class="u-page__item__title" style="margin-top: 0;">不带logo</text>
			<view class="u-page__item__content">
				<up-qrcode :cid="'up1'" :size="150" val="https://click.meituan.com/t?t=1&c=2&p=WhaD2b5zGU-h"></up-qrcode>
			</view>
		</view>
		<view class="u-page__item">
			<text class="u-page__item__title" style="margin-top: 0;">带logo</text>
			<view class="u-page__item__content">
				<up-qrcode :cid="'up2'" :size="150" val="https://click.meituan.com/t?t=1&c=2&p=WhaD2b5zGU-h" :icon="logo"></up-qrcode>
			</view>
		</view>
		<view class="u-page__item">
			<text class="u-page__item__title" style="margin-top: 0;">二维码颜色</text>
			<view class="u-page__item__content">
				<up-qrcode :cid="'up3'" :size="150" val="https://click.meituan.com/t?t=1&c=2&p=WhaD2b5zGU-h" background="red" foreground="blue"></up-qrcode>
			</view>
		</view>
	</view>
</template>

<script setup>
import logo from '@/static/uview/common/logo.png';
</script>

<style lang="scss" scoped>
    .u-page__item {
        margin-bottom: 15px;
    }
    .u-page__item__title {
        margin-bottom: 10px;
    }
</style>
