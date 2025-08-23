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
					<!-- 视频播放区域 -->
					<view class="u-short-video__content__video">
						<video 
							:id="'video-' + index"
							:src="item.videoUrl" 
							:autoplay="index === currentVideo" 
							:controls="false"
							:show-fullscreen-btn="false"
							:show-play-btn="false"
							:show-center-play-btn="false"
							:enable-progress-gesture="true"
							:loop="true"
							:playback-rate="item.playbackRate || 1.0"
							@play="onVideoPlay"
							@pause="onVideoPause"
							@ended="onVideoEnded"
							@timeupdate="onTimeUpdate"
							@loadedmetadata="onLoadedMetadata"
							style="width: 100%; height: 100%;"
						></video>
						
						<!-- 倍速设置按钮 -->
						<!-- <view class="u-short-video__content__video__speed" @click="showSpeedOptions(index)">
							<text class="speed-text">{{ item.playbackRate || 1.0 }}x</text>
							<up-icon name="arrow-down" size="12" color="#fff"></up-icon>
						</view> -->
					</view>
					
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
		
		<!-- 倍速选择弹窗 -->
		<up-action-sheet
			:show="showSpeedSheet"
			:actions="speedOptions"
			title="播放速度"
			@close="showSpeedSheet = false"
			@select="selectSpeed"
		></up-action-sheet>
		
		<!-- 底部导航栏 -->
		<view class="u-short-video__footer">
			<!-- 进度条 -->
			<view class="u-short-video__progress" style="z-index: 999;">
				<up-slider 
					:value="videoList[currentVideo]?.progress" 
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
				progressValue: 0,
				showSpeedSheet: false,
				currentSpeedVideoIndex: 0,
				speedOptions: [
					{ name: '0.5x', value: 0.5 },
					{ name: '0.75x', value: 0.75 },
					{ name: '1.0x', value: 1.0 },
					{ name: '1.25x', value: 1.25 },
					{ name: '1.5x', value: 1.5 },
					{ name: '2.0x', value: 2.0 }
				]
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
				// 暂停当前播放的视频
				this.pauseCurrentVideo();
				// 播放新切换到的视频
				this.$nextTick(() => {
					this.playVideo(currentIndex);
				});
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
					this.videoList[this.currentVideo]['progressValue'] = value.detail.value
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
			},
			// 显示倍速选项
			showSpeedOptions(index) {
				this.currentSpeedVideoIndex = index;
				this.showSpeedSheet = true;
			},
			// 选择倍速
			selectSpeed(action) {
				const videoContext = uni.createVideoContext('video-' + this.currentSpeedVideoIndex, this);
				videoContext.playbackRate(action.value);
				
				// 更新视频倍速数据
				this.$set(this.videoList[this.currentSpeedVideoIndex], 'playbackRate', action.value);
				this.showSpeedSheet = false;
			},
			// 播放指定索引的视频
			playVideo(index) {
				const videoContext = uni.createVideoContext('video-' + index, this);
				videoContext.play();
			},
			// 暂停当前视频
			pauseCurrentVideo() {
				const videoContext = uni.createVideoContext('video-' + this.currentVideo, this);
				videoContext.pause();
			},
			// 视频播放事件
			onVideoPlay(e) {
				this.$emit('videoPlay', { index: this.currentVideo, event: e });
			},
			// 视频暂停事件
			onVideoPause(e) {
				this.$emit('videoPause', { index: this.currentVideo, event: e });
			},
			// 视频结束事件
			onVideoEnded(e) {
				this.$emit('videoEnded', { index: this.currentVideo, event: e });
			},
			// 视频时间更新事件
			onTimeUpdate(e) {
				const progress = (e.detail.currentTime / e.detail.duration) * 100;
				if (this.videoList[this.currentVideo]) {
					this.$set(this.videoList[this.currentVideo], 'progress', progress);
				}
				this.$emit('timeUpdate', { index: this.currentVideo, event: e });
			},
			// 视频元数据加载完成事件
			onLoadedMetadata(e) {
				this.$emit('loadedMetadata', { index: this.currentVideo, event: e });
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
				position: relative;
				
				&__speed {
					position: absolute;
					top: 15px;
					right: 15px;
					z-index: 10;
					background-color: rgba(0, 0, 0, 0.3);
					border-radius: 20px;
					padding: 5px 10px;
					display: flex;
					align-items: center;
					
					.speed-text {
						color: #fff;
						font-size: 12px;
						margin-right: 4px;
					}
				}
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