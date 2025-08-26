<template>
	<view class="u-picker-data">
		<view class="u-picker-data__trigger">
			<slot name="trigger" :current="current"></slot>
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
			:defaultIndex="defaultIndex"
			@confirm="confirm"
			@cancel="cancel"
			@close="close">
		</up-picker>
	</view>
</template>

<script>
export default {
	name: 'u-picker-data',
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
			defaultIndex: [],
        }
    },
    created() {
		if (this.modelValue) {
			this.options.forEach((ele, index) => {
				if (ele[this.valueKey] == this.modelValue) {
					this.current = ele[this.labelKey]
					this.defaultIndex = [index]
				}
			})
		}
    },
	watch: {
		modelValue() {
			if (this.modelValue) {
				this.options.forEach((ele, index) => {
					if (ele[this.valueKey] == this.modelValue) {
						this.current = ele[this.labelKey]
						this.defaultIndex = [index]
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
    emits: ['update:modelValue', 'cancel', 'close', 'confirm'],
    methods: {
        hideKeyboard() {
            uni.hideKeyboard()
        },
		cancel() {
			this.show = false;
			this.$emit('cancel')
		},
		close() {
			this.$emit('close')
		},
        confirm(e) {
			const {
			    columnIndex,
			    index,
				value,
			} = e;
			this.show = false;
			// console.log(value);
            this.$emit('update:modelValue', value[0][this.valueKey]);
			this.defaultIndex = columnIndex;
			this.current = value[0][this.labelKey];
			this.$emit('confirm')
        }
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
				z-index:10;
			}
		}
	}
</style>
