<template>
	<up-transition
	    :mode="transitionMode"
	    :show="show"
	>
		<view
		    class="u-alert"
		    :class="[`u-alert--${type}--${effect}`]"
		    @tap.stop="clickHandler"
		    :style="[addStyle(customStyle)]"
		>
			<!-- 左侧图标 -->
			<view
			    class="u-alert__icon"
			    v-if="showIcon"
			>
				<up-icon
				    :name="iconName"
				    size="18"
				    :color="iconColor"
				></up-icon>
			</view>
			<!-- 内容区域 -->
			<view
			    class="u-alert__content"
			    :style="[{
					paddingRight: closable ? '20px' : 0
				}]"
			>
				<!-- 标题 -->
				<text
				    class="u-alert__content__title"
				    v-if="title"
					:style="[{
						fontSize: addUnit(fontSize),
						textAlign: center ? 'center' : 'left'
					}]"
				    :class="[effect === 'dark' ? 'u-alert__text--dark' : `u-alert__text--${type}--light`]"
				>{{ title }}</text>
				<!-- 描述信息 -->
				<text
				    class="u-alert__content__desc"
					v-if="description"
					:style="[{
						fontSize: addUnit(fontSize),
						textAlign: center ? 'center' : 'left'
					}]"
				    :class="[effect === 'dark' ? 'u-alert__text--dark' : `u-alert__text--${type}--light`]"
				>{{ description }}</text>
			</view>
			<!-- 关闭按钮 -->
			<view
			    class="u-alert__close"
			    v-if="closable"
			    @tap.stop="closeHandler"
			>
				<slot name="close">
					<up-icon
					    name="close"
					    :color="iconColor"
					    size="15"
					></up-icon>
				</slot>
			</view>
		</view>
	</up-transition>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	import { addUnit, addStyle } from '../../libs/function/index';
	/**
	 * Alert  警告提示
	 * @description 警告提示，展现需要关注的信息。
	 * @tutorial https://ijry.github.io/uview-plus/components/alertTips.html
	 * 
	 * @property {String}			title       显示的文字 
	 * @property {String}			type        使用预设的颜色 （默认 'warning' ）
	 * @property {String}			description 辅助性文字，颜色比title浅一点，字号也小一点，可选  
	 * @property {Boolean}			closable    关闭按钮(默认为叉号icon图标)  （默认 false ）
	 * @property {Boolean}			showIcon    是否显示左边的辅助图标   （ 默认 false ）
	 * @property {String}			effect      多图时，图片缩放裁剪的模式  （默认 'light' ）
	 * @property {Boolean}			center		文字是否居中  （默认 false ）
	 * @property {String | Number}	fontSize    字体大小  （默认 14 ）
	 * @property {Object}			customStyle	定义需要用到的外部样式
	 * @property {String}			transitionMode 过渡动画模式 （默认 'fade' ）
	 * @property {String | Number}	duration	自动关闭延时(毫秒)，设置为0或负数则不自动关闭 （默认 0 ）
	 * @property {String}			icon		自定义图标名称，优先级高于type默认图标
	 * @property {Boolean}			modelValue/v-model	绑定值，控制是否显示 （默认 true ）
	 * @event    {Function}        click       点击组件时触发
	 * @event    {Function}        close       点击关闭按钮时触发
	 * @event    {Function}        closed      关闭动画结束时触发
	 * @example  <up-alert :title="title"  type = "warning" :closable="closable" :description = "description"></up-alert>
	 */
	export default {
		name: 'u-alert',
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				// 控制组件显示隐藏
				show: true
			}
		},
		computed: {
			// 根据不同的主题类型返回对应的图标颜色
			iconColor() {
				return this.effect === 'light' ? this.type : '#fff'
			},
			// 不同主题对应不同的图标
			iconName() {
				// 如果用户自定义了图标，则优先使用自定义图标
				if (this.icon) return this.icon;
				
				switch (this.type) {
					case 'success':
						return 'checkmark-circle-fill';
						break;
					case 'error':
						return 'close-circle-fill';
						break;
					case 'warning':
						return 'error-circle-fill';
						break;
					case 'info':
						return 'info-circle-fill';
						break;
					case 'primary':
						return 'more-circle-fill';
						break;
					default: 
						return 'error-circle-fill';
				}
			}
		},
		emits: ["click","close", "closed", "update:modelValue"],
		watch: {
			modelValue: {
				handler(newVal) {
					this.show = newVal;
				},
				immediate: true
			},
			show: {
				handler(newVal) {
					this.$emit('update:modelValue', newVal);
					
					// 如果是从显示到隐藏，且启用了自动关闭功能
					if (!newVal && this.duration > 0) {
						this.$emit('closed');
					}
				}
			}
		},
		mounted() {
			// 如果设置了自动关闭时间，则在指定时间后自动关闭
			if (this.duration > 0) {
				setTimeout(() => {
					this.closeHandler();
				}, this.duration);
			}
		},
		methods: {
			addUnit,
			addStyle,
			// 点击内容区域触发click事件
			clickHandler() {
				this.$emit('click')
			},
			// 点击关闭按钮触发close事件并隐藏组件
			closeHandler() {
				this.show = false   
				this.$emit('close');
			}
		}
	}
</script>

<style lang="scss" scoped>

	.u-alert {
		position: relative;
		background-color: $u-primary;
		padding: 8px 10px;
		@include flex(row);
		align-items: center;
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;

		&--primary--dark {
			background-color: $u-primary;
		}

		&--primary--light {
			background-color: #ecf5ff;
		}

		&--error--dark {
			background-color: $u-error;
		}

		&--error--light {
			background-color: #FEF0F0;
		}

		&--success--dark {
			background-color: $u-success;
		}

		&--success--light {
			background-color: #f5fff0;
		}

		&--warning--dark {
			background-color: $u-warning;
		}

		&--warning--light {
			background-color: #FDF6EC;
		}

		&--info--dark {
			background-color: $u-info;
		}

		&--info--light {
			background-color: #f4f4f5;
		}

		&__icon {
			margin-right: 5px;
		}

		&__content {
			@include flex(column);
			flex: 1;

			&__title {
				color: $u-main-color;
				font-size: 14px;
				font-weight: bold;
				color: #fff;
				margin-bottom: 2px;
			}

			&__desc {
				color: $u-main-color;
				font-size: 14px;
				flex-wrap: wrap;
				color: #fff;
			}
		}

		&__title--dark,
		&__desc--dark {
			color: #FFFFFF;
		}

		&__text--primary--light,
		&__text--primary--light {
			color: $u-primary;
		}

		&__text--success--light,
		&__text--success--light {
			color: $u-success;
		}

		&__text--warning--light,
		&__text--warning--light {
			color: $u-warning;
		}

		&__text--error--light,
		&__text--error--light {
			color: $u-error;
		}

		&__text--info--light,
		&__text--info--light {
			color: $u-info;
		}

		&__close {
			position: absolute;
			top: 11px;
			right: 10px;
		}
	}
</style>
