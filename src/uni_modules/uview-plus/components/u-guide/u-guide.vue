<template>
	<view
		v-if="innerShow && pageList.length"
		class="up-guide"
		:style="{ zIndex: `${zIndex}` }"
		@touchmove.stop.prevent
	>
		<swiper
			class="up-guide__swiper"
			:current="current"
			@change="onSwiperChange"
		>
			<swiper-item v-for="(item, index) in pageList" :key="index">
				<view class="up-guide__page" :style="{ backgroundColor: item.backgroundColor || bgColor }">
					<template v-if="item.image">
						<image class="up-guide__image" :src="item.image" mode="aspectFit"></image>
					</template>
					<view v-else class="up-guide__placeholder">暂无引导图</view>
					<text v-if="item.title" class="up-guide__title">{{ item.title }}</text>
					<text v-if="item.desc" class="up-guide__desc">{{ item.desc }}</text>
				</view>
			</swiper-item>
		</swiper>

		<view class="up-guide__footer">
			<view v-if="indicator" class="up-guide__dots">
				<view
					v-for="(_, dotIndex) in pageList"
					:key="dotIndex"
					class="up-guide__dot"
					:class="{ 'up-guide__dot--active': dotIndex === current }"
				></view>
			</view>
			<view class="up-guide__actions">
				<view v-if="showSkip" class="up-guide__btn up-guide__btn--ghost" @tap="onSkip">
					{{ skipText }}
				</view>
				<view class="up-guide__btn up-guide__btn--primary" @tap="onPrimaryAction">
					{{ isLastPage() ? finishText : nextText }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';

	/**
	 * Guide 首屏引导
	 * @description 全屏首屏引导组件，支持一次性记忆与多页滑动
	 */
	export default {
		name: 'up-guide',
		mixins: [mpMixin, mixin, props],
		emits: ['update:show', 'change', 'skip', 'finish', 'close'],
		data() {
			return {
				innerShow: false,
				current: 0,
				closing: false
			}
		},
		computed: {
			pageList() {
				return Array.isArray(this.list) ? this.list : []
			},
			resolvedStorageKey() {
				return this.storageKey || 'up-guide-default'
			}
		},
		watch: {
			show(value) {
				this.innerShow = !!value
			}
		},
		mounted() {
			this.bootstrap()
		},
		methods: {
			bootstrap() {
				if (!this.pageList.length) {
					if (process.env.NODE_ENV !== 'production') {
						console.warn('[up-guide] list is empty')
					}
					return
				}
				if (this.once && this.readRemembered()) {
					this.innerShow = false
					this.$emit('update:show', false)
					return
				}
				this.innerShow = !!this.show
			},
			isLastPage() {
				return this.current >= this.pageList.length - 1
			},
			onSwiperChange(event) {
				const next = Number(event?.detail?.current ?? 0)
				this.current = next
				this.$emit('change', { current: next })
			},
			onPrimaryAction() {
				if (this.isLastPage()) {
					this.$emit('finish')
					this.close(true)
					return
				}
				this.current += 1
				this.$emit('change', { current: this.current })
			},
			onSkip() {
				this.$emit('skip')
				this.close(true)
			},
			open() {
				this.current = 0
				this.innerShow = true
				this.$emit('update:show', true)
			},
			close(remember = true) {
				if (this.closing) return
				this.closing = true
				if (remember && this.once) {
					this.writeRemembered()
				}
				this.innerShow = false
				this.$emit('update:show', false)
				this.$emit('close')
				this.$nextTick(() => {
					this.closing = false
				})
			},
			reset() {
				try {
					uni.removeStorageSync(this.resolvedStorageKey)
				} catch (error) {}
			},
			readRemembered() {
				try {
					const value = uni.getStorageSync(this.resolvedStorageKey)
					return value === true || value === 1 || value === '1'
				} catch (error) {
					return false
				}
			},
			writeRemembered() {
				try {
					uni.setStorageSync(this.resolvedStorageKey, 1)
				} catch (error) {}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.up-guide {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
	}

	.up-guide__swiper {
		flex: 1;
	}

	.up-guide__page {
		height: 100%;
		padding: 120rpx 40rpx 40rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #ffffff;
	}

	.up-guide__image {
		width: 560rpx;
		height: 560rpx;
	}

	.up-guide__placeholder {
		width: 560rpx;
		height: 560rpx;
		border-radius: 24rpx;
		background: rgba(255, 255, 255, 0.12);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.up-guide__title {
		margin-top: 48rpx;
		font-size: 40rpx;
		font-weight: 600;
	}

	.up-guide__desc {
		margin-top: 18rpx;
		font-size: 28rpx;
		opacity: 0.85;
		text-align: center;
	}

	.up-guide__footer {
		padding: 24rpx 32rpx calc(24rpx + env(safe-area-inset-bottom));
	}

	.up-guide__dots {
		display: flex;
		justify-content: center;
		gap: 12rpx;
		margin-bottom: 26rpx;
	}

	.up-guide__dot {
		width: 14rpx;
		height: 14rpx;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.35);
	}

	.up-guide__dot--active {
		width: 34rpx;
		background: #ffffff;
	}

	.up-guide__actions {
		display: flex;
		gap: 16rpx;
	}

	.up-guide__btn {
		flex: 1;
		height: 84rpx;
		border-radius: 42rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
	}

	.up-guide__btn--ghost {
		color: #ffffff;
		border: 2rpx solid rgba(255, 255, 255, 0.42);
	}

	.up-guide__btn--primary {
		color: #111111;
		background: #ffffff;
		font-weight: 600;
	}
</style>
