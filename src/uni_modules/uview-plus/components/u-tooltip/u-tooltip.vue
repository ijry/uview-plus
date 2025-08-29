<template>
	<view
		class="u-tooltip"
		:style="[addStyle(customStyle)]"
	>
		<u-overlay
			:show="showTooltip && tooltipTop !== -10000 && overlay"
			customStyle="backgroundColor: rgba(0, 0, 0, 0)"
			@click="overlayClickHandler"
		></u-overlay>
		<view class="u-tooltip__wrapper">
			<view class="u-tooltip__trigger" :id="textId"
				:ref="textId" @click.stop="clickHander"
				@longpress.stop="longpressHandler">
				<slot name="trigger"></slot>
				<text v-if="!$slots['trigger']"
					class="u-tooltip__wrapper__text"
					:userSelect="false"
					:selectable="false"
					:style="{
						color: color,
						backgroundColor: bgColor && showTooltip && tooltipTop !== -10000 ? bgColor : 'transparent'
					}"
				>{{ text }}</text>
			</view>
			<u-transition
				mode="fade"
				:show="showTooltip"
				duration="300"
				:customStyle="{
					position: 'absolute', 
					top: addUnit(tooltipTop, 'px'),
					zIndex: zIndex,
					...tooltipStyleCpu
				}"
			>
				<view
					class="u-tooltip__wrapper__popup"
					:id="tooltipId"
					:ref="tooltipId"
				>
					<view
						class="u-tooltip__wrapper__popup__indicator"
						hover-class="u-tooltip__wrapper__popup__indicator--hover"
						v-if="showCopy || buttons.length"
						:style="[indicatorStyle, {
							width: addUnit(indicatorWidth),
							height: addUnit(indicatorWidth),
							backgroundColor: popupBgColor
						}]"
					>
						<!-- 由于nvue不支持三角形绘制，这里就做一个四方形，再旋转45deg，得到露出的一个三角 -->
					</view>
					<view class="u-tooltip__wrapper__popup__list" :style="{
						backgroundColor: popupBgColor,
						color: color
					}">
						<slot name="content"></slot>
						<template v-if="!$slots['content']">
							<view
								v-if="showCopy"
								class="u-tooltip__wrapper__popup__list__btn"
								hover-class="u-tooltip__wrapper__popup__list__btn--hover"
								:style="{backgroundColor: popupBgColor}"
								@tap="setClipboardData"
							>
								<text
									class="u-tooltip__wrapper__popup__list__btn__text"
								>复制</text>
							</view>
							<u-line
								direction="column"
								color="#8d8e90"
								v-if="showCopy && buttons.length > 0"
								length="18"
							></u-line>
							<block v-for="(item , index) in buttons" :key="index">
								<view
									class="u-tooltip__wrapper__popup__list__btn"
									hover-class="u-tooltip__wrapper__popup__list__btn--hover"
								>
									<text
										class="u-tooltip__wrapper__popup__list__btn__text"
										@tap="btnClickHandler(index)"
									>{{ item }}</text>
								</view>
								<u-line
									direction="column"
									color="#8d8e90"
									v-if="index < buttons.length - 1"
									length="18"
								></u-line>
							</block>
						</template>
					</view>
				</view>
			</u-transition>
		</view>
	</view>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	import { addStyle, addUnit, getPx, guid, toast, sleep, getWindowInfo } from '../../libs/function/index';
	// #ifdef APP-NVUE 
	const dom = uni.requireNativePlugin('dom')
	// #endif
	/**
	 * Tooltip 
	 * @description 
	 * @tutorial https://ijry.github.io/uview-plus/components/tooltip.html
	 * @property {String | Number}	text		 需要显示的提示文字
	 * @property {String | Number}	copyText	 点击复制按钮时，复制的文本，为空则使用text值
	 * @property {String | Number}	size		 文本大小（默认 14 ）
	 * @property {String}			color		 字体颜色（默认 '#606266' ）
	 * @property {String}			bgColor		 弹出提示框时，文本的背景色（默认 'transparent' ）
	 * @property {String}			popupBgColor 弹出提示框的背景色
	 * @property {String}			direction	 弹出提示的方向，top-上方，bottom-下方（默认 'top' ）
	 * @property {String | Number}	zIndex		 弹出提示的z-index，nvue无效（默认 10071 ）
	 * @property {Boolean}			showCopy	 是否显示复制按钮（默认 true ）
	 * @property {Array}			buttons		 扩展的按钮组
	 * @property {Boolean}			overlay		 是否显示透明遮罩以防止触摸穿透（默认 true ）
	 * @property {Object}			customStyle	 定义需要用到的外部样式
	 * 
	 * @event {Function} 
	 * @example 
	 */
	export default {
		name: 'u-tooltip',
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				// 是否展示气泡
				showTooltip: true,
				// 生成唯一id，防止一个页面多个组件，造成干扰
				textId: guid(),
				tooltipId: guid(),
				// 初始时甚至为很大的值，让其移到屏幕外面，为了计算元素的尺寸
				tooltipTop: -10000,
				// 气泡的位置信息
				tooltipInfo: {
					width: 0,
					left: 0
				},
				// 文本的位置信息
				triggerInfo: {
					width: 0,
					left: 0
				},
				// 三角形指示器的样式
				indicatorStyle: {},
				// 气泡在可能超出屏幕边沿范围时，重新定位后，距离屏幕边沿的距离
				screenGap: 12,
				// 三角形指示器的宽高，由于对元素进行了角度旋转，精确计算指示器位置时，需要用到其尺寸信息
				indicatorWidth: 14,
				tooltipStyle: {},
				calcReacted: false
			}
		},
		watch: {
			async propsChange() {
				await this.getElRect()
				// this.getTooltipStyle();
			}
		},
		computed: {
			// 特别处理H5的复制，因为H5浏览器是自带系统复制功能的，在H5环境
			// 当一些依赖参数变化时，需要重新计算气泡和指示器的位置信息
			propsChange() {
				return [this.text, this.buttons]
			},
			// 计算气泡和指示器的位置信息
			tooltipStyleCpu() {
				if (!this.calcReacted) {
					return {}
				}
				const style = {},
					sysInfo = getWindowInfo()
				if (this.direction === 'left') {
					// 右侧显示逻辑
					style.transform = ``
					// 垂直居中对齐
					style.top = '-' + addUnit((this.triggerInfo.height - this.tooltipInfo.height) / 2, 'px')
					style.right = addUnit(this.triggerInfo.width + this.indicatorWidth, 'px')
					this.indicatorStyle = {}
					this.indicatorStyle.right = '-4px'
					this.indicatorStyle.top = addUnit((this.tooltipInfo.height - this.indicatorWidth) / 2, 'px')
				} else if (this.direction === 'right') {
					// 右侧显示逻辑
					style.transform = ``
					// 垂直居中对齐
					style.top = '-' + addUnit((this.triggerInfo.height - this.tooltipInfo.height) / 2, 'px')
					style.left = addUnit(this.triggerInfo.width + this.indicatorWidth, 'px')
					this.indicatorStyle = {}
					this.indicatorStyle.left = '-4px'
					this.indicatorStyle.top = addUnit((this.triggerInfo.height - this.indicatorWidth) / 2, 'px')
				} else if (this.direction === 'top' || this.direction === 'bottom') { 
					style.transform = `translateY(${this.direction === 'top' ? '-100%' : '100%'})`
					if (this.tooltipInfo.width / 2 > this.triggerInfo.left + this.triggerInfo.width / 2 - this.screenGap) {
						this.indicatorStyle = {}
						style.left = `-${addUnit(this.triggerInfo.left - this.screenGap)}`
						this.indicatorStyle.left = addUnit(this.triggerInfo.width / 2 - getPx(style.left) - this.indicatorWidth /
							2, 'px')
					} else if (this.tooltipInfo.width / 2 > sysInfo.windowWidth - this.triggerInfo.right + this.triggerInfo.width / 2 -
						this.screenGap) {
						this.indicatorStyle = {}
						style.right = `-${addUnit(sysInfo.windowWidth - this.triggerInfo.right - this.screenGap)}`
						this.indicatorStyle.right = addUnit(this.triggerInfo.width / 2 - getPx(style.right) - this
							.indicatorWidth / 2)
					} else {
						const left = Math.abs(this.triggerInfo.width / 2 - this.tooltipInfo.width / 2)
						style.left = this.triggerInfo.width > this.tooltipInfo.width ? addUnit(left) : -addUnit(left)
						this.indicatorStyle = {}
					}
					if (this.direction === 'top') {
						style.marginTop = '-10px'
						this.indicatorStyle.bottom = '-4px'
					} else {
						style.marginBottom = '-10px'
						this.indicatorStyle.top = '-4px'
					}
				}
				let styleMerge = {...style, ...this.forcePosition}
				this.tooltipStyle = styleMerge
				return styleMerge
			}
		},
		mounted() {
			this.init()
		},
		emits: ["click"],
		methods: {
			addStyle,
			addUnit,
			async init() {
				await this.getElRect()
				// this.getTooltipStyle();
			},
			// 点击触发事件
			async clickHander() {
				// this.getTooltipStyle();
				if (this.triggerMode == 'click') {
					this.tooltipTop = 0
					this.showTooltip = true
				}
			},
			// 长按触发事件
			async longpressHandler() {
				// this.getTooltipStyle();
				if (this.triggerMode == 'longpress') {
					this.tooltipTop = 0
					this.showTooltip = true
				}
			},
			// 点击透明遮罩
			overlayClickHandler() {
				this.showTooltip = false
			},
			// 点击弹出按钮
			btnClickHandler(index) {
				this.showTooltip = false
				// 如果需要展示复制按钮，此处index需要加1，因为复制按钮在第一个位置
				this.$emit('click', this.showCopy ? index + 1 : index)
			},
			// 查询内容高度
			queryRect(ref) {
				// #ifndef APP-NVUE
				// $uGetRect为uview-plus自带的节点查询简化方法，详见文档介绍：https://ijry.github.io/uview-plus/js/getRect.html
				// 组件内部一般用this.$uGetRect，对外的为uni.$u.getRect，二者功能一致，名称不同
				return new Promise(resolve => {
					this.$uGetRect(`#${ref}`).then(size => {
						resolve(size)
					})
				})
				// #endif

				// #ifdef APP-NVUE
				// nvue下，使用dom模块查询元素高度
				// 返回一个promise，让调用此方法的主体能使用then回调
				return new Promise(resolve => {
					dom.getComponentRect(this.$refs[ref], res => {
						resolve(res.size)
					})
				})
				// #endif
			},
			// 元素尺寸
			getElRect() {
				return new Promise(async(resolve) => {
					// 调用之前，先将指示器调整到屏幕外，方便获取尺寸
					this.showTooltip = true
					this.tooltipTop = -10000
					sleep(500).then(async () => {
						this.tooltipInfo = await this.queryRect(this.tooltipId)
						// 获取气泡尺寸之后，将其隐藏，为了让下次切换气泡显示与隐藏时，有淡入淡出的效果
						this.showTooltip = false
						this.triggerInfo = await this.queryRect(this.textId)
						sleep(500).then(() => {
							this.calcReacted = true
						})
						resolve()
					})
				})
			},
			// 复制文本到粘贴板
			setClipboardData() {
				// 关闭组件
				this.showTooltip = false
				this.$emit('click', 0)
				uni.setClipboardData({
					// 优先使用copyText字段，如果没有，则默认使用text字段当做复制的内容
					data: this.copyText || this.text,
					success: () => {
						this.showToast && toast('复制成功')
					},
					fail: () => {
						this.showToast && toast('复制失败')
					},
					complete: () => {
						this.showTooltip = false
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

	.u-tooltip {
		position: relative;
		@include flex;

		&__wrapper {
			@include flex;
			justify-content: center;
			/* #ifndef APP-NVUE */
			white-space: nowrap;
			/* #endif */

			&__text {
				font-size: 14px;
			}

			&__popup {
				@include flex;
				justify-content: center;

				&__list {
					background-color: #060607;
					color: #FFFFFF;
					position: relative;
					flex: 1;
					border-radius: 5px;
					padding: 0px 0;
					@include flex(row);
					align-items: center;
					overflow: hidden;

					&__btn {
						padding: 11px 13px;

						&--hover {
							background-color: #58595B;
						}

						&__text {
							line-height: 12px;
							font-size: 13px;
							color: #FFFFFF;
						}
					}
				}

				&__indicator {
					position: absolute;
					background-color: #060607;
					width: 14px;
					height: 14px;
					bottom: -4px;
					transform: rotate(45deg);
					border-radius: 2px;
					z-index: -1;

					&--hover {
						background-color: #58595B;
					}
				}
			}
		}
	}
</style>