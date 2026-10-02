#!/usr/bin/env node

/**
 * Verification script for issue #857
 * "textarea 按回车无效。按住回车直接失去焦点了"
 *
 * u-textarea 曾把 confirmType 的默认值设为 'done'，而 uni-app 原生 textarea 的
 * 默认值是 'return'。uni-app 运行时对 'done'/'go'/'next'/'search'/'send' 的处理是：
 *   onKeyDownEnter -> event.preventDefault()          // 回车不再插入换行
 *   onKeyUpEnter   -> confirm() + textarea.blur()     // 回车抬起时失去焦点
 * 于是默认情况下回车既不换行也会掉焦点。本脚本校验默认值已回归 'return'，
 * 并模拟上述回车处理链验证行为。
 */

import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const componentDir = join(projectRoot, 'src/uni_modules/uview-plus/components/u-textarea');

console.log('Verifying u-textarea confirm-type default (issue #857)...\n');

const issues = [];
const pass = (msg) => console.log('✓ ' + msg);
const fail = (msg) => issues.push('❌ ' + msg);

const defaults = readFileSync(join(componentDir, 'textarea.js'), 'utf-8');
const props = readFileSync(join(componentDir, 'props.js'), 'utf-8');
const component = readFileSync(join(componentDir, 'u-textarea.vue'), 'utf-8');

// Check 1: 默认 confirmType 必须是 uni-app 原生默认值 return
const defaultConfirmType = defaults.match(/confirmType:\s*'([^']*)'/)?.[1];
if (defaultConfirmType !== 'return') {
  fail(`textarea.js 中 confirmType 默认值应为 'return'，实际为 ${JSON.stringify(defaultConfirmType)}`);
} else {
  pass("confirmType 默认值为 'return'（与 uni-app 原生 textarea 一致）");
}

// Check 2: 暴露 confirmHold，便于显式使用非 return 时保留键盘
if (!/confirmHold:\s*false/.test(defaults)) {
  fail('textarea.js 缺少 confirmHold 默认值');
} else if (!/confirmHold:\s*\{[\s\S]*?defProps\.textarea\.confirmHold/.test(props)) {
  fail('props.js 未声明 confirmHold prop');
} else {
  pass('confirmHold prop 已声明并取默认配置');
}

// Check 3: 模板把两个属性都透传给原生 textarea
if (!/:confirm-type="confirmType"/.test(component)) {
  fail('u-textarea.vue 未透传 confirm-type');
} else if (!/:confirm-hold="confirmHold"/.test(component)) {
  fail('u-textarea.vue 未透传 confirm-hold');
} else {
  pass('confirm-type / confirm-hold 均已透传给原生 textarea');
}

// Check 4: 注释与类型声明不再宣称默认 'done'
if (/confirmType[\s\S]{0,200}?默认 'done'/.test(component)) {
  fail("u-textarea.vue 注释仍写着 confirmType 默认 'done'");
} else {
  pass('组件注释已同步默认值');
}

// Check 5: 按 uni-app 的回车处理链模拟真实行为
// uni-h5 dist: const ConfirmTypes = ["done", "go", "next", "search", "send"];
const UNI_CONFIRM_TYPES = ['done', 'go', 'next', 'search', 'send'];
function pressEnter({ confirmType, confirmHold = false }) {
  const isDone = UNI_CONFIRM_TYPES.includes(confirmType); // isDone computed
  const el = { text: '', focused: true, blur() { this.focused = false; } };
  // onKeyDownEnter：isDone 时 preventDefault，浏览器不再插入换行
  const defaultPrevented = isDone;
  if (!defaultPrevented) el.text += '\n';
  // onKeyUpEnter：isDone 时触发 confirm，未设置 confirmHold 则 blur
  let confirmFired = false;
  if (isDone) {
    confirmFired = true;
    if (!confirmHold) el.blur();
  }
  return { newline: el.text.includes('\n'), focused: el.focused, confirmFired };
}

const withDefault = pressEnter({ confirmType: defaultConfirmType });
if (!withDefault.newline || !withDefault.focused) {
  fail(
    `默认配置下回车行为仍然异常：换行=${withDefault.newline}，保持焦点=${withDefault.focused}`
  );
} else {
  pass('默认配置下回车换行且不失去焦点');
}

const explicitDone = pressEnter({ confirmType: 'done' });
if (!explicitDone.confirmFired || explicitDone.focused) {
  fail('显式设置 confirmType="done" 时应触发 confirm 并收起键盘');
} else {
  pass('显式 confirmType="done" 仍触发 confirm 并收起键盘');
}

const doneWithHold = pressEnter({ confirmType: 'done', confirmHold: true });
if (!doneWithHold.confirmFired || !doneWithHold.focused) {
  fail('confirmType="done" + confirmHold 应触发 confirm 且保持焦点');
} else {
  pass('confirmHold 可阻止回车后收起键盘');
}

// Check 6: 若已安装 uni-app 运行时，顺带校验上游常量没有变化
const uniH5 = join(projectRoot, 'node_modules/@dcloudio/uni-h5/dist/uni-h5.es.js');
if (existsSync(uniH5)) {
  const runtime = readFileSync(uniH5, 'utf-8');
  const upstreamTypes = runtime.match(/const ConfirmTypes = \[([^\]]*)\]/)?.[1] ?? '';
  const upstreamList = [...upstreamTypes.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  const nativeDefault = /confirmType:\s*\{\s*type:\s*String,\s*default:\s*"return"/.test(runtime);
  if (upstreamList.join(',') !== UNI_CONFIRM_TYPES.join(',')) {
    fail(`uni-app ConfirmTypes 已变化：${upstreamList.join(',')}`);
  } else if (!nativeDefault) {
    fail('uni-app textarea 原生 confirm-type 默认值不再是 "return"');
  } else {
    pass('uni-app 运行时常量与本脚本假设一致');
  }
} else {
  console.log('· 未安装 @dcloudio/uni-h5，跳过上游常量校验');
}

console.log('');

if (issues.length === 0) {
  console.log('✅ All checks passed - issue #857 is fixed');
  process.exit(0);
} else {
  console.log('❌ Verification failed:\n');
  issues.forEach((issue) => console.log('  ' + issue));
  process.exit(1);
}
