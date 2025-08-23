<template>
	<view class="u-short-video">
		<!-- 顶部导航区域 -->
		<view class="u-short-video__header">
			<slot name="menu">
				<view class="u-short-video__header__menu">
					<up-icon name="grid" size="24"></up-icon>
				</view>
			</slot>
			
			<up-tabs 
				:list="tabsList" 
				:current="currentTab"
                lineColor="#ddd"
                :activeStyle="{
                    color: '#ddd',
                    fontWeight: 400,
                    transform: 'scale(1)'
                }"
                :inactiveStyle="{
                    color: '#bbb',
                    transform: 'scale(1)'
                }"
				@change="handleTabChange"
				class="u-short-video__header__tabs"
			></up-tabs>
			
			<slot name="search">
				<view class="u-short-video__header__search">
					<up-icon name="search" size="24"></up-icon>
				</view>
			</slot>
		</view>
		
		<!-- 视频内容区域 -->
		<swiper 
			:vertical="true" 
			:autoplay="false" 
			@change="handleSwiperChange"
			:current="currentVideo"
			class="u-short-video__content"
		>
			<swiper-item v-for="(item, index) in videoList" :key="index">
				<view class="u-short-video__content__item">
					<!-- 视频播放区域（此处简化为背景色） -->
					<view class="u-short-video__content__video" :style="{ backgroundColor: item.bgColor || '#ccc' }"></view>
					
					<!-- 作者信息 -->
					<view class="u-short-video__content__author">
						<view class="u-short-video__content__author__avatar">
							<u-avatar :src="item.author.avatar" size="50px"></u-avatar>
						</view>
						<view class="u-short-video__content__author__info">
							<text class="u-short-video__content__author__name">{{ item.author.name }}</text>
							<text class="u-short-video__content__author__desc">{{ item.author.desc }}</text>
						</view>
						<view class="u-short-video__content__author__follow">
							<up-button type="primary" size="mini">关注</up-button>
						</view>
					</view>
					
					<!-- 右侧操作区域 -->
					<view class="u-short-video__content__actions">
						<slot name="actions" :item="item" :index="index">
							<view class="u-short-video__content__actions__item" @click="handleLike(item, index)">
								<up-icon color="#eee" :name="item.isLiked ? 'thumb-up-fill' : 'thumb-up'" size="32px"></up-icon>
								<text class="u-short-video__content__actions__text">{{ item.likeCount }}</text>
							</view>
							<view class="u-short-video__content__actions__item" @click="handleComment(item, index)">
								<up-icon color="#eee" name="chat" size="32px"></up-icon>
								<text class="u-short-video__content__actions__text">{{ item.commentCount }}</text>
							</view>
							<view class="u-short-video__content__actions__item" @click="handleShare(item, index)">
								<up-icon color="#eee" name="share" size="32px"></up-icon>
								<text class="u-short-video__content__actions__text">{{ item.shareCount }}</text>
							</view>
							<view class="u-short-video__content__actions__item" @click="handleCollect(item, index)">
								<up-icon color="#eee" :name="item.isCollected ? 'bookmark-fill' : 'bookmark'" size="32px"></up-icon>
								<text class="u-short-video__content__actions__text">{{ item.collectCount }}</text>
							</view>
						</slot>
					</view>
				</view>
			</swiper-item>
		</swiper>
		
		<!-- 底部导航栏 -->
		<view class="u-short-video__footer">
			<!-- 进度条 -->
			<view class="u-short-video__progress" style="z-index: 999;">
				<up-slider 
					v-model="videoList[currentVideo]?.progress" 
					:min="0" 
					:max="100" 
					:step="1"
					:show-value="false"
                    :innerStyle="{padding: 0}"
                    activeColor="rgba(255,255,255,0.32)"
					inactive-color="rgba(255,255,255,0.3)"
					block-size="6px"
                    block-color="rgba(255,255,255,0.5)"
					height="1px"
					@changing="onProgressChanging"
					@change="onProgressChange"
				></up-slider>
			</view>
			
			<slot name="tabbar">
				<up-tabbar
                    :fixed="true"
                    :placeholder="true"
                    :safeAreaInsetBottom="true"
                    borderColor="rgba(255,255,255,0.25) !important"
                    backgroundColor="rgba(255,255,255,0.05)"
                >
				<up-tabbar-item
					@click="goNext"
					text="首页"
					icon="home"
				>
				</up-tabbar-item>
				<up-tabbar-item
					text="放映厅"
					icon="photo"
				></up-tabbar-item>
				<up-tabbar-item
					text="直播"
					icon="play-right"
				></up-tabbar-item>
				<up-tabbar-item
					text="我的"
					icon="account"
				></up-tabbar-item>
			</up-tabbar>
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'u-short-video',
		props: {
			// tabs标签列表
			tabsList: {
				type: Array,
				default: () => [
					{ name: '推荐' },
					{ name: '关注' },
					{ name: '朋友' },
					{ name: '本地' }
				]
			},
			// 视频列表数据
			videoList: {
				type: Array,
				default: () => []
			},
			// 当前选中的tab索引
			currentTab: {
				type: Number,
				default: 0
			},
			// 当前播放的视频索引
			currentVideo: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				progressValue: 0
			}
		},
		methods: {
			// 处理tab切换
			handleTabChange(index) {
				this.$emit('tabChange', index);
			},
			// 处理swiper切换
			handleSwiperChange(e) {
				const currentIndex = e.detail.current;
				this.$emit('videoChange', currentIndex);
			},
			// 处理点赞
			handleLike(item, index) {
				this.$emit('like', { item, index });
			},
			// 处理评论
			handleComment(item, index) {
				this.$emit('comment', { item, index });
			},
			// 处理分享
			handleShare(item, index) {
				this.$emit('share', { item, index });
			},
			// 处理收藏
			handleCollect(item, index) {
				this.$emit('collect', { item, index });
			},
			// 进度条拖动中
			onProgressChanging(value) {
				// 更新当前视频的进度值
				if (this.videoList[this.currentVideo]) {
					this.$set(this.videoList[this.currentVideo], 'progressValue', value.detail.value);
				}
				this.$emit('progressChanging', {
					progress: value.detail.value,
					index: this.currentVideo
				});
			},
			// 进度条值改变
			onProgressChange(value) {
				// 更新当前视频的进度值
				if (this.videoList[this.currentVideo]) {
					this.$set(this.videoList[this.currentVideo], 'progressValue', value.detail.value);
				}
				this.$emit('progressChange', {
					progress: value.detail.value,
					index: this.currentVideo
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-short-video {
		width: 100%;
		height: 100vh;
		position: relative;
		
		&__header {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			z-index: 10;
			display: flex;
            flex-direction: row;
			align-items: center;
			justify-content: space-between;
			padding: 10px 15px;
			background-color: rgba(255, 255, 255, 0.05);
            opacity: 1;
			
			&__menu, &__search {
				width: 40px;
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
			}
			
			&__tabs {
				flex: 1;
				margin: 0 10px;
			}
		}
		
		&__content {
			width: 100%;
			height: 100%;
			
			&__item {
				width: 100%;
				height: 100%;
				position: relative;
			}
			
			&__video {
				width: 100%;
				height: 100%;
			}
			
			&__author {
				position: absolute;
				left: 15px;
				bottom: 100px;
				display: flex;
                flex-direction: row;
				align-items: center;
				z-index: 10;
				
				&__info {
					margin-left: 10px;
					display: flex;
					flex-direction: column;
					justify-content: center;
				}

                &__name {
						color: #eee;
						font-size: 16px;
						font-weight: bold;
						margin-bottom: 5px;
					}
					
					&__desc {
						color: rgba(255, 255, 255, 0.8);
						font-size: 14px;
					}
				
				&__follow {
					margin-left: 15px;
				}
			}
			
			&__actions {
				position: absolute;
				right: 15px;
				bottom: 100px;
				display: flex;
				flex-direction: column;
				align-items: center;
				z-index: 10;
				
				&__item {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-bottom: 20px;
					color: #fff;
				}
				
				&__text {
					color: #fff;
					font-size: 12px;
					margin-top: 5px;
				}
			}
		}
		
		&__footer {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 10;
		}
		
		&__progress {
		}
	}
</style>