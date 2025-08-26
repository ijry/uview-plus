<template>
	<view class="up-coupon" :class="[`up-coupon--${shape}`, `up-coupon--${type}`, `up-coupon--${size}`, {'up-coupon--disabled': disabled}]" 
		:style="[couponStyle]" @click="handleClick">
		<view class="up-coupon__content">
			<!-- 左侧金额区域 -->
			<view class="up-coupon__amount">
				<slot name="unit" :unit="unit" :unitPosition="unitPosition" v-if="unitPosition === 'left'">
					<text class="up-coupon__amount-unit" v-if="unitPosition === 'left'">{{ unit }}</text>
				</slot>
				<slot name="amount" :amount="amount">
					<text class="up-coupon__amount-value">{{ amount }}</text>
				</slot>
				<slot name="unit" :unit="unit" :unitPosition="unitPosition" v-if="unitPosition === 'right'">
					<text class="up-coupon__amount-unit" v-if="unitPosition === 'right'">{{ unit }}</text>
				</slot>
				<slot name="limit" :limit="limit">
					<text class="up-coupon__amount-limit" v-if="limit">{{ limit }}</text>
				</slot>
			</view>
			
			<!-- 中间描述区域 -->
			<view class="up-coupon__info">
				<slot name="title" :title="title">
					<text class="up-coupon__info-title">{{ title }}</text>
				</slot>
				<slot name="desc" :desc="desc">
					<text class="up-coupon__info-desc" v-if="desc">{{ desc }}</text>
				</slot>
				<slot name="time" :time="time">
					<text class="up-coupon__info-time" v-if="time">{{ time }}</text>
				</slot>
			</view>
			
			<!-- 右侧操作区域 -->
			<view class="up-coupon__action u-padding-right-20">
				<slot name="action" :actionText="actionText" :circle="circle">
                    <up-tag type="error" :bgColor="type ? 'transparent' : '#eb433d'"
                        :borderColor="type ? '#eee' : '#eb433d'" borderRadius="6px"
                        size="medium" class="up-coupon__action-text"
                        :shape="circle ? 'circle': 'circle'">{{ actionText }}</up-tag>
				</slot>
			</view>
		</view>
		
		<!-- 红包绳子效果 -->
		<view v-if="shape === 'envelope'" class="up-coupon__rope"></view>
		
		<!-- 默认插槽，可用于添加额外内容 -->
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: 'up-coupon',
		props: {
			// 金额
			amount: {
				type: [String, Number],
				default: ''
			},
			// 金额单位
			unit: {
				type: String,
				default: '￥'
			},
			// 单位位置
			unitPosition: {
				type: String,
				default: 'left'
			},
			// 使用限制
			limit: {
				type: String,
				default: ''
			},
			// 标题
			title: {
				type: String,
				default: '优惠券'
			},
			// 描述
			desc: {
				type: String,
				default: ''
			},
			// 有效期
			time: {
				type: String,
				default: ''
			},
			// 操作按钮文字
			actionText: {
				type: String,
				default: '使用'
			},
			// 形状：coupon-优惠券, envelope-红包, card-卡片
			shape: {
				type: String,
				default: 'coupon'
			},
			// 尺寸：small, medium, large
			size: {
				type: String,
				default: 'medium'
			},
			// 是否圆形按钮
			circle: {
				type: Boolean,
				default: false
			},
			// 是否禁用
			disabled: {
				type: Boolean,
				default: false
			},
			// 背景颜色
			bgColor: {
				type: String,
				default: ''
			},
			// 文字颜色
			color: {
				type: String,
				default: ''
			},
            // 内置背景类型
            type: {
				type: String,
				default: ''
			},
		},
		computed: {
			couponStyle() {
				const style = {};
				if (this.bgColor) style.background = this.bgColor;
				if (this.color) style.color = this.color;
				return style;
			},
			dotCount() {
				// 根据尺寸计算锯齿数量
				const map = {
					small: 8,
					medium: 10,
					large: 12
				};
				return map[this.size] || 10;
			}
		},
		methods: {
			handleClick() {
				if (this.disabled) return;
				this.$emit('click');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.up-coupon {
		position: relative;
		overflow: hidden;
		border-radius: 8rpx;
		background: #ffebf0;
		color: $u-main-color;
		
		&--coupon {
			border-radius: 16rpx;
			overflow: hidden;
			
			&::before {
				content: '';
				position: absolute;
				left: -24rpx;
				top: 50%;
				transform: translateY(-50%);
				width: 48rpx;
				height: 48rpx;
				background-color: #fff;
				border-radius: 50%;
			}
			
			&::after {
				content: '';
				position: absolute;
				right: -24rpx;
				top: 50%;
				transform: translateY(-50%);
				width: 48rpx;
				height: 48rpx;
				background-color: #fff;
				border-radius: 50%;
			}
		}
		
		&--envelope {
			border-radius: 16rpx;
			
			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				height: 20rpx;
				background: repeating-linear-gradient(-45deg, #ffd000, #ffd000 10rpx, #ffa000 10rpx, #ffa000 20rpx);
			}
		}
		
		&--card {
			border-radius: 16rpx;
		}

        width: 100%;
		
		&--small {
			// width: 520rpx;
			height: 160rpx;
		}
		
		&--medium {
			// width: 600rpx;
			height: 180rpx;
		}
		
		&--large {
			// width: 700rpx;
			height: 220rpx;
		}
		
		&--disabled {
			opacity: 0.5;
		}
		
		&__content {
			display: flex;
            flex-direction: row;
			align-items: center;
			justify-content: space-between;
			height: 100%;
			padding: 0 30rpx;
			position: relative;
			z-index: 2;
		}
		
		&__amount {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
            padding-left: 10rpx;
			padding-right: 30rpx;
            border-right: 1px dashed #ccc;
			
			&-unit {
				font-size: 24rpx;
				font-weight: normal;
			}
			
			&-value {
				font-size: 56rpx;
				font-weight: bold;
                color: red;
				line-height: 1;
				margin: 10rpx 0;
			}
			
			&-limit {
				font-size: 24rpx;
				opacity: 0.9;
			}
		}
		
		&__info {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
            padding-left: 30rpx;
			
			&-title {
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 10rpx;
			}
			
			&-desc {
				font-size: 24rpx;
				opacity: 0.9;
				margin-bottom: 10rpx;
			}
			
			&-time {
				font-size: 20rpx;
				opacity: 0.8;
			}
		}
		
		&__action {
			display: flex;
            flex-direction: row;
			align-items: center;
			justify-content: center;
		}
		
		&__dots {
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 30rpx 0;
			z-index: 1;
		}
		
		&__dot {
			width: 32rpx;
			height: 32rpx;
			background-color: #fff;
			border-radius: 50%;
			margin: 0 -16rpx;
			z-index: 3;
		}
		
		&__rope {
			position: absolute;
			top: -40rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 80rpx;
			height: 80rpx;
			background: linear-gradient(to right, #ffd000, #ffa000);
			border-radius: 40rpx 40rpx 0 0;
			z-index: 1;
			
			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: -20rpx;
				width: 20rpx;
				height: 40rpx;
				background: linear-gradient(to bottom, #ffd000, #ffa000);
				border-radius: 10rpx 0 0 10rpx;
			}
			
			&::after {
				content: '';
				position: absolute;
				top: 0;
				right: -20rpx;
				width: 20rpx;
				height: 40rpx;
				background: linear-gradient(to bottom, #ffd000, #ffa000);
				border-radius: 0 10rpx 10rpx 0;
			}
		}
		
		// 不同主题样式
		&--primary {
			background: linear-gradient(90deg, #43afff, #3b8cff);
            color: #fff;
            .up-coupon__amount {
                border-right: 1px dashed #eee;
            }
            .up-coupon__amount-value {
                color: #fff;
            }
		}
		
		&--success {
			background: linear-gradient(90deg, #67dda9, #19be6b);
            color: #fff !important;
            .up-coupon__amount {
                border-right: 1px dashed #eee;
            }
            .up-coupon__amount-value {
                color: #fff;
            }
		}
		
		&--warning {
			background: linear-gradient(90deg, #ff9739, #ff6a39);
            color: #fff;
            .up-coupon__amount {
                border-right: 1px dashed #eee;
            }
            .up-coupon__amount-value {
                color: #fff;
            }
		}
		
		&--error {
			background: linear-gradient(90deg, #ff7070, #ff4747);
            color: #fff;
            .up-coupon__amount {
                border-right: 1px dashed #eee;
            }
            .up-coupon__amount-value {
                color: #fff;
            }
		}
	}
</style>