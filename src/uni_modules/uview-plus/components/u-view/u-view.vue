<template>
    <view
        class="u-view" :class="class" :style="{
            backgroundColor: backgroundColor,
            color: color,
            flexDirection: flexDirection,
            justifyContent: justifyContent,
            alignItems: alignItems,
            flex1: flex1,
            width: width,
            height: height,
            padding: padding,
            margin: margin,
            borderColor: borderColor,
        }">
    </view>
</template>

<script>
import { mpMixin } from '../../libs/mixin/mpMixin';
import { mixin } from '../../libs/mixin/mixin';
import { addStyle, addUnit, deepMerge } from '../../libs/function/index';
/**
 * View 视图
 * @description 对View默认标签的封装
 * @tutorial https://uview-plus.jiangruyi.com/components/view.html
 * @property {String} 					bgColor		背景颜色
 * @event {Function} click  点击触发事件
 * @example <up-view></up-view>
 */
export default {
    name: 'up-view',
    // #ifdef MP
    mixins: [mpMixin, mixin],
    // #endif
    // #ifndef MP
    mixins: [mpMixin, mixin],
    // #endif
	emits: ['click'],
    computed: {
        valueStyle() {}
    },
    props: {
        backgroundColor: '',
        color: '',
        flexDirection: '',
        justifyContent: '',
        alignItems: '',
        flex1: '',
        width: '',
        height: '',
        padding: '',
        margin: '',
        borderColor: ''
    },
    data() {
        return {}
    },
    methods: {
        addStyle,
        clickHandler() {
            this.$emit('click')
        }
    }
}
</script>

<style lang="scss" scoped>
.u-view {
}
</style>
