<template>
    <view
        class="u-float-button" :style="{
            position: 'fixed',
            top: top,
            bottom: bottom,
            right: right,
        }">
        <view class="u-float-button__main" @click="clickHandler" :style="{
            backgroundColor: backgroundColor,
            color: color,
			display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: width,
            height: height,
            borderRadius: '50%',
            borderColor: borderColor,
        }">
            <slot :showList="showList">
                <up-icon class="cursor-pointer" :class="{'show-list': showList}" name="plus" :color="color"></up-icon>
            </slot>
            <view v-if="showList" class="u-float-button__list" :style="{
                bottom: height
            }">
                <slot name="list">
                    <template :key="index" v-for="(item, index) in list">
                        <view class="u-float-button__item" :style="{
                            backgroundColor: item?.backgroundColor ? item?.backgroundColor : backgroundColor,
                            color: item?.color ? item?.color : color,
							display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: width,
                            height: height,
                            borderRadius: '50%',
                            borderColor: item?.borderColor ? item?.borderColor :  borderColor,
                        }" @click="itemClick(item, index)">
                            <up-icon :name="item.name" :color="item?.color ? item?.color : color"></up-icon>
                        </view>
                    </template>
                </slot>
            </view>
        </view>
    </view>
</template>

<script>
import { mpMixin } from '../../libs/mixin/mpMixin';
import { mixin } from '../../libs/mixin/mixin';
import { addStyle, addUnit, deepMerge } from '../../libs/function/index';
/**
 * FloatButton 悬浮按钮
 * @description 悬浮按钮常用于屏幕右下角点击展开的操作菜单
 * @tutorial https://ijry.github.io/uview-plus/components/floatButton.html
 * @property {String}                backgroundColor      背景颜色
 * @event {Function} click  点击触发事件
 * @example <up-float-button></up-float-button>
 */
export default {
    name: 'u-float-button',
    // #ifdef MP
    mixins: [mpMixin, mixin],
    // #endif
    // #ifndef MP
    mixins: [mpMixin, mixin],
    // #endif
   emits: ['click', 'item-click'],
    computed: {
    },
    props: {
        // 背景颜色
        backgroundColor: {
            type: String,
            default: '#2979ff'
        },
        // 文字颜色
        color: {
            type: String,
            default: '#fff'
        },
        // 宽度
        width: {
            type: String,
            default: '50px'
        },
        // 高度
        height: {
            type: String,
            default: '50px'
        },
        // 边框颜色，默认为空字符串表示无边框
        borderColor: {
            type: String,
            default: ''
        },
        // 右侧偏移量
        right: {
            type: [String, Number],
            default: '30px'
        },
        // 顶部偏移量，未提供默认值，可能需要根据具体情况设置
        top: {
            type: [String, Number],
            default: '',
        },
        // 底部偏移量
        bottom: {
            type: String,
            default: ''
        },
        // 是否为菜单项
        isMenu: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            showList: false
        }
    },
    methods: {
        addStyle,
        clickHandler(e) {
            if (this.isMenu) {
                this.showList = !this.showList
                this.$emit('click', e)
            } else {
                this.$emit('click', e)
            }
        },
        itemClick(item, index) {
            this.$emit('item-click', {
                ...item,
                index
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.u-float-button {
    z-index: 999;
    .show-list {
        transform: rotate(45deg);
    }
    &__list {
        position: absolute;
        bottom: 0px;
        display: flex;
        flex-direction: column;
        >view {
            margin: 5px 0px;
        }
    }
}
</style>
