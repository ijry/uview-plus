<template>
  	<view class="u-page">
		<view class="u-page__item">
			<text class="u-page__item__title" style="margin-top: 0;">不带logo</text>
			<view class="u-page__item__content">
				<up-qrcode :cid="'up-'+ Date.now()" :size="200" val="uview-plus"></up-qrcode>
			</view>
		</view>
		<view class="u-page__item">
			<text class="u-page__item__title" style="margin-top: 0;">带logo</text>
			<view class="u-page__item__content">
				<up-qrcode :cid="'up-'+ Date.now()" :size="200" val="uview-plus" :icon="logo"></up-qrcode>
			</view>
		</view>
		<view class="u-page__item">
			<text class="u-page__item__title" style="margin-top: 0;">二维码颜色</text>
			<view class="u-page__item__content">
				<up-qrcode :cid="'up-'+ Date.now()" :size="200" val="uview-plus" background="red" foreground="blue"></up-qrcode>
			</view>
		</view>
	</view>
</template>

<script setup>
import logo from '@/static/uview/common/logo.png';
</script>
