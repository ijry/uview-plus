import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const paginationSource = readFileSync(
    resolve(__dirname, '../src/uni_modules/uview-plus/components/u-pagination/u-pagination.vue'),
    'utf8'
)

assert.doesNotMatch(
    paginationSource,
    /<view>\s*{{\s*currentPage\s*}}\s*<\/view>/,
    'u-pagination must not render a stray currentPage value'
)

assert.match(
    paginationSource,
    /class="u-pagination-total"[\s\S]*{{\s*total\s*}}[\s\S]*条/,
    'u-pagination total layout item should render the total record count'
)

assert.doesNotMatch(
    paginationSource,
    /<!--\s*<picker[\s\S]*<\/picker>\s*-->/,
    'u-pagination page size picker must not be commented out'
)

assert.match(
    paginationSource,
    /<picker[\s\S]*layout\.includes\('sizes'\)[\s\S]*:range="normalizedPageSizes"/,
    'u-pagination sizes layout item should render the normalized page size picker'
)

assert.match(
    paginationSource,
    /normalizedPageSizes\(\)[\s\S]*Number\(size\.value\)[\s\S]*filter\(size => size && !isNaN\(size\.value\)\)/,
    'u-pagination should normalize object and numeric pageSizes before picker use'
)

console.log('pagination component assertions passed')
