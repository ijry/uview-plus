<template>
	<view class="u-select">
		<view :class="['u-select__content', disabled && 'disabled']">
			<view :class="['u-select__label', border && 'u-select__label--border']" :style="selectLabelStyle" @click="labelClick">
				<slot name="text" :currentLabel="currentLabel">
					<text class="u-select__text" :style="{ color: resolvedTextColor }" v-if="showOptionsLabel && currentLabel">
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
			<up-overlay :show="isOpen" @click="overlayClick" v-if="overlay" :zIndex="zIndex" :duration="duration + 50"
				:customStyle="overlayStyle" :opacity="overlayOpacity" @touchmove.stop.prevent="noop"></up-overlay>
			<view class="u-select__arrow" :class="'u-select__arrow--' + optionsPlacement" :style="arrowStyle"
				v-if="isOpen && arrow">
				<view class="u-select__arrow__outer"></view>
				<view class="u-select__arrow__inner"></view>
			</view>
			<view class="u-select__options__wrap" :style="optionsWrapStyle">
				<view class="u-select__options" :style="optionsStyle" v-if="isOpen">
					<slot name="options">
						<view class="u-select__options_item" :class="isSelected(item) ? 'active': ''"
							:style="{ color: itemTextColor(item) }"
							:key="index" v-for="(item, index) in options" @click="selectItem(item)">
							<view class="u-select__options_item__body">
								<slot name="optionItem" :item="item" :selected="isSelected(item)">
									<text class="u-select__item_text" :style="{color: itemTextColor(item)}">
										{{item[labelName]}}
									</text>
								</slot>
							</view>
							<up-icon v-if="isSelected(item)" name="checkbox-mark" size="15px" :color="resolvedActiveColor"></up-icon>
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
				type: [String, Number],
				default: 0.3
			},
			overlayStyle: {
				type: Object,
				default: () => {
					return {}
				}
			},
			// 点击遮罩是否关闭下拉面板
			closeOnClickOverlay: {
				type: Boolean,
				default: true
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
			// 当前选中值，multiple 时传数组
			current: {
				type: [String, Number, Array],
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
			},
			// 下拉面板展开方向：auto 按上下剩余空间自动选择，bottom 固定向下，top 固定向上
			placement: {
				type: String,
				default: 'auto'
			},
			// 是否显示下拉面板指向触发区的三角形指示器
			arrow: {
				type: Boolean,
				default: true
			},
			// 是否多选，多选时 current 为数组且选中后面板不关闭
			multiple: {
				type: Boolean,
				default: false
			},
			// 选中项的文字与勾选图标颜色，默认取主题主色
			activeColor: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				isOpen: false,
				optionsWrapLeft: 'auto',
				optionsWrapRight: 'auto',
				// 展开方向与空间不足时的限高，都在打开时按剩余空间重新计算
				optionsPlacement: 'bottom',
				optionsWrapMaxHeight: ''
			}
		},
		computed: {
			resolvedItemColor() {
				return this.itemColor || this.upThemeVar('--up-main-color', '#303133');
			},
			resolvedActiveColor() {
				return this.activeColor || this.upThemeVar('--up-primary', '#3c9cff');
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
				const style = {};
				if (this.border) {
					style.borderColor = this.upThemeVar('--up-border-color', '#dadbde');
					style.backgroundColor = this.upThemeVar('--up-card-bg-color', '#ffffff');
				}
				// 遮罩可见时把触发区抬到遮罩之上，避免下拉面板亮着而它的锚点被压暗
				if (this.isOpen && this.overlay) {
					style.position = 'relative';
					style.zIndex = this.zIndex + 1;
				}
				return style;
			},
			panelGap() {
				// 显示指示器时把间距留成三角形的高度，让它正好顶住面板边框
				return this.arrow ? 6 : 4;
			},
			optionsWrapStyle() {
				const style = {
					overflowY: 'auto',
					zIndex: this.zIndex + 1,
					left: this.optionsWrapLeft,
					right: this.optionsWrapRight,
					maxHeight: this.optionsWrapMaxHeight || this.maxHeight
				};
				if (this.optionsPlacement === 'top') {
					style.top = 'auto';
					style.bottom = `calc(100% + ${this.panelGap}px)`;
				} else {
					style.top = `calc(100% + ${this.panelGap}px)`;
					style.bottom = 'auto';
				}
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
			arrowStyle() {
				// 指示器画在滚动容器外面，否则会被面板自身的 overflow 裁掉
				const style = {
					zIndex: this.zIndex + 2,
					left: this.optionsWrapLeft === 'auto' ? 'auto' : '12px',
					right: this.optionsWrapLeft === 'auto' ? '12px' : 'auto'
				};
				if (this.optionsPlacement === 'top') {
					style.top = 'auto';
					style.bottom = '100%';
				} else {
					style.top = '100%';
					style.bottom = 'auto';
				}
				return style;
			},
			currentList() {
				if (Array.isArray(this.current)) return this.current;
				if (this.current === '' || this.current === null || typeof this.current === 'undefined') return [];
				return [this.current];
			},
			currentLabel() {
				const names = [];
				this.options.forEach((ele) => {
					if (this.isSelected(ele)) {
						names.push(ele[this.labelName]);
					}
				});
				return names.join('、');
			}
		},
		methods: {
			labelClick() {
				// 触发区被抬到遮罩之上后，遮罩不再代收这次点击，需要自己处理收起
				if (this.isOpen) {
					this.closeSelect();
					return;
				}
				this.openSelect();
			},
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
				if (!this.closeOnClickOverlay) return;
				this.closeSelect();
			},
			isSelected(item) {
				const value = item[this.keyName];
				if (this.multiple) {
					return this.currentList.some((ele) => ele == value);
				}
				// 没有选中值时不能走宽松比较，否则 0 == '' 会把 key 为 0 的项误标成选中
				if (this.current === '' || this.current === null || typeof this.current === 'undefined') {
					return false;
				}
				return this.current == value;
			},
			itemTextColor(item) {
				// 选项颜色是行内绑定的，选中态必须走同一个绑定，否则会被行内样式盖掉
				return this.isSelected(item) ? this.resolvedActiveColor : this.resolvedItemColor;
			},
			selectItem(item) {
				const value = item[this.keyName];
				if (this.multiple) {
					// 多选时保持面板展开，方便连续勾选
					const list = this.currentList.slice();
					const index = list.findIndex((ele) => ele == value);
					if (index > -1) {
						list.splice(index, 1);
					} else {
						list.push(value);
					}
					this.$emit('update:current', list);
					this.$emit('select', item, list);
					return;
				}
				this.isOpen = false;
				this.$emit('update:current', value);
				this.$emit('select', item);
			},
			adjustOptionsWrapPosition() {
				// 每次打开都从"左对齐、向下、不限高"重新算，避免上一次的结果影响这次的测量
				this.optionsWrapLeft = '0px';
				this.optionsWrapRight = 'auto';
				this.optionsWrapMaxHeight = '';
				this.optionsPlacement = this.placement === 'top' ? 'top' : 'bottom';
				this.$nextTick(() => {
					if (!this.isOpen) return;
					let wi = getWindowInfo();
					let windowWidth = wi.windowWidth;
					let windowHeight = wi.windowHeight;
					Promise.all([
						this.$uGetRect('.u-select__label'),
						this.$uGetRect('.u-select__options__wrap')
					]).then(([labelRect, wrapRect]) => {
						if (!this.isOpen || !labelRect || !wrapRect) return;
						if (wrapRect.left + wrapRect.width > windowWidth) {
							// 如果右侧被遮挡，则调整到左侧
							this.optionsWrapLeft = 'auto';
							this.optionsWrapRight = `0px`;
						}
						// boundingClientRect 的坐标以窗口可用区域为原点，直接和 windowHeight 比即可
						const spaceBelow = windowHeight - labelRect.bottom - this.panelGap;
						const spaceAbove = labelRect.top - this.panelGap;
						if (this.placement === 'auto' && wrapRect.height > spaceBelow && spaceAbove > spaceBelow) {
							// 下方放不下且上方更宽裕时翻到触发区上方
							this.optionsPlacement = 'top';
						}
						// 选定方向后仍放不下就限高滚动，否则面板会溢出窗口，并把页面撑高
						const space = this.optionsPlacement === 'top' ? spaceAbove : spaceBelow;
						if (space > 0 && wrapRect.height > space) {
							this.optionsWrapMaxHeight = `${Math.floor(space)}px`;
						}
					});
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

		.u-select__arrow {
			position: absolute;
			width: 0;
			height: 0;
			pointer-events: none;

			.u-select__arrow__outer,
			.u-select__arrow__inner {
				position: absolute;
				left: 0;
				/* 三角形以锚点为中心，左右对齐时都不会贴到面板边角 */
				margin-left: -6px;
				width: 0;
				height: 0;
				border-style: solid;
				border-color: transparent;
			}

			&--bottom {
				.u-select__arrow__outer {
					top: 0;
					border-width: 0 6px 6px 6px;
					border-bottom-color: var(--up-border-color, #f1f1f1);
				}

				.u-select__arrow__inner {
					// 往面板里挪 1px，盖掉面板自身的边框，拼出缺口效果
					top: 1px;
					border-width: 0 6px 6px 6px;
					border-bottom-color: var(--up-card-bg-color, #fff);
				}
			}

			&--top {
				.u-select__arrow__outer {
					bottom: 0;
					border-width: 6px 6px 0 6px;
					border-top-color: var(--up-border-color, #f1f1f1);
				}

				.u-select__arrow__inner {
					bottom: 1px;
					border-width: 6px 6px 0 6px;
					border-top-color: var(--up-card-bg-color, #fff);
				}
			}
		}

		.u-select__options__wrap {
			position: absolute;
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
				display: flex;
				align-items: center;
				box-sizing: border-box;
				width: 100%;
				height: 100%;

				&:hover {
					background-color: var(--up-bg-color, #f7f7f7);
				}

				&.active {
					background-color: var(--up-primary-light, #ecf5ff);
				}

				.u-select__options_item__body {
					flex: 1;
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
