#!/usr/bin/env node

/**
 * Verification script for issue #652
 * test.carNo() 以前在 value 为 null/undefined 时读取 value.length 直接抛 TypeError，
 * 该异常在 async-validator 的 Promise executor 里被静默吞掉，导致 u-form 的校验回调
 * 永不触发（表现为"校验不返回"、validate() 的 Promise 永不 settle）。
 * 本脚本验证：空值返回 false 而不抛异常，且整条 async-validator 链路能正常返回。
 */

import test, { carNo } from '../src/uni_modules/uview-plus/libs/function/test.js';
import Schema from '../src/uni_modules/uview-plus/libs/util/async-validator.js';

console.log('Verifying test.carNo() nullish handling (issue #652)...\n');

const issues = [];

function check(label, actual, expected) {
    if (actual === expected) {
        console.log(`✓ ${label} => ${String(actual)}`);
    } else {
        issues.push(`❌ ${label} 期望 ${String(expected)}，实际 ${String(actual)}`);
    }
}

function call(value) {
    try {
        return carNo(value);
    } catch (e) {
        return `THROW:${e.constructor.name}`;
    }
}

// 1) 空值不再抛异常，返回false
console.log('1) 空值');
for (const value of [null, undefined, '', 0, false, NaN]) {
    check(`carNo(${String(value)})`, call(value), false);
}

// 2) 合法车牌未受影响
console.log('\n2) 合法车牌');
for (const value of ['京A12345', '沪A12345', '粤B1234A', '浙BH1234', '使A12345']) {
    check(`carNo('${value}') 旧车牌`, call(value), true);
}
for (const value of ['京AD12345', '沪AF12345', '京A12345D', '沪A54321F']) {
    check(`carNo('${value}') 新能源车牌`, call(value), true);
}

// 3) 非法车牌仍然返回false
console.log('\n3) 非法车牌');
for (const value of ['京A1234', '京A123456', '京AI2345', '京AO2345', 'abcdefg', '京AD1234I']) {
    check(`carNo('${value}')`, call(value), false);
}

// 4) 非字符串入参不抛异常
console.log('\n4) 非字符串入参');
for (const value of [1234567, 12345678, {}, [], ['京', 'A', '1', '2', '3', '4', '5']]) {
    check(`carNo(${JSON.stringify(value)})`, call(value), false);
}

// 5) u-form 实际链路：字段默认为null时校验必须有返回
console.log('\n5) async-validator 链路（u-form 使用的校验器）');
const cases = [
    ['null', null, 1],
    ['undefined', undefined, 1],
    ['非法车牌', '京A1234', 1],
    ['合法车牌', '京A12345', 0],
];
let pending = cases.length;
for (const [label, value, expectedErrors] of cases) {
    const rule = { validator: (r, v) => test.carNo(v), message: '车牌号不正确' };
    let called = false;
    try {
        new Schema({ carNo: rule }).validate({ carNo: value }, (errors) => {
            called = true;
            const count = Array.isArray(errors) ? errors.length : 0;
            if (count === expectedErrors) {
                console.log(`✓ 字段值为${label}：回调触发，errors=${count}`);
            } else {
                issues.push(`❌ 字段值为${label}：期望 ${expectedErrors} 条错误，实际 ${count} 条`);
            }
        });
    } catch (e) {
        issues.push(`❌ 字段值为${label}：validate() 同步抛出 ${e.constructor.name}: ${e.message}`);
    }
    // 校验器是同步的，回调应在validate()返回前已经触发
    if (!called) {
        issues.push(`❌ 字段值为${label}：校验回调未触发（校验不返回）`);
    }
    pending -= 1;
}

console.log('');

if (issues.length === 0 && pending === 0) {
    console.log('✅ All checks passed - issue #652 is fixed');
    console.log('\ntest.carNo() 对空值返回false而不再抛异常，u-form 校验链路可以正常返回。');
    process.exit(0);
} else {
    console.log('❌ Verification failed:\n');
    issues.forEach((issue) => console.log('  ' + issue));
    process.exit(1);
}
