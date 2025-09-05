<template>
	<up-popup :show="popupShow" mode="bottom" :popup="false"
		:mask="true" :closeable="true" :safe-area-inset-bottom="true"
		close-icon-color="#ffffff" :z-index="uZIndex"
		:maskCloseAble="maskCloseAble" @close="close">
		<view class="up-p-t-30 up-p-l-20 up-m-b-10" v-if="headerDirection =='column'">
			<up-steps v-if="popupShow" dot direction="column" v-model:current="tabsIndex">
				<up-steps-item  v-for="(item, index) in genTabsList"
					@click="tabsIndex = index" :title="item.name"></up-steps-item>
			</up-steps>
		</view>
		<view class="up-p-t-20 up-m-b-10" v-else>
			<up-tabs v-if="popupShow" :list="genTabsList"
				:scrollable="true" v-model:current="tabsIndex" @change="tabsChange" ref="tabs"></up-tabs>
		</view>
		<view class="area-box">
			<view class="u-flex" :class="{ 'change':isChange }"
				:style="{transform: optionsCols == 2 && isChange ? 'translateX(-33.3333333%)' : ''}">
				<template v-for="(levelData, levelIndex) in levelList" :key="levelIndex">
					<view v-if="optionsCols == 2 || levelIndex == tabsIndex" class="area-item"
						:style="{ width: optionsCols == 2 ? '33.33333%' : '750rpx'}">
						<view class="u-padding-10 u-bg-gray" style="height: 100%;">
							<scroll-view :scroll-y="true" style="height: 100%">
								<up-cell-group v-if="levelIndex === 0 || selectedValueIndexs[levelIndex - 1] !== undefined">
									<up-cell v-for="(item,index) in levelData"
										:title="item[labelKey]" :arrow="false"
										:index="index" :key="index"
										@click="levelChange(levelIndex, index)">
										<template v-slot:right-icon>
											<up-icon v-if="selectedValueIndexs[levelIndex] === index"
												size="17" name="checkbox-mark"></up-icon>
										</template>
									</up-cell>
								</up-cell-group>
							</scroll-view>
						</view>
					</view>
				</template>
			</view>
		</view>
		<!-- 添加按钮区域 -->
		<view class="u-cascader-action up-flex up-flex-between">
			<view class="u-padding-20 up-flex-fill">
				<up-button @click="handleCancel" type="default">{{ t("up.common.cancel") }}</up-button>
			</view>
			<view class="u-padding-20 up-flex-fill">
				<up-button @click="handleConfirm" type="primary">{{ t("up.common.confirm") }}</up-button>
			</view>
		</view>
	</up-popup>
</template>

<script>
	/**
	 * u-cascader 通用无限级联选择器
	 * @property {String Number} z-index 弹出时的z-index值（默认1075）
	 * @property {Boolean} mask-close-able 是否允许通过点击遮罩关闭Picker（默认true）
	 * @property {Array} data 级联数据
	 * @property {Array} default-value 默认选中的值
	 * @property {String} valueKey 指定选项的值为选项对象中的哪个属性值
	 * @property {String} labelKey 指定选项标签为选项对象中的哪个属性值
	 * @property {String} childrenKey 指定选项的子选项为选项对象中的哪个属性值
	 * @property {Boolean} autoClose 是否在选择最后一级时自动关闭并触发confirm（默认false）
	 */
	export default {
		name: 'up-cascader',
		props: {
			// 通过双向绑定控制组件的弹出与收起
			show: {
				type: Boolean,
				default: false
			},
			// 级联数据
			data: {
				type: Array,
				default() {
					return [];
				}
			},
			// 默认选中的值
			modelValue: {
				type: Array,
				default() {
					return [];
				}
			},
			// 指定选项的值为选项对象中的哪个属性值
			valueKey: {
				type: String,
				default: 'value'
			},
			// 指定选项标签为选项对象中的哪个属性值
			labelKey: {
				type: String,
				default: 'label'
			},
			// 指定选项的子选项为选项对象中的哪个属性值
			childrenKey: {
				type: String,
				default: 'children'
			},
			// 是否允许通过点击遮罩关闭Picker
			maskCloseAble: {
				type: Boolean,
				default: true
			},
			// 弹出的z-index值
			zIndex: {
				type: [String, Number],
				default: 0
			},
			// 是否在选择最后一级时自动关闭并触发confirm
			autoClose: {
				type: Boolean,
				default: false
			},
			// 选中项目的展示方向direction垂直方向适合文字长度过长
			headerDirection: {
				type: String,
				default: 'row'
			},
			// 选项区域列数，支持1列和2列，默认为2列
			optionsCols: {
				type: [Number],
				default: 2
			}
		},
		data() {
			return {
				// 存储每一级的数据
				levelList: [],
				// 存储每一级选中的索引
				selectedValueIndexs: [],
				tabsIndex: 0,
				popupShow: false,
				// 新增confirmValues用于存储确认的值
				confirmValues: []
			}
		},
		watch: {
			data: {
				handler() {
					this.initLevelList();
				},
				immediate: true
			},
			show() {
				this.popupShow = this.show;
			},
			modelValue: {
				handler() {
					this.init();
				},
				immediate: true
			}
		},
		computed: {
			isChange() {
				return this.tabsIndex > 1;
			},
			genTabsList() {
				let tabsList = [{
					name: "请选择"
				}];
				
				// 根据选中的值动态生成tabs
				for (let i = 0; i < this.selectedValueIndexs.length; i++) {
					if (this.selectedValueIndexs[i] !== undefined && this.levelList[i]) {
						const selectedItem = this.levelList[i][this.selectedValueIndexs[i]];
						if (selectedItem) {
							tabsList[i] = {
								name: selectedItem[this.labelKey]
							};
							// 如果还有下一级，则添加"请选择"
							if (i === this.selectedValueIndexs.length - 1 && 
								selectedItem[this.childrenKey] && 
								selectedItem[this.childrenKey].length > 0) {
								tabsList.push({
									name: "请选择"
								});
							}
						}
					}
				}
				
				return tabsList;
			},
			uZIndex() {
				// 如果用户有传递z-index值，优先使用
				return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
			}
		},
		// 新增confirm事件
		emits: ['update:modelValue', 'change', 'confirm'],
		methods: {
			init() {
				// 初始化选中值
				if (this.modelValue && this.modelValue.length > 0) {
					this.setDefaultValue();
				}
			},
			initLevelList() {
				// 初始化第一级数据
				if (this.data && this.data.length > 0) {
					this.levelList = [this.data];
					this.selectedValueIndexs = [];
				}
			},
			setDefaultValue() {
				// 根据默认值设置选中项
				// 根据modelValue获取indexs给selectedValueIndexs
				this.selectedValueIndexs = [];
				let currentLevelData = this.data;
				
				for (let i = 0; i < this.modelValue.length; i++) {
					const value = this.modelValue[i];
					const index = currentLevelData.findIndex(item => item[this.valueKey] === value);
					
					if (index !== -1) {
						this.selectedValueIndexs.push(index);
						// 更新下一级的数据
						if (currentLevelData[index][this.childrenKey]) {
							currentLevelData = currentLevelData[index][this.childrenKey];
						} else {
							// 如果没有子级数据，则停止处理
							break;
						}
					} else {
						// 如果找不到匹配项，则停止处理
						break;
					}
				}
			},
			close() {
				this.$emit('update:show', false);
			},
			tabsChange(item) {
			},
			levelChange(levelIndex, index) {
				// 设置当前级的选中值
				this.$set(this.selectedValueIndexs, levelIndex, index);
				
				// 清除后续级别的选中值
				for (let i = levelIndex + 1; i < this.selectedValueIndexs.length; i++) {
					this.$set(this.selectedValueIndexs, i, undefined);
				}
				
				// 获取当前选中项
				const currentItem = this.levelList[levelIndex][index];
				
				// 如果有子级数据，则初始化下一级
				if (currentItem && currentItem[this.childrenKey] && currentItem[this.childrenKey].length > 0) {
					// 确保levelList数组足够长
					if (this.levelList.length <= levelIndex + 1) {
						this.levelList.push(currentItem[this.childrenKey]);
					} else {
						this.$set(this.levelList, levelIndex + 1, currentItem[this.childrenKey]);
					}
					// 切换到下一级tab
					this.tabsIndex = levelIndex + 1;
				} else {
					// 没有子级数据，说明是最后一级
					if (this.autoClose) {
						// 如果启用自动关闭，则触发change事件并关闭
						this.emitChange();
					} else {
						// 否则只触发change事件，不关闭
						this.emitChange(false);
					}
				}
			},
			// 修改emitChange方法，增加closePopup参数
			emitChange(closePopup = true) {
				// 构造选中结果
				const result = [];
				for (let i = 0; i < this.selectedValueIndexs.length; i++) {
					if (this.selectedValueIndexs[i] !== undefined && this.levelList[i]) {
						result.push(this.levelList[i][this.selectedValueIndexs[i]][this.valueKey]);
					}
				}
				
				// 更新confirmValues
				this.confirmValues = [...result];
				
				// 触发change事件，返回value数组
				this.$emit('change', this.confirmValues);
				
				// 根据参数决定是否关闭弹窗
				if (closePopup) {
					this.close();
				}
			},
			handleCancel() {
				this.close();
			},
			handleConfirm() {
				// 确认时触发confirm事件
				this.$emit('update:modelValue', this.confirmValues);
				this.$emit('confirm', this.confirmValues);
				this.close();
			}
		}
	}
</script>
<style lang="scss">
	.area-box {
		width: 100%;
		overflow: hidden;
		height: 800rpx;

		>view {
			width: 150%;
			transition: transform 0.3s ease-in-out 0s;
			transform: translateX(0);

			&.change {
				// transform: translateX(-33.3333333%);
			}
		}

		.area-item {
			// width: 750rpx;
			height: 800rpx;
		}
	}
	
	// 添加按钮区域样式
	.u-cascader-action {
		border-top: 1px solid #eee;
	}
</style>