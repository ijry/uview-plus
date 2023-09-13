<template>
	<view class="u-drawdown">
		<view
			class="u-dropdown__menu"
			:style="{
				height: $u.addUnit(height)
			}"
			ref="u-dropdown__menu"
		>
			<view
				class="u-dropdown__menu__item"
				v-for="(item, index) in menuList"
				:key="index"
				@tap.stop="clickHandler(item, index)"
			>
				<view class="u-dropdown__menu__item__content">
					<text
						class="u-dropdown__menu__item__content__text"
						:style="[index === current ? activeStyle : inactiveStyle]"
					>{{item.title}}</text>
					<view
						class="u-dropdown__menu__item__content__arrow"
						:class="[index === current && 'u-dropdown__menu__item__content__arrow--rotate']"
					>
						<u-icon
							:name="menuIcon"
							:size="$u.addUnit(menuIconSize)"
						></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="u-dropdown__content">
			<slot />
		</view>
	</view>
</template>

<script>
	import props from './props.js';
	import mpMixin from '../../libs/mixin/mpMixin.js';
	import mixin from '../../libs/mixin/mixin.js';
	/**
	 * Dropdown  
	 * @description 
	 * @tutorial url
	 * @property {String}
	 * @event {Function}
	 * @example
	 */
	export default {
		name: 'u-dropdown',
		mixins: [mixin, props],
		data() {
			return {
				menuList: [],
				current: 0
			}
		},
		computed: {
		
		},
		created() {
			this.children = [];
		},
		emits: ["click"],
		methods: {
			clickHandler(item, index) {
				this.children.map(child => {
					if(child.title === item.title) {
						// this.queryRect('u-dropdown__menu').then(size => {
							child.$emit('click')
							child.setContentAnimate(child.show ? 0 : 300)
							child.show = !child.show
						// })
					} else {
						child.show = false
						child.setContentAnimate(0)
					}
				})
			},
			// 
			queryRect(el) {
				// #ifndef APP-NVUE
				// $uGetRect?uView https://ijry.github.io/uview-plus/.uviewui.com/js/getRect.html
				// this.$uGetRect this.$u.getRect
				return new Promise(resolve => {
					this.$uGetRect(`.${el}`).then(size => {
						resolve(size)
					})
				})
				// #endif
			
				// #ifdef APP-NVUE 
				// promisethen
				return new Promise(resolve => {
					dom.getComponentRect(this.$refs[el], res => {
						resolve(res.size)
					})
				})
				// #endif
			},
		},
	}
</script>

<style lang="scss">
	@import '../../libs/css/components.scss';

	.u-dropdown {

		&__menu {
			@include flex;

			&__item {
				flex: 1;
				@include flex;
				justify-content: center;

				&__content {
					@include flex;
					align-items: center;
				}
			}
		}
	}
</style>
