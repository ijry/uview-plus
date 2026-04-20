<template>
    <view
        class="u-rate"
        :id="elId"
        ref="u-rate"
        :style="[addStyle(customStyle)]"
    >
        <view
            class="u-rate__content"
            @touchmove.stop="touchMove"
            @touchend.stop="touchEnd"
        >
            <view
                class="u-rate__content__item cursor-pointer"
                v-for="(item, index) in Number(count)"
                :key="index"
                :class="[elClass]"
            >
                <view
                    class="u-rate__content__item__icon-wrap"
                    ref="u-rate__content__item__icon-wrap"
                    @tap.stop="clickHandler($event, index + 1)"
                >
                    <up-icon
                        :name="
                            Math.floor(activeIndex) > index
                                ? activeIcon
                                : inactiveIcon
                        "
                        :color="
                            disabled
                                ? disabledColorInner
                                : Math.floor(activeIndex) > index
                                ? activeColorInner
                                : inactiveColorInner
                        "
                        :custom-style="{
                            padding: `0 ${addUnit(gutter / 2)}`,
                        }"
                        :size="size"
                    ></up-icon>
                </view>
                <view
                    v-if="allowHalf"
                    @tap.stop="clickHandler($event, index + 1)"
                    class="u-rate__content__item__icon-wrap u-rate__content__item__icon-wrap--half"
                    :style="[{
                        width: addUnit(rateWidth / 2),
                    }]"
                    ref="u-rate__content__item__icon-wrap"
                >
                    <up-icon
                        :name="
                            Math.ceil(activeIndex) > index
                                ? activeIcon
                                : inactiveIcon
                        "
                        :color="
                            disabled
                                ? disabledColorInner
                                : Math.ceil(activeIndex) > index
                                ? activeColorInner
                                : inactiveColorInner
                        "
                        :custom-style="{
                            padding: `0 ${addUnit(gutter / 2)}`
                        }"
                        :size="size"
                    ></up-icon>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	import { addUnit, addStyle, guid, sleep, range, os } from '../../libs/function/index';
	// #ifdef APP-NVUE
	const dom = weex.requireModule("dom");
	// #endif
	/**
	 * rate 评分
	 * @description 该组件一般用于满意度调查，星型评分的场景
	 * @tutorial https://uview-plus.jiangruyi.com/components/rate.html
	 * @property {String | Number}	value			用于v-model双向绑定选中的星星数量 (默认 1 )
	 * @property {String | Number}	count			最多可选的星星数量 （默认 5 ）
	 * @property {Boolean}			disabled		是否禁止用户操作 （默认 false ）
	 * @property {Boolean}			readonly		是否只读 （默认 false ）
	 * @property {String | Number}	size			星星的大小，单位px （默认 18 ）
	 * @property {String}			inactiveColor	未选中星星的颜色 （默认 '#b2b2b2' ）
	 * @property {String}			activeColor		选中的星星颜色 （默认 '#FA3534' ）
	 * @property {String | Number}	gutter			星星之间的距离 （默认 4 ）
	 * @property {String | Number}	minCount		最少选中星星的个数 （默认 1 ）
	 * @property {Boolean}			allowHalf		是否允许半星选择 （默认 false ）
	 * @property {String}			activeIcon		选中时的图标名，只能为uView的内置图标 （默认 'star-fill' ）
	 * @property {String}			inactiveIcon	未选中时的图标名，只能为uView的内置图标 （默认 'star' ）
	 * @property {Boolean}			touchable		是否可以通过滑动手势选择评分 （默认 'true' ）
	 * @property {Object}			customStyle		组件的样式，对象形式
	 * @event {Function} change 选中的星星发生变化时触发
	 * @example <u-rate :count="count" :value="2"></u-rate>
	 */
	export default {
		name: "u-rate",
		mixins: [mpMixin, mixin, props],
		data() {
			const modelVal = Number(this.modelValue)
			const valueVal = Number(this.value)
			const minCount = Number(this.minCount)
			const defaultActive = Number.isFinite(minCount) ? minCount : 0
			return {
				// 生成一个唯一id，否则一个页面多个评分组件，会造成冲突
				elId: guid(),
				elClass: guid(),
				rateBoxLeft: 0, // 评分盒子左边到屏幕左边的距离，用于滑动选择时计算距离
				// #ifdef VUE3
				activeIndex: Number.isFinite(modelVal) ? modelVal : defaultActive,
				// #endif
				// #ifdef VUE2
				activeIndex: Number.isFinite(valueVal) ? valueVal : defaultActive,
				// #endif
				rateWidth: 0, // 每个星星的宽度
				// 标识是否正在滑动，由于iOS事件上touch比click先触发，导致快速滑动结束后，接着触发click，导致事件混乱而出错
				moving: false,
			};
		},
		watch: {
			// #ifdef VUE3
			modelValue(val) {
				this.activeIndex = this.normalizeActiveIndex(val);
			},
			// #endif
        	// #ifdef VUE2
			value(val) {
				this.activeIndex = this.normalizeActiveIndex(val);
			},
			// #endif
			activeIndex: 'emitEvent'
		},
		computed: {
			disabledColorInner() {
				return this.upThemeVar('--up-disabled-color', '#c8c9cc')
			},
			activeColorInner() {
				return this.activeColor || this.upThemeVar('--up-primary', '#FA3534')
			},
			inactiveColorInner() {
				return this.inactiveColor || this.upThemeVar('--up-tips-color', '#b2b2b2')
			}
		},
		// #ifdef VUE3
		emits: ['update:modelValue', 'change'],
    	// #endif
		methods: {
			addStyle,
			addUnit,
			toNumber(value, fallback = 0) {
				const num = Number(value)
				return Number.isFinite(num) ? num : fallback
			},
			getMinCountValue() {
				return this.toNumber(this.minCount, 0)
			},
			getCountValue() {
				return this.toNumber(this.count, 0)
			},
			normalizeActiveIndex(value) {
				let normalized = this.toNumber(value, this.getMinCountValue())
				const minCount = this.getMinCountValue()
				const count = this.getCountValue()
				if (normalized < minCount) normalized = minCount
				if (count > 0 && normalized > count) normalized = count
				return normalized
			},
			getFallbackRateWidth() {
				const size = parseFloat(this.size) || 18
				const gutter = parseFloat(this.gutter) || 0
				const width = size + gutter
				return width > 0 ? width : 18
			},
			ensureRateMetrics() {
				if (!Number.isFinite(this.rateBoxLeft)) {
					this.rateBoxLeft = 0
				}
				if (!Number.isFinite(this.rateWidth) || this.rateWidth <= 0) {
					this.rateWidth = this.getFallbackRateWidth()
					this.getRateIconWrapRect()
				}
				return Number.isFinite(this.rateWidth) && this.rateWidth > 0
			},
			init() {
				sleep().then(() => {
					this.getRateItemRect();
					this.getRateIconWrapRect();
				})
			},
			// 获取评分组件盒子的布局信息
			async getRateItemRect() {
				await sleep();
				// uView封装的获取节点的方法，详见文档
				// #ifndef APP-NVUE
				this.$uGetRect("#" + this.elId).then((res) => {
					if (res && Number.isFinite(res.left)) {
						this.rateBoxLeft = res.left;
					}
				});
				// #endif
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs["u-rate"], (res) => {
					const left = res && res.size ? res.size.left : NaN
					if (Number.isFinite(left)) {
						this.rateBoxLeft = left;
					}
				});
				// #endif
			},
			// 获取单个星星的尺寸
			getRateIconWrapRect() {
				// uView封装的获取节点的方法，详见文档
				// #ifndef APP-NVUE
				this.$uGetRect("." + this.elClass).then((res) => {
					if (res && Number.isFinite(res.width) && res.width > 0) {
						this.rateWidth = res.width;
					}
				});
				// #endif
				// #ifdef APP-NVUE
				dom.getComponentRect(
					this.$refs["u-rate__content__item__icon-wrap"][0],
					(res) => {
						const width = res && res.size ? res.size.width : NaN
						if (Number.isFinite(width) && width > 0) {
							this.rateWidth = width;
						}
					}
				);
				// #endif
			},
			// 手指滑动
			touchMove(e) {
				// 如果禁止通过手动滑动选择，返回
				if (!this.touchable) {
					return;
				}
				this.preventEvent(e);
				this.ensureRateMetrics();
				const x = e.changedTouches[0].pageX;
				this.getActiveIndex(x);
			},
			// 停止滑动
			touchEnd(e) {
				// 如果禁止通过手动滑动选择，返回
				if (!this.touchable) {
					return;
				}
				this.preventEvent(e);
				this.ensureRateMetrics();
				const x = e.changedTouches[0].pageX;
				this.getActiveIndex(x);
			},
			// 通过点击，直接选中
			clickHandler(e, index) {
				// ios上，moving状态取消事件触发
				if (os() === "ios" && this.moving) {
					return;
				}
				this.preventEvent(e);
				this.ensureRateMetrics();
				let x = 0;
				// 点击时，在nvue上，无法获得点击的坐标，所以无法实现点击半星选择
				// #ifndef APP-NVUE
				x = e.changedTouches[0].pageX;
				// #endif
				// #ifdef APP-NVUE
				// nvue下，无法通过点击获得坐标信息，这里通过元素的位置尺寸值模拟坐标
				x = index * this.rateWidth + this.rateBoxLeft;
				// #endif
				this.getActiveIndex(x,true);
			},
			// 发出事件
			emitEvent() {
				const normalizedValue = this.normalizeActiveIndex(this.activeIndex)
				if (!Number.isFinite(this.activeIndex) || normalizedValue !== this.activeIndex) {
					this.activeIndex = normalizedValue
					return
				}
				// 发出change事件
				this.$emit("change", normalizedValue);
				// 同时修改双向绑定的值
				// #ifdef VUE3
                this.$emit("update:modelValue", normalizedValue);
                // #endif
                // #ifdef VUE2
				this.$emit("input", normalizedValue);
				// #endif
			},
			// 获取当前激活的评分图标
			getActiveIndex(x,isClick = false) {
				if (this.disabled || this.readonly) {
					return;
				}
				if (!this.ensureRateMetrics()) {
					return;
				}
				const count = this.getCountValue()
				if (count <= 0) {
					return;
				}
				if (!Number.isFinite(x)) {
					return;
				}
				// 判断当前操作的点的x坐标值，是否在允许的边界范围内
				const allRateWidth = this.rateWidth * count + this.rateBoxLeft;
				// 如果小于第一个图标的左边界，设置为最小值，如果大于所有图标的宽度，则设置为最大值
				x = range(this.rateBoxLeft, allRateWidth, x) - this.rateBoxLeft
				// 滑动点相对于评分盒子左边的距离
				const distance = x;
				// 滑动的距离，相当于多少颗星星
				let index;
				// 判断是否允许半星
				if (this.allowHalf) {
					index = Math.floor(distance / this.rateWidth);
					// 取余，判断小数的区间范围
					const decimal = distance % this.rateWidth;
					if (decimal <= this.rateWidth / 2 && decimal > 0) {
						index += 0.5;
					} else if (decimal > this.rateWidth / 2) {
						index++;
					}
				} else {
					index = Math.floor(distance / this.rateWidth);
					// 取余，判断小数的区间范围
					const decimal = distance % this.rateWidth;
					// 非半星时，只有超过了图标的一半距离，才认为是选择了这颗星
					if (isClick){
						if (decimal > 0) index++;
					} else {
						if (decimal > this.rateWidth / 2) index++;
					}

				}
				this.activeIndex = this.normalizeActiveIndex(Math.min(index, count));
				// 对最少颗星星的限制
				if (this.activeIndex < this.getMinCountValue()) {
					this.activeIndex = this.getMinCountValue();
				}

				// 设置延时为了让click事件在touchmove之前触发
				setTimeout(() => {
					this.moving = true;
				}, 10);
				// 一定时间后，取消标识为移动中状态，是为了让click事件无效
				setTimeout(() => {
					this.moving = false;
				}, 10);
			},
		},
		mounted() {
			this.init();
		},
	};
</script>

<style lang="scss" scoped>
$u-rate-margin: 0 !default;
$u-rate-padding: 0 !default;
$u-rate-item-icon-wrap-half-top: 0 !default;
$u-rate-item-icon-wrap-half-left: 0 !default;

.u-rate {
    @include flex;
    align-items: center;
    margin: $u-rate-margin;
    padding: $u-rate-padding;
    /* #ifndef APP-NVUE */
    touch-action: none;
    /* #endif */

    &__content {
        @include flex;

		&__item {
		    position: relative;

		    &__icon-wrap {
		        &--half {
		            position: absolute;
		            overflow: hidden;
		            top: $u-rate-item-icon-wrap-half-top;
		            left: $u-rate-item-icon-wrap-half-left;
		        }
		    }
		}
    }
}

.up-icon {
    /* #ifndef APP-NVUE */
    box-sizing: border-box;
    /* #endif */
}
</style>
