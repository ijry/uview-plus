import { connect, wait } from './tmp-cdp.mjs'
const cdp = await connect(9333)
await cdp.navigate('http://localhost:5276/#/pages/tmpRepro/dtp499')
await cdp.waitFor('window.__dtp && document.querySelector("#clearA")')
await wait(300)
await cdp.tapSelector('#clearA')
await wait(300)
await cdp.tapSelector('.u-datetime-picker__has-input')
await wait(1200)
const html = await cdp.evaluate(`(() => {
  const p = document.querySelector('.u-picker');
  if (!p) return 'NO .u-picker';
  return p.outerHTML.slice(0, 6000);
})()`)
console.log(html)
console.log('\n--- classes containing confirm/cancel ---')
console.log(await cdp.evaluate(`[...document.querySelectorAll('[class*=confirm], [class*=cancel]')].map(e => e.className + ' | ' + e.textContent.trim().slice(0,20))`))
cdp.close()
