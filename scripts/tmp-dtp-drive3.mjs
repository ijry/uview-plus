import { connect, wait } from './tmp-cdp.mjs'

const cdp = await connect(9333)
await cdp.navigate('http://localhost:5276/#/pages/tmpRepro/dtp499b')
await cdp.waitFor('window.__dtp2 && document.querySelector("#clearE")')
await wait(400)

const KEYS = ['E', 'F', 'G', 'H', 'I']
const snap = async (label) => {
  const out = await cdp.evaluate(`(() => {
    const inputs = [...document.querySelectorAll('.u-datetime-picker__has-input input')].map(i => i.value);
    return { inputs, st: ${JSON.stringify(KEYS)}.map(k => ({k, ...window.__dtp2.get(k)})), bound: window.__dtp2.read(), evts: window.__dtp2.evts() };
  })()`)
  console.log('\n### ' + label)
  console.log('  DOM inputs (E,F,G,H) :', JSON.stringify(out.inputs))
  for (const s of out.st) console.log(`  ${s.k}: inputValue=${JSON.stringify(s.inputValue)} innerValue=${JSON.stringify(s.innerValue)}`)
  console.log('  bound:', JSON.stringify(out.bound), 'evts:', JSON.stringify(out.evts))
  return out
}

await snap('initial')

for (const k of ['E', 'F', 'H']) {
  await cdp.tapSelector('#clear' + k)
  await wait(400)
}
const s = await snap("after clearing E / F / H to ''")

console.log('\n==== 逐项判定：清空后输入框应为空 ====')
const labels = { E: 'mode=time', F: 'mode=date', H: 'mode=timesecond' }
const idx = { E: 0, F: 1, G: 2, H: 3 }
for (const k of ['E', 'F', 'H']) {
  const shown = s.inputs[idx[k]]
  console.log(`  ${k} (${labels[k]}): 绑定值=${JSON.stringify(s.bound[k])}  输入框显示=${JSON.stringify(shown)}  -> ${shown === '' ? 'OK 已清空' : '**BUG 仍有内容**'}`)
}

// G: clearable 图标是否存在 / 是否被 cover-view 遮住
console.log('\n==== clearable 图标可达性 ====')
console.log(JSON.stringify(await cdp.evaluate(`(() => {
  const g = [...document.querySelectorAll('.u-datetime-picker__has-input')][2];
  const clear = g && g.querySelector('.u-input__content__clear');
  const cover = g && g.querySelector('uni-cover-view, .input-cover');
  const out = { hasClearIcon: !!clear, hasCover: !!cover };
  if (clear) {
    const r = clear.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
    out.clearRect = [r.left|0, r.top|0, r.width|0, r.height|0];
    out.elementOnTop = top ? (top.className || top.tagName) : null;
  }
  if (cover) { const r = cover.getBoundingClientRect(); out.coverRect = [r.left|0, r.top|0, r.width|0, r.height|0]; }
  const input = g && g.querySelector('input');
  if (input) { out.inputReadonly = input.readOnly; out.inputDisabled = input.disabled; }
  return out;
})()`), null, 1))

// 非 hasInput 场景：清空后打开选择器，看 change/confirm 给出什么
console.log('\n==== I：非 hasInput，清空后打开+确认 ====')
await cdp.tapSelector('#clearI')
await wait(300)
await cdp.tapSelector('#openI')
await wait(900)
console.log('  打开后 picker 停在:', JSON.stringify(await cdp.evaluate(`
  (() => {
    const pv = document.querySelector('uni-picker-view');
    if (!pv) return null;
    return [...pv.querySelectorAll('uni-picker-view-column')].map(col => {
      const sel = col.querySelector('.u-picker__view__column__item--selected');
      return sel ? sel.textContent.trim() : null;
    });
  })()`)))
await cdp.tapSelector('.u-toolbar__wrapper__confirm')
await wait(600)
const s2 = await snap('I 确认后')
console.log('  I 绑定值 =', JSON.stringify(s2.bound.I), ' events =', JSON.stringify(s2.evts))

cdp.close()
