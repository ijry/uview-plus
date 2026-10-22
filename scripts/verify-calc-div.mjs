import assert from 'node:assert/strict'
const { div } = await import('../src/uni_modules/uview-plus/libs/function/calc.js')
const { divide } = await import('../src/uni_modules/uview-plus/libs/function/digit.js')
assert.equal(div(2, 4), 0.5, 'calc.div(2,4) should return 0.5')
assert.equal(div(0.3, 0.1), 3, 'calc.div(0.3,0.1) should return 3')
assert.equal(div(3.9, 1.3), 3, 'calc.div(3.9,1.3) should return 3')
assert.equal(div(2, 4), divide(2, 4), 'calc.div should match digit.divide')
console.log('verify:calc-div ok')

