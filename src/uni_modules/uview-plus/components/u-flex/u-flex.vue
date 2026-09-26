<template>
	<view
	    class="u-flex"
	    :style="[flexStyle]"
	    @tap="clickHandler"
	>
		<slot />
	</view>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	import { addUnit, addStyle, deepMerge } from '../../libs/function/index';
	/**
	 * Flex 通用弹性布局容器
	 * @description 通用 flexbox 容器，跨端同名同默认，作为页面 view 的原生落点
	 * @property {String}			direction	主轴方向 row/column/row-reverse/column-reverse (默认 'row')
	 * @property {String}			justify		主轴对齐 (默认 'flex-start')
	 * @property {String}			align		交叉轴对齐 (默认 'stretch')
	 * @property {Boolean}			wrap		是否换行 (默认 false)
	 * @property {String | Number}	gap			子元素间距，单位任意 (默认 0)
	 * @property {Object}			customStyle	定义需要用到的外部样式
	 * @event {Function} click 组件被点击
	 * @example <up-flex direction="column" gap="16">...</up-flex>
	 */
	export default {
		name: "u-flex",
		mixins: [mpMixin, mixin, props],
		emits: ["click"],
		computed: {
			uJustify() {
				if (this.justify === 'start' || this.justify === 'end') return 'flex-' + this.justify
				return this.justify
			},
			flexStyle() {
				const style = {
					display: 'flex',
					flexDirection: this.direction,
					justifyContent: this.uJustify,
					alignItems: this.align,
					flexWrap: this.wrap ? 'wrap' : 'nowrap'
				}
				if (this.gap && Number(this.gap) !== 0) {
					style.gap = addUnit(this.gap)
				}
				return deepMerge(style, addStyle(this.customStyle))
			}
		},
		methods: {
			clickHandler() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-flex {
		display: flex;
	}
</style>
