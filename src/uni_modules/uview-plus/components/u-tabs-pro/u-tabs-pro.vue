<template>
	<view class="u-tabs-pro" :class="customClass" :style="customStyle">
		<up-tabs
			:list="safeList"
			:keyName="keyName"
			:current="innerCurrent"
			:lineColor="resolvedLineColor"
			:activeStyle="activeStyle"
			:inactiveStyle="inactiveStyle"
			:lineWidth="lineWidth"
			:lineHeight="lineHeight"
			:lineBgSize="lineBgSize"
			:itemStyle="itemStyle"
			:scrollable="scrollable"
			:duration="Number(duration)"
			:iconStyle="iconStyle"
			:shapeMode="shapeMode"
			@update:current="updateCurrent"
			@click="clickHandler"
			@longPress="longPressHandler"
			@change="changeHandler"
		>
			<template v-if="$slots.left" #left>
				<slot name="left" />
			</template>
			<template v-if="$slots.icon" #icon="scope">
				<slot name="icon" :item="scope.item" :keyName="scope.keyName" :index="scope.index" />
			</template>
			<template v-if="$slots.tab || $slots.content" #content="scope">
				<slot name="tab" :item="scope.item" :keyName="scope.keyName" :index="scope.index">
					<slot name="content" :item="scope.item" :keyName="scope.keyName" :index="scope.index" />
				</slot>
			</template>
			<template v-if="$slots.right" #right>
				<slot name="right" />
			</template>
		</up-tabs>
		<view
			v-if="showContent"
			class="u-tabs-pro__content"
			:class="contentClass"
			:style="contentStyle"
		>
			<slot
				:current="innerCurrent"
				:index="innerCurrent"
				:item="currentItem"
				:value="currentValue"
				:list="safeList"
			/>
		</view>
	</view>
</template>

<script>
	import { mpMixin } from '../../libs/mixin/mpMixin'
	import { mixin } from '../../libs/mixin/mixin'

	export default {
		name: 'u-tabs-pro',
		mixins: [mpMixin, mixin],
		props: {
			list: {
				type: Array,
				default: () => []
			},
			keyName: {
				type: String,
				default: 'name'
			},
			current: {
				type: [Number, String],
				default: 0
			},
			contentMode: {
				type: String,
				default: 'static'
			},
			lineColor: {
				type: String,
				default: ''
			},
			activeStyle: {
				type: [String, Object],
				default: () => ({})
			},
			inactiveStyle: {
				type: [String, Object],
				default: () => ({})
			},
			lineWidth: {
				type: [String, Number],
				default: 20
			},
			lineHeight: {
				type: [String, Number],
				default: 3
			},
			lineBgSize: {
				type: String,
				default: 'cover'
			},
			itemStyle: {
				type: [String, Object],
				default: () => ({ height: '44px' })
			},
			scrollable: {
				type: Boolean,
				default: true
			},
			duration: {
				type: [Number, String],
				default: 300
			},
			iconStyle: {
				type: [String, Object],
				default: () => ({})
			},
			shapeMode: {
				type: String,
				default: ''
			},
			showContent: {
				type: Boolean,
				default: true
			},
			contentClass: {
				type: String,
				default: ''
			},
			contentStyle: {
				type: [String, Object, Array],
				default: ''
			},
			bindIndexRef: {
				type: String,
				default: ''
			}
		},
		emits: ['click', 'longPress', 'change', 'update:current'],
		data() {
			return {
				innerCurrent: 0
			}
		},
		computed: {
			safeList() {
				return Array.isArray(this.list) ? this.list : []
			},
			currentItem() {
				return this.safeList[this.innerCurrent] || null
			},
			currentValue() {
				return this.currentItem ? this.currentItem[this.keyName] : undefined
			},
			resolvedLineColor() {
				return this.lineColor || undefined
			}
		},
		watch: {
			current: {
				immediate: true,
				handler(value) {
					this.innerCurrent = this.normalizeCurrent(value)
				}
			},
			list: {
				deep: true,
				handler() {
					const nextCurrent = this.normalizeCurrent(this.innerCurrent)
					if (nextCurrent !== this.innerCurrent) {
						this.innerCurrent = nextCurrent
						this.$emit('update:current', nextCurrent)
					}
				}
			}
		},
		methods: {
			normalizeCurrent(value) {
				const parsed = Number(value)
				const nextValue = Number.isFinite(parsed) ? parsed : 0
				const maxIndex = Math.max(this.safeList.length - 1, 0)
				return Math.min(Math.max(nextValue, 0), maxIndex)
			},
			updateCurrent(value) {
				const nextCurrent = this.normalizeCurrent(value)
				this.innerCurrent = nextCurrent
				this.$emit('update:current', nextCurrent)
			},
			clickHandler(item, index) {
				this.$emit('click', item, index)
			},
			longPressHandler(item, index) {
				this.$emit('longPress', item, index)
			},
			changeHandler(item, index) {
				this.updateCurrent(index)
				this.$emit('change', item, index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-tabs-pro {
		width: 100%;

		&__content {
			width: 100%;
		}
	}
</style>
