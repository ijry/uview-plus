import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const pickerSource = read('src/uni_modules/uview-plus/components/u-picker/u-picker.vue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:picker-column-index'],
    'node scripts/verify-picker-column-index.mjs',
    'expected package.json to expose verify:picker-column-index'
)

function loadPickerOptions() {
    const scriptBlock = pickerSource.match(/<script>([\s\S]*?)<\/script>/)?.[1]
    assert.ok(scriptBlock, 'expected u-picker.vue to contain a script block')
    const executableScript = scriptBlock
        .replace(/^\s*import\s+.*?;\s*$/gm, '')
        .replace(/export default\s*\{/, 'return {')
    return new Function(
        'props',
        'mpMixin',
        'mixin',
        'addUnit',
        'deepClone',
        'sleep',
        'test',
        executableScript
    )({}, {}, {}, value => value, value => JSON.parse(JSON.stringify(value)), () => Promise.resolve(), {
        array: Array.isArray,
        object: value => Object.prototype.toString.call(value) === '[object Object]'
    })
}

// Rebuilds what the component looks like right after `<up-picker :columns="..." />` is mounted:
// data() first, then the immediate watchers in declaration order, exactly like Vue does.
function createPickerInstance(options, propsOverrides = {}) {
    const events = []
    const instance = {
        ...options.data(),
        columns: [],
        defaultIndex: [],
        modelValue: [],
        keyName: 'text',
        valueName: 'value',
        hasInput: false,
        closeOnClickOverlay: false,
        ...propsOverrides,
        events,
        $emit(name, payload) {
            events.push({ name, payload })
        },
        $nextTick(callback) {
            if (callback) callback()
            return Promise.resolve()
        }
    }
    for (const [name, method] of Object.entries(options.methods)) {
        instance[name] = method.bind(instance)
    }
    for (const [key, watcher] of Object.entries(options.watch)) {
        if (watcher.immediate) {
            watcher.handler.call(instance, instance[key], undefined)
        }
    }
    return instance
}

// picker-view always reports every column, see PickerView in @dcloudio/uni-h5:
// `const value = state.value.map(val => val); trigger('change', {}, { value })`
function scrollTo(instance, value) {
    instance.changeHandler({ detail: { value: [...value] } })
    const change = instance.events.filter(event => event.name === 'change').pop()
    assert.ok(change, 'expected changeHandler to emit a change event')
    return change.payload
}

const options = loadPickerOptions()
const columns = [
    ['中国', '美国', '日本'],
    ['北京', '上海', '广州', '深圳'],
    ['朝阳', '海淀', '西城']
]

// issue #773: after the first column has been scrolled, changing any lower column
// still reported columnIndex 0 because lastIndex only tracks the confirmed selection.
{
    const picker = createPickerInstance(options, { columns })

    const first = scrollTo(picker, [2, 0, 0])
    assert.equal(first.columnIndex, 0, 'scrolling the first column must report columnIndex 0')
    assert.equal(first.index, 2, 'scrolling the first column must report its own item index')

    const second = scrollTo(picker, [2, 3, 0])
    assert.equal(second.columnIndex, 1, 'scrolling the second column must report columnIndex 1')
    assert.equal(second.index, 3, 'scrolling the second column must report its own item index')
    assert.deepEqual(
        second.value,
        ['日本', '深圳', '朝阳'],
        'change value must follow the picker-view indexes'
    )

    const third = scrollTo(picker, [2, 3, 1])
    assert.equal(third.columnIndex, 2, 'scrolling the third column must report columnIndex 2')
    assert.equal(third.index, 1, 'scrolling the third column must report its own item index')

    const back = scrollTo(picker, [0, 3, 1])
    assert.equal(back.columnIndex, 0, 'scrolling the first column back must report columnIndex 0')
    assert.equal(back.index, 0, 'scrolling the first column back must report item index 0')
}

// The cascade example (setColumnValues from the change callback) has to keep working.
{
    const picker = createPickerInstance(options, {
        columns: [
            ['中国', '美国'],
            ['深圳', '厦门', '上海', '拉萨']
        ]
    })

    const first = scrollTo(picker, [1, 0])
    assert.equal(first.columnIndex, 0, 'cascade: first column change must report columnIndex 0')
    picker.setColumnValues(1, ['得州', '华盛顿', '纽约', '阿拉斯加'])
    assert.deepEqual(picker.getIndexs(), [1, 0], 'cascade: lower columns must be reset to 0')

    const second = scrollTo(picker, [1, 2])
    assert.equal(second.columnIndex, 1, 'cascade: second column change must report columnIndex 1')
    assert.equal(second.index, 2, 'cascade: second column change must report its own item index')
    assert.deepEqual(second.value, ['美国', '纽约'], 'cascade: change value must use the new column')
}

// Cancelling still restores the last confirmed selection (regression guard for lastIndex).
{
    const picker = createPickerInstance(options, { columns })

    scrollTo(picker, [2, 3, 1])
    picker.cancel()
    assert.deepEqual(
        picker.getIndexs(),
        [0, 0, 0],
        'cancel must restore the default selection when nothing was confirmed yet'
    )

    scrollTo(picker, [1, 2, 0])
    picker.confirm()
    assert.deepEqual(picker.getIndexs(), [1, 2, 0], 'confirm must keep the selected indexes')

    const afterConfirm = scrollTo(picker, [1, 2, 2])
    assert.equal(
        afterConfirm.columnIndex,
        2,
        'a change after confirm must still report the scrolled column'
    )
    picker.cancel()
    assert.deepEqual(picker.getIndexs(), [1, 2, 0], 'cancel must restore the confirmed selection')
}

// The undefined guard added by "fix: 优化picker当前列判断" must stay in place.
{
    const picker = createPickerInstance(options, { columns })
    const change = scrollTo(picker, [undefined, 2, 0])
    assert.equal(change.columnIndex, 1, 'undefined column values must not be treated as a change')
}

assert.match(
    pickerSource,
    /const\s+prevIndex\s*=\s*this\.innerIndex[\s\S]*?item\s*!==\s*undefined\s*&&\s*item\s*!==\s*\(prevIndex\[i\]\s*\|\|\s*0\)/,
    'changeHandler must diff against the previous picker-view indexes, not the confirmed ones'
)

console.log('picker columnIndex assertions passed')
