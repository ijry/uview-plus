import { connect, wait } from './tmp-cdp.mjs'

const cdp = await connect(9333)
await cdp.navigate('http://localhost:5276/#/pages/tmpRepro/dtp499')
await cdp.waitFor('window.__dtp && document.querySelector("#clearA")')
await wait(300)

const snap = async (label, keys = ['A']) => {
  const out = await cdp.evaluate(`(() => {
    const inputs = [...document.querySelectorAll('.u-datetime-picker__has-input input')].map(i => i.value);
    const st = ${JSON.stringify(keys)}.map(k => ({k, ...window.__dtp.get(k)}));
    return { inputs, st, bound: window.__dtp.read(), evts: window.__dtp.evts() };
  })()`)
  console.log('\n### ' + label)
  console.log('  DOM input values :', JSON.stringify(out.inputs))
  console.log('  bound (v-model)  :', JSON.stringify(out.bound))
  for (const s of out.st) {
    console.log(`  ${s.k}: inputValue=${JSON.stringify(s.inputValue)} innerValue=${JSON.stringify(s.innerValue)} open=${s.open} defaultIndex=${JSON.stringify(s.defaultIndex)}`)
  }
  console.log('  events           :', JSON.stringify(out.evts))
  return out
}

const fmt = (t) => (typeof t === 'number' ? new Date(t).toLocaleString('sv') : String(t))
const minDate = await cdp.evaluate('new Date(new Date().getFullYear() - 10, 0, 1).getTime()')
console.log('minDate =', minDate, fmt(minDate))

await snap('1) initial (A = 2024-04-28 09:13)')

console.log('\n>>> 用户「手动清空」：把绑定值设为 \'\'')
await cdp.tapSelector('#clearA')
await wait(400)
await snap("2) after clear -> ''")

console.log('\n>>> 用户再次点击输入框，打开选择器（不滚动）')
await cdp.tapSelector('.u-datetime-picker__has-input')
await wait(900)
const s3 = await snap('3) picker opened, nothing scrolled')
console.log('  ==> picker 视觉停在:', JSON.stringify(await cdp.evaluate(`
  (() => {
    const pv = document.querySelector('uni-picker-view');
    if (!pv) return null;
    return [...pv.querySelectorAll('uni-picker-view-column')].map(col => {
      const items = [...col.querySelectorAll('.u-picker__view__column__item')];
      const mid = col.getBoundingClientRect().top + col.getBoundingClientRect().height/2;
      let best = null, bd = 1e9;
      for (const it of items) { const r = it.getBoundingClientRect(); const d = Math.abs((r.top+r.height/2) - mid); if (d < bd) { bd = d; best = it.textContent.trim(); } }
      return best;
    });
  })()`)))

console.log('\n>>> 点击「确认」')
await cdp.tapSelector('.u-toolbar__wrapper__confirm')
await wait(700)
const s4 = await snap('4) after 确认')

console.log('\n==================== 结论 ====================')
console.log('清空后 v-model =', JSON.stringify(s4.bound.A), '  input 显示 =', JSON.stringify(s4.inputs[0]))
console.log('minDate 格式化 =', fmt(minDate))

cdp.close()
