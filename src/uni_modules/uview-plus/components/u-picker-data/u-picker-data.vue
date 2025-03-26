<template>
	<view class="u-picker-data">
		<view class="u-picker-data__trigger">
			<slot name="trigger"></slot>
			<up-input
				v-if="!$slots['trigger']"
				:modelValue="current"
				disabled
				disabledColor="#ffffff"
				:placeholder="title"
				border="none"
			></up-input>
			<view @click="show = true"
				class="u-picker-data__trigger__cover"></view>
		</view>
		<up-picker
			:show="show"
			:columns="optionsInner"
			:keyName="labelKey"
			@confirm="select"
			@cancel="cancel">
		</up-picker>
	</view>
</template>

<script>
export default {
    props: {
		modelValue: {
			type: [String, Number],
			default: ''
		},
		title: {
			type: String,
			default: ''
		},
		description: {
			type: String,
			default: ''
		},
		options: {
			type: Array,
			default: () => {
				return []
			}
		},
		valueKey: {
			type: String,
			default: 'id'
		},
		labelKey: {
			type: String,
			default: 'name'
		}
    },
    data() {
        return {
			show: false,
			current: '',
        }
    },
    created() {
		if (this.modelValue) {
			this.options.forEach((ele) => {
				if (ele[this.valueKey] == this.modelValue) {
					this.current = ele[this.labelKey]
				}
			})
		}
    },
	watch: {
		modelValue() {
			if (this.modelValue) {
				this.options.forEach((ele) => {
					if (ele[this.valueKey] == this.modelValue) {
						this.current = ele[this.labelKey]
					}
				})
			}
		}
	},
	computed: {
		optionsInner() {
			return [this.options];
		}
	},
    emits: ['update:modelValue'],
    methods: {
        hideKeyboard() {
            uni.hideKeyboard()
        },
		cancel() {
			this.show = false;
		},
        select(e) {
			const {
			    columnIndex,
			    index,
				value,
			} = e;
			this.show = false;
			// console.log(value);
            this.$emit('update:modelValue', value[0][this.valueKey]);
			this.current = value[0][this.labelKey];
        },
    }
}
</script>

<style lang="scss" scoped>
	.u-picker-data {
		&__trigger {
			position: relative;
			&__cover {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
			}
		}
	}
</style>