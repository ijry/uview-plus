import { connect, wait } from './tmp-cdp.mjs'

const cdp = await connect(9333)
await cdp.navigate('http://localhost:5276/#/pages/tmpRepro/dtp499')
await wait(2500)

const snap = async (label) => {
  const out = await cdp.evaluate(`(() => {
    const inputs = [...document.querySelectorAll('.u-datetime-picker__has-input input')].map(i => i.value);
    const dbg = ['dbgA','dbgB','dbgC','dbgD'].map(id => (document.getElementById(id)||{}).textContent);
    const st = window.__dtp ? ['A','B','C','D'].map(k => ({k, ...window.__dtp.get(k)})) : null;
    return { inputs, dbg, st };
  })()`)
  console.log('\n### ' + label)
  console.log('  input values :', JSON.stringify(out.inputs))
  console.log('  bound values :', JSON.stringify(out.dbg))
  for (const s of out.st || []) {
    console.log(`  ${s.k}: inputValue=${JSON.stringify(s.inputValue)} innerValue=${JSON.stringify(s.innerValue)} defaultIndex=${JSON.stringify(s.defaultIndex)} cols=${JSON.stringify(s.cols)}`)
  }
  return out
}

console.log('page ready?', await cdp.evaluate('!!window.__dtp'))
await snap('initial')

// A: parent clears to ''
await cdp.tapSelector('#clearA')
await wait(400)
await snap("after tapping 清空 A (valA = '')")

// D: parent clears to null
await cdp.tapSelector('#clearD')
await wait(400)
await snap('after tapping 清空 D (valD = null)')

// Is the u-input clear icon (C) reachable at all?
const clearIcon = await cdp.evaluate(`(() => {
  const cs = [...document.querySelectorAll('.u-input__content__clear')];
  return cs.map(c => {
    const r = c.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
    return { rect: [r.left|0, r.top|0, r.width|0, r.height|0], topEl: top ? (top.className || top.tagName) : null };
  });
})()`)
console.log('\n### u-input clear icons present:', JSON.stringify(clearIcon, null, 1))

console.log('\nconsole:', cdp.consoleLogs.slice(-15))
cdp.close()
