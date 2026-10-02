// Minimal zero-dependency CDP driver (Node 22 global WebSocket).
export async function connect(port = 9333, urlMatch = '') {
  const res = await fetch(`http://127.0.0.1:${port}/json/list`)
  const targets = await res.json()
  const page = targets.find((t) => t.type === 'page' && (!urlMatch || (t.url || '').includes(urlMatch)))
  if (!page) throw new Error('no page target; got ' + JSON.stringify(targets.map((t) => [t.type, t.url])))
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j })
  let id = 0
  const pending = new Map()
  const listeners = []
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)
    } else if (msg.method) listeners.forEach((l) => l(msg))
  }
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const myId = ++id
      pending.set(myId, { resolve, reject })
      ws.send(JSON.stringify({ id: myId, method, params }))
    })
  const evaluate = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })
    if (r.exceptionDetails) throw new Error('eval threw: ' + JSON.stringify(r.exceptionDetails.exception?.description || r.exceptionDetails))
    return r.result.value
  }
  const navigate = async (url) => {
    await send('Page.enable')
    const load = () => new Promise((r) => {
      const off = (m) => { if (m.method === 'Page.loadEventFired') { r(); const i = listeners.indexOf(off); if (i >= 0) listeners.splice(i, 1) } }
      listeners.push(off)
    })
    // always go through about:blank so a same-URL (hash-only) navigate still forces a fresh load
    let d = load()
    await send('Page.navigate', { url: 'about:blank' })
    await d
    d = load()
    await send('Page.navigate', { url })
    await d
  }
  const waitFor = async (expr, timeoutMs = 15000) => {
    const t0 = Date.now()
    for (;;) {
      try { if (await evaluate(`!!(${expr})`)) return true } catch {}
      if (Date.now() - t0 > timeoutMs) throw new Error('waitFor timed out: ' + expr)
      await new Promise((r) => setTimeout(r, 150))
    }
  }
  const tapSelector = async (sel) => {
    const box = await evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(sel)});
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    })()`)
    if (!box) throw new Error('no element for ' + sel)
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: box.x, y: box.y, button: 'left', clickCount: 1 })
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.x, y: box.y, button: 'left', clickCount: 1 })
  }
  const wheel = async (sel, deltaY) => {
    const box = await evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(sel)});
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    })()`)
    if (!box) throw new Error('no element for ' + sel)
    await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: box.x, y: box.y, deltaX: 0, deltaY })
  }
  const consoleLogs = []
  await send('Runtime.enable')
  listeners.push((m) => {
    if (m.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push(m.params.args.map((a) => a.value ?? a.description ?? a.type).join(' '))
    }
  })
  return { send, evaluate, navigate, waitFor, tapSelector, wheel, consoleLogs, close: () => ws.close() }
}

export const wait = (ms) => new Promise((r) => setTimeout(r, ms))
