<template>
	<view
		v-if="inited"
		class="u-transition"
		ref="u-transition"
		@tap="clickHandler"
		:class="classes"
		:style="[mergeStyle]"
		@touchmove="noop"
	>
		<slot />
	</view>
</template>

<script>
import { props } from './props';
import { mpMixin } from '../../libs/mixin/mpMixin';
import { mixin } from '../../libs/mixin/mixin';
import { addStyle } from '../../libs/function/index';
// 组件的methods方法，由于内容较长，写在外部文件中通过mixin引入
import transitionMixin from "./transitionMixin.js";
/**
 * transition  动画组件
 * @description
 * @tutorial
 * @property {String}			show			是否展示组件 （默认 false ）
 * @property {String}			mode			使用的动画模式 （默认 'fade' ）
 * @property {String | Number}	duration		动画的执行时间，单位ms （默认 '300' ）
 * @property {String}			timingFunction	使用的动画过渡函数 （默认 'ease-out' ）
 * @property {Object}			customStyle		自定义样式
 * @event {Function} before-enter	进入前触发
 * @event {Function} enter			进入中触发
 * @event {Function} after-enter	进入后触发
 * @event {Function} before-leave	离开前触发
 * @event {Function} leave			离开中触发
 * @event {Function} after-leave	离开后触发
 * @example
 */
export default {
	name: 'u-transition',
	data() {
		return {
			inited: false, // 是否显示/隐藏组件
			viewStyle: {}, // 组件内部的样式
			status: '', // 记录组件动画的状态
			transitionEnded: false, // 组件是否结束的标记
			display: false, // 组件是否展示
			classes: '', // 应用的类名
		}
	},
	emits: ['click', 'beforeEnter', 'enter', 'afterEnter', 'beforeLeave', 'leave', 'afterLeave'],
	computed: {
	    mergeStyle() {
	        const { viewStyle, customStyle } = this
	        return {
	            // #ifndef APP-NVUE
	            transitionDuration: `${this.duration}ms`,
	            // display: `${this.display ? '' : 'none'}`,
				transitionTimingFunction: this.timingFunction,
	            // #endif
				// 避免自定义样式影响到动画属性，所以写在viewStyle前面
	            ...addStyle(customStyle),
	            ...viewStyle
	        }
	    }
	},
	// 将mixin挂在到组件中，实际上为一个vue格式对象。
	mixins: [mpMixin, mixin, transitionMixin, props],
	watch: {
		show: {
			handler(newVal) {
				// vue和nvue分别执行不同的方法
				// #ifdef APP-NVUE
				newVal ? this.nvueEnter() : this.nvueLeave()
				// #endif
				// #ifndef APP-NVUE
				newVal ? this.vueEnter() : this.vueLeave()
				// #endif
			},
			// 表示同时监听初始化时的props的show的意思
			immediate: true
		}
	}
}
</script>

<style lang="scss" scoped>
/* #ifndef APP-NVUE */
// vue版本动画相关的样式抽离在外部文件
// @use './vue.ani-style.scss' as *;
/**
 * vue版本动画内置的动画模式有如下：
 * fade：淡入
 * zoom：缩放
 * fade-zoom：缩放淡入
 * fade-up：上滑淡入
 * fade-down：下滑淡入
 * fade-left：左滑淡入
 * fade-right：右滑淡入
 * slide-up：上滑进入
 * slide-down：下滑进入
 * slide-left：左滑进入
 * slide-right：右滑进入
 */

 $u-zoom-scale: scale(0.95);

.u-fade-enter-active,
.u-fade-leave-active {
	transition-property: opacity;
}

.u-fade-enter,
.u-fade-leave-to {
	opacity: 0
}

.u-fade-zoom-enter,
.u-fade-zoom-leave-to {
	transform: $u-zoom-scale;
	opacity: 0;
}

.u-fade-zoom-enter-active,
.u-fade-zoom-leave-active {
	transition-property: transform, opacity;
}

.u-fade-down-enter-active,
.u-fade-down-leave-active,
.u-fade-left-enter-active,
.u-fade-left-leave-active,
.u-fade-right-enter-active,
.u-fade-right-leave-active,
.u-fade-up-enter-active,
.u-fade-up-leave-active {
	transition-property: opacity, transform;
}

.u-fade-up-enter,
.u-fade-up-leave-to {
	transform: translate3d(0, 100%, 0);
	opacity: 0
}

.u-fade-down-enter,
.u-fade-down-leave-to {
	transform: translate3d(0, -100%, 0);
	opacity: 0
}

.u-fade-left-enter,
.u-fade-left-leave-to {
	transform: translate3d(-100%, 0, 0);
	opacity: 0
}

.u-fade-right-enter,
.u-fade-right-leave-to {
	transform: translate3d(100%, 0, 0);
	opacity: 0
}

.u-slide-down-enter-active,
.u-slide-down-leave-active,
.u-slide-left-enter-active,
.u-slide-left-leave-active,
.u-slide-right-enter-active,
.u-slide-right-leave-active,
.u-slide-up-enter-active,
.u-slide-up-leave-active {
	transition-property: transform;
}

.u-slide-up-enter,
.u-slide-up-leave-to {
	transform: translate3d(0, 100%, 0)
}

.u-slide-down-enter,
.u-slide-down-leave-to {
	transform: translate3d(0, -100%, 0)
}

.u-slide-left-enter,
.u-slide-left-leave-to {
	transform: translate3d(-100%, 0, 0)
}

.u-slide-right-enter,
.u-slide-right-leave-to {
	transform: translate3d(100%, 0, 0)
}

.u-zoom-enter-active,
.u-zoom-leave-active {
	transition-property: transform
}

.u-zoom-enter,
.u-zoom-leave-to {
	transform: $u-zoom-scale
}
/* #endif */

.u-transition {}
</style>
