<template>
	<view class="u-select">
		<view class="u-select__content">
			<view class="u-select__label" @click="openSelect">
				<slot name="text" :currentLabel="currentLabel">
					<text class="u-select__text" v-if="showOptionsLabel">
						{{ currentLabel }}
					</text>
					<text class="u-select__text" v-else>
						{{ label }}
					</text>
				</slot>
				<slot name="icon">
					<up-icon name="arrow-down" :size="iconSize" :color="iconColor"></up-icon>
				</slot>
			</view>
			<u-overlay
				:show="isOpen"
				@click="overlayClick"
				v-if="overlay"
				:zIndex="zIndex"
				:duration="duration + 50"
				:customStyle="overlayStyle"
				:opacity="overlayOpacity"
				@touchmove.stop.prevent="noop"
			></u-overlay>
			<view class="u-select__options__wrap"
				:style="{ overflowY: 'auto', zIndex: zIndex + 1, left: optionsWrapLeft, right: optionsWrapRight, maxHeight: maxHeight}">
				<view class="u-select__options" v-if="isOpen">
					<slot name="options">
						<view class="u-select__options_item"
							:class="current == item[keyName] ? 'active': ''"
							:key="index" v-for="(item, index) in options"
							@click="selectItem(item)">
							<slot name="optionItem" :item="item">
								<text class="u-select__item_text" :style="{color: itemColor}"> 
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
import { mpMixin } from '../../libs/mixin/mpMixin';
import { mixin } from '../../libs/mixin/mixin';
import { getWindowInfo } from '../../libs/function/index';
export default {
	name:"up-select",
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
			default: '#333333'
		},
		iconColor: {
			type: String,
			default: ''
		},
		iconSize: {
			type: [String],
			default: '13px'
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
      /* #ifdef H5 */
      &:hover {
        cursor: pointer;
      }
      /* #endif */
    }
    .u-select__text {
      margin-right: 2px;
    }
	.u-select__options__wrap {
		margin-bottom: 46px;
		position: absolute;
		top: 20px;
		left: 0;
	}
    .u-select__options {
      min-width: 100px;
	  box-sizing: border-box;
      border-radius: 4px;
      border: 1px solid #f1f1f1;
      background-color: #fff;
      .u-select__options_item {
        padding: 10px 12px;
		box-sizing: border-box;
        width: 100%;
        height: 100%;
        &:hover {
          background-color: #f7f7f7;
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

