<template>
    <view class="u-picker-wraper">
		<view v-if="hasInput" class="u-picker-input cursor-pointer" @click="onShowByClickInput">
			<slot :value="inputLabel">
			</slot>
			<slot name="trigger" :value="inputLabel">
			</slot>
			<up-input
				v-if="!$slots['default'] && !$slots['$default'] && !$slots['trigger']"
				:readonly="true"
				v-model="inputLabel"
				v-bind="inputPropsInner">
			</up-input>
			<view class="input-cover"></view>
		</view>
		<u-popup
			:show="show || (hasInput && showByClickInput)"
			:mode="popupMode"
			:zIndex="zIndex"
			:bgColor="bgColor"
			:round="round"
			:duration="duration"
			:pageInline="pageInline"
			:overlayOpacity="overlayOpacity"
			@close="closeHandler"
		>
			<view class="u-picker">
				<u-toolbar
					v-if="showToolbar"
					:cancelColor="cancelColor"
					:confirmColor="confirmColor"
					:cancelText="cancelText"
					:confirmText="confirmText"
					:title="title"
					:rightSlot="toolbarRightSlot ? true : false"
					@cancel="cancel"
					@confirm="confirm"
				>
					<template #right>
						<slot name="toolbar-right"></slot>
					</template>
				</u-toolbar>
				<slot name="toolbar-bottom"></slot>
				<picker-view
					class="u-picker__view"
					:indicatorStyle="`height: ${addUnit(itemHeight, 'px')}`"
					:value="innerIndex"
					:immediateChange="immediateChange"
					:style="{
						height: `${addUnit(visibleItemCount * itemHeight, 'px')}`
					}"
					@change="changeHandler"
				>
					<picker-view-column
						v-for="(item, index) in innerColumns"
						:key="index"
						class="u-picker__view__column"
					>
						<view
							v-if="testArray(item)"
							class="u-picker__view__column__item u-line-1"
							:class="[index1 === innerIndex[index] && 'u-picker__view__column__item--selected']"
							v-for="(item1, index1) in item"
							:key="index1"
							:style="{
								height: addUnit(itemHeight, 'px'),
								lineHeight: addUnit(itemHeight, 'px'),
								fontWeight: index1 === innerIndex[index] ? 'bold' : 'normal',
								display: 'block'
							}"
						>{{ getItemText(item1) }}</view>
					</picker-view-column>
				</picker-view>
				<view
					v-if="loading"
					class="u-picker--loading"
				>
					<u-loading-icon mode="circle"></u-loading-icon>
				</view>
			</view>
		</u-popup>
    </view>
</template>

<script>
/**
 * u-picker
 * @description 选择器
 * @property {Boolean}			show				是否显示picker弹窗（默认 false ）
 * @property {Boolean}			showToolbar			是否显示顶部的操作栏（默认 true ）
 * @property {String}			title				顶部标题
 * @property {Array}			columns				对象数组，设置每一列的数据
 * @property {Boolean}			loading				是否显示加载中状态（默认 false ）
 * @property {String | Number}	itemHeight			各列中，单个选项的高度（默认 44 ）
 * @property {String}			cancelText			取消按钮的文字（默认 '取消' ）
 * @property {String}			confirmText			确认按钮的文字（默认 '确定' ）
 * @property {String}			cancelColor			取消按钮的颜色（默认 '#909193' ）
 * @property {String}			confirmColor		确认按钮的颜色（默认 '#3c9cff' ）
 * @property {String | Number}	visibleItemCount	每列中可见选项的数量（默认 5 ）
 * @property {String}			keyName				选项对象中，需要展示的属性键名（默认 'text' ）
 * @property {Boolean}			closeOnClickOverlay	是否允许点击遮罩关闭选择器（默认 false ）
 * @property {Array}			defaultIndex		各列的默认索引
 * @property {Boolean}			immediateChange		是否在手指松开时立即触发change事件（默认 true ）
 * @property {String | Number}	round				圆角值（默认 0）
 * @property {String }	        bgColor				背景色值（默认 '' ）
 * @property {String | Number}	duration			动画时长，单位ms （默认 300 ）
 * @property {String | Number}	overlayDuration		遮罩层动画时长，单位ms （默认 350 ）
 * @event {Function} close		关闭选择器时触发
 * @event {Function} cancel		点击取消按钮触发
 * @event {Function} change		当选择值变化时触发
 * @event {Function} confirm	点击确定按钮，返回当前选择的值
 */
import { props } from './props';
import { mpMixin } from '../../libs/mixin/mpMixin';
import { mixin } from '../../libs/mixin/mixin';
import { addUnit, deepClone, sleep } from '../../libs/function/index';
import test from '../../libs/function/test';
export default {
	name: 'u-picker',
	mixins: [mpMixin, mixin, props],
	data() {
		return {
			// 上一次选择的列索引
			lastIndex: [],
			// 索引值 ，对应picker-view的value
			innerIndex: [],
			// 各列的值
			innerColumns: [],
			// 上一次的变化列索引
			columnIndex: 0,
            showByClickInput: false,
			currentActiveValue: [] //当前用户选中，但是还没确认的值，用户没做change操作时候，点击确认可以默认选中第一个
		}
	},
	watch: {
		// 监听columns参数的变化
		columns: {
			immediate: true,
			deep:true,
			handler(n) {
				this.setColumns(n)
			}
		},
		// 监听默认索引的变化，重新设置对应的值
		defaultIndex: {
			immediate: true,
			deep:true,
			handler(n,o) {
				// 修复uniapp调用子组件直接:defaultIndex="[0]"这样写
				// v-model的值变化时候导致defaultIndexwatch也会执行的问题
				//单纯vue不会出现
				if (!o || n.join("/") != o.join("/")) {
					this.setIndexs(n, true)
				}
			}
		},
		modelValue: {
			immediate: true,
			deep:true,
			handler(n,o) {
				// 修复uniapp调用子组件直接:defaultIndex="[0]"这样写
				// v-model的值变化时候导致defaultIndexwatch也会执行的问题
				//单纯vue不会出现
				if (!o || n.join("/") != o.join("/")) {
					let arr = [];
					if (n != null) {
						n.forEach((element, index) => {
							let currentCols = this.getColumnValues(index)
							if (currentCols && Object.prototype.toString.call(currentCols) === '[object Object]') {
								currentCols.forEach((item, index2) => {
									if (item[this.keyName] == element) {
										arr.push(index2)
									}
								})
							} else {
								currentCols.forEach((item, index2) => {
									if (item == element) {
										arr.push(index2)
									}
								})
							}
						});
						// alert(arr)
						if (arr.length == 0 && this.defaultIndex) {
						} else {
							this.setIndexs(arr, true)
						}
					}
				}
			}
		}
	},
	emits: ['close', 'cancel', 'confirm', 'change', 'update:modelValue', 'update:show'],
    computed: {
		// input的props
		inputPropsInner() {
			return {
				border: this.inputBorder,
				placeholder: this.placeholder,
				disabled: this.disabled,
				disabledColor: this.disabledColor,
				...this.inputProps
			}
		},
		//已选&&已确认的值显示在input上面的文案
		inputLabel() {
			let firstItem = this.innerColumns[0] && this.innerColumns[0][0];
			// //区分是不是对象数组
			if (firstItem && Object.prototype.toString.call(firstItem) === '[object Object]') {
				let res = this.innerColumns[0].filter(item => this.modelValue.includes(item['id']))
				res = res.map(item => item[this.keyName]);
				return res.join("/");

			} else {
				//用户确定的值，才显示到输入框
				return this.modelValue.join("/");
			}
		},
		//已选，待确认的值
		inputValue() {
			let items = this.innerColumns.map((item, index) => item[this.innerIndex[index]])
			let res = []
			//区分是不是对象数组
			if (items[0] && Object.prototype.toString.call(items[0]) === '[object Object]') {
				//对象数组返回属性值集合
				items.forEach(element => {
					res.push(element && element[this.valueName])
				});
			} else {
				//非对象数组返回元素集合
				items.forEach((element, index) => {
					res.push(element)
				});
			}
			return res
		}
    },
	methods: {
		addUnit,
		testArray: test.array,
		onShowByClickInput(){
			if(!this.disabled){
				this.showByClickInput=!this.showByClickInput;
			}
		},
		// 获取item需要显示的文字，判别为对象还是文本
		getItemText(item) {
			if (test.object(item)) {
				return item[this.keyName]
			} else {
				return item
			}
		},
		// 关闭选择器
		closeHandler() {
			if (this.closeOnClickOverlay) {
                if (this.hasInput) {
                    this.showByClickInput = false
                }
				this.setDefault()
				this.$emit('update:show', false)
				this.$emit('close')
			}
		},
		// 点击工具栏的取消按钮
		cancel() {
            if (this.hasInput) {
                this.showByClickInput = false
            }
			this.setDefault()
			this.$emit('update:show', false)
			this.$emit('cancel')
		},
		setDefault() {
			let arr = [0]
			if (this.lastIndex.length == 0) {
				//如果有默认值&&默认值的数组长度是正确的，就用默认值
				if (Array.isArray(this.defaultIndex) && this.defaultIndex.length == this.innerColumns.length) {
					arr = [...this.defaultIndex];
				} else {
					//否则默认都选中第一个
					arr = Array(this.innerColumns.length).fill(0);
				}
			} else {
				arr = deepClone(this.lastIndex)
			}
			this.setLastIndex(arr)
			this.setIndexs(arr)
		},
		// 点击工具栏的确定按钮
		confirm() {
			// 如果用户有没有触发过change
			if (!this.currentActiveValue.length) {
				this.setDefault()
			}
            this.$emit('update:modelValue', this.inputValue)
            if (this.hasInput) {
                this.showByClickInput = false
            }
			this.setLastIndex(this.innerIndex)
			this.$emit('update:show', false)
			this.$emit('confirm', {
				indexs: this.innerIndex,
				value: this.innerColumns.map((item, index) => item[this.innerIndex[index]]),
				values: this.innerColumns
			})
		},
		// 选择器某一列的数据发生变化时触发
		changeHandler(e) {
			const {
				value
			} = e.detail
			let index = 0,
				columnIndex = 0
			//记录用户选中但是还没确认的值
			this.currentActiveValue = value;	
			// 通过对比前后两次的列索引，得出当前变化的是哪一列
			for (let i = 0; i < value.length; i++) {
				let item = value[i]
				if (item !== (this.lastIndex[i] || 0)) { // 把undefined转为合法假值0
					// 设置columnIndex为当前变化列的索引
					columnIndex = i
					// index则为变化列中的变化项的索引
					index = item
					break // 终止循环，即使少一次循环，也是性能的提升
				}
			}
			this.columnIndex = columnIndex
			const values = this.innerColumns
			// 将当前的各项变化索引，设置为"上一次"的索引变化值
			// this.setLastIndex(value)
			this.setIndexs(value)
			//如果是非自带输入框才会在change时候触发v-model绑值的变化
			//否则会非常的奇怪，用户未确认，值就变了
			// if (!this.hasInput) {
			// 	this.$emit('update:modelValue', this.inputValue)
			// }
			
			this.$emit('change', {
				// #ifndef MP-WEIXIN || MP-LARK
				// 微信小程序不能传递this，会因为循环引用而报错
				// picker: this,
				// #endif
				value: this.innerColumns.map((item, index) => item[value[index]]),
				index,
				indexs: value,
				// values为当前变化列的数组内容
				values,
				columnIndex
			})
		},
		// 设置index索引，此方法可被外部调用设置
		setIndexs(index, setLastIndex) {
			this.innerIndex = deepClone(index)
			if (setLastIndex) {
				this.setLastIndex(index)
			}
		},
		// 记录上一次的各列索引位置
		setLastIndex(index) {
			// 当能进入此方法，意味着当前设置的各列默认索引，即为“上一次”的选中值，需要记录，是因为changeHandler中
			// 需要拿前后的变化值进行对比，得出当前发生改变的是哪一列
			this.lastIndex = deepClone(index)
		},
		// 设置对应列选项的所有值
		setColumnValues(columnIndex, values) {
			// 替换innerColumns数组中columnIndex索引的值为values，使用的是数组的splice方法
			this.innerColumns.splice(columnIndex, 1, values)
            // 替换完成之后将修改列之后的已选值置空
			this.setLastIndex(this.innerIndex.slice(0, columnIndex))
			// 拷贝一份原有的innerIndex做临时变量，将大于当前变化列的所有的列的默认索引设置为0
			let tmpIndex = deepClone(this.innerIndex)
			for (let i = 0; i < this.innerColumns.length; i++) {
				if (i > this.columnIndex) {
					tmpIndex[i] = 0
				}
			}
			// 一次性赋值，不能单个修改，否则无效
			this.setIndexs(tmpIndex)
		},
		// 获取对应列的所有选项
		getColumnValues(columnIndex) {
			// 进行同步阻塞，因为外部得到change事件之后，可能需要执行setColumnValues更新列的值
			// 索引如果在外部change的回调中调用getColumnValues的话，可能无法得到变更后的列值，这里进行一定延时，保证值的准确性
			(async () => {
				await sleep()
			})()
			return this.innerColumns[columnIndex]
		},
		// 设置整体各列的columns的值
		setColumns(columns) {
			// console.log(columns)
			this.innerColumns = deepClone(columns)
			// 如果在设置各列数据时，没有被设置默认的各列索引defaultIndex，那么用0去填充它，数组长度为列的数量
			if (this.innerIndex.length === 0) {
				this.innerIndex = new Array(columns.length).fill(0)
			}
		},
		// 获取各列选中值对应的索引
		getIndexs() {
			return this.innerIndex
		},
		// 获取各列选中的值
		getValues() {
			// 进行同步阻塞，因为外部得到change事件之后，可能需要执行setColumnValues更新列的值
			// 索引如果在外部change的回调中调用getValues的话，可能无法得到变更后的列值，这里进行一定延时，保证值的准确性
			(async () => {
				await sleep()
			})()
			return this.innerColumns.map((item, index) => item[this.innerIndex[index]])
		}
	},
}
</script>

<style lang="scss" scoped>

	.u-picker {
		position: relative;
		&-input {
			position: relative;
			.input-cover {
				opacity: 0;
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				z-index:1;
			}
		}
		&__view {

			&__column {
				@include flex;
				flex: 1;
				justify-content: center;

				&__item {
					@include flex;
					justify-content: center;
					align-items: center;
					font-size: 16px;
					text-align: center;
					/* #ifndef APP-NVUE */
					display: block;
					/* #endif */
					color: $u-main-color;

					&--disabled {
						/* #ifndef APP-NVUE */
						cursor: not-allowed;
						/* #endif */
						opacity: 0.35;
					}
				}
			}
		}

		&--loading {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			@include flex;
			justify-content: center;
			align-items: center;
			background-color: rgba(255, 255, 255, 0.87);
			z-index: 1000;
		}
	}
</style>
