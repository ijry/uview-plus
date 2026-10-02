<template>
	<view class="wrap">
		<view class="row">
			<text class="label">E. mode=time，清空为 ''</text>
			<up-datetime-picker
				ref="pE"
				hasInput
				placeholder="请选择时间"
				mode="time"
				v-model="valE"
			></up-datetime-picker>
			<view class="btn" id="clearE" @click="valE = ''">清空 E</view>
			<text class="dbg">E={{ String(valE) }}</text>
		</view>

		<view class="row">
			<text class="label">F. mode=date，清空为 ''</text>
			<up-datetime-picker
				ref="pF"
				hasInput
				placeholder="请选择日期"
				mode="date"
				v-model="valF"
			></up-datetime-picker>
			<view class="btn" id="clearF" @click="valF = ''">清空 F</view>
			<text class="dbg">F={{ String(valF) }}</text>
		</view>

		<view class="row">
			<text class="label">G. clearable 能否点到</text>
			<up-datetime-picker
				ref="pG"
				hasInput
				placeholder="请选择日期"
				mode="datetime"
				v-model="valG"
				:inputProps="{ clearable: true }"
			></up-datetime-picker>
			<text class="dbg">G={{ String(valG) }}</text>
		</view>

		<view class="row">
			<text class="label">H. mode=timesecond，清空为 ''</text>
			<up-datetime-picker
				ref="pH"
				hasInput
				placeholder="请选择时间"
				mode="timesecond"
				v-model="valH"
			></up-datetime-picker>
			<view class="btn" id="clearH" @click="valH = ''">清空 H</view>
			<text class="dbg">H={{ String(valH) }}</text>
		</view>

		<view class="row">
			<text class="label">I. 非 hasInput，show 控制，清空为 ''</text>
			<view class="btn" id="openI" @click="showI = true">打开 I</view>
			<view class="btn" id="clearI" @click="valI = ''">清空 I</view>
			<text class="dbg">I={{ String(valI) }}</text>
			<up-datetime-picker
				ref="pI"
				:show="showI"
				mode="datetime"
				v-model="valI"
				closeOnClickOverlay
				@close="showI = false"
				@cancel="showI = false"
				@confirm="showI = false; onEvt('I:confirm', $event)"
				@change="onEvt('I:change', $event)"
			></up-datetime-picker>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			valE: '05:28',
			valF: 1714266792000,
			valG: 1714266792000,
			valH: '05:28:30',
			valI: 1714266792000,
			showI: false,
			evts: []
		}
	},
	methods: {
		onEvt(name, e) {
			this.evts.push(name + ' -> ' + JSON.stringify(e && e.value !== undefined ? e.value : e))
		}
	},
	mounted() {
		window.__dtp2 = {
			get: (k) => {
				const c = this.$refs['p' + k]
				return c ? { inputValue: c.inputValue, innerValue: c.innerValue, open: c.showByClickInput, defaultIndex: c.innerDefaultIndex } : null
			},
			set: (k, v) => { this['val' + k] = v },
			read: () => ({ E: this.valE, F: this.valF, G: this.valG, H: this.valH, I: this.valI }),
			evts: () => this.evts.slice()
		}
	}
}
</script>

<style lang="scss">
.wrap { padding: 12px; }
.row { margin-bottom: 20px; }
.label { font-size: 13px; color: #666; }
.btn { margin-top: 6px; background: #3c9cff; color: #fff; padding: 6px 10px; border-radius: 4px; font-size: 13px; width: 90px; text-align: center; }
.dbg { font-size: 12px; color: #f56c6c; }
</style>
