// Temporary harness: run u-datetime-picker's REAL methods object in Node,
// to inspect what happens to inputValue / innerValue when the bound value is cleared.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const compDir = path.resolve(__dirname, '../src/uni_modules/uview-plus/components/u-datetime-picker')
const src = fs.readFileSync(path.join(compDir, 'u-datetime-picker.vue'), 'utf8')

const dayjsMod = await import('file://' + path.join(compDir, 'dayjs.esm.min.js').replace(/\\/g, '/'))
const dayjs = dayjsMod.default

// helpers copied verbatim from libs/function/index.js
const range = (min = 0, max = 0, value = 0) => Math.max(min, Math.min(max, Number(value)))
const padZero = (value) => `00${value}`.slice(-2)
const error = (err) => { throw new Error('error(): ' + err) }
const test = { date: (v) => !isNaN(new Date(v).getTime()) }
function times(n, iteratee) {
  let index = -1
  const result = Array(n < 0 ? 0 : n)
  while (++index < n) result[index] = iteratee(index)
  return result
}

// Strip //-comments and /* */ blocks (quote-aware) so brace matching isn't fooled by
// commented-out code such as `// if (isDateMode && !test.date(value)) {`.
function stripComments(text) {
  let out = ''
  let q = null
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) {
      out += c
      if (c === '\\') { out += text[++i] ?? ''; continue }
      if (c === q) q = null
      continue
    }
    if (c === '"' || c === "'" || c === '`') { q = c; out += c; continue }
    if (c === '/' && text[i + 1] === '/') {
      const nl = text.indexOf('\n', i)
      i = nl < 0 ? text.length : nl - 1
      continue
    }
    if (c === '/' && text[i + 1] === '*') {
      const close = text.indexOf('*/', i + 2)
      i = close < 0 ? text.length : close + 1
      continue
    }
    out += c
  }
  return out
}

// Extract the real `methods: { ... }` block from the .vue source (brace matching).
function extractBlock(text, key) {
  const start = text.indexOf(key)
  if (start < 0) throw new Error('no ' + key)
  const open = text.indexOf('{', start)
  let depth = 0
  for (let i = open; i < text.length; i++) {
    const c = text[i]
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) return text.slice(open, i + 1)
    }
  }
  throw new Error('unbalanced ' + key)
}

// Line-based uni-app conditional compilation, for the h5 + vue3 target.
const DEFINES = new Set(['VUE3', 'H5', 'WEB'])
function preprocessVue3(code) {
  const stack = []
  const out = []
  for (const line of code.split('\n')) {
    const m = line.match(/^\s*(?:\/\/|\/\*)\s*#(ifdef|ifndef|endif)\s*([A-Z0-9-|| ]*)/)
    if (m) {
      const [, kind, rawFlags] = m
      if (kind === 'endif') stack.pop()
      else {
        const flags = rawFlags.split('||').map((s) => s.trim()).filter(Boolean)
        const hit = flags.some((f) => DEFINES.has(f))
        stack.push(kind === 'ifdef' ? hit : !hit)
      }
      out.push('')
      continue
    }
    out.push(stack.every(Boolean) ? line : '')
  }
  return out.join('\n')
}

const methodsSrc = extractBlock(stripComments(preprocessVue3(src)), 'methods:')
const makeMethods = new Function('dayjs', 'range', 'padZero', 'error', 'test', 'times', `return (${methodsSrc})`)
const methods = makeMethods(dayjs, range, padZero, error, test, times)

export function makeInstance(overrides = {}) {
  const emits = []
  const inst = {
    // props (defaults from datetimePicker.js)
    mode: 'datetime',
    maxDate: new Date(new Date().getFullYear() + 10, 0, 1).getTime(),
    minDate: new Date(new Date().getFullYear() - 10, 0, 1).getTime(),
    minHour: 0, maxHour: 23, minMinute: 0, maxMinute: 59, minSecond: 0, maxSecond: 59,
    filter: null, formatter: null, format: '',
    hasInput: true, pageInline: false,
    modelValue: '',
    // data
    inputValue: '',
    showByClickInput: false,
    columns: [],
    innerDefaultIndex: [],
    innerFormatter: (type, value) => value,
    lastEmitValue: null,
    innerValue: undefined,
    // vue plumbing
    emits,
    $emit(name, payload) { emits.push({ name, payload }) },
    $nextTick(cb) { cb && cb() },
    ...overrides,
  }
  for (const [k, fn] of Object.entries(methods)) inst[k] = fn.bind(inst)
  return inst
}

export { dayjs }
