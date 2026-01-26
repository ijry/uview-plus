<template>
	<view class="u-cate-tab" :style="{ height: addUnit(height) }">
		<view class="u-cate-tab__wrap">
			<scroll-view class="u-cate-tab__view u-cate-tab__menu-scroll-view"
                scroll-y scroll-with-animation :scroll-top="scrollTop"
			    :scroll-into-view="itemId">
				<view v-for="(item, index) in tabList" :key="index" class="u-cate-tab__item"
                    :class="[innerCurrent == index ? 'u-cate-tab__item-active' : '']"
				 @tap.stop="swichMenu(index)">
					<slot name="tabItem" :item="item">
                    </slot>
                    <text v-if="!$slots['tabItem']" class="u-line-1">{{item[tabKeyName]}}</text>
				</view>
			</scroll-view>
			<scroll-view :scroll-top="scrollRightTop" scroll-with-animation :scroll-into-view="scrollIntoView"
				scroll-y class="u-cate-tab__right-box" @scroll="rightScroll">
				<view class="u-cate-tab__right-top">
					<slot name="rightTop" :tabList="tabList">
                	</slot>
				</view>
				<view class="u-cate-tab__page-view">
					<template :key="index" v-for="(item , index) in tabList">
						<view v-if="mode == 'follow' || ( mode == 'tab' && index == innerCurrent)"
							class="u-cate-tab__page-item" :id="'item' + index">
							<slot name="itemList" :item="item">
							</slot>
							<template v-if="!$slots['itemList']">
								<view class="item-title">
									<text>{{item[tabKeyName]}}</text>
								</view>
								<view class="item-container">
									<template v-for="(item1, index1) in item.children" :key="index1">
										<slot name="pageItem" :pageItem="item1">
											<view class="thumb-box" >
												<image class="item-menu-image" :src="item1.icon" mode=""></image>
												<view class="item-menu-name">{{item1[itemKeyName]}}</view>
											</view>
										</slot>
									</template>
								</view>
							</template>
						</view>
					</template>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script>
	import { addUnit, sleep } from '../../libs/function/index';
	export default {
		name: 'up-cate-tab',
        props: {
			mode: {
                type: String,
                default: 'follow' // follo跟随联动, tab单一显示。
            },
			height: {
                type: String,
                default: '100%'
            },
            tabList: {
                type: Array,
                default: () => {
                    return []
                }
            },
            tabKeyName: {
                type: String,
                default: 'name'
            },
            itemKeyName: {
                type: String,
                default: 'name'
            },
			current: {
                type: Number,
                default: 0
            }
        },
        watch: {
			tabList: {
				deep: true,
				handler(newVal, oldVal) {
					// this.observer();
					sleep(30).then(() => {
						this.getMenuItemTop();
						this.leftMenuStatus(this.innerCurrent);
					})
				}
			},
			current(nval) {
				this.innerCurrent = nval;
				this.leftMenuStatus(this.innerCurrent);
				sleep(30).then(() => {
					this.swichMenu(this.innerCurrent)
				})
			},
			height() {
				// console.log('height change');
				this.getMenuItemTop();
				this.leftMenuStatus(this.innerCurrent);
			}
        },
		emits: ['update:current'],
		data() {
			return {
				scrollTop: 0, //tab标题的滚动条位置
				scrollIntoView: '', // 滚动至哪个元素
				oldScrollTop: 0,
				innerCurrent: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				itemId: '', // 栏目右边scroll-view用于滚动的id
				menuItemPos: [],
                rects: [],
				arr: [],
				scrollRightTop: 0, // 右边栏目scroll-view的滚动条高度
				timer: null, // 定时器
			}
		},
		mounted() {
			// this.observer();
			this.innerCurrent = this.current;
			this.leftMenuStatus(this.innerCurrent);
			this.getMenuItemTop()
			// 设置默认index
			sleep(50).then(() => {
				this.swichMenu(this.innerCurrent)
			})
		},
		methods: {
			addUnit,
			// 点击左边的栏目切换
			async swichMenu(index) {
				if (this.mode == 'follow') {
					if(this.arr.length == 0) {
						await this.getMenuItemTop();
					}
					if (this.scrollIntoView != 'item' + index) {
						this.scrollIntoView = 'item' + index;
					}
				}

				if (index == this.innerCurrent) return;
				this.$nextTick(function(){
					this.innerCurrent = index;
					this.$emit('update:current', index);
				})
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				return new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({
						size: true
					}, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
						resolve();
					}).exec();
				})
			},
			// 观测元素相交状态
			async observer() {
				await this.$nextTick();
				// 清除之前的观察器
				if (this._observerList) {
					this._observerList.forEach(observer => {
						observer.disconnect();
					});
				}
				this._observerList = [];
				
				this.tabList.map((val, index) => {
					let observer = uni.createIntersectionObserver(this);
					this._observerList.push(observer);
					// 检测相交状态
					observer.relativeTo('.u-cate-tab__right-box', {
						top: 10
					}).observe('#item' + index, (res) => {
						if (res.intersectionRatio > 0) {
							console.log('res', res);
							// 修复：确保正确获取索引
							let id = res.id ? res.id.substring(4) : index;
							this.leftMenuStatus(parseInt(id));
						}
					})
				})
			},
			// 设置左边菜单的滚动状态
			async leftMenuStatus(index) {
				this.innerCurrent = index;
				this.$emit('update:current', index);
				// 如果为0，意味着尚未初始化
				if (this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('u-cate-tab__menu-scroll-view', 'menuHeight');
					await this.getElRect('u-cate-tab__item', 'menuItemHeight');
				}
				// console.log(this.menuHeight, this.menuItemHeight)
				// 将菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			// 获取右边菜单每个item到顶部的距离
			async getMenuItemTop() {
				// await this.$nextTick();
				// console.log('getMenuItemTop')
				return new Promise(resolve => {
					let selectorQuery = uni.createSelectorQuery().in(this);
					selectorQuery.selectAll('.u-cate-tab__page-item').boundingClientRect((rects) => {
						// 如果节点尚未生成，rects值为[](因为用selectAll，所以返回的是数组)，循环调用执行
						if(!rects.length) {
							setTimeout(() => {
								this.getMenuItemTop();
							}, 100);
							return ;
						}
						// console.log(rects)
                        this.rects = rects;
						this.arr = [];
						rects.forEach((rect) => {
							// 这里减去rects[0].top，是因为第一项顶部可能不是贴到导航栏(比如有个搜索框的情况)
							this.arr.push(rect.top - rects[0].top);
						})
						// console.log(this.arr)
                        resolve();
					}).exec()
				})
			},
			// 右边菜单滚动
			async rightScroll(e) {
				if (this.mode !== 'follow') return;
				this.oldScrollTop = e.detail.scrollTop;
                // console.log(e.detail.scrollTop)
                // console.log(JSON.stringify(this.arr))
				if(this.arr.length == 0) {
					await this.getMenuItemTop();
				}
				if(this.timer) return ;
				if(!this.menuHeight) {
					await this.getElRect('u-cate-tab__menu-scroll-view', 'menuHeight');
				}
				setTimeout(() => { // 节流
					this.timer = null;
					// scrollHeight为右边菜单垂直中点位置
					let scrollHeight = e.detail.scrollTop + 1;
                    // console.log(e.detail.scrollTop)
					for (let i = 0; i < this.arr.length; i++) {
						let height1 = this.arr[i];
						let height2 = this.arr[i + 1];
                        // console.log('i', i)
                        // console.log('height1', height1)
                        // console.log('height2', height2)
						// 如果不存在height2，意味着数据循环已经到了最后一个，设置左边菜单为最后一项即可
						if (!height2 || scrollHeight >= height1 && scrollHeight <= height2) {
                            // console.log('scrollHeight', scrollHeight)
                            // console.log('height1', height1)
                            // console.log('height2', height2)
							this.leftMenuStatus(i);
							return ;
						}
					}
				}, 100)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-cate-tab {
		display: flex;
		flex-direction: column;
	}

	.u-cate-tab__wrap {
		flex: 1;
		display: flex;
		flex-direction: row;
		overflow: hidden;
	}

	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 16rpx;
	}

	.u-search-text {
		font-size: 26rpx;
		color: $u-tips-color;
		margin-left: 10rpx;
	}

	.u-cate-tab__view {
		width: 200rpx;
		height: 100%;
	}

	.u-cate-tab__item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}

	.u-cate-tab__item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}

	.u-cate-tab__item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-primary;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.u-cate-tab__view {
		height: 100%;
	}

	.u-cate-tab__right-box {
		flex: 1;
		background-color: rgb(250, 250, 250);
	}

	.u-cate-tab__page-view {
		padding: 16rpx;
	}

	.u-cate-tab__page-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}

	.u-cate-tab__page-item:last-child {
		min-height: 100vh;
	}

	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}

	.item-menu-name {
		font-weight: normal;
		font-size: 24rpx;
		color: $u-main-color;
	}

	.item-container {
		display: flex;
		flex-wrap: wrap;
	}

	.thumb-box {
		width: 33.333333%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 20rpx;
	}

	.item-menu-image {
		width: 120rpx;
		height: 120rpx;
	}
</style>
