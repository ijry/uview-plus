<template>
	<up-popup :show="modelValue" mode="bottom" :popup="false"
		:mask="true" :closeable="true" :safe-area-inset-bottom="true"
		close-icon-color="#ffffff" :z-index="uZIndex"
		:maskCloseAble="maskCloseAble" @close="close">
		<up-tabs v-if="modelValue" :list="genTabsList"
			:scrollable="true" :current="tabsIndex" @change="tabsChange" ref="tabs"></up-tabs>
		<view class="area-box">
			<view class="u-flex" :class="{ 'change':isChange }">
				<view class="area-item">
					<view class="u-padding-10 u-bg-gray" style="height: 100%;">
						<scroll-view :scroll-y="true" style="height: 100%">
							<up-cell-group>
								<up-cell v-for="(item,index) in provinces"
									:title="item.label" :arrow="false"
									:index="index" :key="index"
									@click="provinceChange(index)">
									<template v-slot:right-icon>
										<up-icon v-if="isChooseP&&province===index"
											size="17" name="checkbox-mark"></up-icon>
									</template>
								</up-cell>
							</up-cell-group>
						</scroll-view>
					</view>
				</view>
				<view class="area-item">
					<view class="u-padding-10 u-bg-gray" style="height: 100%;">
						<scroll-view :scroll-y="true" style="height: 100%">
							<up-cell-group v-if="isChooseP">
								<up-cell v-for="(item,index) in citys"
									:title="item.label" :arrow="false"
									:index="index" :key="index"
									@click="cityChange(index)">
									<template v-slot:right-icon>
										<up-icon v-if="isChooseC&&city===index"
											size="17" name="checkbox-mark"></up-icon>
									</template>
								</up-cell>
							</up-cell-group>
						</scroll-view>
					</view>
				</view>
				<view class="area-item">
					<view class="u-padding-10 u-bg-gray" style="height: 100%;">
						<scroll-view :scroll-y="true" style="height: 100%">
							<up-cell-group v-if="isChooseC">
								<up-cell v-for="(item,index) in areas"
									:title="item.label" :arrow="false"
									:index="index" :key="index"
									@click="areaChange(index)">
									<template v-slot:right-icon>
										<up-icon v-if="isChooseA&&area===index"
											size="17" name="checkbox-mark"></up-icon>
									</template>
								</up-cell>
							</up-cell-group>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>
	</up-popup>
</template>

<script>
	import provinces from "../common/province.js";
	import citys from "../common/city.js";
	import areas from "../common/area.js";
	/**
	 * city-select 省市区级联选择器
	 * @property {String Number} z-index 弹出时的z-index值（默认1075）
	 * @property {Boolean} mask-close-able 是否允许通过点击遮罩关闭Picker（默认true）
	 * @property {String} default-region 默认选中的地区，中文形式
	 * @property {String} default-code 默认选中的地区，编号形式
	 */
	export default {
		name: 'u-city-select',
		props: {
			// 通过双向绑定控制组件的弹出与收起
			modelValue: {
				type: Boolean,
				default: false
			},
			// 默认显示的地区，可传类似["河北省", "秦皇岛市", "北戴河区"]
			defaultRegion: {
				type: Array,
				default () {
					return [];
				}
			},
			// 默认显示地区的编码，defaultRegion和areaCode同时存在，areaCode优先，可传类似["13", "1303", "130304"]
			areaCode: {
				type: Array,
				default () {
					return [];
				}
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
			}
		},
		data() {
			return {
				cityValue: "",
				isChooseP: false, //是否已经选择了省
				province: 0, //省级下标
				provinces: provinces,
				isChooseC: false, //是否已经选择了市
				city: 0, //市级下标
				citys: citys[0],
				isChooseA: false, //是否已经选择了区
				area: 0, //区级下标
				areas: areas[0][0],
				tabsIndex: 0,
			}
		},
		mounted() {
			this.init();
		},
		computed: {
			isChange() {
				return this.tabsIndex > 1;
			},
			genTabsList() {
				let tabsList = [{
					name: "请选择"
				}];
				if (this.isChooseP) {
					console.log(this.province)
					tabsList[0]['name'] = this.provinces[this.province]['label'];
					tabsList[1] = {
						name: "请选择"
					};
				}
				if (this.isChooseC) {
					tabsList[1]['name'] = this.citys[this.city]['label'];
					tabsList[2] = {
						name: "请选择"
					};
				}
				if (this.isChooseA) {
					tabsList[2]['name'] = this.areas[this.area]['label'];
				}
				return tabsList;
			},
			uZIndex() {
				// 如果用户有传递z-index值，优先使用
				return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
			}
		},
		emits: ['city-change'],
		methods: {
			init() {
				if (this.areaCode.length == 3) {
					this.setProvince("", this.areaCode[0]);
					this.setCity("", this.areaCode[1]);
					this.setArea("", this.areaCode[2]);
				} else if (this.defaultRegion.length == 3) {
					this.setProvince(this.defaultRegion[0], "");
					this.setCity(this.defaultRegion[1], "");
					this.setArea(this.defaultRegion[2], "");
				};
			},
			setProvince(label = "", value = "") {
				this.provinces.map((v, k) => {
					if (value ? v.value == value : v.label == label) {
						this.provinceChange(k);
					}
				})
			},
			setCity(label = "", value = "") {
				this.citys.map((v, k) => {
					if (value ? v.value == value : v.label == label) {
						this.cityChange(k);
					}
				})
			},
			setArea(label = "", value = "") {
				this.areas.map((v, k) => {
					if (value ? v.value == value : v.label == label) {
						this.isChooseA = true;
						this.area = k;
					}
				})
			},
			close() {
				this.$emit('update:modelValue', false);
			},
			tabsChange(index) {
				this.tabsIndex = index;
			},
			provinceChange(index) {
				this.isChooseP = true;
				this.isChooseC = false;
				this.isChooseA = false;
				this.province = index;
				this.citys = citys[index];
				this.tabsIndex = 1;
			},
			cityChange(index) {
				this.isChooseC = true;
				this.isChooseA = false;
				this.city = index;
				this.areas = areas[this.province][index];
				this.tabsIndex = 2;
			},
			areaChange(index) {
				this.isChooseA = true;
				this.area = index;
				let result = {};
				result.province = this.provinces[this.province];
				result.city = this.citys[this.city];
				result.area = this.areas[this.area];
				this.$emit('city-change', result);
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
				transform: translateX(-33.3333333%);
			}
		}

		.area-item {
			width: 33.3333333%;
			height: 800rpx;
		}
	}
</style>
