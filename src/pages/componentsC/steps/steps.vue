<template>
	<view class="u-page">
		<view class="u-demo-block">
			<text class="u-demo-block__title">基础演示</text>
			<view class="u-demo-block__content">
				<up-steps :current="current1">
					<up-steps-item
					    title="已下单"
					    desc="10:30"
						:itemStyle="{backgroundColor: '#eee'}"
					>
					</up-steps-item>
					<up-steps-item
					    title="已出库"
					    desc="10:35"
					>
					</up-steps-item>
					<up-steps-item
					    title="运输中"
					    desc="11:40"
					>
					</up-steps-item>
				</up-steps>
			</view>
		</view>
		<view class="u-demo-block">
			<text class="u-demo-block__title">显示点类型</text>
			<view class="u-demo-block__content">
				<up-steps
				    :current="1"
				    dot
				>
					<up-steps-item
					    title="已下单"
					    desc="10:30"
					>
					</up-steps-item>
					<up-steps-item
					    title="已出库"
					    desc="10:35"
					>
					</up-steps-item>
					<up-steps-item
					    title="运输中"
					    desc="11:40"
					>
					</up-steps-item>
				</up-steps>
				<up-steps
				    :current="1"
				    dot
					direction="column"
				>
					<up-steps-item
					    title="已下单"
					    desc="10:30"
					>
					</up-steps-item>
					<up-steps-item
					    title="已出库"
					    desc="10:35"
					>
					</up-steps-item>
					<up-steps-item
					    title="运输中"
					    desc="11:40"
					>
					</up-steps-item>
				</up-steps>
			</view>
		</view>
		<view class="u-demo-block">
			<text class="u-demo-block__title">错误状态</text>
			<view class="u-demo-block__content">
				<up-steps :current="1">
					<up-steps-item
					    title="已下单"
					    desc="10:30"
					>
					</up-steps-item>
					<up-steps-item
					    error
					    title="仓库着火"
					    desc="10:35"
					>
					</up-steps-item>
					<up-steps-item
					    title="破产清算"
					    desc="11:40"
					>
					</up-steps-item>
				</up-steps>
			</view>
		</view>
		<view class="u-demo-block">
			<text class="u-demo-block__title">自定义图标</text>
			<view class="u-demo-block__content">
				<up-steps
				    :current="1"
				    activeIcon="checkmark"
				    inactiveIcon="arrow-right"
				>
					<up-steps-item
					    title="已下单"
					    desc="10:30"
					>
					</up-steps-item>
					<up-steps-item
					    title="已出库"
					    desc="10:35"
					>
					</up-steps-item>
					<up-steps-item
					    title="运输中"
					    desc="11:40"
					>
					</up-steps-item>
				</up-steps>
			</view>
		</view>
		<view class="u-demo-block">
			<text class="u-demo-block__title">自定义插槽</text>
			<view class="u-demo-block__content">
				<up-steps :current="1">
					<up-steps-item
					    title="已下单"
					    desc="10:30"
					>
					</up-steps-item>
					<up-steps-item
					    title="已出库"
					    desc="10:35"
					>
					</up-steps-item>
					<up-steps-item
					    title="运输中"
					    desc="11:40"
					>
						<template v-slot:icon>
							<text class="slot-icon">运</text>
						</template>
					</up-steps-item>
				</up-steps>
			</view>
		</view>
		<view class="u-demo-block">
			<text class="u-demo-block__title">自定义颜色</text>
			<view class="u-demo-block__content">
				<up-steps :current="1" activeColor="#3c9cff">
					<up-steps-item
					    title="已下单"
					    desc="10:30"
					>
					</up-steps-item>
					<up-steps-item
					    title="已出库"
					    desc="10:35"
					>
					</up-steps-item>
					<up-steps-item
					    title="运输中"
					    desc="11:40"
					>
					</up-steps-item>
				</up-steps>
			</view>
		</view>
		<view class="u-demo-block">
			<text class="u-demo-block__title">竖向展示</text>
			<view class="u-demo-block__content">
				<up-steps
				    :current="1"
				    direction="column"
				>
					<up-steps-item
					    title="已下单"
					    desc="10:30"
					>
					</up-steps-item>
					<up-steps-item
					    title="已出库"
					    desc="10:35"
					>
					</up-steps-item>
					<up-steps-item
					    title="运输中"
					    desc="11:40"
					>
					</up-steps-item>
				</up-steps>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current1: 1
			}
		},
		onLoad() {
		}
	}
</script>

<style lang="scss">
	.slot-icon {
		width: 21px;
		height: 21px;
		background-color: $u-warning;
		border-radius: 100px;
		font-size: 12px;
		color: #fff;
		line-height: 21px;
		text-align: center;
	}
</style>
