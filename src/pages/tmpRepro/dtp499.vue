<template>
	<view class="wrap">
		<view class="row">
			<text class="label">A. 有值后清空为 ''</text>
			<up-datetime-picker
				ref="pA"
				hasInput
				placeholder="请选择日期"
				mode="datetime"
				v-model="valA"
				:inputProps="{ border: 'surround', shape: 'square' }"
				@change="onEvt('A:change', $event)"
				@confirm="onEvt('A:confirm', $event)"
			></up-datetime-picker>
			<view class="btn" id="clearA" @click="valA = ''">清空 A</view>
			<text class="dbg" id="dbgA">A={{ String(valA) }}</text>
		</view>

		<view class="row">
			<text class="label">B. 初始就是空值</text>
			<up-datetime-picker
				ref="pB"
				hasInput
				placeholder="请选择日期"
				mode="date"
				v-model="valB"
			></up-datetime-picker>
			<text class="dbg" id="dbgB">B={{ String(valB) }}</text>
		</view>

		<view class="row">
			<text class="label">C. inputProps clearable</text>
			<up-datetime-picker
				ref="pC"
				hasInput
				placeholder="请选择日期"
				mode="datetime"
				v-model="valC"
				:inputProps="{ clearable: true }"
			></up-datetime-picker>
			<text class="dbg" id="dbgC">C={{ String(valC) }}</text>
		</view>

		<view class="row">
			<text class="label">D. 清空为 null</text>
			<up-datetime-picker
				ref="pD"
				hasInput
				placeholder="请选择日期"
				mode="datetime"
				v-model="valD"
			></up-datetime-picker>
			<view class="btn" id="clearD" @click="valD = null">清空 D</view>
			<text class="dbg" id="dbgD">D={{ String(valD) }}</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			valA: 1714266792000,
			valB: '',
			valC: 1714266792000,
			valD: 1714266792000,
			evts: []
		}
	},
	methods: {
		onEvt(name, e) {
			this.evts.push(name + ' -> ' + JSON.stringify(e && e.value !== undefined ? e.value : e))
		}
	},
	mounted() {
		// 供 CDP 读取内部状态
		window.__dtp = {
			get: (k) => {
				const c = this.$refs['p' + k]
				return c ? { inputValue: c.inputValue, innerValue: c.innerValue, defaultIndex: c.innerDefaultIndex, cols: c.columns.map(x => x.length), open: c.showByClickInput } : null
			},
			set: (k, v) => { this['val' + k] = v },
			read: () => ({ A: this.valA, B: this.valB, C: this.valC, D: this.valD }),
			evts: () => this.evts.slice(),
			clearEvts: () => { this.evts = [] }
		}
	}
}
</script>

<style lang="scss">
.wrap { padding: 12px; }
.row { margin-bottom: 24px; }
.label { font-size: 13px; color: #666; }
.btn { margin-top: 6px; background: #3c9cff; color: #fff; padding: 6px 10px; border-radius: 4px; font-size: 13px; width: 90px; text-align: center; }
.dbg { font-size: 12px; color: #f56c6c; }
</style>
