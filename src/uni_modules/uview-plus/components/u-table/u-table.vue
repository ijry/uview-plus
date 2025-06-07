<template>
	<view class="u-table" :style="[tableStyle]">
		<template v-if="show">
			<slot />
		</template>
	</view>
</template>

<script>
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	/**
	 * Table 表格 
	 * @description 表格组件一般用于展示大量结构化数据的场景 本组件标签类似HTML的table表格，由table、tr、th、td四个组件组成
	 * @tutorial https://ijry.github.io/uview-plus/components/table.html
	 * @property {String} border-color 表格边框的颜色（默认#e4e7ed）
	 * @property {String} bg-color 表格的背景颜色（默认#ffffff）
	 * @property {String} align 单元格的内容对齐方式，作用类似css的text-align（默认center）
	 * @property {String} padding 单元格的内边距，同css的padding写法（默认10rpx 0）
	 * @property {String Number} font-size 单元格字体大小，单位rpx（默认28）
	 * @property {String} color 单元格字体颜色（默认#606266）
	 * @property {Object} th-style th单元格的样式，对象形式(将th所需参数放在table组件，是为了避免每一个th组件要写一遍）
	 * @event {Function} click 点击组件时触发
	 * @event {Function} close 点击关闭按钮时触发
	 * @example <u-table><u-tr><u-th>学校</u-th </u-tr> <u-tr><u-td>浙江大学</u-td> </u-tr> <u-tr><u-td>清华大学</u-td> </u-tr></u-table>
	 */
	export default {
		name: 'u-table',
		mixins: [mpMixin, mixin, props],
		props: {
			borderColor: {
				type: String,
				default: '#e4e7ed'
			},
			align: {
				type: String,
				default: 'center'
			},
			// td的内边距
			padding: {
				type: String,
				default: '5px 3px'
			},
			// 字体大小
			fontSize: {
				type: [String],
				default: '14px'
			},
			// 字体颜色
			color: {
				type: String,
				default: '#606266'
			},
			// th的自定义样式
			thStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			// table的背景颜色
			bgColor: {
				type: String,
				default: '#ffffff'
			}
		},
		data() {
			return {
				show: true
			}
		},
		watch: {
			align() {
				this.change();
			},
			borderColor() {
				this.change();
			}
		},
		computed: {
			tableStyle() {
				let style = {};
				style.borderLeft = `solid 1px ${this.borderColor}`;
				style.borderTop = `solid 1px ${this.borderColor}`;
				style.backgroundColor = this.bgColor;;
				return style;
			}
		},
		methods: {
			change() {
				this.show = false;
				this.$nextTick(() => {
					this.show = true;
				});
				// this.$forceUpdate();
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
