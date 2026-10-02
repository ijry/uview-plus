// Apply the issue #499 fix with exact byte-level replacement (preserve LF + tabs).
import fs from 'node:fs'
const p = 'src/uni_modules/uview-plus/components/u-datetime-picker/u-datetime-picker.vue'
let s = fs.readFileSync(p, 'utf8')

const edits = [
  // 1) 新增空值判定辅助方法
  {
    from: '\t\t\ttoInt(value, fallback = 0) {\n',
    to:
      '\t\t\t// 是否为“未选择/已清空”的空值。空值必须原样透传，不能被夹取成边界值\n' +
      '\t\t\tisEmptyValue(value) {\n' +
      '\t\t\t\treturn value === \'\' || value === null || value === undefined\n' +
      '\t\t\t},\n' +
      '\t\t\ttoInt(value, fallback = 0) {\n',
  },
  // 2) correctValue 对空值直接返回空串，不再夹取到最小值
  {
    from:
      '\t\t\tcorrectValue(value) {\n' +
      '\t\t\t\tconst isDateMode = ![\'time\', \'timesecond\'].includes(this.mode)\n',
    to:
      '\t\t\tcorrectValue(value) {\n' +
      '\t\t\t\t// 空值代表“未选择/已清空”，直接返回空串。\n' +
      '\t\t\t\t// 否则日期模式会被夹取成minDate、时间模式会被夹取成minHour:minMinute，\n' +
      '\t\t\t\t// 导致外部清空绑定值后输入框仍然显示最小日期/最小时间\n' +
      '\t\t\t\tif (this.isEmptyValue(value)) return \'\'\n' +
      '\t\t\t\tconst isDateMode = ![\'time\', \'timesecond\'].includes(this.mode)\n',
  },
  // 3) 确认时若仍为空值，按各列当前停留位置取值，保证“所见即所得”
  {
    from:
      '\t\t\tconfirm() {\n' +
      '\t\t\t\t// #ifdef VUE3\n',
    to:
      '\t\t\tconfirm() {\n' +
      '\t\t\t\t// 值为空(从未选择或被外部清空)时，用户看到的是各列当前停留的位置，\n' +
      '\t\t\t\t// 直接上抛空值会“所见非所得”，故先按各列当前显示值取一次真实值\n' +
      '\t\t\t\tif (this.isEmptyValue(this.innerValue)) {\n' +
      '\t\t\t\t\tthis.change({\n' +
      '\t\t\t\t\t\tindexs: this.innerDefaultIndex,\n' +
      '\t\t\t\t\t\tvalues: this.columns\n' +
      '\t\t\t\t\t})\n' +
      '\t\t\t\t}\n' +
      '\t\t\t\t// #ifdef VUE3\n',
  },
]

for (const { from, to } of edits) {
  const n = s.split(from).length - 1
  if (n !== 1) throw new Error(`expected 1 match, got ${n} for:\n${from}`)
  s = s.replace(from, to)
}
fs.writeFileSync(p, s)
console.log('ok, CRLF count =', (s.match(/\r\n/g) || []).length)
