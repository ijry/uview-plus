<template>
	<view class="u-select">
    <view class="u-select__content">
      <view class="u-select__label" @click="openSelect">
        <slot name="text">
          <text class="u-select__text">
            {{ label }}
          </text>
        </slot>
        <slot name="icon">
          <u-icon name="arrow-down" :size="iconSize" :color="iconColor"></u-icon>
        </slot>
      </view>
      <view class="u-select__options"
        :style="{zIndex: zIndex}" v-if="isOpen">
        <slot name="options">
          <view class="u-select__options_item"
            :class="current == item[keyName] ? 'active': ''"
            :key="index" v-for="(item, index) in options"
            @click="selectItem(item)">
            <slot name="optionItem" :item="item">
                <text class="u-select__item_text">
                    {{item.name}}
                </text>
            </slot>
          </view>
        </slot>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
        name:"up-select",
        emits: ['update:current', 'select'],
        props: {
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
        current: {
            type: [String, Number],
            default: ''
        },
        zIndex: {
            type: Number,
            default: 10
        },
        iconColor: {
            type: String,
            default: ''
        },
        iconSize: {
            type: [String],
            default: '13px'
        }
    }   ,
	data() {
		return {
                isOpen: false
			}
		},
    mounted() {
    },
    methods: {
      openSelect() {
        this.isOpen = !this.isOpen
      },
      selectItem(item) {
        this.isOpen = false
        this.$emit('update:current', item[this.keyName])
        this.$emit('select', item)
      }
    }
	}
</script>

<style lang="scss" scoped>
  .u-select__content {
    position: relative;
    .u-select__label {
      display: flex;
      /* #ifdef H5 */
      &:hover {
        cursor: pointer;
      }
      /* #endif */
    }
    .u-select__text {
      margin-right: 2px;
    }
    .u-select__options {
      min-width: 100px;
      border-radius: 4px;
      border: 1px solid #f1f1f1;
      background-color: #fff;
      position: absolute;
      top: 20px;
      left: 0;
      .u-select__options_item {
        padding: 10px 12px;
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
