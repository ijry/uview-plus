<template>
	<view class="u-select">
		<view :class="['u-select__content', disabled && 'disabled']">
			<view :class="['u-select__label', border && 'u-select__label--border']" :style="selectLabelStyle" @click="openSelect">
				<slot name="text" :currentLabel="currentLabel">
					<text class="u-select__text" :style="{ color: resolvedTextColor }" v-if="showOptionsLabel">
						{{ currentLabel }}
					</text>
					<text class="u-select__text" :style="{ color: resolvedTextColor }" v-else>
						{{ label }}
					</text>
				</slot>
				<slot name="icon">
					<up-icon name="arrow-down" :size="iconSize" :color="resolvedIconColor"></up-icon>
				</slot>
			</view>
			<u-overlay :show="isOpen" @click="overlayClick" v-if="overlay" :zIndex="zIndex" :duration="duration + 50"
				:customStyle="overlayStyle" :opacity="overlayOpacity" @touchmove.stop.prevent="noop"></u-overlay>
			<view class="u-select__options__wrap" :style="optionsWrapStyle">
				<view class="u-select__options" :style="optionsStyle" v-if="isOpen">
					<slot name="options">
						<view class="u-select__options_item" :class="current == item[keyName] ? 'active': ''"
							:style="{ color: resolvedItemColor }"
							:key="index" v-for="(item, index) in options" @click="selectItem(item)">
							<slot name="optionItem" :item="item">
								<text class="u-select__item_text" :style="{color: resolvedItemColor}">
									{{item[labelName]}}
								</text>
							</slot>
						</view>
					</slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mpMixin
	} from '../../libs/mixin/mpMixin';
	import {
		mixin
	} from '../../libs/mixin/mixin';
	import {
		getWindowInfo
	} from '../../libs/function/index';
	export default {
		name: "up-select",
		mixins: [mpMixin, mixin],
		emits: ['update:current', 'select'],
		props: {
			maxHeight: {
				type: String,
				default: '90vh'
			},
			overlay: {
				type: Boolean,
				default: true
			},
			overlayOpacity: {
				type: Number,
				default: 0.01
			},
			overlayStyle: {
				type: Object,
				default: () => {
					return {}
				}
			},
			duration: {
				type: Number,
				default: 300
			},
			label: {
				type: String,
				default: '选项'
			},
			options: {
				type: Array,
				default: () => {
					return []
				}
			},
			keyName: {
				type: String,
				default: 'id'
			},
			labelName: {
				type: String,
				default: 'name'
			},
			showOptionsLabel: {
				type: Boolean,
				default: false
			},
			current: {
				type: [String, Number],
				default: ''
			},
			zIndex: {
				type: Number,
				default: 11000
			},
			itemColor: {
				type: String,
				default: ''
			},
			iconColor: {
				type: String,
				default: ''
			},
			iconSize: {
				type: [String],
				default: '13px'
			},
			// 是否禁用
			disabled: {
				type: Boolean,
				default: false
			},
			// 是否显示触发区边框
			border: {
				type: Boolean,
				default: false
			},
			// 下拉面板宽度，支持 px/rpx/% 等，如 240px 或 300rpx
			optionsWidth: {
				type: [String, Number],
				default: ''
			}
		},
		data() {
			return {
				isOpen: false,
				optionsWrapLeft: 'auto',
				optionsWrapRight: 'auto'
			}
		},
		computed: {
			resolvedItemColor() {
				return this.itemColor || this.upThemeVar('--up-main-color', '#303133');
			},
			resolvedTextColor() {
				return this.upThemeVar('--up-main-color', '#303133');
			},
			resolvedIconColor() {
				return this.iconColor || this.upThemeVar('--up-content-color', '#606266');
			},
			normalizedOptionsWidth() {
				if (this.optionsWidth === '' || this.optionsWidth === null || typeof this.optionsWidth === 'undefined') {
					return '';
				}
				if (typeof this.optionsWidth === 'number') {
					return `${this.optionsWidth}px`;
				}
				return this.optionsWidth;
			},
			selectLabelStyle() {
				if (!this.border) return {};
				return {
					borderColor: this.upThemeVar('--up-border-color', '#dadbde'),
					backgroundColor: this.upThemeVar('--up-card-bg-color', '#ffffff')
				};
			},
			optionsWrapStyle() {
				const style = {
					overflowY: 'auto',
					zIndex: this.zIndex + 1,
					left: this.optionsWrapLeft,
					right: this.optionsWrapRight,
					maxHeight: this.maxHeight
				};
				if (this.normalizedOptionsWidth) {
					style.width = this.normalizedOptionsWidth;
				}
				return style;
			},
			optionsStyle() {
				const style = {};
				if (this.normalizedOptionsWidth) {
					style.width = this.normalizedOptionsWidth;
					style.minWidth = this.normalizedOptionsWidth;
				}
				return style;
			},
			currentLabel() {
				let name = '';
				this.options.forEach((ele) => {
					if (ele[this.keyName] === this.current) {
						name = ele[this.labelName];
					}
				});
				return name;
			}
		},
		methods: {
			openSelect() {
				if (this.disabled) return;
				this.isOpen = true;
				this.$nextTick(() => {
					if (this.isOpen) {
						this.adjustOptionsWrapPosition();
					}
				});
			},
			closeSelect() {
				this.isOpen = false;
			},
			overlayClick() {
				this.isOpen = false;
			},
			selectItem(item) {
				this.isOpen = false;
				this.$emit('update:current', item[this.keyName]);
				this.$emit('select', item);
			},
			adjustOptionsWrapPosition() {
				this.optionsWrapLeft = '0px';
				this.optionsWrapRight = 'auto';
				let wi = getWindowInfo();
				let windowWidth = wi.windowWidth;
				this.$uGetRect('.u-select__options__wrap').then(rect => {
					if (rect.left + rect.width > windowWidth) {
						// 如果右侧被遮挡，则调整到左侧
						this.optionsWrapLeft = 'auto';
						this.optionsWrapRight = `0px`;
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-select__content {
		position: relative;

		.u-select__label {
			display: flex;
			justify-content: space-between;
			align-items: center;

			&--border {
				padding: 8px 10px;
				border-width: 1px;
				border-style: solid;
				border-radius: 4px;
				min-height: 36px;
				box-sizing: border-box;
			}

			/* #ifdef H5 */
			&:hover {
				cursor: pointer;
			}

			/* #endif */
		}

		.u-select__text {
			margin-right: 2px;
		}

		&.disabled {
			opacity: 0.6;
			pointer-events: none;
		}

		.u-select__options__wrap {
			margin-bottom: 46px;
			position: absolute;
			top: calc(100% + 4px);
			left: 0;
		}

		.u-select__options {
			min-width: 100px;
			box-sizing: border-box;
			border-radius: 4px;
			border: 1px solid var(--up-border-color, #f1f1f1);
			background-color: var(--up-card-bg-color, #fff);

			.u-select__options_item {
				padding: 10px 12px;
				box-sizing: border-box;
				width: 100%;
				height: 100%;

				&:hover {
					background-color: var(--up-bg-color, #f7f7f7);
				}

				/* #ifdef H5 */
				&:hover {
					cursor: pointer;
				}

				.u-select__item_text {
					&:hover {
						cursor: pointer;
					}
				}

				/* #endif */
			}
		}
	}
</style>
