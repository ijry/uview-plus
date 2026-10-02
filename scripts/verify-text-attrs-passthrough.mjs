/**
 * Verification script for issue #603
 * Verifies that u-text component passes through data-* attributes to internal button element
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const textComponentPath = join(__dirname, '../src/uni_modules/uview-plus/components/u-text/u-text.vue')

console.log('Verifying issue #603 fix: u-text data-* attribute pass-through\n')

const content = readFileSync(textComponentPath, 'utf-8')

let pass = true

// Check 1: v-bind="$attrs" on button element
if (!content.includes('v-bind="$attrs"')) {
    console.error('❌ FAIL: v-bind="$attrs" not found on button element')
    pass = false
} else {
    // Verify it's on the button element in the openType block
    const openTypeButtonMatch = content.match(/<template v-else-if="openType && isMp">[\s\S]*?<button[\s\S]*?v-bind="\$attrs"[\s\S]*?>[\s\S]*?<\/button>/m)
    if (!openTypeButtonMatch) {
        console.error('❌ FAIL: v-bind="$attrs" not found on the openType button element')
        pass = false
    } else {
        console.log('✓ v-bind="$attrs" is present on the openType button element')
    }
}

// Check 2: inheritAttrs: false in component options
if (!content.includes('inheritAttrs: false')) {
    console.error('❌ FAIL: inheritAttrs: false not found in component options')
    pass = false
} else {
    // Verify it's in the export default block
    const exportDefaultMatch = content.match(/export default \{[\s\S]*?inheritAttrs: false[\s\S]*?\}/m)
    if (!exportDefaultMatch) {
        console.error('❌ FAIL: inheritAttrs: false not found in export default block')
        pass = false
    } else {
        console.log('✓ inheritAttrs: false is set in component options')
    }
}

// Check 3: Button element still has all required openType attributes
const requiredAttrs = [
    ':openType="openType"',
    '@getuserinfo="onGetUserInfo"',
    '@contact="onContact"',
    '@getphonenumber="onGetPhoneNumber"',
    '@error="onError"',
    '@launchapp="onLaunchApp"',
    '@opensetting="onOpenSetting"',
    ':lang="lang"',
    ':session-from="sessionFrom"',
    ':send-message-title="sendMessageTitle"',
    ':send-message-path="sendMessagePath"',
    ':send-message-img="sendMessageImg"',
    ':show-message-card="showMessageCard"',
    ':app-parameter="appParameter"'
]

for (const attr of requiredAttrs) {
    if (!content.includes(attr)) {
        console.error(`❌ FAIL: Required attribute ${attr} not found`)
        pass = false
    }
}

if (pass) {
    console.log('✓ All required openType attributes are present\n')
}

// Summary
if (pass) {
    console.log('✅ All checks passed!')
    console.log('\nThe fix correctly:')
    console.log('1. Adds v-bind="$attrs" to pass through data-* attributes')
    console.log('2. Sets inheritAttrs: false to prevent auto-binding to root element')
    console.log('3. Preserves all existing openType functionality')
    process.exit(0)
} else {
    console.log('\n❌ Verification failed')
    process.exit(1)
}
