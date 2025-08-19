<template>
	<view class="u-city-locate">
		<up-index-list :indexList="indexList">
			<template #header>
				<view class="u-current-city-wrap">
					<view class="u-current-city-title">{{ t("up.cityLocate.locateCity") }}</view>
					<view class="u-current-city-item" @tap="location">
						<view class="u-location-city">{{locationCity}}</view>
					</view>
				</view>
			</template>
			<template :key="index" v-for="(item, index) in cityList">
				<!-- #ifdef APP-NVUE -->
				<up-index-anchor :text="indexList[index]"></up-index-anchor>
				<!-- #endif -->
				<up-index-item>
					<!-- #ifndef APP-NVUE -->
					<up-index-anchor :text="indexList[index]"></up-index-anchor>
					<!-- #endif -->
					<view class="hot-city-list" v-if="index == 0">
						<view class="" v-for="(item1, index1) in item" @tap="selectedCity(item1)">
							<view class="hot-city-item">{{ item1[nameKey] }}</view>
						</view>
					</view>
					<view v-else class="item-list" v-for="(item1, index1) in item" :key="index1">
						<view class="list__item" @tap="selectedCity(item1)">
							<text class="list__item__city-name">{{item1[nameKey]}}</text>
						</view>
						<up-line></up-line>
					</view>
				</up-index-item>
			</template>
			<template #footer>
				<view class="u-safe-area-inset--bottom">
					<text class="list__footer"></text>
				</view>
			</template>
		</up-index-list>
	</view>
</template>

<script>
	import { t } from '../../libs/i18n'
	export default{
		name: 'u-city-locate',
		props:{
			indexList: {
				type: Array,
				default: ['🔥']
			},
			cityList:{
				type: Array,
				default: () => {
					return [
						[{
							name: '北京',
							value: 'beijing'
						},
						{
							name: '上海',
							value: 'shanghai'
						},
						{
							name: '广州',
							value: 'guangzhou'
						},
						{
							name: '深圳',
							value: 'shenzhen'
						},
						{
							name: '杭州',
							value: 'hangzhou'
						}]
					]
				}
			},
			locationType: {
				type: String,
				default: 'wgs84'
			},
			currentCity: {
				type: String,
				default: ''
			},
			nameKey: {
				type: String,
				default: 'name'
			}
		},
		computed:{
		},
		watch:{
			currentCity(val) {
				this.locationCity = val;
			}
		},
		data(){
			return{
				locationCity: t("up.cityLocate.locating") + '....'
			}
		},
		emits: ['location-success', 'select-city'],
		methods:{
			t,
			// 获取城市
			selectedCity(city){
				this.locationCity = city[this.nameKey];
				this.$emit('select-city', {
					locationCity: this.locationCity
				});
			},
			// 定位操作
			location(){
				let That = this;
				uni.getLocation({
				    type: this.locationType,
					geocode:true,
				    success(res){
						console.log(res);
						That.locationCity = res.address && res.address.city;
						That.$emit('location-success', {
							...res,
							locationCity: That.locationCity
						});
				    },
					fail(){
						That.locationCity = t("up.cityLocate.fail");
					}
				});
			},
		},
		// 页面挂载后进行异步操作
		created(){
		},
		mounted(){
			this.location();
		}
	}
</script>

<style lang="scss">
	.list__item {
		padding: 8px 1px;
	}
	.u-current-city-title {
		color: grey;
		margin-bottom: 5px;
	}
	.u-current-city-item {
		height: 30px;
	}
	.hot-city-list {
		display: flex !important;
		flex-direction: row !important;
		padding: 12px 0;
		.hot-city-item {
			padding: 6px 12px;
			margin: 5px;
			border: 1px solid #ededed;
		}
	}
</style>
