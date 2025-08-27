<template>
    <view class="up-goods-sku"> 
        <view @click="open">
            <slot name="trigger"></slot>
        </view>
        <up-popup
            v-model:show="show"
            mode="bottom"
            :closeable="pageInline ? false : closeable"
            :pageInline="pageInline"
            :border-radius="20"
            @close="close"
        >
            <view class="up-goods-sku-container" :style="{padding: pageInline ? '0px' : ''}">
                <view class="up-goods-sku__header">
                    <slot name="header">
                        <view class="up-goods-sku__header__image">
                            <image :src="goodsInfo.image || goodsInfo.picture" mode="aspectFill"></image>
                        </view>
                        <view class="up-goods-sku__header__info">
                            <view class="up-goods-sku__header__info__price">
                                <text class="up-goods-sku__header__info__price__symbol">¥</text>
                                <text class="up-goods-sku__header__info__price__value">{{ price }}</text>
                            </view>
                            <view class="up-goods-sku__header__info__stock">库存 {{ stock }} 件</view>
                            <view class="up-goods-sku__header__info__selected">已选: {{ selectedSkuText }}</view>
                        </view>
                    </slot>
                </view>
                
                <scroll-view class="up-goods-sku__content" scroll-y>
                    <view v-for="(treeItem, index) in skuTree" :key="index" class="up-goods-sku__content__item">
                        <view class="up-goods-sku__content__item__title">{{ treeItem.label }}</view>
                        <view class="up-goods-sku__content__item__list">
                            <view 
                                v-for="(leafItem, leafIndex) in treeItem.children" 
                                :key="leafIndex"
                                class="up-goods-sku__content__item__list__item"
                                :class="{
                                    'up-goods-sku__content__item__list__item--active': isSelected(treeItem.name, leafItem.id),
                                    'up-goods-sku__content__item__list__item--disabled': isDisabled(treeItem.name, leafItem.id)
                                }"
                                @click="onSkuClick(treeItem.name, leafItem)"
                            >
                                <text>{{ leafItem.name }}</text>
                            </view>
                        </view>
                    </view>
                    
                    <view class="up-goods-sku__content__count">
                        <view class="up-goods-sku__content__count__title">购买数量</view>
                        <view class="up-goods-sku__content__count__control">
                            <up-number-box 
                                v-model="buyNum" 
                                :min="1" 
                                :max="maxBuyNum"
                                :disabled="!canBuy"
                                @change="onNumChange"
                            ></up-number-box>
                        </view>
                    </view>
                </scroll-view>
                
                <view class="up-goods-sku__footer">
                    <up-button 
                        type="primary" 
                        :disabled="!canBuy" 
                        @click="onConfirm"
                    >
                        {{ confirmText }}
                    </up-button>
                </view>
            </view>
        </up-popup>
    </view>
</template>

<script>
	export default {
		name: 'up-goods-sku',
		props: {
			// 商品信息
			goodsInfo: {
				type: Object,
				default: () => ({})
			},
			// SKU树形结构
			skuTree: {
				type: Array,
				default: () => []
			},
			// SKU列表
			skuList: {
				type: Array,
				default: () => []
			},
			// 最大购买数量
			maxBuy: {
				type: Number,
				default: 999
			},
			// 确认按钮文字
			confirmText: {
				type: String,
				default: '确定'
			},
            // 是否显示关闭弹窗按钮
            closeable: {
				type: Boolean,
				default: true
			},
            // 是否页面内联模式
            pageInline: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
                show: false,
				// 已选择的SKU
				selectedSku: {},
				// 购买数量
				buyNum: 1
			}
		},
		computed: {
			// 当前价格
			price() {
				const selectedSkuComb = this.getSelectedSkuComb()
				if (selectedSkuComb) {
					return selectedSkuComb.price || selectedSkuComb.price_fee
				}
				return this.goodsInfo.price || this.goodsInfo.price_fee || 0
			},
			// 当前库存
			stock() {
				const selectedSkuComb = this.getSelectedSkuComb()
				if (selectedSkuComb) {
					return selectedSkuComb.stock || selectedSkuComb.quantity
				}
				return this.goodsInfo.stock || this.goodsInfo.quantity || 0
			},
			// 最大购买数量
			maxBuyNum() {
				const stock = this.stock
				return stock > this.maxBuy ? this.maxBuy : stock
			},
			// 是否可以购买
			canBuy() {
				const selectedSkuCount = Object.keys(this.selectedSku).length
				const skuTreeCount = this.skuTree.length
				return selectedSkuCount === skuTreeCount && this.buyNum > 0 && this.stock > 0
			},
			// 已选SKU文字描述
			selectedSkuText() {
				const selected = []
				Object.keys(this.selectedSku).forEach(key => {
					const value = this.selectedSku[key]
					if (value) {
						this.skuTree.forEach(treeItem => {
							if (treeItem.name === key) {
								treeItem.children.forEach(leafItem => {
									if (leafItem.id === value) {
										selected.push(leafItem.name)
									}
								})
							}
						})
					}
				})
				return selected.join(', ')
			}
		},
		watch: {
		},
        emits: ['open', 'confirm', 'close'],
        created() {
            if (this.pageInline) {
                this.show = true;
            }
		},
		methods: {
			// 判断SKU是否被选中
			isSelected(skuKey, skuValueId) {
				return this.selectedSku[skuKey] === skuValueId
			},
			// 判断SKU是否禁用
			isDisabled(skuKey, skuValueId) {
				// 构造一个临时的已选中SKU对象
				const tempSelected = { ...this.selectedSku, [skuKey]: skuValueId }
				
				// 检查是否还有未选择的SKU维度
				const selectedCount = Object.keys(tempSelected).filter(key => tempSelected[key]).length
				const totalSkuCount = this.skuTree.length
				
				// 如果所有SKU都已选择，则检查组合是否存在
				if (selectedCount === totalSkuCount) {
					return !this.getSkuComb(tempSelected)
				}
				
				// 检查当前选择的SKU是否会导致无法组成有效组合
				for (let i = 0; i < this.skuList.length; i++) {
					const sku = this.skuList[i]
					let match = true
					
					// 检查已选中的SKU是否匹配
					for (const key in tempSelected) {
						if (tempSelected[key] && sku[key] !== tempSelected[key]) {
							match = false
							break
						}
					}
					
					if (match) {
						return false
					}
				}
				
				return true
			},
			// SKU点击事件
			onSkuClick(skuKey, skuValue) {
				// 如果是禁用状态，直接返回
				if (this.isDisabled(skuKey, skuValue.id)) {
					return
				}
				
				// 如果已选中，则取消选中
				if (this.selectedSku[skuKey] === skuValue.id) {
					this.$set(this.selectedSku, skuKey, '')
				} else {
					this.$set(this.selectedSku, skuKey, skuValue.id)
				}
			},
			// 数量改变事件
			onNumChange(e) {
				this.buyNum = e.value
			},
			// 获取选中的SKU组合
			getSelectedSkuComb() {
				return this.getSkuComb(this.selectedSku)
			},
			// 根据已选SKU获取组合信息
			getSkuComb(selectedSku) {
				const selected = { ...selectedSku }
				
				// 过滤掉空值
				Object.keys(selected).forEach(key => {
					if (!selected[key]) {
						delete selected[key]
					}
				})
				
				// 检查是否所有SKU都已选择
				if (Object.keys(selected).length !== this.skuTree.length) {
					return null
				}
				
				// 查找匹配的SKU组合
				for (let i = 0; i < this.skuList.length; i++) {
					const sku = this.skuList[i]
					let match = true
					
					for (const key in selected) {
						if (sku[key] !== selected[key]) {
							match = false
							break
						}
					}
					
					if (match) {
						return sku
					}
				}
				
				return null
			},
			// 重置选择
			reset() {
				this.selectedSku = {}
				this.buyNum = 1
			},
            open() {
                this.show = true;
                this.$emit('open')
            },
			// 关闭弹窗
			close() {
                this.false = true;
				this.$emit('close')
			},
			// 确认选择
			onConfirm() {
				if (!this.canBuy) {
					return
				}
				
				const selectedSkuComb = this.getSelectedSkuComb()
				this.$emit('confirm', {
					sku: selectedSkuComb,
					goodsInfo: this.goodsInfo,
					num: this.buyNum,
					selectedText: this.selectedSkuText
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.up-goods-sku {
		background-color: #fff;
		overflow: hidden;

        .up-goods-sku-container {
            padding: 4rpx 30rpx;
        }
		
		&__header {
			display: flex;
            flex-direction: row;
			padding: 30rpx 0;
			position: relative;
			
			&__image {
				width: 180rpx;
				height: 180rpx;
				border-radius: 10rpx;
				overflow: hidden;
				margin-right: 20rpx;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
			
			&__info {
				flex: 1;
				
				&__price {
					display: flex;
                    flex-direction: row;
					align-items: baseline;
					margin-bottom: 20rpx;
					
					&__symbol {
						font-size: 24rpx;
						color: #fa3534;
						margin-right: 4rpx;
					}
					
					&__value {
						font-size: 36rpx;
						color: #fa3534;
						font-weight: bold;
					}
				}
				
				&__stock {
					font-size: 26rpx;
					color: #999;
					margin-bottom: 20rpx;
				}
				
				&__selected {
					font-size: 26rpx;
					color: #333;
				}
			}
		}
		
		&__content {
			max-height: 600rpx;
			padding: 0 30rpx 30rpx 0;
			
			&__item {
				margin-bottom: 30rpx;
				
				&__title {
					font-size: 28rpx;
					color: #333;
					margin-bottom: 20rpx;
				}
				
				&__list {
					display: flex;
                    flex-direction: row;
					flex-wrap: wrap;
					
					&__item {
						padding: 10rpx 20rpx;
						border: 2rpx solid #eee;
						border-radius: 10rpx;
						margin-right: 20rpx;
						margin-bottom: 20rpx;
						font-size: 26rpx;
						color: #333;
						
						&--active {
							border-color: #fa3534;
							color: #fa3534;
						}
						
						&--disabled {
							color: #ccc;
							border-color: #eee;
						}
					}
				}
			}
			
			&__count {
				display: flex;
                flex-direction: row;
				align-items: center;
				justify-content: space-between;
				margin-top: 20rpx;
				
				&__title {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
		
		&__footer {
			padding: 20rpx 0rpx 40rpx 0;
		}
	}
</style>