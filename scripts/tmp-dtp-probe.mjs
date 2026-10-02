import { makeInstance, dayjs } from './tmp-dtp-harness.mjs'

const minDate = new Date(new Date().getFullYear() - 10, 0, 1).getTime()
const fmt = (v) => (v === '' ? "''" : v === null ? 'null' : v === undefined ? 'undefined' : `${v} (${dayjs(v).isValid() ? dayjs(v).format('YYYY-MM-DD HH:mm') : 'invalid'})`)

console.log('minDate =', minDate, dayjs(minDate).format('YYYY-MM-DD HH:mm'))
console.log('')

console.log('--- raw dayjs probes ---')
for (const v of ['', null, undefined, 0]) {
  console.log(`dayjs.unix(${JSON.stringify(v)}).isValid() =`, dayjs.unix(v).isValid(),
              ` dayjs(${JSON.stringify(v)}).isValid() =`, dayjs(v).isValid())
}
console.log('')

console.log('--- correctValue() per mode, for "cleared" inputs ---')
for (const mode of ['datetime', 'date', 'year-month', 'time']) {
  for (const v of ['', null, undefined]) {
    const inst = makeInstance({ mode })
    let out
    try { out = inst.correctValue(v) } catch (e) { out = 'THREW: ' + e.message }
    console.log(`mode=${mode.padEnd(10)} correctValue(${JSON.stringify(v)}) -> ${fmt(out)}`)
  }
}
console.log('')

console.log('--- full "clear from parent" flow: init() with modelValue cleared ---')
for (const mode of ['datetime', 'date', 'year-month']) {
  for (const v of ['', null, undefined]) {
    const inst = makeInstance({ mode, modelValue: v })
    inst.init()
    console.log(`mode=${mode.padEnd(10)} modelValue=${JSON.stringify(v)}`.padEnd(42),
      `-> innerValue=${fmt(inst.innerValue)}  inputValue=${JSON.stringify(inst.inputValue)}`)
  }
}
console.log('')

console.log('--- and: had a value, then parent clears it ---')
const had = new Date(2024, 3, 28, 10, 33).getTime()
for (const v of ['', null, undefined]) {
  const inst = makeInstance({ mode: 'datetime', modelValue: had })
  inst.init()
  const before = inst.inputValue
  inst.modelValue = v
  inst.init() // what the modelValue watcher does
  console.log(`clear with ${JSON.stringify(v)}`.padEnd(22),
    `inputValue: ${JSON.stringify(before)} -> ${JSON.stringify(inst.inputValue)}   innerValue=${fmt(inst.innerValue)}`)
}
