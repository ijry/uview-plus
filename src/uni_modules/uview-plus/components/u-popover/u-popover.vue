<template>
	<view class="up-popover">
		<up-tooltip
			ref="tooltip"
			:text="text"
			:color="color"
			:bg-color="bgColor"
			:popup-bg-color="popupBgColor"
			:placement="placement"
			:trigger-mode="triggerMode"
			:show="show"
			:z-index="zIndex"
			:force-position="forcePosition"
			:direction="direction"
			@open="onOpen"
			@close="onClose"
			@click="onClick"
		>
			<template #trigger>
				<slot name="trigger"></slot>
			</template>
			<template #content>
				<view class="up-popover__content">
					<slot name="content">
						<text>{{text}}</text>
					</slot>
				</view>
			</template>
		</up-tooltip>
	</view>
</template>

<script>
    import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	/**
	 * popover 气泡弹出框
	 * @description 基于tooltip二次封装的popover组件，用于展示更丰富的内容
	 * @tutorial https://www.uviewui.com/components/popover.html
	 * @property {String | Number}	text			显示的文字内容
	 * @property {String}			color			文字颜色
	 * @property {String}			bgColor			背景颜色
	 * @property {String}			popupBgColor	弹出框背景颜色
	 * @property {String}			placement		弹出框位置 (top, bottom, left, right)
	 * @property {String}			triggerMode		触发方式 (hover, click, manual)
	 * @property {Boolean}			show			是否显示 (manual模式下使用)
	 * @property {Number | String}	zIndex			z-index值
	 * @property {Object}			forcePosition	强制定位 {top, left, right, bottom}
	 * @property {String}			direction		弹出方向 (top, bottom, left, right)
	 * @event {Function}			open			弹出框打开时触发
	 * @event {Function}			close			弹出框关闭时触发
	 * @event {Function}			click			点击触发器时触发
	 * @example <up-popover text="提示内容"><template #trigger><up-button>点击</up-button></template></up-popover>
	 */
	export default {
		name: 'up-popover',
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				
			}
		},
		methods: {
			onOpen() {
				this.$emit('open');
			},
			onClose() {
				this.$emit('close');
			},
			onClick() {
				this.$emit('click');
			},
			// 打开popover
			open() {
				this.$refs.tooltip && this.$refs.tooltip.open();
			},
			// 关闭popover
			close() {
				this.$refs.tooltip && this.$refs.tooltip.close();
			}
		}
	}
</script>

<style lang="scss" scoped>	
	.up-popover {
		
		&__content {
			@include flex;
			align-items: center;
			padding: 12px 16px;
		}
	}
</style>